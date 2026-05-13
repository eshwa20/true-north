"""
aptitude_gen.py
===============
TrueNorth · Groq AI-Powered Assessment Engine
-----------------------------------------------
POST /api/generate-interests    - AI generates interest domains & fields
POST /api/generate-personality  - AI generates adaptive personality questions
POST /api/recommend-careers     - AI recommends careers based on profile
POST /api/generate-aptitude     - AI generates career-specific aptitude test
"""

import os
import re
import json
import time
import logging
from typing import Any
from groq import Groq
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv("supabase_conn.env")

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("aptitude_gen")
router = APIRouter()

# ── Configure Groq client ────────────────────────────────────
_api_key = os.getenv("GROQ_API_KEY")

if not _api_key:
    log.error("❌ GROQ_API_KEY not set!")
else:
    log.info(f"✅ GROQ_API_KEY loaded (starts with: {_api_key[:10]}...)")

client = Groq(api_key=_api_key) if _api_key else None

# ── Simple in-memory cache ────────────────────────────────────
cache: dict = {}
CACHE_DURATION = 7200  # 2 hours


def get_cached(key: str):
    if key in cache:
        data, timestamp = cache[key]
        if time.time() - timestamp < CACHE_DURATION:
            log.info(f"📦 Cache hit: {key}")
            return data
        del cache[key]
    return None


def set_cache(key: str, data):
    cache[key] = (data, time.time())
    if len(cache) > 100:
        oldest = min(cache.keys(), key=lambda k: cache[k][1])
        del cache[oldest]


# ── Request Models ────────────────────────────────────────────
class AptitudeRequest(BaseModel):
    career: str
    interests: list[Any] = []
    personality: list[Any] = []
    ageGroup: str = "18+"
    difficultyGuidance: str = ""


class InterestsRequest(BaseModel):
    ageGroup: str


class PersonalityRequest(BaseModel):
    ageGroup: str
    interests: list[Any] = []
    previousAnswers: list[Any] = []


class CareerRecommendationRequest(BaseModel):
    ageGroup: str
    interests: list[Any] = []
    personality: list[Any] = []
    preferredDomains: list[str] = []
    domainWeights: list[Any] = []
    personalityTraits: list[str] = []


