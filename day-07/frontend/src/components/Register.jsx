// src/components/Register.jsx
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('customer');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await register(email, password, role);
      navigate('/login');
    } catch (err) {
      if (!err.response) {
        setError('Network error: Cannot reach backend at http://127.0.0');
        return;
      }
      const data = err.response.data;
      if (data && typeof data === 'object') {
        const messages = Object.entries(data).map(
          ([field, msg]) => `${field}: ${Array.isArray(msg) ? msg.join(' ') : msg}`
        );
        setError(messages.join(' | '));
      } else {
        setError(`Server Error (${err.response.status}): Check your Django terminal logs.`);
      }
    }
  };

  return (
    <div className="form-card" style={{ maxWidth: '400px', margin: '50px auto' }}>
      <h3>Create Account</h3>
      {error && (
        <p className="error-text" style={{ marginBottom: '12px', color: '#dc2626', fontWeight: '600' }}>
          {error}
        </p>
      )}
      <form onSubmit={handleSubmit}>
        <div className="form-group" style={{ marginBottom: '14px' }}>
          <label>Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: '14px' }}>
          <label>Password (min 6 characters)</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group" style={{ marginBottom: '18px' }}>
          <label>Role</label>
          <select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="customer">Customer</option>
            <option value="seller">Seller</option>
          </select>
        </div>
        <button type="submit" className="btn-submit" style={{ width: '100%' }}>
          Register
        </button>
      </form>
      <p style={{ marginTop: '14px', textAlign: 'center', fontSize: '0.9rem' }}>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}
