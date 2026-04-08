import { useState } from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/logo-bg.png';
import './login-style.css';

import { useNavigate } from 'react-router-dom';

/* ── REGEX VALIDATORS ───────────────────────────────────────── */
// Must mirror login-insert.py exactly
const REGEX = {
  email:    /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>/?]).{8,}$/,
};

const validate = {
  email:    (v) => REGEX.email.test(v.trim())    ? '' : 'Enter a valid email address.',
  username: (v) => REGEX.username.test(v.trim()) ? '' : 'Username: 3–20 chars, letters, numbers or _ only.',
  // Login only checks email format — backend handles password verification
  password: (v) => v.trim() ? '' : 'Password is required.',
  // Register checks full password rules
  regPassword: (v) => REGEX.password.test(v) ? '' : 'Min 8 chars with uppercase, lowercase, number & symbol.',
  confirm:  (v, pw) => v === pw ? '' : 'Passwords do not match.',
};

/* ── PASSWORD STRENGTH ──────────────────────────────────────── */
function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8)                                                    score++;
  if (/[A-Z]/.test(pw))                                                  score++;
  if (/[0-9]/.test(pw))                                                  score++;
  if (/[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>/?]/.test(pw))                  score++;
  if (pw.length >= 12)                                                   score++;
  if (score <= 2) return 'weak';
  if (score <= 3) return 'fair';
  return 'strong';
}

const strengthMeta = {
  weak:   { label: 'Weak',   bars: 1 },
  fair:   { label: 'Fair',   bars: 2 },
  strong: { label: 'Strong', bars: 3 },
};

/* ── STRENGTH METER ─────────────────────────────────────────── */
function StrengthMeter({ password }) {
  if (!password) return null;
  const level = getStrength(password);
  const { label, bars } = strengthMeta[level];
  return (
    <div className="strength-meter">
      <div className="strength-bars">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`strength-bar ${i <= bars ? `active-${level}` : ''}`} />
        ))}
      </div>
      <span className={`strength-label ${level}`}>{label} password</span>
    </div>
  );
}

/* ── FIELD MESSAGE ──────────────────────────────────────────── */
function FieldMsg({ msg, ok }) {
  if (!msg) return <div className="auth-field-msg" />;
  return (
    <div className={`auth-field-msg ${ok ? 'ok' : 'error'}`}>
      <i className={`fas fa-${ok ? 'circle-check' : 'circle-exclamation'}`} />
      {msg}
    </div>
  );
}

