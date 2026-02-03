import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../store/authSlice';
import { login, signup } from '../services/authService';
import './Auth.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  if (!email.trim()) return 'Email is required.';
  if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address.';
  return '';
}

function validatePassword(password, isSignup = false) {
  if (!password) return 'Password is required.';
  if (isSignup && password.length < 6) return 'Password must be at least 6 characters.';
  return '';
}

export default function Auth() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (message.type !== 'error' || !message.text) return;
    const timer = setTimeout(() => setMessage({ type: '', text: '' }), 5000);
    return () => clearTimeout(timer);
  }, [message.type, message.text]);

  function handleSubmit(e) {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password, !isLogin);
    setErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) return;

    setSubmitting(true);
    const apiCall = isLogin ? login(email, password) : signup(email, password);
    apiCall
      .then((data) => {
        if (isLogin) {
          dispatch(setUser({
            user: data.user || { email: data.email || email },
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            expiresIn: data.expiresIn,
          }));
          navigate('/products');
        } else {
          setMessage({ type: 'success', text: data.message || 'Sign up successful.' });
          setEmail('');
          setPassword('');
          setErrors({ email: '', password: '' });
          setIsLogin(true);
        }
      })
      .catch((err) => {
        setMessage({ type: 'error', text: err.message || (isLogin ? 'Login failed.' : 'Sign up failed.') });
      })
      .finally(() => setSubmitting(false));
  }

  function handleEmailBlur() {
    setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
  }

  function handlePasswordBlur() {
    setErrors((prev) => ({ ...prev, password: validatePassword(password, !isLogin) }));
  }

  function switchMode() {
    setIsLogin((prev) => !prev);
    setMessage({ type: '', text: '' });
    setErrors({ email: '', password: '' });
  }

  return (
    <div className="auth-wrapper">
      <div className="auth-box">
        <div className="auth-form-panel">
          <form className="auth-form" onSubmit={handleSubmit}>
            <h1 className="auth-title">{isLogin ? 'Login' : 'Sign Up'}</h1>

            {message.text && (
              <div className={`auth-message auth-message-${message.type}`} role="alert">
                {message.text}
              </div>
            )}

            <div className="auth-field">
              <div className="auth-input-wrap">
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onBlur={handleEmailBlur}
                  placeholder="Email"
                  autoComplete="email"
                  className="auth-input"
                  aria-invalid={!!errors.email}
                />
                <span className="auth-input-icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                </span>
              </div>
              {errors.email && <span className="auth-error">{errors.email}</span>}
            </div>

            <div className="auth-field">
              <div className="auth-input-wrap">
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onBlur={handlePasswordBlur}
                  placeholder="Password"
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                  className="auth-input"
                  aria-invalid={!!errors.password}
                />
                <span className="auth-input-icon" aria-hidden>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                </span>
              </div>
              {errors.password && <span className="auth-error">{errors.password}</span>}
            </div>

            <button type="submit" className="auth-btn" disabled={submitting}>
              {submitting ? (isLogin ? 'Signing in…' : 'Signing up…') : isLogin ? 'Login' : 'Sign Up'}
            </button>

            <p className="auth-switch">
              {isLogin ? "Don't have an account? " : 'Have an account? '}
              <button type="button" className="auth-link" onClick={switchMode}>
                {isLogin ? 'Sign Up' : 'Login'}
              </button>
            </p>
          </form>
        </div>

        <div className="auth-welcome-panel">
          <h2 className="auth-welcome-title">
            {isLogin ? 'WELCOME BACK!' : 'WELCOME!'}
          </h2>
          <p className="auth-welcome-text">
            Lorem ipsum, dolor sit amet consectetur adipisicing.
          </p>
        </div>
      </div>
    </div>
  );
}
