import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo-bg.png';

// Import JSON data
import interestsData from '../data/interests.json';
import personalityData from '../data/personality.json';
import careersData from '../data/careers.json';
import ageGroupQuestions from '../data/ageGroupQuestions.json';
import fieldSpecificQuestions from '../data/fieldSpecificQuestions.json';

// ── STEP INDICATOR ───────────────────────────────────────────
function StepIndicator({ currentStep, totalSteps, labels }) {
  return (
    <div className="flex items-center justify-center gap-0 step-indicator">
      {labels.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 z-10 ${
              i < currentStep 
                ? 'step-bubble-done text-white' 
                : i === currentStep 
                  ? 'step-bubble-active text-white' 
                  : 'step-bubble'
            }`}>
              {i < currentStep ? <i className="fas fa-check text-xs" /> : <span>{i + 1}</span>}
            </div>
            <span className={`text-xs font-medium mt-1.5 step-indicator-label ${
              i === currentStep ? 'step-active' : i < currentStep ? 'step-done' : ''
            }`}>
              {label}
            </span>
          </div>
          {i < totalSteps - 1 && (
            <div className="w-12 h-0.5 mx-1 mb-5 relative step-connector">
              <div className={`absolute inset-0 step-connector-active transition-all duration-500 ${
                i < currentStep ? 'w-full' : 'w-0'
              }`} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── INTEREST GRID SELECTOR ───────────────────────────────────
function InterestSelector({ categories, onComplete, minSelections = 5, maxSelections = 15 }) {
  const [selectedInterests, setSelectedInterests] = useState(new Set());
  const [expandedCategory, setExpandedCategory] = useState(null);

  const toggleInterest = (categoryId, itemId) => {
    const key = `${categoryId}:${itemId}`;
    const newSelected = new Set(selectedInterests);
    if (newSelected.has(key)) {
      newSelected.delete(key);
    } else if (newSelected.size < maxSelections) {
      newSelected.add(key);
    }
    setSelectedInterests(newSelected);
  };

  const isSelected = (categoryId, itemId) => {
    return selectedInterests.has(`${categoryId}:${itemId}`);
  };

  const getSelectedCount = () => selectedInterests.size;

  const handleContinue = () => {
    const selectedItems = [];
    selectedInterests.forEach(key => {
      const [categoryId, itemId] = key.split(':');
      const category = categories.find(c => c.id === categoryId);
      const item = category?.items.find(i => i.id === itemId);
      if (item) {
        selectedItems.push({
          ...item,
          categoryId,
          categoryName: category.name
        });
      }
    });
    console.log('✅ Interests selected:', selectedItems.length);
    onComplete(selectedItems);
  };

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <span className="tag-gold mb-4 inline-flex">
          <i className="fas fa-heart mr-1" /> Step 1 of 4
        </span>
        <h2 className="font-serif text-3xl md:text-4xl font-bold text-[var(--brown)] mb-3">
          What <em className="text-[var(--gold)] not-italic">interests</em> you?
        </h2>
        <p className="text-[var(--text-secondary)] mb-4">
          Select {minSelections}-{maxSelections} interests to get personalized career recommendations
        </p>
        <div className="inline-flex items-center gap-3 px-6 py-3 bg-[var(--card-bg)] rounded-full border border-[var(--border)]">
          <span className="text-sm font-medium text-[var(--text)]">
            Selected: {getSelectedCount()}
          </span>
          <div className="w-32 h-2 bg-[var(--muted)] rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--goldDark)] transition-all duration-300"
              style={{ width: `${Math.min((getSelectedCount() / minSelections) * 100, 100)}%` }}
            />
          </div>
          <span className="text-xs text-[var(--sub)]">
            {getSelectedCount() >= minSelections ? '✓ Ready!' : `${minSelections - getSelectedCount()} more needed`}
          </span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <div 
            key={category.id}
            className="bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] overflow-hidden transition-all hover:shadow-md"
          >
            <button
              onClick={() => setExpandedCategory(expandedCategory === category.id ? null : category.id)}
              className="w-full flex items-center justify-between p-4 hover:bg-[var(--card-bg-secondary)] transition-colors"
            >
              <div className="flex items-center gap-3">
                <div 
                  className="w-10 h-10 rounded-xl flex items-center justify-center"
                  style={{ backgroundColor: `${category.color}15`, color: category.color }}
                >
                  <i className={`fas ${category.icon} text-lg`} />
                </div>
                <span className="font-semibold text-[var(--text)]">{category.name}</span>
                <span className="text-xs text-[var(--sub)] ml-2">
                  ({category.items.length})
                </span>
              </div>
              <i className={`fas fa-chevron-${expandedCategory === category.id ? 'up' : 'down'} text-[var(--sub)] text-sm`} />
            </button>

            {expandedCategory === category.id && (
              <div className="p-4 pt-0 border-t border-[var(--border)]">
                <div className="flex flex-wrap gap-2 pt-4 max-h-64 overflow-y-auto">
                  {category.items.map((item) => {
                    const selected = isSelected(category.id, item.id);
                    return (
                      <button
                        key={item.id}
                        onClick={() => toggleInterest(category.id, item.id)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                          selected
                            ? 'bg-gradient-to-r from-[var(--gold)] to-[var(--goldDark)] text-white shadow-md'
                            : 'bg-[var(--card-bg-secondary)] text-[var(--text)] border border-[var(--border)] hover:border-[var(--gold)]'
                        }`}
                      >
                        <i className={`fas ${item.icon} text-xs`} />
                        {item.label}
                        {selected && <i className="fas fa-check text-xs ml-1" />}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={handleContinue}
          disabled={getSelectedCount() < minSelections}
          className={`px-8 py-3 rounded-full font-semibold transition-all ${
            getSelectedCount() >= minSelections
              ? 'btn-gold'
              : 'bg-[var(--muted)] text-[var(--sub)] cursor-not-allowed'
          }`}
        >
          {getSelectedCount() >= minSelections ? (
            <span className="flex items-center gap-2">
              Continue to Personality Test <i className="fas fa-arrow-right" />
            </span>
          ) : (
            `Select ${minSelections - getSelectedCount()} more interest${minSelections - getSelectedCount() === 1 ? '' : 's'}`
          )}
        </button>
      </div>
    </div>
  );
}

