import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-bg.png';
import portrait from '../assets/portrait.jpg';

export default function HomePage() {
  const [darkMode, setDarkMode] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') setDarkMode(true);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  const scrollToSection = (sectionId) => {
    const element = document.querySelector(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setMobileMenuOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#1A1814] relative" 
      style={{ backgroundImage: 'var(--bg-pattern)' }}>
      
      {/* Background Orbs */}
      <div className="bg-orb bg-orb-1" />
      <div className="bg-orb bg-orb-2" />
      <div className="bg-orb bg-orb-3" />

      {/* Navigation */}
      <nav className="nav-glass">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between py-4">
            <Link to="/" className="flex items-center gap-2">
              <img src={logo} alt="TrueNorth" className="w-8 h-8 object-contain" />
              <span className="font-serif text-2xl font-bold text-gray-800 dark:text-white">TrueNorth</span>
              <span className="tag-gold">AI Beta</span>
            </Link>

            <ul className="hidden md:flex items-center gap-8">
              {['Home', 'Features', 'How it works', 'Reviews', 'Pricing'].map(item => (
                <li key={item}>
                  <button 
                    onClick={() => scrollToSection(`#${item.toLowerCase().replace(' ', '-')}`)}
                    className="font-medium text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                  >
                    {item}
                  </button>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3">
              <button 
                onClick={() => setDarkMode(!darkMode)} 
                className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors text-gray-600 dark:text-gray-300"
              >
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`} />
              </button>
              <Link to="/login" className="hidden sm:block px-4 py-2 font-medium text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                Log in
              </Link>
              <Link to="/assessment" className="btn-gold">
                <i className="fas fa-rocket text-sm" />
                <span>Start free</span>
              </Link>
              <button 
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)} 
                className="md:hidden p-2 text-gray-600 dark:text-gray-300"
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-xl`} />
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 border-t border-gray-200 dark:border-gray-700">
              {['Home', 'Features', 'How it works', 'Reviews', 'Pricing'].map(item => (
                <button
                  key={item}
                  onClick={() => scrollToSection(`#${item.toLowerCase().replace(' ', '-')}`)}
                  className="block w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                >
                  {item}
                </button>
              ))}
              <Link to="/login" className="block w-full text-left px-4 py-3 rounded-lg font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800">
                Log in
              </Link>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section with Portrait */}
      <section id="home" className="relative py-16 md:py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            {/* Left Content */}
            <div className="flex-1 text-center lg:text-left">
              <span className="tag-gold mb-4 inline-flex">
                <span className="w-2 h-2 bg-amber-500 rounded-full animate-pulse mr-2" />
                AI-Powered Career Intelligence
              </span>
              
              <h1 className="font-serif text-5xl md:text-6xl lg:text-7xl font-bold text-gray-800 dark:text-white mb-6 leading-tight">
                Stop guessing<br />
                your <span className="text-gradient">future.</span><br />
                <span className="relative">
                  Get a roadmap.
                  <span className="absolute -bottom-2 left-0 w-3/4 h-2 bg-amber-200/30 dark:bg-amber-800/20 rounded-full -z-10" />
                </span>
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-xl lg:mx-0 mx-auto">
                A data-driven career platform that decodes your personality, strengths, and skill gaps —
                then builds you a <strong className="text-gray-800 dark:text-white">step-by-step visual roadmap</strong> to your dream career.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link to="/assessment" className="btn-gold text-lg px-8 py-4">
                  <i className="fas fa-rocket" /> Start free — 5-min assessment
                </Link>
                <button onClick={() => scrollToSection('#demo')} className="btn-outline text-lg px-8 py-4">
                  <i className="fas fa-play-circle text-amber-600 dark:text-amber-400" /> View demo
                </button>
              </div>
              
              <div className="flex flex-wrap gap-6 justify-center lg:justify-start mt-8 text-sm text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1"><i className="fas fa-circle-check text-green-600" /> No credit card</span>
                <span className="flex items-center gap-1"><i className="fas fa-clock" /> 5-min assessment</span>
                <span className="flex items-center gap-1"><i className="fas fa-chart-line" /> 87% match accuracy</span>
              </div>

              <div className="flex items-center gap-3 mt-8 justify-center lg:justify-start">
                <div className="flex -space-x-2">
                  {['PS', 'AM', 'SR', 'RG'].map((initials, i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-white text-sm font-semibold border-2 border-white dark:border-gray-800">
                      {initials}
                    </div>
                  ))}
                </div>
                <span className="text-sm font-medium text-gray-600 dark:text-gray-300">
                  <strong className="text-amber-600 dark:text-amber-400">2M+</strong> students guided
                </span>
              </div>
            </div>

            {/* Right Portrait */}
            <div className="flex-1 flex justify-center lg:justify-end">
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-amber-200/30 to-amber-100/20 dark:from-amber-900/20 dark:to-amber-800/10 rounded-3xl blur-2xl" />
                <div className="relative w-80 h-96 md:w-96 md:h-[450px] rounded-3xl overflow-hidden border-4 border-white dark:border-gray-800 shadow-2xl">
                  <img 
                    src={portrait} 
                    alt="Student working on laptop" 
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-4 -left-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-3 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <i className="fas fa-check-circle text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-800 dark:text-white">Career Match</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">94% Data Scientist</div>
                  </div>
                </div>
                <div className="absolute -top-4 -right-4 bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-3">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1,2,3,4,5].map(i => (
                        <i key={i} className="fas fa-star text-amber-400 text-xs" />
                      ))}
                    </div>
                    <span className="text-sm font-semibold text-gray-800 dark:text-white">4.9</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trusted by section */}
      <div className="py-12 border-y border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-sm uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-6">
            Trusted by students from
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-12">
            <div className="flex items-center gap-2 text-2xl text-gray-500 dark:text-gray-400">
              <i className="fab fa-google" />
              <span className="text-base font-medium">Google</span>
            </div>
            <div className="flex items-center gap-2 text-2xl text-gray-500 dark:text-gray-400">
              <i className="fab fa-microsoft" />
              <span className="text-base font-medium">Microsoft</span>
            </div>
            <div className="flex items-center gap-2 text-2xl text-gray-500 dark:text-gray-400">
              <i className="fas fa-university" />
              <span className="text-base font-medium">IIT · NIT · BITS</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <section className="py-16 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { value: '2M+', label: 'Students Guided' },
              { value: '87%', label: 'Match Accuracy' },
              { value: '340+', label: 'Career Pathways' },
              { value: '4.9 ★', label: 'Student Rating' }
            ].map((stat, i) => (
              <div key={i}>
                <div className="text-4xl md:text-5xl font-bold text-gradient mb-2">{stat.value}</div>
                <div className="text-gray-600 dark:text-gray-400">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="tag-gold mb-4">Features</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Everything you need to navigate your future
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
              Built for students who want clarity, not confusion.
            </p>
            <div className="divider-gold" />
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: 'fa-brain', title: 'AI Career Matching', desc: 'Aptitude + personality + interests → your top career matches with percentage fit scores.' },
              { icon: 'fa-chart-bar', title: 'Skill Gap Analysis', desc: 'See exactly which skills you\'re missing, in priority order, with time estimates.' },
              { icon: 'fa-map', title: 'Visual Roadmaps', desc: 'Game-style interactive level maps taking you step-by-step from learner to job-ready.' },
              { icon: 'fa-file-lines', title: 'Resume Scoring', desc: 'Get a recruiter-style score on your resume — skills, projects, all evaluated.' },
              { icon: 'fa-comments', title: 'AI Chat Assistant', desc: '"Data Science vs Web Dev?" — salary, growth rate, required skills, live inside chat.' },
              { icon: 'fa-chart-line', title: 'Market Demand Data', desc: 'Trending careers, real salary ranges, and hiring growth percentages updated monthly.' }
            ].map((f, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm hover:shadow-md transition-all hover:border-amber-200 dark:hover:border-amber-800">
                <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-900/20 flex items-center justify-center mb-4">
                  <i className={`fas ${f.icon} text-xl text-amber-600 dark:text-amber-400`} />
                </div>
                <h3 className="font-serif text-xl font-bold text-gray-800 dark:text-white mb-2">{f.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-6 bg-gray-50 dark:bg-gray-800/30">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="tag-gold mb-4">How it works</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              Three steps to career clarity
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
              From self-discovery to a step-by-step plan — all in under 10 minutes.
            </p>
            <div className="divider-gold" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '01', title: 'Take Assessment', desc: '5-minute, 3-phase test — interests, personality, and aptitude.' },
              { step: '02', title: 'Get AI Insights', desc: 'Career match %, skill gap report, and personality profile instantly.' },
              { step: '03', title: 'Follow Roadmap', desc: 'Interactive step-by-step visual roadmap to your ideal career.' }
            ].map((s, i) => (
              <div key={i} className="text-center">
                <div className="font-serif text-6xl font-bold text-amber-600 dark:text-amber-400 mb-4">{s.step}</div>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-3">{s.title}</h3>
                <p className="text-gray-600 dark:text-gray-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="reviews" className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <span className="tag-gold mb-4">Reviews</span>
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 dark:text-white mb-4">
              What students say
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-6">
              Thousands of students found direction using TrueNorth.
            </p>
            <div className="divider-gold" />
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { name: 'Priya Sharma', role: 'IIT Delhi', text: 'TrueNorth changed my entire preparation strategy. The skill gap report is a game changer.' },
              { name: 'Arjun Mehta', role: 'DU', text: 'I thought I wanted to be a CA. Assessment showed I\'m better for fintech product management.' },
              { name: 'Sneha Rao', role: 'BITS Pilani', text: 'Followed the roadmap and landed my first internship in bioinformatics.' }
            ].map((t, i) => (
              <div key={i} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-8 shadow-sm">
                <div className="flex gap-1 mb-4 text-amber-400">
                  {[1,2,3,4,5].map(i => <i key={i} className="fas fa-star text-sm" />)}
                </div>
                <p className="text-gray-600 dark:text-gray-400 mb-4">"{t.text}"</p>
                <div>
                  <div className="font-semibold text-gray-800 dark:text-white">{t.name}</div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">{t.role}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA / Pricing Section */}
      <section id="pricing" className="py-24 px-6 bg-gray-50/50">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-white rounded-3xl p-12 shadow-sm border border-gray-100">
            <img src={logo} alt="TrueNorth" className="w-20 h-20 mx-auto mb-6 object-contain" />
            <h2 className="font-serif text-4xl md:text-5xl font-bold text-gray-800 mb-4">
              Start your journey to <span className="text-gradient">True North</span>
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Join 2M+ students who stopped guessing and started building careers with real clarity.
            </p>
            
            <div className="grid md:grid-cols-3 gap-4 mb-8">
              {/* Free Tier */}
              <div className="p-6 rounded-xl border border-gray-200">
                <div className="text-lg font-bold text-gray-800 mb-2">Free</div>
                <div className="text-3xl font-bold text-gray-800 mb-4">₹0</div>
                <ul className="text-sm space-y-2 mb-4 text-gray-600">
                  <li><i className="fas fa-check text-green-600 mr-2" />Full assessment</li>
                  <li><i className="fas fa-check text-green-600 mr-2" />Top 3 career matches</li>
                  <li><i className="fas fa-check text-green-600 mr-2" />Basic roadmap</li>
                </ul>
                <Link 
                  to="/assessment" 
                  className="block w-full py-2 px-4 border border-gray-300 rounded-full font-medium text-gray-700 hover:border-amber-500 hover:bg-amber-50 transition-all text-sm text-center"
                >
                  Get Started
                </Link>
              </div>
              
              {/* Pro Tier */}
              <div className="p-6 rounded-xl border-2 border-amber-400 bg-amber-50/30 relative">
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 tag-gold">Most Popular</div>
                <div className="text-lg font-bold text-gray-800 mb-2">Pro</div>
                <div className="text-3xl font-bold text-gray-800 mb-4">
                  ₹299<span className="text-sm font-normal text-gray-500">/mo</span>
                </div>
                <ul className="text-sm space-y-2 mb-4 text-gray-600">
                  <li><i className="fas fa-check text-green-600 mr-2" />Everything in Free</li>
                  <li><i className="fas fa-check text-green-600 mr-2" />Full skill gap report</li>
                  <li><i className="fas fa-check text-green-600 mr-2" />Unlimited AI chat</li>
                  <li><i className="fas fa-check text-green-600 mr-2" />Resume scoring</li>
                </ul>
                <Link 
                  to="/assessment" 
                  className="block w-full py-2 px-4 bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-full font-semibold hover:shadow-lg transition-all text-sm text-center"
                >
                  Start Pro
                </Link>
              </div>
              
              {/* Counselor Tier */}
              <div className="p-6 rounded-xl border border-gray-200">
                <div className="text-lg font-bold text-gray-800 mb-2">Counselor</div>
                <div className="text-3xl font-bold text-gray-800 mb-4">
                  ₹999<span className="text-sm font-normal text-gray-500">/mo</span>
                </div>
                <ul className="text-sm space-y-2 mb-4 text-gray-600">
                  <li><i className="fas fa-check text-green-600 mr-2" />Everything in Pro</li>
                  <li><i className="fas fa-check text-green-600 mr-2" />1-on-1 sessions</li>
                  <li><i className="fas fa-check text-green-600 mr-2" />Priority support</li>
                </ul>
                <button className="block w-full py-2 px-4 border border-gray-300 rounded-full font-medium text-gray-700 hover:border-amber-500 hover:bg-amber-50 transition-all text-sm">
                  Contact Us
                </button>
              </div>
            </div>
            
            <p className="text-sm text-gray-500">
              <i className="fas fa-lock mr-1" /> No credit card required · Cancel anytime
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <img src={logo} alt="TrueNorth" className="w-8 h-8 object-contain" />
                <span className="font-serif text-xl font-bold text-gray-800 dark:text-white">TrueNorth</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                AI-powered career guidance that reveals what you can & cannot — so you choose with real confidence.
              </p>
              <div className="flex gap-3">
                {['twitter', 'linkedin-in', 'instagram', 'discord', 'youtube'].map(social => (
                  <a key={social} href="#" className="w-9 h-9 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                    <i className={`fab fa-${social}`} />
                  </a>
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><button onClick={() => scrollToSection('#features')} className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400">Features</button></li>
                <li><button onClick={() => scrollToSection('#pricing')} className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400">Pricing</button></li>
                <li><Link to="/assessment" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400">Assessment</Link></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400">Roadmaps</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400">About</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400">Blog</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400">Careers</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400">Contact</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold text-gray-800 dark:text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400">Privacy Policy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400">Terms of Service</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400">Cookie Policy</a></li>
                <li><a href="#" className="text-gray-600 dark:text-gray-400 hover:text-amber-600 dark:hover:text-amber-400">Security</a></li>
              </ul>
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-200 dark:border-gray-700 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              © 2026 TrueNorth, Inc. All rights reserved. — guiding students to clarity.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}