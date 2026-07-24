import { useState } from 'react';
import { useAuth } from '../../context/AuthContext.jsx';

export default function AccountProfile() {
  const { user, updateProfile } = useAuth();
  const [form, setForm] = useState({
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phone: user.phone || '',
  });
  const [status, setStatus] = useState({ type: null, message: '' });
  const [submitting, setSubmitting] = useState(false);

  function update(field) {
    return (e) => setForm((f) => ({ ...f, [field]: e.target.value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus({ type: null, message: '' });
    setSubmitting(true);
    try {
      await updateProfile(form);
      setStatus({ type: 'success', message: 'Your details have been saved.' });
    } catch (err) {
      setStatus({ type: 'error', message: err.message });
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="account-panel">
      <h1 className="account-panel__title">My Account</h1>
      <p className="account-panel__subtitle">
        Manage your account information and view your orders.
      </p>

      <form onSubmit={handleSubmit} className="account-form" noValidate>
        <h2 className="account-form__heading">Account Information</h2>
        {status.type === 'error' && <div className="form-error">{status.message}</div>}
        {status.type === 'success' && <div className="form-success">{status.message}</div>}

        <div className="field-row">
          <div className="field">
            <label htmlFor="firstName">First Name</label>
            <input id="firstName" value={form.firstName} onChange={update('firstName')} />
          </div>
          <div className="field">
            <label htmlFor="lastName">Last Name</label>
            <input id="lastName" value={form.lastName} onChange={update('lastName')} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="email">Email Address</label>
          <input id="email" type="email" value={form.email} onChange={update('email')} />
        </div>
        <div className="field">
          <label htmlFor="phone">Phone Number</label>
          <input id="phone" value={form.phone} onChange={update('phone')} />
        </div>

        <button type="submit" className="btn btn--primary account-form__submit" disabled={submitting}>
          {submitting ? 'Saving…' : 'Save Changes'}
        </button>
      </form>
    </div>
  );
}
