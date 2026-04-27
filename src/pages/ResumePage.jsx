import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronRight, ChevronLeft, Upload, User,
  Mail, Phone, Globe, MapPin, ExternalLink,
  Trash2, CheckCircle2,
} from "lucide-react";
import { isAuthenticated, logout } from "../auth";

import { STEPS, DEGREE_OPTIONS, SUGGESTED_SKILLS, SUGGESTED_HOBBIES, inputCls } from "./components/constants";
import { Field, SectionCard, AddButton }   from "./components/FormComponents";
import { TemplatePicker }                  from "./components/TemplatePicker";
import { TemplateModern }                  from "./components/TemplateModern";
import { TemplateClassic }                 from "./components/TemplateClassic";
import { TemplateTwoCol }                  from "./components/TemplateTwoCol";
import { downloadPDF }                     from "./components/Pdfexport";

export default function ResumePage() {
  const [step,          setStep]          = useState(0);
  const [skillInput,    setSkillInput]    = useState("");
  const [hobbyInput,    setHobbyInput]    = useState("");
  const [template,      setTemplate]      = useState("modern");
  const [showTplPicker, setShowTplPicker] = useState(false);

  const [formData, setFormData] = useState({
    personal:   { name:"", email:"", phone:"", location:"", linkedin:"", portfolio:"", summary:"", image:"" },
    education:  [{ school:"", degree:"", year:"" }],
    experience: [{ company:"", role:"", start:"", end:"", desc:"" }],
    projects:   [{ title:"", tech:"", link:"", desc:"" }],
    skills:     [],
    hobbies:    [],
  });

  // Persist to localStorage
  useEffect(() => {
    const saved    = localStorage.getItem("resumeData");
    const savedTpl = localStorage.getItem("resumeTemplate");
    if (saved)    setFormData(JSON.parse(saved));
    if (savedTpl) setTemplate(savedTpl);
  }, []);

  useEffect(() => { localStorage.setItem("resumeData",     JSON.stringify(formData)); }, [formData]);
  useEffect(() => { localStorage.setItem("resumeTemplate", template);                 }, [template]);

  // Auth guard
  useEffect(() => {
    if (!isAuthenticated()) { alert("Session expired. Please login again."); logout(); }
  }, []);

  /* ── handlers ── */
  const updateField = (section, field, value, index = null) =>
    setFormData(prev => {
      const updated = { ...prev };
      if (index !== null)
        updated[section] = updated[section].map((item, i) => i === index ? { ...item, [field]: value } : item);
      else
        updated[section] = { ...updated[section], [field]: value };
      return updated;
    });

  const addField = (section) => {
    const tpls = {
      education:  { school:"", degree:"", year:"" },
      experience: { company:"", role:"", start:"", end:"", desc:"" },
      projects:   { title:"", tech:"", link:"", desc:"" },
    };
    setFormData(prev => ({ ...prev, [section]: [...prev[section], tpls[section]] }));
  };

  const removeField = (section, index) =>
    setFormData(prev => ({ ...prev, [section]: prev[section].filter((_, i) => i !== index) }));

  const addItem = (key, value, setValue) => {
    if (value.trim() && !formData[key].includes(value.trim()))
      setFormData(prev => ({ ...prev, [key]: [...prev[key], value.trim()] }));
    setValue("");
  };

  const removeItem = (key, index) =>
    setFormData(prev => ({ ...prev, [key]: prev[key].filter((_, i) => i !== index) }));

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => updateField("personal", "image", reader.result);
    reader.readAsDataURL(file);
  };

  const progress = (step / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-screen bg-[#FDFCF8]" style={{ fontFamily: "'Outfit', sans-serif" }}>

      {/* ── HEADER ── */}
      <header className="border-b border-[#DDD5BE] bg-[#FDFCF8] sticky top-0 z-20">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-[#C8A84B] font-semibold text-lg tracking-wide">TrueNorth</span>
            <span className="text-[#DDD5BE] mx-2">|</span>
            <span className="text-[#5A3F2A] text-sm">Resume Builder</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 text-xs text-[#5A3F2A]">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              return (
                <button key={s.label} onClick={() => i <= step && setStep(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all ${
                    i === step ? "bg-[#2E2218] text-[#F5F0E8]"
                    : i < step  ? "bg-[#EDE7D9] text-[#5A3F2A] cursor-pointer hover:bg-[#DDD5BE]"
                    : "text-[#DDD5BE] cursor-default"
                  }`}>
                  {i < step ? <CheckCircle2 size={11}/> : <Icon size={11}/>}
                  {s.label}
                </button>
              );
            })}
          </div>
        </div>
        <div className="h-0.5 bg-[#EDE7D9]">
          <motion.div className="h-full bg-[#C8A84B]"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: "easeInOut" }}
          />
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 grid lg:grid-cols-[1fr_400px] gap-8 items-start">

        {/* ── FORM PANEL ── */}
        <div className="bg-[#FDFCF8] border border-[#DDD5BE] rounded-[28px] shadow-[0_8px_32px_rgba(46,34,24,.10)] overflow-hidden">
          <div className="px-8 pt-8 pb-6 border-b border-[#EDE7D9] flex items-center gap-4">
            {(() => { const Icon = STEPS[step].icon; return (
              <div className="w-10 h-10 rounded-xl bg-[#EDE7D9] flex items-center justify-center text-[#C8A84B]">
                <Icon size={20}/>
              </div>
            ); })()}
            <div>
              <p className="text-[10px] text-[#5A3F2A] uppercase tracking-widest">Step {step+1} of {STEPS.length}</p>
              <h2 className="text-xl font-semibold text-[#2E2218]">{STEPS[step].label}</h2>
            </div>
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={step}
              initial={{ opacity:0, y:14 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0, y:-14 }}
              transition={{ duration:0.22 }} className="px-8 py-8">

              {/* PERSONAL */}
              {step === 0 && (
                <div className="space-y-5">
                  <div className="flex items-center gap-6">
                    <div className="w-20 h-20 rounded-full bg-[#EDE7D9] overflow-hidden flex items-center justify-center border-2 border-[#DDD5BE] flex-shrink-0">
                      {formData.personal.image
                        ? <img src={formData.personal.image} className="w-full h-full object-cover" alt="avatar"/>
                        : <User size={30} className="text-[#DDD5BE]"/>}
                    </div>
                    <div>
                      <label className="flex items-center gap-2 px-4 py-2 rounded-xl border border-[#DDD5BE] text-sm text-[#5A3F2A] hover:bg-[#EDE7D9] cursor-pointer transition-colors">
                        <Upload size={13}/> Upload Photo
                        <input type="file" accept="image/*" hidden onChange={handleImageUpload}/>
                      </label>
                      <p className="text-[10px] text-[#DDD5BE] mt-1.5 ml-0.5">JPG or PNG, max 2MB</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Field label="Full Name"         icon={<User size={13}/>}>
                      <input value={formData.personal.name}      onChange={e=>updateField("personal","name",e.target.value)}      placeholder="Arjun Sharma"       className={inputCls}/>
                    </Field>
                    <Field label="Email"             icon={<Mail size={13}/>}>
                      <input value={formData.personal.email}     onChange={e=>updateField("personal","email",e.target.value)}     placeholder="arjun@email.com"    className={inputCls}/>
                    </Field>
                    <Field label="Phone"             icon={<Phone size={13}/>}>
                      <input value={formData.personal.phone}     onChange={e=>updateField("personal","phone",e.target.value)}     placeholder="+91 98765 43210"    className={inputCls}/>
                    </Field>
                    <Field label="Location"          icon={<MapPin size={13}/>}>
                      <input value={formData.personal.location}  onChange={e=>updateField("personal","location",e.target.value)}  placeholder="Mumbai, India"      className={inputCls}/>
                    </Field>
                    <Field label="LinkedIn URL"      icon={<Globe size={13}/>}>
                      <input value={formData.personal.linkedin}  onChange={e=>updateField("personal","linkedin",e.target.value)}  placeholder="linkedin.com/in/arjun" className={inputCls}/>
                    </Field>
                    <Field label="Portfolio / Website" icon={<Globe size={13}/>}>
                      <input value={formData.personal.portfolio} onChange={e=>updateField("personal","portfolio",e.target.value)} placeholder="arjun.dev"          className={inputCls}/>
                    </Field>
                  </div>
                  <Field label="Professional Summary">
                    <textarea value={formData.personal.summary} onChange={e=>updateField("personal","summary",e.target.value)}
                      rows={4} placeholder="A brief 2–3 sentence summary…" className={`${inputCls} resize-none`}/>
                  </Field>
                </div>
              )}

              {/* EDUCATION */}
              {step === 1 && (
                <div className="space-y-4">
                  {formData.education.map((edu, i) => (
                    <SectionCard key={i} onRemove={() => removeField("education", i)} index={i}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="sm:col-span-2">
                          <Field label="School / University">
                            <input value={edu.school} onChange={e=>updateField("education","school",e.target.value,i)} placeholder="IIT Bombay" className={inputCls}/>
                          </Field>
                        </div>
                        <Field label="Degree">
                          <select value={edu.degree} onChange={e=>updateField("education","degree",e.target.value,i)} className={inputCls}>
                            <option value="">Select degree…</option>
                            {DEGREE_OPTIONS.map(d=><option key={d}>{d}</option>)}
                          </select>
                        </Field>
                        <Field label="Graduation Month">
                          <input type="month" value={edu.year} onChange={e=>updateField("education","year",e.target.value,i)} className={inputCls}/>
                        </Field>
                      </div>
                    </SectionCard>
                  ))}
                  <AddButton onClick={()=>addField("education")} label="Add Education"/>
                </div>
              )}

              {/* EXPERIENCE */}
              {step === 2 && (
                <div className="space-y-4">
                  {formData.experience.map((exp, i) => (
                    <SectionCard key={i} onRemove={() => removeField("experience", i)} index={i}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Company">
                          <input value={exp.company} onChange={e=>updateField("experience","company",e.target.value,i)} placeholder="Google" className={inputCls}/>
                        </Field>
                        <Field label="Role / Title">
                          <input value={exp.role} onChange={e=>updateField("experience","role",e.target.value,i)} placeholder="Software Engineer" className={inputCls}/>
                        </Field>
                        <Field label="Start Date">
                          <input type="month" value={exp.start} onChange={e=>updateField("experience","start",e.target.value,i)} className={inputCls}/>
                        </Field>
                        <Field label="End Date (or leave blank)">
                          <input type="month" value={exp.end} onChange={e=>updateField("experience","end",e.target.value,i)} className={inputCls}/>
                        </Field>
                        <div className="sm:col-span-2">
                          <Field label="What did you do?">
                            <textarea value={exp.desc} onChange={e=>updateField("experience","desc",e.target.value,i)}
                              rows={3} placeholder="• Led a team of 5 engineers…" className={`${inputCls} resize-none`}/>
                          </Field>
                        </div>
                      </div>
                    </SectionCard>
                  ))}
                  <AddButton onClick={()=>addField("experience")} label="Add Experience"/>
                </div>
              )}

              {/* PROJECTS */}
              {step === 3 && (
                <div className="space-y-4">
                  {formData.projects.map((p, i) => (
                    <SectionCard key={i} onRemove={() => removeField("projects", i)} index={i}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Field label="Project Title">
                          <input value={p.title} onChange={e=>updateField("projects","title",e.target.value,i)} placeholder="TrueNorth" className={inputCls}/>
                        </Field>
                        <Field label="Tech Stack">
                          <input value={p.tech} onChange={e=>updateField("projects","tech",e.target.value,i)} placeholder="React, Node.js" className={inputCls}/>
                        </Field>
                        <div className="sm:col-span-2">
                          <Field label="Live Link" icon={<ExternalLink size={12}/>}>
                            <input value={p.link} onChange={e=>updateField("projects","link",e.target.value,i)} placeholder="https://truenorth.app" className={inputCls}/>
                          </Field>
                        </div>
                        <div className="sm:col-span-2">
                          <Field label="Description">
                            <textarea value={p.desc} onChange={e=>updateField("projects","desc",e.target.value,i)}
                              rows={3} placeholder="What the project does…" className={`${inputCls} resize-none`}/>
                          </Field>
                        </div>
                      </div>
                    </SectionCard>
                  ))}
                  <AddButton onClick={()=>addField("projects")} label="Add Project"/>
                </div>
              )}

              {/* SKILLS */}
              {step === 4 && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-[10px] font-bold text-[#2E2218] uppercase tracking-widest mb-3">Skills</h3>
                    <input value={skillInput} onChange={e=>setSkillInput(e.target.value)}
                      onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); addItem("skills",skillInput,setSkillInput); }}}
                      placeholder="Type a skill and press Enter…" className={inputCls}/>
                    <p className="text-[10px] text-[#5A3F2A] mt-2.5 mb-2">Quick add:</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_SKILLS.filter(s=>!formData.skills.includes(s)).map(s=>(
                        <button key={s} onClick={()=>addItem("skills",s,()=>{})}
                          className="px-3 py-1 text-xs rounded-full border border-[#DDD5BE] text-[#5A3F2A] hover:bg-[#EDE7D9] hover:border-[#967A68] transition-all">
                          + {s}
                        </button>
                      ))}
                    </div>
                    {formData.skills.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#EDE7D9]">
                        {formData.skills.map((s,i)=>(
                          <span key={i} className="flex items-center gap-1.5 px-3 py-1 text-xs bg-[#EDE7D9] text-[#2E2218] rounded-full border border-[#DDD5BE]">
                            {s}
                            <button onClick={()=>removeItem("skills",i)} className="hover:text-[#C8A84B] transition-colors ml-0.5"><Trash2 size={10}/></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="h-px bg-[#EDE7D9]"/>
                  <div>
                    <h3 className="text-[10px] font-bold text-[#2E2218] uppercase tracking-widest mb-3">Hobbies & Interests</h3>
                    <input value={hobbyInput} onChange={e=>setHobbyInput(e.target.value)}
                      onKeyDown={e=>{ if(e.key==="Enter"){ e.preventDefault(); addItem("hobbies",hobbyInput,setHobbyInput); }}}
                      placeholder="Type a hobby and press Enter…" className={inputCls}/>
                    <p className="text-[10px] text-[#5A3F2A] mt-2.5 mb-2">Quick add:</p>
                    <div className="flex flex-wrap gap-2">
                      {SUGGESTED_HOBBIES.filter(h=>!formData.hobbies.includes(h)).map(h=>(
                        <button key={h} onClick={()=>addItem("hobbies",h,()=>{})}
                          className="px-3 py-1 text-xs rounded-full border border-[#DDD5BE] text-[#5A3F2A] hover:bg-[#EDE7D9] hover:border-[#967A68] transition-all">
                          + {h}
                        </button>
                      ))}
                    </div>
                    {formData.hobbies.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-[#EDE7D9]">
                        {formData.hobbies.map((h,i)=>(
                          <span key={i} className="flex items-center gap-1.5 px-3 py-1 text-xs bg-[#EDE7D9] text-[#2E2218] rounded-full border border-[#DDD5BE]">
                            {h}
                            <button onClick={()=>removeItem("hobbies",i)} className="hover:text-[#C8A84B] transition-colors ml-0.5"><Trash2 size={10}/></button>
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {/* NAV */}
          <div className="px-8 pb-8 flex justify-between items-center border-t border-[#EDE7D9] pt-6">
            <button onClick={()=>setStep(s=>s-1)} disabled={step===0}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-medium text-[#5A3F2A] border border-[#DDD5BE] hover:bg-[#EDE7D9] disabled:opacity-30 disabled:cursor-not-allowed transition-all">
              <ChevronLeft size={15}/> Back
            </button>
            {step < STEPS.length - 1 ? (
              <button onClick={()=>setStep(s=>s+1)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#2E2218] text-[#F5F0E8] hover:bg-[#C8A84B] hover:text-[#2E2218] transition-all">
                Continue <ChevronRight size={15}/>
              </button>
            ) : (
              <button onClick={() => downloadPDF(formData, template)}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold bg-[#C8A84B] text-[#2E2218] hover:bg-[#2E2218] hover:text-[#F5F0E8] transition-all">
                <CheckCircle2 size={15}/> Download PDF
              </button>
            )}
          </div>
        </div>

        {/* ── PREVIEW PANEL ── */}
        <div className="sticky top-[73px] space-y-3">
          <div className="relative">
            <div className="flex items-center justify-between">
              <p className="text-[10px] text-[#5A3F2A] uppercase tracking-widest">Live Preview</p>
              <TemplatePicker
                template={template}
                setTemplate={setTemplate}
                showTplPicker={showTplPicker}
                setShowTplPicker={setShowTplPicker}
              />
            </div>
          </div>

          <div id="resume-preview">
            <AnimatePresence mode="wait">
              <motion.div key={template}
                initial={{ opacity:0, scale:0.98 }}
                animate={{ opacity:1, scale:1 }}
                exit={{ opacity:0, scale:0.98 }}
                transition={{ duration:0.2 }}>
                {template === "modern"  && <TemplateModern  data={formData}/>}
                {template === "classic" && <TemplateClassic data={formData}/>}
                {template === "twocol"  && <TemplateTwoCol  data={formData}/>}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}