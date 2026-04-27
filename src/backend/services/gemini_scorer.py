from __future__ import annotations
import json
import re
import google.generativeai as genai
from config import Config

genai.configure(api_key=Config.GEMINI_API_KEY)
_model = genai.GenerativeModel("gemini-2.5-flash-lite")


def _build_prompt(resume_text: str, job_role: str | None) -> str:
    job_context = (
        f'The candidate is applying for: "{job_role}". '
        "Factor this heavily into keyword analysis, experience relevance, and skills match. "
        "Tailor every piece of feedback specifically to this role."
        if job_role
        else "No specific job role was provided. Give thorough general resume advice."
    )

    return f"""
You are a senior hiring manager and professional resume coach with 15+ years of experience.
Analyse the resume below and return a JSON object — nothing else, no markdown fences, just raw JSON.

{job_context}

Score each of the 6 categories on a scale of 0–100 and provide DETAILED, SPECIFIC feedback:

1. contact     — Name, email, phone, location, LinkedIn/GitHub present and well-formatted
2. summary     — Professional summary exists, is concise, tailored, and impactful
3. experience  — Work history completeness, strong action verbs, quantified achievements with real numbers, recency
4. skills      — Relevant skills listed, grouped logically, appropriate depth, no fluff
5. education   — Degree, institution, dates present; relevant coursework or certifications
6. formatting  — Clean layout, consistent spacing, bullet points, ATS-friendliness, no typos, proper length

IMPORTANT FEEDBACK RULES:
- Each feedback tip MUST be a single, highly specific, actionable sentence
- Reference actual content FROM the resume when giving feedback (e.g. "Your role at X company lacks metrics — add numbers like 'increased sales by 30%'")
- Never give vague advice like "add more details" — always say exactly WHAT to add
- For experience: point out specific bullet points that need quantification
- For skills: name specific missing skills relevant to the role
- For summary: suggest specific improvements to their actual summary text
- Feedback should feel like it came from a real career coach reviewing THIS specific resume

Return EXACTLY this JSON shape (no extra keys, no comments):
{{
  "overall": <integer 0-100, weighted average>,
  "categories": {{
    "contact":    {{ "score": <int>, "feedback": ["<specific_tip1>", "<specific_tip2>", "<specific_tip3>"] }},
    "summary":    {{ "score": <int>, "feedback": ["<specific_tip1>", "<specific_tip2>", "<specific_tip3>"] }},
    "experience": {{ "score": <int>, "feedback": ["<specific_tip1>", "<specific_tip2>", "<specific_tip3>"] }},
    "skills":     {{ "score": <int>, "feedback": ["<specific_tip1>", "<specific_tip2>", "<specific_tip3>"] }},
    "education":  {{ "score": <int>, "feedback": ["<specific_tip1>", "<specific_tip2>", "<specific_tip3>"] }},
    "formatting": {{ "score": <int>, "feedback": ["<specific_tip1>", "<specific_tip2>", "<specific_tip3>"] }}
  }},
  "strengths": [
    "<specific_strength_referencing_actual_resume_content_1>",
    "<specific_strength_referencing_actual_resume_content_2>",
    "<specific_strength_referencing_actual_resume_content_3>"
  ],
  "improvements": [
    "<highly_specific_improvement_with_exact_action_to_take_1>",
    "<highly_specific_improvement_with_exact_action_to_take_2>",
    "<highly_specific_improvement_with_exact_action_to_take_3>",
    "<highly_specific_improvement_with_exact_action_to_take_4>"
  ],
  "keywords_missing": ["<keyword1>", "<keyword2>", "<keyword3>", "<keyword4>", "<keyword5>"]
}}

Scoring weights for overall:
- experience  30%
- skills      20%
- summary     15%
- formatting  15%
- contact     10%
- education   10%

keywords_missing rules:
- Must be real keywords/phrases NOT found anywhere in the resume text
- If job_role is given, must be role-specific technical skills or industry terms
- Examples: specific tools, frameworks, methodologies, certifications relevant to the role

━━━━━━━━━━━━━━━━━ RESUME TEXT ━━━━━━━━━━━━━━━━━
{resume_text[:12000]}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
"""


def _parse_response(raw: str) -> dict:
    cleaned = re.sub(r"^```(?:json)?\s*", "", raw.strip(), flags=re.IGNORECASE)
    cleaned = re.sub(r"\s*```$", "", cleaned.strip())

    try:
        data = json.loads(cleaned)
    except json.JSONDecodeError as e:
        raise ValueError(f"Gemini returned invalid JSON: {e}\n\nRaw:\n{raw[:500]}")

    required = {"overall", "categories", "strengths", "improvements", "keywords_missing"}
    missing  = required - data.keys()
    if missing:
        raise ValueError(f"Gemini response missing keys: {missing}")

    return data


def score_resume(resume_text: str, job_role: str | None = None) -> dict:
    """Call Gemini and return structured scoring dict."""
    prompt = _build_prompt(resume_text, job_role)

    try:
        response = _model.generate_content(
            prompt,
            generation_config=genai.GenerationConfig(
                temperature=0.3,
                max_output_tokens=2500,
            ),
        )
    except Exception as e:
        raise RuntimeError(f"Gemini API call failed: {e}")

    raw_text = response.text
    if not raw_text:
        raise RuntimeError("Gemini returned an empty response.")

    return _parse_response(raw_text)