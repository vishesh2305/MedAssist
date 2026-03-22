"""Translation and chat-assist router."""

from __future__ import annotations

import logging
from fastapi import APIRouter, HTTPException
from openai import OpenAI, OpenAIError

from src.config import settings
from src.models.schemas import (
    TranslationRequest,
    TranslationResponse,
    ChatAssistRequest,
    ChatAssistResponse,
)
from src.utils.medical_data import MEDICAL_PHRASES, SUPPORTED_LANGUAGES
from src.utils.translation_cache import translation_cache

logger = logging.getLogger(__name__)
router = APIRouter()


def _openai_client() -> OpenAI | None:
    if settings.OPENAI_API_KEY:
        return OpenAI(api_key=settings.OPENAI_API_KEY)
    return None


def _dictionary_translate(text: str, target_language: str) -> str | None:
    """Attempt a dictionary-based translation for common medical phrases."""
    text_lower = text.strip().lower()
    target_lower = target_language.strip().lower()
    for phrase, translations in MEDICAL_PHRASES.items():
        if text_lower == phrase.lower():
            return translations.get(target_lower)
    # Partial / fuzzy match: check if the phrase starts similarly
    for phrase, translations in MEDICAL_PHRASES.items():
        if phrase.lower().startswith(text_lower) or text_lower.startswith(phrase.lower()):
            return translations.get(target_lower)
    return None


@router.post(
    "/translate",
    response_model=TranslationResponse,
    summary="Translate text between languages",
    description="Uses OpenAI for translation with a dictionary fallback for common medical phrases.",
)
async def translate_text(request: TranslationRequest) -> TranslationResponse:
    src = request.source_language.lower().strip()
    tgt = request.target_language.lower().strip()

    if tgt not in SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Target language '{tgt}' not supported. Supported: {SUPPORTED_LANGUAGES}",
        )

    # Check cache first
    cached = translation_cache.get(request.text, src, tgt)
    if cached:
        return TranslationResponse(
            translated_text=cached,
            source_language=src,
            target_language=tgt,
            method="cache",
            confidence=0.95,
        )

    # Try OpenAI
    client = _openai_client()
    if client:
        try:
            response = client.chat.completions.create(
                model=settings.OPENAI_MODEL,
                messages=[
                    {
                        "role": "system",
                        "content": (
                            "You are a professional medical translator. "
                            "Translate the following text accurately, preserving medical terminology. "
                            "Return ONLY the translated text, nothing else."
                        ),
                    },
                    {
                        "role": "user",
                        "content": (
                            f"Translate from {src} to {tgt}:\n\n{request.text}"
                        ),
                    },
                ],
                temperature=0.2,
                max_tokens=1024,
            )
            translated = response.choices[0].message.content.strip()
            translation_cache.set(request.text, src, tgt, translated)
            return TranslationResponse(
                translated_text=translated,
                source_language=src,
                target_language=tgt,
                method="openai",
                confidence=0.9,
            )
        except OpenAIError as exc:
            logger.warning(f"OpenAI translation failed: {exc}. Falling back to dictionary.")

    # Dictionary fallback
    dict_result = _dictionary_translate(request.text, tgt)
    if dict_result:
        translation_cache.set(request.text, src, tgt, dict_result)
        return TranslationResponse(
            translated_text=dict_result,
            source_language=src,
            target_language=tgt,
            method="dictionary_fallback",
            confidence=0.75,
        )

    raise HTTPException(
        status_code=503,
        detail=(
            "Translation unavailable. OpenAI API key not configured and no dictionary match found. "
            "Please set OPENAI_API_KEY or use a common medical phrase."
        ),
    )


@router.post(
    "/chat-assist",
    response_model=ChatAssistResponse,
    summary="AI medical chatbot assistant",
    description="General medical Q&A chatbot with safety disclaimers. NOT a substitute for professional advice.",
)
async def chat_assist(request: ChatAssistRequest) -> ChatAssistResponse:
    client = _openai_client()

    if not client:
        # Fallback static response when no API key
        return ChatAssistResponse(
            reply=(
                "I'm sorry, the AI chat assistant is currently unavailable because the OpenAI API is not configured. "
                "For medical emergencies, please call your local emergency number immediately. "
                "For non-emergency medical questions, please consult a qualified healthcare professional."
            ),
            suggestions=[
                "Try the symptom checker at /api/ai/symptoms",
                "Use the translation service for medical phrases at /api/ai/translate",
                "Find nearby hospitals using the hospital ranker at /api/ai/rank-hospitals",
            ],
        )

    system_prompt = (
        "You are MedAssist, a helpful AI medical assistant for tourists and travelers. "
        "You provide general health information and guidance. "
        "IMPORTANT RULES:\n"
        "1. ALWAYS include a disclaimer that you are NOT a doctor and your advice is NOT a substitute for professional medical care.\n"
        "2. For ANY symptom that could indicate a serious condition, advise the user to seek immediate medical attention.\n"
        "3. NEVER provide specific medication dosages or prescriptions.\n"
        "4. When in doubt, always err on the side of caution and recommend seeing a doctor.\n"
        "5. Provide practical advice for travelers (e.g., staying hydrated, finding local medical facilities).\n"
        f"6. Respond in {request.language}."
    )

    messages = [{"role": "system", "content": system_prompt}]
    for entry in request.conversation_history[-10:]:  # last 10 messages
        role = entry.get("role", "user")
        content = entry.get("content", "")
        if role in ("user", "assistant") and content:
            messages.append({"role": role, "content": content})
    messages.append({"role": "user", "content": request.message})

    try:
        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            temperature=0.7,
            max_tokens=1024,
        )
        reply = response.choices[0].message.content.strip()

        suggestions = [
            "Would you like me to check your symptoms?",
            "Do you need help finding a nearby hospital?",
            "Would you like to translate a medical phrase?",
        ]

        return ChatAssistResponse(reply=reply, suggestions=suggestions)
    except OpenAIError as exc:
        raise HTTPException(status_code=503, detail=f"Chat service error: {str(exc)}")
