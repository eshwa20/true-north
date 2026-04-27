import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload, FileText, CheckCircle2, AlertCircle,
  ChevronRight, RotateCcw, Sparkles, TrendingUp,
  User, Briefcase, GraduationCap, Wrench,
  AlignLeft, Award, Loader2, X
} from "lucide-react";

/* ─── CATEGORY CONFIG ──────────────────────────────────── */
const CATEGORIES = [
  { key: "contact",     label: "Contact Info",    icon: User,          color: "#C8A84B", tip: "Name, email, phone, location, LinkedIn" },
  { key: "summary",     label: "Summary",         icon: AlignLeft,     color: "#967A68", tip: "Professional summary or objective" },
  { key: "experience",  label: "Experience",      icon: Briefcase,     color: "#C8A84B", tip: "Work history, roles, impact metrics" },
  { key: "skills",      label: "Skills",          icon: Wrench,        color: "#967A68", tip: "Technical and soft skills" },
  { key: "education",   label: "Education",       icon: GraduationCap, color: "#C8A84B", tip: "Degrees, institutions, dates" },
  { key: "formatting",  label: "Formatting",      icon: Award,         color: "#967A68", tip: "Clarity, structure, readability, ATS" },
];

/* ─── HELPERS ──────────────────────────────────────────── */
function scoreLabel(s) {
  if (s >= 85) return { text: "Excellent",  color: "#4a7c59" };
  if (s >= 70) return { text: "Good",       color: "#C8A84B" };
  if (s >= 50) return { text: "Fair",       color: "#c47f3a" };
  return              { text: "Needs Work", color: "#b94a4a" };
}

function overallGrade(s) {
  if (s >= 90) return "A+";
  if (s >= 85) return "A";
  if (s >= 80) return "A−";
  if (s >= 75) return "B+";
  if (s >= 70) return "B";
  if (s >= 65) return "B−";
  if (s >= 60) return "C+";
  if (s >= 55) return "C";
  return "D";
}

const R    = 52;
const CIRC = 2 * Math.PI * R;

// ─── AUTH TOKEN ──────────────────────────────────────────
function getAuthToken() {
  return localStorage.getItem("token");
}

// ─── API CALL ────────────────────────────────────────────
async function scoreResumeAPI(file, jobRole) {
  const token = getAuthToken();
  if (!token) throw new Error("You must be logged in to score a resume.");

  const formData = new FormData();
  formData.append("file", file);
  if (jobRole) formData.append("job_role", jobRole);

  let res, data;
  try {
    res = await fetch(
      `${import.meta.env.VITE_API_BASE_URL ?? "http://localhost:8000"}/api/score-resume`,
      {
        method:  "POST",
        headers: { Authorization: `Bearer ${token}` },
        body:    formData,
      }
    );
    data = await res.json();
  } catch (networkErr) {
    throw new Error("Could not reach the server. Is the backend running?");
  }

  // ✅ Properly read FastAPI error format (detail can be string or array)
  if (!res.ok) {
    console.error("API error response:", JSON.stringify(data, null, 2));
    const detail = Array.isArray(data.detail)
      ? data.detail.map(e => `${e.loc?.join(".")} — ${e.msg}`).join("; ")
      : data.detail ?? data.error ?? `Server error ${res.status}`;
    throw new Error(detail);
  }

  return data;
}

