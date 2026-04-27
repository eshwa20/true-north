from __future__ import annotations
from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from fastapi.responses import JSONResponse

from config import Config
from services.auth import get_current_user_id
from services.pdf_parser import extract_text_from_pdf
from services.gemini_scorer import score_resume
from db.scan_repository import save_scan, get_user_scans, get_scan_by_id

router = APIRouter()



# ── POST /api/score-resume ────────────────────────────────────
@router.post("/score-resume")
async def score(
    file:     UploadFile = File(..., description="PDF resume file"),
    job_role: str        = Form("",  description="Target job role (optional)"),
    user_id:  str        = Depends(get_current_user_id),
):
    print("[DEBUG] user_id inside route =", user_id)
    print(f"[DEBUG] user_id from token = {repr(user_id)}")
    # ── 1. Validate file type ──
    if not file.filename or not file.filename.lower().endswith(".pdf"):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only PDF files are accepted.",
        )

    # ── 2. Read & size-check ──
    pdf_bytes = await file.read()
    if len(pdf_bytes) > Config.MAX_PDF_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File too large. Maximum size is {Config.MAX_PDF_SIZE_MB} MB.",
        )

    clean_role = job_role.strip() or None

    # ── 3. Extract text ──
    try:
        resume_text = extract_text_from_pdf(pdf_bytes)
    except ValueError as e:
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY, detail=str(e))

    # ── 4. Score with Gemini ──
    try:
        result = score_resume(resume_text, clean_role)
    except ValueError as e:
        raise HTTPException(status_code=502, detail=f"AI scoring failed: {e}")
    except RuntimeError as e:
        raise HTTPException(status_code=503, detail=str(e))

    # ── 5. Save to Supabase ──
    try:
        saved = save_scan(
            user_id          = user_id,
            file_name        = file.filename,
            job_role         = clean_role,
            overall_score    = result["overall"],
            categories       = result["categories"],
            strengths        = result["strengths"],
            improvements     = result["improvements"],
            keywords_missing = result["keywords_missing"],
        )
        result["scan_id"] = saved.get("id")
    except Exception as e:
        # DB failure is non-fatal — still return the score
        print(f"[WARN] Failed to save scan: {e}")
        result["scan_id"] = None

    return result


# ── GET /api/scan-history ─────────────────────────────────────
@router.get("/scan-history")
async def scan_history(
    limit:   int = 10,
    user_id: str = Depends(get_current_user_id),
):
    limit = min(limit, 50)
    scans = get_user_scans(user_id, limit=limit)
    return {"scans": scans}


# ── GET /api/scan/{scan_id} ───────────────────────────────────
@router.get("/scan/{scan_id}")
async def get_scan(
    scan_id: str,
    user_id: str = Depends(get_current_user_id),
):
    scan = get_scan_by_id(scan_id, user_id)
    if not scan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Scan not found or access denied.",
        )
    return scan

@router.delete("/scan/{scan_id}")
async def delete_scan(scan_id: str, user_id: str = Depends(get_current_user_id)):
    from db.supabase_client import get_supabase

    response = (
        get_supabase()
        .table("resume_scans")
        .delete()
        .eq("id", scan_id)
        .eq("user_id", user_id)
        .execute()
    )

    return {"message": "Deleted successfully"}
