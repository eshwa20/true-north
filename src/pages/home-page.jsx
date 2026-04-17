<<<<<<< HEAD
import { Link } from 'react-router-dom';
import './home-style.css';



export default function HomePage() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="home-page">

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="nav">
        <div className="wrap">
          <div className="nav-inner">
            <a href="#" className="nav-logo">
              <div className="nav-logo-mark"><i className="fas fa-compass"></i></div>
              <span className="nav-logo-name">TrueNorth</span>
              <span className="nav-logo-badge">AI Beta</span>
            </a>

            <ul className="nav-links">
              <li><a href="#" className="nav-link">Home</a></li>
              <li><a href="#" className="nav-link">Features <i className="fas fa-chevron-down"></i></a></li>
              <li><a href="#" className="nav-link">Roadmaps</a></li>
              <li><a href="#" className="nav-link">Pricing</a></li>
              <li><a href="#" className="nav-link">Blog</a></li>
            </ul>

            <div className="nav-actions">
              <Link to="/login" className="nav-login">Log in</Link>
              <a href="#" className="nav-cta"><i className="fas fa-arrow-right"></i>&ensp;Start free</a>
              <button className="nav-ham"><i className="fas fa-bars"></i></button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <svg className="hero-arc" viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="520" cy="0" r="200" />
          <circle cx="520" cy="0" r="320" />
          <circle cx="520" cy="0" r="440" />
        </svg>

        <div className="wrap">
          <div className="hero-inner">

            {/* Left */}
            <div>
              <div className="hero-eyebrow">
                <span className="tag">
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--c-gold)', animation: 'glow-pulse 2s ease-in-out infinite' }}></span>
                  Intelligent guidance for 10M+ students
                </span>
              </div>

              <h1 className="hero-h1">
                Know what<br />
                you <em>can</em> &amp;<br />
                <span className="underline-gold">cannot</span> do
              </h1>

              <p className="hero-p">
                Not just a career test — an AI that decodes your personality, strengths,
                and limits. <strong>Visual roadmaps · skill gap analysis · live mentor chat.</strong>
              </p>

              <div className="hero-actions">
                <a href="#" className="btn-gold" style={{ fontSize: '1rem', padding: '.95rem 2.1rem' }}>
                  <i className="fas fa-paper-plane"></i> Find my direction — it's free
                </a>
                <a href="#" className="btn-outline" style={{ fontSize: '1rem', padding: '.95rem 2rem' }}>
                  <i className="fas fa-play-circle" style={{ color: 'var(--c-gold)' }}></i> See platform
                </a>
              </div>

              <div className="hero-trust">
                <div className="trust-item"><i className="fas fa-circle-check"></i> No credit card</div>
                <div className="trust-item"><i className="fas fa-clock"></i> 5-min assessment</div>
                <div className="trust-item"><i className="fas fa-chart-line"></i> 87% match accuracy</div>
              </div>
            </div>

            {/* Right — AI Card */}
            <div className="hero-card-wrap">
              <svg className="score-ring" viewBox="0 0 88 88">
                <circle cx="44" cy="44" r="38" fill="none" stroke="var(--c-linen)" strokeWidth="4" />
                <circle cx="44" cy="44" r="38" fill="none"
                  stroke="var(--c-gold)" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="212" strokeDashoffset="18"
                  transform="rotate(-90 44 44)"
                  style={{ animation: 'dash 1.5s var(--ease-out) .6s both', strokeDashoffset: '18' }}
                />
                <text x="44" y="49" textAnchor="middle"
                  fontFamily="'Playfair Display',serif" fontSize="14" fontWeight="700"
                  fill="var(--c-gold-dk)">94%</text>
              </svg>

              <div className="hero-card">
                <div className="card-header">
                  <div className="card-header-label">
                    <i className="fas fa-robot"></i> AI Assessment Engine
                  </div>
                  <div className="live-badge">
                    <span className="live-dot"></span> Live
                  </div>
                </div>

                <div className="metric-row">
                  <div className="metric-icon mi-gold"><i className="fas fa-brain"></i></div>
                  <div style={{ flex: 1 }}>
                    <div className="metric-title">Aptitude · 92%</div>
                    <div className="prog-track"><div className="prog-fill" style={{ width: '92%' }}></div></div>
                  </div>
                </div>

                <div className="metric-row">
                  <div className="metric-icon mi-warm"><i className="fas fa-heart"></i></div>
                  <div style={{ flex: 1 }}>
                    <div className="metric-title">Interest · 78%</div>
                    <div className="prog-track"><div className="prog-fill prog-fill-taupe" style={{ width: '78%' }}></div></div>
                  </div>
                </div>

                <div className="metric-row">
                  <div className="metric-icon mi-linen"><i className="fas fa-user-check"></i></div>
                  <div>
                    <div className="metric-title">Personality (INTJ)</div>
                    <div className="metric-sub">strategist · independent</div>
                  </div>
                </div>

                <div className="card-stats">
                  <div className="card-stat">
                    <div className="stat-label">Top match</div>
                    <div className="stat-value">Data Scientist</div>
                    <div className="stat-note">94% fit</div>
                  </div>
                  <div className="card-stat">
                    <div className="stat-label">Skill gap</div>
                    <div className="stat-value">SQL, Python</div>
                    <div className="stat-note stat-note-muted">3 months to close</div>
                  </div>
                </div>

                <div className="card-footer">
                  <i className="fas fa-arrow-right"></i> full career report
                </div>
              </div>

              <div className="hero-badge">
                <div className="badge-icon"><i className="fas fa-circle-check"></i></div>
                <div>
                  <div className="badge-main">What you CAN do</div>
                  <div className="badge-sub">discover your strengths</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ────────────────────────────────────── */}
      <div className="proof">
        <div className="wrap">
          <p className="proof-label">Trusted by career counselors at</p>
          <div className="proof-logos">
            <i className="fab fa-google"></i>
            <i className="fab fa-microsoft"></i>
            <i className="fas fa-university"></i>
            <i className="fas fa-graduation-cap"></i>
            <i className="fab fa-linkedin"></i>
            <span>IIT · NIT</span>
          </div>
        </div>
      </div>

      {/* ── STATS STRIP ─────────────────────────────────────── */}
      <div className="stats-strip">
        <div className="wrap">
          <div className="stats-inner">
            <div>
              <div className="stat-block-num">2M+</div>
              <div className="stat-block-lbl">Students guided</div>
            </div>
            <div>
              <div className="stat-block-num">87%</div>
              <div className="stat-block-lbl">Match accuracy</div>
            </div>
            <div>
              <div className="stat-block-num">340+</div>
              <div className="stat-block-lbl">Career pathways</div>
            </div>
            <div>
              <div className="stat-block-num">4.9★</div>
              <div className="stat-block-lbl">Average rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section className="features">
        <div className="wrap">
          <div className="section-header">
            <span className="tag"><i className="fas fa-microchip"></i> AI-Powered Intelligence</span>
            <h2 className="section-h2">Everything you need<br />to navigate your future</h2>
            <p className="section-sub">From self-discovery to market trends — built for students who want clarity, not confusion.</p>
          </div>

          <div className="feat-grid">
            <div className="feat-card">
              <div className="feat-icon fi-1"><i className="fas fa-microchip"></i></div>
              <h3 className="feat-title">Smart Career Engine</h3>
              <p className="feat-desc">Aptitude + interest + skill + personality (MBTI) → career match %, top 5 roles &amp; a personalized skill gap report.</p>
            </div>

            <div className="feat-card">
              <div className="feat-icon fi-2"><i className="fas fa-map-signs"></i></div>
              <h3 className="feat-title">Interactive Roadmap</h3>
              <p className="feat-desc">Game-style level map — step from "learn HTML" to "apply to internship" with animated nodes and live progress.</p>
              <span className="feat-pill">React Flow · D3</span>
            </div>

            <div className="feat-card">
              <div className="feat-icon fi-3"><i className="fas fa-chart-simple"></i></div>
              <h3 className="feat-title">Skill Gap Analyzer</h3>
              <p className="feat-desc">Compare current vs. target career. See missing skills, priority order, and estimated time to close the gap.</p>
            </div>

            <div className="feat-card">
              <div className="feat-icon fi-4"><i className="fas fa-comment-dots"></i></div>
              <h3 className="feat-title">AI Chat Assistant</h3>
              <p className="feat-desc">"Data Science vs Web Dev?" — salary, growth rate, required skills and market demand, live inside chat.</p>
            </div>

            <div className="feat-card">
              <div className="feat-icon fi-5"><i className="fas fa-chart-line"></i></div>
              <h3 className="feat-title">Market Demand</h3>
              <p className="feat-desc">Trending careers, real salary ranges, and hiring growth percentages. Data-backed decisions only.</p>
            </div>

            <div className="feat-card">
              <div className="feat-icon fi-6"><i className="fas fa-file-lines"></i></div>
              <h3 className="feat-title">Resume Readiness</h3>
              <p className="feat-desc"><strong>Score: 72%</strong> — evaluated on skills, projects, and certifications. The recruiter-friendly metric you need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROADMAP SHOWCASE ────────────────────────────────── */}
      <section className="roadmap-section">
        <div className="wrap">
          <div className="roadmap-card">
            <div className="roadmap-head">
              <div>
                <span className="tag"><i className="fas fa-map"></i> Interactive Roadmap (beta)</span>
                <h2 className="roadmap-title">Frontend Developer · Level Map</h2>
              </div>
              <div className="progress-badge">
                <i className="fas fa-flag-checkered"></i> Progress 4 / 8 steps
              </div>
            </div>

            <div className="roadmap-steps">
              <div className="roadmap-line"></div>
              <div className="roadmap-line-fill"></div>

              <div className="rm-step">
                <div className="rm-node rm-done">1</div>
                <span className="rm-label">HTML/CSS</span>
              </div>
              <div className="rm-step">
                <div className="rm-node rm-done">2</div>
                <span className="rm-label">JavaScript</span>
              </div>
              <div className="rm-step">
                <div className="rm-node rm-done">3</div>
                <span className="rm-label">React</span>
              </div>
              <div className="rm-step">
                <div className="rm-node rm-active">4</div>
                <span className="rm-label">3 Projects</span>
                <span className="rm-sub">Current</span>
              </div>
              <div className="rm-step">
                <div className="rm-node rm-locked">5</div>
                <span className="rm-label rm-label-dim">Internship</span>
              </div>
              <div className="rm-step">
                <div className="rm-node rm-locked">6</div>
                <span className="rm-label rm-label-dim">Apply</span>
              </div>
            </div>

            <div className="roadmap-hint">
              <i className="fas fa-arrows-rotate"></i>
              Drag to explore · zoom · click nodes for details
            </div>
          </div>
        </div>
      </section>

      {/* ── AI CHAT DEMO ────────────────────────────────────── */}
      <section className="demo-section">
        <div className="wrap">
          <div className="demo-card">

            <div className="demo-left">
              <span className="tag"><i className="fas fa-comment"></i> AI Career Assistant</span>
              <h2 className="demo-h3">"What can I do if I love biology but <em>hate memorization?</em>"</h2>
              <p className="demo-body">Our AI analyzes your <span>unique blend</span> — strengths, limits, interests — and surfaces careers you'd never have considered.</p>
              <div className="demo-tags">
                <span className="demo-tag"><i className="fas fa-flask"></i> Biotech Consultant</span>
                <span className="demo-tag"><i className="fas fa-dna"></i> Genetic Counselor</span>
                <span className="demo-tag"><i className="fas fa-chart-pie"></i> Bioinformatics</span>
              </div>
            </div>

            <div className="demo-right">
              <div className="chat-bubble">
                <div className="chat-head">
                  <div className="chat-avatar"><i className="fas fa-robot"></i></div>
                  <div>
                    <div className="chat-name">TrueNorth AI</div>
                    <div className="chat-time">just now</div>
                  </div>
                </div>
                <p className="chat-msg"><span className="chat-can">Can do:</span> research-oriented roles, biotech patent analyst, environmental health specialist — your logical score (84%) is a strong fit.</p>
                <p className="chat-msg"><span className="chat-warn">Not ideal:</span> memorization-heavy clinical roles — your personality profile shows strong preference for conceptual thinking.</p>
                <div className="chat-cta-row">
                  <i className="fas fa-lightbulb" style={{ color: 'var(--c-gold)' }}></i>
                  3 alternative paths with 90%+ match — view now
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="wrap">
          <div className="cta-inner">
            <div className="cta-ring cr-1"></div>
            <div className="cta-ring cr-2"></div>
            <div className="cta-ring cr-3"></div>

            <div className="cta-icon"><i className="fas fa-compass"></i></div>
            <h2 className="cta-h2">Ready to find your<br />True North?</h2>
            <p className="cta-p">Join 2M+ students who stopped guessing and started building careers with clarity.</p>
            <div className="cta-btns">
              <a href="#" className="btn-gold" style={{ fontSize: '1.05rem', padding: '1rem 2.4rem' }}>
                <i className="fas fa-rocket"></i> Start free — 5-min assessment
              </a>
              <a href="#" className="btn-outline" style={{ fontSize: '1.05rem', padding: '1rem 2.2rem' }}>
                <i className="fas fa-calendar"></i> Book a counselor
              </a>
            </div>
            <p className="cta-note"><i className="fas fa-lock"></i> No credit card · instant report · cancel anytime</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-grid">

            <div>
              <div className="footer-brand-mark">
                <div className="footer-mark-icon"><i className="fas fa-compass"></i></div>
                <span className="footer-brand-name">TrueNorth</span>
              </div>
              <p className="footer-brand-desc">AI that reveals what you can &amp; cannot — so you choose studies and career with real confidence.</p>
            </div>

            <div>
              <h4 className="footer-col-h">Product</h4>
              <ul className="footer-links">
                <li><a href="#">Features</a></li>
                <li><a href="#">Roadmaps</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-h">Company</h4>
              <ul className="footer-links">
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-h">Legal</h4>
              <ul className="footer-links">
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>

          </div>

          <div className="footer-bottom">
            <span className="footer-copy">© 2026 TrueNorth, Inc. — guiding students to clarity.</span>
            <div className="footer-socials">
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
              <a href="#"><i className="fab fa-github"></i></a>
              <a href="#"><i className="fab fa-discord"></i></a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── BACK TO TOP ─────────────────────────────────────── */}
      <button className="to-top" onClick={scrollToTop}>
        <i className="fas fa-arrow-up"></i>
      </button>

    </div>
  );
