import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

// ── INTEREST TEST DATA ───────────────────────────────────────
const INTEREST_CARDS = [
  { id: 1,  label: 'Building apps & websites',     icon: '💻', domain: 'Technology' },
  { id: 2,  label: 'Designing visuals & UI',        icon: '🎨', domain: 'Design' },
  { id: 3,  label: 'Analyzing data & patterns',     icon: '📊', domain: 'Data' },
  { id: 4,  label: 'Writing stories & content',     icon: '✍️', domain: 'Writing' },
  { id: 5,  label: 'Teaching & mentoring others',   icon: '🎓', domain: 'Education' },
  { id: 6,  label: 'Leading teams & projects',      icon: '🚀', domain: 'Leadership' },
  { id: 7,  label: 'Creating music & audio',        icon: '🎵', domain: 'Music' },
  { id: 8,  label: 'Solving complex problems',      icon: '🧩', domain: 'Engineering' },
  { id: 9,  label: 'Marketing & brand building',    icon: '📣', domain: 'Marketing' },
  { id: 10, label: 'Research & discovery',          icon: '🔬', domain: 'Science' },
  { id: 11, label: 'Helping & supporting people',   icon: '🤝', domain: 'Social' },
  { id: 12, label: 'Photography & filmmaking',      icon: '🎬', domain: 'Film' },
  { id: 13, label: 'Building & making things',      icon: '🔧', domain: 'Engineering' },
  { id: 14, label: 'Finance & investment',          icon: '💰', domain: 'Finance' },
  { id: 15, label: 'Gaming & interactive media',    icon: '🎮', domain: 'GameDesign' },
];

// ── PERSONALITY TEST DATA ────────────────────────────────────
const PERSONALITY_QUESTIONS = [
  {
    id: 1,
    question: 'When working on a project, you prefer to:',
    trait: 'teamwork',
    options: [
      { label: 'Work alone with full control',    value: 'solo',    icon: '🧍' },
      { label: 'Collaborate with a team',         value: 'team',    icon: '👥' },
      { label: 'Lead and delegate tasks',         value: 'lead',    icon: '🎯' },
      { label: 'Support and assist others',       value: 'support', icon: '🤲' },
    ],
  },
  {
    id: 2,
    question: 'When facing a difficult decision, you tend to:',
    trait: 'risk',
    options: [
      { label: 'Take risks for bigger rewards',   value: 'risk',      icon: '🎲' },
      { label: 'Play it safe and steady',         value: 'safe',      icon: '🛡️' },
      { label: 'Analyze all options carefully',   value: 'analyze',   icon: '🔍' },
      { label: 'Trust your gut feeling',          value: 'intuition', icon: '💡' },
    ],
  },
  {
    id: 3,
    question: 'You feel most energized when you are:',
    trait: 'energy',
    options: [
      { label: 'Around people and socializing',   value: 'extrovert', icon: '🎉' },
      { label: 'Alone with your thoughts',        value: 'introvert', icon: '📚' },
      { label: 'Creating something from scratch', value: 'creative',  icon: '🎨' },
      { label: 'Fixing problems and challenges',  value: 'problem',   icon: '⚙️' },
    ],
  },
  {
    id: 4,
    question: 'Your ideal work environment is:',
    trait: 'environment',
    options: [
      { label: 'Fast-paced startup culture',      value: 'startup',   icon: '⚡' },
      { label: 'Structured corporate setting',    value: 'corporate', icon: '🏢' },
      { label: 'Remote & flexible schedule',      value: 'remote',    icon: '🏠' },
      { label: 'Outdoors or field-based work',    value: 'outdoor',   icon: '🌿' },
    ],
  },
  {
    id: 5,
    question: 'When learning something new, you prefer:',
    trait: 'learning',
    options: [
      { label: 'Hands-on experimentation',        value: 'hands_on',   icon: '🛠️' },
      { label: 'Reading & research',              value: 'reading',    icon: '📖' },
      { label: 'Watching and observing',          value: 'visual',     icon: '👀' },
      { label: 'Learning from a mentor',          value: 'mentorship', icon: '🎓' },
    ],
  },
  {
    id: 6,
    question: 'Your biggest strength is:',
    trait: 'strength',
    options: [
      { label: 'Analytical & logical thinking',   value: 'analytical',    icon: '🧠' },
      { label: 'Creativity & imagination',        value: 'creative',      icon: '✨' },
      { label: 'Communication & persuasion',      value: 'communication', icon: '🗣️' },
      { label: 'Empathy & understanding others',  value: 'empathy',       icon: '❤️' },
    ],
  },
];

