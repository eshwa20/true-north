"""
aptitude_gen.py
===============
TrueNorth · GPT Aptitude Question Generator
--------------------------------------------
Adds  POST /api/generate-aptitude  to your FastAPI app.
Import and include this router in main.py.

Add to main.py:
    from aptitude_gen import router as aptitude_router
    app.include_router(aptitude_router)

.env additions:
    OPENAI_API_KEY=sk-...
"""

import os
import re
import json
import logging
from openai import OpenAI
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv  # <--- Add this

load_dotenv("supabase_conn.env")

log    = logging.getLogger("aptitude_gen")
client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
router = APIRouter()

# ── Validation constants ─────────────────────────────────────
VALID_DIFFICULTIES = {"easy", "medium", "hard"}
VALID_POINTS       = {10, 20, 30}
VALID_TIMES        = {30, 45, 60}

# ── Request model ────────────────────────────────────────────
class AptitudeRequest(BaseModel):
    career:      str
    interests:   list[str]
    personality: dict
    prompt:      str  # built by frontend


# ── Validator ────────────────────────────────────────────────
def validate_questions(questions: list[dict], career: str) -> list[dict]:
    """
    Ensures every question meets structural and content standards.
    Raises ValueError listing all issues found.
    """
    issues  = []
    valid   = []

    for i, q in enumerate(questions, start=1):
        q_issues = []

        # Required fields present
        for field in ["id", "question", "options", "correct", "difficulty", "points", "time", "skill"]:
            if field not in q:
                q_issues.append(f"missing field '{field}'")

        if q_issues:
            issues.append(f"Q{i}: {', '.join(q_issues)}")
            continue

        # Structural checks
        if not isinstance(q["options"], list) or len(q["options"]) != 4:
            q_issues.append("must have exactly 4 options")

        if not isinstance(q["correct"], int) or q["correct"] not in range(4):
            q_issues.append("correct must be 0–3")

        if q["difficulty"] not in VALID_DIFFICULTIES:
            q_issues.append(f"difficulty must be easy/medium/hard, got '{q['difficulty']}'")

        if q["points"] not in VALID_POINTS:
            q_issues.append(f"points must be 10/20/30, got {q['points']}")

        if q["time"] not in VALID_TIMES:
            q_issues.append(f"time must be 30/45/60, got {q['time']}")

        if len(q["question"].strip()) < 15:
            q_issues.append("question text too short")

        if q_issues:
            issues.append(f"Q{i}: {', '.join(q_issues)}")
        else:
            valid.append(q)

    if len(valid) < 8:
        raise ValueError(f"Only {len(valid)}/10 questions passed validation. Issues: {'; '.join(issues)}")

    return valid[:10]


# ── GPT caller ───────────────────────────────────────────────
def call_gpt(prompt: str) -> list[dict]:
    response = client.chat.completions.create(
        model="gpt-4o-mini",   # fast + cheap; swap to gpt-4o for higher quality
        messages=[
            {
                "role": "system",
                "content": (
                    "You are an expert aptitude test designer for career guidance platforms. "
                    "You always respond with valid JSON only — no markdown, no explanation, no backticks."
                ),
            },
            {"role": "user", "content": prompt},
        ],
        temperature=0.7,
        max_tokens=3000,
    )

    raw = response.choices[0].message.content.strip()

    # Strip markdown fences if model adds them despite instructions
    raw = re.sub(r"^```(?:json)?", "", raw).strip()
    raw = re.sub(r"```$", "", raw).strip()

    data = json.loads(raw)

    if "questions" not in data or not isinstance(data["questions"], list):
        raise ValueError("Response missing 'questions' array")

    return data["questions"]


# ── Main route ───────────────────────────────────────────────
@router.post("/api/generate-aptitude")
async def generate_aptitude(body: AptitudeRequest):
    if not body.career or len(body.career) < 2:
        raise HTTPException(status_code=400, detail="Career field is required.")

    MAX_RETRIES = 3

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            log.info(f"Generating aptitude questions for '{body.career}' (attempt {attempt})")

            # Build a fresh, explicit prompt each retry
            prompt = f"""
You are an expert aptitude test designer for career guidance.

Generate exactly 10 aptitude test questions for a student aiming to become a "{body.career}".

Student profile:
- Top interests: {', '.join(body.interests[:5]) if body.interests else 'not specified'}
- Personality: {json.dumps(body.personality)}

STRICT REQUIREMENTS:
1. All questions must directly relate to the "{body.career}" role
2. Difficulty distribution: 3 easy, 4 medium, 3 hard
3. Points: easy=10, medium=20, hard=30
4. Time per question: easy=30s, medium=45s, hard=60s
5. Every question must have exactly 4 answer options
6. "correct" is a 0-based index (0, 1, 2, or 3)
7. Wrong options must be plausible, not obviously incorrect
8. Test practical skill and judgment, not trivia

Respond with ONLY this JSON structure, no other text:
{{
  "questions": [
    {{
      "id": 1,
      "question": "question text here",
      "options": ["Option A text", "Option B text", "Option C text", "Option D text"],
      "correct": 1,
      "difficulty": "easy",
      "points": 10,
      "time": 30,
      "skill": "specific skill being tested"
    }}
  ]
}}
"""
            raw_questions = call_gpt(prompt)
            validated     = validate_questions(raw_questions, body.career)

            log.info(f"Successfully generated {len(validated)} questions for '{body.career}'")
            return {"questions": validated, "career": body.career, "total_points": sum(q["points"] for q in validated)}

        except json.JSONDecodeError as e:
            log.warning(f"Attempt {attempt}: GPT returned invalid JSON — {e}")
            if attempt == MAX_RETRIES:
                raise HTTPException(status_code=502, detail="AI returned malformed response after 3 attempts. Please try again.")

        except ValueError as e:
            log.warning(f"Attempt {attempt}: Validation failed — {e}")
            if attempt == MAX_RETRIES:
                raise HTTPException(status_code=502, detail=f"Could not generate valid questions: {e}")

        except Exception as e:
            log.error(f"Attempt {attempt}: Unexpected error — {e}")
            if attempt == MAX_RETRIES:
                raise HTTPException(status_code=500, detail="Question generation failed. Please try again.")