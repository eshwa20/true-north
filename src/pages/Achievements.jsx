import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy, Star, Zap, Target, Flame, Crown,
  Lock, CheckCircle2, TrendingUp, Award,
  BookOpen, Upload, Code2, FileText, Users,
  ChevronUp, Sparkles, Medal
} from "lucide-react";

/* ─── TOKENS ────────────────────────────────────────────── */
const T = {
  cream:     "#FDFCF8",
  parchment: "#F5F0E8",
  border:    "#DDD5BE",
  muted:     "#EDE7D9",
  gold:      "#C8A84B",
  goldDark:  "#9a6f10",
  goldLight: "#f0d880",
  brown:     "#2E2218",
  text:      "#1a1008",
  sub:       "#967A68",
};

/* ─── DATA ──────────────────────────────────────────────── */
const XP_LEVEL_THRESHOLDS = [0, 100, 250, 500, 900, 1500];
const LEVEL_NAMES = ["Newcomer", "Explorer", "Builder", "Achiever", "Champion", "Legend"];

const ALL_BADGES = [
  // Earned
  { id: "first_resume",   emoji: "📄", label: "First Resume",    desc: "Created your first resume",         xp: 50,  earned: true,  category: "resume",  rarity: "common" },
  { id: "python_done",    emoji: "🐍", label: "Python Pioneer",  desc: "Completed the Python skill track",  xp: 100, earned: true,  category: "skill",   rarity: "rare" },
  { id: "profile_filled", emoji: "✨", label: "Profile Star",    desc: "Filled out your complete profile",  xp: 30,  earned: true,  category: "profile", rarity: "common" },
  { id: "first_download", emoji: "⬇️", label: "Download Ready", desc: "Downloaded your first PDF resume",  xp: 40,  earned: true,  category: "resume",  rarity: "common" },
  { id: "week_streak",    emoji: "🔥", label: "7-Day Streak",    desc: "Logged in 7 days in a row",         xp: 80,  earned: true,  category: "streak",  rarity: "rare" },
  // Locked
  { id: "resume_trio",    emoji: "🗂️", label: "Triple Threat",  desc: "Create 3 different resumes",        xp: 120, earned: false, category: "resume",  rarity: "rare",  progress: 1, total: 3 },
  { id: "js_done",        emoji: "⚡", label: "JS Ninja",        desc: "Complete the JavaScript track",    xp: 100, earned: false, category: "skill",   rarity: "rare",  progress: 60, total: 100 },
  { id: "top10",          emoji: "🏆", label: "Top 10",          desc: "Reach top 10 on the leaderboard",  xp: 200, earned: false, category: "social",  rarity: "epic",  progress: 28, total: 10 },
  { id: "month_streak",   emoji: "📅", label: "30-Day Legend",   desc: "Login streak of 30 days",          xp: 300, earned: false, category: "streak",  rarity: "epic",  progress: 7,  total: 30 },
  { id: "perfect",        emoji: "💎", label: "Perfect Score",   desc: "Get 100% on any skill assessment",  xp: 250, earned: false, category: "skill",   rarity: "legendary", progress: 0, total: 1 },
  { id: "mentor",         emoji: "🌟", label: "Mentor",          desc: "Help 5 peers review their resumes", xp: 400, earned: false, category: "social", rarity: "legendary", progress: 0, total: 5 },
];

const MILESTONES = [
  { label: "Python",     icon: <Code2 size={14}/>,    pct: 100, color: "#4CAF50" },
  { label: "Resume",     icon: <FileText size={14}/>, pct: 85,  color: "#C8A84B" },
  { label: "JavaScript", icon: <Zap size={14}/>,      pct: 60,  color: "#2196F3" },
  { label: "SQL",        icon: <Target size={14}/>,   pct: 40,  color: "#9C27B0" },
  { label: "React",      icon: <BookOpen size={14}/>, pct: 20,  color: "#E91E63" },
];

const LEADERBOARD = [
  { rank: 1,  name: "Ananya K.",   xp: 2840, avatar: "AK", rise: true  },
  { rank: 2,  name: "Rahul M.",    xp: 2610, avatar: "RM", rise: true  },
  { rank: 3,  name: "Srushti",     xp: 2380, avatar: "SR", rise: false, isMe: true },
  { rank: 4,  name: "Priya S.",    xp: 2150, avatar: "PS", rise: false },
  { rank: 5,  name: "Dev T.",      xp: 1980, avatar: "DT", rise: true  },
  { rank: 6,  name: "Meera R.",    xp: 1760, avatar: "MR", rise: false },
  { rank: 7,  name: "Arjun N.",    xp: 1550, avatar: "AN", rise: true  },
  { rank: 8,  name: "Kavya P.",    xp: 1320, avatar: "KP", rise: false },
];

