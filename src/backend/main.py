"""
main.py
=======
TrueNorth · FastAPI Application Entry Point
"""

import os
from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jose import jwt

# Local modules — import after FastAPI to catch errors early
from login_insert import register_user, login_user
from aptitude_gen import router as aptitude_router
from market_trends import analyze_trends, get_careers_with_trends, get_careers_by_domain, CAREER_DATA

# ── JWT config ────────────────────────────────────────────────
JWT_SECRET         = os.getenv("JWT_SECRET", "change-me-in-production")
JWT_ALGORITHM      = "HS256"
JWT_EXPIRE_MINUTES = 60

# ── App ───────────────────────────────────────────────────────
app = FastAPI(title="TrueNorth API", version="1.0.0")

# Mount aptitude/interest/personality/recommend routes
app.include_router(aptitude_router)

# ── CORS ──────────────────────────────────────────────────────
_allowed_origins = [
    "http://localhost:5173",   # Vite dev server
    "http://localhost:3000",   # CRA / alternative dev server
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Helpers ───────────────────────────────────────────────────
def create_jwt(user_id: str, email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": user_id, "email": email, "exp": expire},
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )


# ── Auth models ───────────────────────────────────────────────
class RegisterRequest(BaseModel):
    email: str
    username: str
    password: str


class LoginRequest(BaseModel):
    email: str
    password: str


# ── Auth endpoints ────────────────────────────────────────────
@app.post("/api/register", status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest):
    try:
        user = register_user(body.email, body.username, body.password)
        return {
            "message": "Account created.",
            "token": create_jwt(user["id"], user["email"]),
            "user": {
                "id": user["id"],
                "email": user["email"],
                "username": user["username"],
            },
        }
    except ValueError as e:
        raise HTTPException(status_code=409, detail=str(e))
    except RuntimeError as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.post("/api/login")
async def login(body: LoginRequest):
    try:
        user = login_user(body.email, body.password)
        return {
            "message": "Login successful.",
            "token": create_jwt(user["id"], user["email"]),
            "user": {
                "id": user["id"],
                "email": user["email"],
                "username": user["username"],
            },
        }
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))


# ── Health check ──────────────────────────────────────────────
@app.get("/api/health")
async def health():
    return {"status": "ok", "careers_loaded": len(CAREER_DATA.get("careers", []))}


# ── Market trends endpoints ───────────────────────────────────
class MarketTrendsRequest(BaseModel):
    ageGroup: str = "18+"


@app.post("/api/market-trends")
async def market_trends(body: MarketTrendsRequest):
    """
    Get AI-analyzed market trends for all career domains.
    Returns a dict of {category: {booming, stable, declining, summary}}.
    Falls back to curated static data if Groq is unavailable.
    """
    trends = analyze_trends(body.ageGroup)
    return {"trends": trends}


@app.get("/api/careers")
async def get_careers(domain: str = None):
    """
    Get all careers enriched with trend data.
    Optional ?domain= filter.
    """
    if domain:
        careers = get_careers_by_domain(domain)
    else:
        careers = get_careers_with_trends()
    return {"careers": careers, "total": len(careers)}


@app.get("/api/careers/domains")
async def get_domains():
    """List all unique career domains."""
    domains = sorted(set(c["category"] for c in CAREER_DATA["careers"]))
    return {"domains": domains, "total": len(domains)}


@app.get("/api/careers/{career_id}")
async def get_career_by_id(career_id: str):
    """Get a single career by its id field."""
    career = next((c for c in CAREER_DATA["careers"] if c["id"] == career_id), None)
    if not career:
        raise HTTPException(status_code=404, detail=f"Career '{career_id}' not found.")
    return career