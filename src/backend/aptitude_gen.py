"""
aptitude_gen.py
===============
TrueNorth · Groq Aptitude Question Generator
-----------------------------------------------
POST /api/generate-aptitude
Uses the groq SDK
"""

import os
import re
import json
import logging
from groq import Groq
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv("supabase_conn.env")

log    = logging.getLogger("aptitude_gen")
router = APIRouter()

# ── Configure Groq client ────────────────────────────────────
_api_key = os.getenv("GROQ_API_KEY")
if not _api_key:
    log.warning("GROQ_API_KEY not set — /api/generate-aptitude will fail at runtime")

client = Groq(api_key=_api_key)

# ── Request model ────────────────────────────────────────────
class AptitudeRequest(BaseModel):
    career:      str
    interests:   list[str]
    personality: dict


# ── Prompt builder ───────────────────────────────────────────
def build_prompt(career: str, interests: list[str], personality: dict) -> str:
    return f"""You are an expert aptitude test designer for a career guidance platform.

Generate exactly 10 aptitude test questions for a student interested in becoming a "{career}".

Student profile:
- Top interests: {", ".join(interests[:5]) if interests else "not specified"}
- Personality traits: {json.dumps(personality)}

STRICT REQUIREMENTS:
1. Every question must test a real, practical skill needed for "{career}"
2. Difficulty distribution: exactly 3 easy, 4 medium, 3 hard
3. Points must be: easy=10, medium=20, hard=30
4. Time must be:   easy=30, medium=45, hard=60
5. Each question must have exactly 4 answer options
6. "correct" is a 0-based index — must be 0, 1, 2, or 3
7. Wrong options must be plausible, not obviously incorrect
8. Test judgment and practical thinking, not memorization

You MUST respond with ONLY valid JSON. No markdown, no backticks, no explanation before or after.

{{
  "questions": [
    {{
      "id": 1,
      "question": "question text here",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 1,
      "difficulty": "easy",
      "points": 10,
      "time": 30,
      "skill": "specific skill being tested"
    }}
  ]
}}"""


# ── Validator ────────────────────────────────────────────────
VALID_DIFFICULTIES = {"easy", "medium", "hard"}
VALID_POINTS       = {10, 20, 30}
VALID_TIMES        = {30, 45, 60}

def validate_questions(questions: list[dict]) -> list[dict]:
    valid  = []
    issues = []

    for i, q in enumerate(questions, start=1):
        errs = []

        for field in ("id", "question", "options", "correct", "difficulty", "points", "time", "skill"):
            if field not in q:
                errs.append(f"missing '{field}'")

        if errs:
            issues.append(f"Q{i}: {', '.join(errs)}")
            continue

        if not isinstance(q["options"], list) or len(q["options"]) != 4:
            errs.append("options must be a list of exactly 4 strings")
        if not isinstance(q["correct"], int) or q["correct"] not in range(4):
            errs.append(f"correct must be 0-3, got {q['correct']!r}")
        if q["difficulty"] not in VALID_DIFFICULTIES:
            errs.append(f"difficulty must be easy/medium/hard, got {q['difficulty']!r}")
        if q["points"] not in VALID_POINTS:
            errs.append(f"points must be 10/20/30, got {q['points']!r}")
        if q["time"] not in VALID_TIMES:
            errs.append(f"time must be 30/45/60, got {q['time']!r}")
        if len(str(q.get("question", "")).strip()) < 10:
            errs.append("question text too short")

        if errs:
            issues.append(f"Q{i}: {', '.join(errs)}")
        else:
            valid.append(q)

    if len(valid) < 8:
        raise ValueError(
            f"Only {len(valid)}/10 questions passed validation. "
            f"Issues: {'; '.join(issues) if issues else 'unknown'}"
        )

    return valid[:10]


# ── Groq caller ──────────────────────────────────────────────
def call_groq(prompt: str) -> list[dict]:
    response = client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[
            {
                "role": "system",
                "content": "You are an expert aptitude test designer. Always respond with valid JSON only, no markdown, no extra text."
            },
            {"role": "user", "content": prompt}
        ],
        temperature=0.7,
        max_tokens=3000,
        response_format={"type": "json_object"},
    )

    raw = response.choices[0].message.content.strip()
    raw = re.sub(r"^```(?:json)?", "", raw, flags=re.MULTILINE).strip()
    raw = re.sub(r"```$",          "", raw, flags=re.MULTILINE).strip()

    data = json.loads(raw)

    if "questions" not in data or not isinstance(data["questions"], list):
        raise ValueError("Response JSON missing 'questions' array")

    return data["questions"]


# ── Route ────────────────────────────────────────────────────
@router.post("/api/generate-aptitude")
async def generate_aptitude(body: AptitudeRequest):
    if not body.career or len(body.career.strip()) < 2:
        raise HTTPException(status_code=400, detail="Career field is required.")

    if not _api_key:
        raise HTTPException(
            status_code=500,
            detail="GROQ_API_KEY is not configured on the server."
        )

    MAX_RETRIES = 3
    last_error  = "Unknown error"

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            log.info(f"Generating questions for '{body.career}' (attempt {attempt}/{MAX_RETRIES})")

            prompt        = build_prompt(body.career, body.interests, body.personality)
            raw_questions = call_groq(prompt)
            validated     = validate_questions(raw_questions)

            total_points = sum(q["points"] for q in validated)
            log.info(f"Success: {len(validated)} questions, {total_points} pts for '{body.career}'")

            return {
                "questions":    validated,
                "career":       body.career,
                "total_points": total_points,
            }

        except json.JSONDecodeError as e:
            last_error = f"Groq returned invalid JSON: {e}"
            log.warning(f"Attempt {attempt}: {last_error}")

        except ValueError as e:
            last_error = str(e)
            log.warning(f"Attempt {attempt}: Validation failed — {last_error}")

        except Exception as e:
            last_error = str(e)
            log.error(f"Attempt {attempt}: Unexpected error — {last_error}")

    raise HTTPException(
        status_code=502,
        detail=f"Failed to generate questions after {MAX_RETRIES} attempts: {last_error}",
    )