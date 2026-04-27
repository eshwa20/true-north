import { User, GraduationCap, Briefcase, FolderGit2, Sparkles } from "lucide-react";

export const STEPS = [
  { label: "Personal",   icon: User },
  { label: "Education",  icon: GraduationCap },
  { label: "Experience", icon: Briefcase },
  { label: "Projects",   icon: FolderGit2 },
  { label: "Skills",     icon: Sparkles },
];

export const DEGREE_OPTIONS = [
  "SSC","HSC","B.Tech","B.E","BSc","BCA","BBA","BA","B.Com",
  "M.Tech","MSc","MCA","MBA","MA","M.Com","Diploma","PhD","Other",
];

export const SUGGESTED_SKILLS  = ["Teamwork","Communication","Leadership","Problem Solving","React","JavaScript","Node.js","UI/UX","Git","Python","SQL"];
export const SUGGESTED_HOBBIES = ["Reading","Traveling","Gaming","Photography","Music","Sports","Fitness"];

export const inputCls =
  "w-full px-4 py-2.5 text-sm bg-[#F5F0E8] border border-[#DDD5BE] rounded-[14px] " +
  "text-[#1A120B] placeholder-[#8A7A6A] focus:outline-none focus:border-[#C8A84B] " +
  "focus:bg-[#FDFCF8] transition-all";

export const TEMPLATES = [
  {
    id: "modern",
    label: "Modern",
    desc: "Gold accents, serif body",
    preview: (
      <svg viewBox="0 0 80 100" className="w-full h-full">
        <rect width="80" height="4" fill="#C8A84B"/>
        <rect x="6" y="10" width="30" height="3" rx="1" fill="#2E2218"/>
        <rect x="6" y="16" width="50" height="1.5" rx="0.5" fill="#DDD5BE"/>
        <rect x="6" y="26" width="16" height="1.5" rx="0.5" fill="#C8A84B"/>
        <rect x="24" y="27.2" width="44" height="0.5" fill="#EDE7D9"/>
        <rect x="6" y="30" width="40" height="1.5" rx="0.5" fill="#EDE7D9"/>
        <rect x="6" y="34" width="30" height="1.5" rx="0.5" fill="#EDE7D9"/>
        <rect x="6" y="44" width="22" height="1.5" rx="0.5" fill="#C8A84B"/>
        <rect x="30" y="45.2" width="38" height="0.5" fill="#EDE7D9"/>
        <rect x="6" y="48" width="36" height="1.5" rx="0.5" fill="#EDE7D9"/>
        <rect x="6" y="52" width="50" height="1.5" rx="0.5" fill="#EDE7D9"/>
      </svg>
    ),
  },
  {
    id: "classic",
    label: "Classic",
    desc: "Clean, ATS-friendly",
    preview: (
      <svg viewBox="0 0 80 100" className="w-full h-full">
        <rect x="6" y="8" width="40" height="4" rx="0.5" fill="#1a1a1a"/>
        <rect x="6" y="15" width="60" height="0.8" fill="#1a1a1a"/>
        <rect x="6" y="18" width="55" height="1.2" rx="0.3" fill="#888"/>
        <rect x="6" y="28" width="20" height="1.5" rx="0.3" fill="#1a1a1a"/>
        <rect x="6" y="31" width="60" height="0.6" fill="#ccc"/>
        <rect x="6" y="34" width="44" height="1.2" rx="0.3" fill="#888"/>
        <rect x="6" y="38" width="38" height="1.2" rx="0.3" fill="#888"/>
        <rect x="6" y="48" width="26" height="1.5" rx="0.3" fill="#1a1a1a"/>
        <rect x="6" y="51" width="60" height="0.6" fill="#ccc"/>
        <rect x="6" y="54" width="50" height="1.2" rx="0.3" fill="#888"/>
        <rect x="6" y="58" width="44" height="1.2" rx="0.3" fill="#888"/>
      </svg>
    ),
  },
  {
    id: "twocol",
    label: "Two-Column",
    desc: "Sidebar layout",
    preview: (
      <svg viewBox="0 0 80 100" className="w-full h-full">
        <rect width="80" height="16" fill="#2E2218"/>
        <rect x="5" y="4" width="28" height="3" rx="0.5" fill="#F5F0E8"/>
        <rect x="5" y="9" width="40" height="1.5" rx="0.5" fill="#967A68"/>
        <rect width="26" y="16" height="84" fill="#F5F0E8"/>
        <rect x="3" y="22" width="12" height="1.5" rx="0.5" fill="#C8A84B"/>
        <rect x="3" y="26" width="18" height="1" rx="0.5" fill="#DDD5BE"/>
        <rect x="3" y="29" width="16" height="1" rx="0.5" fill="#DDD5BE"/>
        <rect x="3" y="32" width="14" height="1" rx="0.5" fill="#DDD5BE"/>
        <rect x="3" y="42" width="12" height="1.5" rx="0.5" fill="#C8A84B"/>
        <rect x="3" y="46" width="18" height="1" rx="0.5" fill="#DDD5BE"/>
        <rect x="3" y="49" width="16" height="1" rx="0.5" fill="#DDD5BE"/>
        <rect x="30" y="22" width="22" height="1.5" rx="0.5" fill="#2E2218"/>
        <rect x="30" y="25" width="44" height="0.5" fill="#DDD5BE"/>
        <rect x="30" y="28" width="40" height="1" rx="0.5" fill="#967A68"/>
        <rect x="30" y="31" width="36" height="1" rx="0.5" fill="#967A68"/>
        <rect x="30" y="40" width="22" height="1.5" rx="0.5" fill="#2E2218"/>
        <rect x="30" y="43" width="44" height="0.5" fill="#DDD5BE"/>
        <rect x="30" y="46" width="38" height="1" rx="0.5" fill="#967A68"/>
        <rect x="30" y="49" width="32" height="1" rx="0.5" fill="#967A68"/>
      </svg>
    ),
  },
];