"""AI Health Companion router - POST /api/ai/health-chat.

A conversational AI health assistant for travelers. Provides rule-based
fallback responses when no OpenAI API key is configured, covering water
safety, food safety, vaccinations, common travel health issues, finding
doctors, first aid, ER-vs-clinic guidance, and medication advice.
"""

from __future__ import annotations

import logging
import re
from typing import Any, Optional

from fastapi import APIRouter, HTTPException
from openai import OpenAI, OpenAIError
from pydantic import BaseModel, Field

from src.config import settings
from src.utils.health_knowledge import (
    WATER_SAFETY,
    FOOD_SAFETY_TIPS,
    VACCINATION_INFO,
    TRAVEL_HEALTH_TOPICS,
    FIND_DOCTOR_ADVICE,
    FIRST_AID,
    ER_VS_CLINIC,
    MEDICATION_ADVICE,
    EMERGENCY_NUMBERS,
    MEDICAL_DISCLAIMER,
)

logger = logging.getLogger(__name__)
router = APIRouter()


# ---------------------------------------------------------------------------
# Request / Response models
# ---------------------------------------------------------------------------

class HealthChatContext(BaseModel):
    location: Optional[str] = Field(None, description="User's current location / destination")
    userAge: Optional[int] = Field(None, ge=0, le=150, description="User age for context-appropriate advice")
    history: Optional[list[str]] = Field(default=None, description="Previous messages in the conversation")


class HealthChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=3000, description="User's health question")
    context: Optional[HealthChatContext] = Field(default=None, description="Optional contextual information")

    model_config = {"json_schema_extra": {
        "example": {
            "message": "Is the water safe to drink in Bali?",
            "context": {
                "location": "Bali",
                "userAge": 30,
                "history": [],
            },
        }
    }}


class HealthChatAction(BaseModel):
    type: str = Field(..., description="Action type: find_hospital, call_emergency, see_pharmacist, see_doctor, use_symptom_checker")
    label: str = Field(..., description="Human-readable label for the action button")
    data: Any = Field(default=None, description="Additional data for the action")


class HealthChatResponse(BaseModel):
    response: str
    suggestions: Optional[list[str]] = Field(default=None)
    urgency: Optional[str] = Field(default=None, description="LOW, MEDIUM, HIGH, or EMERGENCY")
    actions: Optional[list[HealthChatAction]] = Field(default=None)
    disclaimer: str = (
        "DISCLAIMER: This AI health companion provides general travel health information only. "
        "It is NOT a substitute for professional medical advice, diagnosis, or treatment. "
        "Always consult a qualified healthcare provider for medical concerns."
    )


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _openai_client() -> OpenAI | None:
    """Return an OpenAI client if an API key is configured, else None."""
    if settings.OPENAI_API_KEY:
        return OpenAI(api_key=settings.OPENAI_API_KEY)
    return None


def _normalize(text: str) -> str:
    """Lower-case and strip punctuation for keyword matching."""
    return re.sub(r"[^\w\s]", "", text.lower().strip())


def _extract_country(message: str, context: HealthChatContext | None) -> str | None:
    """Try to extract a country/location from the message or context."""
    msg_lower = _normalize(message)

    # Check context first
    if context and context.location:
        loc = context.location.strip().lower()
        if loc:
            return loc

    # Search message for known country names
    all_countries = set(WATER_SAFETY.keys()) | set(VACCINATION_INFO.keys()) | set(EMERGENCY_NUMBERS.keys())
    for country in sorted(all_countries, key=len, reverse=True):  # longest match first
        if country in msg_lower:
            return country

    return None


def _extract_region(country: str | None) -> str | None:
    """Map a country to a food-safety region key."""
    if not country:
        return None
    for region_key, data in FOOD_SAFETY_TIPS.items():
        for c in data["countries"]:
            if c.lower() == country or country in c.lower():
                return region_key
    return None


def _match_travel_topic(message: str) -> dict | None:
    """Try to match the user's message to a known travel health topic."""
    msg = _normalize(message)
    for _topic_key, topic in TRAVEL_HEALTH_TOPICS.items():
        for kw in topic["keywords"]:
            if kw in msg:
                return topic
    return None


def _match_first_aid(message: str) -> dict | None:
    """Try to match the user's message to a first-aid topic."""
    msg = _normalize(message)
    for _topic_key, topic in FIRST_AID.items():
        for kw in topic["keywords"]:
            if kw in msg:
                return topic
    return None


