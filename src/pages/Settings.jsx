import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  User, Lock, Bell, Sun, Moon, ChevronRight,
  Camera, Shield, Eye, EyeOff, Check,
  Globe, Palette, LogOut, Trash2, AlertTriangle, Save,
} from "lucide-react";
import { logout } from "../auth";

const API = "http://localhost:8000/api";
const getToken = () => localStorage.getItem("token");

/* ─── API HELPERS ────────────────────────────────────────── */
const apiFetch = async (path, options = {}) => {
  const res = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
      ...options.headers,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.detail || "Something went wrong.");
  return data;
};

/* ─── COLOUR TOKENS ──────────────────────────────────────── */
const T = {
  cream: "#FDFCF8", parchment: "#F5F0E8", border: "#DDD5BE",
  muted: "#EDE7D9", gold: "#C8A84B", goldDark: "#9a6f10",
  brown: "#2E2218", brownMid: "#5a3f1a", text: "#1a1008", sub: "#967A68",
};
const darkTokens = {
  cream: "#1a1410", parchment: "#221c14", border: "#3a2e20",
  muted: "#2e2418", gold: "#C8A84B", goldDark: "#e8c060",
  brown: "#F5F0E8", brownMid: "#DDD5BE", text: "#F5F0E8", sub: "#a08060",
};

const inputCls = (dark) =>
  `w-full px-4 py-2.5 text-sm rounded-[12px] border transition-all outline-none ` +
  (dark
    ? "bg-[#2e2418] border-[#3a2e20] text-[#F5F0E8] placeholder-[#5a4a30] focus:border-[#C8A84B]"
    : "bg-[#F5F0E8] border-[#DDD5BE] text-[#1a1008] placeholder-[#C8B89A] focus:border-[#C8A84B]");

