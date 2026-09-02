import React, { useState, useEffect } from 'react';
import { X, ShieldAlert, CheckCircle2, UserCheck, AlertTriangle } from 'lucide-react';

export default function AuthModal({ isOpen, mode, onClose, onLoginSuccess }) {
  const [authMode, setAuthMode] = useState(mode || 'login'); // 'login' | 'register'
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    form_level: 5,
    school: ''
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [pendingNotice, setPendingNotice] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setAuthMode(mode || 'login');
      setError(null);
      setPendingNotice(null);
    }
  }, [mode, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setPendingNotice(null);

    const endpoint = authMode === 'login' ? '/api/auth/login' : '/api/auth/register';

    try {
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        if (data.status === 'pending') {
          setPendingNotice(data.message || 'Your account is pending Admin Manager approval.');
        } else {
          setError(data.error || 'Authentication failed');
        }
        setLoading(false);
        return;
      }

      if (authMode === 'register') {
        setPendingNotice(data.message);
      } else {
        localStorage.setItem('etuition_token', data.token);
        localStorage.setItem('etuition_user', JSON.stringify(data.user));
        onLoginSuccess(data.user);
        onClose();
      }
    } catch (err) {
      setError('Connection error. Please check server.');
    } finally {
      setLoading(false);
    }
  };

  // Demo Login Quick Handlers for Testing
  const handleQuickDemoLogin = (type) => {
    if (type === 'admin') {
      setFormData({ email: 'admin@etuition.ph', password: 'admin123', name: '', form_level: 12, school: '' });
    } else {
      setFormData({ email: 'student@etuition.ph', password: 'student123', name: '', form_level: 5, school: '' });
    }
  };

  return (
    <div className="modal-overlay">
      <div className="glass-panel modal-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.4rem' }}>
            {authMode === 'login' ? 'Portal Login' : 'Student Access Request'}
          </h2>
          <button className="btn btn-secondary" style={{ padding: '6px' }} onClick={onClose}>
            <X size={18} />
          </button>
        </div>

        {error && (
          <div style={{ background: 'var(--danger-bg)', border: '1px solid var(--danger-border)', color: 'var(--danger-text)', padding: '12px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.88rem' }}>
            <AlertTriangle size={16} style={{ display: 'inline', marginRight: '6px' }} />
            {error}
          </div>
        )}

        {pendingNotice && (
          <div style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', color: 'var(--warning-text)', padding: '14px', borderRadius: 'var(--radius-sm)', marginBottom: '16px', fontSize: '0.88rem', lineHeight: '1.5' }}>
            <ShieldAlert size={18} style={{ display: 'inline', marginRight: '8px', verticalAlign: 'middle' }} />
            <strong>Pending Admin Approval:</strong> {pendingNotice}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {authMode === 'register' && (
            <div className="form-group">
              <label>Full Name</label>
              <input
                type="text"
                className="form-control"
                placeholder="e.g. Maria Santos"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              className="form-control"
              placeholder="student@example.com"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              className="form-control"
              placeholder="••••••••"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {authMode === 'register' && (
            <>
              <div className="form-group">
                <label>Target Grade / Level (Form 1 to 12)</label>
                <select
                  className="form-control"
                  value={formData.form_level}
                  onChange={(e) => setFormData({ ...formData, form_level: Number(e.target.value) })}
                >
                  {Array.from({ length: 12 }, (_, i) => i + 1).map((lvl) => (
                    <option key={lvl} value={lvl}>
                      Form {lvl} {lvl <= 6 ? '(Primary)' : lvl <= 10 ? '(Secondary)' : '(Senior Secondary)'}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>School / Region</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="e.g. Quezon City High School"
                  value={formData.school}
                  onChange={(e) => setFormData({ ...formData, school: e.target.value })}
                />
              </div>
            </>
          )}

          <button type="submit" className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginTop: '10px' }} disabled={loading}>
            {loading ? 'Processing...' : authMode === 'login' ? 'Log In to Portal' : 'Submit Access Request'}
          </button>
        </form>

        {/* Demo Quick Logins only on Login window */}
        {authMode === 'login' && (
          <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: '8px', textAlign: 'center' }}>
              QUICK DEMO CREDENTIALS:
            </div>
            <div>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '0.78rem', padding: '6px 8px', justifyContent: 'center' }}
                onClick={() => handleQuickDemoLogin('student')}
              >
                Demo Student
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