// ── PERSONALITY TEST COMPONENT ───────────────────────────────
function PersonalityTest({ traits, onComplete }) {
  const [currentTraitIndex, setCurrentTraitIndex] = useState(0);
  const [answers, setAnswers] = useState({});

  if (!traits || !Array.isArray(traits) || traits.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
          <i className="fas fa-exclamation-triangle text-2xl text-red-500" />
        </div>
        <p className="text-red-500 font-medium mb-2">No personality questions available.</p>
        <button onClick={() => onComplete({})} className="btn-gold">Skip</button>
      </div>
    );
  }

  const currentTrait = traits[currentTraitIndex];
  
  if (!currentTrait) {
    console.log('✅ Personality test complete');
    onComplete(answers);
    return null;
  }

  const progress = ((currentTraitIndex) / traits.length) * 100;

  const handleAnswer = (traitId, value) => {
    const newAnswers = { ...answers, [traitId]: value };
    setAnswers(newAnswers);
    
    if (currentTraitIndex < traits.length - 1) {
      setCurrentTraitIndex(prev => prev + 1);
    } else {
      console.log('✅ Personality test complete');
      onComplete(newAnswers);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-8">
      <div className="lg:w-80 space-y-4">
        <StepIndicator currentStep={1} totalSteps={4} labels={['Interests', 'Personality', 'Age Group', 'Aptitude']} />
        <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border)] shadow-sm">
          <span className="tag-gold mb-4 inline-flex">
            <i className="fas fa-brain mr-1" /> Step 2 of 4
          </span>
          <h1 className="font-serif text-3xl font-bold text-[var(--brown)] mb-3">
            How do you <em className="text-[var(--gold)] not-italic">think?</em>
          </h1>
          <p className="text-[var(--text-secondary)] mb-6">Choose the option that feels most natural to you.</p>
          
          <div className="space-y-2">
            <div className="h-2 bg-[var(--muted)] rounded-full">
              <div className="h-full bg-[var(--gold)] rounded-full transition-all" 
                style={{ width: `${progress}%` }} />
            </div>
            <span className="text-sm text-[var(--sub)]">
              {currentTraitIndex + 1} / {traits.length}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1">
        <div className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--border)] shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 rounded-xl bg-[var(--gold)]/10 flex items-center justify-center">
              <i className={`fas ${currentTrait.icon} text-xl text-[var(--gold)]`} />
            </div>
            <div>
              <div className="text-sm font-medium text-[var(--sub)]">Question {currentTraitIndex + 1}</div>
              <h2 className="font-serif text-xl font-bold text-[var(--brown)]">{currentTrait.question}</h2>
            </div>
          </div>
          
          <div className="space-y-3">
            {currentTrait.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(currentTrait.id, opt.value)}
                className="w-full flex items-center gap-4 p-4 bg-[var(--card-bg-secondary)] border border-[var(--border)] rounded-xl hover:border-[var(--gold)] hover:bg-[var(--gold)]/5 transition-all group"
              >
                <div className="w-10 h-10 rounded-lg bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)]">
                  <i className={`fas ${opt.icon}`} />
                </div>
                <span className="flex-1 text-left font-medium text-[var(--text)]">{opt.label}</span>
                <i className="fas fa-chevron-right text-[var(--sub)] group-hover:text-[var(--gold)] transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── AGE GROUP SELECTOR ───────────────────────────────────────