/* ─── MAIN ───────────────────────────────────────────────── */
export default function Settings() {
  const navigate = useNavigate();
  const [dark, setDark]                   = useState(false);
  const C = dark ? darkTokens : T;

  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword,  setShowPassword]  = useState(false);
  const [showCurrent,   setShowCurrent]   = useState(false);

  // feedback states
  const [saving,   setSaving]   = useState(false);
  const [saved,    setSaved]    = useState(false);
  const [error,    setError]    = useState("");

  // modal states
  const [showDeleteModal,  setShowDeleteModal]  = useState(false);
  const [deleteType,       setDeleteType]       = useState("data"); // "data" | "account"
  const [deleting,         setDeleting]         = useState(false);

  // profile state — loaded from backend on mount
  const [profile, setProfile] = useState({
    name: "", email: "", phone: "", location: "", bio: "", avatar: "",
  });
  const [loadingProfile, setLoadingProfile] = useState(true);

  // password state
  const [passwords, setPasswords] = useState({ current: "", next: "", confirm: "" });
  const [pwError,   setPwError]   = useState("");

  // notifications (local only — no backend for these yet)
  const [notifs, setNotifs] = useState({
    resumeUpdates: true, badgeUnlocks: true,
    weeklyDigest: false, productTips: true,
    smsAlerts: false, pushAlerts: true,
  });

  // language / region (local only)
  const [lang,   setLang]   = useState("en");
  const [region, setRegion] = useState("IN");

  // ── Load profile on mount ──────────────────────────────
  useEffect(() => {
    apiFetch("/settings/profile")
      .then(data => {
        setProfile({
          name:     data.username || "",
          email:    data.email    || "",
          phone:    data.phone    || "",
          location: data.location || "",
          bio:      data.bio      || "",
          avatar:   data.avatar   || "",
        });
      })
      .catch(err => setError(err.message))
      .finally(() => setLoadingProfile(false));
  }, []);

  // ── Save profile ───────────────────────────────────────
  const handleSaveProfile = async () => {
    setSaving(true); setError("");
    try {
      await apiFetch("/settings/profile", {
        method: "PUT",
        body: JSON.stringify({
          username: profile.name,  // DB column is username
          phone:    profile.phone,
          location: profile.location,
          bio:      profile.bio,
          avatar:   profile.avatar,
        }),
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2200);
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Save password ──────────────────────────────────────
  const handleSavePassword = async () => {
    setPwError(""); setError("");
    if (passwords.next !== passwords.confirm) {
      setPwError("New passwords don't match."); return;
    }
    if (passwords.next.length < 8) {
      setPwError("Password must be at least 8 characters."); return;
    }
    setSaving(true);
    try {
      await apiFetch("/settings/password", {
        method: "PUT",
        body: JSON.stringify({
          current_password: passwords.current,
          new_password:     passwords.next,
        }),
      });
      setPasswords({ current: "", next: "", confirm: "" });
      setSaved(true);
      // Show success briefly then auto-logout — user must re-login with new password
      setTimeout(() => {
        logout();
        navigate("/login");
      }, 1500);
    } catch (err) {
      setPwError(err.message);
    } finally {
      setSaving(false);
    }
  };

  // ── Delete data / account ──────────────────────────────
  const handleDelete = async () => {
    setDeleting(true);
    try {
      if (deleteType === "data") {
        await apiFetch("/settings/data", { method: "DELETE" });
        setShowDeleteModal(false);
        // Reload profile to reflect cleared data
        setProfile(p => ({ ...p, phone: "", location: "", bio: "", avatar: "" }));
      } else {
        await apiFetch("/settings/account", { method: "DELETE" });
        logout();
        navigate("/login");
      }
    } catch (err) {
      setError(err.message);
      setShowDeleteModal(false);
    } finally {
      setDeleting(false);
    }
  };

  // ── Avatar upload ──────────────────────────────────────
  const handleAvatarUpload = (e) => {
    const f = e.target.files[0]; if (!f) return;
    const r = new FileReader();
    r.onloadend = () => setProfile(p => ({ ...p, avatar: r.result }));
    r.readAsDataURL(f);
  };

  const NAV = [
    { id: "profile",       label: "Profile",       icon: User },
    { id: "password",      label: "Password",      icon: Lock },
    { id: "appearance",    label: "Appearance",    icon: Palette },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "region",        label: "Language",      icon: Globe },
    { id: "danger",        label: "Danger Zone",   icon: AlertTriangle },
  ];

  // Reset feedback when switching sections
  const switchSection = (id) => {
    setActiveSection(id);
    setError(""); setPwError(""); setSaved(false);
  };

  return (
    <div className="min-h-screen transition-colors duration-300"
      style={{ backgroundColor: C.cream, fontFamily: "'Outfit', sans-serif", color: C.text }}>

      {/* ── HEADER ── */}
      <header style={{ borderBottom: `1px solid ${C.border}`, backgroundColor: C.cream, position: "sticky", top: 0, zIndex: 20 }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ color: C.gold, fontWeight: 600, fontSize: 18, letterSpacing: "0.03em" }}>TrueNorth</span>
            <span style={{ color: C.border, margin: "0 8px" }}>|</span>
            <span style={{ color: C.sub, fontSize: 14 }}>Settings</span>
          </div>
          <button onClick={() => setDark(d => !d)}
            style={{ display: "flex", alignItems: "center", gap: 6, padding: "6px 14px", borderRadius: 99, border: `1px solid ${C.border}`, backgroundColor: C.parchment, color: C.sub, fontSize: 12, cursor: "pointer" }}>
            {dark ? <Sun size={13} color={C.gold}/> : <Moon size={13} color={C.sub}/>}
            {dark ? "Light" : "Dark"}
          </button>
        </div>
      </header>

      <div style={{ maxWidth: 1100, margin: "0 auto", padding: "32px 24px", display: "grid", gridTemplateColumns: "220px 1fr", gap: 28, alignItems: "start" }}>

        {/* ── SIDEBAR ── */}
        <div style={{ position: "sticky", top: 73 }}>
          {/* Avatar card */}
          <div style={{ backgroundColor: C.parchment, border: `1px solid ${C.border}`, borderRadius: 20, padding: 20, marginBottom: 12, textAlign: "center" }}>
            <div style={{ position: "relative", display: "inline-block" }}>
              <div style={{ width: 68, height: 68, borderRadius: "50%", backgroundColor: C.muted, border: `2px solid ${C.gold}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", margin: "0 auto" }}>
                {profile.avatar
                  ? <img src={profile.avatar} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }}/>
                  : <User size={28} color={C.sub}/>}
              </div>
              <label style={{ position: "absolute", bottom: 0, right: -4, width: 24, height: 24, borderRadius: "50%", backgroundColor: C.gold, display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", border: `2px solid ${C.cream}` }}>
                <Camera size={11} color={C.brown}/>
                <input type="file" accept="image/*" hidden onChange={handleAvatarUpload}/>
              </label>
            </div>
            <p style={{ fontWeight: 700, fontSize: 14, marginTop: 10, color: C.text }}>
              {loadingProfile ? "Loading…" : profile.name || profile.email}
            </p>
            <p style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{profile.email}</p>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 4, marginTop: 8, padding: "3px 10px", borderRadius: 99, backgroundColor: C.muted, fontSize: 10, color: C.goldDark, fontWeight: 600 }}>
              ✦ Pro Member
            </div>
          </div>

          {/* Nav */}
          <div style={{ backgroundColor: C.parchment, border: `1px solid ${C.border}`, borderRadius: 20, overflow: "hidden" }}>
            {NAV.map((item, idx) => {
              const Icon = item.icon;
              const active = activeSection === item.id;
              const isDanger = item.id === "danger";
              return (
                <button key={item.id} onClick={() => switchSection(item.id)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", backgroundColor: active ? C.muted : "transparent", borderBottom: idx < NAV.length - 1 ? `1px solid ${C.border}` : "none", color: isDanger ? "#e05a4a" : active ? C.goldDark : C.sub, cursor: "pointer", transition: "all .15s", border: "none", textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 9, fontSize: 13, fontWeight: active ? 600 : 400 }}>
                    <Icon size={14} color={isDanger ? "#e05a4a" : active ? C.gold : C.sub}/>
                    {item.label}
                  </div>
                  {active && <ChevronRight size={13} color={C.gold}/>}
                </button>
              );
            })}
          </div>

          {/* Sign out */}
          <button onClick={() => { logout(); navigate("/login"); }}
            style={{ width: "100%", marginTop: 10, padding: "10px 16px", borderRadius: 14, border: `1px solid ${C.border}`, backgroundColor: "transparent", display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: C.sub, fontSize: 13, cursor: "pointer" }}>
            <LogOut size={13}/> Sign Out
          </button>
        </div>

        {/* ── MAIN PANEL ── */}
        <AnimatePresence mode="wait">
          <motion.div key={activeSection}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}>

            {/* Global error banner */}
            {error && (
              <div style={{ marginBottom: 16, padding: "12px 16px", borderRadius: 12, backgroundColor: "#fde8e5", border: "1px solid #f0c0b8", color: "#c0382a", fontSize: 13 }}>
                ⚠️ {error}
              </div>
            )}

            {/* ── PROFILE ── */}
            {activeSection === "profile" && (
              <Panel C={C} title="Profile Information" subtitle="Update your personal details">
                {loadingProfile ? (
                  <p style={{ color: C.sub, fontSize: 13 }}>Loading profile…</p>
                ) : (
                  <>
                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                      <FieldWrap label="Full Name" C={C}>
                        <input className={inputCls(dark)} value={profile.name}
                          onChange={e => setProfile(p => ({ ...p, name: e.target.value }))} placeholder="Your name"/>
                      </FieldWrap>
                      <FieldWrap label="Email Address" C={C}>
                        {/* Email is read-only — changing email needs extra verification */}
                        <input className={inputCls(dark)} value={profile.email} readOnly
                          style={{ opacity: 0.6, cursor: "not-allowed" }}/>
                      </FieldWrap>
                      <FieldWrap label="Phone" C={C}>
                        <input className={inputCls(dark)} value={profile.phone}
                          onChange={e => setProfile(p => ({ ...p, phone: e.target.value }))} placeholder="+91 98765 43210"/>
                      </FieldWrap>
                      <FieldWrap label="Location" C={C}>
                        <input className={inputCls(dark)} value={profile.location}
                          onChange={e => setProfile(p => ({ ...p, location: e.target.value }))} placeholder="Mumbai, India"/>
                      </FieldWrap>
                      <div style={{ gridColumn: "1 / -1" }}>
                        <FieldWrap label="Bio" C={C}>
                          <textarea className={inputCls(dark)} rows={3} value={profile.bio}
                            onChange={e => setProfile(p => ({ ...p, bio: e.target.value }))}
                            placeholder="A short bio…" style={{ resize: "none" }}/>
                        </FieldWrap>
                      </div>
                    </div>
                    <SaveBar C={C} onSave={handleSaveProfile} saving={saving} saved={saved}/>
                  </>
                )}
              </Panel>
            )}

            {/* ── PASSWORD ── */}
            {activeSection === "password" && (
              <Panel C={C} title="Change Password" subtitle="Keep your account secure with a strong password">
                <div style={{ display: "flex", flexDirection: "column", gap: 16, maxWidth: 420 }}>
                  <FieldWrap label="Current Password" C={C}>
                    <div style={{ position: "relative" }}>
                      <input className={inputCls(dark)} type={showCurrent ? "text" : "password"}
                        value={passwords.current} onChange={e => setPasswords(p => ({ ...p, current: e.target.value }))}
                        placeholder="••••••••" style={{ paddingRight: 40 }}/>
                      <button onClick={() => setShowCurrent(v => !v)}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.sub }}>
                        {showCurrent ? <EyeOff size={15}/> : <Eye size={15}/>}
                      </button>
                    </div>
                  </FieldWrap>
                  <FieldWrap label="New Password" C={C}>
                    <div style={{ position: "relative" }}>
                      <input className={inputCls(dark)} type={showPassword ? "text" : "password"}
                        value={passwords.next} onChange={e => setPasswords(p => ({ ...p, next: e.target.value }))}
                        placeholder="••••••••" style={{ paddingRight: 40 }}/>
                      <button onClick={() => setShowPassword(v => !v)}
                        style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: C.sub }}>
                        {showPassword ? <EyeOff size={15}/> : <Eye size={15}/>}
                      </button>
                    </div>
                    <PasswordStrength val={passwords.next} C={C}/>
                  </FieldWrap>
                  <FieldWrap label="Confirm New Password" C={C}>
                    <input className={inputCls(dark)} type="password"
                      value={passwords.confirm} onChange={e => setPasswords(p => ({ ...p, confirm: e.target.value }))}
                      placeholder="••••••••"/>
                    {passwords.confirm && (
                      <p style={{ fontSize: 11, marginTop: 4, color: passwords.next === passwords.confirm ? "#4caf50" : "#e05a4a" }}>
                        {passwords.next === passwords.confirm ? "✓ Passwords match" : "✗ Passwords don't match"}
                      </p>
                    )}
                  </FieldWrap>
                  {pwError && <p style={{ fontSize: 12, color: "#e05a4a" }}>⚠️ {pwError}</p>}
                </div>
                <div style={{ marginTop: 8 }}>
                  <InfoBox C={C} icon={<Shield size={13}/>} text="Use 8+ characters with a mix of letters, numbers & symbols."/>
                </div>
                <SaveBar C={C} onSave={handleSavePassword} saving={saving} saved={saved} label="Update Password"/>
              </Panel>
            )}

            {/* ── APPEARANCE ── */}
            {activeSection === "appearance" && (
              <Panel C={C} title="Appearance" subtitle="Customise how TrueNorth looks for you">
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.sub }}>Theme</p>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                    {[
                      { id: "light", label: "Light", icon: <Sun size={22} color={C.gold}/>, desc: "Warm parchment tones" },
                      { id: "dark",  label: "Dark",  icon: <Moon size={22} color={C.gold}/>, desc: "Easy on the eyes" },
                    ].map(opt => (
                      <button key={opt.id} onClick={() => setDark(opt.id === "dark")}
                        style={{ padding: "20px 18px", borderRadius: 16, textAlign: "left", cursor: "pointer", border: `2px solid ${(dark ? "dark" : "light") === opt.id ? C.gold : C.border}`, backgroundColor: (dark ? "dark" : "light") === opt.id ? C.muted : C.parchment, transition: "all .2s" }}>
                        <div style={{ marginBottom: 10 }}>{opt.icon}</div>
                        <p style={{ fontSize: 14, fontWeight: 600, color: C.text }}>{opt.label}</p>
                        <p style={{ fontSize: 11, color: C.sub, marginTop: 2 }}>{opt.desc}</p>
                        {(dark ? "dark" : "light") === opt.id && (
                          <div style={{ marginTop: 10, display: "inline-flex", alignItems: "center", gap: 4, fontSize: 10, color: C.goldDark, fontWeight: 600, backgroundColor: C.muted, padding: "2px 8px", borderRadius: 99 }}>
                            <Check size={9}/> Active
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                  <div style={{ height: 1, backgroundColor: C.border, margin: "8px 0" }}/>
                  <p style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.sub }}>Accent Colour</p>
                  <div style={{ display: "flex", gap: 10 }}>
                    {["#C8A84B","#4CAF50","#2196F3","#E91E63","#9C27B0"].map(col => (
                      <button key={col} title={col} style={{ width: 30, height: 30, borderRadius: "50%", backgroundColor: col, border: `3px solid ${col === "#C8A84B" ? C.text : "transparent"}`, cursor: "pointer" }}/>
                    ))}
                  </div>
                  <p style={{ fontSize: 11, color: C.sub }}>More colour options coming soon.</p>
                </div>
              </Panel>
            )}

            {/* ── NOTIFICATIONS ── */}
            {activeSection === "notifications" && (
              <Panel C={C} title="Notifications" subtitle="Choose what you want to hear about">
                <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
                  <NotifGroup label="In-App" C={C}>
                    <Toggle C={C} dark={dark} label="Resume Updates"  sub="When your resume is viewed or downloaded"    val={notifs.resumeUpdates} onChange={v => setNotifs(n => ({ ...n, resumeUpdates: v }))}/>
                    <Toggle C={C} dark={dark} label="Badge Unlocks"   sub="Celebrate new achievements"                 val={notifs.badgeUnlocks}  onChange={v => setNotifs(n => ({ ...n, badgeUnlocks: v }))}/>
                    <Toggle C={C} dark={dark} label="Product Tips"    sub="Helpful hints to get more from TrueNorth"   val={notifs.productTips}   onChange={v => setNotifs(n => ({ ...n, productTips: v }))}/>
                  </NotifGroup>
                  <NotifGroup label="Email" C={C}>
                    <Toggle C={C} dark={dark} label="Weekly Digest"   sub="Your week in review every Monday"           val={notifs.weeklyDigest}  onChange={v => setNotifs(n => ({ ...n, weeklyDigest: v }))}/>
                  </NotifGroup>
                  <NotifGroup label="Mobile" C={C}>
                    <Toggle C={C} dark={dark} label="Push Alerts"     sub="Instant updates on your phone"             val={notifs.pushAlerts}    onChange={v => setNotifs(n => ({ ...n, pushAlerts: v }))}/>
                    <Toggle C={C} dark={dark} label="SMS Alerts"      sub="Text messages for critical updates"        val={notifs.smsAlerts}     onChange={v => setNotifs(n => ({ ...n, smsAlerts: v }))}/>
                  </NotifGroup>
                </div>
                <SaveBar C={C} onSave={() => { setSaved(true); setTimeout(() => setSaved(false), 2200); }} saving={false} saved={saved}/>
              </Panel>
            )}

            {/* ── LANGUAGE / REGION ── */}
            {activeSection === "region" && (
              <Panel C={C} title="Language & Region" subtitle="Set your locale preferences">
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, maxWidth: 480 }}>
                  <FieldWrap label="Language" C={C}>
                    <select className={inputCls(dark)} value={lang} onChange={e => setLang(e.target.value)}>
                      <option value="en">English</option>
                      <option value="hi">हिन्दी (Hindi)</option>
                      <option value="mr">मराठी (Marathi)</option>
                      <option value="ta">தமிழ் (Tamil)</option>
                    </select>
                  </FieldWrap>
                  <FieldWrap label="Region" C={C}>
                    <select className={inputCls(dark)} value={region} onChange={e => setRegion(e.target.value)}>
                      <option value="IN">India</option>
                      <option value="US">United States</option>
                      <option value="GB">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </FieldWrap>
                </div>
                <SaveBar C={C} onSave={() => { setSaved(true); setTimeout(() => setSaved(false), 2200); }} saving={false} saved={saved}/>
              </Panel>
            )}

            {/* ── DANGER ZONE ── */}
            {activeSection === "danger" && (
              <Panel C={C} title="Danger Zone" subtitle="Irreversible actions — proceed with caution">
                <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                  <DangerRow C={C}
                    icon={<Trash2 size={16} color="#e05a4a"/>}
                    title="Delete All Data"
                    sub="Permanently erase your resumes, badges and progress. Cannot be undone."
                    label="Delete Data"
                    onClick={() => { setDeleteType("data"); setShowDeleteModal(true); }}
                  />
                  <DangerRow C={C}
                    icon={<AlertTriangle size={16} color="#e05a4a"/>}
                    title="Close Account"
                    sub="Your account and all associated data will be permanently removed."
                    label="Close Account"
                    onClick={() => { setDeleteType("account"); setShowDeleteModal(true); }}
                  />
                </div>
              </Panel>
            )}

          </motion.div>
        </AnimatePresence>
      </div>

      {/* ── DELETE MODAL ── */}
      <AnimatePresence>
        {showDeleteModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: "fixed", inset: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
            <motion.div initial={{ scale: 0.92, y: 20 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.92, y: 20 }}
              style={{ backgroundColor: C.cream, borderRadius: 24, padding: 32, maxWidth: 400, width: "90%", border: `1px solid ${C.border}`, textAlign: "center" }}>
              <div style={{ width: 52, height: 52, borderRadius: "50%", backgroundColor: "#fde8e5", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
                <AlertTriangle size={24} color="#e05a4a"/>
              </div>
              <h3 style={{ fontSize: 18, fontWeight: 700, color: C.text, marginBottom: 8 }}>Are you sure?</h3>
              <p style={{ fontSize: 13, color: C.sub, lineHeight: 1.6, marginBottom: 24 }}>
                {deleteType === "account"
                  ? "Your account will be permanently deleted. This cannot be undone."
                  : "All your data (resumes, badges, progress) will be permanently erased."}
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button onClick={() => setShowDeleteModal(false)} disabled={deleting}
                  style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: `1px solid ${C.border}`, backgroundColor: C.parchment, color: C.sub, fontSize: 13, cursor: "pointer" }}>
                  Cancel
                </button>
                <button onClick={handleDelete} disabled={deleting}
                  style={{ flex: 1, padding: "11px 0", borderRadius: 12, border: "none", backgroundColor: "#e05a4a", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer", opacity: deleting ? 0.7 : 1 }}>
                  {deleting ? "Deleting…" : deleteType === "account" ? "Yes, Close Account" : "Yes, Delete Data"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ─── SUB-COMPONENTS ─────────────────────────────────────── */
function Panel({ C, title, subtitle, children }) {
  return (
    <div style={{ backgroundColor: C.parchment, border: `1px solid ${C.border}`, borderRadius: 24, overflow: "hidden", boxShadow: "0 8px 32px rgba(46,34,24,.08)" }}>
      <div style={{ padding: "24px 28px", borderBottom: `1px solid ${C.border}` }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: C.text }}>{title}</h2>
        <p style={{ fontSize: 12, color: C.sub, marginTop: 3 }}>{subtitle}</p>
      </div>
      <div style={{ padding: "28px" }}>{children}</div>
    </div>
  );
}

function FieldWrap({ label, C, children }) {
  return (
    <div>
      <label style={{ display: "block", fontSize: 11, fontWeight: 600, color: C.sub, marginBottom: 6, textTransform: "uppercase", letterSpacing: "0.06em" }}>{label}</label>
      {children}
    </div>
  );
}

function SaveBar({ C, onSave, saving, saved, label = "Save Changes" }) {
  return (
    <div style={{ marginTop: 24, paddingTop: 20, borderTop: `1px solid ${C.border}`, display: "flex", justifyContent: "flex-end" }}>
      <button onClick={onSave} disabled={saving}
        style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 22px", borderRadius: 12, border: "none", backgroundColor: saved ? "#4CAF50" : C.gold, color: saved ? "#fff" : C.brown, fontSize: 13, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", opacity: saving ? 0.7 : 1, transition: "all .2s" }}>
        {saving ? "Saving…" : saved ? <><Check size={14}/> Saved!</> : <><Save size={14}/> {label}</>}
      </button>
    </div>
  );
}

function InfoBox({ C, icon, text }) {
  return (
    <div style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "12px 14px", borderRadius: 12, backgroundColor: C.muted, border: `1px solid ${C.border}` }}>
      <span style={{ color: C.goldDark, flexShrink: 0, marginTop: 1 }}>{icon}</span>
      <p style={{ fontSize: 12, color: C.brownMid, lineHeight: 1.5 }}>{text}</p>
    </div>
  );
}

function PasswordStrength({ val, C }) {
  const score = !val ? 0 : val.length < 6 ? 1 : val.length < 10 ? 2 : /[A-Z]/.test(val) && /[0-9]/.test(val) && /[^a-zA-Z0-9]/.test(val) ? 4 : 3;
  const labels = ["", "Weak", "Fair", "Good", "Strong"];
  const colors = ["", "#e05a4a", "#f0a030", "#C8A84B", "#4CAF50"];
  return (
    <div style={{ marginTop: 6 }}>
      <div style={{ display: "flex", gap: 4, marginBottom: 4 }}>
        {[1,2,3,4].map(i => <div key={i} style={{ flex: 1, height: 3, borderRadius: 99, backgroundColor: i <= score ? colors[score] : C.border, transition: "background-color .3s" }}/>)}
      </div>
      {val && <p style={{ fontSize: 11, color: colors[score] }}>{labels[score]}</p>}
    </div>
  );
}

function NotifGroup({ label, C, children }) {
  return (
    <div>
      <p style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em", color: C.sub, marginBottom: 8, marginTop: 8 }}>{label}</p>
      <div style={{ borderRadius: 16, border: `1px solid ${C.border}`, overflow: "hidden" }}>{children}</div>
    </div>
  );
}

function Toggle({ C, dark, label, sub, val, onChange }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 18px", backgroundColor: dark ? "#221c14" : "#fff", borderBottom: `1px solid ${C.border}` }}>
      <div>
        <p style={{ fontSize: 13, fontWeight: 500, color: C.text }}>{label}</p>
        <p style={{ fontSize: 11, color: C.sub, marginTop: 1 }}>{sub}</p>
      </div>
      <button onClick={() => onChange(!val)}
        style={{ width: 42, height: 24, borderRadius: 99, border: "none", cursor: "pointer", backgroundColor: val ? C.gold : C.border, position: "relative", flexShrink: 0, transition: "background-color .2s" }}>
        <div style={{ position: "absolute", top: 3, left: val ? 21 : 3, width: 18, height: 18, borderRadius: "50%", backgroundColor: "#fff", transition: "left .2s", boxShadow: "0 1px 4px rgba(0,0,0,.2)" }}/>
      </button>
    </div>
  );
}

function DangerRow({ C, icon, title, sub, label, onClick }) {
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16, padding: 20, borderRadius: 16, border: "1px solid #f0c0b8", backgroundColor: "#fef6f4" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <div style={{ width: 36, height: 36, borderRadius: 10, backgroundColor: "#fde8e5", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>{icon}</div>
        <div>
          <p style={{ fontSize: 13, fontWeight: 600, color: "#c0382a" }}>{title}</p>
          <p style={{ fontSize: 11, color: "#a06050", marginTop: 2, lineHeight: 1.5 }}>{sub}</p>
        </div>
      </div>
      <button onClick={onClick} style={{ flexShrink: 0, padding: "8px 16px", borderRadius: 10, border: "1px solid #e05a4a", backgroundColor: "transparent", color: "#e05a4a", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>
        {label}
      </button>
    </div>
  );
}