def _match_medication(message: str) -> dict | None:
    """Try to match the user's message to a medication topic."""
    msg = _normalize(message)
    for _med_key, med in MEDICATION_ADVICE.items():
        for kw in med["keywords"]:
            if kw in msg:
                return med
    return None


def _is_water_question(message: str) -> bool:
    msg = _normalize(message)
    water_keywords = ["water safe", "safe to drink", "drink water", "tap water", "drinking water", "water quality"]
    return any(kw in msg for kw in water_keywords)


def _is_food_question(message: str) -> bool:
    msg = _normalize(message)
    food_keywords = [
        "food safe", "safe to eat", "street food", "food poisoning", "eating", "food safety",
        "what to eat", "what not to eat", "food hygiene", "restaurant safe",
    ]
    return any(kw in msg for kw in food_keywords)


def _is_vaccination_question(message: str) -> bool:
    msg = _normalize(message)
    vax_keywords = [
        "vaccination", "vaccine", "vaccinations", "vaccines", "immunization",
        "immunisation", "shots", "jab", "jabs", "yellow fever vaccine",
        "what shots do i need", "do i need vaccines",
    ]
    return any(kw in msg for kw in vax_keywords)


def _is_find_doctor_question(message: str) -> bool:
    msg = _normalize(message)
    doc_keywords = [
        "find a doctor", "find doctor", "english speaking doctor", "need a doctor",
        "hospital near", "find hospital", "nearest hospital", "where is a hospital",
        "medical help", "need medical", "clinic near", "find a clinic",
        "english doctor",
    ]
    return any(kw in msg for kw in doc_keywords)


def _is_emergency_question(message: str) -> bool:
    msg = _normalize(message)
    emerg_keywords = [
        "emergency number", "ambulance", "emergency", "call ambulance",
        "911", "emergency phone", "er or clinic", "go to er", "go to hospital",
        "when to go to er", "when to go to hospital", "should i go to er",
        "should i go to hospital", "is this an emergency",
    ]
    return any(kw in msg for kw in emerg_keywords)


def _is_er_vs_clinic_question(message: str) -> bool:
    msg = _normalize(message)
    keywords = [
        "er or clinic", "er vs clinic", "emergency room or", "should i go to er",
        "should i go to hospital", "is this serious", "when should i go",
        "urgent care or er", "clinic or hospital", "do i need er",
        "pharmacist or doctor",
    ]
    return any(kw in msg for kw in keywords)


def _build_actions(urgency: str, country: str | None = None) -> list[dict]:
    """Build context-appropriate action buttons."""
    actions = []
    if urgency == "EMERGENCY":
        emergency_data = EMERGENCY_NUMBERS.get(country, {}) if country else {}
        actions.append({
            "type": "call_emergency",
            "label": "Call Emergency Services",
            "data": emergency_data or {"note": "Dial the local emergency number"},
        })
        actions.append({
            "type": "find_hospital",
            "label": "Find Nearest Hospital",
            "data": {"emergency": True},
        })
    elif urgency == "HIGH":
        actions.append({
            "type": "find_hospital",
            "label": "Find Nearby Hospital",
            "data": {"emergency": False},
        })
        actions.append({
            "type": "see_doctor",
            "label": "See a Doctor Today",
            "data": None,
        })
    elif urgency == "MEDIUM":
        actions.append({
            "type": "see_doctor",
            "label": "See a Doctor",
            "data": None,
        })
        actions.append({
            "type": "find_hospital",
            "label": "Find Nearby Clinic",
            "data": {"emergency": False},
        })
    else:
        actions.append({
            "type": "see_pharmacist",
            "label": "Visit a Pharmacy",
            "data": None,
        })
        actions.append({
            "type": "use_symptom_checker",
            "label": "Use Symptom Checker",
            "data": {"url": "/api/ai/symptoms"},
        })
    return actions


# ---------------------------------------------------------------------------
# Fallback rule-based response engine
# ---------------------------------------------------------------------------

