import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Minimize2, Sparkles } from "lucide-react";

/* ── SUGGESTED PROMPTS ──────────────────────────────────── */
const SUGGESTIONS = [
  "Data Analyst vs Data Scientist?",
  "How to write a strong resume summary?",
  "Skills needed for a frontend dev role?",
  "Best career after B.Tech CSE?",
];

/* ── MAIN COMPONENT ─────────────────────────────────────── */
export default function ChatBot() {
  const [open,     setOpen]     = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your TrueNorth career assistant 👋\nAsk me anything about careers, resume tips, or role comparisons. I'm here to help!",
    },
  ]);
  const [input,   setInput]   = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);
  const inputRef  = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 300);
  }, [open]);

  const sendMessage = async (text) => {
    const userText = (text || input).trim();
    if (!userText || loading) return;
    setInput("");

    const userMsg = { role: "user", content: userText };
    const updated = [...messages, userMsg];
    setMessages(updated);
    setLoading(true);

    try {
      const res = await fetch("http://localhost:8000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updated.map(m => ({ role: m.role, content: m.content })),
        }),
      });
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      const reply = data.reply || "Sorry, I couldn't respond right now.";
      setMessages(prev => [...prev, { role: "assistant", content: reply }]);
    } catch {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Please try again!" }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* ── FLOATING BUBBLE ── */}
      <AnimatePresence>
        {!open && (
          <motion.button
            key="bubble"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setOpen(true)}
            className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full shadow-[0_8px_32px_rgba(200,168,75,0.45)] flex items-center justify-center"
            style={{ background: "linear-gradient(135deg, #C8A84B 0%, #2E2218 100%)" }}
          >
            <Sparkles size={22} color="#F5F0E8" />
            {/* pulse ring */}
            <span className="absolute inset-0 rounded-full animate-ping opacity-20 bg-[#C8A84B]" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* ── CHAT WINDOW ── */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="window"
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0,  scale: 1    }}
            exit={{   opacity: 0, y: 40, scale: 0.95  }}
            transition={{ type: "spring", stiffness: 320, damping: 28 }}
            className="fixed bottom-6 right-6 z-50 flex flex-col overflow-hidden"
            style={{
              width: 370,
              height: 560,
              borderRadius: 24,
              background: "#FDFCF8",
              border: "1px solid #DDD5BE",
              boxShadow: "0 24px 64px rgba(46,34,24,0.18), 0 4px 16px rgba(200,168,75,0.12)",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            {/* HEADER */}
            <div
              className="flex items-center justify-between px-5 py-4 flex-shrink-0"
              style={{ background: "linear-gradient(135deg, #2E2218 0%, #4a2e18 100%)", borderBottom: "1px solid #3e2a18" }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-[#C8A84B] flex items-center justify-center flex-shrink-0">
                  <Sparkles size={15} color="#2E2218" />
                </div>
                <div>
                  <p className="text-[#F5F0E8] text-sm font-semibold leading-none">TrueNorth Assistant</p>
                  <p className="text-[#967A68] text-[10px] mt-0.5">Career guidance · Always online</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-full flex items-center justify-center hover:bg-[#3e2a18] transition-colors"
              >
                <X size={15} color="#967A68" />
              </button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: "none" }}>
              {messages.map((m, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2 }}
                  className={`flex ${m.role === "user" ? "justify-end" : "justify-start"} items-end gap-2`}
                >
                  {/* bot avatar */}
                  {m.role === "assistant" && (
                    <div className="w-6 h-6 rounded-full bg-[#EDE7D9] border border-[#DDD5BE] flex items-center justify-center flex-shrink-0 mb-0.5">
                      <Bot size={12} color="#C8A84B" />
                    </div>
                  )}

                  <div
                    className="max-w-[82%] px-4 py-2.5 text-[13px] leading-relaxed"
                    style={{
                      borderRadius: m.role === "user"
                        ? "18px 18px 4px 18px"
                        : "18px 18px 18px 4px",
                      background: m.role === "user"
                        ? "linear-gradient(135deg, #C8A84B, #a8882e)"
                        : "#F5F0E8",
                      color: m.role === "user" ? "#2E2218" : "#2E2218",
                      border: m.role === "user" ? "none" : "1px solid #EDE7D9",
                      whiteSpace: "pre-wrap",
                      wordBreak: "break-word",
                    }}
                  >
                    {m.content}
                  </div>
                </motion.div>
              ))}

              {/* loading dots */}
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex justify-start items-end gap-2"
                >
                  <div className="w-6 h-6 rounded-full bg-[#EDE7D9] border border-[#DDD5BE] flex items-center justify-center flex-shrink-0">
                    <Bot size={12} color="#C8A84B" />
                  </div>
                  <div className="px-4 py-3 bg-[#F5F0E8] border border-[#EDE7D9] flex items-center gap-1.5" style={{ borderRadius: "18px 18px 18px 4px" }}>
                    {[0, 1, 2].map(i => (
                      <span key={i} className="w-1.5 h-1.5 rounded-full bg-[#C8A84B] animate-bounce"
                        style={{ animationDelay: `${i * 0.15}s` }} />
                    ))}
                  </div>
                </motion.div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* SUGGESTIONS — shown only at start */}
            {messages.length === 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5 flex-shrink-0">
                {SUGGESTIONS.map(s => (
                  <button
                    key={s}
                    onClick={() => sendMessage(s)}
                    className="px-3 py-1.5 text-[11px] rounded-full border border-[#DDD5BE] text-[#5A3F2A] bg-[#F5F0E8] hover:border-[#C8A84B] hover:text-[#C8A84B] transition-all"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}

            {/* INPUT */}
            <div
              className="flex items-center gap-2 px-4 py-3 flex-shrink-0"
              style={{ borderTop: "1px solid #EDE7D9", background: "#FDFCF8" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }}
                placeholder="Ask about careers, skills, resume…"
                disabled={loading}
                className="flex-1 px-4 py-2.5 text-sm rounded-[14px] bg-[#F5F0E8] border border-[#DDD5BE] text-[#1A120B] placeholder-[#8A7A6A] focus:outline-none focus:border-[#C8A84B] transition-all disabled:opacity-50"
              />
              <button
                onClick={() => sendMessage()}
                disabled={!input.trim() || loading}
                className="w-9 h-9 rounded-[12px] flex items-center justify-center transition-all disabled:opacity-30 flex-shrink-0"
                style={{ background: input.trim() && !loading ? "linear-gradient(135deg, #C8A84B, #a8882e)" : "#EDE7D9" }}
              >
                <Send size={15} color={input.trim() && !loading ? "#2E2218" : "#8A7A6A"} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}