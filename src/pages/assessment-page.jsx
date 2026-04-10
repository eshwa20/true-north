import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './assessment-style.css';

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
      { label: 'Work alone with full control',    value: 'solo',   icon: '🧍' },
      { label: 'Collaborate with a team',         value: 'team',   icon: '👥' },
      { label: 'Lead and delegate tasks',         value: 'lead',   icon: '🎯' },
      { label: 'Support and assist others',       value: 'support',icon: '🤲' },
    ],
  },
  {
    id: 2,
    question: 'When facing a difficult decision, you tend to:',
    trait: 'risk',
    options: [
      { label: 'Take risks for bigger rewards',   value: 'risk',    icon: '🎲' },
      { label: 'Play it safe and steady',         value: 'safe',    icon: '🛡️' },
      { label: 'Analyze all options carefully',   value: 'analyze', icon: '🔍' },
      { label: 'Trust your gut feeling',          value: 'intuition',icon: '💡' },
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
      { label: 'Analytical & logical thinking',   value: 'analytical', icon: '🧠' },
      { label: 'Creativity & imagination',        value: 'creative',   icon: '✨' },
      { label: 'Communication & persuasion',      value: 'communication',icon: '🗣️' },
      { label: 'Empathy & understanding others',  value: 'empathy',    icon: '❤️' },
    ],
  },
];

