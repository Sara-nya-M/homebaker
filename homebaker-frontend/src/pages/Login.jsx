import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import Loader from '../components/Loader';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token) {
      if (role === 'BAKER') {
        navigate('/baker-dashboard', { replace: true });
      } else {
        navigate('/customer-dashboard', { replace: true });
      }
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await loginUser({ email, password });
      const data = response.data;
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('role', data.role);
      localStorage.setItem('userId', data.id);
      localStorage.setItem('userName', data.name);
      localStorage.setItem('userEmail', data.email);
      localStorage.setItem('city', data.city || '');

      const targetPath = data.role === 'BAKER' ? '/baker-dashboard' : '/customer-dashboard';
      window.location.href = targetPath;
    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password.');
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      {loading && <Loader text="Logging into HomeBaker..." fullScreen={true} icon="🔑" />}
      <h2 className="form-title">Welcome Back</h2>
      <p className="form-subtitle">Enter your credentials to enter the marketplace</p>

      {error && <div style={{ color: 'red', marginBottom: '1rem', textAlign: 'center' }}>{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            required
            placeholder="john@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            required
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: '1rem' }} disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>

      <p style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: '#6b7280' }}>
        New to HomeBaker? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: '600' }}>Register here</Link>
      </p>
    </div>
  );
}

export default Login;