const RARITY_STYLE = {
  common:    { bg: "#F5F0E8", border: "#DDD5BE",  label: "Common",    labelColor: "#967A68" },
  rare:      { bg: "#EEF4FF", border: "#90B8F8",  label: "Rare",      labelColor: "#2563EB" },
  epic:      { bg: "#F5EDFF", border: "#C084FC",  label: "Epic",      labelColor: "#7C3AED" },
  legendary: { bg: "#FFFBEB", border: "#FBBF24",  label: "Legendary", labelColor: "#B45309" },
};

const TABS = ["Badges", "Milestones", "Leaderboard"];

/* ─── MAIN ─────────────────────────────────────────────── */
export default function Achievements() {
  const [tab,          setTab]          = useState("Badges");
  const [filter,       setFilter]       = useState("all");
  const [hoveredBadge, setHoveredBadge] = useState(null);

  /* XP derived values */
  const currentXP  = 2380;
  const level      = XP_LEVEL_THRESHOLDS.findIndex((t, i) => currentXP < (XP_LEVEL_THRESHOLDS[i + 1] ?? Infinity));
  const levelXP    = XP_LEVEL_THRESHOLDS[level];
  const nextXP     = XP_LEVEL_THRESHOLDS[level + 1] ?? currentXP;
  const levelPct   = Math.min(100, ((currentXP - levelXP) / (nextXP - levelXP)) * 100);
  const earnedCount = ALL_BADGES.filter(b => b.earned).length;

  const filteredBadges = filter === "all"    ? ALL_BADGES
    : filter === "earned"  ? ALL_BADGES.filter(b => b.earned)
    : ALL_BADGES.filter(b => !b.earned);

  return (
    <div className="min-h-screen" style={{ backgroundColor: T.cream, fontFamily: "'Outfit', sans-serif", color: T.text }}>

      {/* ── HEADER ───────────────────────────────── */}
      <header style={{ borderBottom: `1px solid ${T.border}`, backgroundColor: T.cream, position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ color: T.gold, fontWeight: 600, fontSize: 18 }}>TrueNorth</span>
          <span style={{ color: T.border, margin: "0 6px" }}>|</span>
          <span style={{ color: T.sub, fontSize: 14 }}>Achievements</span>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px" }}>

        {/* ── XP HERO ──────────────────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          style={{
            borderRadius: 28, overflow: "hidden", marginBottom: 28,
            background: `linear-gradient(135deg, ${T.brown} 0%, #4a2e10 60%, #6a3e14 100%)`,
            padding: "36px 40px", position: "relative"
          }}
        >
          {/* decorative sparkles */}
          {["10%","30%","55%","80%","95%"].map((l,i) => (
            <div key={i} style={{
              position: "absolute", left: l, top: ["20%","55%","15%","70%","35%"][i],
              width: [6,4,8,5,4][i], height: [6,4,8,5,4][i], borderRadius: "50%",
              backgroundColor: T.gold, opacity: [0.3,0.15,0.25,0.2,0.1][i]
            }}/>
          ))}

          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
            <div style={{ flex: 1, minWidth: 280 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
                <div style={{
                  width: 52, height: 52, borderRadius: 16, backgroundColor: T.gold,
                  display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
                }}>
                  <Crown size={26} color={T.brown}/>
                </div>
                <div>
                  <p style={{ color: T.goldLight, fontSize: 11, fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>
                    Level {level} — {LEVEL_NAMES[level]}
                  </p>
                  <h1 style={{ color: "#F5F0E8", fontSize: 28, fontWeight: 700, lineHeight: 1.2, marginTop: 2 }}>
                    {currentXP.toLocaleString()} XP
                  </h1>
                </div>
              </div>

              {/* XP bar */}
              <div style={{ marginTop: 20 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                  <span style={{ fontSize: 11, color: "#C8B08A" }}>{levelXP.toLocaleString()} XP</span>
                  <span style={{ fontSize: 11, color: "#C8B08A" }}>{nextXP.toLocaleString()} XP — Level {level + 1}</span>
                </div>
                <div style={{ height: 10, borderRadius: 99, backgroundColor: "rgba(255,255,255,0.1)", overflow: "hidden" }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${levelPct}%` }}
                    transition={{ duration: 1.2, ease: "easeOut", delay: 0.3 }}
                    style={{
                      height: "100%", borderRadius: 99,
                      background: `linear-gradient(90deg, ${T.gold}, ${T.goldLight})`
                    }}
                  />
                </div>
                <p style={{ fontSize: 11, color: "#a08060", marginTop: 5 }}>
                  {(nextXP - currentXP).toLocaleString()} XP to Level {level + 1}
                </p>
              </div>
            </div>

            {/* Stats row */}
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                { label: "Badges",   value: earnedCount, icon: <Trophy size={18} color={T.gold}/>, sub: `of ${ALL_BADGES.length}` },
                { label: "Streak",   value: "7",         icon: <Flame  size={18} color="#e05a4a"/>, sub: "days" },
                { label: "Rank",     value: "#3",        icon: <Medal  size={18} color={T.gold}/>,  sub: "leaderboard" },
              ].map(s => (
                <div key={s.label} style={{
                  backgroundColor: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.12)",
                  borderRadius: 18, padding: "16px 22px", textAlign: "center", minWidth: 90
                }}>
                  <div style={{ display: "flex", justifyContent: "center", marginBottom: 6 }}>{s.icon}</div>
                  <p style={{ fontSize: 22, fontWeight: 700, color: "#F5F0E8", lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: 10, color: "#a08060", marginTop: 2 }}>{s.sub}</p>
                  <p style={{ fontSize: 9, color: "#6a5040", marginTop: 1, textTransform: "uppercase", letterSpacing: "0.06em" }}>{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        {/* ── DAILY CHALLENGE STRIP ─────────────────── */}
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          style={{
            display: "flex", alignItems: "center", justifyContent: "space-between",
            padding: "16px 24px", borderRadius: 18, marginBottom: 28,
            border: `1px solid ${T.gold}55`,
            background: `linear-gradient(90deg, #fffbeb, ${T.parchment})`
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 38, height: 38, borderRadius: 12, backgroundColor: T.gold + "22",
              display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Zap size={18} color={T.gold}/>
            </div>
            <div>
              <p style={{ fontSize: 13, fontWeight: 700, color: T.text }}>Daily Challenge</p>
              <p style={{ fontSize: 11, color: T.sub }}>Upload an updated resume today · +25 XP</p>
            </div>
          </div>
          <button style={{
            padding: "8px 18px", borderRadius: 10, border: "none",
            backgroundColor: T.gold, color: T.brown, fontSize: 12, fontWeight: 700, cursor: "pointer"
          }}>
            Start →
          </button>
        </motion.div>

        {/* ── TABS ─────────────────────────────────── */}
        <div style={{ display: "flex", gap: 6, marginBottom: 24 }}>
          {TABS.map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              style={{
                padding: "9px 20px", borderRadius: 99, fontSize: 13, fontWeight: tab === t ? 600 : 400,
                border: `1px solid ${tab === t ? T.gold : T.border}`,
                backgroundColor: tab === t ? T.brown : T.parchment,
                color: tab === t ? T.gold : T.sub,
                cursor: "pointer", transition: "all .18s"
              }}
            >
              {t}
            </button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={tab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >

            {/* ══ BADGES TAB ═══════════════════════════ */}
            {tab === "Badges" && (
              <div>
                {/* filter pills */}
                <div style={{ display: "flex", gap: 8, marginBottom: 20 }}>
                  {["all","earned","locked"].map(f => (
                    <button
                      key={f}
                      onClick={() => setFilter(f)}
                      style={{
                        padding: "5px 14px", borderRadius: 99, fontSize: 12, fontWeight: filter === f ? 600 : 400,
                        border: `1px solid ${filter === f ? T.goldDark : T.border}`,
                        backgroundColor: filter === f ? T.muted : "transparent",
                        color: filter === f ? T.goldDark : T.sub, cursor: "pointer"
                      }}
                    >
                      {f.charAt(0).toUpperCase() + f.slice(1)}
                      <span style={{
                        marginLeft: 5, fontSize: 10, padding: "1px 6px", borderRadius: 99,
                        backgroundColor: filter === f ? T.gold + "44" : T.border,
                        color: filter === f ? T.goldDark : T.sub
                      }}>
                        {f === "all" ? ALL_BADGES.length : f === "earned" ? ALL_BADGES.filter(b=>b.earned).length : ALL_BADGES.filter(b=>!b.earned).length}
                      </span>
                    </button>
                  ))}
                </div>

                {/* badge grid */}
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 14 }}>
                  {filteredBadges.map((badge, idx) => {
                    const R = RARITY_STYLE[badge.rarity];
                    return (
                      <motion.div
                        key={badge.id}
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: idx * 0.04 }}
                        onHoverStart={() => setHoveredBadge(badge.id)}
                        onHoverEnd={() => setHoveredBadge(null)}
                        style={{
                          borderRadius: 20, padding: "20px 18px", position: "relative",
                          border: `2px solid ${hoveredBadge === badge.id ? R.border : badge.earned ? R.border : T.border}`,
                          backgroundColor: badge.earned ? R.bg : T.parchment,
                          opacity: badge.earned ? 1 : 0.7,
                          transition: "all .2s",
                          boxShadow: hoveredBadge === badge.id ? `0 8px 24px ${R.border}44` : "none",
                          cursor: "default"
                        }}
                      >
                        {/* lock overlay */}
                        {!badge.earned && (
                          <div style={{
                            position: "absolute", top: 12, right: 12,
                            width: 22, height: 22, borderRadius: "50%",
                            backgroundColor: T.muted, display: "flex", alignItems: "center", justifyContent: "center"
                          }}>
                            <Lock size={11} color={T.sub}/>
                          </div>
                        )}

                        {/* rarity dot */}
                        <div style={{
                          position: "absolute", top: 12, left: 12,
                          fontSize: 9, fontWeight: 700, color: R.labelColor,
                          backgroundColor: R.bg, border: `1px solid ${R.border}`,
                          padding: "1px 7px", borderRadius: 99
                        }}>
                          {R.label}
                        </div>

                        {/* emoji */}
                        <div style={{
                          fontSize: 34, textAlign: "center", margin: "24px 0 10px",
                          filter: badge.earned ? "none" : "grayscale(100%)"
                        }}>
                          {badge.emoji}
                        </div>

                        <p style={{ fontSize: 13, fontWeight: 700, color: badge.earned ? T.text : T.sub, textAlign: "center" }}>
                          {badge.label}
                        </p>
                        <p style={{ fontSize: 10, color: T.sub, textAlign: "center", marginTop: 4, lineHeight: 1.5 }}>
                          {badge.desc}
                        </p>

                        {/* XP pill */}
                        <div style={{
                          display: "flex", justifyContent: "center", marginTop: 10
                        }}>
                          <span style={{
                            fontSize: 10, fontWeight: 600, padding: "3px 10px", borderRadius: 99,
                            backgroundColor: badge.earned ? T.gold + "22" : T.muted,
                            color: badge.earned ? T.goldDark : T.sub
                          }}>
                            +{badge.xp} XP
                          </span>
                        </div>

                        {/* progress bar for locked */}
                        {!badge.earned && badge.progress !== undefined && (
                          <div style={{ marginTop: 12 }}>
                            <div style={{ height: 4, borderRadius: 99, backgroundColor: T.muted, overflow: "hidden" }}>
                              <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${(badge.progress / badge.total) * 100}%` }}
                                transition={{ duration: 1, delay: idx * 0.05 + 0.2 }}
                                style={{ height: "100%", borderRadius: 99, backgroundColor: T.gold }}
                              />
                            </div>
                            <p style={{ fontSize: 9, color: T.sub, marginTop: 3, textAlign: "right" }}>
                              {badge.progress}/{badge.total}
                            </p>
                          </div>
                        )}

                        {/* earned checkmark */}
                        {badge.earned && (
                          <div style={{ display: "flex", justifyContent: "center", marginTop: 8 }}>
                            <CheckCircle2 size={14} color="#4CAF50"/>
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* ══ MILESTONES TAB ═══════════════════════ */}
            {tab === "Milestones" && (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>

                {/* Skill Progress */}
                <div style={{
                  backgroundColor: T.parchment, border: `1px solid ${T.border}`,
                  borderRadius: 24, padding: 24
                }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 20 }}>
                    <TrendingUp size={16} color={T.gold}/>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Skill Completion</h3>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                    {MILESTONES.map((m, i) => (
                      <div key={m.label}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6, alignItems: "center" }}>
                          <div style={{ display: "flex", alignItems: "center", gap: 8, color: T.text }}>
                            <span style={{ color: m.color }}>{m.icon}</span>
                            <span style={{ fontSize: 13, fontWeight: 500 }}>{m.label}</span>
                          </div>
                          <span style={{ fontSize: 12, fontWeight: 700, color: m.pct === 100 ? "#4CAF50" : T.goldDark }}>
                            {m.pct}%
                          </span>
                        </div>
                        <div style={{ height: 8, borderRadius: 99, backgroundColor: T.muted, overflow: "hidden" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${m.pct}%` }}
                            transition={{ duration: 1, delay: i * 0.1 }}
                            style={{
                              height: "100%", borderRadius: 99,
                              backgroundColor: m.pct === 100 ? "#4CAF50" : m.color
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right col: XP breakdown + next milestones */}
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>

                  {/* XP Breakdown */}
                  <div style={{
                    backgroundColor: T.parchment, border: `1px solid ${T.border}`,
                    borderRadius: 24, padding: 24
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                      <Zap size={16} color={T.gold}/>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text }}>XP Earned</h3>
                    </div>
                    {[
                      { label: "Skill Tracks",   xp: 1200, color: "#4CAF50" },
                      { label: "Badge Unlocks",  xp: 780,  color: T.gold },
                      { label: "Daily Streaks",  xp: 280,  color: "#E91E63" },
                      { label: "Resume Tasks",   xp: 120,  color: "#2196F3" },
                    ].map(row => (
                      <div key={row.label} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <div style={{ width: 8, height: 8, borderRadius: "50%", backgroundColor: row.color }}/>
                          <span style={{ fontSize: 12, color: T.sub }}>{row.label}</span>
                        </div>
                        <span style={{ fontSize: 12, fontWeight: 700, color: T.text }}>+{row.xp}</span>
                      </div>
                    ))}
                    <div style={{ height: 1, backgroundColor: T.border, margin: "10px 0" }}/>
                    <div style={{ display: "flex", justifyContent: "space-between" }}>
                      <span style={{ fontSize: 13, fontWeight: 600, color: T.text }}>Total</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: T.goldDark }}>2,380 XP</span>
                    </div>
                  </div>

                  {/* Next milestones */}
                  <div style={{
                    backgroundColor: T.parchment, border: `1px solid ${T.border}`,
                    borderRadius: 24, padding: 24
                  }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 16 }}>
                      <Target size={16} color={T.gold}/>
                      <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Up Next</h3>
                    </div>
                    {[
                      { label: "Reach Level 4",       sub: "120 XP away",     progress: 84 },
                      { label: "Complete JS Track",   sub: "40% remaining",   progress: 60 },
                      { label: "30-Day Streak",       sub: "23 days to go",   progress: 23 },
                    ].map((item, i) => (
                      <div key={i} style={{ marginBottom: 14, padding: "12px 14px", borderRadius: 14, backgroundColor: T.muted }}>
                        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: T.text }}>{item.label}</span>
                          <span style={{ fontSize: 10, color: T.sub }}>{item.sub}</span>
                        </div>
                        <div style={{ height: 4, borderRadius: 99, backgroundColor: T.border, overflow: "hidden" }}>
                          <motion.div
                            initial={{ width: 0 }}
                            animate={{ width: `${item.progress}%` }}
                            transition={{ duration: 1, delay: i * 0.15 }}
                            style={{ height: "100%", borderRadius: 99, backgroundColor: T.gold }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            )}

            {/* ══ LEADERBOARD TAB ══════════════════════ */}
            {tab === "Leaderboard" && (
              <div>
                {/* Podium top-3 */}
                <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center", gap: 12, marginBottom: 28 }}>
                  {[LEADERBOARD[1], LEADERBOARD[0], LEADERBOARD[2]].map((user, podiumIdx) => {
                    const heights = [100, 130, 85];
                    const rankColors = ["#C0C0C0","#C8A84B","#CD7F32"];
                    const actualRank = [2,1,3][podiumIdx];
                    return (
                      <motion.div
                        key={user.rank}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: podiumIdx * 0.1 }}
                        style={{ textAlign: "center", flex: 1, maxWidth: 180 }}
                      >
                        <div style={{
                          width: 52, height: 52, borderRadius: "50%", margin: "0 auto 8px",
                          backgroundColor: rankColors[podiumIdx] + "22",
                          border: `2px solid ${rankColors[podiumIdx]}`,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 16, fontWeight: 700, color: rankColors[podiumIdx]
                        }}>
                          {user.avatar}
                        </div>
                        <p style={{ fontSize: 12, fontWeight: user.isMe ? 700 : 500, color: user.isMe ? T.goldDark : T.text }}>{user.name}{user.isMe ? " 👈" : ""}</p>
                        <p style={{ fontSize: 11, color: T.sub, marginTop: 2 }}>{user.xp.toLocaleString()} XP</p>
                        <div style={{
                          marginTop: 10, height: heights[podiumIdx], borderRadius: "12px 12px 0 0",
                          backgroundColor: rankColors[podiumIdx] + "33",
                          border: `1px solid ${rankColors[podiumIdx]}55`,
                          display: "flex", alignItems: "center", justifyContent: "center"
                        }}>
                          <span style={{ fontSize: 22, fontWeight: 800, color: rankColors[podiumIdx] }}>#{actualRank}</span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Full table */}
                <div style={{
                  backgroundColor: T.parchment, border: `1px solid ${T.border}`,
                  borderRadius: 24, overflow: "hidden"
                }}>
                  <div style={{ padding: "16px 24px", borderBottom: `1px solid ${T.border}`, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <h3 style={{ fontSize: 14, fontWeight: 700, color: T.text }}>Global Rankings</h3>
                    <span style={{ fontSize: 11, color: T.sub }}>Updated daily</span>
                  </div>
                  {LEADERBOARD.map((user, idx) => (
                    <motion.div
                      key={user.rank}
                      initial={{ opacity: 0, x: -12 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.06 }}
                      style={{
                        display: "flex", alignItems: "center", gap: 14,
                        padding: "14px 24px",
                        backgroundColor: user.isMe ? T.gold + "18" : "transparent",
                        borderBottom: idx < LEADERBOARD.length - 1 ? `1px solid ${T.border}` : "none",
                        borderLeft: user.isMe ? `3px solid ${T.gold}` : "3px solid transparent"
                      }}
                    >
                      {/* rank */}
                      <span style={{
                        fontSize: 13, fontWeight: 700, width: 28, textAlign: "center",
                        color: idx < 3 ? ["#C8A84B","#C0C0C0","#CD7F32"][idx] : T.sub
                      }}>
                        {idx < 3 ? ["🥇","🥈","🥉"][idx] : `#${user.rank}`}
                      </span>

                      {/* avatar */}
                      <div style={{
                        width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                        backgroundColor: user.isMe ? T.gold : T.muted,
                        border: `1px solid ${user.isMe ? T.gold : T.border}`,
                        display: "flex", alignItems: "center", justifyContent: "center",
                        fontSize: 11, fontWeight: 700, color: user.isMe ? T.brown : T.sub
                      }}>
                        {user.avatar}
                      </div>

                      {/* name */}
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 13, fontWeight: user.isMe ? 700 : 500, color: T.text }}>
                          {user.name}
                          {user.isMe && <span style={{ marginLeft: 6, fontSize: 10, color: T.goldDark, fontWeight: 600 }}>YOU</span>}
                        </span>
                      </div>

                      {/* rise indicator */}
                      {user.rise && (
                        <ChevronUp size={14} color="#4CAF50"/>
                      )}

                      {/* XP */}
                      <span style={{ fontSize: 13, fontWeight: 700, color: T.goldDark }}>
                        {user.xp.toLocaleString()} XP
                      </span>
                    </motion.div>
                  ))}
                </div>

                {/* unlock notice */}
                <div style={{
                  marginTop: 14, padding: "14px 20px", borderRadius: 16,
                  border: `1px dashed ${T.border}`, backgroundColor: T.parchment,
                  display: "flex", alignItems: "center", gap: 10
                }}>
                  <Sparkles size={14} color={T.gold}/>
                  <p style={{ fontSize: 12, color: T.sub }}>
                    Reach <strong style={{ color: T.goldDark }}>Top 10</strong> to unlock the <strong style={{ color: T.goldDark }}>🏆 Top 10</strong> badge and earn <strong style={{ color: T.goldDark }}>+200 XP</strong>.
                  </p>
                </div>
              </div>
            )}

          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
