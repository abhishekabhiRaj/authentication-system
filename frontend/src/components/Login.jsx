import { useState } from 'react';
import { login } from '../services/authService';
import './Login.css';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validateEmail(email) {
  if (!email.trim()) return 'Email is required.';
  if (!EMAIL_REGEX.test(email)) return 'Please enter a valid email address.';
  return '';
}

function validatePassword(password) {
  if (!password) return 'Password is required.';
  return '';
}

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ email: '', password: '' });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [submitting, setSubmitting] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    setMessage({ type: '', text: '' });

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    setErrors({ email: emailError, password: passwordError });

    if (emailError || passwordError) return;

    setSubmitting(true);
    login(email, password)
      .then((data) => {
        setMessage({ type: 'success', text: data.message || 'Login successful.' });
        setEmail('');
        setPassword('');
        setErrors({ email: '', password: '' });
      })
      .catch((err) => {
        setMessage({ type: 'error', text: err.message || 'Login failed.' });
      })
      .finally(() => setSubmitting(false));
  }

  function handleEmailBlur() {
    setErrors((prev) => ({ ...prev, email: validateEmail(email) }));
  }

  function handlePasswordBlur() {
    setErrors((prev) => ({ ...prev, password: validatePassword(password) }));
  }

  return (
    <div className="login-container">
      <form className="login-form" onSubmit={handleSubmit}>
        <h1>Login</h1>

        {message.text && (
          <div className={`message message-${message.type}`} role="alert">
            {message.text}
          </div>
        )}

        <div className="field">
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onBlur={handleEmailBlur}
            placeholder="you@example.com"
            autoComplete="email"
            aria-invalid={!!errors.email}
            aria-describedby={errors.email ? 'email-error' : undefined}
          />
          {errors.email && (
            <span id="email-error" className="error">
              {errors.email}
            </span>
          )}
        </div>

        <div className="field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onBlur={handlePasswordBlur}
            placeholder="••••••••"
            autoComplete="current-password"
            aria-invalid={!!errors.password}
            aria-describedby={errors.password ? 'password-error' : undefined}
          />
          {errors.password && (
            <span id="password-error" className="error">
              {errors.password}
            </span>
          )}
        </div>

        <button type="submit" className="submit-btn" disabled={submitting}>
          {submitting ? 'Signing in…' : 'Sign in'}
        </button>
      </form>
    </div>
  );
}