def _fallback_response(message: str, context: HealthChatContext | None) -> HealthChatResponse:
    """Generate a comprehensive rule-based response when no OpenAI key is set."""
    country = _extract_country(message, context)
    region = _extract_region(country)
    urgency = "LOW"
    response_parts: list[str] = []
    suggestions: list[str] = []
    actions: list[dict] = []

    # ---- Water Safety ----
    if _is_water_question(message):
        if country and country in WATER_SAFETY:
            info = WATER_SAFETY[country]
            response_parts.append(
                f"**Water Safety in {country.title()}** (Rating: {info['rating']})\n\n"
                f"{info['details']}\n\n"
                f"**Tips:**\n" + "\n".join(f"- {t}" for t in info["tips"])
            )
            suggestions = ["What food is safe to eat here?", "What vaccinations do I need?", "Find a doctor nearby"]
        elif country:
            response_parts.append(
                f"I don't have specific water safety data for {country.title()}, but as a general rule: "
                "if you're unsure, drink bottled water. Look for sealed caps and buy from reputable shops. "
                "Avoid ice from unknown sources and use bottled water for brushing teeth."
            )
            suggestions = ["Ask about a specific country", "Food safety tips", "Find a doctor"]
        else:
            response_parts.append(
                "I'd be happy to help with water safety information! Could you tell me which country or city "
                "you're asking about? I have detailed water safety data for 50+ countries."
            )
            suggestions = ["Water safety in Thailand", "Water safety in India", "Water safety in Mexico"]
        urgency = "LOW"

    # ---- Food Safety ----
    elif _is_food_question(message):
        if region and region in FOOD_SAFETY_TIPS:
            info = FOOD_SAFETY_TIPS[region]
            response_parts.append(
                f"**Food Safety in {info['region_name']}**\n\n"
                "**General Tips:**\n" + "\n".join(f"- {t}" for t in info["general_tips"]) + "\n\n"
                "**Safe Choices:**\n" + "\n".join(f"- {s}" for s in info["safe_choices"]) + "\n\n"
                "**Be Cautious With:**\n" + "\n".join(f"- {r}" for r in info["risky_choices"])
            )
            suggestions = ["Is the water safe here?", "What vaccinations do I need?", "Common stomach remedies"]
        elif country:
            response_parts.append(
                f"Here are general food safety tips for traveling to {country.title()}:\n\n"
                "- Eat food that is freshly cooked and served hot\n"
                "- Choose busy restaurants and street vendors (high turnover = fresh food)\n"
                "- Peel fruits yourself\n"
                "- Wash hands or use hand sanitizer before eating\n"
                "- Avoid raw/undercooked meat and seafood\n"
                "- Be cautious with salads and raw vegetables"
            )
            suggestions = ["Water safety here?", "Common stomach remedies", "Find a doctor"]
        else:
            response_parts.append(
                "I can help with food safety advice! Which region or country are you traveling to? "
                "I have detailed food safety guides for Southeast Asia, South Asia, East Asia, Africa, "
                "Latin America, the Middle East, and Europe."
            )
            suggestions = ["Food safety in Southeast Asia", "Food safety in India", "What to eat in Mexico"]
        urgency = "LOW"

    # ---- Vaccination Info ----
    elif _is_vaccination_question(message):
        if country and country in VACCINATION_INFO:
            info = VACCINATION_INFO[country]
            parts = [f"**Vaccination Information for {country.title()}**\n"]
            if info["required"]:
                parts.append("**Required Vaccinations:**\n" + "\n".join(f"- {v}" for v in info["required"]))
            else:
                parts.append("**Required Vaccinations:** None specifically required.")
            parts.append("\n**Recommended Vaccinations:**\n" + "\n".join(f"- {v}" for v in info["recommended"]))
            parts.append(f"\n**Malaria Info:** {info['malaria']}")
            parts.append(f"\n**Notes:** {info['notes']}")
            parts.append(
                "\n**Important:** Visit a travel health clinic 6-8 weeks before departure "
                "for personalized vaccination advice based on your medical history."
            )
            response_parts.append("\n".join(parts))
            suggestions = [
                "Is the water safe there?",
                "Food safety tips",
                "What should I pack in my travel medical kit?",
            ]
        elif country:
            response_parts.append(
                f"I don't have specific vaccination data for {country.title()}, but here are general recommendations:\n\n"
                "**For most international travel, ensure you're up to date on:**\n"
                "- Routine vaccinations (MMR, tetanus, flu)\n"
                "- Hepatitis A (recommended for most developing countries)\n"
                "- Hepatitis B\n"
                "- Typhoid (for areas with poor sanitation)\n\n"
                "**Visit a travel clinic 6-8 weeks before departure** for personalized advice based on your "
                "destination and medical history."
            )
            suggestions = ["Find a travel clinic", "Malaria prevention", "Travel medical kit"]
        else:
            response_parts.append(
                "I can help with vaccination information! Which country are you traveling to? "
                "I have detailed vaccination guides for 20+ popular destinations."
            )
            suggestions = ["Vaccinations for Kenya", "Vaccinations for India", "Vaccinations for Thailand"]
        urgency = "LOW"

    # ---- Find a Doctor ----
    elif _is_find_doctor_question(message):
        response_parts.append(FIND_DOCTOR_ADVICE["general"])
        if country and country in FIND_DOCTOR_ADVICE["by_country"]:
            response_parts.append(f"\n\n**Specific to {country.title()}:**\n{FIND_DOCTOR_ADVICE['by_country'][country]}")
        if country and country in EMERGENCY_NUMBERS:
            nums = EMERGENCY_NUMBERS[country]
            num_lines = [f"  - {k.replace('_', ' ').title()}: **{v}**" for k, v in nums.items()]
            response_parts.append(f"\n\n**Emergency Numbers in {country.title()}:**\n" + "\n".join(num_lines))
        suggestions = ["What emergency numbers should I know?", "ER or clinic?", "Travel insurance tips"]
        urgency = "MEDIUM"
        actions = [
            {"type": "find_hospital", "label": "Find Nearest Hospital", "data": {"emergency": False}},
            {"type": "see_doctor", "label": "Search for English-Speaking Doctor", "data": None},
        ]

    # ---- Emergency / ER vs Clinic ----
    elif _is_er_vs_clinic_question(message) or _is_emergency_question(message):
        er_info = ER_VS_CLINIC
        response_parts.append(
            f"**{er_info['go_to_er']['title']}** if you have:\n"
            + "\n".join(f"- {c}" for c in er_info["go_to_er"]["conditions"])
            + f"\n\n**{er_info['go_to_clinic']['title']}** for:\n"
            + "\n".join(f"- {c}" for c in er_info["go_to_clinic"]["conditions"])
            + f"\n\n**{er_info['see_pharmacist']['title']}** for:\n"
            + "\n".join(f"- {c}" for c in er_info["see_pharmacist"]["conditions"])
        )
        if country and country in EMERGENCY_NUMBERS:
            nums = EMERGENCY_NUMBERS[country]
            num_lines = [f"  - {k.replace('_', ' ').title()}: **{v}**" for k, v in nums.items()]
            response_parts.append(f"\n\n**Emergency Numbers in {country.title()}:**\n" + "\n".join(num_lines))
        suggestions = ["Find nearest hospital", "Call emergency services", "Find a pharmacy"]
        urgency = "MEDIUM"
        actions = [
            {"type": "find_hospital", "label": "Find Nearest Emergency Room", "data": {"emergency": True}},
            {"type": "call_emergency", "label": "Call Emergency Services", "data": EMERGENCY_NUMBERS.get(country, {})},
        ]

    # ---- Travel Health Topics (jet lag, altitude, diarrhea, etc.) ----
    elif (topic := _match_travel_topic(message)):
        age_note = ""
        if context and context.userAge and context.userAge < 12:
            age_note = (
                "\n\n**Note for children:** Dosages and treatments may differ for children. "
                "Always consult a pediatrician or pharmacist for age-appropriate advice."
            )
        response_parts.append(f"**{topic['title']}**\n\n{topic['response']}{age_note}")
        urgency = topic.get("urgency", "LOW")
        suggestions = topic.get("suggestions", [])

    # ---- First Aid ----
    elif (first_aid := _match_first_aid(message)):
        response_parts.append(first_aid["response"])
        urgency = first_aid.get("urgency", "LOW")
        suggestions = ["Find nearest hospital", "Find a pharmacy", "When should I go to ER?"]

    # ---- Medication Advice ----
    elif (med := _match_medication(message)):
        response_parts.append(med["info"])
        urgency = "LOW"
        suggestions = ["What else should I pack in my travel kit?", "Find a pharmacy nearby"]

    # ---- Generic / Unmatched ----
    else:
        # Try to provide a helpful generic response
        msg_lower = _normalize(message)

        # Check for child-related queries
        child_keywords = ["child", "baby", "kid", "toddler", "infant", "my son", "my daughter"]
        is_child_query = any(kw in msg_lower for kw in child_keywords)

        # Check for fever
        if "fever" in msg_lower:
            topic = TRAVEL_HEALTH_TOPICS.get("fever")
            if topic:
                response_parts.append(f"**{topic['title']}**\n\n{topic['response']}")
                urgency = "MEDIUM" if is_child_query else topic.get("urgency", "MEDIUM")
                if is_child_query:
                    response_parts.append(
                        "\n\n**Since this involves a child:** Please see a doctor as soon as possible. "
                        "Fever in children should be evaluated by a healthcare professional, especially "
                        "if the child is under 5 years old, if the fever is above 38.5C/101.3F, or if "
                        "the child appears unwell."
                    )
                    urgency = "HIGH"
                suggestions = ["Find a doctor nearby", "When to go to ER", "Emergency numbers"]

        # Check for headache + nausea (food related)
        elif "headache" in msg_lower and ("nausea" in msg_lower or "sick" in msg_lower):
            response_parts.append(
                "**Headache and Nausea After Eating**\n\n"
                "This combination can be caused by several things:\n\n"
                "**Most Likely Causes:**\n"
                "- **Food poisoning** - Most common in travelers. Usually resolves in 24-48 hours\n"
                "- **Dehydration** - Very common in hot climates\n"
                "- **Heat exhaustion** - If you've been in the sun\n"
                "- **Food intolerance** - Reaction to unfamiliar spices or ingredients\n\n"
                "**Immediate Steps:**\n"
                "1. Hydrate with clean water or ORS\n"
                "2. Rest in a cool, comfortable place\n"
                "3. Take paracetamol for the headache\n"
                "4. Eat bland foods (rice, toast, bananas) when you can\n"
                "5. Avoid dairy, caffeine, and alcohol\n\n"
                "**See a doctor if:**\n"
                "- Symptoms persist beyond 48 hours\n"
                "- High fever (above 38.5C / 101.3F)\n"
                "- Blood in vomit or stool\n"
                "- Severe abdominal pain\n"
                "- Signs of severe dehydration (very dark urine, dizziness, confusion)\n"
                "- You are unable to keep any fluids down"
            )
            urgency = "MEDIUM"
            suggestions = ["Get ORS from pharmacy", "Find a doctor", "When to go to ER"]

        # General helpful fallback
        else:
            response_parts.append(
                "Thank you for your health question. While I may not have a specific pre-built answer "
                "for this query, here are some helpful resources:\n\n"
                "**I can help you with:**\n"
                "- Water safety in 50+ countries (try: 'Is water safe in [country]?')\n"
                "- Food safety by region (try: 'Food safety in [country]')\n"
                "- Vaccination requirements (try: 'What vaccines do I need for [country]?')\n"
                "- Common travel health issues (jet lag, altitude sickness, traveler's diarrhea, etc.)\n"
                "- Finding English-speaking doctors abroad\n"
                "- First aid basics (cuts, burns, sprains)\n"
                "- When to go to ER vs clinic\n"
                "- Travel medication advice\n"
                "- Emergency numbers by country\n\n"
                "**For immediate medical concerns:**\n"
                "- Use our Symptom Checker for AI-powered assessment\n"
                "- Find nearby hospitals using the Hospital Finder\n"
                "- Call local emergency services if it's urgent"
            )
            urgency = "LOW"
            suggestions = [
                "Is the water safe in Thailand?",
                "What vaccinations do I need for Kenya?",
                "How to deal with jet lag?",
                "Find a doctor nearby",
                "Travel medical kit essentials",
            ]

    # Build actions if not already set
    if not actions:
        actions = _build_actions(urgency, country)

    # Append disclaimer
    full_response = "\n\n".join(response_parts) + MEDICAL_DISCLAIMER

    return HealthChatResponse(
        response=full_response,
        suggestions=suggestions if suggestions else None,
        urgency=urgency,
        actions=[HealthChatAction(**a) for a in actions] if actions else None,
    )


