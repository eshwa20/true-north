"""
chat_engine.py
--------------
Uses google/flan-t5-large with a detailed career-focused prompt.
No fine-tuning needed — works out of the box.
Model size: ~800MB, runs on CPU (slow ~10s) or GPU (fast ~1s)
"""

from __future__ import annotations
import torch
from transformers import T5ForConditionalGeneration, T5Tokenizer

# ── MODEL ─────────────────────────────────────────────────
MODEL_NAME = "google/flan-t5-large"

print(f"[chat_engine] Loading {MODEL_NAME} ...")
_tokenizer = T5Tokenizer.from_pretrained(MODEL_NAME)
_model     = T5ForConditionalGeneration.from_pretrained(MODEL_NAME)
_model.eval()
print("[chat_engine] Model loaded ✅")

# ── OFF-TOPIC FILTER ──────────────────────────────────────
OFF_TOPIC_KEYWORDS = [
    "virat", "kohli", "sachin", "tendulkar", "dhoni", "rohit sharma",
    "shah rukh", "salman khan", "deepika", "ranveer", "alia", "katrina",
    "modi", "rahul gandhi", "kejriwal", "trump", "biden", "obama", "putin",
    "elon musk", "bill gates", "zuckerberg",
    "cricket", "ipl", "t20", "football", "fifa", "nba", "tennis",
    "bollywood", "hollywood", "movie", "film", "netflix", "web series",
    "song", "album", "singer", "actor", "actress",
    "girlfriend", "boyfriend", "wife", "husband", "marriage", "dating",
    "capital of", "population of", "who invented", "who discovered",
    "weather", "recipe", "cook", "food",
    "bitcoin", "crypto", "stock price",
]

OFF_TOPIC_REPLY = (
    "I'm TrueNorth Assistant and I'm only here to help with career guidance "
    "and resume advice. Try asking me something like "
    "'How do I become a data scientist?' 😊"
)

# ── STATIC REPLIES ────────────────────────────────────────
STATIC = [
    {
        "triggers": ["hi", "hello", "hey", "good morning", "good evening"],
        "response": "Hey 👋 I'm your TrueNorth career assistant!\nAsk me about careers, resume tips, job roles, or skills to learn. What would you like to know?",
    },
    {
        "triggers": ["thank you", "thanks", "thank u", "helpful"],
        "response": "You're welcome! 😊 Feel free to ask anything else about your career journey.",
    },
    {
        "triggers": ["what can you do", "how can you help", "what do you know"],
        "response": "I can help you with:\n• Career path comparisons (e.g. Data Analyst vs Scientist)\n• Resume writing tips\n• Skills to learn for any tech role\n• Interview preparation\n• Salary expectations in India\n• Career roadmaps\n\nJust ask away! 🚀",
    },
]


def _is_off_topic(text: str) -> bool:
    lower = text.lower()
    return any(kw in lower for kw in OFF_TOPIC_KEYWORDS)


def _check_static(text: str) -> str | None:
    lower = text.lower()
    for entry in STATIC:
        if any(trigger in lower for trigger in entry["triggers"]):
            return entry["response"]
    return None


def _build_prompt(user_message: str) -> str:
    return f"""You are an expert career advisor for students and professionals in India.
Answer the following career question with:
- Clear step-by-step guidance
- Specific skills to learn
- Realistic salary range in INR
- Practical tips for Indian job market

Question: {user_message}

Provide a detailed, helpful answer:"""


def _generate(user_message: str) -> str:
    prompt = _build_prompt(user_message)

    inputs = _tokenizer(
        prompt,
        return_tensors="pt",
        max_length=512,
        truncation=True,
    )

    with torch.no_grad():
        outputs = _model.generate(
            input_ids            = inputs["input_ids"],
            attention_mask       = inputs["attention_mask"],
            max_new_tokens       = 300,
            num_beams            = 5,
            early_stopping       = True,
            no_repeat_ngram_size = 3,
            length_penalty       = 1.5,
        )

    reply = _tokenizer.decode(outputs[0], skip_special_tokens=True).strip()

    if not reply or len(reply) < 30:
        return (
            "Could you give me a bit more detail about your question? "
            "For example: 'How do I become a data scientist?' or "
            "'What skills do I need for frontend development?'"
        )

    return reply


def generate_response(user_message: str) -> str:
    if not user_message or not user_message.strip():
        return "Please ask me a career question! 😊"

    if _is_off_topic(user_message):
        return OFF_TOPIC_REPLY

    static = _check_static(user_message)
    if static:
        return static

    try:
        return _generate(user_message)
    except Exception as e:
        print(f"[chat_engine] Error: {e}")
        return "Sorry, I had trouble with that. Try rephrasing your career question!"