function AgeGroupSelector({ ageGroups, onComplete }) {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [openEndedValue, setOpenEndedValue] = useState('');

  const handleAgeGroupSelect = (groupId) => {
    const group = ageGroups.find(g => g.id === groupId);
    setSelectedAgeGroup(group);
    setCurrentQuestionIndex(0);
    setAnswers({});
  };

  const handleAnswer = (questionId, value) => {
    const newAnswers = { ...answers, [questionId]: value };
    setAnswers(newAnswers);
    
    const questions = selectedAgeGroup?.questions || [];
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      console.log('✅ Age group complete');
      onComplete({
        ageGroup: selectedAgeGroup.id,
        answers: newAnswers,
      });
    }
  };

  const handleOpenEndedSubmit = (questionId) => {
    if (openEndedValue.trim()) {
      handleAnswer(questionId, openEndedValue.trim());
      setOpenEndedValue('');
    }
  };

  if (!selectedAgeGroup) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <span className="tag-gold mb-4 inline-flex">
            <i className="fas fa-users mr-1" /> Step 3 of 4
          </span>
          <h2 className="font-serif text-3xl font-bold text-[var(--brown)] mb-3">
            What's your <em className="text-[var(--gold)] not-italic">age group?</em>
          </h2>
          <p className="text-[var(--text-secondary)]">This helps us tailor recommendations to your stage of life.</p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {ageGroups.map((group) => (
            <button
              key={group.id}
              onClick={() => handleAgeGroupSelect(group.id)}
              className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--border)] hover:border-[var(--gold)] hover:shadow-lg transition-all text-center group"
            >
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--gold)]/10 flex items-center justify-center group-hover:bg-[var(--gold)]/20 transition-colors">
                <i className={`fas ${group.id === '10-15' ? 'fa-child' : group.id === '15-18' ? 'fa-user-graduate' : 'fa-user'} text-2xl text-[var(--gold)]`} />
              </div>
              <h3 className="font-serif text-xl font-bold text-[var(--brown)] mb-2">{group.label}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{group.description}</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  const questions = selectedAgeGroup.questions || [];
  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    onComplete({ ageGroup: selectedAgeGroup.id, answers });
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--border)] shadow-sm">
        <div className="text-center mb-6">
          <span className="tag-gold mb-3 inline-flex">{selectedAgeGroup.label}</span>
          <h3 className="font-serif text-xl font-bold text-[var(--brown)] mb-2">
            {currentQuestion.question}
          </h3>
          {currentQuestion.type === 'multi-select' && (
            <p className="text-xs text-[var(--sub)] mt-1">
              Select up to {currentQuestion.maxSelections} options
            </p>
          )}
        </div>

        {currentQuestion.type === 'open-ended' ? (
          <div className="space-y-4">
            <textarea
              placeholder="Type your answer here..."
              className="w-full p-4 bg-[var(--card-bg-secondary)] border border-[var(--border)] rounded-xl text-[var(--text)] placeholder-[var(--sub)] resize-none"
              rows={4}
              value={openEndedValue}
              onChange={(e) => setOpenEndedValue(e.target.value)}
            />
            <button
              onClick={() => handleOpenEndedSubmit(currentQuestion.id)}
              disabled={!openEndedValue.trim()}
              className="w-full py-3 bg-[var(--gold)] text-white rounded-xl font-medium disabled:opacity-50"
            >
              Continue
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {currentQuestion.options?.map((opt) => (
              <button
                key={opt}
                onClick={() => handleAnswer(currentQuestion.id, opt)}
                className="w-full p-4 bg-[var(--card-bg-secondary)] border border-[var(--border)] rounded-xl hover:border-[var(--gold)] text-left text-[var(--text)] font-medium transition-all"
              >
                {opt}
              </button>
            ))}
          </div>
        )}

        <div className="mt-6 text-sm text-[var(--sub)] text-center">
          Question {currentQuestionIndex + 1} of {questions.length}
        </div>
      </div>
    </div>
  );
}

