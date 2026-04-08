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

// ── CAREER MAPPING ───────────────────────────────────────────
function getCareerRecommendations(likedDomains, personalityAnswers) {
  const domainCount = {};
  likedDomains.forEach(d => { domainCount[d] = (domainCount[d] || 0) + 1; });

  const strength   = personalityAnswers.strength    || 'analytical';
  const teamwork   = personalityAnswers.teamwork     || 'solo';
  const risk       = personalityAnswers.risk         || 'analyze';

  const careerPool = [
    { title: 'Software Engineer',        domains: ['Technology','Engineering'],   strength: ['analytical'],         match: 0 },
    { title: 'UI/UX Designer',           domains: ['Design','Technology'],         strength: ['creative'],           match: 0 },
    { title: 'Data Scientist',           domains: ['Data','Technology','Science'], strength: ['analytical'],         match: 0 },
    { title: 'Product Manager',          domains: ['Technology','Leadership'],     strength: ['communication'],      match: 0 },
    { title: 'Content Strategist',       domains: ['Writing','Marketing'],         strength: ['communication','creative'], match: 0 },
    { title: 'ML Engineer',              domains: ['Data','Technology'],           strength: ['analytical'],         match: 0 },
    { title: 'Creative Director',        domains: ['Design','Film','Music'],       strength: ['creative'],           match: 0 },
    { title: 'Research Scientist',       domains: ['Science','Data'],              strength: ['analytical'],         match: 0 },
    { title: 'Marketing Manager',        domains: ['Marketing','Leadership'],      strength: ['communication'],      match: 0 },
    { title: 'Game Developer',           domains: ['GameDesign','Technology'],     strength: ['creative','analytical'],match: 0 },
    { title: 'Financial Analyst',        domains: ['Finance','Data'],              strength: ['analytical'],         match: 0 },
    { title: 'Educator / Trainer',       domains: ['Education','Social'],          strength: ['empathy','communication'],match: 0 },
    { title: 'Filmmaker / Director',     domains: ['Film','Design'],               strength: ['creative'],           match: 0 },
    { title: 'Music Producer',           domains: ['Music','Technology'],          strength: ['creative'],           match: 0 },
    { title: 'Entrepreneur',             domains: ['Leadership','Marketing'],      strength: ['communication'],      match: 0 },
  ];

  careerPool.forEach(career => {
    let score = 0;
    career.domains.forEach(d => { if (domainCount[d]) score += domainCount[d] * 20; });
    if (career.strength.includes(strength)) score += 25;
    if (teamwork === 'lead' && career.domains.includes('Leadership')) score += 10;
    if (risk === 'risk' && career.title === 'Entrepreneur') score += 15;
    career.match = Math.min(score, 99);
  });

  return careerPool
    .sort((a, b) => b.match - a.match)
    .slice(0, 5)
    .filter(c => c.match > 0)
    .map(c => ({ ...c, match: c.match < 50 ? 50 + Math.floor(Math.random() * 30) : c.match }));
}

