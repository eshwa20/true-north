from __future__ import annotations
from datetime import datetime, timezone
from db.supabase_client import get_supabase

TABLE = "resume_scans"


def save_scan(
    user_id: str,
    file_name: str,
    job_role: str | None,
    overall_score: int,
    categories: dict,
    strengths: list[str],
    improvements: list[str],
    keywords_missing: list[str],
) -> dict:
    payload = {
        "user_id":          user_id,
        "file_name":        file_name,
        "job_role":         job_role or None,
        "overall_score":    overall_score,
        "categories":       categories,
        "strengths":        strengths,
        "improvements":     improvements,
        "keywords_missing": keywords_missing,
        "created_at":       datetime.now(timezone.utc).isoformat(),
    }
    response = get_supabase().table(TABLE).insert(payload).execute()
    return response.data[0] if response.data else {}


def get_user_scans(user_id: str, limit: int = 10) -> list[dict]:
    response = (
        get_supabase()
        .table(TABLE)
        .select("id, file_name, job_role, overall_score, created_at")
        .eq("user_id", user_id)
        .order("created_at", desc=True)
        .limit(limit)
        .execute()
    )
    return response.data or []


def get_scan_by_id(scan_id: str, user_id: str) -> dict | None:
    response = (
        get_supabase()
        .table(TABLE)
        .select("*")
        .eq("id", scan_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    return response.data