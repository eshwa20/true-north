import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo-bg.png';

/* ── REGEX VALIDATORS ───────────────────────────────────────── */
const REGEX = {
  email:    /^[a-zA-Z0-9._%+\-]+@[a-zA-Z0-9.\-]+\.[a-zA-Z]{2,}$/,
  username: /^[a-zA-Z0-9_]{3,20}$/,
  password: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>/?]).{8,}$/,
};

const validate = {
  email:    (v) => REGEX.email.test(v.trim())    ? '' : 'Enter a valid email address.',
  username: (v) => REGEX.username.test(v.trim()) ? '' : 'Username: 3–20 chars, letters, numbers or _ only.',
  password: (v) => v.trim() ? '' : 'Password is required.',
  regPassword: (v) => REGEX.password.test(v) ? '' : 'Min 8 chars with uppercase, lowercase, number & symbol.',
  confirm:  (v, pw) => v === pw ? '' : 'Passwords do not match.',
};

/* ── PASSWORD STRENGTH ──────────────────────────────────────── */
function getStrength(pw) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[!@#$%^&*()\-_=+\[\]{};':"\\|,.<>/?]/.test(pw)) score++;
  if (pw.length >= 12) score++;
  if (score <= 2) return 'weak';
  if (score <= 3) return 'fair';
  return 'strong';
}

