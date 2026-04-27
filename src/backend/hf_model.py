from transformers import pipeline

# ✅ Use better model (much smarter than distilgpt2)
chatbot = pipeline(
    "text-generation",
    model="mistralai/Mistral-7B-Instruct-v0.1",   # 🔥 BIG upgrade
    device_map="auto"
)

def get_ai_response(message):
    prompt = f"""
You are a professional career advisor chatbot.

Give:
- Step-by-step guidance
- Clear explanation
- Skills required
- Real-world advice

User: {message}
Assistant:
"""

    response = chatbot(
        prompt,
        max_new_tokens=200,     # ✅ ONLY this (remove max_length)
        temperature=0.7,
        top_p=0.9,
        do_sample=True,
        pad_token_id=chatbot.tokenizer.eos_token_id
    )

    text = response[0]["generated_text"]

    # 🔥 Clean output properly
    if "Assistant:" in text:
        text = text.split("Assistant:")[-1]

    return text.strip()