# ---------------------------------------------------------------------------
# OpenAI-based response
# ---------------------------------------------------------------------------

def _openai_response(message: str, context: HealthChatContext | None, client: OpenAI) -> HealthChatResponse:
    """Generate a response using OpenAI's chat completion API."""
    system_prompt = (
        "You are MedAssist Health Companion, a knowledgeable AI health assistant for international travelers. "
        "You provide accurate, helpful travel health information.\n\n"
        "RULES:\n"
        "1. ALWAYS include a medical disclaimer that you are NOT a doctor.\n"
        "2. For ANY potentially serious condition, advise seeking immediate medical attention.\n"
        "3. NEVER provide specific prescription medication dosages.\n"
        "4. When in doubt, recommend seeing a healthcare professional.\n"
        "5. Provide practical, actionable advice for travelers.\n"
        "6. Include relevant local context when a location is provided.\n"
        "7. For water/food safety, give specific country-level advice.\n"
        "8. Always mention when something could be an emergency.\n"
        "9. Respond in a warm, reassuring but professional tone.\n\n"
        "RESPONSE FORMAT:\n"
        "Provide your response as helpful health advice. At the end, ALWAYS include:\n"
        "- An urgency assessment: LOW, MEDIUM, HIGH, or EMERGENCY\n"
        "- 2-3 follow-up suggestions the user might want to ask about\n"
        "Format urgency as: [URGENCY: LEVEL]\n"
        "Format suggestions as: [SUGGESTIONS: suggestion1 | suggestion2 | suggestion3]"
    )

    context_info = ""
    if context:
        if context.location:
            context_info += f"\nUser's location: {context.location}"
        if context.userAge is not None:
            context_info += f"\nUser's age: {context.userAge}"
    if context_info:
        system_prompt += f"\n\nUser context:{context_info}"

    messages = [{"role": "system", "content": system_prompt}]

    # Add conversation history
    if context and context.history:
        for i, msg in enumerate(context.history[-10:]):
            role = "user" if i % 2 == 0 else "assistant"
            messages.append({"role": role, "content": msg})

    messages.append({"role": "user", "content": message})

    try:
        completion = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=messages,
            temperature=0.5,
            max_tokens=1500,
        )
        reply = completion.choices[0].message.content.strip()

        # Parse urgency from response
        urgency = "LOW"
        urgency_match = re.search(r"\[URGENCY:\s*(LOW|MEDIUM|HIGH|EMERGENCY)\]", reply)
        if urgency_match:
            urgency = urgency_match.group(1)
            reply = reply.replace(urgency_match.group(0), "").strip()

        # Parse suggestions from response
        suggestions = []
        suggestions_match = re.search(r"\[SUGGESTIONS:\s*(.+?)\]", reply)
        if suggestions_match:
            suggestions = [s.strip() for s in suggestions_match.group(1).split("|")]
            reply = reply.replace(suggestions_match.group(0), "").strip()

        if not suggestions:
            suggestions = [
                "Tell me more about staying healthy here",
                "Find a doctor nearby",
                "What should I pack in my travel medical kit?",
            ]

        # Add disclaimer if not already present
        if "disclaimer" not in reply.lower() and "not a substitute" not in reply.lower():
            reply += MEDICAL_DISCLAIMER

        country = _extract_country(message, context)
        actions = _build_actions(urgency, country)

        return HealthChatResponse(
            response=reply,
            suggestions=suggestions,
            urgency=urgency,
            actions=[HealthChatAction(**a) for a in actions],
        )

    except OpenAIError as exc:
        logger.warning("OpenAI health-chat failed: %s. Falling back to rule-based.", exc)
        return _fallback_response(message, context)


# ---------------------------------------------------------------------------
# Endpoint
# ---------------------------------------------------------------------------

@router.post(
    "/health-chat",
    response_model=HealthChatResponse,
    summary="AI Health Companion for travelers",
    description=(
        "Conversational AI health assistant that answers travel health questions. "
        "Covers water safety, food safety, vaccinations, common ailments, finding doctors, "
        "first aid, emergency guidance, and medication advice. "
        "Uses OpenAI when available, with a comprehensive rule-based fallback system."
    ),
)
async def health_chat(request: HealthChatRequest) -> HealthChatResponse:
    """Handle a health chat message and return contextual health advice."""
    try:
        client = _openai_client()
        if client:
            return _openai_response(request.message, request.context, client)
        return _fallback_response(request.message, request.context)
    except Exception as exc:
        logger.error("Health companion error: %s", exc, exc_info=True)
        raise HTTPException(
            status_code=500,
            detail=f"Health companion service encountered an error: {str(exc)}",
        )