// ── CAREER POOL ──────────────────────────────────────────────
const CAREER_POOL = [
  // ── Technology ──
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
  // ── Data & AI ──
  { title: 'Data Scientist',              domains: ['Data', 'Technology', 'Science'],               strength: ['analytical'] },
  { title: 'Data Analyst',                domains: ['Data', 'Technology'],                          strength: ['analytical'] },
  { title: 'Data Engineer',               domains: ['Data', 'Technology', 'Engineering'],           strength: ['analytical'] },
  { title: 'ML Engineer',                 domains: ['Data', 'Technology'],                          strength: ['analytical'] },
  { title: 'AI Research Scientist',       domains: ['Data', 'Science', 'Technology'],               strength: ['analytical'] },
  { title: 'Business Intelligence Analyst', domains: ['Data', 'Finance', 'Leadership'],             strength: ['analytical'] },
  { title: 'Quantitative Analyst',        domains: ['Data', 'Finance', 'Science'],                  strength: ['analytical'] },
  // ── Design & Creative ──
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
  // ── Film & Media ──
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
  // ── Music ──
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
  // ── Writing & Content ──
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
  // ── Marketing & Communication ──
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
  // ── Business, Finance & Leadership ──
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
  // ── Education & Social ──
  { title: 'Teacher / Educator',          domains: ['Education', 'Social'],                         strength: ['empathy', 'communication'] },
  { title: 'School Counselor',            domains: ['Education', 'Social'],                         strength: ['empathy'] },
  { title: 'Curriculum Designer',         domains: ['Education', 'Writing'],                        strength: ['creative', 'communication'] },
  { title: 'E-Learning Developer',        domains: ['Education', 'Technology'],                     strength: ['creative', 'analytical'] },
  { title: 'Corporate Trainer',           domains: ['Education', 'Leadership'],                     strength: ['communication', 'empathy'] },
  { title: 'Social Worker',               domains: ['Social', 'Education'],                         strength: ['empathy'] },
  { title: 'Community Manager',           domains: ['Social', 'Marketing'],                         strength: ['empathy', 'communication'] },
  { title: 'Non-Profit Program Director', domains: ['Social', 'Leadership'],                        strength: ['empathy', 'communication'] },
  { title: 'Life Coach',                  domains: ['Social', 'Education'],                         strength: ['empathy', 'communication'] },
  // ── Science & Engineering ──
  { title: 'Research Scientist',          domains: ['Science', 'Data'],                             strength: ['analytical'] },
  { title: 'Biomedical Engineer',         domains: ['Science', 'Engineering'],                      strength: ['analytical'] },
  { title: 'Environmental Scientist',     domains: ['Science', 'Social'],                           strength: ['analytical'] },
  { title: 'Psychologist / Counselor',    domains: ['Social', 'Science'],                           strength: ['empathy'] },
  { title: 'Civil Engineer',              domains: ['Engineering'],                                  strength: ['analytical'] },
  { title: 'Mechanical Engineer',         domains: ['Engineering'],                                  strength: ['analytical'] },
  { title: 'Robotics Engineer',           domains: ['Engineering', 'Technology'],                   strength: ['analytical'] },
  { title: 'Aerospace Engineer',          domains: ['Engineering', 'Science'],                      strength: ['analytical'] },
  // ── Gaming ──
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
// FIX 2 (part of fix): sorting by score guarantees true best match
function getCareerRecommendations(likedDomains, personalityAnswers) {
  const domainCount = {};
  likedDomains.forEach(d => { domainCount[d] = (domainCount[d] || 0) + 1; });

  const strength = personalityAnswers.strength || 'analytical';
  const teamwork = personalityAnswers.teamwork  || 'solo';
  const risk     = personalityAnswers.risk      || 'analyze';

  const scored = CAREER_POOL.map(career => {
    let score = 0;

    // Domain overlap score — must have at least one liked domain to appear
    let domainHits = 0;
    career.domains.forEach(d => {
      if (domainCount[d]) {
        score += domainCount[d] * 20;
        domainHits++;
      }
    });

    // FIX 3: If the user has NO liked domains matching this career, skip it entirely
    if (domainHits === 0) return { ...career, match: 0 };

    // Personality strength bonus
    if (career.strength.includes(strength)) score += 25;

    // Teamwork/risk bonuses
    if (teamwork === 'lead' && career.domains.includes('Leadership')) score += 10;
    if (risk === 'risk' && career.title === 'Entrepreneur') score += 15;

    return { ...career, match: Math.min(score, 99) };
  });

  const results = scored
    .filter(c => c.match > 0)
    .sort((a, b) => b.match - a.match)
    .slice(0, 6)
    .map(c => ({
      ...c,
      // Only pad scores that are low — keep real scores intact
      match: c.match < 50 ? 50 + Math.floor(Math.random() * 20) : c.match,
    }));

  return results;
}

// ── GEMINI APTITUDE GENERATOR (via FastAPI backend) ──────────
async function generateAptitudeQuestions(career, interests, personality) {
  const res = await fetch('/api/generate-aptitude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ career, interests, personality }),
  });

  if (!res.ok) {
    // Surface the actual error message from the backend
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
    <div className="step-indicator">
      {labels.map((label, i) => (
        <div key={i} className={`step-item ${i < currentStep ? 'done' : i === currentStep ? 'active' : ''}`}>
          <div className="step-bubble">
            {i < currentStep ? <i className="fas fa-check" /> : i + 1}
          </div>
          <span className="step-label">{label}</span>
          {i < totalSteps - 1 && <div className="step-connector" />}
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
    if (offset > 80)       onLike();
    else if (offset < -80) onDislike();
    setOffset(0); setDragging(false);
  };

  const rotation = offset * 0.08;
  const likeOpacity    = Math.min(offset / 80, 1);
  const dislikeOpacity = Math.min(-offset / 80, 1);

  return (
    <div
      className="interest-card"
      style={{ transform: `translateX(${offset}px) rotate(${rotation}deg)` }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      <div className="interest-card-like"   style={{ opacity: likeOpacity }}>❤️ Like</div>
      <div className="interest-card-nope"   style={{ opacity: dislikeOpacity }}>👎 Skip</div>
      <div className="interest-card-emoji">{card.icon}</div>
      <div className="interest-card-label">{card.label}</div>
      <div className="interest-card-domain">{card.domain}</div>
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

  const pct = (left / seconds) * 100;
  const color = pct > 50 ? 'var(--c-green)' : pct > 25 ? 'var(--c-gold)' : 'var(--c-red)';

  return (
    <div className="apt-timer">
      <svg viewBox="0 0 44 44" className="apt-timer-ring">
        <circle cx="22" cy="22" r="18" fill="none" stroke="var(--c-linen)" strokeWidth="3" />
        <circle cx="22" cy="22" r="18" fill="none" stroke={color} strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={`${2 * Math.PI * 18}`}
          strokeDashoffset={`${2 * Math.PI * 18 * (1 - pct / 100)}`}
          transform="rotate(-90 22 22)"
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
      </svg>
      <span className="apt-timer-num" style={{ color }}>{left}s</span>
    </div>
  );
}

// ── MAIN ASSESSMENT COMPONENT ────────────────────────────────
export default function AssessmentPage() {
  const navigate = useNavigate();

  // Global state
  const [phase, setPhase]       = useState('interest');
  const [progress, setProgress] = useState(0);

  // Interest state
  const [cardIndex, setCardIndex] = useState(0);
  const [liked, setLiked]         = useState([]);
  const [disliked, setDisliked]   = useState([]);

  // Personality state
  const [pqIndex, setPqIndex]                       = useState(0);
  const [personalityAnswers, setPersonalityAnswers] = useState({});

  // Career state
  const [careers, setCareers]               = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);

  // Aptitude state
  const [aptQuestions, setAptQuestions]     = useState([]);
  const [aptIndex, setAptIndex]             = useState(0);
  const [aptAnswers, setAptAnswers]         = useState([]);
  const [aptScore, setAptScore]             = useState(0);
  const [aptLoading, setAptLoading]         = useState(false);
  const [aptError, setAptError]             = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered]             = useState(false);

  // Results state
  const [results, setResults] = useState(null);

  // ── Interest handlers ──
  const handleLike = () => {
    setLiked(p => [...p, INTEREST_CARDS[cardIndex]]);
    nextCard();
  };
  const handleDislike = () => {
    setDisliked(p => [...p, INTEREST_CARDS[cardIndex]]);
    nextCard();
  };
  const nextCard = () => {
    if (cardIndex >= INTEREST_CARDS.length - 1) {
      setProgress(33);
      setPhase('personality');
    } else {
      setCardIndex(p => p + 1);
    }
  };

  // ── Personality handlers ──
  const handlePersonalityAnswer = (trait, value) => {
    const updated = { ...personalityAnswers, [trait]: value };
    setPersonalityAnswers(updated);
    if (pqIndex >= PERSONALITY_QUESTIONS.length - 1) {
      const likedDomains = liked.map(c => c.domain);
      const recs = getCareerRecommendations(likedDomains, updated);
      setCareers(recs);
      setProgress(66);
      setPhase('career');
    } else {
      setPqIndex(p => p + 1);
    }
  };

  // ── Career selection ──
  const handleCareerSelect = async (career) => {
    setSelectedCareer(career);
    setAptLoading(true);
    setAptError('');
    setPhase('loading');

    try {
      const interests = liked.map(c => c.label);
      const questions = await generateAptitudeQuestions(career.title, interests, personalityAnswers);
      setAptQuestions(questions);
      setProgress(80);
      setPhase('aptitude');
    } catch (e) {
      console.error('Question generation error:', e);
      setAptError(`Failed to generate questions: ${e.message}. Please try again.`);
      setPhase('career');
    } finally {
      setAptLoading(false);
    }
  };

  // ── Aptitude handlers ──
  const handleOptionSelect = (idx) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);
    const q = aptQuestions[aptIndex];
    if (idx === q.correct) setAptScore(p => p + q.points);
  };

  const handleNextQuestion = () => {
    setAptAnswers(p => [...p, { qid: aptIndex, selected: selectedOption }]);
    setSelectedOption(null);
    setAnswered(false);
    if (aptIndex >= aptQuestions.length - 1) {
      finishAptitude();
    } else {
      setAptIndex(p => p + 1);
    }
  };

  const handleTimerExpire = () => {
    if (!answered) {
      setAnswered(true);
      setSelectedOption(null);
      setTimeout(handleNextQuestion, 800);
    }
  };

  const finishAptitude = () => {
    const totalPoints = aptQuestions.reduce((s, q) => s + q.points, 0);
    const pct = Math.round((aptScore / totalPoints) * 100);
    setResults({
      career:      selectedCareer,
      aptScore,
      aptTotal:    totalPoints,
      aptPct:      pct,
      topCareers:  careers.slice(0, 3),
      interests:   liked.slice(0, 5),
      personality: personalityAnswers,
    });
    setProgress(100);
    setPhase('results');
  };

  // ── FIX 2: Best match = highest match % (not first in array) ──
  const bestMatchIndex = careers.reduce(
    (bestIdx, c, i) => (c.match > careers[bestIdx].match ? i : bestIdx),
    0
  );

  // ── RENDER ──────────────────────────────────────────────────
  return (
    <div className="assess-page">
      <div className="assess-orb assess-orb-1" />
      <div className="assess-orb assess-orb-2" />

      <header className="assess-header">
        <div className="assess-header-inner">
          <div className="assess-logo">
            <div className="assess-logo-mark"><i className="fas fa-compass" /></div>
            <span className="assess-logo-name">TrueNorth</span>
          </div>
          {phase !== 'results' && (
            <div className="assess-progress-wrap">
              <div className="assess-progress-bar">
                <div className="assess-progress-fill" style={{ width: `${progress}%` }} />
              </div>
              <span className="assess-progress-label">{progress}% complete</span>
            </div>
          )}
        </div>
      </header>

      <main className="assess-main">

        {/* ── PHASE: INTEREST ── */}
        {phase === 'interest' && (
          <div className="assess-section">
            <StepIndicator currentStep={0} totalSteps={3} labels={['Interests', 'Personality', 'Aptitude']} />
            <div className="assess-title-block">
              <span className="assess-tag"><i className="fas fa-heart" /> Step 1 of 3</span>
              <h1 className="assess-h1">What excites you?</h1>
              <p className="assess-sub">Swipe right to like, left to skip. Be honest — there are no wrong answers.</p>
            </div>

            <div className="interest-stage">
              {cardIndex < INTEREST_CARDS.length ? (
                <>
                  <div className="interest-stack">
                    {INTEREST_CARDS.slice(cardIndex + 1, cardIndex + 3).reverse().map((c, i) => (
                      <div key={c.id} className="interest-card-ghost" style={{ transform: `scale(${0.92 + i * 0.04}) translateY(${(1 - i) * 12}px)`, zIndex: i }} />
                    ))}
                    <InterestCard
                      key={INTEREST_CARDS[cardIndex].id}
                      card={INTEREST_CARDS[cardIndex]}
                      onLike={handleLike}
                      onDislike={handleDislike}
                    />
                  </div>
                  <div className="interest-actions">
                    <button className="interest-btn skip" onClick={handleDislike}><i className="fas fa-times" /></button>
                    <span className="interest-count">{cardIndex + 1} / {INTEREST_CARDS.length}</span>
                    <button className="interest-btn like" onClick={handleLike}><i className="fas fa-heart" /></button>
                  </div>
                </>
              ) : (
                <div className="phase-done">
                  <div className="phase-done-icon">✅</div>
                  <p>Loading personality test…</p>
                </div>
              )}
              {liked.length > 0 && (
                <div className="interest-liked-bar">
                  {liked.slice(-5).map(c => (
                    <span key={c.id} className="interest-liked-chip">{c.icon} {c.domain}</span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── PHASE: PERSONALITY ── */}
        {phase === 'personality' && (
          <div className="assess-section">
            <StepIndicator currentStep={1} totalSteps={3} labels={['Interests', 'Personality', 'Aptitude']} />
            <div className="assess-title-block">
              <span className="assess-tag"><i className="fas fa-brain" /> Step 2 of 3</span>
              <h1 className="assess-h1">How do you think?</h1>
              <p className="assess-sub">Choose the option that feels most natural to you.</p>
            </div>

            <div className="personality-stage">
              <div className="personality-progress">
                <div className="personality-progress-fill" style={{ width: `${((pqIndex) / PERSONALITY_QUESTIONS.length) * 100}%` }} />
              </div>
              <p className="personality-qcount">{pqIndex + 1} of {PERSONALITY_QUESTIONS.length}</p>
              <div className="personality-card">
                <h2 className="personality-question">{PERSONALITY_QUESTIONS[pqIndex].question}</h2>
                <div className="personality-options">
                  {PERSONALITY_QUESTIONS[pqIndex].options.map(opt => (
                    <button
                      key={opt.value}
                      className="personality-option"
                      onClick={() => handlePersonalityAnswer(PERSONALITY_QUESTIONS[pqIndex].trait, opt.value)}
                    >
                      <span className="personality-option-icon">{opt.icon}</span>
                      <span className="personality-option-label">{opt.label}</span>
                      <i className="fas fa-arrow-right personality-option-arrow" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ── PHASE: CAREER SELECTION ── */}
        {phase === 'career' && (
          <div className="assess-section">
            <div className="assess-title-block">
              <span className="assess-tag"><i className="fas fa-star" /> Career Matches</span>
              <h1 className="assess-h1">Your top career matches</h1>
              <p className="assess-sub">Based on your interests and personality. Select one to take a tailored aptitude test.</p>
            </div>

            {aptError && (
              <div className="assess-error">
                <i className="fas fa-triangle-exclamation" /> {aptError}
              </div>
            )}

            <div className="career-grid">
              {careers.map((career, i) => (
                // FIX 2: Badge goes to actual highest-score career, not just first card
                <button
                  key={career.title}
                  className={`career-card ${i === bestMatchIndex ? 'career-card-top' : ''}`}
                  onClick={() => handleCareerSelect(career)}
                >
                  {i === bestMatchIndex && (
                    <div className="career-top-badge">🏆 Best Match</div>
                  )}
                  <div className="career-card-header">
                    <h3 className="career-card-title">{career.title}</h3>
                    <span className="career-card-pct">{career.match}%</span>
                  </div>
                  <div className="career-match-bar">
                    <div className="career-match-fill" style={{ width: `${career.match}%` }} />
                  </div>
                  <div className="career-card-domains">
                    {career.domains.map(d => <span key={d} className="career-domain-tag">{d}</span>)}
                  </div>
                  <div className="career-card-cta">
                    Take aptitude test <i className="fas fa-arrow-right" />
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* ── PHASE: LOADING ── */}
        {phase === 'loading' && (
          <div className="assess-loading">
            <div className="loading-ring">
              <div className="loading-ring-inner" />
            </div>
            <h2 className="loading-title">Generating your aptitude test…</h2>
            <p className="loading-sub">Our AI is crafting questions tailored to <strong>{selectedCareer?.title}</strong></p>
            <div className="loading-steps">
              {['Analyzing your profile', 'Mapping to career skills', 'Generating questions', 'Validating relevance'].map((s, i) => (
                <div key={i} className="loading-step" style={{ animationDelay: `${i * 0.6}s` }}>
                  <i className="fas fa-circle-check" /> {s}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── PHASE: APTITUDE ── */}
        {phase === 'aptitude' && aptQuestions.length > 0 && (
          <div className="assess-section">
            <StepIndicator currentStep={2} totalSteps={3} labels={['Interests', 'Personality', 'Aptitude']} />
            <div className="assess-title-block">
              <span className="assess-tag"><i className="fas fa-bolt" /> Step 3 of 3 · {selectedCareer?.title}</span>
              <h1 className="assess-h1">Aptitude Test</h1>
              <p className="assess-sub">Answer each question before the timer runs out. Points vary by difficulty.</p>
            </div>

            <div className="apt-stage">
              {(() => {
                const q = aptQuestions[aptIndex];
                const diffColors = { easy: 'var(--c-green)', medium: 'var(--c-gold)', hard: 'var(--c-red)' };
                return (
                  <div className="apt-card">
                    <div className="apt-card-top">
                      <div className="apt-meta">
                        <span className="apt-qnum">Q{aptIndex + 1} / {aptQuestions.length}</span>
                        <span className="apt-diff" style={{ color: diffColors[q.difficulty] }}>
                          {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                        </span>
                        <span className="apt-pts">+{q.points} pts</span>
                        <span className="apt-skill">{q.skill}</span>
                      </div>
                      <AptitudeTimer key={aptIndex} seconds={q.time} onExpire={handleTimerExpire} />
                    </div>

                    <div className="apt-score-strip">
                      <span>Score: <strong>{aptScore}</strong> pts</span>
                      <div className="apt-q-progress">
                        <div className="apt-q-progress-fill" style={{ width: `${((aptIndex) / aptQuestions.length) * 100}%` }} />
                      </div>
                    </div>

                    <h2 className="apt-question">{q.question}</h2>

                    <div className="apt-options">
                      {q.options.map((opt, idx) => {
                        let cls = 'apt-option';
                        if (answered) {
                          if (idx === q.correct)           cls += ' apt-option-correct';
                          else if (idx === selectedOption) cls += ' apt-option-wrong';
                        } else if (idx === selectedOption) {
                          cls += ' apt-option-selected';
                        }
                        return (
                          <button key={idx} className={cls} onClick={() => handleOptionSelect(idx)} disabled={answered}>
                            <span className="apt-option-letter">{String.fromCharCode(65 + idx)}</span>
                            <span className="apt-option-text">{opt}</span>
                            {answered && idx === q.correct  && <i className="fas fa-check apt-option-icon correct" />}
                            {answered && idx === selectedOption && idx !== q.correct && <i className="fas fa-times apt-option-icon wrong" />}
                          </button>
                        );
                      })}
                    </div>

                    {answered && (
                      <button className="apt-next" onClick={handleNextQuestion}>
                        {aptIndex >= aptQuestions.length - 1 ? 'See Results' : 'Next Question'}
                        <i className="fas fa-arrow-right" />
                      </button>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        )}

        {/* ── PHASE: RESULTS ── */}
        {phase === 'results' && results && (
          <div className="assess-section results-section">
            <div className="results-hero">
              <div className="results-confetti">🎉</div>
              <h1 className="results-h1">Your Career Profile</h1>
              <p className="results-sub">Based on your interests, personality and aptitude test</p>
            </div>

            <div className="results-score-card">
              <div className="results-score-ring">
                <svg viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--c-linen)" strokeWidth="8" />
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--c-gold)" strokeWidth="8"
                    strokeLinecap="round"
                    strokeDasharray={`${2 * Math.PI * 50}`}
                    strokeDashoffset={`${2 * Math.PI * 50 * (1 - results.aptPct / 100)}`}
                    transform="rotate(-90 60 60)"
                    style={{ transition: 'stroke-dashoffset 1.5s var(--ease-out)' }}
                  />
                  <text x="60" y="55" textAnchor="middle" fontFamily="'Playfair Display',serif" fontSize="22" fontWeight="800" fill="var(--c-gold-dk)">{results.aptPct}%</text>
                  <text x="60" y="74" textAnchor="middle" fontFamily="'Outfit',sans-serif" fontSize="10" fill="var(--c-text-3)">Aptitude Score</text>
                </svg>
              </div>
              <div className="results-score-info">
                <h2 className="results-career-title">{results.career.title}</h2>
                <p className="results-score-detail">{results.aptScore} / {results.aptTotal} points</p>
                <p className="results-score-verdict">
                  {results.aptPct >= 80 ? '🌟 Excellent aptitude for this career!' :
                   results.aptPct >= 60 ? '✅ Good foundation — keep building skills' :
                   results.aptPct >= 40 ? '📚 Potential shown — focused learning needed' :
                                          '💡 Consider exploring related careers'}
                </p>
              </div>
            </div>

            <div className="results-block">
              <h3 className="results-block-title"><i className="fas fa-trophy" /> Top Career Matches</h3>
              <div className="results-careers">
                {results.topCareers.map((c, i) => (
                  <div key={c.title} className="results-career-row">
                    <span className="results-career-rank">#{i + 1}</span>
                    <span className="results-career-name">{c.title}</span>
                    <div className="results-career-bar-wrap">
                      <div className="results-career-bar" style={{ width: `${c.match}%` }} />
                    </div>
                    <span className="results-career-pct">{c.match}%</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="results-block">
              <h3 className="results-block-title"><i className="fas fa-heart" /> Your Interests</h3>
              <div className="results-interests">
                {results.interests.map(i => (
                  <span key={i.id} className="results-interest-chip">{i.icon} {i.label}</span>
                ))}
              </div>
            </div>

            <div className="results-ctas">
              <button className="results-cta-primary" onClick={() => navigate('/dashboard')}>
                <i className="fas fa-compass" /> Go to Dashboard
              </button>
              <button className="results-cta-secondary" onClick={() => {
                setPhase('interest'); setCardIndex(0); setLiked([]); setDisliked([]);
                setPqIndex(0); setPersonalityAnswers({}); setAptIndex(0); setAptScore(0); setProgress(0);
              }}>
                <i className="fas fa-rotate-left" /> Retake Assessment
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}