// ── CAREER POOL ──────────────────────────────────────────────
const CAREER_POOL = [
  { title: 'Software Engineer',           domains: ['Technology', 'Engineering'],                   strength: ['analytical'] },
  { title: 'Frontend Developer',          domains: ['Technology', 'Design'],                        strength: ['creative', 'analytical'] },
  { title: 'Backend Developer',           domains: ['Technology', 'Engineering'],                   strength: ['analytical'] },
  { title: 'Full-Stack Developer',        domains: ['Technology', 'Engineering'],                   strength: ['analytical'] },
  { title: 'Mobile App Developer',        domains: ['Technology', 'Engineering'],                   strength: ['analytical', 'creative'] },
  { title: 'DevOps Engineer',             domains: ['Technology', 'Engineering'],                   strength: ['analytical'] },
  { title: 'Cloud Architect',             domains: ['Technology', 'Engineering'],                   strength: ['analytical'] },
  { title: 'Cybersecurity Analyst',       domains: ['Technology', 'Engineering'],                   strength: ['analytical'] },
  { title: 'Blockchain Developer',        domains: ['Technology', 'Engineering', 'Finance'],        strength: ['analytical'] },
  { title: 'Embedded Systems Engineer',   domains: ['Technology', 'Engineering'],                   strength: ['analytical'] },
  { title: 'QA Engineer',                 domains: ['Technology', 'Engineering'],                   strength: ['analytical'] },
  { title: 'Product Manager',             domains: ['Technology', 'Leadership'],                    strength: ['communication'] },
  { title: 'Technical Program Manager',   domains: ['Technology', 'Leadership'],                    strength: ['communication', 'analytical'] },
  { title: 'Solutions Architect',         domains: ['Technology', 'Engineering', 'Leadership'],     strength: ['analytical', 'communication'] },
  { title: 'Data Scientist',              domains: ['Data', 'Technology', 'Science'],               strength: ['analytical'] },
  { title: 'Data Analyst',                domains: ['Data', 'Technology'],                          strength: ['analytical'] },
  { title: 'Data Engineer',               domains: ['Data', 'Technology', 'Engineering'],           strength: ['analytical'] },
  { title: 'ML Engineer',                 domains: ['Data', 'Technology'],                          strength: ['analytical'] },
  { title: 'AI Research Scientist',       domains: ['Data', 'Science', 'Technology'],               strength: ['analytical'] },
  { title: 'Business Intelligence Analyst', domains: ['Data', 'Finance', 'Leadership'],             strength: ['analytical'] },
  { title: 'Quantitative Analyst',        domains: ['Data', 'Finance', 'Science'],                  strength: ['analytical'] },
  { title: 'UI/UX Designer',              domains: ['Design', 'Technology'],                        strength: ['creative'] },
  { title: 'Graphic Designer',            domains: ['Design'],                                      strength: ['creative'] },
  { title: 'Brand Identity Designer',     domains: ['Design', 'Marketing'],                         strength: ['creative'] },
  { title: 'Product Designer',            domains: ['Design', 'Technology'],                        strength: ['creative'] },
  { title: 'Motion Graphics Designer',    domains: ['Design', 'Film', 'Technology'],                strength: ['creative'] },
  { title: 'Illustrator',                 domains: ['Design', 'Film'],                              strength: ['creative'] },
  { title: 'Art Director',                domains: ['Design', 'Film', 'Marketing'],                 strength: ['creative'] },
  { title: 'Creative Director',           domains: ['Design', 'Film', 'Music', 'Marketing'],        strength: ['creative'] },
  { title: 'Interior Designer',           domains: ['Design'],                                      strength: ['creative'] },
  { title: 'Fashion Designer',            domains: ['Design'],                                      strength: ['creative'] },
  { title: 'Industrial Designer',         domains: ['Design', 'Engineering'],                       strength: ['creative', 'analytical'] },
  { title: '3D Artist / Modeler',         domains: ['Design', 'Film', 'GameDesign'],                strength: ['creative'] },
  { title: 'Character Designer',          domains: ['Design', 'GameDesign', 'Film'],                strength: ['creative'] },
  { title: 'Visual Effects Artist',       domains: ['Design', 'Film', 'Technology'],                strength: ['creative'] },
  { title: 'Filmmaker / Director',        domains: ['Film', 'Design'],                              strength: ['creative'] },
  { title: 'Screenwriter',                domains: ['Film', 'Writing'],                             strength: ['creative'] },
  { title: 'Video Editor',                domains: ['Film', 'Technology'],                          strength: ['creative'] },
  { title: 'Cinematographer',             domains: ['Film', 'Design'],                              strength: ['creative'] },
  { title: 'Documentary Filmmaker',       domains: ['Film', 'Writing', 'Social'],                   strength: ['creative', 'communication'] },
  { title: 'Storyboard Artist',           domains: ['Film', 'Design'],                              strength: ['creative'] },
  { title: 'Production Designer',         domains: ['Film', 'Design'],                              strength: ['creative'] },
  { title: 'Film Producer',               domains: ['Film', 'Leadership'],                          strength: ['communication'] },
  { title: 'Casting Director',            domains: ['Film', 'Social'],                              strength: ['communication', 'empathy'] },
  { title: 'Photographer',                domains: ['Film', 'Design'],                              strength: ['creative'] },
  { title: 'Photo Editor / Retoucher',    domains: ['Film', 'Design', 'Technology'],                strength: ['creative'] },
  { title: 'YouTube Content Creator',     domains: ['Film', 'Writing', 'Marketing'],                strength: ['creative', 'communication'] },
  { title: 'Podcast Producer',            domains: ['Film', 'Music', 'Writing'],                    strength: ['creative', 'communication'] },
  { title: 'Music Producer',              domains: ['Music', 'Technology'],                         strength: ['creative'] },
  { title: 'Recording Artist / Singer',   domains: ['Music'],                                       strength: ['creative', 'communication'] },
  { title: 'Audio Engineer',              domains: ['Music', 'Technology', 'Engineering'],          strength: ['analytical', 'creative'] },
  { title: 'Music Composer',              domains: ['Music', 'Film'],                               strength: ['creative'] },
  { title: 'Film Score Composer',         domains: ['Music', 'Film'],                               strength: ['creative'] },
  { title: 'Sound Designer',              domains: ['Music', 'Film', 'GameDesign'],                 strength: ['creative'] },
  { title: 'Music Therapist',             domains: ['Music', 'Social', 'Education'],                strength: ['empathy'] },
  { title: 'Artist Manager',              domains: ['Music', 'Leadership', 'Marketing'],            strength: ['communication'] },
  { title: 'Music Marketing Manager',     domains: ['Music', 'Marketing'],                          strength: ['communication'] },
  { title: 'DJ / Live Performer',         domains: ['Music'],                                       strength: ['creative'] },
  { title: 'Music Teacher / Educator',    domains: ['Music', 'Education'],                          strength: ['empathy', 'communication'] },
  { title: 'Music Video Director',        domains: ['Music', 'Film'],                               strength: ['creative'] },
  { title: 'Lyricist / Songwriter',       domains: ['Music', 'Writing'],                            strength: ['creative'] },
  { title: 'A&R Manager',                 domains: ['Music', 'Leadership'],                         strength: ['communication'] },
  { title: 'Music Journalist / Critic',   domains: ['Music', 'Writing'],                            strength: ['communication', 'creative'] },
  { title: 'Concert / Tour Manager',      domains: ['Music', 'Leadership'],                         strength: ['communication'] },
  { title: 'Music Licensing Manager',     domains: ['Music', 'Finance', 'Leadership'],              strength: ['analytical', 'communication'] },
  { title: 'Foley Artist',                domains: ['Music', 'Film'],                               strength: ['creative'] },
  { title: 'Author / Novelist',           domains: ['Writing'],                                     strength: ['creative'] },
  { title: 'Journalist / Reporter',       domains: ['Writing', 'Social'],                           strength: ['communication'] },
  { title: 'Content Strategist',          domains: ['Writing', 'Marketing'],                        strength: ['communication', 'creative'] },
  { title: 'Copywriter',                  domains: ['Writing', 'Marketing'],                        strength: ['creative', 'communication'] },
  { title: 'Technical Writer',            domains: ['Writing', 'Technology'],                       strength: ['communication', 'analytical'] },
  { title: 'Editor / Proofreader',        domains: ['Writing'],                                     strength: ['analytical', 'communication'] },
  { title: 'Speechwriter',                domains: ['Writing', 'Leadership'],                       strength: ['communication', 'creative'] },
  { title: 'Grant Writer',                domains: ['Writing', 'Social'],                           strength: ['communication'] },
  { title: 'UX Writer',                   domains: ['Writing', 'Design', 'Technology'],             strength: ['communication', 'creative'] },
  { title: 'Blogger / Newsletter Writer', domains: ['Writing', 'Marketing'],                        strength: ['creative', 'communication'] },
  { title: 'Poet / Creative Writer',      domains: ['Writing'],                                     strength: ['creative'] },
  { title: 'Script / Dialogue Writer',    domains: ['Writing', 'Film'],                             strength: ['creative'] },
  { title: 'Social Media Writer',         domains: ['Writing', 'Marketing'],                        strength: ['communication', 'creative'] },
  { title: 'Academic / Research Writer',  domains: ['Writing', 'Science'],                          strength: ['analytical', 'communication'] },
  { title: 'SEO Content Writer',          domains: ['Writing', 'Marketing', 'Technology'],          strength: ['analytical', 'communication'] },
  { title: 'Literary Agent',              domains: ['Writing', 'Leadership'],                       strength: ['communication'] },
  { title: 'Book Editor / Publisher',     domains: ['Writing', 'Leadership'],                       strength: ['communication', 'analytical'] },
  { title: 'Translator / Interpreter',    domains: ['Writing', 'Social'],                           strength: ['communication'] },
  { title: 'Subtitler / Localizer',       domains: ['Writing', 'Film', 'Technology'],               strength: ['communication'] },
  { title: 'Marketing Manager',           domains: ['Marketing', 'Leadership'],                     strength: ['communication'] },
  { title: 'Digital Marketing Specialist',domains: ['Marketing', 'Technology'],                     strength: ['analytical', 'communication'] },
  { title: 'SEO / SEM Specialist',        domains: ['Marketing', 'Technology', 'Data'],             strength: ['analytical'] },
  { title: 'Social Media Manager',        domains: ['Marketing', 'Writing'],                        strength: ['communication', 'creative'] },
  { title: 'PR Specialist',               domains: ['Marketing', 'Writing', 'Leadership'],          strength: ['communication'] },
  { title: 'Brand Strategist',            domains: ['Marketing', 'Design'],                         strength: ['creative', 'communication'] },
  { title: 'Performance Marketer',        domains: ['Marketing', 'Data'],                           strength: ['analytical'] },
  { title: 'Influencer / Content Creator',domains: ['Marketing', 'Film', 'Writing'],               strength: ['creative', 'communication'] },
  { title: 'Email Marketing Specialist',  domains: ['Marketing', 'Writing'],                        strength: ['communication', 'analytical'] },
  { title: 'Market Research Analyst',     domains: ['Marketing', 'Data'],                           strength: ['analytical'] },
  { title: 'Event Manager',               domains: ['Marketing', 'Leadership'],                     strength: ['communication'] },
  { title: 'Financial Analyst',           domains: ['Finance', 'Data'],                             strength: ['analytical'] },
  { title: 'Investment Banker',           domains: ['Finance', 'Data', 'Leadership'],               strength: ['analytical'] },
  { title: 'Portfolio Manager',           domains: ['Finance', 'Data'],                             strength: ['analytical'] },
  { title: 'Venture Capitalist',          domains: ['Finance', 'Leadership'],                       strength: ['analytical', 'communication'] },
  { title: 'Accountant / CPA',            domains: ['Finance'],                                     strength: ['analytical'] },
  { title: 'Actuary',                     domains: ['Finance', 'Data', 'Science'],                  strength: ['analytical'] },
  { title: 'Management Consultant',       domains: ['Leadership', 'Data'],                          strength: ['analytical', 'communication'] },
  { title: 'Entrepreneur / Founder',      domains: ['Leadership', 'Marketing'],                     strength: ['communication'] },
  { title: 'Operations Manager',          domains: ['Leadership', 'Engineering'],                   strength: ['analytical', 'communication'] },
  { title: 'Human Resources Manager',     domains: ['Leadership', 'Social'],                        strength: ['empathy', 'communication'] },
  { title: 'Supply Chain Manager',        domains: ['Leadership', 'Engineering', 'Data'],           strength: ['analytical'] },
  { title: 'Teacher / Educator',          domains: ['Education', 'Social'],                         strength: ['empathy', 'communication'] },
  { title: 'School Counselor',            domains: ['Education', 'Social'],                         strength: ['empathy'] },
  { title: 'Curriculum Designer',         domains: ['Education', 'Writing'],                        strength: ['creative', 'communication'] },
  { title: 'E-Learning Developer',        domains: ['Education', 'Technology'],                     strength: ['creative', 'analytical'] },
  { title: 'Corporate Trainer',           domains: ['Education', 'Leadership'],                     strength: ['communication', 'empathy'] },
  { title: 'Social Worker',               domains: ['Social', 'Education'],                         strength: ['empathy'] },
  { title: 'Community Manager',           domains: ['Social', 'Marketing'],                         strength: ['empathy', 'communication'] },
  { title: 'Non-Profit Program Director', domains: ['Social', 'Leadership'],                        strength: ['empathy', 'communication'] },
  { title: 'Life Coach',                  domains: ['Social', 'Education'],                         strength: ['empathy', 'communication'] },
  { title: 'Research Scientist',          domains: ['Science', 'Data'],                             strength: ['analytical'] },
  { title: 'Biomedical Engineer',         domains: ['Science', 'Engineering'],                      strength: ['analytical'] },
  { title: 'Environmental Scientist',     domains: ['Science', 'Social'],                           strength: ['analytical'] },
  { title: 'Psychologist / Counselor',    domains: ['Social', 'Science'],                           strength: ['empathy'] },
  { title: 'Civil Engineer',              domains: ['Engineering'],                                  strength: ['analytical'] },
  { title: 'Mechanical Engineer',         domains: ['Engineering'],                                  strength: ['analytical'] },
  { title: 'Robotics Engineer',           domains: ['Engineering', 'Technology'],                   strength: ['analytical'] },
  { title: 'Aerospace Engineer',          domains: ['Engineering', 'Science'],                      strength: ['analytical'] },
  { title: 'Game Developer',              domains: ['GameDesign', 'Technology'],                    strength: ['creative', 'analytical'] },
  { title: 'Game Designer',               domains: ['GameDesign', 'Design'],                        strength: ['creative'] },
  { title: 'Narrative Designer',          domains: ['GameDesign', 'Writing'],                       strength: ['creative'] },
  { title: 'Level Designer',              domains: ['GameDesign', 'Design'],                        strength: ['creative', 'analytical'] },
  { title: 'Game Artist',                 domains: ['GameDesign', 'Design'],                        strength: ['creative'] },
  { title: 'Esports Manager',             domains: ['GameDesign', 'Leadership'],                    strength: ['communication'] },
  { title: 'Game Tester / QA',            domains: ['GameDesign', 'Technology'],                    strength: ['analytical'] },
  { title: 'VR/AR Developer',             domains: ['GameDesign', 'Technology', 'Design'],          strength: ['creative', 'analytical'] },
];

