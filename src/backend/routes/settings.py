"""
routes/settings.py
------------------
Settings routes: get profile, update profile, change password, delete account/data.
"""

import re
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from typing import Optional
from services.auth import get_current_user_id      # auth.py lives in services/
from login_insert import hash_password, verify_password
from db_setup import supabase

router = APIRouter()

PASSWORD_RE = re.compile(
    r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{};\':"\\|,.<>/?]).{8,}$'
)


# ── Models ───────────────────────────────────────────────
class ProfileUpdate(BaseModel):
    username: Optional[str] = None   # ← "username" matches your DB column, not "name"
    phone:    Optional[str] = None
    location: Optional[str] = None
    bio:      Optional[str] = None
    avatar:   Optional[str] = None

class PasswordUpdate(BaseModel):
    current_password: str
    new_password:     str


# ── GET /api/settings/profile ────────────────────────────
@router.get("/settings/profile")
def get_profile(user_id: str = Depends(get_current_user_id)):
    result = (
        supabase.table("users")
        .select("id, email, username, phone, location, bio, avatar")
        .eq("id", user_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found.")
    return result.data


# ── PUT /api/settings/profile ────────────────────────────
@router.put("/settings/profile")
def update_profile(body: ProfileUpdate, user_id: str = Depends(get_current_user_id)):
    # Only send fields that were actually provided
    updates = {k: v for k, v in body.dict().items() if v is not None}
    if not updates:
        raise HTTPException(status_code=400, detail="No fields to update.")

    result = (
        supabase.table("users")
        .update(updates)
        .eq("id", user_id)
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=500, detail="Update failed.")
    return {"message": "Profile updated successfully.", "data": result.data[0]}


# ── PUT /api/settings/password ───────────────────────────
@router.put("/settings/password")
def change_password(body: PasswordUpdate, user_id: str = Depends(get_current_user_id)):
    result = (
        supabase.table("users")
        .select("password")
        .eq("id", user_id)
        .single()
        .execute()
    )
    if not result.data:
        raise HTTPException(status_code=404, detail="User not found.")

    if not verify_password(body.current_password, result.data["password"]):
        raise HTTPException(status_code=400, detail="Current password is incorrect.")

    if not PASSWORD_RE.match(body.new_password):
        raise HTTPException(
            status_code=400,
            detail="Password must be 8+ chars with uppercase, lowercase, a number, and a special character."
        )

    supabase.table("users").update(
        {"password": hash_password(body.new_password)}
    ).eq("id", user_id).execute()

    return {"message": "Password updated successfully."}


# ── DELETE /api/settings/data ────────────────────────────
@router.delete("/settings/data")
def delete_user_data(user_id: str = Depends(get_current_user_id)):
    supabase.table("users").update({
        "phone": "", "location": "", "bio": "", "avatar": ""
    }).eq("id", user_id).execute()
    return {"message": "All data cleared successfully."}


# ── DELETE /api/settings/account ─────────────────────────
@router.delete("/settings/account")
def delete_account(user_id: str = Depends(get_current_user_id)):
    result = supabase.table("users").delete().eq("id", user_id).execute()
    if not result.data:
        raise HTTPException(status_code=500, detail="Account deletion failed.")
    return {"message": "Account deleted successfully."}