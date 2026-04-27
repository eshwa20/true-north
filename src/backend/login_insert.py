"""
login-insert.py
===============
TrueNorth · User Register & Login Logic
-----------------------------------------
Called by the FastAPI backend to insert new users (register)
and verify existing users (login) against the Supabase users table.

Import into your backend:
    from login_insert import register_user, login_user
"""

import re
import bcrypt
from db_setup import supabase

# ── Regex validators (mirrors frontend rules) ────────────────
EMAIL_RE    = re.compile(r'^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$')
USERNAME_RE = re.compile(r'^[a-zA-Z0-9_]{3,20}$')
PASSWORD_RE = re.compile(
    r'^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{};\':"\\|,.<>/?]).{8,}$'
)

# ── Helpers ──────────────────────────────────────────────────
def hash_password(plain: str) -> str:
    return bcrypt.hashpw(plain.encode(), bcrypt.gensalt()).decode()

def verify_password(plain: str, hashed: str) -> bool:
    return bcrypt.checkpw(plain.encode(), hashed.encode())

# ── Validation ───────────────────────────────────────────────
def validate_fields(email: str, username: str = None, password: str = None):
    """Raises ValueError with a clear message if any field is invalid."""
    if not EMAIL_RE.match(email.strip()):
        raise ValueError("Invalid email address.")
    if username is not None and not USERNAME_RE.match(username.strip()):
        raise ValueError("Username must be 3–20 chars: letters, numbers, or underscores only.")
    if password is not None and not PASSWORD_RE.match(password):
        raise ValueError(
            "Password must be 8+ chars with uppercase, lowercase, a number, and a special character."
        )

# ── Register ─────────────────────────────────────────────────
def register_user(email: str, username: str, password: str) -> dict:
    """
    Validates, checks for duplicates, hashes the password,
    and inserts a new user into the users table.
    Returns the inserted user row on success.
    Raises ValueError for validation/duplicate errors.
    """
    email    = email.strip().lower()
    username = username.strip()

    validate_fields(email, username, password)

    # Duplicate email check
    if supabase.table("users").select("id").eq("email", email).execute().data:
        raise ValueError("An account with this email already exists.")

    # Duplicate username check
    if supabase.table("users").select("id").eq("username", username).execute().data:
        raise ValueError("This username is already taken.")

    # Insert
    result = supabase.table("users").insert({
        "email":    email,
        "username": username,
        "password": hash_password(password),
    }).execute()

    if not result.data:
        raise RuntimeError("Insert failed. Check your Supabase table permissions.")

    return result.data[0]


# ── Login ────────────────────────────────────────────────────
def login_user(email: str, password: str) -> dict:
    """
    Looks up the user by email and verifies the password.
    Returns the user row on success.
    Raises ValueError on invalid credentials.
    """
    email = email.strip().lower()

    validate_fields(email)

    result = (
        supabase.table("users")
        .select("id, email, username, password")
        .eq("email", email)
        .single()
        .execute()
    )

    # Same generic message for wrong email or wrong password (prevents user enumeration)
    if not result.data or not verify_password(password, result.data["password"]):
        raise ValueError("Invalid email or password.")

    return result.data