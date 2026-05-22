import { useState, type FormEvent } from 'react';
import { Navigate } from 'react-router-dom';
import { AppLogo } from '../components/AppLogo';
import { useAuth } from '../context/AuthContext';
import { ApiError } from '../api/client';
import { APP_TITLE, AUTH } from '../constants/my';

export function LoginPage() {
  const { user, login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await login(username, password);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : AUTH.login + ' မအောင်မြင်ပါ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <AppLogo size={56} className="app-logo--login" />
          <h1>{APP_TITLE}</h1>
          <p>{AUTH.loginTitle}</p>
        </div>
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}
          <label>
            {AUTH.username}
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
            />
          </label>
          <label>
            {AUTH.password}
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
            />
          </label>
          <button type="submit" className="btn btn-primary" disabled={submitting}>
            {submitting ? '...' : AUTH.login}
          </button>
        </form>
        <p className="login-hint">ပုံမှန်: admin / Admin@123</p>
      </div>
    </div>
  );
}
