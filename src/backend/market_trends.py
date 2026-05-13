"""
market_trends.py
================
TrueNorth · Market Trend Analyzer
----------------------------------
Uses Groq AI to identify booming / stable / declining careers.
Falls back to a curated static list if AI is unavailable.

Title strings in STATIC_TRENDS exactly match all-careers.json titles
so that the front-end "Hot" badge fires correctly.
"""

import os
import json
import logging
from groq import Groq
from dotenv import load_dotenv

load_dotenv("supabase_conn.env")

logging.basicConfig(level=logging.INFO)
log = logging.getLogger("market_trends")

_api_key = os.getenv("GROQ_API_KEY")
client = Groq(api_key=_api_key) if _api_key else None

# ── Locate all-careers.json ───────────────────────────────────
BASE_DIR = os.path.dirname(os.path.abspath(__file__))   # .../src/backend
SRC_DIR  = os.path.dirname(BASE_DIR)                    # .../src

_CANDIDATE_PATHS = [
    os.path.join(SRC_DIR, "data", "all-careers.json"),          # src/data/
    os.path.join(BASE_DIR, "..", "data", "all-careers.json"),    # src/backend/../data/
    os.path.join(BASE_DIR, "data", "all-careers.json"),          # src/backend/data/
    os.path.join(BASE_DIR, "all-careers.json"),                  # same dir as script
]

CAREER_DATA: dict = {"careers": []}

for _path in _CANDIDATE_PATHS:
    _path = os.path.abspath(_path)
    if os.path.exists(_path):
        try:
            with open(_path, "r", encoding="utf-8") as _f:
                CAREER_DATA = json.load(_f)
            log.info(f"✅ Loaded {len(CAREER_DATA.get('careers', []))} careers from {_path}")
            break
        except Exception as _e:
            log.error(f"❌ Could not read {_path}: {_e}")
else:
    log.warning("⚠️ all-careers.json not found — using inline fallback data")
    CAREER_DATA = {
        "careers": [
            {"id":"tech1","title":"Software Developer","category":"Technology","skills":["Programming"],"salary":"$70k-$150k","growth":"22%"},
            {"id":"tech6","title":"Data Scientist","category":"Technology","skills":["Python","Statistics","ML"],"salary":"$85k-$165k","growth":"36%"},
            {"id":"tech8","title":"ML Engineer","category":"Technology","skills":["Python","TensorFlow"],"salary":"$100k-$180k","growth":"35%"},
            {"id":"tech9","title":"AI Engineer","category":"Technology","skills":["Python","NLP"],"salary":"$100k-$180k","growth":"35%"},
            {"id":"tech10","title":"Cybersecurity Analyst","category":"Technology","skills":["Network Security"],"salary":"$70k-$130k","growth":"32%"},
            {"id":"tech11","title":"Cloud Architect","category":"Technology","skills":["AWS","Azure"],"salary":"$120k-$200k","growth":"15%"},
            {"id":"design1","title":"Graphic Designer","category":"Design","skills":["Adobe Suite"],"salary":"$45k-$85k","growth":"3%"},
            {"id":"design2","title":"UX/UI Designer","category":"Design","skills":["Figma"],"salary":"$65k-$130k","growth":"16%"},
            {"id":"health1","title":"Doctor","category":"Healthcare","skills":["Diagnosis"],"salary":"$150k-$350k","growth":"3%"},
            {"id":"biz1","title":"Product Manager","category":"Business","skills":["Strategy"],"salary":"$90k-$160k","growth":"10%"},
            {"id":"edu1","title":"Teacher","category":"Education","skills":["Teaching"],"salary":"$40k-$80k","growth":"4%"},
            {"id":"fin1","title":"Investment Banker","category":"Finance","skills":["Financial Modeling"],"salary":"$100k-$300k","growth":"5%"},
            {"id":"fin3","title":"Actuary","category":"Finance","skills":["Statistics","Risk Assessment"],"salary":"$80k-$180k","growth":"21%"},
        ]
    }


