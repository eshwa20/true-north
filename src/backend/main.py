from dotenv import load_dotenv
load_dotenv()

import os
print("JWT_SECRET loaded:", os.getenv("JWT_SECRET"))

from datetime import datetime, timedelta, timezone

from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from jose import jwt
from login_insert import register_user, login_user
from config import Config
from routes.resume import router as resume_router
from aptitude_gen import router as aptitude_router
from services.chat_service import chat                        # ← changed from chat_engine
from routes.settings import router as settings_router   # ← add
  

JWT_SECRET         = os.getenv("JWT_SECRET")
JWT_ALGORITHM      = "HS256"
JWT_EXPIRE_MINUTES = 1440

app = FastAPI(title="TrueNorth API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization"],
)

app.include_router(aptitude_router)
app.include_router(resume_router, prefix="/api")
app.include_router(settings_router, prefix="/api")


def create_jwt(user_id: str, email: str) -> str:
    expire = datetime.now(timezone.utc) + timedelta(minutes=JWT_EXPIRE_MINUTES)
    return jwt.encode(
        {"sub": str(user_id), "email": email, "exp": expire},
        JWT_SECRET,
        algorithm=JWT_ALGORITHM,
    )


class RegisterRequest(BaseModel):
    email:    str
    username: str
    password: str

class LoginRequest(BaseModel):
    email: str
    password: str

class ChatMessage(BaseModel):
    role:    str
    content: str

class ChatRequest(BaseModel):
    messages: list[ChatMessage]


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


@app.post("/api/chat")
async def chat_endpoint(body: ChatRequest):
    if not body.messages:
        raise HTTPException(status_code=400, detail="messages list cannot be empty.")
    if body.messages[-1].role != "user":
        raise HTTPException(status_code=400, detail="Last message must be from user.")
    try:
        reply = chat([{"role": m.role, "content": m.content} for m in body.messages])
        return {"reply": reply}
    except RuntimeError as e:
        raise HTTPException(status_code=502, detail=str(e))


@app.get("/health")
def health_check():
    return {"status": "ok", "service": "truenorth-api"}

@app.get("/api/health")
async def api_health():
    return {"status": "ok"}