=======
import { Link } from 'react-router-dom';
import './home-style.css';



export default function HomePage() {
  const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <div className="home-page">

      {/* ── NAV ─────────────────────────────────────────────── */}
      <nav className="nav">
        <div className="wrap">
          <div className="nav-inner">
            <a href="#" className="nav-logo">
              <div className="nav-logo-mark"><i className="fas fa-compass"></i></div>
              <span className="nav-logo-name">TrueNorth</span>
              <span className="nav-logo-badge">AI Beta</span>
            </a>

            <ul className="nav-links">
              <li><a href="#" className="nav-link">Home</a></li>
              <li><a href="#" className="nav-link">Features <i className="fas fa-chevron-down"></i></a></li>
              <li><a href="#" className="nav-link">Roadmaps</a></li>
              <li><a href="#" className="nav-link">Pricing</a></li>
              <li><a href="#" className="nav-link">Blog</a></li>
            </ul>

            <div className="nav-actions">
              <Link to="/login" className="nav-login">Log in</Link>
              <a href="#" className="nav-cta"><i className="fas fa-arrow-right"></i>&ensp;Start free</a>
              <button className="nav-ham"><i className="fas fa-bars"></i></button>
            </div>
          </div>
        </div>
      </nav>

      {/* ── HERO ────────────────────────────────────────────── */}
      <section className="hero">
        <div className="hero-orb hero-orb-1"></div>
        <div className="hero-orb hero-orb-2"></div>
        <svg className="hero-arc" viewBox="0 0 520 520" fill="none" xmlns="http://www.w3.org/2000/svg">
          <circle cx="520" cy="0" r="200" />
          <circle cx="520" cy="0" r="320" />
          <circle cx="520" cy="0" r="440" />
        </svg>

        <div className="wrap">
          <div className="hero-inner">

            {/* Left */}
            <div>
              <div className="hero-eyebrow">
                <span className="tag">
                  <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--c-gold)', animation: 'glow-pulse 2s ease-in-out infinite' }}></span>
                  Intelligent guidance for 10M+ students
                </span>
              </div>

              <h1 className="hero-h1">
                Know what<br />
                you <em>can</em> &amp;<br />
                <span className="underline-gold">cannot</span> do
              </h1>

              <p className="hero-p">
                Not just a career test — an AI that decodes your personality, strengths,
                and limits. <strong>Visual roadmaps · skill gap analysis · live mentor chat.</strong>
              </p>

              <div className="hero-actions">
                <a href="#" className="btn-gold" style={{ fontSize: '1rem', padding: '.95rem 2.1rem' }}>
                  <i className="fas fa-paper-plane"></i> Find my direction — it's free
                </a>
                <a href="#" className="btn-outline" style={{ fontSize: '1rem', padding: '.95rem 2rem' }}>
                  <i className="fas fa-play-circle" style={{ color: 'var(--c-gold)' }}></i> See platform
                </a>
              </div>

              <div className="hero-trust">
                <div className="trust-item"><i className="fas fa-circle-check"></i> No credit card</div>
                <div className="trust-item"><i className="fas fa-clock"></i> 5-min assessment</div>
                <div className="trust-item"><i className="fas fa-chart-line"></i> 87% match accuracy</div>
              </div>
            </div>

            {/* Right — AI Card */}
            <div className="hero-card-wrap">
              <svg className="score-ring" viewBox="0 0 88 88">
                <circle cx="44" cy="44" r="38" fill="none" stroke="var(--c-linen)" strokeWidth="4" />
                <circle cx="44" cy="44" r="38" fill="none"
                  stroke="var(--c-gold)" strokeWidth="4"
                  strokeLinecap="round"
                  strokeDasharray="212" strokeDashoffset="18"
                  transform="rotate(-90 44 44)"
                  style={{ animation: 'dash 1.5s var(--ease-out) .6s both', strokeDashoffset: '18' }}
                />
                <text x="44" y="49" textAnchor="middle"
                  fontFamily="'Playfair Display',serif" fontSize="14" fontWeight="700"
                  fill="var(--c-gold-dk)">94%</text>
              </svg>

              <div className="hero-card">
                <div className="card-header">
                  <div className="card-header-label">
                    <i className="fas fa-robot"></i> AI Assessment Engine
                  </div>
                  <div className="live-badge">
                    <span className="live-dot"></span> Live
                  </div>
                </div>

                <div className="metric-row">
                  <div className="metric-icon mi-gold"><i className="fas fa-brain"></i></div>
                  <div style={{ flex: 1 }}>
                    <div className="metric-title">Aptitude · 92%</div>
                    <div className="prog-track"><div className="prog-fill" style={{ width: '92%' }}></div></div>
                  </div>
                </div>

                <div className="metric-row">
                  <div className="metric-icon mi-warm"><i className="fas fa-heart"></i></div>
                  <div style={{ flex: 1 }}>
                    <div className="metric-title">Interest · 78%</div>
                    <div className="prog-track"><div className="prog-fill prog-fill-taupe" style={{ width: '78%' }}></div></div>
                  </div>
                </div>

                <div className="metric-row">
                  <div className="metric-icon mi-linen"><i className="fas fa-user-check"></i></div>
                  <div>
                    <div className="metric-title">Personality (INTJ)</div>
                    <div className="metric-sub">strategist · independent</div>
                  </div>
                </div>

                <div className="card-stats">
                  <div className="card-stat">
                    <div className="stat-label">Top match</div>
                    <div className="stat-value">Data Scientist</div>
                    <div className="stat-note">94% fit</div>
                  </div>
                  <div className="card-stat">
                    <div className="stat-label">Skill gap</div>
                    <div className="stat-value">SQL, Python</div>
                    <div className="stat-note stat-note-muted">3 months to close</div>
                  </div>
                </div>

                <div className="card-footer">
                  <i className="fas fa-arrow-right"></i> full career report
                </div>
              </div>

              <div className="hero-badge">
                <div className="badge-icon"><i className="fas fa-circle-check"></i></div>
                <div>
                  <div className="badge-main">What you CAN do</div>
                  <div className="badge-sub">discover your strengths</div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF ────────────────────────────────────── */}
      <div className="proof">
        <div className="wrap">
          <p className="proof-label">Trusted by career counselors at</p>
          <div className="proof-logos">
            <i className="fab fa-google"></i>
            <i className="fab fa-microsoft"></i>
            <i className="fas fa-university"></i>
            <i className="fas fa-graduation-cap"></i>
            <i className="fab fa-linkedin"></i>
            <span>IIT · NIT</span>
          </div>
        </div>
      </div>

      {/* ── STATS STRIP ─────────────────────────────────────── */}
      <div className="stats-strip">
        <div className="wrap">
          <div className="stats-inner">
            <div>
              <div className="stat-block-num">2M+</div>
              <div className="stat-block-lbl">Students guided</div>
            </div>
            <div>
              <div className="stat-block-num">87%</div>
              <div className="stat-block-lbl">Match accuracy</div>
            </div>
            <div>
              <div className="stat-block-num">340+</div>
              <div className="stat-block-lbl">Career pathways</div>
            </div>
            <div>
              <div className="stat-block-num">4.9★</div>
              <div className="stat-block-lbl">Average rating</div>
            </div>
          </div>
        </div>
      </div>

      {/* ── FEATURES ────────────────────────────────────────── */}
      <section className="features">
        <div className="wrap">
          <div className="section-header">
            <span className="tag"><i className="fas fa-microchip"></i> AI-Powered Intelligence</span>
            <h2 className="section-h2">Everything you need<br />to navigate your future</h2>
            <p className="section-sub">From self-discovery to market trends — built for students who want clarity, not confusion.</p>
          </div>

          <div className="feat-grid">
            <div className="feat-card">
              <div className="feat-icon fi-1"><i className="fas fa-microchip"></i></div>
              <h3 className="feat-title">Smart Career Engine</h3>
              <p className="feat-desc">Aptitude + interest + skill + personality (MBTI) → career match %, top 5 roles &amp; a personalized skill gap report.</p>
            </div>

            <div className="feat-card">
              <div className="feat-icon fi-2"><i className="fas fa-map-signs"></i></div>
              <h3 className="feat-title">Interactive Roadmap</h3>
              <p className="feat-desc">Game-style level map — step from "learn HTML" to "apply to internship" with animated nodes and live progress.</p>
              <span className="feat-pill">React Flow · D3</span>
            </div>

            <div className="feat-card">
              <div className="feat-icon fi-3"><i className="fas fa-chart-simple"></i></div>
              <h3 className="feat-title">Skill Gap Analyzer</h3>
              <p className="feat-desc">Compare current vs. target career. See missing skills, priority order, and estimated time to close the gap.</p>
            </div>

            <div className="feat-card">
              <div className="feat-icon fi-4"><i className="fas fa-comment-dots"></i></div>
              <h3 className="feat-title">AI Chat Assistant</h3>
              <p className="feat-desc">"Data Science vs Web Dev?" — salary, growth rate, required skills and market demand, live inside chat.</p>
            </div>

            <div className="feat-card">
              <div className="feat-icon fi-5"><i className="fas fa-chart-line"></i></div>
              <h3 className="feat-title">Market Demand</h3>
              <p className="feat-desc">Trending careers, real salary ranges, and hiring growth percentages. Data-backed decisions only.</p>
            </div>

            <div className="feat-card">
              <div className="feat-icon fi-6"><i className="fas fa-file-lines"></i></div>
              <h3 className="feat-title">Resume Readiness</h3>
              <p className="feat-desc"><strong>Score: 72%</strong> — evaluated on skills, projects, and certifications. The recruiter-friendly metric you need.</p>
            </div>
          </div>
        </div>
      </section>

      {/* ── ROADMAP SHOWCASE ────────────────────────────────── */}
      <section className="roadmap-section">
        <div className="wrap">
          <div className="roadmap-card">
            <div className="roadmap-head">
              <div>
                <span className="tag"><i className="fas fa-map"></i> Interactive Roadmap (beta)</span>
                <h2 className="roadmap-title">Frontend Developer · Level Map</h2>
              </div>
              <div className="progress-badge">
                <i className="fas fa-flag-checkered"></i> Progress 4 / 8 steps
              </div>
            </div>

            <div className="roadmap-steps">
              <div className="roadmap-line"></div>
              <div className="roadmap-line-fill"></div>

              <div className="rm-step">
                <div className="rm-node rm-done">1</div>
                <span className="rm-label">HTML/CSS</span>
              </div>
              <div className="rm-step">
                <div className="rm-node rm-done">2</div>
                <span className="rm-label">JavaScript</span>
              </div>
              <div className="rm-step">
                <div className="rm-node rm-done">3</div>
                <span className="rm-label">React</span>
              </div>
              <div className="rm-step">
                <div className="rm-node rm-active">4</div>
                <span className="rm-label">3 Projects</span>
                <span className="rm-sub">Current</span>
              </div>
              <div className="rm-step">
                <div className="rm-node rm-locked">5</div>
                <span className="rm-label rm-label-dim">Internship</span>
              </div>
              <div className="rm-step">
                <div className="rm-node rm-locked">6</div>
                <span className="rm-label rm-label-dim">Apply</span>
              </div>
            </div>

            <div className="roadmap-hint">
              <i className="fas fa-arrows-rotate"></i>
              Drag to explore · zoom · click nodes for details
            </div>
          </div>
        </div>
      </section>

      {/* ── AI CHAT DEMO ────────────────────────────────────── */}
      <section className="demo-section">
        <div className="wrap">
          <div className="demo-card">

            <div className="demo-left">
              <span className="tag"><i className="fas fa-comment"></i> AI Career Assistant</span>
              <h2 className="demo-h3">"What can I do if I love biology but <em>hate memorization?</em>"</h2>
              <p className="demo-body">Our AI analyzes your <span>unique blend</span> — strengths, limits, interests — and surfaces careers you'd never have considered.</p>
              <div className="demo-tags">
                <span className="demo-tag"><i className="fas fa-flask"></i> Biotech Consultant</span>
                <span className="demo-tag"><i className="fas fa-dna"></i> Genetic Counselor</span>
                <span className="demo-tag"><i className="fas fa-chart-pie"></i> Bioinformatics</span>
              </div>
            </div>

            <div className="demo-right">
              <div className="chat-bubble">
                <div className="chat-head">
                  <div className="chat-avatar"><i className="fas fa-robot"></i></div>
                  <div>
                    <div className="chat-name">TrueNorth AI</div>
                    <div className="chat-time">just now</div>
                  </div>
                </div>
                <p className="chat-msg"><span className="chat-can">Can do:</span> research-oriented roles, biotech patent analyst, environmental health specialist — your logical score (84%) is a strong fit.</p>
                <p className="chat-msg"><span className="chat-warn">Not ideal:</span> memorization-heavy clinical roles — your personality profile shows strong preference for conceptual thinking.</p>
                <div className="chat-cta-row">
                  <i className="fas fa-lightbulb" style={{ color: 'var(--c-gold)' }}></i>
                  3 alternative paths with 90%+ match — view now
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────────── */}
      <section className="cta-section">
        <div className="wrap">
          <div className="cta-inner">
            <div className="cta-ring cr-1"></div>
            <div className="cta-ring cr-2"></div>
            <div className="cta-ring cr-3"></div>

            <div className="cta-icon"><i className="fas fa-compass"></i></div>
            <h2 className="cta-h2">Ready to find your<br />True North?</h2>
            <p className="cta-p">Join 2M+ students who stopped guessing and started building careers with clarity.</p>
            <div className="cta-btns">
              <a href="#" className="btn-gold" style={{ fontSize: '1.05rem', padding: '1rem 2.4rem' }}>
                <i className="fas fa-rocket"></i> Start free — 5-min assessment
              </a>
              <a href="#" className="btn-outline" style={{ fontSize: '1.05rem', padding: '1rem 2.2rem' }}>
                <i className="fas fa-calendar"></i> Book a counselor
              </a>
            </div>
            <p className="cta-note"><i className="fas fa-lock"></i> No credit card · instant report · cancel anytime</p>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────────── */}
      <footer className="footer">
        <div className="wrap">
          <div className="footer-grid">

            <div>
              <div className="footer-brand-mark">
                <div className="footer-mark-icon"><i className="fas fa-compass"></i></div>
                <span className="footer-brand-name">TrueNorth</span>
              </div>
              <p className="footer-brand-desc">AI that reveals what you can &amp; cannot — so you choose studies and career with real confidence.</p>
            </div>

            <div>
              <h4 className="footer-col-h">Product</h4>
              <ul className="footer-links">
                <li><a href="#">Features</a></li>
                <li><a href="#">Roadmaps</a></li>
                <li><a href="#">Pricing</a></li>
                <li><a href="#">FAQ</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-h">Company</h4>
              <ul className="footer-links">
                <li><a href="#">About</a></li>
                <li><a href="#">Blog</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="footer-col-h">Legal</h4>
              <ul className="footer-links">
                <li><a href="#">Privacy</a></li>
                <li><a href="#">Terms</a></li>
                <li><a href="#">Security</a></li>
              </ul>
            </div>

          </div>

          <div className="footer-bottom">
            <span className="footer-copy">© 2026 TrueNorth, Inc. — guiding students to clarity.</span>
            <div className="footer-socials">
              <a href="#"><i className="fab fa-twitter"></i></a>
              <a href="#"><i className="fab fa-linkedin"></i></a>
              <a href="#"><i className="fab fa-github"></i></a>
              <a href="#"><i className="fab fa-discord"></i></a>
            </div>
          </div>
        </div>
      </footer>

      {/* ── BACK TO TOP ─────────────────────────────────────── */}
      <button className="to-top" onClick={scrollToTop}>
        <i className="fas fa-arrow-up"></i>
      </button>

    </div>
  );
>>>>>>> f6760fc (initial commit)
}