# ── Static trends (titles match all-careers.json exactly) ────
STATIC_TRENDS: dict = {
    "Technology": {
        "booming": [
            "AI Engineer", "ML Engineer", "Data Scientist",
            "Cybersecurity Analyst", "Cloud Architect", "DevOps Engineer",
        ],
        "stable": [
            "Software Developer", "Frontend Developer", "Backend Developer",
            "Full-Stack Developer", "Mobile App Developer", "Data Analyst",
            "QA Engineer", "Blockchain Developer",
        ],
        "declining": ["Game Developer"],
        "summary": "AI, cloud, and security roles are surging in 2025-2026.",
    },
    "Design": {
        "booming": ["UX/UI Designer", "Product Designer", "Motion Designer"],
        "stable": [
            "Graphic Designer", "Illustrator", "Animator",
            "Art Director", "Brand Designer",
        ],
        "declining": ["Fashion Designer"],
        "summary": "Digital and product design are in high demand.",
    },
    "Healthcare": {
        "booming": [
            "Physical Therapist", "Occupational Therapist",
            "Psychiatrist",
        ],
        "stable": ["Doctor", "Surgeon", "Nurse", "Pharmacist", "Dentist", "Veterinarian"],
        "declining": [],
        "summary": "Mental health and rehabilitation specialties are growing fast.",
    },
    "Business": {
        "booming": ["Product Manager", "Management Consultant"],
        "stable": [
            "Marketing Manager", "Financial Analyst", "HR Manager",
            "Operations Manager",
        ],
        "declining": ["Sales Manager"],
        "summary": "Tech-savvy business roles lead growth.",
    },
    "Finance": {
        "booming": ["Quantitative Analyst", "Actuary", "Financial Advisor"],
        "stable": ["Investment Banker", "CPA", "Financial Analyst"],
        "declining": [],
        "summary": "Quant and fintech skills are commanding premiums.",
    },
    "Education": {
        "booming": ["EdTech Specialist", "Corporate Trainer"],
        "stable": ["Teacher", "Professor", "School Counselor"],
        "declining": [],
        "summary": "Online learning and corporate training are booming.",
    },
    "Media": {
        "booming": ["Content Creator", "Podcast Producer"],
        "stable": ["Film Director", "Public Relations Specialist"],
        "declining": ["Journalist"],
        "summary": "Digital content creation dominates.",
    },
    "Skilled Trades": {
        "booming": ["Electrician", "HVAC Technician"],
        "stable": ["Plumber", "Welder", "Carpenter"],
        "declining": [],
        "summary": "Critical trade shortages drive high demand.",
    },
    "Legal": {
        "booming": ["Lawyer", "Paralegal"],
        "stable": ["Judge"],
        "declining": [],
        "summary": "Tech law and privacy are emerging specialties.",
    },
    "Science": {
        "booming": ["Research Scientist", "Environmental Scientist"],
        "stable": ["Marine Biologist", "Astronomer"],
        "declining": [],
        "summary": "Climate science and biotech see strong growth.",
    },
    "Sports": {
        "booming": ["Coach"],
        "stable": ["Athlete", "Sports Medicine Physician"],
        "declining": [],
        "summary": "Coaching and sports analytics are growing.",
    },
    "Agriculture": {
        "booming": ["Agronomist"],
        "stable": ["Farmer"],
        "declining": [],
        "summary": "AgriTech and precision farming are reshaping the field.",
    },
    "Hospitality": {
        "booming": ["Event Planner"],
        "stable": ["Chef", "Hotel Manager"],
        "declining": [],
        "summary": "Experiential hospitality leads recovery.",
    },
    "Real Estate": {
        "booming": ["Real Estate Agent", "Architect"],
        "stable": ["Property Manager"],
        "declining": [],
        "summary": "PropTech and sustainable building are transforming the sector.",
    },
    "Government": {
        "booming": ["Urban Planner"],
        "stable": ["Diplomat", "Firefighter"],
        "declining": [],
        "summary": "Climate and cyber policy roles are expanding.",
    },
    "Social Services": {
        "booming": ["Therapist", "Social Worker"],
        "stable": ["Nonprofit Director"],
        "declining": [],
        "summary": "Mental health demand is at an all-time high.",
    },
}


# ── AI trend analysis ─────────────────────────────────────────
def analyze_trends(age_group: str = "18+") -> dict:
    """
    Call Groq to get market trends for 2025-2026.
    Falls back to STATIC_TRENDS on any failure.
    """
    if not client:
        log.warning("No Groq API key — returning static trends")
        return STATIC_TRENDS

    # Build category list from loaded careers
    categories = sorted(set(c["category"] for c in CAREER_DATA["careers"]))
    career_titles_by_cat: dict = {}
    for c in CAREER_DATA["careers"]:
        career_titles_by_cat.setdefault(c["category"], []).append(c["title"])

    prompt = f"""You are a job market analyst. Analyze current market trends for 2025-2026 for age group: {age_group}.

For each career domain below, classify the listed job titles as booming, stable, or declining.
Use ONLY the exact titles provided — do not invent new ones.

Domains and their available titles:
{json.dumps(career_titles_by_cat, indent=2)}

Return ONLY valid JSON in exactly this format:
{{
  "trends": {{
    "Technology": {{
      "booming": ["AI Engineer", "ML Engineer"],
      "stable": ["Software Developer"],
      "declining": [],
      "summary": "AI and cloud roles surge in 2025"
    }}
  }}
}}"""

    try:
        response = client.chat.completions.create(
            model="llama-3.1-8b-instant",
            messages=[
                {"role": "system", "content": "Job market analyst. Valid JSON only."},
                {"role": "user", "content": prompt},
            ],
            temperature=0.4,
            max_tokens=3000,
            response_format={"type": "json_object"},
        )
        raw = response.choices[0].message.content
        data = json.loads(raw)
        trends = data.get("trends", {})

        # Validate: ensure all titles in results actually exist in our careers JSON
        all_valid_titles = set(c["title"] for c in CAREER_DATA["careers"])
        for cat, cat_data in trends.items():
            for status in ("booming", "stable", "declining"):
                if status in cat_data:
                    cat_data[status] = [t for t in cat_data[status] if t in all_valid_titles]

        log.info(f"✅ AI market trends analyzed for {len(trends)} categories")
        return trends if trends else STATIC_TRENDS

    except Exception as e:
        log.error(f"❌ Trend analysis failed: {e} — using static trends")
        return STATIC_TRENDS


# ── Public helpers ────────────────────────────────────────────
def get_careers_with_trends(age_group: str = "18+") -> list:
    """Enrich every career in CAREER_DATA with its trend status."""
    trends = analyze_trends(age_group)
    enriched = []
    for career in CAREER_DATA["careers"]:
        cat   = career["category"]
        title = career["title"]
        status = "stable"
        if cat in trends:
            if title in trends[cat].get("booming", []):
                status = "booming"
            elif title in trends[cat].get("declining", []):
                status = "declining"
        enriched.append({
            **career,
            "trend": status,
            "market_summary": trends.get(cat, {}).get("summary", ""),
        })
    return enriched


def get_careers_by_domain(domain: str) -> list:
    """Return all careers for a given domain (case-insensitive)."""
    return [c for c in CAREER_DATA["careers"] if c["category"].lower() == domain.lower()]