/* ─── ROOT ─────────────────────────────────────────────── */
export default function ResumeScorer() {
  const [phase, setPhase]         = useState("upload");
  const [dragOver, setDragOver]   = useState(false);
  const [file, setFile]           = useState(null);
  const [jobRole, setJobRole]     = useState("");
  const [results, setResults]     = useState(null);
  const [errorMsg, setErrorMsg]   = useState("");
  const [activeTab, setActiveTab] = useState(null);
  const inputRef = useRef(null);

  const onDragOver  = useCallback(e => { e.preventDefault(); setDragOver(true);  }, []);
  const onDragLeave = useCallback(()  => setDragOver(false), []);
  const onDrop      = useCallback(e => {
    e.preventDefault(); setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f && f.type === "application/pdf") setFile(f);
  }, []);

  const onFileChange = e => {
    const f = e.target.files[0];
    if (f) setFile(f);
  };

  const analyse = async () => {
    if (!file) return;
    setPhase("analyzing");
    setResults(null);
    setErrorMsg("");
    try {
      const data = await scoreResumeAPI(file, jobRole.trim());
      setResults(data);
      setActiveTab(null);
      setPhase("results");
    } catch (err) {
      setErrorMsg(err.message ?? "Something went wrong. Please try again.");
      setPhase("error");
    }
  };

  const reset = () => {
    setPhase("upload");
    setFile(null);
    setJobRole("");
    setResults(null);
    setErrorMsg("");
    setActiveTab(null);
  };

  const arcLen = results ? CIRC * (1 - results.overall / 100) : CIRC;

  return (
    <div className="min-h-screen bg-[#FDFCF8]" style={{ fontFamily: "'Outfit', sans-serif" }}>

      <header className="border-b border-[#DDD5BE] bg-[#FDFCF8] sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#C8A84B] font-semibold text-lg tracking-wide">TrueNorth</span>
            <span className="text-[#DDD5BE] mx-2">|</span>
            <span className="text-[#967A68] text-sm">Resume Scorer</span>
          </div>
          <div className="flex items-center gap-3">
            {phase === "results" && (
              <button onClick={reset}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs border border-[#DDD5BE] text-[#967A68] hover:bg-[#EDE7D9] transition-all">
                <RotateCcw size={11}/> Score another
              </button>
            )}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#EDE7D9] text-[10px] text-[#967A68]">
              <Sparkles size={11} className="text-[#C8A84B]"/> AI-powered
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {(phase === "upload" || phase === "error") && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.3 }}>

            <div className="text-center mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EDE7D9] text-[#967A68] text-xs mb-4">
                <TrendingUp size={12} className="text-[#C8A84B]"/> Instant AI feedback on your resume
              </div>
              <h1 className="text-3xl font-semibold text-[#2E2218] leading-tight">
                How strong is your resume?
              </h1>
              <p className="text-[#967A68] text-sm mt-2 max-w-md mx-auto">
                Upload your PDF and get a detailed score across 6 dimensions in seconds.
              </p>
            </div>

            <div className="max-w-xl mx-auto space-y-4">

              {phase === "error" && (
                <div className="flex items-center gap-3 px-4 py-3 bg-red-50 border border-red-200 rounded-[14px] text-sm text-red-600">
                  <AlertCircle size={15}/> {errorMsg}
                </div>
              )}

              {/* ✅ label now has htmlFor matching input id */}
              <div className="bg-white border border-[#DDD5BE] rounded-[20px] p-5 shadow-[0_4px_16px_rgba(46,34,24,.06)]">
                <label
                  htmlFor="job-role-input"
                  className="text-[10px] text-[#967A68] uppercase tracking-widest font-medium block mb-2"
                >
                  Target Role <span className="normal-case text-[#DDD5BE]">(optional — improves keyword analysis)</span>
                </label>
                <input
                  id="job-role-input"
                  name="job_role"
                  value={jobRole}
                  onChange={e => setJobRole(e.target.value)}
                  placeholder="e.g. Frontend Engineer, Product Manager, Data Analyst…"
                  className="w-full px-4 py-2.5 text-sm bg-[#F5F0E8] border border-[#DDD5BE] rounded-[14px] text-[#2E2218] placeholder-[#DDD5BE] focus:outline-none focus:border-[#C8A84B] focus:bg-[#FDFCF8] transition-all"
                />
              </div>

              <div
                onDragOver={onDragOver}
                onDragLeave={onDragLeave}
                onDrop={onDrop}
                onClick={() => !file && inputRef.current?.click()}
                className={`relative bg-white border-2 rounded-[20px] p-8 text-center transition-all cursor-pointer shadow-[0_4px_16px_rgba(46,34,24,.06)] ${
                  dragOver
                    ? "border-[#C8A84B] bg-[#FDFCF8] shadow-[0_0_0_4px_rgba(200,168,75,0.12)]"
                    : file
                    ? "border-[#C8A84B] bg-[#FDFCF8] cursor-default"
                    : "border-dashed border-[#DDD5BE] hover:border-[#C8A84B] hover:bg-[#FDFCF8]"
                }`}
              >
                {/* ✅ added id, name, aria-label to hidden file input */}
                <input
                  ref={inputRef}
                  id="resume-file-input"
                  name="resume_file"
                  type="file"
                  accept=".pdf"
                  aria-label="Upload resume PDF"
                  hidden
                  onChange={onFileChange}
                />

                <AnimatePresence mode="wait">
                  {file ? (
                    <motion.div key="file"
                      initial={{ opacity:0, scale:0.9 }} animate={{ opacity:1, scale:1 }}
                      className="flex flex-col items-center gap-3">
                      <div className="w-14 h-14 rounded-2xl bg-[#EDE7D9] flex items-center justify-center">
                        <FileText size={24} className="text-[#C8A84B]"/>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#2E2218]">{file.name}</p>
                        <p className="text-xs text-[#967A68] mt-0.5">{(file.size / 1024).toFixed(0)} KB · PDF</p>
                      </div>
                      <button
                        onClick={e => { e.stopPropagation(); setFile(null); }}
                        className="flex items-center gap-1 text-xs text-[#967A68] hover:text-red-500 transition-colors px-3 py-1 rounded-full border border-[#DDD5BE] hover:border-red-200 hover:bg-red-50"
                      >
                        <X size={11}/> Remove
                      </button>
                    </motion.div>
                  ) : (
                    <motion.div key="empty"
                      initial={{ opacity:0 }} animate={{ opacity:1 }}
                      className="flex flex-col items-center gap-3">
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-colors ${dragOver ? "bg-[#C8A84B]" : "bg-[#EDE7D9]"}`}>
                        <Upload size={24} className={dragOver ? "text-white" : "text-[#C8A84B]"}/>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-[#2E2218]">
                          {dragOver ? "Drop it here" : "Drag & drop your resume"}
                        </p>
                        <p className="text-xs text-[#967A68] mt-0.5">or click to browse · PDF only</p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <button
                onClick={analyse}
                disabled={!file}
                className="w-full py-3.5 rounded-[16px] text-sm font-semibold flex items-center justify-center gap-2 transition-all disabled:opacity-40 disabled:cursor-not-allowed bg-[#2E2218] text-[#F5F0E8] hover:bg-[#C8A84B] hover:text-[#2E2218]"
              >
                <Sparkles size={15}/> Analyse Resume
                <ChevronRight size={15}/>
              </button>

              <p className="text-center text-[10px] text-[#DDD5BE]">
                Your resume is processed securely and never stored as a file.
              </p>
            </div>
          </motion.div>
        )}

        {phase === "analyzing" && (
          <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }}
            className="flex flex-col items-center justify-center py-28 gap-6">
            <div className="relative">
              <div className="w-20 h-20 rounded-full border-4 border-[#EDE7D9]"/>
              <motion.div
                className="absolute inset-0 w-20 h-20 rounded-full border-4 border-transparent border-t-[#C8A84B]"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <FileText size={22} className="text-[#C8A84B]"/>
              </div>
            </div>
            <div className="text-center">
              <p className="text-base font-semibold text-[#2E2218]">Analysing your resume…</p>
              <p className="text-sm text-[#967A68] mt-1">Our AI is reviewing all sections</p>
            </div>
            <div className="flex flex-col gap-2 w-52">
              {["Reading document…","Scoring sections…","Generating feedback…"].map((t,i) => (
                <motion.div key={t}
                  initial={{ opacity:0, x:-8 }}
                  animate={{ opacity:1, x:0 }}
                  transition={{ delay: i * 0.6 }}
                  className="flex items-center gap-2 text-xs text-[#967A68]">
                  <Loader2 size={11} className="text-[#C8A84B] animate-spin flex-shrink-0"/>
                  {t}
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {phase === "results" && results && (
          <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.35 }}>

            <div className="grid sm:grid-cols-[auto_1fr] gap-6 mb-8">
              <div className="bg-white border border-[#DDD5BE] rounded-[24px] shadow-[0_8px_32px_rgba(46,34,24,.08)] p-7 flex flex-col items-center gap-3 min-w-[180px]">
                <p className="text-[10px] text-[#967A68] uppercase tracking-widest">Overall Score</p>
                <div className="relative w-[130px] h-[130px]">
                  <svg viewBox="0 0 120 120" className="w-full h-full -rotate-90">
                    <circle cx="60" cy="60" r={R} fill="none" stroke="#EDE7D9" strokeWidth="9"/>
                    <motion.circle
                      cx="60" cy="60" r={R}
                      fill="none" stroke="#C8A84B" strokeWidth="9" strokeLinecap="round"
                      strokeDasharray={CIRC}
                      initial={{ strokeDashoffset: CIRC }}
                      animate={{ strokeDashoffset: arcLen }}
                      transition={{ duration: 1.4, ease: "easeOut", delay: 0.2 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span
                      className="text-[32px] font-bold text-[#2E2218] leading-none"
                      initial={{ opacity:0, scale:0.5 }}
                      animate={{ opacity:1, scale:1 }}
                      transition={{ delay:0.5, type:"spring", stiffness:200 }}
                    >
                      {results.overall}
                    </motion.span>
                    <span className="text-[11px] text-[#967A68]">/100</span>
                  </div>
                </div>
                <div className="text-center">
                  <span
                    className="text-sm font-semibold px-3 py-1 rounded-full"
                    style={{
                      backgroundColor: scoreLabel(results.overall).color + "18",
                      color: scoreLabel(results.overall).color
                    }}
                  >
                    {scoreLabel(results.overall).text}
                  </span>
                  <p className="text-[28px] font-bold text-[#2E2218] leading-none mt-2">{overallGrade(results.overall)}</p>
                  <p className="text-[10px] text-[#DDD5BE] mt-0.5">Grade</p>
                </div>
              </div>

              <div className="grid sm:grid-rows-2 gap-4">
                <div className="bg-white border border-[#DDD5BE] rounded-[20px] shadow-[0_4px_16px_rgba(46,34,24,.06)] p-5">
                  <p className="text-[10px] text-[#967A68] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <CheckCircle2 size={11} className="text-[#4a7c59]"/> Strengths
                  </p>
                  <ul className="space-y-1.5">
                    {results.strengths?.map((s,i) => (
                      <motion.li key={i}
                        initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                        transition={{ delay: 0.1 * i + 0.4 }}
                        className="flex items-start gap-2 text-xs text-[#2E2218]">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#4a7c59] flex-shrink-0"/>
                        {s}
                      </motion.li>
                    ))}
                  </ul>
                </div>
                <div className="bg-white border border-[#DDD5BE] rounded-[20px] shadow-[0_4px_16px_rgba(46,34,24,.06)] p-5">
                  <p className="text-[10px] text-[#967A68] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                    <TrendingUp size={11} className="text-[#C8A84B]"/> Top Improvements
                  </p>
                  <ul className="space-y-1.5">
                    {results.improvements?.map((s,i) => (
                      <motion.li key={i}
                        initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }}
                        transition={{ delay: 0.1 * i + 0.5 }}
                        className="flex items-start gap-2 text-xs text-[#2E2218]">
                        <span className="mt-1 w-1.5 h-1.5 rounded-full bg-[#C8A84B] flex-shrink-0"/>
                        {s}
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#DDD5BE] rounded-[24px] shadow-[0_8px_32px_rgba(46,34,24,.08)] p-6 mb-6">
              <p className="text-[10px] text-[#967A68] uppercase tracking-widest mb-5">Section Breakdown</p>
              <div className="grid sm:grid-cols-2 gap-x-10 gap-y-5">
                {CATEGORIES.map((cat, ci) => {
                  const catData = results.categories?.[cat.key];
                  const score   = catData?.score ?? 0;
                  const lbl     = scoreLabel(score);
                  const Icon    = cat.icon;
                  const isOpen  = activeTab === cat.key;
                  return (
                    <div key={cat.key}>
                      <button onClick={() => setActiveTab(isOpen ? null : cat.key)} className="w-full text-left group">
                        <div className="flex items-center justify-between mb-1.5">
                          <div className="flex items-center gap-2">
                            <Icon size={13} className="text-[#967A68]"/>
                            <span className="text-xs font-medium text-[#2E2218]">{cat.label}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-semibold" style={{ color: lbl.color }}>{lbl.text}</span>
                            <span className="text-xs font-bold text-[#2E2218]">{score}</span>
                          </div>
                        </div>
                        <div className="h-2 bg-[#EDE7D9] rounded-full overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: lbl.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${score}%` }}
                            transition={{ duration: 0.9, ease: "easeOut", delay: ci * 0.08 + 0.3 }}
                          />
                        </div>
                        <p className="text-[9px] text-[#DDD5BE] mt-1 group-hover:text-[#967A68] transition-colors">
                          {isOpen ? "▲ hide feedback" : "▼ show feedback"}
                        </p>
                      </button>
                      <AnimatePresence>
                        {isOpen && catData?.feedback && (
                          <motion.div
                            initial={{ opacity:0, height:0 }} animate={{ opacity:1, height:"auto" }}
                            exit={{ opacity:0, height:0 }} transition={{ duration:0.22 }}
                            className="overflow-hidden"
                          >
                            <ul className="mt-2 pl-2 space-y-1.5 border-l-2 border-[#EDE7D9]">
                              {catData.feedback.map((tip, ti) => (
                                <li key={ti} className="text-[10px] text-[#967A68] leading-relaxed flex items-start gap-1.5">
                                  <span className="mt-1.5 w-1 h-1 rounded-full bg-[#DDD5BE] flex-shrink-0"/>
                                  {tip}
                                </li>
                              ))}
                            </ul>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>

            {results.keywords_missing?.length > 0 && (
              <motion.div
                initial={{ opacity:0, y:10 }} animate={{ opacity:1, y:0 }} transition={{ delay:0.5 }}
                className="bg-white border border-[#DDD5BE] rounded-[20px] shadow-[0_4px_16px_rgba(46,34,24,.06)] p-5 mb-6"
              >
                <p className="text-[10px] text-[#967A68] uppercase tracking-widest mb-3 flex items-center gap-1.5">
                  <AlertCircle size={11} className="text-[#c47f3a]"/>
                  {jobRole ? `Keywords missing for "${jobRole}"` : "Suggested Keywords to Add"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {results.keywords_missing.map((kw,i) => (
                    <motion.span key={i}
                      initial={{ opacity:0, scale:0.8 }} animate={{ opacity:1, scale:1 }}
                      transition={{ delay: 0.05 * i + 0.6 }}
                      className="px-3 py-1 text-xs rounded-full border border-dashed border-[#C8A84B] text-[#967A68] bg-[#FDFCF8]">
                      + {kw}
                    </motion.span>
                  ))}
                </div>
              </motion.div>
            )}

            <div className="flex flex-wrap gap-3 justify-center">
              <button onClick={reset}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#2E2218] text-[#F5F0E8] hover:bg-[#C8A84B] hover:text-[#2E2218] transition-all">
                <RotateCcw size={14}/> Score Another Resume
              </button>
              <a href="/resume-builder"
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-medium border border-[#DDD5BE] text-[#967A68] hover:bg-[#EDE7D9] transition-all">
                Build a Better Resume <ChevronRight size={14}/>
              </a>
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}