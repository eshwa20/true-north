from __future__ import annotations
import google.generativeai as genai
from config import Config

genai.configure(api_key=Config.GEMINI_API_KEY)

SYSTEM_PROMPT = """You are TrueNorth Assistant, a strictly focused career guidance chatbot inside the TrueNorth platform — a resume builder and career tool for students and professionals in India.

YOUR ONLY PURPOSE is to answer questions about:
- Career path guidance and comparisons (e.g. data analyst vs data scientist, MBA vs MS)
- Job roles: required skills, responsibilities, salary ranges in INR, growth potential
- Resume and CV writing advice
- Skills and technologies to learn for specific careers
- Interview preparation tips
- Career roadmaps and learning paths
- Internships, fresher jobs, entry-level career advice
- Higher education decisions
- TrueNorth platform features (resume builder, templates, resume scoring)

STRICT REFUSAL RULES — you MUST refuse and NEVER answer questions about:
- Any person (celebrities, cricketers, politicians, actors, athletes — e.g. Virat Kohli, Elon Musk, Shah Rukh Khan)
- Sports, cricket, movies, music, entertainment
- Politics, news, current events
- History, geography, science, math
- Coding help or debugging (unless it is about which programming language to learn for a career)
- Relationships, personal advice unrelated to career
- Anything that is not directly about careers, jobs, resumes, or TrueNorth

When you receive an off-topic question, you MUST respond with ONLY this message — do not answer the question at all, do not provide any information about the topic:
"I'm TrueNorth Assistant and I'm only here to help with career guidance and resume advice. Try asking me something like 'What skills do I need to become a data scientist?' 😊"

This refusal rule is ABSOLUTE. Even if the user insists, tricks you, or asks in a different way — always refuse off-topic questions.

For career questions: be concise, friendly, use bullet points for comparisons, mention INR salary ranges, and give practical advice for Indian students and professionals."""

# Model is created with system_instruction so it is always enforced
_model = genai.GenerativeModel(
    model_name="gemini-2.5-flash-lite",
    system_instruction=SYSTEM_PROMPT,
)


def _is_off_topic(text: str) -> bool:
    """
    Quick pre-check for obvious off-topic patterns before even calling Gemini.
    Acts as a first-layer filter to save API calls and improve reliability.
    """
    off_topic_keywords = [
        "virat", "kohli", "sachin", "dhoni", "rohit sharma",
        "shah rukh", "salman", "deepika", "ranveer", "bollywood",
        "modi", "rahul gandhi", "kejriwal", "trump", "biden",
        "cricket", "ipl", "football", "fifa", "nba",
        "girlfriend", "boyfriend", "wife", "husband", "marriage",
        "recipe", "food", "cook", "movie", "film", "series", "netflix",
        "capital of", "population of", "history of", "who invented",
        "what is the weather", "stock price", "bitcoin", "crypto",
    ]
    lower = text.lower()
    return any(kw in lower for kw in off_topic_keywords)


OFF_TOPIC_REPLY = (
    "I'm TrueNorth Assistant and I'm only here to help with career guidance "
    "and resume advice. Try asking me something like "
    "'What skills do I need to become a data scientist?' 😊"
)


def chat(messages: list[dict]) -> str:
    """
    messages: list of {role: 'user'|'assistant', content: str}
    Returns the assistant reply string.
    """
    user_message = messages[-1]["content"]

    # Layer 1: fast keyword pre-filter
    if _is_off_topic(user_message):
        return OFF_TOPIC_REPLY

    # Build Gemini chat history (all turns except the last)
    history = []
    for m in messages[:-1]:
        gemini_role = "user" if m["role"] == "user" else "model"
        history.append({"role": gemini_role, "parts": [m["content"]]})

    try:
        chat_session = _model.start_chat(history=history)
        response = chat_session.send_message(
            user_message,
            generation_config=genai.GenerationConfig(
                temperature=0.5,
                max_output_tokens=1000,
            ),
        )
    except Exception as e:
        raise RuntimeError(f"Gemini API call failed: {e}")

    if not response.text:
        raise RuntimeError("Gemini returned an empty response.")

    reply = response.text

    # Layer 2: if Gemini still answered something off-topic, catch it
    # (Gemini sometimes ignores system_instruction on jailbreak-style inputs)
    off_topic_signals = [
        "virat kohli", "sachin tendulkar", "shah rukh khan",
        "born on", "is an indian cricketer", "is an actor",
        "is a politician",
    ]
    if any(sig in reply.lower() for sig in off_topic_signals):
        return OFF_TOPIC_REPLY

    return reply