// ── GPT APTITUDE QUESTION GENERATOR ─────────────────────────
async function generateAptitudeQuestions(career, interests, personality) {
  const prompt = `You are an expert aptitude test designer.
Generate exactly 10 aptitude test questions for a student interested in becoming a "${career}".

Student profile:
- Top interests: ${interests.join(', ')}
- Personality strengths: ${JSON.stringify(personality)}

Rules:
1. Every question must directly relate to the "${career}" role
2. Mix difficulty: 3 easy (10pts), 4 medium (20pts), 3 hard (30pts)
3. Each question is timed: easy=30s, medium=45s, hard=60s
4. All questions must be MCQ with exactly 4 options
5. One clearly correct answer per question
6. Test practical thinking, not just memorization

Return ONLY valid JSON in this exact format, no extra text:
{
  "questions": [
    {
      "id": 1,
      "question": "question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correct": 0,
      "difficulty": "easy",
      "points": 10,
      "time": 30,
      "skill": "skill being tested"
    }
  ]
}`;

  const res = await fetch('/api/generate-aptitude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, career, interests, personality }),
  });

  if (!res.ok) throw new Error('Failed to generate questions');
  const data = await res.json();
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
  const [phase, setPhase]   = useState('interest'); // interest|personality|career|aptitude|loading|results
  const [progress, setProgress] = useState(0);

  // Interest state
  const [cardIndex, setCardIndex]   = useState(0);
  const [liked, setLiked]           = useState([]);
  const [disliked, setDisliked]     = useState([]);

  // Personality state
  const [pqIndex, setPqIndex]           = useState(0);
  const [personalityAnswers, setPersonalityAnswers] = useState({});

  // Career state
  const [careers, setCareers]           = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);

  // Aptitude state
  const [aptQuestions, setAptQuestions] = useState([]);
  const [aptIndex, setAptIndex]         = useState(0);
  const [aptAnswers, setAptAnswers]     = useState([]);
  const [aptScore, setAptScore]         = useState(0);
  const [aptLoading, setAptLoading]     = useState(false);
  const [aptError, setAptError]         = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered]         = useState(false);

  // Results state
  const [results, setResults] = useState(null);

  // ── Interest handlers ──
  const handleLike = () => {
    const card = INTEREST_CARDS[cardIndex];
    setLiked(p => [...p, card]);
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
      setAptError('Failed to generate questions. Please try again.');
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
    const likedDomains = liked.map(c => c.domain);
    setResults({
      career:      selectedCareer,
      aptScore:    aptScore,
      aptTotal:    totalPoints,
      aptPct:      pct,
      topCareers:  careers.slice(0, 3),
      interests:   liked.slice(0, 5),
      personality: personalityAnswers,
    });
    setProgress(100);
    setPhase('results');
  };

  // ── RENDER ──────────────────────────────────────────────────
  return (
    <div className="assess-page">
      {/* Orbs */}
      <div className="assess-orb assess-orb-1" />
      <div className="assess-orb assess-orb-2" />

      {/* Header */}
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
                    {/* Ghost cards behind */}
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

            {aptError && <div className="assess-error"><i className="fas fa-triangle-exclamation" /> {aptError}</div>}

            <div className="career-grid">
              {careers.map((career, i) => (
                <button key={career.title} className={`career-card ${i === 0 ? 'career-card-top' : ''}`} onClick={() => handleCareerSelect(career)}>
                  {i === 0 && <div className="career-top-badge">🏆 Best Match</div>}
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

        {/* ── PHASE: LOADING (AI generating questions) ── */}
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
                    {/* Top bar */}
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

                    {/* Score strip */}
                    <div className="apt-score-strip">
                      <span>Score: <strong>{aptScore}</strong> pts</span>
                      <div className="apt-q-progress">
                        <div className="apt-q-progress-fill" style={{ width: `${((aptIndex) / aptQuestions.length) * 100}%` }} />
                      </div>
                    </div>

                    {/* Question */}
                    <h2 className="apt-question">{q.question}</h2>

                    {/* Options */}
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

                    {/* Next button */}
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

            {/* Aptitude score card */}
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

            {/* Top career matches */}
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

            {/* Interest summary */}
            <div className="results-block">
              <h3 className="results-block-title"><i className="fas fa-heart" /> Your Interests</h3>
              <div className="results-interests">
                {results.interests.map(i => (
                  <span key={i.id} className="results-interest-chip">{i.icon} {i.label}</span>
                ))}
              </div>
            </div>

            {/* CTAs */}
            <div className="results-ctas">
              <button className="results-cta-primary" onClick={() => navigate('/dashboard')}>
                <i className="fas fa-compass" /> Go to Dashboard
              </button>
              <button className="results-cta-secondary" onClick={() => { setPhase('interest'); setCardIndex(0); setLiked([]); setDisliked([]); setPqIndex(0); setPersonalityAnswers({}); setAptIndex(0); setAptScore(0); setProgress(0); }}>
                <i className="fas fa-rotate-left" /> Retake Assessment
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}