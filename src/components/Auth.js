import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';
import './Entry.css';

const Auth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [mode, setMode] = useState('login'); // 'login' | 'signup'
  const [form, setForm] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Redirect away if already authenticated
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/', { replace: true });
    }
  }, [navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);

      if (mode === 'login') {
        await authService.logIn(form.username, form.password);
      } else {
        await authService.signUp(form.username, form.password);
      }

      const redirectTo = location.state?.from?.pathname || '/';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="entry-container" style={{ maxWidth: 420 }}>
      <div className="header-section">
        <h1>{mode === 'login' ? 'Log in' : 'Sign up'}</h1>
        <p>{mode === 'login' ? 'Welcome back' : 'Create your account'}</p>
      </div>

      {error && (
        <div className="error-message" style={{ position: 'relative', transform: 'none', top: 'auto', left: 'auto' }}>
          <div className="error-content">
            <h3>Error</h3>
            <p>{error}</p>
            <button onClick={() => setError(null)}>Close</button>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="mood-form">
        <div className="form-group">
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            value={form.username}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.8rem', border: '2px solid #e1e5e9', borderRadius: 8 }}
          />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
            style={{ width: '100%', padding: '0.8rem', border: '2px solid #e1e5e9', borderRadius: 8 }}
          />
        </div>

        <div className="form-actions">
          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Please wait…' : mode === 'login' ? 'Log in' : 'Sign up'}
          </button>
        </div>
      </form>

      <div style={{ textAlign: 'center', marginTop: '1rem' }}>
        {mode === 'login' ? (
          <button className="reset-button" onClick={() => setMode('signup')}>Need an account? Sign up</button>
        ) : (
          <button className="reset-button" onClick={() => setMode('login')}>Already have an account? Log in</button>
        )}
      </div>
    </div>
  );
};

export default Auth;
