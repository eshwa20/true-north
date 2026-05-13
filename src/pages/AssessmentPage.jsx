import { useState, useEffect, useCallback, useRef, useMemo } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import logo from '../assets/logo-bg.png';
import logoWhite from '../assets/logo-bg-white.png';
import allCareers from '../data/all-careers.json';

// ── STEP INDICATOR ───────────────────────────────────────────
function StepIndicator({ currentStep, totalSteps, labels }) {
  return (
    <div className="flex items-center justify-center gap-0 flex-wrap">
      {labels.map((label, i) => (
        <div key={i} className="flex items-center">
          <div className="flex flex-col items-center">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 ${
              i < currentStep ? 'step-bubble-done' : i === currentStep ? 'step-bubble-active' : 'step-bubble'
            }`}>
              {i < currentStep
                ? <i className="fas fa-check text-white text-xs" />
                : <span style={{ color: i === currentStep ? 'white' : 'var(--text)' }}>{i + 1}</span>}
            </div>
            <span className="text-xs font-medium mt-1.5 whitespace-nowrap hidden sm:block" style={{
              color: i === currentStep ? 'var(--brown)' : i < currentStep ? 'var(--text-secondary)' : 'var(--sub)',
              fontWeight: i === currentStep ? 600 : 500,
            }}>{label}</span>
          </div>
          {i < totalSteps - 1 && (
            <div className="w-8 sm:w-12 h-0.5 mx-1 mb-4 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
              <div className="h-full rounded-full transition-all duration-500" style={{ width: i < currentStep ? '100%' : '0%', background: '#5A7A52' }} />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

// ── LOADING SPINNER ──────────────────────────────────────────
function LoadingSpinner({ message, subtext }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 gap-5">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 animate-spin" style={{ borderColor: 'rgba(200,168,75,0.2)', borderTopColor: 'var(--gold)' }} />
        <div className="absolute inset-0 flex items-center justify-center">
          <i className="fas fa-sparkles text-sm animate-pulse" style={{ color: 'var(--gold)' }} />
        </div>
      </div>
      <p className="font-semibold text-lg" style={{ color: 'var(--text)' }}>{message}</p>
      {subtext && <p className="text-sm" style={{ color: 'var(--sub)' }}>{subtext}</p>}
    </div>
  );
}

// ── ERROR DISPLAY ────────────────────────────────────────────
function ErrorDisplay({ message, detail, onRetry, onSkip }) {
  return (
    <div className="text-center py-16 max-w-sm mx-auto">
      <div className="w-16 h-16 mx-auto mb-5 rounded-2xl flex items-center justify-center border" style={{ background: 'rgba(239,68,68,0.1)', borderColor: 'rgba(239,68,68,0.2)' }}>
        <i className="fas fa-exclamation-triangle text-2xl" style={{ color: '#ef4444' }} />
      </div>
      <p className="font-semibold text-lg mb-2" style={{ color: 'var(--text)' }}>{message}</p>
      {detail && <p className="text-sm mb-6" style={{ color: 'var(--text-secondary)' }}>{detail}</p>}
      <div className="flex gap-3 justify-center">
        {onRetry && <button onClick={onRetry} className="btn-gold text-base"><i className="fas fa-redo mr-2" style={{ color: 'white' }} />Retry</button>}
        {onSkip && <button onClick={onSkip} className="btn-outline text-base" style={{ color: 'var(--text)', borderColor: 'var(--border)' }}><i className="fas fa-forward mr-2" style={{ color: 'var(--text)' }} />Skip</button>}
      </div>
    </div>
  );
}

// ── STYLED SELECT ────────────────────────────────────────────
function StyledSelect({ value, onChange, options, icon }) {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setIsOpen(false); };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);
  const selected = options.find(o => o.value === value) || options[0];
  return (
    <div ref={ref} className="relative" style={{ minWidth: '160px' }}>
      <button onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-medium transition-all hover:shadow-sm"
        style={{ background: 'var(--card-bg)', borderColor: isOpen ? 'var(--gold)' : 'var(--border)', color: 'var(--text)', boxShadow: isOpen ? '0 0 0 3px rgba(200,168,75,0.1)' : undefined }}>
        {icon && <i className={`fas ${icon} text-xs`} style={{ color: 'var(--gold)' }} />}
        <span className="flex-1 text-left truncate">{selected?.label}</span>
        <i className={`fas fa-chevron-${isOpen ? 'up' : 'down'} text-xs transition-transform`} style={{ color: 'var(--sub)' }} />
      </button>
      {isOpen && (
        <div className="absolute z-50 mt-2 w-full rounded-xl border shadow-xl overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)', maxHeight: '280px', overflowY: 'auto' }}>
          {options.map((opt) => (
            <button key={opt.value} onClick={() => { onChange(opt.value); setIsOpen(false); }}
              className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-left transition-colors hover:bg-[var(--gold)]/10"
              style={{ color: opt.value === value ? 'var(--gold)' : 'var(--text)', background: opt.value === value ? 'rgba(200,168,75,0.08)' : 'transparent', fontWeight: opt.value === value ? 600 : 400 }}>
              {opt.value === value && <i className="fas fa-check text-xs" style={{ color: 'var(--gold)' }} />}
              <span className={opt.value === value ? '' : 'ml-4'}>{opt.label}</span>
              {opt.count !== undefined && <span className="ml-auto text-xs px-2 py-0.5 rounded-full" style={{ background: 'var(--muted)', color: 'var(--sub)' }}>{opt.count}</span>}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ── AGE GROUP SELECTOR ───────────────────────────────────────
function AgeGroupSelector({ onComplete }) {
  const groups = [
    { id: '10-15', label: '10–15', subtitle: 'Middle School', icon: 'fa-graduation-cap', color: '#5A7A52', limit: 3 },
    { id: '16-18', label: '16–18', subtitle: 'High School', icon: 'fa-book-open', color: 'var(--gold)', limit: 5 },
    { id: '19-25', label: '19–25', subtitle: 'College / Early Career', icon: 'fa-laptop-code', color: '#C8A84B', limit: 8 },
    { id: '26+',   label: '26+',   subtitle: 'Professional',          icon: 'fa-briefcase',  color: 'var(--brown)', limit: Infinity },
  ];
  const [selected, setSelected] = useState(null);

  return (
    <div className="max-w-2xl mx-auto text-center">
      <div className="mb-10">
        <span className="tag-gold mb-4 inline-flex items-center gap-2 text-sm"><i className="fas fa-user" style={{ color: 'var(--tag-text)' }} /> Step 1 of 5</span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-3" style={{ color: 'var(--brown)' }}>
          What's your <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>age group?</em>
        </h2>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>We'll tailor everything to fit your stage of life</p>
      </div>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {groups.map(g => (
          <button key={g.id} onClick={() => setSelected(g)}
            className="rounded-2xl border-2 p-6 flex flex-col items-center gap-3 transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
            style={{
              background: selected?.id === g.id ? 'rgba(200,168,75,0.08)' : 'var(--card-bg)',
              borderColor: selected?.id === g.id ? 'var(--gold)' : 'var(--border)',
              boxShadow: selected?.id === g.id ? '0 4px 24px rgba(200,168,75,0.15)' : undefined,
            }}>
            <div className="w-14 h-14 rounded-xl flex items-center justify-center" style={{ background: `${g.color}18` }}>
              <i className={`fas ${g.icon} text-2xl`} style={{ color: g.color }} />
            </div>
            <div>
              <p className="font-serif text-2xl font-bold" style={{ color: 'var(--brown)' }}>{g.label}</p>
              <p className="text-sm font-medium mt-0.5" style={{ color: 'var(--sub)' }}>{g.subtitle}</p>
            </div>
            {selected?.id === g.id && (
              <div className="w-6 h-6 rounded-full flex items-center justify-center" style={{ background: 'var(--gold)' }}>
                <i className="fas fa-check text-white text-xs" />
              </div>
            )}
          </button>
        ))}
      </div>
      <button onClick={() => selected && onComplete(selected.id, selected.limit)} disabled={!selected}
        className={`px-12 py-4 rounded-full font-semibold text-lg transition-all duration-200 ${selected ? 'btn-gold' : 'cursor-not-allowed'}`}
        style={!selected ? { background: 'var(--muted)', color: 'var(--sub)' } : {}}>
        {selected ? <span className="flex items-center gap-3">Continue <i className="fas fa-arrow-right" style={{ color: 'white' }} /></span> : 'Select your age group'}
      </button>
    </div>
  );
}

// ── DOMAIN CARD ──────────────────────────────────────────────
function DomainCard({ domain, isExpanded, onToggle, isSelected, onToggleInterest }) {
  const selectedCount = domain.fields?.filter(f => isSelected(domain.id, f.id)).length || 0;
  return (
    <div className="rounded-2xl border transition-all duration-200 self-start"
      style={{ background: 'var(--card-bg)', borderColor: isExpanded ? 'var(--gold)' : 'var(--border)', boxShadow: isExpanded ? '0 4px 24px rgba(200,168,75,0.12)' : undefined }}>
      <button onClick={onToggle} className="w-full flex items-center justify-between p-5 rounded-2xl text-left transition-colors hover:bg-[rgba(200,168,75,0.03)]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 border transition-colors"
            style={{ background: isExpanded ? 'rgba(200,168,75,0.2)' : 'rgba(200,168,75,0.1)', borderColor: isExpanded ? 'rgba(200,168,75,0.4)' : 'rgba(200,168,75,0.2)' }}>
            <i className={`fas ${domain.icon} text-xl`} style={{ color: 'var(--gold)' }} />
          </div>
          <div>
            <span className="font-semibold text-lg block" style={{ color: 'var(--text)' }}>{domain.name}</span>
            <span className="text-sm" style={{ color: 'var(--sub)' }}>
              {domain.fields?.length || 0} fields
              {selectedCount > 0 && <span className="ml-2 font-semibold" style={{ color: 'var(--gold)' }}>· {selectedCount} selected</span>}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0">
          {selectedCount > 0 && <span className="w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold" style={{ background: 'var(--gold)' }}>{selectedCount}</span>}
          <i className={`fas fa-chevron-${isExpanded ? 'up' : 'down'} text-lg`} style={{ color: 'var(--sub)' }} />
        </div>
      </button>
      {isExpanded && domain.fields && (
        <div className="px-5 pb-5 border-t" style={{ borderColor: 'var(--border)' }}>
          {domain.description && (
            <p className="text-sm italic py-3 border-b mb-3" style={{ color: 'var(--sub)', borderColor: 'rgba(var(--border), 0.5)' }}>{domain.description}</p>
          )}
          <div className="space-y-2 max-h-80 overflow-y-auto pr-1 custom-scroll">
            {domain.fields.map((field) => {
              const sel = isSelected(domain.id, field.id);
              return (
                <label key={field.id} onClick={() => onToggleInterest(domain.id, field.id)}
                  className="flex items-center gap-4 p-4 rounded-xl cursor-pointer transition-all border"
                  style={{ background: sel ? 'rgba(200,168,75,0.1)' : 'var(--card-bg-secondary)', borderColor: sel ? 'rgba(200,168,75,0.4)' : 'transparent' }}>
                  <div className="w-6 h-6 rounded-md border-2 flex items-center justify-center flex-shrink-0 transition-all"
                    style={{ background: sel ? 'var(--gold)' : 'var(--card-bg)', borderColor: sel ? 'var(--gold)' : 'var(--border)' }}>
                    {sel && <i className="fas fa-check text-white text-xs" />}
                  </div>
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
                    <i className={`fas ${field.icon} text-base`} style={{ color: 'var(--gold)' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-base font-medium block truncate" style={{ color: 'var(--text)' }}>{field.label}</span>
                    {field.description && <span className="text-sm block truncate mt-0.5" style={{ color: 'var(--sub)' }}>{field.description}</span>}
                  </div>
                  {field.trending && (
                    <span className="flex items-center gap-1.5 text-xs font-bold flex-shrink-0 px-3 py-1 rounded-full uppercase tracking-wide border"
                      style={{ color: 'var(--gold)', background: 'rgba(200,168,75,0.1)', borderColor: 'rgba(200,168,75,0.25)' }}>
                      <i className="fas fa-fire text-xs" style={{ color: 'var(--gold)' }} /> Hot
                    </span>
                  )}
                </label>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ── AI INTEREST EXPLORER ─────────────────────────────────────
function AIInterestExplorer({ ageGroup, onComplete, onBack }) {
  const [domains, setDomains] = useState([]);
  const [selected, setSelected] = useState(new Set());
  const [expanded, setExpanded] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchDomains = useCallback(async () => {
    setLoading(true); setError('');

    const staticDomains = [
      { id: 'technology', name: 'Technology', icon: 'fa-laptop-code', description: 'Build the digital future', fields: [
        { id: 'software', label: 'Software Development', icon: 'fa-code', description: 'Build apps, websites & systems', trending: true },
        { id: 'ai_ml', label: 'Artificial Intelligence & ML', icon: 'fa-robot', description: 'Train models, build AI products', trending: true },
        { id: 'cybersec', label: 'Cybersecurity', icon: 'fa-shield-halved', description: 'Protect systems & data', trending: true },
        { id: 'cloud', label: 'Cloud Computing', icon: 'fa-cloud', description: 'AWS, Azure, GCP infrastructure', trending: true },
        { id: 'data_eng', label: 'Data Engineering', icon: 'fa-database', description: 'Pipelines, warehouses & ETL', trending: true },
        { id: 'devops', label: 'DevOps & Platform Engineering', icon: 'fa-gears', description: 'CI/CD, Kubernetes, automation' },
        { id: 'mobile', label: 'Mobile Development', icon: 'fa-mobile-screen', description: 'iOS and Android apps' },
        { id: 'blockchain', label: 'Blockchain & Web3', icon: 'fa-link', description: 'Smart contracts & DeFi' },
        { id: 'game_dev', label: 'Game Development', icon: 'fa-gamepad', description: 'Build interactive experiences' },
        { id: 'iot', label: 'IoT & Embedded Systems', icon: 'fa-microchip', description: 'Hardware + software integration' },
        { id: 'ar_vr', label: 'AR / VR Development', icon: 'fa-vr-cardboard', description: 'Immersive spatial computing', trending: true },
        { id: 'qa', label: 'Quality Assurance & Testing', icon: 'fa-bug', description: 'Automated and manual testing' },
        { id: 'networking', label: 'Networking & Infrastructure', icon: 'fa-network-wired', description: 'Enterprise networks & systems' },
        { id: 'robotics', label: 'Robotics Engineering', icon: 'fa-atom', description: 'Physical + digital systems', trending: true },
        { id: 'bioinformatics', label: 'Bioinformatics', icon: 'fa-dna', description: 'Computational biology & genomics' },
        { id: 'quantum', label: 'Quantum Computing', icon: 'fa-infinity', description: 'Next-gen computation', trending: true },
      ]},
      { id: 'arts_design', name: 'Arts & Design', icon: 'fa-palette', description: 'Create beauty and meaning', fields: [
        { id: 'ux_ui', label: 'UX / UI Design', icon: 'fa-pen-ruler', description: 'User experience and interfaces', trending: true },
        { id: 'graphic', label: 'Graphic Design', icon: 'fa-pen-nib', description: 'Visual communication and branding' },
        { id: 'animation', label: 'Animation & Motion Graphics', icon: 'fa-film', description: '2D/3D animation and effects' },
        { id: 'illustration', label: 'Illustration', icon: 'fa-paintbrush', description: 'Digital and traditional illustration' },
        { id: 'photography', label: 'Photography', icon: 'fa-camera', description: 'Portrait, commercial, documentary' },
        { id: 'film', label: 'Film & Video Production', icon: 'fa-clapperboard', description: 'Storytelling through cinema' },
        { id: 'vfx', label: 'Visual Effects (VFX)', icon: 'fa-wand-sparkles', description: 'CGI and compositing for film/TV', trending: true },
        { id: 'fashion', label: 'Fashion Design', icon: 'fa-shirt', description: 'Apparel, textiles, style' },
        { id: 'interior', label: 'Interior Design', icon: 'fa-couch', description: 'Spatial and aesthetic design' },
        { id: 'product_design', label: 'Industrial / Product Design', icon: 'fa-cube', description: 'Design physical products' },
        { id: 'music_prod', label: 'Music Production', icon: 'fa-music', description: 'Compose, produce, mix tracks' },
        { id: 'fine_art', label: 'Fine Art', icon: 'fa-image', description: 'Painting, sculpture, galleries' },
        { id: 'game_art', label: 'Game Art & Concept Design', icon: 'fa-chess-board', description: 'Concept art for games', trending: true },
        { id: 'brand', label: 'Brand & Identity Design', icon: 'fa-star', description: 'Logo, brand systems' },
        { id: 'typography', label: 'Typography & Print', icon: 'fa-font', description: 'Type design and print media' },
        { id: 'arch_design', label: 'Architectural Design', icon: 'fa-building-columns', description: 'Spatial concepts and aesthetics' },
      ]},
      { id: 'health', name: 'Health & Wellness', icon: 'fa-heart-pulse', description: 'Heal and care for people', fields: [
        { id: 'medicine', label: 'Medicine & Surgery', icon: 'fa-stethoscope', description: 'Diagnosis, treatment, surgery' },
        { id: 'nursing', label: 'Nursing', icon: 'fa-user-nurse', description: 'Patient care and support', trending: true },
        { id: 'mental_health', label: 'Mental Health & Therapy', icon: 'fa-brain', description: 'Psychology, counselling, therapy', trending: true },
        { id: 'dentistry', label: 'Dentistry', icon: 'fa-tooth', description: 'Oral health and dental care' },
        { id: 'pharmacy', label: 'Pharmacy', icon: 'fa-pills', description: 'Drug safety and dispensing' },
        { id: 'physio', label: 'Physiotherapy & Rehabilitation', icon: 'fa-person-walking', description: 'Rehabilitation and movement' },
        { id: 'nutrition', label: 'Nutrition & Dietetics', icon: 'fa-apple-whole', description: 'Food science and health' },
        { id: 'public_health', label: 'Public Health & Epidemiology', icon: 'fa-earth-americas', description: 'Population health', trending: true },
        { id: 'sports_med', label: 'Sports Medicine', icon: 'fa-dumbbell', description: 'Athlete health and performance' },
        { id: 'radiology', label: 'Radiology & Medical Imaging', icon: 'fa-x-ray', description: 'Diagnostic imaging' },
        { id: 'biomedical', label: 'Biomedical Engineering', icon: 'fa-microscope', description: 'Medical devices and tech', trending: true },
        { id: 'optometry', label: 'Optometry & Ophthalmology', icon: 'fa-eye', description: 'Eye health and vision care' },
        { id: 'occ_therapy', label: 'Occupational Therapy', icon: 'fa-hands-holding', description: 'Daily function and independence' },
        { id: 'speech', label: 'Speech-Language Pathology', icon: 'fa-comment-medical', description: 'Communication disorders' },
        { id: 'vet', label: 'Veterinary Medicine', icon: 'fa-paw', description: 'Animal health and care' },
        { id: 'genetic_counsel', label: 'Genetic Counselling & Genomics', icon: 'fa-dna', description: 'Hereditary conditions', trending: true },
      ]},
      { id: 'business', name: 'Business & Finance', icon: 'fa-briefcase', description: 'Lead, grow and build organisations', fields: [
        { id: 'entrepreneurship', label: 'Entrepreneurship & Startups', icon: 'fa-rocket', description: 'Build your own venture', trending: true },
        { id: 'product_mgmt', label: 'Product Management', icon: 'fa-diagram-project', description: 'Build products from idea to launch', trending: true },
        { id: 'marketing', label: 'Marketing & Growth', icon: 'fa-bullhorn', description: 'Campaigns, branding, growth', trending: true },
        { id: 'finance', label: 'Finance & Investment Banking', icon: 'fa-chart-line', description: 'Capital markets and M&A' },
        { id: 'accounting', label: 'Accounting & Auditing', icon: 'fa-calculator', description: 'Financial records and compliance' },
        { id: 'consulting', label: 'Management Consulting', icon: 'fa-handshake', description: 'Strategy for top companies', trending: true },
        { id: 'hr', label: 'Human Resources & People Ops', icon: 'fa-people-group', description: 'Talent, culture, and org design' },
        { id: 'supply_chain', label: 'Supply Chain & Operations', icon: 'fa-truck', description: 'Logistics, procurement, efficiency' },
        { id: 'real_estate', label: 'Real Estate & Property', icon: 'fa-building', description: 'Property development and investment' },
        { id: 'ecommerce', label: 'E-commerce & Retail', icon: 'fa-cart-shopping', description: 'Online and physical retail' },
        { id: 'fintech', label: 'Fintech & Digital Payments', icon: 'fa-mobile-alt', description: 'Technology-driven financial services', trending: true },
        { id: 'insurance', label: 'Insurance & Actuarial Science', icon: 'fa-shield', description: 'Risk and underwriting' },
        { id: 'economics', label: 'Economics & Policy', icon: 'fa-landmark', description: 'Economic research and policymaking' },
        { id: 'sales', label: 'Sales & Business Development', icon: 'fa-comments-dollar', description: 'Revenue and partnerships' },
        { id: 'private_equity', label: 'Private Equity & Venture Capital', icon: 'fa-sack-dollar', description: 'Invest in and scale companies', trending: true },
        { id: 'biz_analytics', label: 'Business Analytics & BI', icon: 'fa-chart-bar', description: 'Data-driven business decisions', trending: true },
      ]},
      { id: 'sustainability', name: 'Sustainability & Environment', icon: 'fa-leaf', description: 'Protect the planet', fields: [
        { id: 'climate', label: 'Climate Science & Research', icon: 'fa-temperature-high', description: 'Research and model climate change', trending: true },
        { id: 'renewable', label: 'Renewable Energy', icon: 'fa-solar-panel', description: 'Solar, wind, and clean energy', trending: true },
        { id: 'env_eng', label: 'Environmental Engineering', icon: 'fa-recycle', description: 'Water, waste, and pollution control' },
        { id: 'conservation', label: 'Wildlife Conservation', icon: 'fa-paw', description: 'Protect biodiversity and habitats' },
        { id: 'marine', label: 'Marine Biology & Oceanography', icon: 'fa-fish', description: 'Ocean science and conservation' },
        { id: 'esg', label: 'Sustainable Business & ESG', icon: 'fa-seedling', description: 'Green corporate strategy', trending: true },
        { id: 'urban_plan', label: 'Urban Planning & Smart Cities', icon: 'fa-city', description: 'Sustainable city design' },
        { id: 'forestry', label: 'Forestry & Ecology', icon: 'fa-tree', description: 'Forest management and ecology' },
        { id: 'agri_env', label: 'Sustainable Agriculture', icon: 'fa-wheat-awn', description: 'Organic, precision, vertical farming', trending: true },
        { id: 'geology', label: 'Geology & Earth Science', icon: 'fa-mountain', description: 'Minerals, rocks, and earth processes' },
        { id: 'air_quality', label: 'Air Quality & Atmospheric Science', icon: 'fa-wind', description: 'Pollution and atmosphere research' },
        { id: 'carbon', label: 'Carbon Markets & Climate Finance', icon: 'fa-coins', description: 'Carbon credits and green investment', trending: true },
        { id: 'water', label: 'Water Resources & Hydrology', icon: 'fa-droplet', description: 'Water management and policy' },
        { id: 'hazmat', label: 'Hazardous Materials & Remediation', icon: 'fa-biohazard', description: 'Cleanup and environmental safety' },
        { id: 'env_law', label: 'Environmental Law & Policy', icon: 'fa-gavel', description: 'Regulation and advocacy' },
        { id: 'circular', label: 'Circular Economy & Zero Waste', icon: 'fa-arrows-spin', description: 'Redesign systems to eliminate waste', trending: true },
      ]},
      { id: 'education', name: 'Education & Research', icon: 'fa-graduation-cap', description: 'Teach, inspire and discover', fields: [
        { id: 'k12', label: 'K-12 Teaching', icon: 'fa-chalkboard-user', description: 'Primary and secondary education' },
        { id: 'higher_ed', label: 'Higher Education & Academia', icon: 'fa-university', description: 'University teaching and research' },
        { id: 'edtech', label: 'EdTech & Online Learning', icon: 'fa-laptop', description: 'Digital learning platforms', trending: true },
        { id: 'curriculum', label: 'Curriculum & Instructional Design', icon: 'fa-book-open', description: 'Design learning experiences' },
        { id: 'special_ed', label: 'Special Education', icon: 'fa-hands-holding-child', description: 'Support diverse learners' },
        { id: 'school_admin', label: 'School Leadership & Administration', icon: 'fa-building-flag', description: 'Principals and superintendents' },
        { id: 'research', label: 'Academic Research', icon: 'fa-flask', description: 'Conduct and publish research', trending: true },
        { id: 'school_counselling', label: 'School Counselling & Guidance', icon: 'fa-comment-dots', description: 'Guide students academically' },
        { id: 'corp_training', label: 'Corporate Training & L&D', icon: 'fa-person-chalkboard', description: 'Workforce upskilling', trending: true },
        { id: 'language', label: 'Language Teaching (ESL/TEFL)', icon: 'fa-language', description: 'English and foreign language education' },
        { id: 'stem_ed', label: 'STEM Education', icon: 'fa-atom', description: 'Science, tech, engineering, math focus' },
        { id: 'early_childhood', label: 'Early Childhood Education', icon: 'fa-child', description: 'Preschool and kindergarten' },
        { id: 'library', label: 'Library & Information Science', icon: 'fa-book', description: 'Archives, libraries, and information' },
        { id: 'museum_ed', label: 'Museum & Public Education', icon: 'fa-landmark', description: 'Informal learning and exhibits' },
        { id: 'tutoring', label: 'Tutoring & Academic Coaching', icon: 'fa-person-circle-check', description: 'One-on-one academic support' },
        { id: 'adult_ed', label: 'Adult & Vocational Education', icon: 'fa-user-graduate', description: 'Lifelong learning and retraining' },
      ]},
      { id: 'engineering', name: 'Engineering & Manufacturing', icon: 'fa-gears', description: 'Design and build the world', fields: [
        { id: 'civil', label: 'Civil & Structural Engineering', icon: 'fa-bridge', description: 'Roads, bridges, buildings' },
        { id: 'mechanical', label: 'Mechanical Engineering', icon: 'fa-wrench', description: 'Machines, tools, thermodynamics' },
        { id: 'electrical', label: 'Electrical Engineering', icon: 'fa-bolt', description: 'Power, circuits, electronics' },
        { id: 'chemical_eng', label: 'Chemical Engineering', icon: 'fa-flask', description: 'Processes, materials, reactions' },
        { id: 'aerospace', label: 'Aerospace Engineering', icon: 'fa-jet-fighter', description: 'Aircraft and spacecraft design', trending: true },
        { id: 'automotive', label: 'Automotive Engineering', icon: 'fa-car', description: 'Vehicle design and systems' },
        { id: 'materials', label: 'Materials Science & Engineering', icon: 'fa-layer-group', description: 'New materials and properties' },
        { id: 'nuclear_eng', label: 'Nuclear Engineering', icon: 'fa-radiation', description: 'Reactors and radiation' },
        { id: 'petroleum', label: 'Petroleum & Mining Engineering', icon: 'fa-oil-well', description: 'Oil, gas, and mineral extraction' },
        { id: 'manufacturing', label: 'Manufacturing & Production', icon: 'fa-industry', description: 'Factory systems and processes' },
        { id: 'mechatronics', label: 'Mechatronics & Automation', icon: 'fa-robot', description: 'Mechanical, electrical, and software' },
        { id: 'construction_eng', label: 'Construction Management', icon: 'fa-helmet-safety', description: 'Project delivery and site management' },
        { id: 'optical', label: 'Optical & Photonics Engineering', icon: 'fa-lightbulb', description: 'Lasers, lenses, and light-based tech' },
        { id: 'energy_eng', label: 'Energy Systems Engineering', icon: 'fa-plug', description: 'Power systems and efficiency', trending: true },
        { id: 'bioprocess', label: 'Bioprocess & Pharma Engineering', icon: 'fa-vials', description: 'Pharmaceutical manufacturing' },
        { id: 'transportation_eng', label: 'Transportation Engineering', icon: 'fa-road', description: 'Roads, rails, and transit systems' },
      ]},
      { id: 'science', name: 'Science & Research', icon: 'fa-microscope', description: 'Explore and discover new knowledge', fields: [
        { id: 'physics', label: 'Physics', icon: 'fa-atom', description: 'Forces, energy, and the universe' },
        { id: 'chemistry', label: 'Chemistry', icon: 'fa-flask', description: 'Molecules, reactions, and materials' },
        { id: 'biology', label: 'Biology & Life Sciences', icon: 'fa-dna', description: 'Cells, organisms, and ecosystems' },
        { id: 'astro', label: 'Astronomy & Astrophysics', icon: 'fa-star', description: 'Stars, galaxies, and cosmos', trending: true },
        { id: 'neuro', label: 'Neuroscience', icon: 'fa-brain', description: 'Brain function and neural systems', trending: true },
        { id: 'genetics', label: 'Genetics & Genomics', icon: 'fa-dna', description: 'DNA, heredity, and gene expression', trending: true },
        { id: 'math', label: 'Mathematics & Statistics', icon: 'fa-square-root-variable', description: 'Pure and applied mathematics' },
        { id: 'data_science', label: 'Data Science & Analytics', icon: 'fa-chart-bar', description: 'Statistical modelling and analysis', trending: true },
        { id: 'geo_sci', label: 'Geoscience & Geology', icon: 'fa-earth-americas', description: 'Earth processes and geology' },
        { id: 'ocean', label: 'Oceanography', icon: 'fa-water', description: 'Oceans, currents, and marine systems' },
        { id: 'biochem', label: 'Biochemistry & Molecular Biology', icon: 'fa-vials', description: 'Chemical processes in living systems' },
        { id: 'pharma_sci', label: 'Pharmaceutical Sciences', icon: 'fa-capsules', description: 'Drug discovery and development' },
        { id: 'anthro', label: 'Anthropology & Archaeology', icon: 'fa-scroll', description: 'Human history and culture' },
        { id: 'ecology', label: 'Ecology & Conservation Biology', icon: 'fa-tree', description: 'Ecosystems and biodiversity' },
        { id: 'forensic', label: 'Forensic Science', icon: 'fa-magnifying-glass', description: 'Science applied to law and crime' },
        { id: 'astrobio', label: 'Astrobiology & Space Science', icon: 'fa-rocket', description: 'Life beyond Earth', trending: true },
      ]},
      { id: 'media', name: 'Media & Communications', icon: 'fa-newspaper', description: 'Inform, entertain and connect', fields: [
        { id: 'journalism', label: 'Journalism & Investigative Reporting', icon: 'fa-newspaper', description: 'News and investigative storytelling' },
        { id: 'content_create', label: 'Content Creation & Influencing', icon: 'fa-video', description: 'YouTube, TikTok, social media', trending: true },
        { id: 'podcasting', label: 'Podcasting & Audio Storytelling', icon: 'fa-podcast', description: 'Audio broadcasting', trending: true },
        { id: 'pr', label: 'Public Relations & Communications', icon: 'fa-bullhorn', description: 'Brand image and media relations' },
        { id: 'screenwriting', label: 'Screenwriting & Scriptwriting', icon: 'fa-pen', description: 'Stories for film, TV, and streaming' },
        { id: 'broadcasting', label: 'TV & Radio Broadcasting', icon: 'fa-tower-broadcast', description: 'On-air presenting and production' },
        { id: 'social_media', label: 'Social Media Management', icon: 'fa-hashtag', description: 'Community and platform strategy', trending: true },
        { id: 'publishing', label: 'Publishing, Editing & Writing', icon: 'fa-book', description: 'Books, magazines, and digital content' },
        { id: 'advertising', label: 'Advertising & Creative Strategy', icon: 'fa-ad', description: 'Campaigns and brand creativity' },
        { id: 'documentary', label: 'Documentary Filmmaking', icon: 'fa-clapperboard', description: 'Non-fiction visual storytelling' },
        { id: 'gaming_media', label: 'Gaming Journalism & Esports Media', icon: 'fa-gamepad', description: 'Cover the gaming industry', trending: true },
        { id: 'translation', label: 'Translation & Localisation', icon: 'fa-language', description: 'Cross-language communication' },
        { id: 'photography_media', label: 'Photojournalism', icon: 'fa-camera', description: 'Visual storytelling through photos' },
        { id: 'comedy', label: 'Comedy & Entertainment Writing', icon: 'fa-masks-theater', description: 'Humor, sketches, and satire' },
        { id: 'data_journalism', label: 'Data Journalism', icon: 'fa-chart-bar', description: 'Visualising data-driven stories', trending: true },
        { id: 'music_industry', label: 'Music Industry & A&R', icon: 'fa-music', description: 'Artist management and label work' },
      ]},
      { id: 'law', name: 'Law & Public Service', icon: 'fa-scale-balanced', description: 'Justice, governance, and society', fields: [
        { id: 'corporate_law', label: 'Corporate & Commercial Law', icon: 'fa-building', description: 'Business transactions and M&A' },
        { id: 'criminal', label: 'Criminal Law', icon: 'fa-handcuffs', description: 'Prosecution and defense' },
        { id: 'ip_law', label: 'Intellectual Property Law', icon: 'fa-copyright', description: 'Patents, trademarks, copyright' },
        { id: 'human_rights', label: 'Human Rights Law', icon: 'fa-hands-holding-circle', description: 'International rights and advocacy' },
        { id: 'tech_law', label: 'Technology, AI & Privacy Law', icon: 'fa-lock', description: 'Cyber, AI, and data regulation', trending: true },
        { id: 'public_policy', label: 'Public Policy & Governance', icon: 'fa-landmark', description: 'Shape laws and government programs', trending: true },
        { id: 'diplomacy', label: 'Diplomacy & International Relations', icon: 'fa-earth-americas', description: 'Foreign affairs and negotiations' },
        { id: 'env_law_pub', label: 'Environmental Law', icon: 'fa-leaf', description: 'Regulation of environment and resources' },
        { id: 'family_law', label: 'Family & Immigration Law', icon: 'fa-people-roof', description: 'Immigration, family, and asylum' },
        { id: 'judiciary', label: 'Judiciary & Courts', icon: 'fa-gavel', description: 'Judges, magistrates, and courts' },
        { id: 'military', label: 'Military & Defence', icon: 'fa-shield', description: 'Armed forces and national security' },
        { id: 'nonprofit_law', label: 'Nonprofit & Social Impact Law', icon: 'fa-heart', description: 'NGOs and social justice legal work' },
        { id: 'compliance', label: 'Compliance & Regulation', icon: 'fa-clipboard-check', description: 'Financial and corporate compliance', trending: true },
        { id: 'policing', label: 'Law Enforcement', icon: 'fa-user-shield', description: 'Police, detectives, investigators' },
        { id: 'arbitration', label: 'Arbitration & Mediation', icon: 'fa-handshake', description: 'Alternative dispute resolution' },
        { id: 'space_law', label: 'Space & Aviation Law', icon: 'fa-rocket', description: 'Emerging frontier of law', trending: true },
      ]},
      { id: 'sports', name: 'Sports & Fitness', icon: 'fa-dumbbell', description: 'Perform, train and inspire', fields: [
        { id: 'professional_athlete', label: 'Professional Athletics', icon: 'fa-medal', description: 'Compete at elite and Olympic levels' },
        { id: 'coaching', label: 'Sports Coaching', icon: 'fa-whistle', description: 'Develop athletes and teams' },
        { id: 'personal_training', label: 'Personal Training & Fitness', icon: 'fa-person-running', description: 'Help people reach fitness goals', trending: true },
        { id: 'sports_medicine_fi', label: 'Sports Medicine & Physiotherapy', icon: 'fa-stethoscope', description: 'Treat and rehabilitate athletes' },
        { id: 'sports_analytics', label: 'Sports Analytics & Data', icon: 'fa-chart-line', description: 'Performance data and scouting', trending: true },
        { id: 'sports_management', label: 'Sports Management & Business', icon: 'fa-clipboard', description: 'Run clubs, teams, and events' },
        { id: 'esports_player', label: 'Esports & Competitive Gaming', icon: 'fa-gamepad', description: 'Compete in video games professionally', trending: true },
        { id: 'sports_journalism', label: 'Sports Journalism & Broadcasting', icon: 'fa-microphone', description: 'Cover sports for media' },
        { id: 'sports_nutrition', label: 'Sports Nutrition', icon: 'fa-apple-whole', description: 'Diet plans for peak performance' },
        { id: 'fitness_tech', label: 'Fitness Technology & Wearables', icon: 'fa-watch', description: 'Wearables, apps, and health tech', trending: true },
        { id: 'yoga', label: 'Yoga, Pilates & Mindfulness', icon: 'fa-spa', description: 'Teach wellness and movement' },
        { id: 'scouting', label: 'Talent Scouting & Recruitment', icon: 'fa-binoculars', description: 'Find and develop future stars' },
        { id: 'outdoor', label: 'Outdoor & Adventure Sports', icon: 'fa-mountain', description: 'Guiding, climbing, extreme sports' },
        { id: 'dance', label: 'Dance & Performing Arts', icon: 'fa-music', description: 'Dance performance and instruction' },
        { id: 'aquatics', label: 'Aquatics & Swimming', icon: 'fa-water', description: 'Swimming coaching and water sports' },
        { id: 'strength', label: 'Strength & Conditioning', icon: 'fa-dumbbell', description: 'Athletic performance and strength training' },
      ]},
      { id: 'hospitality', name: 'Hospitality & Tourism', icon: 'fa-utensils', description: 'Craft experiences and memories', fields: [
        { id: 'chef', label: 'Culinary Arts & Cheffing', icon: 'fa-utensils', description: 'Professional cooking and cuisine', trending: true },
        { id: 'hotel_mgmt', label: 'Hotel & Resort Management', icon: 'fa-hotel', description: 'Run luxury hotels and resorts' },
        { id: 'event_planning', label: 'Event Planning & Management', icon: 'fa-calendar-star', description: 'Weddings, conferences, festivals' },
        { id: 'tourism', label: 'Tourism & Travel Management', icon: 'fa-globe', description: 'Tour operations and travel agencies' },
        { id: 'sommelier', label: 'Sommelier & Beverage Arts', icon: 'fa-wine-bottle', description: 'Wine, spirits, and cocktails' },
        { id: 'food_science', label: 'Food Science & Technology', icon: 'fa-flask', description: 'Food safety and product development' },
        { id: 'restaurant_mgmt', label: 'Restaurant & F&B Management', icon: 'fa-cash-register', description: 'Operations, service, profitability' },
        { id: 'baking', label: 'Baking & Pastry Arts', icon: 'fa-bread-slice', description: 'Breads, pastries, chocolates' },
        { id: 'cruise', label: 'Cruise & Yacht Industry', icon: 'fa-ship', description: 'Maritime hospitality and adventures' },
        { id: 'ecotourism', label: 'Ecotourism & Adventure Travel', icon: 'fa-compass', description: 'Sustainable nature experiences', trending: true },
        { id: 'airline', label: 'Airline & Aviation Services', icon: 'fa-plane', description: 'Flight crew and ground services' },
        { id: 'gaming_hospitality', label: 'Gaming & Casino Industry', icon: 'fa-dice', description: 'Casino operations and hospitality' },
        { id: 'spa', label: 'Spa & Wellness Management', icon: 'fa-spa', description: 'Holistic health and luxury wellness' },
        { id: 'food_delivery', label: 'Food & Delivery Tech', icon: 'fa-motorcycle', description: 'Digital food platforms and logistics', trending: true },
        { id: 'cultural_tourism', label: 'Cultural & Heritage Tourism', icon: 'fa-museum', description: 'Museums, heritage sites, cultural tours' },
        { id: 'luxury', label: 'Luxury Brand & Lifestyle Management', icon: 'fa-gem', description: 'Premium brands and VIP client services' },
      ]},
      { id: 'social', name: 'Social Impact & Nonprofits', icon: 'fa-hands-holding', description: 'Change lives and communities', fields: [
        { id: 'social_work', label: 'Social Work & Welfare', icon: 'fa-people-group', description: 'Support vulnerable individuals and families', trending: true },
        { id: 'community_org', label: 'Community Organizing & Advocacy', icon: 'fa-users', description: 'Grassroots advocacy and change' },
        { id: 'international_dev', label: 'International Development', icon: 'fa-earth-africa', description: 'Global poverty and humanitarian aid' },
        { id: 'nonprofit_mgmt', label: 'Nonprofit Management & Strategy', icon: 'fa-heart', description: 'Run charities and foundations' },
        { id: 'fundraising', label: 'Fundraising & Development', icon: 'fa-hand-holding-heart', description: 'Secure funding for social causes' },
        { id: 'counselling_social', label: 'Counselling & Mental Health', icon: 'fa-brain', description: 'Support people through challenges', trending: true },
        { id: 'policy_advocacy', label: 'Policy Advocacy & Reform', icon: 'fa-bullhorn', description: 'Influence legislation and reform' },
        { id: 'education_access', label: 'Education Access & Equity', icon: 'fa-book', description: 'Close gaps in learning opportunity' },
        { id: 'refugee', label: 'Refugee & Humanitarian Aid', icon: 'fa-hands', description: 'Support displaced communities' },
        { id: 'criminal_justice', label: 'Criminal Justice Reform', icon: 'fa-scale-balanced', description: 'Advocacy and rehabilitation work' },
        { id: 'env_activism', label: 'Environmental Activism', icon: 'fa-earth-americas', description: 'Campaigns for environmental justice', trending: true },
        { id: 'disability_rights', label: 'Disability Rights & Accessibility', icon: 'fa-wheelchair', description: 'Inclusion and accessibility advocacy' },
        { id: 'gender_equality', label: 'Gender Equality & Women\'s Rights', icon: 'fa-venus', description: 'Advocacy and programmatic work' },
        { id: 'chaplaincy', label: 'Chaplaincy & Pastoral Care', icon: 'fa-cross', description: 'Spiritual support in institutions' },
        { id: 'elderly_care', label: 'Elderly Care & Gerontology', icon: 'fa-person-cane', description: 'Care for aging populations' },
        { id: 'child_welfare', label: 'Child & Youth Welfare', icon: 'fa-child-reaching', description: 'Child protection and youth programs' },
      ]},
    ];

    try {
      const res = await fetch('/api/generate-interests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ageGroup }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || `Error ${res.status}`);
      const data = await res.json();
      if (!data.domains?.length) throw new Error('No domains returned');
      setDomains(data.domains);
    } catch (err) {
      setDomains(staticDomains);
    }
    finally { setLoading(false); }
  }, [ageGroup]);

  useEffect(() => { fetchDomains(); }, [fetchDomains]);

  const toggle = useCallback((did, fid) => {
    const key = `${did}:${fid}`;
    setSelected(prev => { const n = new Set(prev); n.has(key) ? n.delete(key) : n.add(key); return n; });
  }, []);
  const isSel = useCallback((did, fid) => selected.has(`${did}:${fid}`), [selected]);
  const toggleDomain = useCallback((id) => setExpanded(prev => prev === id ? null : id), []);

  const handleContinue = () => {
    const items = [];
    selected.forEach(key => {
      const [did, fid] = key.split(':');
      const d = domains.find(x => x.id === did);
      const f = d?.fields?.find(x => x.id === fid);
      if (f) items.push({ ...f, domainId: did, domainName: d.name });
    });
    onComplete(items);
  };

  if (loading) return <LoadingSpinner message="Loading interest domains..." subtext="Mapping career fields for you" />;

  const ready = selected.size >= 3;
  const pct = Math.min((selected.size / 5) * 100, 100);

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="mb-10 text-center">
        {onBack && (
          <button onClick={onBack} className="mb-4 flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all hover:bg-[rgba(200,168,75,0.08)] mx-auto"
            style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
            <i className="fas fa-arrow-left text-xs" style={{ color: 'var(--gold)' }} /> Back to Age Group
          </button>
        )}
        <span className="tag-gold mb-4 inline-flex items-center gap-2 text-sm"><i className="fas fa-heart" style={{ color: 'var(--tag-text)' }} /> Step 2 of 5</span>
        <h2 className="font-serif text-4xl md:text-5xl font-bold mb-3" style={{ color: 'var(--brown)' }}>
          What <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>interests</em> you?
        </h2>
        <p className="text-lg mb-6" style={{ color: 'var(--text-secondary)' }}>AI-curated domains · <i className="fas fa-fire" style={{ color: 'var(--gold)' }} /> marks what's trending</p>
        <div className="inline-flex items-center gap-4 px-6 py-3 rounded-full border shadow-sm" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
          <i className={`fas ${ready ? 'fa-check-circle' : 'fa-circle-dot'} text-lg`} style={{ color: ready ? 'var(--gold)' : 'var(--sub)' }} />
          <span className="text-base font-medium" style={{ color: 'var(--text)' }}>{selected.size} selected</span>
          <div className="w-36 h-2 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
            <div className="h-full rounded-full transition-all duration-300" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, var(--gold), var(--goldDark))' }} />
          </div>
          <span className="text-sm font-medium" style={{ color: 'var(--sub)' }}>{ready ? '✓ Ready!' : `${3 - selected.size} more to go`}</span>
        </div>
      </div>
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8 items-start">
        {domains.map((d) => (
          <DomainCard key={d.id} domain={d} isExpanded={expanded === d.id} onToggle={() => toggleDomain(d.id)} isSelected={isSel} onToggleInterest={toggle} />
        ))}
      </div>
      <div className="text-center">
        <button onClick={handleContinue} disabled={!ready}
          className={`px-12 py-4 rounded-full font-semibold text-lg transition-all duration-200 ${ready ? 'btn-gold' : 'cursor-not-allowed'}`}
          style={!ready ? { background: 'var(--muted)', color: 'var(--sub)' } : {}}>
          {ready
            ? <span className="flex items-center gap-3">Continue to Personality Test <i className="fas fa-arrow-right" style={{ color: 'white' }} /></span>
            : 'Select at least 3 interests'}
        </button>
      </div>
    </div>
  );
}

// ── AI PERSONALITY TEST ──────────────────────────────────────
function AIPersonalityTest({ ageGroup, interests, onComplete, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [error, setError] = useState('');
  const initRef = useRef(false);
  const fetchingRef = useRef(false);

  const cleanQ = (raw) => {
    if (!Array.isArray(raw)) return [];
    return raw.filter(q => {
      if (!q.id) q.id = `q_${Math.random().toString(36).substr(2, 5)}`;
      if (!q.question || q.question.trim().length < 5) return false;
      if (!q.category) q.category = 'Personality';
      if (!Array.isArray(q.options) || q.options.length < 4) return false;
      q.options = q.options.slice(0, 4).map(opt => {
        if (typeof opt === 'string') return { label: opt, value: opt.toLowerCase().replace(/\s+/g, '_') };
        if (!opt.label && opt.value) opt.label = opt.value;
        if (!opt.value && opt.label) opt.value = opt.label.toLowerCase().replace(/\s+/g, '_');
        return opt;
      });
      return true;
    });
  };

  const fetchQ = useCallback(async (prev = []) => {
    if (fetchingRef.current) return;
    fetchingRef.current = true;
    if (prev.length === 0) setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate-personality', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ageGroup,
          interests: interests.map(i => ({ id: i.id, label: i.label, domain: i.domainName })),
          previousAnswers: prev.slice(-10),
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || `Error ${res.status}`);
      const data = await res.json();
      const valid = cleanQ(data.questions || []);
      if (valid.length === 0) throw new Error('AI returned no valid questions');
      setQuestions(p => {
        if (prev.length === 0) return valid.slice(0, 10);
        const merged = [...p];
        valid.forEach(q => { if (merged.length < 15 && !merged.find(e => e.id === q.id)) merged.push(q); });
        return merged.slice(0, 15);
      });
    } catch (err) { setError(err.message); }
    finally { setLoading(false); fetchingRef.current = false; }
  }, [ageGroup, interests]);

  useEffect(() => { if (!initRef.current) { initRef.current = true; fetchQ([]); } }, [fetchQ]);

  const handleAnswer = useCallback((qid, answer) => {
    if (isTransitioning) return;
    setIsTransitioning(true);
    const newA = [...answers, { questionId: qid, answer, questionIndex: currentIndex }];
    setAnswers(newA);
    if (newA.length === 5) fetchQ(newA);
    setTimeout(() => {
      const next = currentIndex + 1;
      if (newA.length >= 15) { onComplete(newA); return; }
      if (next < questions.length) { setCurrentIndex(next); setIsTransitioning(false); return; }
      if (questions.length < 15) {
        const poll = setInterval(() => {
          setQuestions(qs => {
            if (qs.length > currentIndex + 1) { clearInterval(poll); setCurrentIndex(c => c + 1); setIsTransitioning(false); }
            return qs;
          });
        }, 200);
      } else { onComplete(newA); setIsTransitioning(false); }
    }, 150);
  }, [answers, currentIndex, questions, isTransitioning, fetchQ, onComplete]);

  if (loading && questions.length === 0) return <LoadingSpinner message="AI is crafting your personality test..." subtext="Personalized questions based on your interests" />;
  if (error && questions.length === 0) return <ErrorDisplay message="Failed to load questions" detail={error} onRetry={() => fetchQ([])} onSkip={() => onComplete([])} />;
  if (questions.length === 0) return <ErrorDisplay message="No questions available" onRetry={() => fetchQ([])} onSkip={() => onComplete([])} />;

  const q = questions[currentIndex];
  if (!q?.question) {
    if (currentIndex < questions.length - 1) { setCurrentIndex(p => p + 1); return null; }
    onComplete(answers); return null;
  }

  const progress = ((currentIndex + 1) / 15) * 100;

  return (
    <div className="flex flex-col gap-6 max-w-3xl mx-auto">
      <div className="rounded-2xl p-5 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
        <StepIndicator currentStep={2} totalSteps={5} labels={['Age', 'Interests', 'Personality', 'Careers', 'Aptitude']} />
      </div>
      <div className="rounded-2xl p-6 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3 mb-4">
          {currentIndex > 0 && (
            <button onClick={() => {
              setCurrentIndex(p => p - 1);
              setAnswers(p => p.slice(0, -1));
            }} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all hover:bg-[rgba(200,168,75,0.08)]"
              style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
              <i className="fas fa-arrow-left text-xs" style={{ color: 'var(--gold)' }} /> Back
            </button>
          )}
          {onBack && currentIndex === 0 && (
            <button onClick={onBack} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all hover:bg-[rgba(200,168,75,0.08)]"
              style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
              <i className="fas fa-arrow-left text-xs" style={{ color: 'var(--gold)' }} /> Back to Interests
            </button>
          )}
        </div>
        <div className="flex items-center justify-between mb-4">
          <div>
            <span className="tag-gold inline-flex items-center gap-2 mb-1 text-sm"><i className="fas fa-brain" style={{ color: 'var(--tag-text)' }} /> Step 3 of 5</span>
            <h2 className="font-serif text-2xl font-bold" style={{ color: 'var(--brown)' }}>Your <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>personality</em></h2>
          </div>
          <div className="text-right">
            <span className="text-3xl font-bold" style={{ color: 'var(--gold)' }}>{currentIndex + 1}</span>
            <span className="text-lg" style={{ color: 'var(--sub)' }}>/15</span>
            <p className="text-sm mt-1" style={{ color: 'var(--sub)' }}>
              {currentIndex < 5 ? 'Getting to know you' : currentIndex < 10 ? 'Work style' : 'Deep dive'}
            </p>
          </div>
        </div>
        <div className="h-2.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
          <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--gold), var(--goldDark))' }} />
        </div>
        {q.category && <p className="text-sm mt-3 uppercase tracking-wider font-medium" style={{ color: 'var(--sub)' }}>{q.category}</p>}
      </div>
      <div className={`rounded-2xl border overflow-hidden transition-opacity duration-150 ${isTransitioning ? 'opacity-50' : 'opacity-100'}`} style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
        <div className="px-8 pt-8 pb-5 border-b" style={{ borderColor: 'var(--border)' }}>
          <span className="px-3 py-1.5 text-sm font-semibold rounded-lg border inline-block mb-4"
            style={{ background: 'rgba(200,168,75,0.1)', color: 'var(--goldDark)', borderColor: 'rgba(200,168,75,0.2)' }}>Q{currentIndex + 1}</span>
          <h3 className="font-serif text-xl md:text-2xl font-bold leading-snug" style={{ color: 'var(--brown)' }}>{q.question}</h3>
        </div>
        <div className="p-7">
          <div className="space-y-3">
            {q.options?.slice(0, 4).map((opt, idx) => (
              <button key={idx} onClick={() => handleAnswer(q.id, opt.value || opt)} disabled={isTransitioning}
                className="w-full flex items-center gap-4 p-5 rounded-xl border transition-all text-left disabled:opacity-60 disabled:cursor-not-allowed group text-lg"
                style={{ background: 'var(--card-bg-secondary)', borderColor: 'var(--border)' }}
                onMouseEnter={e => { if (!isTransitioning) { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.background = 'rgba(200,168,75,0.05)'; } }}
                onMouseLeave={e => { if (!isTransitioning) { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--card-bg-secondary)'; } }}>
                <span className="w-10 h-10 rounded-lg flex items-center justify-center text-base font-bold flex-shrink-0 border"
                  style={{ background: 'rgba(200,168,75,0.1)', color: 'var(--gold)', borderColor: 'rgba(200,168,75,0.2)' }}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="flex-1 font-medium leading-snug" style={{ color: 'var(--text)' }}>{opt.label || opt.value || opt}</span>
                <i className="fas fa-chevron-right text-sm opacity-0 group-hover:opacity-100 transition-opacity" style={{ color: 'var(--gold)' }} />
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── INDIAN SALARY LOOKUP ─────────────────────────────────────
// Maps career titles (lowercase) to Indian salary ranges in LPA (Lakhs Per Annum)
const indianSalaryMap = {
  'software developer': '₹6L–₹25L',
  'data scientist': '₹8L–₹30L',
  'ai engineer': '₹10L–₹40L',
  'ux researcher': '₹7L–₹22L',
  'product manager': '₹12L–₹45L',
  'professor': '₹6L–₹18L',
  'instructional designer': '₹5L–₹15L',
  'cybersecurity analyst': '₹6L–₹28L',
  'cloud architect': '₹15L–₹50L',
  'devops engineer': '₹8L–₹30L',
  'mobile developer': '₹6L–₹22L',
  'data engineer': '₹8L–₹28L',
  'machine learning engineer': '₹10L–₹40L',
  'full stack developer': '₹6L–₹24L',
  'backend developer': '₹6L–₹22L',
  'frontend developer': '₹5L–₹18L',
  'doctor': '₹8L–₹40L',
  'nurse': '₹3L–₹10L',
  'dentist': '₹6L–₹25L',
  'pharmacist': '₹4L–₹12L',
  'physiotherapist': '₹3L–₹10L',
  'psychologist': '₹5L–₹18L',
  'ca / chartered accountant': '₹7L–₹30L',
  'mba / management': '₹8L–₹35L',
  'investment banker': '₹12L–₹60L',
  'financial analyst': '₹6L–₹20L',
  'marketing manager': '₹6L–₹22L',
  'hr manager': '₹5L–₹18L',
  'lawyer': '₹5L–₹30L',
  'civil engineer': '₹4L–₹15L',
  'mechanical engineer': '₹4L–₹16L',
  'electrical engineer': '₹4L–₹15L',
  'aerospace engineer': '₹6L–₹22L',
  'architect': '₹5L–₹18L',
  'graphic designer': '₹3L–₹12L',
  'ux/ui designer': '₹5L–₹20L',
  'content creator': '₹3L–₹15L',
  'journalist': '₹3L–₹12L',
  'teacher': '₹3L–₹10L',
  'school counselor': '₹3L–₹8L',
  'research scientist': '₹6L–₹20L',
  'biotechnologist': '₹5L–₹18L',
  'chef': '₹3L–₹15L',
  'hotel manager': '₹5L–₹18L',
  'event planner': '₹4L–₹14L',
  'social worker': '₹3L–₹8L',
  'ngo manager': '₹4L–₹12L',
};

// Fallback Indian salary by domain/category
const indianSalaryByCategory = {
  'Technology': '₹6L–₹30L',
  'Business & Finance': '₹6L–₹30L',
  'Health & Wellness': '₹4L–₹20L',
  'Education & Research': '₹3L–₹12L',
  'Engineering & Manufacturing': '₹4L–₹18L',
  'Science & Research': '₹5L–₹18L',
  'Arts & Design': '₹3L–₹15L',
  'Media & Communications': '₹3L–₹15L',
  'Law & Public Service': '₹5L–₹25L',
  'Sports & Fitness': '₹3L–₹20L',
  'Hospitality & Tourism': '₹3L–₹12L',
  'Social Impact & Nonprofits': '₹3L–₹10L',
  'Sustainability & Environment': '₹4L–₹15L',
};

function getIndianSalary(career) {
  // First try exact title match (lowercase)
  const titleKey = (career.title || '').toLowerCase();
  if (indianSalaryMap[titleKey]) return indianSalaryMap[titleKey];
  // Try partial match
  for (const [key, val] of Object.entries(indianSalaryMap)) {
    if (titleKey.includes(key) || key.includes(titleKey)) return val;
  }
  // Try salary field — if it already has ₹ just return it
  if (career.salary && career.salary.includes('₹')) return career.salary;
  // Fallback by category
  if (career.category && indianSalaryByCategory[career.category]) return indianSalaryByCategory[career.category];
  return '₹4L–₹20L';
}

// ── AI CAREER RECOMMENDER ────────────────────────────────────
function AICareerRecommender({ ageGroup, interests, personalityAnswers, onCareerSelect, completedTests, onBack }) {
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchRecommendations = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const domainCounts = {};
      interests.forEach(i => { domainCounts[i.domainName] = (domainCounts[i.domainName] || 0) + 1; });
      const totalSelections = interests.length || 1;
      const domainWeights = Object.entries(domainCounts).map(([domain, count]) => ({
        domain, weight: Math.round((count / totalSelections) * 100),
      }));
      const personalityTraits = personalityAnswers.slice(0, 10).map(a => String(a.answer)).filter(Boolean);

      const res = await fetch('/api/recommend-careers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ageGroup,
          interests: interests.map(i => ({ id: i.id, label: i.label, domainName: i.domainName })),
          personality: personalityAnswers.slice(0, 10),
          preferredDomains: Object.keys(domainCounts),
          domainWeights,
          personalityTraits,
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || `Error ${res.status}`);
      const data = await res.json();

      const aiCareers = data.careers || [];
      const matched = aiCareers.map(aiC => {
        const found = allCareers.careers.find(c =>
          c.title.toLowerCase() === aiC.title?.toLowerCase() ||
          c.title.toLowerCase().includes(aiC.title?.toLowerCase()) ||
          aiC.title?.toLowerCase().includes(c.title.toLowerCase())
        );
        return {
          ...(found || {}),
          id: found?.id || aiC.id || `ai-${Math.random().toString(36).substr(2, 5)}`,
          title: found?.title || aiC.title,
          category: found?.category || aiC.category,
          skills: found?.skills || aiC.skills || [],
          salary: found?.salary || aiC.salary_range || 'Varies',
          growth: found?.growth || aiC.growth_rate || 'N/A',
          match: aiC.match || 75,
          description: aiC.description || '',
          trend: 'stable',
        };
      }).filter(c => c.title);

      setRecommended(matched.length >= 3 ? matched : fallbackRecommend(interests));
    } catch (err) {
      setError(err.message);
      setRecommended(fallbackRecommend(interests));
    } finally {
      setLoading(false);
    }
  }, [ageGroup, interests, personalityAnswers]);

  useEffect(() => { fetchRecommendations(); }, [fetchRecommendations]);

  const fallbackRecommend = (ints) => {
    const domains = [...new Set(ints.map(i => i.domainName))];
    let pool = [];
    domains.forEach(d => {
      const matching = allCareers.careers.filter(c => c.category === d).slice(0, 2);
      pool.push(...matching);
    });
    if (pool.length < 6) pool.push(...allCareers.careers.slice(0, 6 - pool.length));
    return pool.slice(0, 6).map(c => ({ ...c, match: 65 + Math.floor(Math.random() * 25), description: '' }));
  };

  if (loading) return <LoadingSpinner message="AI is matching you to careers..." subtext="Analyzing your interests and personality" />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="text-center space-y-2">
        {onBack && (
          <button onClick={onBack} className="mb-2 flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all hover:bg-[rgba(200,168,75,0.08)] mx-auto"
            style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
            <i className="fas fa-arrow-left text-xs" style={{ color: 'var(--gold)' }} /> Back to Personality Test
          </button>
        )}
        <span className="tag-gold inline-flex items-center gap-2 text-sm"><i className="fas fa-star" style={{ color: 'var(--tag-text)' }} /> Step 4 of 5</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold" style={{ color: 'var(--brown)' }}>
          Your <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Suggested Careers</em>
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          AI analyzed your interests &amp; personality · Pick one to take the aptitude test
        </p>
      </div>

      {error && (
        <div className="rounded-xl p-4 border text-center text-sm" style={{ background: 'rgba(200,168,75,0.05)', borderColor: 'rgba(200,168,75,0.2)', color: 'var(--sub)' }}>
          <i className="fas fa-info-circle mr-2" style={{ color: 'var(--gold)' }} />
          Showing smart suggestions based on your interests
        </div>
      )}

      {/* CHANGE 1: Career cards — white background, gold border only, correct text colors */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recommended.map((career, i) => {
          const done = completedTests?.some(t => t.career?.title === career.title);
          const doneTest = completedTests?.find(t => t.career?.title === career.title);
          const indianSalary = getIndianSalary(career);
          return (
            <button key={career.id || i} onClick={() => onCareerSelect(career)}
              className="relative rounded-2xl p-5 text-left border-2 transition-all duration-200 hover:-translate-y-1 hover:shadow-xl group"
              style={{
                background: 'var(--card-bg)',
                borderColor: done ? '#5A7A52' : 'var(--gold)',
              }}>
              {done && (
                <div className="absolute -top-2 left-3 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm" style={{ background: '#5A7A52', color: 'white' }}>
                  <i className="fas fa-check mr-1" />Done · {doneTest.percentage}%
                </div>
              )}
              <span className="text-xs uppercase tracking-wider font-bold mb-2 block" style={{ color: 'var(--gold)' }}>{career.category}</span>
              <h3 className="font-serif text-lg font-bold mb-2 leading-tight group-hover:text-[var(--gold)] transition-colors" style={{ color: 'var(--brown)' }}>{career.title}</h3>
              {career.description && <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--text-secondary)' }}>{career.description}</p>}
              <div className="flex flex-wrap gap-1 mb-3">
                {career.skills?.slice(0, 3).map(s => (
                  <span key={s} className="text-xs px-2 py-0.5 rounded-md font-medium border" style={{ background: 'rgba(200,168,75,0.08)', color: 'var(--text-secondary)', borderColor: 'rgba(200,168,75,0.2)' }}>{s}</span>
                ))}
              </div>
              <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--text-secondary)' }}>
                <span className="px-2 py-0.5 rounded-md border" style={{ background: 'rgba(200,168,75,0.06)', borderColor: 'rgba(200,168,75,0.15)', color: 'var(--brown)' }}>{indianSalary}</span>
                <span>·</span>
                <span>{career.growth} growth</span>
              </div>
              <div className="mt-3 pt-3 border-t flex items-center justify-between" style={{ borderColor: 'rgba(200,168,75,0.2)' }}>
                <span className="text-sm font-semibold" style={{ color: 'var(--gold)' }}>
                  {done ? 'Retake Aptitude Test' : 'Take Aptitude Test'}
                </span>
                <i className="fas fa-arrow-right text-sm group-hover:translate-x-1 transition-transform" style={{ color: 'var(--gold)' }} />
              </div>
            </button>
          );
        })}
      </div>

      <div className="text-center pt-2">
        <p className="text-sm mb-3" style={{ color: 'var(--sub)' }}>Want to explore all {allCareers.careers.length} careers instead?</p>
        <button onClick={() => onCareerSelect('browse')}
          className="btn-outline text-sm px-6 py-2.5" style={{ color: 'var(--text)', borderColor: 'var(--border)' }}>
          <i className="fas fa-th-large mr-2" style={{ color: 'var(--gold)' }} />Browse All Careers
        </button>
      </div>
    </div>
  );
}

// ── CAREER EXPLORER (all careers browser) ───────────────────
function CareerExplorer({ ageGroup, onCareerSelect, completedTests, onBack }) {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDomain, setSelectedDomain] = useState('all');
  const [trendFilter, setTrendFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(0);
  const perPage = 24;

  const domainData = useMemo(() => {
    const dm = {};
    allCareers.careers.forEach(c => { if (!dm[c.category]) dm[c.category] = 0; dm[c.category]++; });
    return dm;
  }, []);

  const allDomains = useMemo(() => {
    const d = Object.entries(domainData).map(([n, c]) => ({ value: n, label: n, count: c }));
    return [{ value: 'all', label: 'All Domains', count: allCareers.careers.length }, ...d.sort((a, b) => a.label.localeCompare(b.label))];
  }, [domainData]);

  const trendOptions = [
    { value: 'all', label: 'All Trends' },
    { value: 'booming', label: '🔥 Booming' },
    { value: 'stable', label: '📈 Stable' },
    { value: 'declining', label: '📉 Declining' },
  ];
  const sortOptions = [
    { value: 'name', label: 'Name A–Z' },
    { value: 'match', label: 'Best Match' },
    { value: 'salary', label: 'Salary' },
    { value: 'growth', label: 'Growth Rate' },
  ];

  useEffect(() => { loadCareers(); }, [ageGroup]);

  const loadCareers = async () => {
    setLoading(true);
    try {
      let trendData = {};
      try {
        const res = await fetch('/api/market-trends', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ageGroup }),
        });
        if (res.ok) { const d = await res.json(); trendData = d.trends || {}; }
      } catch { /* use static trends */ }

      const enriched = allCareers.careers.map(career => {
        let trend = 'stable';
        if (trendData[career.category]) {
          if (trendData[career.category].booming?.includes(career.title)) trend = 'booming';
          else if (trendData[career.category].declining?.includes(career.title)) trend = 'declining';
        }
        return { ...career, trend, match: 55 + Math.floor(Math.random() * 40) };
      });
      setCareers(enriched);
    } catch {
      setCareers(allCareers.careers.map(c => ({ ...c, trend: 'stable', match: 60 })));
    } finally { setLoading(false); }
  };

  const filtered = useMemo(() => {
    let f = [...careers];
    if (selectedDomain !== 'all') f = f.filter(c => c.category === selectedDomain);
    if (trendFilter !== 'all') f = f.filter(c => c.trend === trendFilter);
    if (searchTerm) {
      const t = searchTerm.toLowerCase();
      f = f.filter(c => c.title.toLowerCase().includes(t) || c.category.toLowerCase().includes(t) || c.skills?.some(s => s.toLowerCase().includes(t)));
    }
    if (sortBy === 'name') f.sort((a, b) => a.title.localeCompare(b.title));
    else if (sortBy === 'salary') f.sort((a, b) => (b.salary || '').localeCompare(a.salary || ''));
    else if (sortBy === 'growth') f.sort((a, b) => (parseInt(b.growth) || 0) - (parseInt(a.growth) || 0));
    else f.sort((a, b) => b.match - a.match);
    return f;
  }, [careers, selectedDomain, trendFilter, searchTerm, sortBy]);

  const totalPages = Math.ceil(filtered.length / perPage);
  const displayed = filtered.slice(page * perPage, (page + 1) * perPage);
  const counts = useMemo(() => ({
    booming: careers.filter(c => c.trend === 'booming').length,
    stable: careers.filter(c => c.trend === 'stable').length,
    declining: careers.filter(c => c.trend === 'declining').length,
  }), [careers]);

  if (loading) return <LoadingSpinner message="Loading all careers..." subtext={`Analyzing ${allCareers.careers.length} career paths with AI trend data`} />;

  return (
    <div className="space-y-5">
      <div className="text-center space-y-2">
        {onBack && (
          <button onClick={onBack} className="mb-2 flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-medium transition-all hover:bg-[rgba(200,168,75,0.08)] mx-auto"
            style={{ color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>
            <i className="fas fa-arrow-left text-xs" style={{ color: 'var(--gold)' }} /> Back to Top Matches
          </button>
        )}
        <span className="tag-gold inline-flex items-center gap-2 text-sm"><i className="fas fa-briefcase" style={{ color: 'var(--tag-text)' }} /> Browse All Careers</span>
        <h1 className="font-serif text-4xl md:text-5xl font-bold" style={{ color: 'var(--brown)' }}>
          Explore <em style={{ color: 'var(--gold)', fontStyle: 'normal' }}>Careers</em>
        </h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>
          {allCareers.careers.length} careers · {allDomains.length - 1} domains · AI trend analysis
        </p>
      </div>

      {/* Trend stats */}
      <div className="grid grid-cols-3 gap-3">
        <div className="rounded-xl p-4 text-center border" style={{ background: 'var(--card-bg)', borderColor: 'rgba(239,68,68,0.2)' }}>
          <div className="text-2xl font-bold" style={{ color: '#ef4444' }}>{counts.booming}</div>
          <div className="text-sm font-medium" style={{ color: 'var(--sub)' }}><i className="fas fa-fire mr-1" style={{ color: '#ef4444' }} />Booming</div>
        </div>
        <div className="rounded-xl p-4 text-center border" style={{ background: 'var(--card-bg)', borderColor: 'rgba(200,168,75,0.2)' }}>
          <div className="text-2xl font-bold" style={{ color: 'var(--gold)' }}>{counts.stable}</div>
          <div className="text-sm font-medium" style={{ color: 'var(--sub)' }}><i className="fas fa-chart-line mr-1" style={{ color: 'var(--gold)' }} />Stable</div>
        </div>
        <div className="rounded-xl p-4 text-center border" style={{ background: 'var(--card-bg)', borderColor: 'rgba(107,114,128,0.2)' }}>
          <div className="text-2xl font-bold" style={{ color: 'var(--text-secondary)' }}>{counts.declining}</div>
          <div className="text-sm font-medium" style={{ color: 'var(--sub)' }}><i className="fas fa-arrow-trend-down mr-1" />Declining</div>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 items-center justify-between">
        <div className="flex flex-wrap gap-2 items-center">
          <StyledSelect value={selectedDomain} onChange={v => { setSelectedDomain(v); setPage(0); }} options={allDomains} icon="fa-layer-group" />
          <StyledSelect value={trendFilter} onChange={v => { setTrendFilter(v); setPage(0); }} options={trendOptions} icon="fa-chart-line" />
          <StyledSelect value={sortBy} onChange={setSortBy} options={sortOptions} icon="fa-sort" />
          <button onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="px-4 py-2.5 rounded-xl border text-sm font-medium flex items-center gap-2"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>
            <i className={`fas fa-${viewMode === 'grid' ? 'list' : 'th'}`} style={{ color: 'var(--gold)' }} />
            {viewMode === 'grid' ? 'List' : 'Grid'}
          </button>
        </div>
        <div className="relative">
          <i className="fas fa-search absolute left-3 top-1/2 -translate-y-1/2 text-sm" style={{ color: 'var(--sub)' }} />
          <input type="text" placeholder="Search careers, skills..." value={searchTerm}
            onChange={e => { setSearchTerm(e.target.value); setPage(0); }}
            className="pl-9 pr-4 py-2.5 rounded-xl border text-sm w-52"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }} />
        </div>
      </div>

      {/* Career cards — also updated with Indian salary */}
      {viewMode === 'grid' ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {displayed.map(career => {
            const done = completedTests?.some(t => t.career?.title === career.title);
            const doneTest = completedTests?.find(t => t.career?.title === career.title);
            const indianSalary = getIndianSalary(career);
            return (
              <button key={career.id} onClick={() => onCareerSelect(career)}
                className="relative rounded-xl p-4 text-left border transition-all hover:-translate-y-0.5 hover:shadow-lg group"
                style={{
                  background: 'var(--card-bg)',
                  borderColor: done ? '#5A7A52' : career.trend === 'booming' ? 'rgba(239,68,68,0.25)' : 'var(--border)',
                }}>
                {career.trend === 'booming' && (
                  <div className="absolute -top-2 -right-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm" style={{ background: '#ef4444', color: 'white' }}>
                    <i className="fas fa-fire mr-1" />Hot
                  </div>
                )}
                {done && (
                  <div className="absolute -top-2 left-3 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm" style={{ background: '#5A7A52', color: 'white' }}>
                    <i className="fas fa-check mr-1" />Done · {doneTest.percentage}%
                  </div>
                )}
                <span className="text-xs uppercase tracking-wider font-bold mb-2 block" style={{ color: 'var(--sub)' }}>{career.category}</span>
                <h3 className="font-serif text-base font-bold mb-2 leading-tight group-hover:text-[var(--gold)] transition-colors" style={{ color: 'var(--brown)' }}>{career.title}</h3>
                <div className="flex flex-wrap gap-1 mb-3">
                  {career.skills?.slice(0, 3).map(s => (
                    <span key={s} className="text-xs px-2 py-0.5 rounded-md font-medium" style={{ background: 'var(--card-bg-secondary)', color: 'var(--text-secondary)' }}>{s}</span>
                  ))}
                </div>
                <div className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--sub)' }}>
                  <span className="px-2 py-0.5 rounded-md truncate" style={{ background: 'var(--muted)' }}>{indianSalary}</span>
                  <span>·</span>
                  <span className="flex-shrink-0">{career.growth} growth</span>
                </div>
              </button>
            );
          })}
        </div>
      ) : (
        <div className="space-y-2">
          {displayed.map(career => {
            const done = completedTests?.some(t => t.career?.title === career.title);
            const doneTest = completedTests?.find(t => t.career?.title === career.title);
            const indianSalary = getIndianSalary(career);
            return (
              <button key={career.id} onClick={() => onCareerSelect(career)}
                className="w-full flex items-center gap-4 p-4 rounded-xl border text-left transition-all hover:bg-[var(--gold)]/5 group"
                style={{ background: 'var(--card-bg)', borderColor: done ? '#5A7A52' : career.trend === 'booming' ? 'rgba(239,68,68,0.2)' : 'var(--border)' }}>
                <span className="text-xs uppercase tracking-wider font-bold w-28 flex-shrink-0" style={{ color: 'var(--sub)' }}>{career.category}</span>
                <span className="flex-1 font-semibold text-sm truncate group-hover:text-[var(--gold)] transition-colors" style={{ color: 'var(--brown)' }}>{career.title}</span>
                {done && <span className="text-xs font-bold px-2 py-0.5 rounded-full flex-shrink-0" style={{ background: 'rgba(90,122,82,0.15)', color: '#5A7A52' }}>{doneTest.percentage}%</span>}
                <span className="text-xs font-medium w-24 text-right flex-shrink-0" style={{ color: 'var(--sub)' }}>{indianSalary}</span>
                <span className="text-xs w-16 text-right flex-shrink-0" style={{ color: 'var(--sub)' }}>{career.growth}</span>
                {career.trend === 'booming' && <i className="fas fa-fire text-sm flex-shrink-0" style={{ color: '#ef4444' }} />}
                {done && <i className="fas fa-check text-sm flex-shrink-0" style={{ color: '#5A7A52' }} />}
              </button>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 pt-2">
          <button onClick={() => setPage(p => Math.max(0, p - 1))} disabled={page === 0}
            className="px-5 py-2.5 rounded-xl border text-sm font-medium disabled:opacity-40 flex items-center gap-2"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>
            <i className="fas fa-chevron-left" /> Previous
          </button>
          <span className="text-sm font-medium" style={{ color: 'var(--sub)' }}>Page {page + 1} of {totalPages}</span>
          <button onClick={() => setPage(p => Math.min(totalPages - 1, p + 1))} disabled={page >= totalPages - 1}
            className="px-5 py-2.5 rounded-xl border text-sm font-medium disabled:opacity-40 flex items-center gap-2"
            style={{ background: 'var(--card-bg)', borderColor: 'var(--border)', color: 'var(--text)' }}>
            Next <i className="fas fa-chevron-right" />
          </button>
        </div>
      )}
      <p className="text-center text-sm font-medium" style={{ color: 'var(--sub)' }}>
        Showing {displayed.length} of {filtered.length} filtered · {allCareers.careers.length} total careers
      </p>
    </div>
  );
}

// ── APTITUDE TIMER ───────────────────────────────────────────
function AptitudeTimer({ seconds, onExpire, isActive }) {
  const [left, setLeft] = useState(seconds || 45);
  const expiredRef = useRef(false);
  useEffect(() => { setLeft(seconds || 45); expiredRef.current = false; }, [seconds]);
  useEffect(() => {
    if (!isActive || left <= 0) return;
    const t = setInterval(() => {
      setLeft(prev => {
        if (prev <= 1) {
          clearInterval(t);
          if (!expiredRef.current) { expiredRef.current = true; setTimeout(onExpire, 50); }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [isActive, seconds]);

  const pct = seconds > 0 ? (left / seconds) * 100 : 0;
  const color = pct > 50 ? '#5A7A52' : pct > 25 ? '#C8A84B' : '#C0392B';
  const r = 14, circ = 2 * Math.PI * r;
  return (
    <div className="relative w-11 h-11 flex-shrink-0">
      <svg viewBox="0 0 34 34" className="w-full h-full -rotate-90">
        <circle cx="17" cy="17" r={r} fill="none" stroke="var(--muted)" strokeWidth="2.5" />
        <circle cx="17" cy="17" r={r} fill="none" stroke={color} strokeWidth="2.5" strokeLinecap="round"
          strokeDasharray={circ} strokeDashoffset={circ * (1 - pct / 100)}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s' }} />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-xs font-bold" style={{ color }}>{left}s</span>
    </div>
  );
}

// ── APTITUDE TEST ────────────────────────────────────────────
function AptitudeTest({ career, ageGroup, onComplete, onBack }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [testCompleted, setTestCompleted] = useState(false);
  const [timeExpired, setTimeExpired] = useState(false);
  // CHANGE 2: Do NOT reveal answers during the test — only after all questions done
  // showAnswer is only used in the summary screen now

  const fetchQuestions = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const res = await fetch('/api/generate-aptitude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          career: career.title,
          ageGroup,
          interests: [],
          personality: [],
          difficultyGuidance: ageGroup === '10-15' ? 'Very simple, age-appropriate questions.' : 'Professional level questions.',
        }),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).detail || `Error ${res.status}`);
      const data = await res.json();
      const valid = (data.questions || [])
        .filter(q => q.question?.trim().length > 4 && Array.isArray(q.options) && q.options.length === 4)
        .map((q, i) => ({
          ...q,
          id: i + 1,
          options: q.options.map(o => typeof o === 'string' ? o : (o?.label || o?.text || String(o))),
        }));
      if (valid.length < 3) throw new Error('Not enough valid questions returned');
      setQuestions(valid);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }, [career, ageGroup]);

  useEffect(() => { fetchQuestions(); }, [fetchQuestions]);

  const handleAnswer = (idx) => {
    if (selectedAnswer !== null || timeExpired) return;
    setSelectedAnswer(idx);
    const q = questions[currentIndex];
    if (idx === q.correct) setScore(p => p + q.points);
    setAnswers(p => [...p, { question: q.question, selected: idx, correct: q.correct, options: q.options, isCorrect: idx === q.correct, skill: q.skill, points: q.points }]);
  };

  const handleTimeExpire = () => {
    if (selectedAnswer !== null) return;
    setTimeExpired(true);
    setSelectedAnswer(-1);
    const q = questions[currentIndex];
    setAnswers(p => [...p, { question: q.question, selected: -1, correct: q.correct, options: q.options, isCorrect: false, skill: q.skill, points: 0, timeExpired: true }]);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(p => p + 1);
      setSelectedAnswer(null);
      setTimeExpired(false);
    } else {
      setTestCompleted(true);
    }
  };

  const handleFinish = () => {
    const total = questions.reduce((s, q) => s + q.points, 0);
    onComplete({ career, score, totalPoints: total, percentage: total > 0 ? Math.round((score / total) * 100) : 0, answers, questions, completedAt: new Date().toISOString() });
  };

  if (loading) return <LoadingSpinner message={`AI is creating your ${career.title} test...`} subtext="Generating 10 questions across 3 difficulty levels" />;
  if (error) return <ErrorDisplay message="Failed to load test" detail={error} onRetry={fetchQuestions} onSkip={onBack} />;

  // Summary screen — shown after all questions answered, REVEALS correct/wrong here
  if (testCompleted) {
    const total = questions.reduce((s, q) => s + q.points, 0);
    const pct = total > 0 ? Math.round((score / total) * 100) : 0;
    const correct = answers.filter(a => a.isCorrect).length;
    const wrong = answers.filter(a => !a.isCorrect && !a.timeExpired).length;
    const expired = answers.filter(a => a.timeExpired).length;

    return (
      <div className="max-w-2xl mx-auto space-y-4">
        {/* Score summary */}
        <div className="rounded-2xl p-6 border text-center" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
          <div className="w-14 h-14 mx-auto mb-3 rounded-2xl flex items-center justify-center shadow-lg" style={{ background: 'linear-gradient(135deg, var(--gold), var(--goldDark))' }}>
            <i className="fas fa-check text-xl" style={{ color: 'white' }} />
          </div>
          <h2 className="font-serif text-xl font-bold mb-1" style={{ color: 'var(--brown)' }}>Test Complete!</h2>
          <div className="text-3xl font-bold mb-1" style={{ color: pct >= 80 ? '#5A7A52' : pct >= 60 ? 'var(--gold)' : '#C0392B' }}>{pct}%</div>
          <p className="text-sm mb-4" style={{ color: 'var(--text-secondary)' }}>{score}/{total} points</p>
          <div className="flex justify-center gap-4">
            <div className="flex flex-col items-center px-4 py-2 rounded-xl" style={{ background: 'rgba(90,122,82,0.1)' }}>
              <span className="text-xl font-bold" style={{ color: '#5A7A52' }}>{correct}</span>
              <span className="text-xs font-medium mt-0.5" style={{ color: '#5A7A52' }}>Correct</span>
            </div>
            <div className="flex flex-col items-center px-4 py-2 rounded-xl" style={{ background: 'rgba(239,68,68,0.1)' }}>
              <span className="text-xl font-bold" style={{ color: '#ef4444' }}>{wrong}</span>
              <span className="text-xs font-medium mt-0.5" style={{ color: '#ef4444' }}>Wrong</span>
            </div>
            {expired > 0 && (
              <div className="flex flex-col items-center px-4 py-2 rounded-xl" style={{ background: 'rgba(107,114,128,0.1)' }}>
                <span className="text-xl font-bold" style={{ color: 'var(--sub)' }}>{expired}</span>
                <span className="text-xs font-medium mt-0.5" style={{ color: 'var(--sub)' }}>Timed Out</span>
              </div>
            )}
          </div>
        </div>

        {/* Answer review — correct/wrong revealed here, after test */}
        <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
          <div className="px-5 py-3 border-b" style={{ borderColor: 'var(--border)', background: 'var(--card-bg-secondary)' }}>
            <h3 className="font-semibold text-base" style={{ color: 'var(--brown)' }}>Answer Review</h3>
          </div>
          <div className="divide-y" style={{ divideColor: 'var(--border)' }}>
            {answers.map((a, i) => (
              <div key={i} className="px-5 py-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: a.isCorrect ? 'rgba(90,122,82,0.15)' : 'rgba(239,68,68,0.15)' }}>
                    <i className={`fas ${a.isCorrect ? 'fa-check' : 'fa-times'} text-xs`}
                      style={{ color: a.isCorrect ? '#5A7A52' : '#ef4444' }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-snug mb-2" style={{ color: 'var(--text)' }}>
                      <span className="font-bold mr-1" style={{ color: 'var(--sub)' }}>Q{i + 1}.</span>{a.question}
                    </p>
                    <div className="space-y-1.5">
                      {a.options.map((opt, oi) => {
                        const isCorrectOpt = oi === a.correct;
                        const isUserChoice = oi === a.selected;
                        let bg = 'transparent';
                        let borderColor = 'var(--border)';
                        let textColor = 'var(--text-secondary)';
                        if (isCorrectOpt) { bg = 'rgba(90,122,82,0.12)'; borderColor = '#5A7A52'; textColor = '#5A7A52'; }
                        else if (isUserChoice && !a.isCorrect) { bg = 'rgba(239,68,68,0.1)'; borderColor = '#ef4444'; textColor = '#ef4444'; }
                        return (
                          <div key={oi} className="flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs"
                            style={{ background: bg, borderColor, color: textColor }}>
                            <span className="w-4 h-4 rounded flex items-center justify-center font-bold flex-shrink-0 text-xs"
                              style={{ background: isCorrectOpt ? '#5A7A52' : isUserChoice && !a.isCorrect ? '#ef4444' : 'var(--muted)', color: (isCorrectOpt || (isUserChoice && !a.isCorrect)) ? 'white' : 'var(--sub)' }}>
                              {String.fromCharCode(65 + oi)}
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isCorrectOpt && <i className="fas fa-check text-xs" style={{ color: '#5A7A52' }} />}
                            {isUserChoice && !a.isCorrect && <i className="fas fa-times text-xs" style={{ color: '#ef4444' }} />}
                          </div>
                        );
                      })}
                      {a.timeExpired && (
                        <p className="text-xs px-3 py-1 rounded-lg" style={{ background: 'rgba(107,114,128,0.1)', color: 'var(--sub)' }}>
                          <i className="fas fa-clock mr-1" />Time expired — correct answer highlighted above
                        </p>
                      )}
                    </div>
                  </div>
                  <span className="text-xs font-bold flex-shrink-0 px-2 py-1 rounded-lg" style={{ background: a.isCorrect ? 'rgba(90,122,82,0.1)' : 'rgba(239,68,68,0.08)', color: a.isCorrect ? '#5A7A52' : '#ef4444' }}>
                    {a.isCorrect ? `+${a.points}` : '0'} pts
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <button onClick={handleFinish} className="btn-gold w-full">
          <i className="fas fa-chart-bar mr-2" style={{ color: 'white' }} />View Full Results
        </button>
        <button onClick={onBack} className="btn-outline w-full" style={{ color: 'var(--text)', borderColor: 'var(--border)' }}>Back to Careers</button>
      </div>
    );
  }

  const q = questions[currentIndex];
  if (!q) return null;

  const liveTotal = questions.slice(0, currentIndex).reduce((s, qq) => s + qq.points, 0);
  // CHANGE 2: isAnswered is true but we do NOT show correct/wrong styling during the test
  const isAnswered = selectedAnswer !== null || timeExpired;

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div>
          <button onClick={onBack} className="text-sm mb-1 flex items-center gap-1" style={{ color: 'var(--sub)' }}>
            <i className="fas fa-arrow-left" /> Back
          </button>
          <span className="tag-gold text-sm">{career.title}</span>
          <h2 className="font-serif text-xl font-bold mt-1" style={{ color: 'var(--brown)' }}>Aptitude Test</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-lg font-bold" style={{ color: 'var(--gold)' }}>{score}</span>
            <span className="text-sm" style={{ color: 'var(--sub)' }}>/{liveTotal} pts</span>
          </div>
          <AptitudeTimer key={currentIndex} seconds={q.time || 45} onExpire={handleTimeExpire} isActive={selectedAnswer === null && !timeExpired} />
        </div>
      </div>
      <div className="rounded-xl p-3 border mb-4" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
        <div className="flex items-center justify-between mb-1">
          <span className="text-sm" style={{ color: 'var(--text-secondary)' }}>Q {currentIndex + 1}/{questions.length}</span>
        </div>
        <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
          <div className="h-full rounded-full transition-all duration-300"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%`, background: 'linear-gradient(90deg, var(--gold), var(--goldDark))' }} />
        </div>
      </div>
      <div className="rounded-2xl border overflow-hidden" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
        <div className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'var(--border)' }}>
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            <span className="px-2.5 py-1 text-sm font-semibold rounded-lg border"
              style={{ background: 'rgba(200,168,75,0.1)', color: 'var(--goldDark)', borderColor: 'rgba(200,168,75,0.2)' }}>{q.points} pts</span>
            <span className="px-2.5 py-1 text-sm rounded-lg border"
              style={{ background: 'var(--card-bg-secondary)', color: 'var(--text-secondary)', borderColor: 'var(--border)' }}>{q.skill}</span>
            <span className={`px-2.5 py-1 text-sm rounded-lg font-semibold border ${q.difficulty === 'easy' ? 'bg-green-500/10 text-green-600 border-green-500/20' : q.difficulty === 'medium' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' : 'bg-red-500/10 text-red-600 border-red-500/20'}`}>
              {q.difficulty}
            </span>
          </div>
          <h3 className="font-serif text-lg font-bold leading-snug" style={{ color: 'var(--brown)' }}>{q.question}</h3>
        </div>
        <div className="p-5">
          <div className="space-y-2 mb-4">
            {q.options?.map((opt, idx) => {
              // CHANGE 2: Only show selected highlight (gold), never reveal correct/wrong during test
              const isChosen = isAnswered && idx === selectedAnswer && !timeExpired;

              return (
                <button key={idx} onClick={() => handleAnswer(idx)} disabled={isAnswered}
                  className="w-full flex items-center gap-3 p-3.5 rounded-lg border-2 transition-all text-left disabled:cursor-default"
                  style={{
                    borderColor: isChosen ? 'var(--gold)' : 'var(--border)',
                    background: isChosen ? 'rgba(200,168,75,0.1)' : 'var(--card-bg)',
                    color: 'var(--text)',
                  }}
                  onMouseEnter={e => {
                    if (!isAnswered) {
                      e.currentTarget.style.borderColor = 'var(--gold)';
                      e.currentTarget.style.background = 'rgba(200,168,75,0.12)';
                    }
                  }}
                  onMouseLeave={e => {
                    if (!isAnswered) {
                      e.currentTarget.style.borderColor = 'var(--border)';
                      e.currentTarget.style.background = 'var(--card-bg)';
                    }
                  }}>
                  <span className="w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm flex-shrink-0 border transition-all"
                    style={{
                      background: isChosen ? 'var(--gold)' : 'rgba(200,168,75,0.08)',
                      color: isChosen ? 'white' : 'var(--gold)',
                      borderColor: isChosen ? 'var(--gold)' : 'rgba(200,168,75,0.2)',
                    }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span className="flex-1 text-base" style={{ color: 'var(--text)' }}>{opt}</span>
                </button>
              );
            })}
          </div>

          {/* CHANGE 2: No feedback/explanation shown during test — just a neutral "time's up" note if expired */}
          {timeExpired && (
            <div className="mb-4 px-4 py-3 rounded-xl border" style={{
              background: 'rgba(107,114,128,0.06)',
              borderColor: 'rgba(107,114,128,0.2)',
            }}>
              <p className="text-sm font-semibold flex items-center gap-2" style={{ color: 'var(--sub)' }}>
                <i className="fas fa-clock" /> Time's up! Moving to next question.
              </p>
            </div>
          )}

          {isAnswered && (
            <button onClick={handleNext} className="w-full py-3.5 font-semibold rounded-xl flex items-center justify-center gap-2 text-lg"
              style={{ background: 'linear-gradient(135deg, #C8A84B 0%, #9a6f10 100%)', color: 'white' }}>
              {currentIndex >= questions.length - 1 ? 'See Results' : 'Next Question'} <i className="fas fa-arrow-right" style={{ color: 'white' }} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ── RESULTS PAGE ─────────────────────────────────────────────
function ResultsPage({ results, onTryAnother, onRestart, onDashboard }) {
  const best = results.bestMatch;
  const pct = best?.percentage || 0;
  const scoreColor = pct >= 80 ? '#5A7A52' : pct >= 60 ? 'var(--gold)' : '#C0392B';

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-2xl flex items-center justify-center shadow-lg"
          style={{ background: 'linear-gradient(135deg, var(--gold), var(--goldDark))' }}>
          <i className="fas fa-trophy text-3xl" style={{ color: 'white' }} />
        </div>
        <h1 className="font-serif text-4xl font-bold mb-2" style={{ color: 'var(--brown)' }}>Assessment Complete!</h1>
        <p className="text-lg" style={{ color: 'var(--text-secondary)' }}>Here's how you performed</p>
      </div>

      {best && (
        <div className="rounded-2xl p-8 border-2 shadow-lg text-center" style={{ background: 'var(--card-bg)', borderColor: 'rgba(200,168,75,0.5)' }}>
          <p className="text-sm uppercase tracking-wider font-bold mb-1" style={{ color: 'var(--sub)' }}>Best Match</p>
          <h2 className="font-serif text-3xl font-bold mb-3" style={{ color: 'var(--brown)' }}>{best.career?.title}</h2>
          <div className="text-6xl font-bold mb-2" style={{ color: scoreColor }}>{pct}%</div>
          <p className="text-base" style={{ color: 'var(--text-secondary)' }}>{best.score}/{best.totalPoints} points</p>
          <div className="mt-4 h-3 rounded-full overflow-hidden mx-auto max-w-xs" style={{ background: 'var(--muted)' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: `linear-gradient(90deg, ${scoreColor}, var(--gold))` }} />
          </div>
        </div>
      )}

      {results.completedTests.length > 1 && (
        <div className="rounded-2xl p-5 border" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
          <h3 className="font-serif text-lg font-bold mb-3" style={{ color: 'var(--brown)' }}>All Tests ({results.completedTests.length})</h3>
          <div className="space-y-2">
            {results.completedTests.map((test, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg" style={{ background: 'var(--card-bg-secondary)' }}>
                <span className="text-base font-medium" style={{ color: 'var(--text)' }}>{test.career?.title}</span>
                <div className="flex items-center gap-3">
                  <span className="text-sm" style={{ color: 'var(--sub)' }}>{test.score}/{test.totalPoints} pts</span>
                  <span className="text-base font-bold" style={{ color: 'var(--gold)' }}>{test.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="flex flex-wrap gap-3 justify-center">
        <button onClick={onTryAnother} className="btn-gold text-base">
          <i className="fas fa-redo mr-2" style={{ color: 'white' }} />Try Another Career
        </button>
        <button onClick={onRestart} className="btn-outline text-base" style={{ color: 'var(--text)', borderColor: 'var(--border)' }}>
          <i className="fas fa-rotate-left mr-2" style={{ color: 'var(--text)' }} />Start Over
        </button>
        <button onClick={onDashboard} className="btn-gold text-base">
          <i className="fas fa-compass mr-2" style={{ color: 'white' }} />Dashboard
        </button>
      </div>
    </div>
  );
}

// ── MAIN COMPONENT ───────────────────────────────────────────
export default function AssessmentPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [phase, setPhase] = useState('ageGroup');
  const [progress, setProgress] = useState(0);
  const [ageGroup, setAgeGroup] = useState(null);
  const [perDomain, setPerDomain] = useState(Infinity);
  const [selectedInterests, setSelectedInterests] = useState([]);
  const [personalityAnswers, setPersonalityAnswers] = useState([]);
  const [selectedCareer, setSelectedCareer] = useState(null);
  const [completedTests, setCompletedTests] = useState([]);
  const [results, setResults] = useState(null);
  const logoSrc = darkMode ? logoWhite : logo;

  useEffect(() => {
    const s = localStorage.getItem('theme');
    if (s === 'dark') setDarkMode(true);
  }, []);
  useEffect(() => { document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light'); }, [darkMode]);
  const toggleDarkMode = () => { setDarkMode(d => !d); localStorage.setItem('theme', !darkMode ? 'dark' : 'light'); };

  const handleAgeGroupComplete = (g, pd) => { setAgeGroup(g); setPerDomain(pd); setProgress(10); setPhase('interests'); };
  const handleInterestsComplete = (i) => { setSelectedInterests(i); setProgress(30); setPhase('personality'); };
  const handlePersonalityComplete = (a) => { setPersonalityAnswers(a); setProgress(55); setPhase('careers'); };
  const handleBackToAgeGroup = () => { setProgress(0); setPhase('ageGroup'); };
  const handleBackToInterests = () => { setProgress(10); setPhase('interests'); };
  const handleBackToPersonality = () => { setProgress(30); setPhase('personality'); };
  const handleCareerSelect = (c) => {
    if (c === 'browse') { setPhase('browse'); return; }
    setSelectedCareer(c); setProgress(80); setPhase('aptitude');
  };
  const handleBrowseSelect = (c) => { setSelectedCareer(c); setProgress(80); setPhase('aptitude'); };
  const handleBackToCareers = () => { setProgress(55); setPhase('careers'); };
  const handleBackFromBrowse = () => { setProgress(55); setPhase('careers'); };
  const handleAptitudeComplete = (r) => {
    const t = [...completedTests, r];
    setCompletedTests(t);
    setResults({ completedTests: t, bestMatch: t.reduce((b, x) => x.percentage > b.percentage ? x : b, t[0]) });
    setProgress(100); setPhase('results');
  };
  const handleTryAnother = () => { setSelectedCareer(null); setProgress(55); setPhase('careers'); };
  const handleRestart = () => {
    setPhase('ageGroup'); setProgress(0); setAgeGroup(null);
    setSelectedInterests([]); setPersonalityAnswers([]);
    setSelectedCareer(null); setCompletedTests([]); setResults(null);
  };

  return (
    <div className="min-h-screen relative" style={{ background: 'var(--cream)', backgroundImage: 'var(--bg-pattern)' }}>
      <div className="bg-orb bg-orb-1" /><div className="bg-orb bg-orb-2" /><div className="bg-orb bg-orb-3" />

      {/* Nav */}
      <nav className="nav-glass">
        <div className="max-w-7xl mx-auto px-5">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center gap-3">
              <img src={logoSrc} alt="TrueNorth" className="w-10 h-10 object-contain rounded-xl shadow-sm" />
              <span className="font-serif text-xl font-bold" style={{ color: 'var(--brown)' }}>TrueNorth</span>
              <span className="tag-gold text-xs">AI Beta</span>
            </Link>
            <div className="flex items-center gap-5">
              <Link to="/" className="text-sm font-medium hover:underline" style={{ color: 'var(--text-secondary)' }}>Home</Link>
              <button onClick={toggleDarkMode} className="w-9 h-9 rounded-lg border flex items-center justify-center"
                style={{ borderColor: 'var(--border)', color: 'var(--text-secondary)' }}>
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'} text-base`} />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress bar */}
      <div className="border-b px-5 py-2.5" style={{ background: 'var(--card-bg)', borderColor: 'var(--border)' }}>
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
            <div className="h-full rounded-full transition-all duration-700" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, var(--gold), var(--goldDark))' }} />
          </div>
          <span className="text-sm font-bold tabular-nums w-10 text-right" style={{ color: 'var(--text-secondary)' }}>{progress}%</span>
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 flex items-start justify-center p-5 pt-8" style={{ minHeight: 'calc(100vh-120px)' }}>
        <div className="w-full max-w-7xl">
          {phase === 'ageGroup' && <AgeGroupSelector onComplete={handleAgeGroupComplete} />}
          {phase === 'interests' && <AIInterestExplorer ageGroup={ageGroup} onComplete={handleInterestsComplete} onBack={handleBackToAgeGroup} />}
          {phase === 'personality' && (
            <AIPersonalityTest ageGroup={ageGroup} interests={selectedInterests} onComplete={handlePersonalityComplete} onBack={handleBackToInterests} />
          )}
          {phase === 'careers' && (
            <AICareerRecommender
              ageGroup={ageGroup}
              interests={selectedInterests}
              personalityAnswers={personalityAnswers}
              onCareerSelect={handleCareerSelect}
              completedTests={completedTests}
              onBack={handleBackToPersonality}
            />
          )}
          {phase === 'browse' && (
            <CareerExplorer
              ageGroup={ageGroup}
              onCareerSelect={handleBrowseSelect}
              completedTests={completedTests}
              onBack={handleBackFromBrowse}
            />
          )}
          {phase === 'aptitude' && selectedCareer && (
            <AptitudeTest career={selectedCareer} ageGroup={ageGroup} onComplete={handleAptitudeComplete} onBack={handleBackToCareers} />
          )}
          {phase === 'results' && results && (
            <ResultsPage
              results={results}
              onTryAnother={handleTryAnother}
              onRestart={handleRestart}
              onDashboard={() => navigate('/dashboard')}
            />
          )}
        </div>
      </div>
    </div>
  );
}