# ── Helper: Call Groq API ────────────────────────────────────
def call_groq(
    system_prompt: str,
    user_prompt: str,
    temperature: float = 0.8,
    max_tokens: int = 2000,
) -> dict:
    if client is None:
        raise RuntimeError("Groq client not initialized — check GROQ_API_KEY")

    time.sleep(0.5)  # Light rate-limit protection

    response = client.chat.completions.create(
        model="llama-3.1-8b-instant",
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        temperature=temperature,
        max_tokens=max_tokens,
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content.strip()
    # Strip accidental markdown fences
    raw = re.sub(r"^```(?:json)?\s*", "", raw, flags=re.MULTILINE)
    raw = re.sub(r"\s*```$", "", raw, flags=re.MULTILINE)
    return json.loads(raw.strip())


# ── 1. Generate Interests ─────────────────────────────────────
@router.post("/api/generate-interests")
async def generate_interests(body: InterestsRequest):
    log.info(f"🎯 Interests for age: {body.ageGroup}")

    cache_key = f"interests:{body.ageGroup}"
    cached = get_cached(cache_key)
    if cached:
        return cached

    if not _api_key or client is None:
        raise HTTPException(
            status_code=503,
            detail="AI service not configured. Please set GROQ_API_KEY in your environment.",
        )

    for attempt in range(3):
        try:
            prompt = f"""Generate 6-7 interest domains with career fields for a person aged {body.ageGroup}.

Each domain MUST have:
- id (string, e.g. "tech"), name, icon (Font Awesome class like "fa-laptop-code"), description
- 4-7 fields, each with: id, label, icon (Font Awesome fa- prefix), trending (boolean), description

Mark currently booming 2025-2026 fields as trending: true.
Use Font Awesome icons only (fa- prefix). No emojis in icon fields.

Respond with ONLY valid JSON in this format:
{{"domains": [{{"id":"tech","name":"Technology","icon":"fa-laptop-code","description":"...","fields":[{{"id":"ai","label":"AI & Machine Learning","icon":"fa-robot","trending":true,"description":"..."}}]}}]}}"""

            data = call_groq(
                "You are a career counselor. Always respond with valid JSON only, no preamble.",
                prompt,
                temperature=0.7,
                max_tokens=2500,
            )

            if data.get("domains") and len(data["domains"]) > 0:
                set_cache(cache_key, data)
                return data

            log.warning(f"⚠️ Attempt {attempt + 1}: Empty domains")
        except Exception as e:
            log.error(f"❌ Attempt {attempt + 1}: {e}")
            if attempt == 2:
                raise HTTPException(
                    status_code=502,
                    detail=f"Failed to generate interests after 3 attempts: {str(e)}",
                )

    raise HTTPException(status_code=502, detail="Failed to generate interests after 3 attempts.")


# ── 2. Generate Personality Questions ─────────────────────────
@router.post("/api/generate-personality")
async def generate_personality(body: PersonalityRequest):
    log.info(f"🎯 Personality (prev answers: {len(body.previousAnswers)})")

    if not _api_key or client is None:
        raise HTTPException(
            status_code=503,
            detail="AI service not configured. Please set GROQ_API_KEY.",
        )

    is_first = len(body.previousAnswers) == 0

    for attempt in range(3):
        try:
            if is_first:
                prompt = f"""Generate exactly 10 personality assessment questions for age group: {body.ageGroup}.

Each question MUST have:
- id (q1, q2, ... q10)
- question (the question text, at least 10 characters)
- category (one of: Work Style, Decision Making, Motivation, Team Role, Learning, Lifestyle)
- options: exactly 4 objects, each with "label" (display text) and "value" (snake_case key)

Cover these topics: lifestyle, work style, decision making, motivation, team role, adaptability, environment, feedback, learning, stress.

Return ONLY valid JSON:
{{"questions":[{{"id":"q1","question":"...","category":"Work Style","options":[{{"label":"...","value":"..."}}]}}]}}"""
            else:
                prev = json.dumps(body.previousAnswers[-5:])
                prompt = f"""Based on these previous personality answers: {prev}

Generate exactly 5 MORE follow-up personality questions that dig deeper.

Each MUST have: id (q11-q15), question, category, options (exactly 4 with label/value).

Return ONLY valid JSON:
{{"questions":[{{"id":"q11","question":"...","category":"Deep Dive","options":[{{"label":"...","value":"..."}}]}}]}}"""

            data = call_groq(
                "You are a personality assessment expert. Respond with valid JSON only.",
                prompt,
                temperature=0.8,
                max_tokens=2000,
            )

            questions = data.get("questions", [])
            valid = []
            for q in questions:
                if not q.get("question") or len(q.get("question", "").strip()) < 5:
                    continue
                if not q.get("options") or len(q.get("options", [])) < 4:
                    continue
                if not q.get("id"):
                    q["id"] = f"q_{len(valid) + 1}"
                if not q.get("category"):
                    q["category"] = "Personality"
                # Normalize options
                cleaned_opts = []
                for opt in q.get("options", [])[:4]:
                    if isinstance(opt, str):
                        cleaned_opts.append({"label": opt, "value": opt.lower().replace(" ", "_")})
                    else:
                        label = opt.get("label") or opt.get("value", "")
                        value = opt.get("value") or label.lower().replace(" ", "_")
                        cleaned_opts.append({"label": label, "value": value})
                q["options"] = cleaned_opts
                valid.append(q)

            if len(valid) > 0:
                log.info(f"✅ {len(valid)} valid personality questions")
                return {"questions": valid}

            log.warning(f"⚠️ Attempt {attempt + 1}: No valid questions")
        except Exception as e:
            log.error(f"❌ Attempt {attempt + 1}: {e}")

    raise HTTPException(status_code=502, detail="Failed to generate personality questions after 3 attempts.")


# ── 3. Recommend Careers (80% interests, 20% personality) ────
@router.post("/api/recommend-careers")
async def recommend_careers(body: CareerRecommendationRequest):
    log.info(f"🎯 Career recs for age: {body.ageGroup}, Domains: {body.preferredDomains}")

    cache_key = f"careers:{body.ageGroup}:{'-'.join(sorted(body.preferredDomains))}"
    cached = get_cached(cache_key)
    if cached:
        return cached

    if not _api_key or client is None:
        raise HTTPException(
            status_code=503,
            detail="AI service not configured. Please set GROQ_API_KEY.",
        )

    for attempt in range(3):
        try:
            domain_info = [
                f"{dw['domain']} ({dw['weight']}% of selections)"
                for dw in body.domainWeights
            ]

            interests_str = json.dumps([
                {"label": i.get("label", ""), "domain": i.get("domainName", "")}
                for i in body.interests[:8]
            ])

            prompt = f"""Recommend exactly 6 career paths for a person aged {body.ageGroup}.

CRITICAL WEIGHTING RULES:
- 80% weight on interests (most important)
- 20% weight on personality traits

DOMAIN PREFERENCES (by interest frequency):
{chr(10).join(f'- {d}' for d in domain_info)}

SELECTED INTERESTS: {interests_str}

PERSONALITY TRAITS (20% influence only): {', '.join(body.personalityTraits[:5])}

SELECTION RULES:
- At least 5 of 6 careers MUST come from their top interest domains
- Only 1 wildcard from a related domain is allowed
- Use real career titles that match the JSON list below

Return ONLY valid JSON:
{{"careers":[{{"id":"tech1","title":"Software Developer","category":"Technology","match":87,"description":"Build software applications and systems","skills":["Programming","Problem Solving","Algorithms"],"education_path":"Computer Science degree or bootcamp","salary_range":"$70k-$150k","growth_rate":"22%"}}]}}"""

            data = call_groq(
                "You are a career counselor. Respond with valid JSON only.",
                prompt,
                temperature=0.7,
                max_tokens=2000,
            )

            if data.get("careers") and len(data["careers"]) >= 4:
                set_cache(cache_key, data)
                return data

            log.warning(f"⚠️ Attempt {attempt + 1}: Only {len(data.get('careers', []))} careers")
        except Exception as e:
            log.error(f"❌ Attempt {attempt + 1}: {e}")

    raise HTTPException(status_code=502, detail="Failed to recommend careers after 3 attempts.")


# ── 4. Generate Aptitude Questions ────────────────────────────
@router.post("/api/generate-aptitude")
async def generate_aptitude(body: AptitudeRequest):
    log.info(f"🎯 Aptitude: {body.career}, Age: {body.ageGroup}")

    if not body.career or len(body.career.strip()) < 2:
        raise HTTPException(status_code=400, detail="Career field is required.")

    cache_key = f"aptitude:{body.career.lower().replace(' ', '_')}:{body.ageGroup}"
    cached = get_cached(cache_key)
    if cached:
        return cached

    if not _api_key or client is None:
        raise HTTPException(
            status_code=503,
            detail="AI service not configured. Please set GROQ_API_KEY.",
        )

    difficulty_note = body.difficultyGuidance or (
        "Very simple, age-appropriate questions." if body.ageGroup == "10-15"
        else "Professional-level questions testing real knowledge."
    )

    for attempt in range(3):
        try:
            prompt = f"""Generate exactly 10 aptitude test questions for a {body.career} career. Age group: {body.ageGroup}.

Difficulty note: {difficulty_note}

REQUIREMENTS:
- 3 easy questions (points: 10, time: 40 seconds)
- 4 medium questions (points: 20, time: 50 seconds)
- 3 hard questions (points: 30, time: 60 seconds)
- Each question must have EXACTLY 4 options (plain strings, NOT objects)
- "correct" is a 0-based index (0, 1, 2, or 3)
- Each question tests a specific, named skill for this career
- Questions must be realistic and test actual job knowledge

Return ONLY valid JSON:
{{"questions":[{{"question":"What does REST stand for in web APIs?","options":["Representational State Transfer","Remote Execution Service Tool","Reliable Endpoint Storage Transfer","Resource Encoding Standard Transfer"],"correct":0,"difficulty":"easy","points":10,"time":40,"skill":"Web APIs"}}]}}"""

            data = call_groq(
                "You are an aptitude test designer. Respond with valid JSON only.",
                prompt,
                temperature=0.9,  # Higher temp for variety each time
                max_tokens=2500,
            )

            questions = data.get("questions", [])
            valid = []
            for i, q in enumerate(questions, start=1):
                # Validate question text
                if not q.get("question") or len(q.get("question", "").strip()) < 5:
                    continue
                # Validate options — must be exactly 4 strings
                opts = q.get("options", [])
                if len(opts) != 4:
                    continue
                # Flatten objects to strings if needed
                str_opts = []
                for o in opts:
                    if isinstance(o, str):
                        str_opts.append(o)
                    elif isinstance(o, dict):
                        str_opts.append(o.get("label") or o.get("text") or o.get("value") or str(o))
                    else:
                        str_opts.append(str(o))
                if len(str_opts) != 4:
                    continue

                q["id"] = i
                q["options"] = str_opts
                if q.get("difficulty") not in ["easy", "medium", "hard"]:
                    q["difficulty"] = "medium"
                if q.get("points") not in [10, 20, 30]:
                    q["points"] = 20
                if q.get("time") not in [30, 40, 45, 50, 60]:
                    q["time"] = 45
                if not q.get("skill"):
                    q["skill"] = "General Knowledge"
                correct = q.get("correct")
                if not isinstance(correct, int) or correct not in [0, 1, 2, 3]:
                    q["correct"] = 0
                valid.append(q)

            if len(valid) >= 5:
                result = {
                    "questions": valid[:10],
                    "career": body.career,
                    "total_points": sum(q["points"] for q in valid[:10]),
                }
                set_cache(cache_key, result)
                return result

            log.warning(f"⚠️ Attempt {attempt + 1}: Only {len(valid)} valid questions")
        except Exception as e:
            log.error(f"❌ Attempt {attempt + 1}: {e}")

    raise HTTPException(status_code=502, detail="Failed to generate aptitude questions after 3 attempts.")


# ── Health check ──────────────────────────────────────────────
@router.get("/api/aptitude-health")
async def health_check():
    return {
        "status": "ok",
        "groq_configured": _api_key is not None and client is not None,
        "cache_size": len(cache),
        "endpoints": [
            "POST /api/generate-interests",
            "POST /api/generate-personality",
            "POST /api/recommend-careers",
            "POST /api/generate-aptitude",
        ],
    }