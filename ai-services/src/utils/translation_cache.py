"""Simple in-memory LRU cache for translation results."""

from __future__ import annotations

import hashlib
import time
from collections import OrderedDict
from typing import Optional


class TranslationCache:
    """Thread-safe in-memory LRU cache for translation results.

    Parameters
    ----------
    max_size : int
        Maximum number of entries to keep in the cache.
    ttl_seconds : int
        Time-to-live for each entry in seconds (default 1 hour).
    """

    def __init__(self, max_size: int = 1000, ttl_seconds: int = 3600) -> None:
        self._cache: OrderedDict[str, dict] = OrderedDict()
        self._max_size = max_size
        self._ttl = ttl_seconds
        self._hits = 0
        self._misses = 0

    @staticmethod
    def _make_key(text: str, source_lang: str, target_lang: str) -> str:
        raw = f"{text}|{source_lang}|{target_lang}"
        return hashlib.sha256(raw.encode()).hexdigest()

    def get(self, text: str, source_lang: str, target_lang: str) -> Optional[str]:
        """Return cached translation or None."""
        key = self._make_key(text, source_lang, target_lang)
        entry = self._cache.get(key)
        if entry is None:
            self._misses += 1
            return None
        if time.time() - entry["ts"] > self._ttl:
            del self._cache[key]
            self._misses += 1
            return None
        self._cache.move_to_end(key)
        self._hits += 1
        return entry["translation"]

    def set(self, text: str, source_lang: str, target_lang: str, translation: str) -> None:
        """Store a translation in the cache."""
        key = self._make_key(text, source_lang, target_lang)
        self._cache[key] = {"translation": translation, "ts": time.time()}
        self._cache.move_to_end(key)
        if len(self._cache) > self._max_size:
            self._cache.popitem(last=False)

    def clear(self) -> None:
        """Clear the entire cache."""
        self._cache.clear()
        self._hits = 0
        self._misses = 0

    @property
    def stats(self) -> dict:
        return {
            "size": len(self._cache),
            "max_size": self._max_size,
            "hits": self._hits,
            "misses": self._misses,
            "hit_rate": round(self._hits / max(self._hits + self._misses, 1), 3),
        }


# Module-level singleton
translation_cache = TranslationCache()
