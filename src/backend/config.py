import os
from dotenv import load_dotenv

load_dotenv("supabase_conn.env")

class Config:
    # ── Gemini ───────────────────────────────────────────────
    GEMINI_API_KEY: str = os.getenv("GEMINI_API_KEY", "")

    # ── Supabase ─────────────────────────────────────────────
    SUPABASE_URL: str  = os.getenv("SUPABASE_URL", "")
    SUPABASE_KEY: str  = os.getenv("SUPABASE_SERVICE_ROLE_KEY", "")

    # ── CORS ─────────────────────────────────────────────────
    ALLOWED_ORIGINS: list[str] = os.getenv(
        "ALLOWED_ORIGINS",
        "http://localhost:3000,http://localhost:5173"
    ).split(",")

    # ── Upload limits ─────────────────────────────────────────
    MAX_PDF_SIZE_MB: int   = int(os.getenv("MAX_PDF_SIZE_MB", 5))
    MAX_PDF_BYTES:   int   = MAX_PDF_SIZE_MB * 1024 * 1024