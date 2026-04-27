"""
aptitude_gen.py
===============
TrueNorth · Groq Aptitude Question Generator
-----------------------------------------------
POST /api/generate-aptitude
Uses the Groq SDK
"""

import os
import re
import json
import logging
from groq import Groq
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv("supabase_conn.env")

# Configure logging
logging.basicConfig(level=logging.INFO)
log = logging.getLogger("aptitude_gen")
router = APIRouter()

# ── Configure Groq client ────────────────────────────────────
_api_key = os.getenv("GROQ_API_KEY")

if not _api_key:
    log.error("❌ GROQ_API_KEY not set in environment variables!")
    log.error("   Please add GROQ_API_KEY to supabase_conn.env")
else:
    log.info(f"✅ GROQ_API_KEY loaded (starts with: {_api_key[:10]}...)")

# Only create client if key exists
client = None
if _api_key:
    try:
        client = Groq(api_key=_api_key)
        log.info("✅ Groq client initialized successfully")
    except Exception as e:
        log.error(f"❌ Failed to initialize Groq client: {e}")

# ── Request model ────────────────────────────────────────────
class AptitudeRequest(BaseModel):
    career:             str
    interests:          list[str]
    personality:        dict
    ageGroup:           str = "18+"
    difficultyGuidance: str = ""