// ── CAREER MATCHING FUNCTION ─────────────────────────────────
function matchCareers(interests, personality, ageGroupData) {
  const careers = careersData.careers;
  
  const categoryMap = {
    'tech': 'Technology',
    'creative': 'Design',
    'business': 'Business',
    'science': 'Science',
    'humanities': 'Humanities',
    'arts': 'Arts',
  };
  
  const selectedCategories = new Set(interests.map(i => categoryMap[i.categoryId]).filter(Boolean));
  const selectedInterestIds = new Set(interests.map(i => i.id));
  
  console.log('🔍 Matching careers - Categories:', [...selectedCategories]);

  const scored = careers.map(career => {
    let score = 40;
    
    if (selectedCategories.has(career.category)) {
      score += 25;
    }
    
    const interestMatches = interests.filter(i => 
      career.required_interests?.includes(i.id)
    ).length;
    score += interestMatches * 10;
    
    if (career.personality_match) {
      Object.entries(career.personality_match).forEach(([trait, values]) => {
        if (personality[trait] && values.includes(personality[trait])) {
          score += 5;
        }
      });
    }
    
    if (ageGroupData?.ageGroup === '10-15') {
      if (['Arts', 'Design', 'Education'].includes(career.category)) score += 15;
    }
    
    return { ...career, match: Math.min(score, 98) };
  });

  return scored.sort((a, b) => b.match - a.match).slice(0, 6);
}

