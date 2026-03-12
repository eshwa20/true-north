import os
from datetime import datetime, timedelta, timezone
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jose import jwt
from login_insert import register_user, login_user

JWT_SECRET         = os.getenv("JWT_SECRET", "change-me-in-production")
JWT_ALGORITHM      = "HS256"
JWT_EXPIRE_MINUTES = 60

app = FastAPI(title="TrueNorth API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def create_jwt(user_id: str, email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": user_id, "email": email, "exp": expire},
        JWT_SECRET, algorithm=JWT_ALGORITHM
    )

class RegisterRequest(BaseModel):
    email:    str
    username: str
    password: str

class LoginRequest(BaseModel):
    email:    str
    password: str

@app.post("/api/register", status_code=status.HTTP_201_CREATED)
async def register(body: RegisterRequest):
    try:
        user = register_user(body.email, body.username, body.password)
        return {
            "message": "Account created.",
            "token":   create_jwt(user["id"], user["email"]),
            "user":    {"id": user["id"], "email": user["email"], "username": user["username"]},
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
            "token":   create_jwt(user["id"], user["email"]),
            "user":    {"id": user["id"], "email": user["email"], "username": user["username"]},
        }
    except ValueError as e:
        raise HTTPException(status_code=401, detail=str(e))

@app.get("/api/health")
async def health():
    return {"status": "ok"}