// ── CAREER MAPPING ───────────────────────────────────────────
function getCareerRecommendations(likedDomains, personalityAnswers) {
  const domainCount = {};
  likedDomains.forEach(d => { domainCount[d] = (domainCount[d] || 0) + 1; });

  const strength = personalityAnswers.strength || 'analytical';
  const teamwork = personalityAnswers.teamwork  || 'solo';
  const risk     = personalityAnswers.risk      || 'analyze';

  const scored = CAREER_POOL.map(career => {
    let score = 0;
    let domainHits = 0;
    career.domains.forEach(d => {
      if (domainCount[d]) { score += domainCount[d] * 20; domainHits++; }
    });
    if (domainHits === 0) return { ...career, match: 0 };
    if (career.strength.includes(strength)) score += 25;
    if (teamwork === 'lead' && career.domains.includes('Leadership')) score += 10;
    if (risk === 'risk' && career.title === 'Entrepreneur') score += 15;
    return { ...career, match: Math.min(score, 99) };
  });

  return scored
    .filter(c => c.match > 0)
    .sort((a, b) => b.match - a.match)
    .slice(0, 6)
    .map(c => ({
      ...c,
      match: c.match < 50 ? 50 + Math.floor(Math.random() * 20) : c.match,
    }));
}

// ── GEMINI APTITUDE GENERATOR ────────────────────────────────
async function generateAptitudeQuestions(career, interests, personality) {
  const res = await fetch('/api/generate-aptitude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ career, interests, personality }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.detail || `Server error ${res.status}`);
  }
  const data = await res.json();
  if (!data.questions || !Array.isArray(data.questions) || data.questions.length === 0) {
    throw new Error('No questions returned from server.');
  }
  return data.questions;
}

