import { useState } from 'react';
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || '/account';

  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to={from} replace />;
  }

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError('');
    if (form.password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }
    setSubmitting(true);
    try {
      await register(form);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="container auth">
      <div className="auth__card">
        <h1 className="auth__title">Create Account</h1>
        <p className="auth__subtitle">Join Aurelia Diamonds.</p>
        <form onSubmit={handleSubmit} noValidate>
          {error && <div className="form-error">{error}</div>}
          <div className="field-row">
            <div className="field">
              <label htmlFor="firstName">First Name</label>
              <input id="firstName" value={form.firstName} onChange={update('firstName')} required />
            </div>
            <div className="field">
              <label htmlFor="lastName">Last Name</label>
              <input id="lastName" value={form.lastName} onChange={update('lastName')} required />
            </div>
          </div>
          <div className="field">
            <label htmlFor="email">Email Address</label>
            <input id="email" type="email" value={form.email} onChange={update('email')} required />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" value={form.phone} onChange={update('phone')} />
          </div>
          <div className="field">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={update('password')}
              required
            />
          </div>
          <button type="submit" className="btn btn--primary auth__submit" disabled={submitting}>
            {submitting ? 'Creating account…' : 'Create Account'}
          </button>
        </form>
        <p className="auth__switch">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}