/* ── STRENGTH METER ─────────────────────────────────────────── */
function StrengthMeter({ password }) {
  if (!password) return null;
  const level = getStrength(password);
  const bars = level === 'weak' ? 1 : level === 'fair' ? 2 : 3;
  
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3].map((i) => (
          <div 
            key={i} 
            className={`h-1.5 flex-1 rounded-full transition-colors ${
              i <= bars 
                ? level === 'weak' ? 'bg-red-500' : level === 'fair' ? 'bg-amber-500' : 'bg-green-600'
                : 'bg-gray-200 dark:bg-gray-700'
            }`} 
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${
        level === 'weak' ? 'text-red-500' : level === 'fair' ? 'text-amber-600' : 'text-green-600'
      }`}>
        {level.charAt(0).toUpperCase() + level.slice(1)} password
      </span>
    </div>
  );
}

/* ── FIELD MESSAGE ──────────────────────────────────────────── */
function FieldMsg({ msg, ok }) {
  if (!msg) return <div className="min-h-[1.5rem]" />;
  return (
    <div className={`flex items-center gap-1.5 text-xs mt-1 ${
      ok ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'
    }`}>
      <i className={`fas fa-${ok ? 'circle-check' : 'circle-exclamation'}`} />
      {msg}
    </div>
  );
}

/* ── MAIN COMPONENT ─────────────────────────────────────────── */
export default function LoginPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [tab, setTab] = useState('login');
  const [showPw, setShowPw] = useState(false);
  const [showCpw, setShowCpw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(null);

  const [login, setLogin] = useState({ email: '', password: '' });
  const [loginErr, setLoginErr] = useState({ email: '', password: '' });

  const [reg, setReg] = useState({ email: '', username: '', password: '', confirm: '' });
  const [regErr, setRegErr] = useState({ email: '', username: '', password: '', confirm: '' });

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

  const onLoginChange = (e) => {
    const { name, value } = e.target;
    setLogin((p) => ({ ...p, [name]: value }));
    setLoginErr((p) => ({ ...p, [name]: validate[name](value) }));
    clearAlert();
  };

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
      ...(name === 'password' && updated.confirm
        ? { confirm: validate.confirm(updated.confirm, value) }
        : {}),
    }));
    clearAlert();
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    const emailErr = validate.email(login.email);
    const pwErr = validate.password(login.password);
    setLoginErr({ email: emailErr, password: pwErr });
    if (emailErr || pwErr) return;

    setLoading(true);
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: login.email.trim().toLowerCase(), password: login.password }),
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

  const handleRegister = async (e) => {
    e.preventDefault();
    const errors = {
      email: validate.email(reg.email),
      username: validate.username(reg.username),
      password: validate.regPassword(reg.password),
      confirm: validate.confirm(reg.confirm, reg.password),
    };
    setRegErr(errors);
    if (Object.values(errors).some(Boolean)) return;

    setLoading(true);
    try {
      const res = await fetch('/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: reg.email.trim().toLowerCase(), username: reg.username.trim(), password: reg.password }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || 'Registration failed.');
      setAlert({ type: 'success', msg: `Account created! Welcome, ${data.user.username}.` });
      setTimeout(() => switchTab('login'), 2000);
    } catch (err) {
      setAlert({ type: 'error', msg: err.message });
    } finally {
      setLoading(false);
    }
  };

  const getInputClass = (errMsg, value) => {
    if (!value) return 'border-gray-200 dark:border-gray-700';
    return errMsg 
      ? 'border-red-500 dark:border-red-400 bg-red-50 dark:bg-red-900/10' 
      : 'border-green-600 dark:border-green-500';
  };

  return (
    <div className="min-h-screen bg-[#FDFBF7] dark:bg-[#1A1814] flex flex-col relative" 
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
            <div className="flex items-center gap-4">
              <button onClick={toggleDarkMode} className="p-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                <i className={`fas ${darkMode ? 'fa-sun' : 'fa-moon'}`} />
              </button>
              <Link to="/" className="flex items-center gap-2 text-gray-600 dark:text-gray-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors">
                <i className="fas fa-arrow-left text-sm" />
                <span className="font-medium">Back to home</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-6 py-8">
        <div className="w-full max-w-[440px]">
          <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl border border-gray-200 dark:border-gray-700">
            
            {/* Header */}
            <div className="text-center mb-6">
              <img src={logo} alt="TrueNorth" className="w-24 h-24 mx-auto mb-4 object-contain" />
              <h1 className="font-serif text-2xl md:text-3xl font-bold text-gray-800 dark:text-white mb-1">
                {tab === 'login' ? 'Welcome back' : 'Get started'}
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {tab === 'login' ? 'Sign in to continue your journey.' : 'Create your free TrueNorth account.'}
              </p>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 bg-gray-100 dark:bg-gray-700 p-1 rounded-full mb-6">
              <button
                onClick={() => switchTab('login')}
                className={`flex-1 py-2.5 px-4 rounded-full font-semibold text-sm transition-all ${
                  tab === 'login' 
                    ? 'bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Log in
              </button>
              <button
                onClick={() => switchTab('register')}
                className={`flex-1 py-2.5 px-4 rounded-full font-semibold text-sm transition-all ${
                  tab === 'register' 
                    ? 'bg-white dark:bg-gray-800 text-amber-600 dark:text-amber-400 shadow-sm' 
                    : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200'
                }`}
              >
                Register
              </button>
            </div>

            {/* Alert */}
            {alert && (
              <div className={`flex items-center gap-3 p-3 rounded-xl mb-6 text-sm ${
                alert.type === 'success' 
                  ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' 
                  : 'bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-800'
              }`}>
                <i className={`fas fa-${alert.type === 'success' ? 'circle-check' : 'triangle-exclamation'}`} />
                {alert.msg}
              </div>
            )}

            {/* Login Form */}
            {tab === 'login' && (
              <form onSubmit={handleLogin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
                  <div className="relative">
                    <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
                    <input
                      type="email" name="email" autoComplete="email" placeholder="you@example.com"
                      value={login.email} onChange={onLoginChange}
                      className={`w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl outline-none transition-all text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-amber-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-amber-500/10 ${getInputClass(loginErr.email, login.email)}`}
                    />
                  </div>
                  <FieldMsg msg={loginErr.email} ok={!loginErr.email && !!login.email} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                  <div className="relative">
                    <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
                    <input
                      type={showPw ? 'text' : 'password'} name="password" autoComplete="current-password" placeholder="Your password"
                      value={login.password} onChange={onLoginChange}
                      className={`w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl outline-none transition-all text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-amber-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-amber-500/10 ${getInputClass(loginErr.password, login.password)}`}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                      <i className={`fas fa-eye${showPw ? '-slash' : ''} text-sm`} />
                    </button>
                  </div>
                  <FieldMsg msg={loginErr.password} ok={!loginErr.password && !!login.password} />
                </div>

                <button type="submit" disabled={loading} className="btn-gold w-full">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fas fa-arrow-right-to-bracket" /> Sign in
                    </span>
                  )}
                </button>

                <p className="text-center text-gray-500 dark:text-gray-400 text-sm pt-2">
                  Don't have an account?{' '}
                  <button type="button" onClick={() => switchTab('register')} className="text-amber-600 dark:text-amber-400 font-semibold hover:underline">
                    Create one free
                  </button>
                </p>
              </form>
            )}

            {/* Register Form */}
            {tab === 'register' && (
              <form onSubmit={handleRegister} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Email address</label>
                  <div className="relative">
                    <i className="fas fa-envelope absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
                    <input
                      type="email" name="email" autoComplete="email" placeholder="you@example.com"
                      value={reg.email} onChange={onRegChange}
                      className={`w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl outline-none transition-all text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-amber-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-amber-500/10 ${getInputClass(regErr.email, reg.email)}`}
                    />
                  </div>
                  <FieldMsg msg={regErr.email} ok={!regErr.email && !!reg.email} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Username</label>
                  <div className="relative">
                    <i className="fas fa-at absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
                    <input
                      type="text" name="username" autoComplete="username" placeholder="e.g. john_doe99"
                      value={reg.username} onChange={onRegChange}
                      className={`w-full pl-11 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl outline-none transition-all text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-amber-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-amber-500/10 ${getInputClass(regErr.username, reg.username)}`}
                    />
                  </div>
                  <FieldMsg msg={regErr.username} ok={!regErr.username && !!reg.username} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Password</label>
                  <div className="relative">
                    <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
                    <input
                      type={showPw ? 'text' : 'password'} name="password" autoComplete="new-password" placeholder="Create a strong password"
                      value={reg.password} onChange={onRegChange}
                      className={`w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl outline-none transition-all text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-amber-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-amber-500/10 ${getInputClass(regErr.password, reg.password)}`}
                    />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                      <i className={`fas fa-eye${showPw ? '-slash' : ''} text-sm`} />
                    </button>
                  </div>
                  <StrengthMeter password={reg.password} />
                  <FieldMsg msg={regErr.password} ok={!regErr.password && !!reg.password} />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">Confirm password</label>
                  <div className="relative">
                    <i className="fas fa-lock absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 text-sm" />
                    <input
                      type={showCpw ? 'text' : 'password'} name="confirm" autoComplete="new-password" placeholder="Repeat your password"
                      value={reg.confirm} onChange={onRegChange}
                      className={`w-full pl-11 pr-12 py-3 bg-gray-50 dark:bg-gray-700 border rounded-xl outline-none transition-all text-sm text-gray-800 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:border-amber-500 focus:bg-white dark:focus:bg-gray-800 focus:ring-4 focus:ring-amber-500/10 ${getInputClass(regErr.confirm, reg.confirm)}`}
                    />
                    <button type="button" onClick={() => setShowCpw(!showCpw)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300">
                      <i className={`fas fa-eye${showCpw ? '-slash' : ''} text-sm`} />
                    </button>
                  </div>
                  <FieldMsg msg={regErr.confirm} ok={!regErr.confirm && !!reg.confirm} />
                </div>

                <button type="submit" disabled={loading} className="btn-gold w-full">
                  {loading ? (
                    <span className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Creating account…
                    </span>
                  ) : (
                    <span className="flex items-center justify-center gap-2">
                      <i className="fas fa-user-plus" /> Create account
                    </span>
                  )}
                </button>

                <p className="text-center text-gray-400 dark:text-gray-500 text-xs">
                  By registering you agree to our{' '}
                  <a href="#" className="text-amber-600 dark:text-amber-400 hover:underline">Terms</a> and{' '}
                  <a href="#" className="text-amber-600 dark:text-amber-400 hover:underline">Privacy Policy</a>.
                </p>

                <p className="text-center text-gray-500 dark:text-gray-400 text-sm">
                  Already have an account?{' '}
                  <button type="button" onClick={() => switchTab('login')} className="text-amber-600 dark:text-amber-400 font-semibold hover:underline">
                    Sign in
                  </button>
                </p>
              </form>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}