// ── STEP INDICATOR ───────────────────────────────────────────
function StepIndicator({ currentStep, totalSteps, labels }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-10">
      {labels.map((label, i) => (
        <div key={i} className="flex items-center gap-2 relative">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-all duration-300
              ${i < currentStep
                ? 'bg-[#5A7A52] text-white border-[#5A7A52]'
                : i === currentStep
                  ? 'bg-[#C8A84B] text-white border-[#A6882C] shadow-[0_0_0_4px_rgba(200,168,75,0.2)]'
                  : 'bg-[#EDE7D9] text-[#967A68] border-[#DDD5BE]'}`}
          >
            {i < currentStep ? <i className="fas fa-check" /> : i + 1}
          </div>
          <span
            className={`text-xs font-semibold
              ${i < currentStep ? 'text-[#5A7A52]' : i === currentStep ? 'text-[#A6882C]' : 'text-[#967A68]'}`}
          >
            {label}
          </span>
          {i < totalSteps - 1 && (
            <div className="w-[60px] h-0.5 bg-[#DDD5BE] mx-2" />
          )}
        </div>
      ))}
    </div>
  );
}

// ── INTEREST SWIPE CARD ──────────────────────────────────────
function InterestCard({ card, onLike, onDislike }) {
  const [dragging, setDragging] = useState(false);
  const [offset, setOffset]     = useState(0);
  const startX = useRef(null);

  const handleMouseDown = (e) => { startX.current = e.clientX; setDragging(true); };
  const handleMouseMove = (e) => { if (dragging) setOffset(e.clientX - startX.current); };
  const handleMouseUp   = () => {
    if (offset > 80) onLike();
    else if (offset < -80) onDislike();
    setOffset(0); setDragging(false);
  };

  const rotation = offset * 0.08;
  const likeOpacity    = Math.min(offset / 80, 1);
  const dislikeOpacity = Math.min(-offset / 80, 1);

  return (
    <div
      className="absolute w-[300px] bg-[#FDFCF8] border border-[#DDD5BE] rounded-[44px] p-10 shadow-[0_24px_64px_rgba(46,34,24,0.14)] flex flex-col items-center gap-3 cursor-grab active:cursor-grabbing select-none z-10"
      style={{ transform: `translateX(${offset}px) rotate(${rotation}deg)` }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div
        className="absolute top-6 right-6 text-xs font-bold px-3 py-1.5 rounded-full bg-[rgba(90,122,82,0.15)] text-[#5A7A52] border-2 border-[#5A7A52] pointer-events-none"
        style={{ opacity: likeOpacity }}
      >
        ❤️ Like
      </div>
      <div
        className="absolute top-6 left-6 text-xs font-bold px-3 py-1.5 rounded-full bg-[rgba(192,57,43,0.1)] text-[#C0392B] border-2 border-[#C0392B] pointer-events-none"
        style={{ opacity: dislikeOpacity }}
      >
        👎 Skip
      </div>
      <div className="text-6xl leading-none">{card.icon}</div>
      <div className="text-lg font-semibold text-[#2E2218] text-center">{card.label}</div>
      <div className="text-xs font-semibold uppercase tracking-[0.1em] text-[#A6882C] bg-[rgba(200,168,75,0.1)] border border-[rgba(200,168,75,0.25)] px-3 py-1 rounded-full">
        {card.domain}
      </div>
    </div>
  );
}

// ── APTITUDE TIMER ───────────────────────────────────────────
function AptitudeTimer({ seconds, onExpire }) {
  const [left, setLeft] = useState(seconds);
  useEffect(() => {
    setLeft(seconds);
    const t = setInterval(() => {
      setLeft(p => {
        if (p <= 1) { clearInterval(t); onExpire(); return 0; }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [seconds]);

  const pct   = (left / seconds) * 100;
  const color = pct > 50 ? '#5A7A52' : pct > 25 ? '#C8A84B' : '#C0392B';

  return (
    <div className="relative w-11 h-11 flex-shrink-0">
      <svg viewBox="0 0 44 44" className="w-11 h-11">
        <circle cx="22" cy="22" r="18" fill="none" stroke="#DDD5BE" strokeWidth="3" />
        <circle
          cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 18}`}
          strokeDashoffset={`${2 * Math.PI * 18 * (1 - pct / 100)}`}
          transform="rotate(-90 22 22)"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center text-[0.72rem] font-bold"
        style={{ color }}
      >
        {left}s
      </span>
    </div>
  );
}

// ── MAIN ASSESSMENT COMPONENT ────────────────────────────────
export default function Assessment() {
  const navigate = useNavigate();

  const [phase, setPhase]       = useState('interest');
  const [progress, setProgress] = useState(0);

  const [cardIndex, setCardIndex] = useState(0);
  const [liked, setLiked]         = useState([]);
  const [disliked, setDisliked]   = useState([]);

  const [pqIndex, setPqIndex]                       = useState(0);
  const [personalityAnswers, setPersonalityAnswers] = useState({});

  const [careers, setCareers]               = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);

  const [aptQuestions, setAptQuestions]     = useState([]);
  const [aptIndex, setAptIndex]             = useState(0);
  const [aptAnswers, setAptAnswers]         = useState([]);
  const [aptScore, setAptScore]             = useState(0);
  const [aptLoading, setAptLoading]         = useState(false);
  const [aptError, setAptError]             = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered]             = useState(false);

  const [results, setResults] = useState(null);

  const handleLike = () => {
    setLiked(p => [...p, INTEREST_CARDS[cardIndex]]);
    nextCard();
  };
  const handleDislike = () => {
    setDisliked(p => [...p, INTEREST_CARDS[cardIndex]]);
    nextCard();
  };
  const nextCard = () => {
    if (cardIndex >= INTEREST_CARDS.length - 1) { setProgress(33); setPhase('personality'); }
    else setCardIndex(p => p + 1);
  };

  const handlePersonalityAnswer = (trait, value) => {
    const updated = { ...personalityAnswers, [trait]: value };
    setPersonalityAnswers(updated);
    if (pqIndex >= PERSONALITY_QUESTIONS.length - 1) {
      const recs = getCareerRecommendations(liked.map(c => c.domain), updated);
      setCareers(recs); setProgress(66); setPhase('career');
    } else {
      setPqIndex(p => p + 1);
    }
  };

  const handleCareerSelect = async (career) => {
    setSelectedCareer(career); setAptLoading(true); setAptError(''); setPhase('loading');
    try {
      const questions = await generateAptitudeQuestions(career.title, liked.map(c => c.label), personalityAnswers);
      setAptQuestions(questions); setProgress(80); setPhase('aptitude');
    } catch (e) {
      console.error('Question generation error:', e);
      setAptError(`Failed to generate questions: ${e.message}. Please try again.`);
      setPhase('career');
    } finally {
      setAptLoading(false);
    }
  };

  const handleOptionSelect = (idx) => {
    if (answered) return;
    setSelectedOption(idx); setAnswered(true);
    const q = aptQuestions[aptIndex];
    if (idx === q.correct) setAptScore(p => p + q.points);
  };

  const handleNextQuestion = () => {
    setAptAnswers(p => [...p, { qid: aptIndex, selected: selectedOption }]);
    setSelectedOption(null); setAnswered(false);
    if (aptIndex >= aptQuestions.length - 1) finishAptitude();
    else setAptIndex(p => p + 1);
  };

  const handleTimerExpire = () => {
    if (!answered) { setAnswered(true); setSelectedOption(null); setTimeout(handleNextQuestion, 800); }
  };

  const finishAptitude = () => {
    const totalPoints = aptQuestions.reduce((s, q) => s + q.points, 0);
    const pct = Math.round((aptScore / totalPoints) * 100);
    setResults({
      career: selectedCareer, aptScore, aptTotal: totalPoints, aptPct: pct,
      topCareers: careers.slice(0, 3), interests: liked.slice(0, 5), personality: personalityAnswers,
    });
    setProgress(100); setPhase('results');
  };

  const bestMatchIndex = careers.length
    ? careers.reduce((bestIdx, c, i) => (c.match > careers[bestIdx].match ? i : bestIdx), 0)
    : 0;

  // ── SHARED CLASSES ───────────────────────────────────────────
  const sectionCls  = "animate-[assessFadeUp_0.5s_cubic-bezier(0.22,1,0.36,1)_both]";
  const tagCls      = "inline-flex items-center gap-1.5 text-[0.68rem] font-semibold tracking-[0.12em] uppercase text-[#A6882C] bg-[rgba(200,168,75,0.1)] border border-[rgba(200,168,75,0.28)] px-3.5 py-1.5 rounded-full mb-3.5";
  const h1Cls       = "font-['Playfair_Display',Georgia,serif] text-[clamp(2rem,4vw,3rem)] font-extrabold text-[#2E2218] tracking-[-0.025em] leading-[1.1] mb-2.5";
  const subCls      = "text-[0.95rem] text-[#6B5645] leading-relaxed";

  // Inline keyframes injected once
  const styleTag = `
    @keyframes assessFadeUp {
      from { opacity: 0; transform: translateY(24px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes spin { to { transform: rotate(360deg); } }
    @keyframes bounce {
      0%   { transform: scale(0); }
      70%  { transform: scale(1.2); }
      100% { transform: scale(1); }
    }
    @keyframes loadStep {
      from { opacity: 0; transform: translateX(-12px); }
      to   { opacity: 1; transform: translateX(0); }
    }
  `;

  return (
    <div className="font-['Outfit',system-ui,sans-serif] bg-[#FDFCF8] text-[#3C2E22] min-h-screen [-webkit-font-smoothing:antialiased] overflow-x-hidden relative">
      <style>{styleTag}</style>

      {/* Orbs */}
      <div className="fixed w-[600px] h-[600px] -top-[150px] -right-[150px] rounded-full pointer-events-none z-0 bg-[radial-gradient(circle,rgba(200,168,75,0.07)_0%,transparent_65%)]" />
      <div className="fixed w-[500px] h-[500px] -bottom-[150px] -left-[100px] rounded-full pointer-events-none z-0 bg-[radial-gradient(circle,rgba(181,164,143,0.08)_0%,transparent_65%)]" />

      {/* Header */}
      <header className="sticky top-0 z-[100] bg-[rgba(253,252,248,0.9)] backdrop-blur-[20px] border-b border-[#DDD5BE] shadow-[0_1px_16px_rgba(46,34,24,0.05)]">
        <div className="max-w-[900px] mx-auto px-8 flex items-center justify-between h-16">
          <div className="flex items-center gap-2.5">
            <div className="w-[34px] h-[34px] bg-gradient-to-br from-[#C8A84B] to-[#A6882C] rounded-[10px] flex items-center justify-center text-white text-[0.9rem] shadow-[0_8px_32px_rgba(200,168,75,0.3)]">
              <i className="fas fa-compass" />
            </div>
            <span className="font-['Playfair_Display',Georgia,serif] text-[1.35rem] font-bold text-[#2E2218] tracking-[-0.02em]">
              TrueNorth
            </span>
          </div>
          {phase !== 'results' && (
            <div className="flex items-center gap-3">
              <div className="w-[180px] h-1.5 bg-[#EDE7D9] rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C8A84B] to-[#E2C578] rounded-full transition-[width_0.6s_cubic-bezier(0.22,1,0.36,1)]"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[0.78rem] text-[#967A68] font-semibold">{progress}% complete</span>
            </div>
          )}
        </div>
      </header>

      {/* Main */}
      <main className="max-w-[900px] mx-auto px-8 pt-10 pb-16 relative z-[1]">

        {/* ── INTEREST ── */}
        {phase === 'interest' && (
          <div className={sectionCls}>
            <StepIndicator currentStep={0} totalSteps={3} labels={['Interests', 'Personality', 'Aptitude']} />
            <div className="text-center mb-10">
              <span className={tagCls}><i className="fas fa-heart" /> Step 1 of 3</span>
              <h1 className={h1Cls}>What excites you?</h1>
              <p className={subCls}>Swipe right to like, left to skip. Be honest — there are no wrong answers.</p>
            </div>

            <div className="flex flex-col items-center gap-6">
              {cardIndex < INTEREST_CARDS.length ? (
                <>
                  <div className="relative w-[320px] h-[360px] flex items-center justify-center">
                    {INTEREST_CARDS.slice(cardIndex + 1, cardIndex + 3).reverse().map((c, i) => (
                      <div
                        key={c.id}
                        className="absolute w-[300px] h-full bg-[#F5F0E8] border border-[#DDD5BE] rounded-[44px]"
                        style={{ transform: `scale(${0.92 + i * 0.04}) translateY(${(1 - i) * 12}px)`, zIndex: i }}
                      />
                    ))}
                    <InterestCard
                      key={INTEREST_CARDS[cardIndex].id}
                      card={INTEREST_CARDS[cardIndex]}
                      onLike={handleLike}
                      onDislike={handleDislike}
                    />
                  </div>
                  <div className="flex items-center gap-8">
                    <button
                      className="w-14 h-14 rounded-full flex items-center justify-center text-xl border-2 cursor-pointer transition-transform duration-200 hover:scale-110 bg-[rgba(192,57,43,0.08)] text-[#C0392B] border-[#C0392B]"
                      onClick={handleDislike}
                    >
                      <i className="fas fa-times" />
                    </button>
                    <span className="text-[0.85rem] text-[#967A68] font-semibold">
                      {cardIndex + 1} / {INTEREST_CARDS.length}
                    </span>
                    <button
                      className="w-14 h-14 rounded-full flex items-center justify-center text-xl border-2 cursor-pointer transition-transform duration-200 hover:scale-110 bg-[rgba(90,122,82,0.1)] text-[#5A7A52] border-[#5A7A52]"
                      onClick={handleLike}
                    >
                      <i className="fas fa-heart" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="text-center py-12 text-[#967A68]">
                  <div className="text-5xl mb-3">✅</div>
                  <p>Loading personality test…</p>
                </div>
              )}
              {liked.length > 0 && (
                <div className="flex flex-wrap gap-2 justify-center max-w-[420px]">
                  {liked.slice(-5).map(c => (
                    <span key={c.id} className="text-xs font-medium bg-[#F5F0E8] border border-[#DDD5BE] px-3 py-1.5 rounded-full text-[#6B5645]">
                      {c.icon} {c.domain}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PERSONALITY ── */}
        {phase === 'personality' && (
          <div className={sectionCls}>
            <StepIndicator currentStep={1} totalSteps={3} labels={['Interests', 'Personality', 'Aptitude']} />
            <div className="text-center mb-10">
              <span className={tagCls}><i className="fas fa-brain" /> Step 2 of 3</span>
              <h1 className={h1Cls}>How do you think?</h1>
              <p className={subCls}>Choose the option that feels most natural to you.</p>
            </div>

            <div className="max-w-[600px] mx-auto">
              <div className="h-1 bg-[#EDE7D9] rounded-full mb-2 overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C8A84B] to-[#E2C578] rounded-full transition-[width_0.4s_cubic-bezier(0.22,1,0.36,1)]"
                  style={{ width: `${(pqIndex / PERSONALITY_QUESTIONS.length) * 100}%` }}
                />
              </div>
              <p className="text-xs text-[#967A68] mb-6 text-right">
                {pqIndex + 1} of {PERSONALITY_QUESTIONS.length}
              </p>
              <div
                key={pqIndex}
                className="bg-[#FDFCF8] border border-[#DDD5BE] rounded-[44px] p-10 shadow-[0_8px_32px_rgba(46,34,24,0.10)] animate-[assessFadeUp_0.35s_cubic-bezier(0.22,1,0.36,1)_both]"
              >
                <h2 className="font-['Playfair_Display',Georgia,serif] text-[1.5rem] font-bold text-[#2E2218] leading-[1.25] mb-7 tracking-[-0.015em]">
                  {PERSONALITY_QUESTIONS[pqIndex].question}
                </h2>
                <div className="flex flex-col gap-3">
                  {PERSONALITY_QUESTIONS[pqIndex].options.map(opt => (
                    <button
                      key={opt.value}
                      className="flex items-center gap-4 px-5 py-4 bg-[#F5F0E8] border-[1.5px] border-[#DDD5BE] rounded-[18px] cursor-pointer font-['Outfit',system-ui,sans-serif] text-left transition-all duration-200 hover:bg-[#F0E4C0] hover:border-[#C8A84B] hover:translate-x-1 hover:shadow-[0_2px_10px_rgba(46,34,24,0.07)]"
                      onClick={() => handlePersonalityAnswer(PERSONALITY_QUESTIONS[pqIndex].trait, opt.value)}
                    >
                      <span className="text-[1.4rem] flex-shrink-0">{opt.icon}</span>
                      <span className="text-[0.92rem] font-medium text-[#3C2E22] flex-1">{opt.label}</span>
                      <i className="fas fa-arrow-right text-xs text-[#B89A88]" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── CAREER ── */}
        {phase === 'career' && (
          <div className={sectionCls}>
            <div className="text-center mb-10">
              <span className={tagCls}><i className="fas fa-star" /> Career Matches</span>
              <h1 className={h1Cls}>Your top career matches</h1>
              <p className={subCls}>Based on your interests and personality. Select one to take a tailored aptitude test.</p>
            </div>

            {aptError && (
              <div className="bg-[rgba(192,57,43,0.08)] border border-[rgba(192,57,43,0.2)] text-[#C0392B] rounded-[18px] px-4 py-3 text-[0.85rem] mb-5 flex items-center gap-2">
                <i className="fas fa-triangle-exclamation" /> {aptError}
              </div>
            )}

            <div className="grid grid-cols-[repeat(auto-fill,minmax(280px,1fr))] gap-5">
              {careers.map((career, i) => (
                <button
                  key={career.title}
                  className={`bg-[#FDFCF8] border-[1.5px] rounded-[28px] p-6 cursor-pointer font-['Outfit',system-ui,sans-serif] text-left relative overflow-hidden transition-all duration-[250ms] hover:-translate-y-1 hover:shadow-[0_8px_32px_rgba(46,34,24,0.10)] shadow-[0_2px_10px_rgba(46,34,24,0.07)]
                    ${i === bestMatchIndex
                      ? 'border-[#C8A84B] shadow-[0_8px_32px_rgba(200,168,75,0.30)] bg-gradient-to-br from-[#FDFCF8] to-[#F0E4C0] hover:border-[#C8A84B]'
                      : 'border-[#DDD5BE] hover:border-[#C8A84B]'}`}
                  onClick={() => handleCareerSelect(career)}
                >
                  {i === bestMatchIndex && (
                    <div className="absolute top-3 right-3 text-[0.68rem] font-bold bg-[#C8A84B] text-white px-2.5 py-0.5 rounded-full">
                      🏆 Best Match
                    </div>
                  )}
                  <div className="flex items-center justify-between mb-3.5">
                    <h3 className="font-['Playfair_Display',Georgia,serif] text-[1.2rem] font-bold text-[#2E2218]">
                      {career.title}
                    </h3>
                    <span className="font-['Playfair_Display',Georgia,serif] text-[1.3rem] font-extrabold text-[#A6882C]">
                      {career.match}%
                    </span>
                  </div>
                  <div className="h-[5px] bg-[#EDE7D9] rounded-full overflow-hidden mb-3.5">
                    <div
                      className="h-full bg-gradient-to-r from-[#C8A84B] to-[#E2C578] rounded-full transition-[width_1s_cubic-bezier(0.22,1,0.36,1)]"
                      style={{ width: `${career.match}%` }}
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {career.domains.map(d => (
                      <span key={d} className="text-[0.68rem] font-semibold uppercase tracking-[0.07em] text-[#967A68] bg-[#F5F0E8] border border-[#DDD5BE] px-2 py-0.5 rounded-full">
                        {d}
                      </span>
                    ))}
                  </div>
                  <div className="text-[0.82rem] font-semibold text-[#A6882C] flex items-center gap-1.5">
                    Take aptitude test <i className="fas fa-arrow-right" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── LOADING ── */}
        {phase === 'loading' && (
          <div className="flex flex-col items-center justify-center min-h-[50vh] gap-6 text-center animate-[assessFadeUp_0.5s_cubic-bezier(0.22,1,0.36,1)_both]">
            <div className="relative w-20 h-20 rounded-full border-[3px] border-[#DDD5BE] border-t-[#C8A84B] [animation:spin_1s_linear_infinite]">
              <div className="absolute inset-2 rounded-full border-[3px] border-transparent border-t-[#A6882C] [animation:spin_0.7s_linear_infinite_reverse]" />
            </div>
            <h2 className="font-['Playfair_Display',Georgia,serif] text-[1.8rem] font-bold text-[#2E2218] tracking-[-0.02em]">
              Generating your aptitude test…
            </h2>
            <p className="text-[0.95rem] text-[#6B5645]">
              Our AI is crafting questions tailored to <strong>{selectedCareer?.title}</strong>
            </p>
            <div className="flex flex-col gap-2 mt-2">
              {['Analyzing your profile', 'Mapping to career skills', 'Generating questions', 'Validating relevance'].map((s, i) => (
                <div
                  key={i}
                  className="text-[0.85rem] text-[#967A68] flex items-center gap-2 animate-[loadStep_0.4s_cubic-bezier(0.22,1,0.36,1)_both]"
                  style={{ animationDelay: `${i * 0.6}s` }}
                >
                  <i className="fas fa-circle-check text-[#C8A84B]" /> {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── APTITUDE ── */}
        {phase === 'aptitude' && aptQuestions.length > 0 && (() => {
          const q = aptQuestions[aptIndex];
          const diffColor = { easy: '#5A7A52', medium: '#C8A84B', hard: '#C0392B' }[q.difficulty];
          return (
            <div className={sectionCls}>
              <StepIndicator currentStep={2} totalSteps={3} labels={['Interests', 'Personality', 'Aptitude']} />
              <div className="text-center mb-10">
                <span className={tagCls}><i className="fas fa-bolt" /> Step 3 of 3 · {selectedCareer?.title}</span>
                <h1 className={h1Cls}>Aptitude Test</h1>
                <p className={subCls}>Answer each question before the timer runs out. Points vary by difficulty.</p>
              </div>

              <div className="max-w-[680px] mx-auto">
                <div className="bg-[#FDFCF8] border border-[#DDD5BE] rounded-[44px] p-9 shadow-[0_24px_64px_rgba(46,34,24,0.14)] animate-[assessFadeUp_0.35s_cubic-bezier(0.22,1,0.36,1)_both]">
                  {/* Top row */}
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="text-[0.8rem] font-bold text-[#4A3828]">Q{aptIndex + 1} / {aptQuestions.length}</span>
                      <span className="text-[0.75rem] font-bold capitalize" style={{ color: diffColor }}>{q.difficulty}</span>
                      <span className="text-[0.72rem] font-bold text-[#A6882C] bg-[rgba(200,168,75,0.1)] border border-[rgba(200,168,75,0.25)] px-2 py-0.5 rounded-full">
                        +{q.points} pts
                      </span>
                      <span className="text-[0.7rem] text-[#967A68] bg-[#F5F0E8] border border-[#DDD5BE] px-2 py-0.5 rounded-full">
                        {q.skill}
                      </span>
                    </div>
                    <AptitudeTimer key={aptIndex} seconds={q.time} onExpire={handleTimerExpire} />
                  </div>

                  {/* Score strip */}
                  <div className="flex items-center justify-between mb-5 text-[0.82rem] text-[#6B5645]">
                    <span>Score: <strong className="text-[#A6882C]">{aptScore}</strong> pts</span>
                    <div className="w-[120px] h-1 bg-[#EDE7D9] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C8A84B] to-[#E2C578] rounded-full transition-[width_0.4s_cubic-bezier(0.22,1,0.36,1)]"
                        style={{ width: `${(aptIndex / aptQuestions.length) * 100}%` }}
                      />
                    </div>
                  </div>

                  <h2 className="font-['Playfair_Display',Georgia,serif] text-[1.35rem] font-bold text-[#2E2218] leading-[1.3] mb-6 tracking-[-0.015em]">
                    {q.question}
                  </h2>

                  <div className="flex flex-col gap-3 mb-5">
                    {q.options.map((opt, idx) => {
                      let cls = "flex items-center gap-3.5 px-4 py-3.5 bg-[#F5F0E8] border-[1.5px] border-[#DDD5BE] rounded-[18px] cursor-pointer font-['Outfit',system-ui,sans-serif] text-left transition-all duration-200 disabled:cursor-default";
                      if (answered) {
                        if (idx === q.correct) cls += " !bg-[rgba(90,122,82,0.1)] !border-[#5A7A52]";
                        else if (idx === selectedOption) cls += " !bg-[rgba(192,57,43,0.08)] !border-[#C0392B]";
                      } else if (idx === selectedOption) {
                        cls += " !bg-[#F0E4C0] !border-[#C8A84B]";
                      } else {
                        cls += " hover:bg-[#F0E4C0] hover:border-[#C8A84B]";
                      }
                      return (
                        <button key={idx} className={cls} onClick={() => handleOptionSelect(idx)} disabled={answered}>
                          <span className="w-7 h-7 rounded-full bg-[#DDD5BE] text-[#4A3828] flex items-center justify-center text-[0.78rem] font-bold flex-shrink-0">
                            {String.fromCharCode(65 + idx)}
                          </span>
                          <span className="text-[0.9rem] text-[#3C2E22] flex-1">{opt}</span>
                          {answered && idx === q.correct  && <i className="fas fa-check text-[0.9rem] text-[#5A7A52]" />}
                          {answered && idx === selectedOption && idx !== q.correct && <i className="fas fa-times text-[0.9rem] text-[#C0392B]" />}
                        </button>
                      );
                    })}
                  </div>

                  {answered && (
                    <button
                      className="flex items-center gap-2.5 justify-center w-full py-3.5 bg-gradient-to-br from-[#C8A84B] to-[#A6882C] text-white font-semibold text-[0.95rem] font-['Outfit',system-ui,sans-serif] border-none cursor-pointer rounded-[18px] shadow-[0_8px_32px_rgba(200,168,75,0.30)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(200,168,75,0.4)] animate-[assessFadeUp_0.3s_cubic-bezier(0.22,1,0.36,1)_both]"
                      onClick={handleNextQuestion}
                    >
                      {aptIndex >= aptQuestions.length - 1 ? 'See Results' : 'Next Question'}
                      <i className="fas fa-arrow-right" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })()}

        {/* ── RESULTS ── */}
        {phase === 'results' && results && (
          <div className={`${sectionCls} max-w-[680px] mx-auto`}>
            <div className="text-center mb-10">
              <div className="text-5xl mb-3 animate-[bounce_0.6s_cubic-bezier(0.22,1,0.36,1)]">🎉</div>
              <h1 className={h1Cls}>Your Career Profile</h1>
              <p className={subCls}>Based on your interests, personality and aptitude test</p>
            </div>

            {/* Score card */}
            <div className="bg-[#F5F0E8] border border-[#DDD5BE] rounded-[44px] p-8 flex items-center gap-8 shadow-[0_8px_32px_rgba(46,34,24,0.10)] mb-6 max-sm:flex-col max-sm:text-center">
              <div className="flex-shrink-0 w-[120px] h-[120px]">
                <svg viewBox="0 0 120 120" width="120" height="120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#DDD5BE" strokeWidth="8" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="#C8A84B" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - results.aptPct / 100)}`}
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.22,1,0.36,1)' }}
                  />
                  <text x="60" y="55" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="22" fontWeight="800" fill="#A6882C">{results.aptPct}%</text>
                  <text x="60" y="74" textAnchor="middle" fontFamily="'Outfit',sans-serif" fontSize="10" fill="#967A68">Aptitude Score</text>
                </svg>
              </div>
              <div className="flex-1">
                <h2 className="font-['Playfair_Display',Georgia,serif] text-[1.6rem] font-extrabold text-[#2E2218] mb-1.5 tracking-[-0.02em]">
                  {results.career.title}
                </h2>
                <p className="text-[0.9rem] text-[#967A68] mb-2">{results.aptScore} / {results.aptTotal} points</p>
                <p className="text-[0.88rem] text-[#6B5645] leading-relaxed">
                  {results.aptPct >= 80 ? '🌟 Excellent aptitude for this career!' :
                   results.aptPct >= 60 ? '✅ Good foundation — keep building skills' :
                   results.aptPct >= 40 ? '📚 Potential shown — focused learning needed' :
                                          '💡 Consider exploring related careers'}
                </p>
              </div>
            </div>

            {/* Top Careers */}
            <div className="bg-[#FDFCF8] border border-[#DDD5BE] rounded-[28px] p-6 shadow-[0_2px_10px_rgba(46,34,24,0.07)] mb-5">
              <h3 className="text-[0.8rem] font-bold uppercase tracking-[0.1em] text-[#4A3828] mb-5 flex items-center gap-2">
                <i className="fas fa-trophy text-[#C8A84B]" /> Top Career Matches
              </h3>
              <div className="flex flex-col gap-3">
                {results.topCareers.map((c, i) => (
                  <div key={c.title} className="flex items-center gap-3.5">
                    <span className="text-[0.78rem] font-bold text-[#B89A88] w-5">#{i + 1}</span>
                    <span className="text-[0.88rem] font-semibold text-[#4A3828] w-[160px] flex-shrink-0">{c.title}</span>
                    <div className="flex-1 h-1.5 bg-[#EDE7D9] rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#C8A84B] to-[#E2C578] rounded-full transition-[width_1.2s_cubic-bezier(0.22,1,0.36,1)]"
                        style={{ width: `${c.match}%` }}
                      />
                    </div>
                    <span className="text-[0.82rem] font-bold text-[#A6882C] w-9 text-right">{c.match}%</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Interests */}
            <div className="bg-[#FDFCF8] border border-[#DDD5BE] rounded-[28px] p-6 shadow-[0_2px_10px_rgba(46,34,24,0.07)] mb-5">
              <h3 className="text-[0.8rem] font-bold uppercase tracking-[0.1em] text-[#4A3828] mb-5 flex items-center gap-2">
                <i className="fas fa-heart text-[#C8A84B]" /> Your Interests
              </h3>
              <div className="flex flex-wrap gap-2">
                {results.interests.map(interest => (
                  <span key={interest.id} className="text-[0.82rem] font-medium bg-[#F5F0E8] border border-[#DDD5BE] px-3.5 py-1.5 rounded-full text-[#6B5645]">
                    {interest.icon} {interest.label}
                  </span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="flex gap-4 flex-wrap mt-7">
              <button
                className="flex-1 flex items-center justify-center gap-2.5 bg-gradient-to-br from-[#C8A84B] to-[#A6882C] text-white font-semibold text-[0.95rem] font-['Outfit',system-ui,sans-serif] px-8 py-3.5 rounded-[18px] border-none cursor-pointer shadow-[0_8px_32px_rgba(200,168,75,0.30)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(200,168,75,0.4)]"
                onClick={() => navigate('/dashboard')}
              >
                <i className="fas fa-compass" /> Go to Dashboard
              </button>
              <button
                className="flex-1 flex items-center justify-center gap-2.5 bg-[#FDFCF8] text-[#3C2E22] font-medium text-[0.95rem] font-['Outfit',system-ui,sans-serif] px-8 py-3.5 rounded-[18px] border-[1.5px] border-[#CAC0A6] cursor-pointer shadow-[0_2px_10px_rgba(46,34,24,0.07)] transition-all duration-200 hover:border-[#B5A48F] hover:bg-[#F5F0E8] hover:-translate-y-0.5"
                onClick={() => {
                  setPhase('interest'); setCardIndex(0); setLiked([]); setDisliked([]);
                  setPqIndex(0); setPersonalityAnswers({}); setAptIndex(0); setAptScore(0); setProgress(0);
                }}
              >
                <i className="fas fa-rotate-left" /> Retake Assessment
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