/* ── MAIN COMPONENT ─────────────────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate();
  const [tab, setTab]         = useState('login');
  const [showPw, setShowPw]   = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert]     = useState(null);   // { type: 'success'|'error', msg }

  /* Login state */
  const [login, setLogin]       = useState({ email: '', password: '' });
  const [loginErr, setLoginErr] = useState({ email: '', password: '' });

  /* Register state */
  const [reg, setReg]       = useState({ email: '', username: '', password: '', confirm: '' });
  const [regErr, setRegErr] = useState({ email: '', username: '', password: '', confirm: '' });

  /* ── helpers ── */
  const clearAlert = () => setAlert(null);

  const switchTab = (t) => {
    setTab(t);
    clearAlert();
    setLogin({ email: '', password: '' });
    setLoginErr({ email: '', password: '' });
    setReg({ email: '', username: '', password: '', confirm: '' });
    setRegErr({ email: '', username: '', password: '', confirm: '' });
    setShowPw(false);
    setShowCpw(false);
  };

  /* ── Login field change ── */
  const onLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin((p) => ({ ...p, [name]: value }));
    // Only validate email format on the login form — password just needs to be non-empty
    setLoginErr((p) => ({ ...p, [name]: validate[name](value) }));
    clearAlert();
  };

  /* ── Register field change ── */
  const onRegChange = (e) => {
    const { name, value } = e.target;
    setReg((p) => ({ ...p, [name]: value }));
    const updated = { ...reg, [name]: value };
    setRegErr((p) => ({
      ...p,
      [name]: name === 'confirm'
        ? validate.confirm(value, updated.password)
        : name === 'password'
          ? validate.regPassword(value)
          : validate[name](value),
      // Re-validate confirm whenever password field changes
      ...(name === 'password' && updated.confirm
        ? { confirm: validate.confirm(updated.confirm, value) }
        : {}),
    }));
    clearAlert();
  };

  /* ── Login submit ── */
  const handleLogin = async (e) => {
    e.preventDefault();
    // Login only validates email format — backend verifies the password
    const emailErr = validate.email(login.email);
    const pwErr    = validate.password(login.password);
    setLoginErr({ email: emailErr, password: pwErr });
    if (emailErr || pwErr) return;

    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:    login.email.trim().toLowerCase(),
          password: login.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Login failed.');
      setAlert({ type: 'success', msg: `Welcome back, ${data.user.username}!` });
      setTimeout(() => navigate('/assessment'), 1200);
    } catch (err) {
      setAlert({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  /* ── Register submit ── */
  const handleRegister = async (e) => {
    e.preventDefault();
    const errors = {
      email:    validate.email(reg.email),
      username: validate.username(reg.username),
      password: validate.regPassword(reg.password),
      confirm:  validate.confirm(reg.confirm, reg.password),
    };
    setRegErr(errors);
    if (Object.values(errors).some(Boolean)) return;

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email:    reg.email.trim().toLowerCase(),
          username: reg.username.trim(),
          password: reg.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Registration failed.');
      setAlert({ type: 'success', msg: `Account created! Welcome, ${data.user.username}.` });
      // Auto-switch to login after successful registration
      setTimeout(() => switchTab('login'), 2000);
    } catch (err) {
      setAlert({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  /* ── Input state class helper ── */
  const inputClass = (errMsg, value) => {
    if (!value) return '';
    return errMsg ? 'input-error' : 'input-ok';
  };

  /* ────────────────────────────────────────────────────────── */
  return (
    <div className="auth-page">
      <div className="auth-orb auth-orb-1" />
      <div className="auth-orb auth-orb-2" />

      {/* ── NAV ── */}
      <nav className="auth-nav">
        <div className="auth-nav-inner">
          <Link to="/" className="auth-nav-logo">
            <div className="auth-nav-mark"><i className="fas fa-compass" /></div>
            <span className="auth-nav-name">TrueNorth</span>
            <span className="auth-nav-badge">AI Beta</span>
          </Link>
          <Link to="/" className="auth-nav-back">
            <i className="fas fa-arrow-left" /> Back to home
          </Link>
        </div>
      </nav>

      {/* ── MAIN ── */}
      <main className="auth-main">
        <div className="auth-card">

          {/* Header */}
          <div className="auth-card-header">
            <div className="auth-card-icon">
              <img src={logo} alt="TrueNorth" style={{ width: '150px', height: '150px', objectFit: 'contain' }} />
            </div>
            <h1 className="auth-card-title">
              {tab === 'login' ? 'Welcome back' : 'Get started'}
            </h1>
            <p className="auth-card-sub">
              {tab === 'login'
                ? 'Sign in to continue your journey.'
                : 'Create your free TrueNorth account.'}
            </p>
          </div>

          {/* Tab switcher */}
          <div className="auth-tabs">
            <button
              className={`auth-tab ${tab === 'login' ? 'active' : ''}`}
              onClick={() => switchTab('login')}
            >
              Log in
            </button>
            <button
              className={`auth-tab ${tab === 'register' ? 'active' : ''}`}
              onClick={() => switchTab('register')}
            >
              Register
            </button>
          </div>

          {/* Alert banner */}
          {alert && (
            <div className={`auth-alert ${alert.type}`}>
              <i className={`fas fa-${alert.type === 'success' ? 'circle-check' : 'triangle-exclamation'}`} />
              {alert.msg}
            </div>
          )}

          {/* ── LOGIN FORM ── */}
          {tab === 'login' && (
            <form className="auth-form" onSubmit={handleLogin} noValidate>

              <div className="auth-field">
                <label className="auth-label" htmlFor="login-email">Email address</label>
                <div className="auth-input-wrap">
                  <i className="auth-input-icon fas fa-envelope" />
                  <input
                    id="login-email"
                    className={`auth-input ${inputClass(loginErr.email, login.email)}`}
                    type="email" name="email" autoComplete="email"
                    placeholder="you@example.com"
                    value={login.email} onChange={onLoginChange}
                  />
                </div>
                <FieldMsg msg={loginErr.email} ok={!loginErr.email && !!login.email} />
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="login-password">Password</label>
                <div className="auth-input-wrap">
                  <i className="auth-input-icon fas fa-lock" />
                  <input
                    id="login-password"
                    className={`auth-input has-toggle ${inputClass(loginErr.password, login.password)}`}
                    type={showPw ? 'text' : 'password'} name="password" autoComplete="current-password"
                    placeholder="Your password"
                    value={login.password} onChange={onLoginChange}
                  />
                  <button type="button" className="auth-input-toggle" onClick={() => setShowPw((p) => !p)}>
                    <i className={`fas fa-eye${showPw ? '-slash' : ''}`} />
                  </button>
                </div>
                <FieldMsg msg={loginErr.password} ok={!loginErr.password && !!login.password} />
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading
                  ? <><div className="auth-spinner" /> Signing in…</>
                  : <><i className="fas fa-arrow-right-to-bracket" /> Sign in</>}
              </button>

              <p className="auth-footer-text" style={{ marginTop: '.9rem' }}>
                Don't have an account?{' '}
                <button type="button" className="auth-footer-link" onClick={() => switchTab('register')}>
                  Create one free
                </button>
              </p>

            </form>
          )}

          {/* ── REGISTER FORM ── */}
          {tab === 'register' && (
            <form className="auth-form" onSubmit={handleRegister} noValidate>

              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-email">Email address</label>
                <div className="auth-input-wrap">
                  <i className="auth-input-icon fas fa-envelope" />
                  <input
                    id="reg-email"
                    className={`auth-input ${inputClass(regErr.email, reg.email)}`}
                    type="email" name="email" autoComplete="email"
                    placeholder="you@example.com"
                    value={reg.email} onChange={onRegChange}
                  />
                </div>
                <FieldMsg msg={regErr.email} ok={!regErr.email && !!reg.email} />
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-username">Username</label>
                <div className="auth-input-wrap">
                  <i className="auth-input-icon fas fa-at" />
                  <input
                    id="reg-username"
                    className={`auth-input ${inputClass(regErr.username, reg.username)}`}
                    type="text" name="username" autoComplete="username"
                    placeholder="e.g. john_doe99"
                    value={reg.username} onChange={onRegChange}
                  />
                </div>
                <FieldMsg msg={regErr.username} ok={!regErr.username && !!reg.username} />
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-password">Password</label>
                <div className="auth-input-wrap">
                  <i className="auth-input-icon fas fa-lock" />
                  <input
                    id="reg-password"
                    className={`auth-input has-toggle ${inputClass(regErr.password, reg.password)}`}
                    type={showPw ? 'text' : 'password'} name="password" autoComplete="new-password"
                    placeholder="Create a strong password"
                    value={reg.password} onChange={onRegChange}
                  />
                  <button type="button" className="auth-input-toggle" onClick={() => setShowPw((p) => !p)}>
                    <i className={`fas fa-eye${showPw ? '-slash' : ''}`} />
                  </button>
                </div>
                <StrengthMeter password={reg.password} />
                <FieldMsg msg={regErr.password} ok={!regErr.password && !!reg.password} />
              </div>

              <div className="auth-field">
                <label className="auth-label" htmlFor="reg-confirm">Confirm password</label>
                <div className="auth-input-wrap">
                  <i className="auth-input-icon fas fa-lock" />
                  <input
                    id="reg-confirm"
                    className={`auth-input has-toggle ${inputClass(regErr.confirm, reg.confirm)}`}
                    type={showCpw ? 'text' : 'password'} name="confirm" autoComplete="new-password"
                    placeholder="Repeat your password"
                    value={reg.confirm} onChange={onRegChange}
                  />
                  <button type="button" className="auth-input-toggle" onClick={() => setShowCpw((p) => !p)}>
                    <i className={`fas fa-eye${showCpw ? '-slash' : ''}`} />
                  </button>
                </div>
                <FieldMsg msg={regErr.confirm} ok={!regErr.confirm && !!reg.confirm} />
              </div>

              <button type="submit" className="auth-submit" disabled={loading}>
                {loading
                  ? <><div className="auth-spinner" /> Creating account…</>
                  : <><i className="fas fa-user-plus" /> Create account</>}
              </button>

              <p className="auth-terms">
                By registering you agree to our{' '}
                <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
              </p>

              <p className="auth-footer-text">
                Already have an account?{' '}
                <button type="button" className="auth-footer-link" onClick={() => switchTab('login')}>
                  Sign in
                </button>
              </p>

            </form>
          )}

        </div>
      </main>
    </div>
  );
}