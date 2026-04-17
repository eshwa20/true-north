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

// ── INTEREST GRID SELECTOR (Modern alternative to swipe cards) ──
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
                <div className="flex flex-wrap gap-2 pt-4 max-h-64 overflow-y-auto custom-scroll">
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

  const currentTrait = traits[currentTraitIndex];
  const progress = ((currentTraitIndex) / traits.length) * 100;

  const handleAnswer = (traitId, value) => {
    const newAnswers = { ...answers, [traitId]: value };
    setAnswers(newAnswers);
    
    if (currentTraitIndex < traits.length - 1) {
      setCurrentTraitIndex(currentTraitIndex + 1);
    } else {
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
// ── AGE GROUP SELECTOR (FIXED) ───────────────────────────────────────
function AgeGroupSelector({ ageGroups, onComplete }) {
  const [selectedAgeGroup, setSelectedAgeGroup] = useState(null);
  const [answers, setAnswers] = useState({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [fieldSpecificAnswers, setFieldSpecificAnswers] = useState({});
  const [showFieldSpecific, setShowFieldSpecific] = useState(false);
  const [fieldQuestionIndex, setFieldQuestionIndex] = useState(0);
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
    
    // For 10-15 age group, capture dream job and hobbies
    if (selectedAgeGroup.id === '10-15') {
      if (questionId === 'dream_job') {
        console.log('🎯 Dream job:', value);
      }
      if (questionId === 'hobbies') {
        console.log('🎨 Hobbies:', value);
      }
    }
    
    // Move to next question or complete
    if (selectedAgeGroup.questions && currentQuestionIndex < selectedAgeGroup.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // All age group questions completed
      const currentField = newAnswers['current_field'] || value;
      
      // Check if we need field-specific questions for 18+
      if (selectedAgeGroup.id === '18+' && currentField && fieldSpecificQuestions[currentField]) {
        setShowFieldSpecific(true);
        setFieldQuestionIndex(0);
      } else {
        // Complete the age group phase
        console.log('✅ Age group complete, sending data:', {
          ageGroup: selectedAgeGroup.id,
          answers: newAnswers
        });
        onComplete({
          ageGroup: selectedAgeGroup.id,
          answers: newAnswers,
          fieldSpecificAnswers: {}
        });
      }
    }
  };

  const handleFieldSpecificAnswer = (questionId, value) => {
    const field = answers['current_field'];
    const questions = fieldSpecificQuestions[field]?.questions || [];
    const newAnswers = { ...fieldSpecificAnswers, [questionId]: value };
    setFieldSpecificAnswers(newAnswers);
    
    if (fieldQuestionIndex < questions.length - 1) {
      setFieldQuestionIndex(fieldQuestionIndex + 1);
    } else {
      console.log('✅ Field-specific complete, sending data');
      onComplete({
        ageGroup: selectedAgeGroup.id,
        answers: answers,
        fieldSpecificAnswers: newAnswers
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

  // Field-specific questions for 18+
  if (showFieldSpecific) {
    const field = answers['current_field'];
    const questions = fieldSpecificQuestions[field]?.questions || [];
    
    if (questions.length === 0) {
      // No field-specific questions, complete
      onComplete({
        ageGroup: selectedAgeGroup.id,
        answers: answers,
        fieldSpecificAnswers: {}
      });
      return null;
    }
    
    const currentQuestion = questions[fieldQuestionIndex];
    
    if (!currentQuestion) {
      // All questions answered
      onComplete({
        ageGroup: selectedAgeGroup.id,
        answers: answers,
        fieldSpecificAnswers: fieldSpecificAnswers
      });
      return null;
    }
    
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-[var(--card-bg)] rounded-2xl p-8 border border-[var(--border)] shadow-sm">
          <div className="text-center mb-6">
            <span className="tag-gold mb-3 inline-flex">{field}</span>
            <h3 className="font-serif text-xl font-bold text-[var(--brown)] mb-2">
              {currentQuestion.question}
            </h3>
          </div>

          <div className="space-y-3">
            {currentQuestion.options?.map((opt) => (
              <button
                key={opt}
                onClick={() => handleFieldSpecificAnswer(currentQuestion.id, opt)}
                className="w-full p-4 bg-[var(--card-bg-secondary)] border border-[var(--border)] rounded-xl hover:border-[var(--gold)] text-left text-[var(--text)] font-medium transition-all"
              >
                {opt}
              </button>
            ))}
          </div>

          <div className="mt-6 text-sm text-[var(--sub)] text-center">
            Question {fieldQuestionIndex + 1} of {questions.length}
          </div>
        </div>
      </div>
    );
  }

  // Age-specific questions
  const questions = selectedAgeGroup.questions || [];
  
  if (questions.length === 0 || currentQuestionIndex >= questions.length) {
    // No questions, complete immediately
    console.log('⚠️ No questions for this age group, completing');
    onComplete({
      ageGroup: selectedAgeGroup.id,
      answers: answers,
      fieldSpecificAnswers: {}
    });
    return null;
  }
  
  const currentQuestion = questions[currentQuestionIndex];
  
  if (!currentQuestion) {
    console.log('⚠️ No current question, completing');
    onComplete({
      ageGroup: selectedAgeGroup.id,
      answers: answers,
      fieldSpecificAnswers: {}
    });
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
              className="w-full py-3 bg-[var(--gold)] text-white rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed"
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

// ── CAREER MATCHING FUNCTION ─────────────────────────
// Maps interest categoryIds → career categories
const INTEREST_TO_CAREER_CATEGORY = {
  'tech': ['Technology'],
  'creative': ['Design'],
  'business': ['Business'],
  'science': ['Science'],
  'humanities': ['Humanities'],
  'arts': ['Arts'],
};

function matchCareers(interests, personality, ageGroupData) {
  const careers = careersData.careers;

  const selectedCategories = new Set(interests.map(i => i.categoryId));
  const selectedInterestIds = new Set(interests.map(i => i.id));

  const scored = careers.map(career => {
    let score = 0;
    let maxPossibleScore = 0;

    // ── 1. INTEREST MATCHING (up to 55 pts) ──────────────
    // Category match: check if any of the user's interest categories map to this career's category
    const careerMatchesCategory = Object.entries(INTEREST_TO_CAREER_CATEGORY).some(
      ([catId, careerCats]) =>
        selectedCategories.has(catId) && careerCats.includes(career.category)
    );
    if (careerMatchesCategory) score += 25;
    maxPossibleScore += 25;

    // Specific interest match (15 pts per matching interest, up to 30)
    const interestMatchCount = interests.filter(interest =>
      career.required_interests?.includes(interest.id)
    ).length;
    score += Math.min(interestMatchCount * 15, 30);
    maxPossibleScore += 30;

    // ── 2. PERSONALITY MATCHING (up to 10 pts per trait) ──
    if (career.personality_match) {
      let personalityScore = 0;
      let personalityMax = 0;

      Object.entries(career.personality_match).forEach(([trait, preferredValues]) => {
        personalityMax += 10;
        if (personality[trait] && preferredValues.includes(personality[trait])) {
          personalityScore += 10;
        }
      });

      score += personalityScore;
      maxPossibleScore += personalityMax;
    }

    // ── 3. AGE GROUP ADJUSTMENTS (up to 35 pts) ──────────
    if (ageGroupData?.ageGroup) {
      let ageGroupBonus = 0;

      if (ageGroupData.ageGroup === '10-15') {
        // For younger students, boost careers that match their stated interests.
        // Do NOT globally penalize any category — let interests drive results.
        const answers = ageGroupData.answers || {};
        const hobbies = answers.hobbies || [];
        const subjects = answers.school_subjects || [];
        const dreamJob = (answers.dream_job || '').toLowerCase();

        // Boost based on hobbies
        if ((hobbies.includes('Drawing/Painting') || hobbies.includes('Coding')) &&
            ['Design', 'Technology'].includes(career.category)) ageGroupBonus += 20;
        if ((hobbies.includes('Reading') || hobbies.includes('Cooking/Baking')) &&
            ['Humanities', 'Arts'].includes(career.category)) ageGroupBonus += 15;
        if (hobbies.includes('Playing music') && career.category === 'Arts') ageGroupBonus += 20;
        if (hobbies.includes('Building things') && ['Technology', 'Design'].includes(career.category)) ageGroupBonus += 15;
        if (hobbies.includes('Video games') && career.category === 'Arts') ageGroupBonus += 10;

        // Boost based on school subjects
        if ((subjects.includes('Mathematics') || subjects.includes('Computer Studies')) &&
            career.category === 'Technology') ageGroupBonus += 15;
        if ((subjects.includes('Science')) && career.category === 'Science') ageGroupBonus += 15;
        if ((subjects.includes('Art') || subjects.includes('Music')) &&
            ['Arts', 'Design'].includes(career.category)) ageGroupBonus += 15;
        if ((subjects.includes('English/Literature') || subjects.includes('History')) &&
            career.category === 'Humanities') ageGroupBonus += 15;

        // Dream job keyword matching
        if (dreamJob) {
          if (/art|draw|design|paint|fashion/.test(dreamJob) && ['Arts', 'Design'].includes(career.category)) ageGroupBonus += 15;
          if (/code|tech|software|game|computer/.test(dreamJob) && career.category === 'Technology') ageGroupBonus += 15;
          if (/doctor|nurse|scientist|research/.test(dreamJob) && career.category === 'Science') ageGroupBonus += 15;
          if (/music|sing|act|cook|chef|write|author/.test(dreamJob) && career.category === 'Arts') ageGroupBonus += 15;
          if (/teach|lawyer|psych|counsel|journal/.test(dreamJob) && career.category === 'Humanities') ageGroupBonus += 15;
          if (/business|market|manage|lead|start/.test(dreamJob) && career.category === 'Business') ageGroupBonus += 15;
        }

        // Cap bonus at 35
        ageGroupBonus = Math.min(ageGroupBonus, 35);

      } else if (ageGroupData.ageGroup === '15-18') {
        const stream = ageGroupData.answers?.stream || '';
        const higherEd = ageGroupData.answers?.higher_education || '';

        if (stream.includes('Science (PCM)') && ['Technology', 'Science'].includes(career.category)) ageGroupBonus += 25;
        else if (stream.includes('Science (PCB)') && career.category === 'Science') ageGroupBonus += 25;
        else if (stream.includes('Commerce') && career.category === 'Business') ageGroupBonus += 25;
        else if (stream.includes('Humanities') && ['Humanities', 'Arts'].includes(career.category)) ageGroupBonus += 25;
        else if (stream.includes('Vocational') && ['Design', 'Arts'].includes(career.category)) ageGroupBonus += 20;

        if (higherEd === 'Design' && career.category === 'Design') ageGroupBonus += 15;
        else if (higherEd === 'Engineering' && career.category === 'Technology') ageGroupBonus += 15;
        else if (higherEd === 'Medical' && career.category === 'Science') ageGroupBonus += 15;
        else if (higherEd === 'Business Management' && career.category === 'Business') ageGroupBonus += 15;
        else if (higherEd === 'Arts & Humanities' && ['Humanities', 'Arts'].includes(career.category)) ageGroupBonus += 15;
        else if (higherEd === 'Law' && career.id === 'lawyer') ageGroupBonus += 20;
        else if (higherEd === 'Pure Sciences' && career.category === 'Science') ageGroupBonus += 15;

        ageGroupBonus = Math.min(ageGroupBonus, 35);

      } else if (ageGroupData.ageGroup === '18+') {
        const currentField = ageGroupData.answers?.current_field || '';
        const goal = ageGroupData.answers?.career_goal || '';

        // Map the field dropdown values to career categories
        const fieldCategoryMap = {
          'Technology & IT': 'Technology',
          'Business & Finance': 'Business',
          'Healthcare & Medicine': 'Science',
          'Education': 'Humanities',
          'Engineering': 'Technology',
          'Arts & Design': 'Design',
          'Science & Research': 'Science',
          'Law': 'Humanities',
          'Marketing & Sales': 'Business',
        };

        const mappedCategory = fieldCategoryMap[currentField];

        if (mappedCategory && career.category === mappedCategory) ageGroupBonus += 30;

        if (goal === 'Switch to a new field' && career.category !== mappedCategory) ageGroupBonus += 10;
        else if (goal === 'Advance in current field' && career.category === mappedCategory) ageGroupBonus += 15;
        else if (goal === 'Start my own business' && career.category === 'Business') ageGroupBonus += 10;
        else if (goal === 'Specialize in a niche' && career.category === mappedCategory) ageGroupBonus += 12;

        ageGroupBonus = Math.min(ageGroupBonus, 35);
      }

      score += ageGroupBonus;
      maxPossibleScore += 35;
    }

    // Calculate match percentage
    const matchPercentage = maxPossibleScore > 0
      ? Math.round((score / maxPossibleScore) * 100)
      : 40;

    // Clamp to 35–98%
    const finalMatch = Math.min(Math.max(matchPercentage, 35), 98);

    return { ...career, match: finalMatch };
  });

  // Sort and return top 6
  return scored
    .sort((a, b) => b.match - a.match)
    .slice(0, 6);
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
          strokeLinecap="round"
          strokeDasharray={circ}
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

// ── API CALL WITH AGE-BASED DIFFICULTY ───────────────────────
async function generateAptitudeQuestions(career, interests, personality, ageGroupData) {
  const ageGroup = ageGroupData?.ageGroup || '18+';

  // Difficulty distribution and guidance per age group
  const ageConfig = {
    '10-15': {
      distribution: { easy: 7, medium: 3, hard: 0 },
      guidance: 'Questions should be very simple, fun, and curiosity-driven for ages 10-15. Use everyday language with no jargon. Focus on what the job does, why it matters, and basic soft skills like creativity and teamwork. Avoid technical or industry-specific terms.',
    },
    '15-18': {
      distribution: { easy: 3, medium: 5, hard: 2 },
      guidance: 'Questions should be intermediate level for high school students (15-18 years). Use subject-area knowledge they might have studied. Mix conceptual understanding with some applied thinking. Some domain-specific vocabulary is okay but explain context in the question.',
    },
    '18+': {
      distribution: { easy: 2, medium: 4, hard: 4 },
      guidance: 'Questions should be professional and domain-specific for adults (18+). Include realistic workplace scenarios, industry-standard concepts, and decision-making under pressure. Questions should reflect actual on-the-job challenges.',
    },
  };

  const config = ageConfig[ageGroup] || ageConfig['18+'];

  try {
    const res = await fetch('/api/generate-aptitude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        career,
        interests: interests.map(i => i.label),
        personality,
        ageGroup,
        difficultyDistribution: config.distribution,
        difficultyGuidance: config.guidance,
      }),
    });

    if (!res.ok) throw new Error('Failed to generate questions');

    const data = await res.json();
    return data.questions;
  } catch (error) {
    return generateMockQuestions(career, ageGroup);
  }
}

// Mock questions generator with age-appropriate difficulty
function generateMockQuestions(career, ageGroup) {
  const baseQuestions = {
    '10-15': [
      {
        id: 1,
        question: `What is the most important quality for a ${career}?`,
        options: ['Being creative', 'Working hard', 'Helping others', 'All of these'],
        correct: 3,
        difficulty: 'easy',
        points: 10,
        time: 45,
        skill: 'General Knowledge'
      },
      {
        id: 2,
        question: `Which of these might a ${career} do at work?`,
        options: ['Solve problems', 'Take naps', 'Watch movies', 'Play games'],
        correct: 0,
        difficulty: 'easy',
        points: 10,
        time: 45,
        skill: 'Job Understanding'
      },
      {
        id: 3,
        question: `What subject in school would help you become a ${career}?`,
        options: ['Math', 'Art', 'Science', 'Any subject you enjoy'],
        correct: 3,
        difficulty: 'easy',
        points: 10,
        time: 45,
        skill: 'Education'
      },
      {
        id: 4,
        question: `Why is teamwork important for a ${career}?`,
        options: ['To make friends', 'To get better results', 'Because the teacher said so', 'To avoid working alone'],
        correct: 1,
        difficulty: 'easy',
        points: 10,
        time: 45,
        skill: 'Soft Skills'
      },
      {
        id: 5,
        question: `What should you do if you make a mistake as a ${career}?`,
        options: ['Hide it', 'Blame someone else', 'Learn from it and fix it', 'Quit'],
        correct: 2,
        difficulty: 'easy',
        points: 10,
        time: 45,
        skill: 'Professionalism'
      }
    ],
    '15-18': [
      {
        id: 1,
        question: `What is a key skill needed for a ${career}?`,
        options: ['Problem-solving', 'Communication', 'Technical knowledge', 'All of the above'],
        correct: 3,
        difficulty: 'easy',
        points: 10,
        time: 35,
        skill: 'Career Skills'
      },
      {
        id: 2,
        question: `Which education path is most common for a ${career}?`,
        options: ['Bachelor\'s Degree', 'Bootcamp/Certification', 'Self-taught', 'All are valid paths'],
        correct: 3,
        difficulty: 'medium',
        points: 20,
        time: 45,
        skill: 'Career Planning'
      },
      {
        id: 3,
        question: `What is the best way to prepare for a career as a ${career}?`,
        options: ['Build a portfolio', 'Network with professionals', 'Gain internship experience', 'All of the above'],
        correct: 3,
        difficulty: 'medium',
        points: 20,
        time: 45,
        skill: 'Career Preparation'
      },
      {
        id: 4,
        question: `What is a common challenge faced by ${career}s?`,
        options: ['Keeping up with trends', 'Work-life balance', 'Meeting deadlines', 'All of the above'],
        correct: 3,
        difficulty: 'medium',
        points: 20,
        time: 45,
        skill: 'Industry Knowledge'
      }
    ],
    '18+': [
      {
        id: 1,
        question: `What is the primary responsibility of a ${career}?`,
        options: ['Delivering high-quality work', 'Managing stakeholders', 'Continuous learning', 'All of the above'],
        correct: 3,
        difficulty: 'medium',
        points: 20,
        time: 30,
        skill: 'Professional Knowledge'
      },
      {
        id: 2,
        question: `What distinguishes an exceptional ${career} from an average one?`,
        options: ['Technical expertise', 'Business acumen', 'Communication skills', 'All of the above'],
        correct: 3,
        difficulty: 'hard',
        points: 30,
        time: 60,
        skill: 'Career Excellence'
      }
    ]
  };
  
  const questions = baseQuestions[ageGroup] || baseQuestions['18+'];
  
  // Pad with more questions if needed to reach 10
  while (questions.length < 10) {
    const questionNumber = questions.length + 1;
    let difficulty = 'medium';
    let points = 20;
    let time = 45;
    
    if (questionNumber <= 4) {
      difficulty = 'easy';
      points = 10;
      time = 35;
    } else if (questionNumber <= 7) {
      difficulty = 'medium';
      points = 20;
      time = 45;
    } else {
      difficulty = 'hard';
      points = 30;
      time = 60;
    }
    
    questions.push({
      id: questionNumber,
      question: `What is important for success as a ${career}? (Question ${questionNumber})`,
      options: ['Technical skills', 'Soft skills', 'Experience', 'All of these'],
      correct: 3,
      difficulty: difficulty,
      points: points,
      time: time,
      skill: `Career Success ${questionNumber}`
    });
  }
  
  return questions.slice(0, 10);
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

  const handleInterestsComplete = (interests) => {
    setSelectedInterests(interests);
    setProgress(25);
    setPhase('personality');
  };

  const handlePersonalityComplete = (answers) => {
    setPersonalityAnswers(answers);
    setProgress(50);
    setPhase('ageGroup');
  };

  const handleAgeGroupComplete = (data) => {
    console.log('📋 Age group data received:', data);
    setAgeGroupData(data);
    
    if (selectedInterests.length === 0) {
      console.warn('⚠️ No interests selected!');
      // Use default interests if none selected
      const defaultInterests = interestsData.categories.flatMap(c => 
        c.items.slice(0, 2).map(i => ({ ...i, categoryId: c.id, categoryName: c.name }))
      );
      setSelectedInterests(defaultInterests);
    }
    
    if (Object.keys(personalityAnswers).length === 0) {
      console.warn('⚠️ No personality answers! Using defaults');
      // Use default personality
      const defaultPersonality = {};
      personalityData.traits.forEach(t => {
        defaultPersonality[t.id] = t.options[0].value;
      });
      setPersonalityAnswers(defaultPersonality);
    }
    
    // Force a small delay to ensure state is updated
    setTimeout(() => {
      const careers = matchCareers(
        selectedInterests.length > 0 ? selectedInterests : interestsData.categories.flatMap(c => 
          c.items.slice(0, 2).map(i => ({ ...i, categoryId: c.id, categoryName: c.name }))
        ),
        Object.keys(personalityAnswers).length > 0 ? personalityAnswers : (() => {
          const p = {};
          personalityData.traits.forEach(t => { p[t.id] = t.options[0].value; });
          return p;
        })(),
        data
      );
      console.log('🎯 Setting matched careers:', careers.length);
      setMatchedCareers(careers);
      setProgress(75);
      setPhase('careers');
    }, 100);
  };

  const handleCareerSelect = async (career) => {
    setSelectedCareer(career);
    setAptLoading(true);
    setAptError('');
    setPhase('loading');
    
    try {
      const questions = await generateAptitudeQuestions(
        career.title,
        selectedInterests,
        personalityAnswers,
        ageGroupData
      );
      setAptQuestions(questions);
      setAptIndex(0);
      setAptScore(0);
      setAnswered(false);
      setSelectedOption(null);
      setProgress(85);
      setPhase('aptitude');
    } catch (e) {
      setAptError(`Failed to generate questions: ${e.message}`);
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
      aptScore,
      aptTotal: totalPoints,
      aptPct: pct,
      topCareers: matchedCareers.slice(0, 3),
      interests: selectedInterests.slice(0, 5),
      personality: personalityAnswers,
    });
    setProgress(100);
    setPhase('results');
  };

  const bestMatchIndex = matchedCareers.length > 0
    ? matchedCareers.reduce((best, c, i) => (c.match > matchedCareers[best].match ? i : best), 0)
    : 0;

  const diffColor = { easy: 'text-green-600', medium: 'text-amber-600', hard: 'text-red-600' };
  const verdictIcon = (pct) => pct >= 80 ? 'fa-star' : pct >= 60 ? 'fa-check-circle' : pct >= 40 ? 'fa-book' : 'fa-compass';
  const verdictText = (pct) => pct >= 80 ? 'Excellent aptitude for this career!' : pct >= 60 ? 'Good foundation — keep building skills' : pct >= 40 ? 'Potential shown — focused learning needed' : 'Consider exploring related careers';

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
              <Link to="/dashboard" className="text-[var(--text-secondary)] hover:text-[var(--gold)] font-medium transition-colors">Dashboard</Link>
              <button onClick={toggleDarkMode} className="p-2 text-[var(--text-secondary)] hover:text-[var(--gold)] transition-colors">
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`} />
              </button>
              <div className="w-px h-6 bg-[var(--border)]" />
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[var(--gold)] to-[var(--goldDark)] flex items-center justify-center text-white">
                  <i className="fas fa-user text-sm" />
                </div>
                <span className="text-sm font-medium text-[var(--text)]">Guest</span>
              </div>
            </div>

            <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="md:hidden p-2 text-[var(--text-secondary)]">
              <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`} />
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-[var(--border)] space-y-2">
              <Link to="/" className="block px-4 py-2 text-[var(--text)] hover:bg-[var(--parchment)] rounded-lg">Home</Link>
              <Link to="/dashboard" className="block px-4 py-2 text-[var(--text)] hover:bg-[var(--parchment)] rounded-lg">Dashboard</Link>
              <button onClick={toggleDarkMode} className="w-full text-left px-4 py-2 text-[var(--text)] hover:bg-[var(--parchment)] rounded-lg">
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} mr-2`} />
                {darkMode ? 'Light Mode' : 'Dark Mode'}
              </button>
            </div>
          )}
        </div>
      </nav>

      {/* Progress Bar */}
      {phase !== 'results' && (
        <div className="bg-[var(--card-bg)] border-b border-[var(--border)] px-6 py-3">
          <div className="max-w-7xl mx-auto flex items-center gap-4">
            <div className="flex-1 h-2 bg-[var(--muted)] rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-[var(--gold)] to-[var(--goldDark)] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-sm font-semibold text-[var(--text-secondary)]">{progress}%</span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-6xl">
          
          {/* Interests Phase */}
          {phase === 'interests' && (
            <InterestSelector
              categories={interestsData.categories}
              onComplete={handleInterestsComplete}
              minSelections={interestsData.minSelections}
              maxSelections={interestsData.maxSelections}
            />
          )}

          {/* Personality Phase */}
          {phase === 'personality' && (
            <PersonalityTest
              traits={personalityData.traits}
              onComplete={handlePersonalityComplete}
            />
          )}

          {/* Age Group Phase */}
          {phase === 'ageGroup' && (
            <AgeGroupSelector
              ageGroups={ageGroupQuestions.ageGroups}
              onComplete={handleAgeGroupComplete}
            />
          )}

          {/* Careers Phase */}
          {phase === 'careers' && (
            <div className="space-y-6">
              <div className="text-center space-y-3">
                <span className="tag-gold inline-flex">
                  <i className="fas fa-star mr-1" /> Career Matches
                </span>
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
                  <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-[var(--gold)]/10 flex items-center justify-center">
                    <i className="fas fa-spinner fa-spin text-2xl text-[var(--gold)]" />
                  </div>
                  <p className="text-[var(--text-secondary)]">Finding your perfect career matches...</p>
                </div>
              ) : (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {matchedCareers.map((career, i) => (
                    <button
                      key={career.id}
                      onClick={() => handleCareerSelect(career)}
                      className={`relative bg-[var(--card-bg)] border rounded-2xl p-6 text-left transition-all hover:-translate-y-1 hover:shadow-lg ${
                        i === bestMatchIndex 
                          ? 'border-[var(--gold)] shadow-lg shadow-[var(--gold)]/10' 
                          : 'border-[var(--border)]'
                      }`}
                    >
                      {i === bestMatchIndex && (
                        <div className="absolute -top-3 left-4 px-3 py-1 bg-gradient-to-r from-[var(--gold)] to-[var(--goldDark)] text-white text-xs font-bold rounded-full flex items-center gap-1">
                          <i className="fas fa-trophy text-xs" /> Best Match
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

          {/* Loading Phase */}
          {phase === 'loading' && (
            <div className="text-center py-12">
              <div className="relative w-24 h-24 mx-auto mb-6">
                <div className="absolute inset-0 border-4 border-[var(--gold)]/20 rounded-full animate-ping" />
                <div className="absolute inset-0 border-4 border-[var(--gold)] border-t-transparent rounded-full animate-spin" />
                <div className="absolute inset-3 bg-[var(--card-bg)] rounded-full flex items-center justify-center">
                  <i className="fas fa-compass text-2xl text-[var(--gold)]" />
                </div>
              </div>
              <h2 className="font-serif text-2xl font-bold text-[var(--brown)] mb-2">Crafting your test…</h2>
              <p className="text-[var(--text-secondary)] mb-6">
                Building questions tailored to <strong>{selectedCareer?.title}</strong>
              </p>
            </div>
          )}

          {/* Aptitude Phase */}
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
                          <div className={`text-lg font-bold ${diffColor[q.difficulty]}`}>
                            {q.difficulty.charAt(0).toUpperCase() + q.difficulty.slice(1)}
                          </div>
                          <div className="text-xs text-[var(--sub)]">Difficulty</div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-[var(--border)]">
                      <div className="h-2 bg-[var(--muted)] rounded-full">
                        <div className="h-full bg-[var(--gold)] rounded-full transition-all" 
                          style={{ width: `${(aptIndex / aptQuestions.length) * 100}%` }} />
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
                        } else if (idx === selectedOption) {
                          cls += 'border-[var(--gold)] bg-[var(--gold)]/5 ';
                        } else {
                          cls += 'border-[var(--border)] hover:border-[var(--gold)] ';
                        }
                        
                        return (
                          <button
                            key={idx}
                            onClick={() => handleOptionSelect(idx)}
                            disabled={answered}
                            className={cls}
                          >
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
                        className="w-full py-3.5 bg-gradient-to-r from-[var(--gold)] to-[var(--goldDark)] text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                      >
                        {aptIndex >= aptQuestions.length - 1 ? (
                          <span className="flex items-center justify-center gap-2">
                            <i className="fas fa-flag-checkered" /> See Results
                          </span>
                        ) : (
                          <span className="flex items-center justify-center gap-2">
                            Next Question <i className="fas fa-arrow-right" />
                          </span>
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })()}

          {/* Results Phase */}
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
                    <button
                      onClick={() => navigate('/dashboard')}
                      className="btn-gold w-full py-3"
                    >
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
                  <h3 className="font-serif text-xl font-bold text-[var(--brown)] mb-4 flex items-center gap-2">
                    <i className="fas fa-trophy text-[var(--gold)]" /> Top Career Matches
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
                  <h3 className="font-serif text-xl font-bold text-[var(--brown)] mb-4 flex items-center gap-2">
                    <i className="fas fa-heart text-red-500" /> Selected Interests
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
                  <h3 className="font-serif text-xl font-bold text-[var(--brown)] mb-4 flex items-center gap-2">
                    <i className="fas fa-user-circle text-blue-500" /> Personality Summary
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