// ── APTITUDE TIMER ───────────────────────────────────────────
function AptitudeTimer({ seconds, onExpire }) {
  const [left, setLeft] = useState(seconds);
  
  useEffect(() => {
    setLeft(seconds);
    const t = setInterval(() => {
      setLeft(p => { if (p <= 1) { clearInterval(t); onExpire(); return 0; } return p - 1; });
    }, 1000);
    return () => clearInterval(t);
  }, [seconds, onExpire]);

  const pct = (left / seconds) * 100;
  const colorClass = pct > 50 ? 'text-green-600' : pct > 25 ? 'text-amber-600' : 'text-red-600';
  const strokeColor = pct > 50 ? '#5A7A52' : pct > 25 ? '#C8A84B' : '#C0392B';
  const r = 18;
  const circ = 2 * Math.PI * r;

  return (
    <div className="relative w-12 h-12">
      <svg viewBox="0 0 44 44" className="w-full h-full -rotate-90">
        <circle cx="22" cy="22" r={r} fill="none" stroke="#EBE5D8" strokeWidth="3" />
        <circle cx="22" cy="22" r={r} fill="none" stroke={strokeColor} strokeWidth="3"
          strokeLinecap="round" strokeDasharray={circ}
          strokeDashoffset={circ * (1 - pct / 100)}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }}
        />
      </svg>
      <span className={`absolute inset-0 flex items-center justify-center text-sm font-bold ${colorClass}`}>
        {left}s
      </span>
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────
export default function AssessmentPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const [phase, setPhase] = useState('interests');
  const [progress, setProgress] = useState(0);

  const [selectedInterests, setSelectedInterests] = useState([]);
  const [personalityAnswers, setPersonalityAnswers] = useState({});
  const [ageGroupData, setAgeGroupData] = useState(null);
  const [matchedCareers, setMatchedCareers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);

  const [aptQuestions, setAptQuestions] = useState([]);
  const [aptIndex, setAptIndex] = useState(0);
  const [aptScore, setAptScore] = useState(0);
  const [aptLoading, setAptLoading] = useState(false);
  const [aptError, setAptError] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setDarkMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    localStorage.setItem('theme', !darkMode ? 'dark' : 'light');
  };

  // ── PHASE HANDLERS ─────────────────────────────────────────
  const handleInterestsComplete = (interests) => {
    console.log('➡️ Moving to personality test');
    setSelectedInterests(interests);
    setProgress(25);
    setPhase('personality');
  };

  const handlePersonalityComplete = (answers) => {
    console.log('➡️ Moving to age group');
    setPersonalityAnswers(answers);
    setProgress(50);
    setPhase('ageGroup');
  };

  const handleAgeGroupComplete = (data) => {
    console.log('➡️ Calculating careers');
    setAgeGroupData(data);
    const careers = matchCareers(selectedInterests, personalityAnswers, data);
    console.log('✅ Matched careers:', careers.length);
    setMatchedCareers(careers);
    setProgress(75);
    setPhase('careers');
  };

  // ── API CALL FOR APTITUDE QUESTIONS (Groq only) ────────────
  const handleCareerSelect = async (career) => {
    setSelectedCareer(career);
    setAptLoading(true);
    setAptError('');
    setPhase('loading');
    
    console.log('🚀 Requesting aptitude questions from Groq for:', career.title);
    console.log('📋 Age group:', ageGroupData?.ageGroup);
    
    try {
      const ageGroup = ageGroupData?.ageGroup || '18+';
      let difficultyGuidance = '';
      
      if (ageGroup === '10-15') {
        difficultyGuidance = 'Questions should be very simple, fun, and curiosity-driven for ages 10-15. Use everyday language with no jargon. Focus on what the job does and why it matters. Make it encouraging and positive.';
      } else if (ageGroup === '15-18') {
        difficultyGuidance = 'Questions should be intermediate level for high school students (15-18 years). Mix conceptual understanding with applied thinking. Some domain vocabulary is okay but explain context.';
      } else {
        difficultyGuidance = 'Questions should be professional and domain-specific for adults (18+). Include realistic workplace scenarios and industry-standard concepts.';
      }
      
      const response = await fetch('/api/generate-aptitude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          career: career.title,
          interests: selectedInterests.map(i => i.label),
          personality: personalityAnswers,
          ageGroup: ageGroup,
          difficultyGuidance: difficultyGuidance,
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('✅ Received questions from Groq:', data.questions?.length);
      
      if (!data.questions || data.questions.length === 0) {
        throw new Error('No questions returned from API');
      }
      
      setAptQuestions(data.questions);
      setAptIndex(0);
      setAptScore(0);
      setAnswered(false);
      setSelectedOption(null);
      setProgress(85);
      setPhase('aptitude');
      
    } catch (error) {
      console.error('❌ Groq API failed:', error.message);
      setAptError(`Failed to generate questions: ${error.message}. Please try again.`);
      setPhase('careers');
    } finally {
      setAptLoading(false);
    }
  };

  const handleOptionSelect = (idx) => {
    if (answered) return;
    setSelectedOption(idx);
    setAnswered(true);
    const q = aptQuestions[aptIndex];
    if (idx === q.correct) setAptScore(p => p + q.points);
  };

  const handleNextQuestion = () => {
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
    const pct = totalPoints > 0 ? Math.round((aptScore / totalPoints) * 100) : 0;
    setResults({
      career: selectedCareer,
      aptScore, aptTotal: totalPoints, aptPct: pct,
      topCareers: matchedCareers.slice(0, 3),
      interests: selectedInterests.slice(0, 5),
      personality: personalityAnswers,
    });
    setProgress(100);
    setPhase('results');
  };

  const bestMatchIndex = matchedCareers.length > 0
    ? matchedCareers.reduce((best, c, i) => (c.match > matchedCareers[best].match ? i : best), 0) : 0;

  const diffColor = { easy: 'text-green-600', medium: 'text-amber-600', hard: 'text-red-600' };
  const verdictIcon = (pct) => pct >= 80 ? 'fa-star' : pct >= 60 ? 'fa-check-circle' : pct >= 40 ? 'fa-book' : 'fa-compass';
  const verdictText = (pct) => pct >= 80 ? 'Excellent aptitude!' : pct >= 60 ? 'Good foundation!' : pct >= 40 ? 'Potential shown!' : 'Keep exploring!';

  return (
    <div className="min-h-screen bg-[var(--cream)] relative" style={{ backgroundImage: 'var(--bg-pattern)' }}>
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Navigation */}
      <nav className="nav-glass">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="TrueNorth" className="w-8 h-8 object-contain" />
              <span className="font-serif text-2xl font-bold text-[var(--brown)]">TrueNorth</span>
              <span className="tag-gold">AI Beta</span>
            </Link>
            <div className="hidden md:flex items-center gap-6">
              <Link to="/" className="text-[var(--text-secondary)] hover:text-[var(--gold)] font-medium transition-colors">Home</Link>
              <button onClick={toggleDarkMode} className="p-2 text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors">
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`} />
              </button>
            </div>
            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-[var(--text-secondary)]">
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`} />
            </button>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      {phase !== 'results' && (
        <div className="bg-[var(--card-bg)] border-b border-[var(--border)] px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="flex-1 h-2 bg-[var(--muted)] rounded-full overflow-hidden">
              <div className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--goldDark)] transition-all duration-500"
                style={{ width: `${progress}%` }} />
            </div>
            <span className="text-sm font-semibold text-[var(--text-secondary)]">{progress}%</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          
          {phase === 'interests' && (
            <InterestSelector
              categories={interestsData.categories}
              onComplete={handleInterestsComplete}
              minSelections={interestsData.minSelections}
              maxSelections={interestsData.maxSelections}
            />
          )}

          {phase === 'personality' && (
            <PersonalityTest
              traits={personalityData.traits}
              onComplete={handlePersonalityComplete}
            />
          )}

          {phase === 'ageGroup' && (
            <AgeGroupSelector
              ageGroups={ageGroupQuestions.ageGroups}
              onComplete={handleAgeGroupComplete}
            />
          )}

          {phase === 'careers' && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <span className="tag-gold inline-flex"><i className="fas fa-star mr-1" /> Career Matches</span>
                <h1 className="font-serif text-4xl font-bold text-[var(--brown)]">
                  Your top career <em className="text-[var(--gold)] not-italic">matches</em>
                </h1>
                <p className="text-[var(--text-secondary)]">Select one to take your personalized aptitude test.</p>
                {aptError && (
                  <div className="mt-4 p-4 bg-red-500/10 text-red-500 border border-red-500/30 rounded-xl">
                    <i className="fas fa-triangle-exclamation mr-2" /> {aptError}
                  </div>
                )}
              </div>

              {matchedCareers.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-[var(--text-secondary)]">No matches found. Please try again.</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchedCareers.map((career, i) => (
                    <button key={career.id} onClick={() => handleCareerSelect(career)}
                      className={`relative bg-[var(--card-bg)] border rounded-2xl p-6 text-left transition-all hover:-translate-y-1 hover:shadow-lg ${
                        i === bestMatchIndex ? 'border-[var(--gold)] shadow-lg' : 'border-[var(--border)]'
                      }`}>
                      {i === bestMatchIndex && (
                        <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-[var(--gold)] to-[var(--goldDark)] text-white text-xs font-bold rounded-full">
                          <i className="fas fa-trophy text-xs mr-1" /> Best Match
                        </div>
                      )}
                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-serif text-xl font-bold text-[var(--brown)]">{career.title}</h3>
                        <span className="text-2xl font-bold text-[var(--gold)]">{career.match}%</span>
                      </div>
                      <div className="h-2 bg-[var(--muted)] rounded-full mb-3">
                        <div className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--goldDark)] rounded-full" 
                          style={{ width: `${career.match}%` }} />
                      </div>
                      <div className="flex flex-wrap gap-1.5 mb-4">
                        {career.skills?.slice(0, 3).map(skill => (
                          <span key={skill} className="px-2 py-0.5 bg-[var(--card-bg-secondary)] text-[var(--text-secondary)] text-xs rounded">
                            {skill}
                          </span>
                        ))}
                      </div>
                      <div className="flex items-center gap-1 text-[var(--gold)] font-medium text-sm">
                        Take aptitude test <i className="fas fa-arrow-right text-xs" />
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {phase === 'loading' && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full border-4 border-[var(--gold)] border-t-transparent animate-spin" />
              <p className="text-[var(--text-secondary)]">Generating your personalized test with AI...</p>
              <p className="text-xs text-[var(--sub)] mt-2">This may take a few seconds</p>
            </div>
          )}

          {phase === 'aptitude' && aptQuestions.length > 0 && (() => {
            const q = aptQuestions[aptIndex];
            return (
              <div className="flex flex-col lg:flex-row gap-8">
                <div className="lg:w-80 space-y-4">
                  <StepIndicator currentStep={3} totalSteps={4} labels={['Interests', 'Personality', 'Age Group', 'Aptitude']} />
                  <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border)] shadow-sm">
                    <span className="tag-gold mb-4 inline-flex">
                      <i className="fas fa-bolt mr-1" /> {selectedCareer?.title}
                    </span>
                    <h1 className="font-serif text-3xl font-bold text-[var(--brown)] mb-3">
                      Aptitude <em className="text-[var(--gold)] not-italic">Test</em>
                    </h1>
                    <p className="text-[var(--text-secondary)] mb-6">Answer before the timer runs out.</p>
                    
                    <div className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)]">
                          <i className="fas fa-star" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-[var(--brown)]">{aptScore}</div>
                          <div className="text-xs text-[var(--sub)]">Points</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)]">
                          <i className="fas fa-list-ol" />
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-[var(--brown)]">{aptIndex + 1}/{aptQuestions.length}</div>
                          <div className="text-xs text-[var(--sub)]">Question</div>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-[var(--gold)]/10 flex items-center justify-center text-[var(--gold)]">
                          <i className="fas fa-signal" />
                        </div>
                        <div>
                          <div className={`text-lg font-bold ${diffColor[q.difficulty] || 'text-amber-600'}`}>
                            {(q.difficulty || 'medium').charAt(0).toUpperCase() + (q.difficulty || 'medium').slice(1)}
                          </div>
                          <div className="text-xs text-[var(--sub)]">Difficulty</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="flex-1">
                  <div className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--border)] shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex gap-2">
                        <span className="px-3 py-1 bg-[var(--gold)]/10 text-[var(--goldDark)] text-sm font-medium rounded-full">
                          <i className="fas fa-plus mr-1" /> {q.points} pts
                        </span>
                        <span className="px-3 py-1 bg-[var(--card-bg-secondary)] text-[var(--text-secondary)] text-sm rounded-full">
                          <i className="fas fa-tag mr-1" /> {q.skill}
                        </span>
                      </div>
                      <AptitudeTimer key={aptIndex} seconds={q.time} onExpire={handleTimerExpire} />
                    </div>

                    <h2 className="font-serif text-2xl font-bold text-[var(--brown)] mb-8">{q.question}</h2>

                    <div className="space-y-3 mb-6">
                      {q.options.map((opt, idx) => {
                        let cls = 'w-full flex items-center gap-4 p-4 rounded-xl border-2 transition-all ';
                        if (answered) {
                          if (idx === q.correct) cls += 'border-green-500 bg-green-500/10 ';
                          else if (idx === selectedOption) cls += 'border-red-500 bg-red-500/10 ';
                          else cls += 'border-[var(--border)] opacity-50 ';
                        } else {
                          cls += 'border-[var(--border)] hover:border-[var(--gold)] ';
                        }
                        return (
                          <button key={idx} onClick={() => handleOptionSelect(idx)} disabled={answered} className={cls}>
                            <span className="w-8 h-8 rounded-lg bg-[var(--card-bg-secondary)] flex items-center justify-center font-semibold text-[var(--text)]">
                              {String.fromCharCode(65 + idx)}
                            </span>
                            <span className="flex-1 text-left text-[var(--text)]">{opt}</span>
                            {answered && idx === q.correct && <i className="fas fa-check text-green-600" />}
                            {answered && idx === selectedOption && idx !== q.correct && <i className="fas fa-times text-red-600" />}
                          </button>
                        );
                      })}
                    </div>

                    {answered && (
                      <button
                        onClick={handleNextQuestion}
                        className="w-full py-4 font-semibold rounded-xl transition-all flex items-center justify-center gap-2"
                        style={{
                          background: 'linear-gradient(135deg, #C8A84B 0%, #9a6f10 100%)',
                          color: 'white',
                          boxShadow: '0 4px 12px rgba(200, 168, 75, 0.2)',
                        }}
                      >
                        {aptIndex >= aptQuestions.length - 1 ? (
                          <>
                            <i className="fas fa-flag-checkered" style={{ color: 'white' }} /> See Results
                          </>
                        ) : (
                          <>
                            Next Question <i className="fas fa-arrow-right" style={{ color: 'white' }} />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {phase === 'results' && results && (
            <div className="flex flex-col lg:flex-row gap-8">
              <div className="lg:w-96 space-y-6">
                <div className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--border)] shadow-sm text-center">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--goldDark)] flex items-center justify-center">
                    <i className="fas fa-award text-3xl text-white" />
                  </div>
                  <h1 className="font-serif text-3xl font-bold text-[var(--brown)] mb-2">
                    Your Career <em className="text-[var(--gold)] not-italic">Profile</em>
                  </h1>
                  <p className="text-[var(--text-secondary)] mb-6">Based on your interests, personality & aptitude test</p>

                  <div className="relative w-36 h-36 mx-auto mb-6">
                    <svg viewBox="0 0 140 140" className="w-full h-full -rotate-90">
                      <circle cx="70" cy="70" r="58" fill="none" stroke="var(--border)" strokeWidth="8" />
                      <circle cx="70" cy="70" r="58" fill="none" stroke="var(--gold)" strokeWidth="8"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 58}
                        strokeDashoffset={2 * Math.PI * 58 * (1 - results.aptPct / 100)}
                        style={{ transition: 'stroke-dashoffset 1.5s ease-out' }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="font-serif text-3xl font-bold text-[var(--goldDark)]">{results.aptPct}%</span>
                      <span className="text-xs text-[var(--sub)]">Aptitude</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-4 bg-[var(--gold)]/5 rounded-xl mb-4">
                    <i className="fas fa-briefcase text-[var(--gold)]" />
                    <div className="text-left">
                      <div className="font-semibold text-[var(--brown)]">{results.career.title}</div>
                      <div className="text-sm text-[var(--text-secondary)]">{results.aptScore} / {results.aptTotal} pts</div>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-4 bg-[var(--card-bg-secondary)] rounded-xl mb-6">
                    <i className={`fas ${verdictIcon(results.aptPct)} text-[var(--gold)] mt-0.5`} />
                    <span className="text-sm text-[var(--text)] text-left">{verdictText(results.aptPct)}</span>
                  </div>

                  <div className="flex flex-col gap-3">
                    <button onClick={() => navigate('/dashboard')} className="btn-gold w-full py-3">
                      <i className="fas fa-compass mr-2" /> Go to Dashboard
                    </button>
                    <button
                      onClick={() => {
                        setPhase('interests');
                        setSelectedInterests([]);
                        setPersonalityAnswers({});
                        setAgeGroupData(null);
                        setMatchedCareers([]);
                        setProgress(0);
                      }}
                      className="btn-outline w-full py-3"
                    >
                      <i className="fas fa-rotate-left mr-2" /> Retake Assessment
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex-1 space-y-6">
                <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border)] shadow-sm">
                  <h3 className="font-serif text-xl font-bold text-[var(--brown)] mb-4">
                    <i className="fas fa-trophy text-[var(--gold)] mr-2" /> Top Career Matches
                  </h3>
                  <div className="space-y-3">
                    {results.topCareers.map((c, i) => (
                      <div key={c.id} className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[var(--sub)] w-8">#{i + 1}</span>
                        <span className="flex-1 font-medium text-[var(--text)]">{c.title}</span>
                        <div className="w-24 h-2 bg-[var(--muted)] rounded-full">
                          <div className="h-full bg-[var(--gold)] rounded-full" style={{ width: `${c.match}%` }} />
                        </div>
                        <span className="text-sm font-semibold text-[var(--goldDark)] w-12">{c.match}%</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border)] shadow-sm">
                  <h3 className="font-serif text-xl font-bold text-[var(--brown)] mb-4">
                    <i className="fas fa-heart text-red-500 mr-2" /> Selected Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {results.interests.map(item => (
                      <span key={item.id} className="px-3 py-1.5 bg-[var(--gold)]/10 text-[var(--goldDark)] text-sm rounded-full flex items-center gap-1.5">
                        <i className={`fas ${item.icon}`} /> {item.label}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-[var(--card-bg)] rounded-2xl p-6 border border-[var(--border)] shadow-sm">
                  <h3 className="font-serif text-xl font-bold text-[var(--brown)] mb-4">
                    <i className="fas fa-user-circle text-blue-500 mr-2" /> Personality Summary
                  </h3>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(results.personality).slice(0, 6).map(([trait, value]) => (
                      <div key={trait} className="flex items-center justify-between p-3 bg-[var(--card-bg-secondary)] rounded-lg">
                        <span className="text-sm font-medium text-[var(--text-secondary)] capitalize">
                          {trait.replace(/_/g, ' ')}
                        </span>
                        <span className="text-sm font-semibold text-[var(--text)] capitalize">{value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}