# ── Prompt builder ───────────────────────────────────────────
def build_prompt(career: str, interests: list[str], personality: dict, difficulty_guidance: str = "") -> str:
    return f"""You are an expert aptitude test designer for a career guidance platform.

Generate exactly 10 aptitude test questions for a student interested in becoming a "{career}".

Student profile:
- Top interests: {", ".join(interests[:5]) if interests else "not specified"}
- Personality traits: {json.dumps(personality)}

DIFFICULTY GUIDANCE:
{difficulty_guidance if difficulty_guidance else "Create a balanced mix of easy, medium, and hard questions appropriate for the career level."}

STRICT REQUIREMENTS:
1. Every question must test a real, practical skill needed for "{career}"
2. Difficulty distribution: 3 easy, 4 medium, 3 hard
3. Points must be: easy=10, medium=20, hard=30
4. Time must be:   easy=30, medium=45, hard=60
5. Each question must have exactly 4 answer options
6. "correct" is a 0-based index — must be 0, 1, 2, or 3
7. Wrong options must be plausible, not obviously incorrect
8. Test judgment and practical thinking, not memorization
9. Make questions engaging, relevant, and specific to the career
10. For age groups 10-15: use simple language and encouraging tone
11. For age groups 15-18: use moderate complexity with real-world scenarios
12. For age groups 18+: use professional terminology and workplace situations

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


# ── Mock questions for fallback ──────────────────────────────
def get_mock_questions(career: str, age_group: str = "18+") -> list[dict]:
    """Return mock questions when Groq is unavailable"""
    log.warning(f"⚠️ Using mock questions for {career} (age: {age_group})")
    
    templates = {
        '10-15': [
            {"q": f"What does a {career} do at work?", "opts": ["Creates things", "Helps people", "Solves problems", "All of these"], "correct": 3},
            {"q": f"What skill helps a {career} succeed?", "opts": ["Creativity", "Teamwork", "Curiosity", "All of these"], "correct": 3},
            {"q": f"How does a {career} help others?", "opts": ["By solving problems", "By creating things", "By making life better", "All of these"], "correct": 3},
        ],
        '15-18': [
            {"q": f"What is key for a successful {career}?", "opts": ["Technical skills", "Communication", "Problem-solving", "All of these"], "correct": 3},
            {"q": f"How to prepare for a {career} role?", "opts": ["Study relevant subjects", "Build portfolio", "Get internship", "All of these"], "correct": 3},
            {"q": f"What soft skill matters most?", "opts": ["Adaptability", "Teamwork", "Time management", "All of these"], "correct": 3},
        ],
        '18+': [
            {"q": f"What defines an excellent {career}?", "opts": ["Expertise", "Leadership", "Innovation", "All of these"], "correct": 3},
            {"q": f"Best way to advance as a {career}?", "opts": ["Continuous learning", "Networking", "Delivering results", "All of these"], "correct": 3},
            {"q": f"How to handle workplace challenges?", "opts": ["Analyze and adapt", "Seek mentorship", "Stay professional", "All of these"], "correct": 3},
        ]
    }
    
    base = templates.get(age_group, templates['18+'])
    
    questions = []
    for i, t in enumerate(base):
        questions.append({
            "id": i + 1,
            "question": t["q"],
            "options": t["opts"],
            "correct": t["correct"],
            "difficulty": "easy" if i < 2 else "medium" if i < 4 else "hard",
            "points": 10 if i < 2 else 20 if i < 4 else 30,
            "time": 40 if i < 2 else 50 if i < 4 else 60,
            "skill": ["General Knowledge", "Critical Thinking", "Problem Solving", "Professional Skills", "Career Awareness"][i % 5]
        })
    
    while len(questions) < 10:
        n = len(questions) + 1
        questions.append({
            "id": n,
            "question": f"Important quality #{n} for a {career}?",
            "options": ["Skill", "Attitude", "Experience", "All of these"],
            "correct": 3,
            "difficulty": "medium" if n < 7 else "hard",
            "points": 20 if n < 7 else 30,
            "time": 45 if n < 7 else 60,
            "skill": "General"
        })
    
    return questions[:10]


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
    if client is None:
        raise RuntimeError("Groq client not initialized - API key missing")
    
    log.info("📤 Sending request to Groq API...")
    
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

    raw = response.choices[0].message.content
    log.info(f"📥 Received response ({len(raw)} chars)")
    
    # Clean the response
    raw = raw.strip()
    raw = re.sub(r"^```(?:json)?\s*", "", raw, flags=re.MULTILINE)
    raw = re.sub(r"\s*```$", "", raw, flags=re.MULTILINE)
    raw = raw.strip()

    try:
        data = json.loads(raw)
    except json.JSONDecodeError as e:
        log.error(f"❌ JSON decode error: {e}")
        log.error(f"Raw response: {raw[:500]}...")
        raise

    if "questions" not in data or not isinstance(data["questions"], list):
        raise ValueError("Response JSON missing 'questions' array")

    return data["questions"]


# ── Route ────────────────────────────────────────────────────
@router.post("/api/generate-aptitude")
async def generate_aptitude(body: AptitudeRequest):
    log.info(f"🎯 Generating questions for career: '{body.career}', Age: {body.ageGroup}")
    
    if not body.career or len(body.career.strip()) < 2:
        raise HTTPException(status_code=400, detail="Career field is required.")

    # If no API key, use mock questions
    if not _api_key or client is None:
        log.warning("⚠️ No Groq API key configured, using mock questions")
        validated = get_mock_questions(body.career, body.ageGroup)
        total_points = sum(q["points"] for q in validated)
        return {
            "questions": validated,
            "career": body.career,
            "total_points": total_points,
        }

    MAX_RETRIES = 3
    last_error  = "Unknown error"

    for attempt in range(1, MAX_RETRIES + 1):
        try:
            log.info(f"🔄 Attempt {attempt}/{MAX_RETRIES}")

            prompt        = build_prompt(body.career, body.interests, body.personality, body.difficultyGuidance)
            raw_questions = call_groq(prompt)
            validated     = validate_questions(raw_questions)

            total_points = sum(q["points"] for q in validated)
            log.info(f"✅ Success: {len(validated)} questions, {total_points} pts")

            return {
                "questions":    validated,
                "career":       body.career,
                "total_points": total_points,
            }

        except json.JSONDecodeError as e:
            last_error = f"Groq returned invalid JSON: {e}"
            log.warning(f"⚠️ Attempt {attempt}: {last_error}")

        except ValueError as e:
            last_error = str(e)
            log.warning(f"⚠️ Attempt {attempt}: Validation failed — {last_error}")

        except Exception as e:
            last_error = str(e)
            log.error(f"❌ Attempt {attempt}: Unexpected error — {last_error}")

    # If all retries failed, use mock questions as fallback
    log.warning(f"⚠️ All {MAX_RETRIES} attempts failed, using mock questions")
    validated = get_mock_questions(body.career, body.ageGroup)
    total_points = sum(q["points"] for q in validated)
    return {
        "questions": validated,
        "career": body.career,
        "total_points": total_points,
    }


# Health check endpoint
@router.get("/api/aptitude-health")
async def health_check():
    return {
        "status": "ok",
        "groq_configured": _api_key is not None and client is not None,
        "message": "Groq API ready" if (_api_key and client) else "Using mock questions (no API key)"
    }