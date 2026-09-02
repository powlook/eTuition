import React, { useState, useEffect } from 'react';
import { UserCheck, UserX, Shield, Clock, Search, RefreshCw, BookOpen, Sparkles, HelpCircle, ExternalLink, Cpu, Database, FileSpreadsheet, CheckCircle2, Eye, EyeOff, Trash2 } from 'lucide-react';

export default function AdminDashboard({ token }) {
  const [adminTab, setAdminTab] = useState('students'); // 'students' | 'question_bank'

  // --- Student Management State ---
  const [students, setStudents] = useState([]);
  const [loadingStudents, setLoadingStudents] = useState(true);
  const [studentFilter, setStudentFilter] = useState('all');
  const [studentSearch, setStudentSearch] = useState('');
  const [visiblePasswords, setVisiblePasswords] = useState({});

  // --- QBank Microservice Integration State ---
  const [qbankStats, setQbankStats] = useState({ online: false, topicsCount: 0, questionsCount: 0 });

  const fetchStudents = async () => {
    setLoadingStudents(true);
    try {
      const res = await fetch('/api/admin/students', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data);
      }
    } catch (err) {
      console.error('Failed to fetch students:', err);
    } finally {
      setLoadingStudents(false);
    }
  };

  const checkQBankStatus = async () => {
    try {
      const isVercel = window.location.hostname.includes('vercel.app');
      const apiBase = isVercel ? 'https://qbank-engine.vercel.app' : 'http://localhost:5000';
      const res = await fetch(`${apiBase}/api/topics`);
      if (res.ok) {
        const data = await res.json();
        const qRes = await fetch(`${apiBase}/api/questions?limit=1`);
        const qData = qRes.ok ? await qRes.json() : { pagination: { total: 4400 } };

        setQbankStats({
          online: true,
          topicsCount: Array.isArray(data) ? data.length : (data.topics ? data.topics.length : 88),
          questionsCount: qData.pagination ? qData.pagination.total : 4400
        });
      }
    } catch (err) {
      console.error('QBank API check error:', err);
      setQbankStats({ online: false, topicsCount: 0, questionsCount: 0 });
    }
  };

  useEffect(() => {
    fetchStudents();
    checkQBankStatus();
  }, [token]);

  const handleOpenQBank = () => {
    const isVercel = window.location.hostname.includes('vercel.app');
    const qbankUrl = isVercel ? 'https://qbank-engine.vercel.app' : 'http://localhost:3000';
    window.open(qbankUrl, '_blank');
  };

  const togglePasswordVisibility = (studentId) => {
    setVisiblePasswords((prev) => ({
      ...prev,
      [studentId]: !prev[studentId]
    }));
  };

  const handleUpdateStudentStatus = async (studentId, newStatus) => {
    try {
      const res = await fetch(`/api/admin/students/${studentId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (res.ok) {
        setStudents((prev) =>
          prev.map((s) => (s.id === studentId ? { ...s, status: newStatus } : s))
        );
      }
    } catch (err) {
      console.error('Failed to update student status:', err);
    }
  };

  const handleUpdateStudentLevel = async (studentId, newLevel) => {
    try {
      const res = await fetch(`/api/admin/students/${studentId}/level`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ form_level: Number(newLevel) })
      });

      if (res.ok) {
        setStudents((prev) =>
          prev.map((s) => (s.id === studentId ? { ...s, form_level: Number(newLevel) } : s))
        );
      }
    } catch (err) {
      console.error('Failed to update student level:', err);
    }
  };

  const handleDeleteStudent = async (studentId, studentName) => {
    if (!window.confirm(`Are you sure you want to permanently delete student account "${studentName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.ok) {
        setStudents((prev) => prev.filter((s) => s.id !== studentId));
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete account.');
      }
    } catch (err) {
      console.error('Failed to delete student account:', err);
      alert('Failed to delete student account. Please check network connection.');
    }
  };

  const filteredStudents = students.filter((s) => {
    const matchesFilter = studentFilter === 'all' || s.status === studentFilter;
    const matchesSearch =
      s.name.toLowerCase().includes(studentSearch.toLowerCase()) ||
      s.email.toLowerCase().includes(studentSearch.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const pendingCount = students.filter((s) => s.status === 'pending').length;

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      {/* Admin Header */}
      <div className="glass-panel" style={{ padding: '28px', marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <Shield className="text-indigo-400" size={28} />
              <h1 style={{ fontSize: '1.8rem' }}>Admin Manager Control Panel</h1>
            </div>
            <p style={{ color: 'var(--text-secondary)', marginTop: '4px', fontSize: '0.95rem' }}>
              Manage student access permissions and access the integrated Philippines DepEd QBank Application.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className={`btn ${adminTab === 'students' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setAdminTab('students')}
            >
              Student Approvals {pendingCount > 0 && `(${pendingCount} Pending)`}
            </button>
            <button
              className={`btn ${adminTab === 'question_bank' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => {
                setAdminTab('question_bank');
                handleOpenQBank();
              }}
            >
              <BookOpen size={16} /> Question Bank Manager
            </button>
          </div>
        </div>
      </div>

      {/* --- TAB 1: STUDENT APPROVALS --- */}
      {adminTab === 'students' && (
        <div className="glass-panel" style={{ overflow: 'hidden', padding: '24px' }}>
          <div style={{ display: 'flex', gap: '16px', marginBottom: '20px', flexWrap: 'wrap' }}>
            <div style={{ flex: 1, minWidth: '240px', position: 'relative' }}>
              <Search size={18} style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                type="text"
                className="form-control"
                style={{ paddingLeft: '38px' }}
                placeholder="Search by student name or email..."
                value={studentSearch}
                onChange={(e) => setStudentSearch(e.target.value)}
              />
            </div>
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className={`chip ${studentFilter === 'all' ? 'active' : ''}`} onClick={() => setStudentFilter('all')}>
                All ({students.length})
              </button>
              <button className={`chip ${studentFilter === 'pending' ? 'active' : ''}`} onClick={() => setStudentFilter('pending')}>
                Pending ({pendingCount})
              </button>
              <button className={`chip ${studentFilter === 'approved' ? 'active' : ''}`} onClick={() => setStudentFilter('approved')}>
                Approved ({students.filter((s) => s.status === 'approved').length})
              </button>
            </div>
          </div>

          {loadingStudents ? (
            <div style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>Loading students...</div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
                <thead>
                  <tr style={{ background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                    <th style={{ padding: '14px 20px' }}>Student Name</th>
                    <th style={{ padding: '14px 20px' }}>Email</th>
                    <th style={{ padding: '14px 20px' }}>Password</th>
                    <th style={{ padding: '14px 20px' }}>Form Level</th>
                    <th style={{ padding: '14px 20px' }}>Access Status</th>
                    <th style={{ padding: '14px 20px', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredStudents.map((s) => (
                    <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                      <td style={{ padding: '16px 20px', fontWeight: '600' }}>{s.name}</td>
                      <td style={{ padding: '16px 20px', color: 'var(--text-secondary)' }}>{s.email}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <code style={{
                            fontSize: '0.88rem',
                            fontFamily: 'monospace',
                            background: 'rgba(0, 0, 0, 0.3)',
                            padding: '4px 8px',
                            borderRadius: '6px',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            minWidth: '95px',
                            display: 'inline-block'
                          }}>
                            {visiblePasswords[s.id] ? (s.plain_password || 'student123') : '••••••••'}
                          </code>
                          <button
                            type="button"
                            title={visiblePasswords[s.id] ? 'Hide Password' : 'Show Password'}
                            style={{
                              background: 'transparent',
                              border: 'none',
                              color: visiblePasswords[s.id] ? 'var(--accent-secondary)' : 'var(--text-muted)',
                              cursor: 'pointer',
                              padding: '4px',
                              display: 'flex',
                              alignItems: 'center'
                            }}
                            onClick={() => togglePasswordVisibility(s.id)}
                          >
                            {visiblePasswords[s.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        <select
                          className="form-control"
                          style={{
                            padding: '6px 12px',
                            fontSize: '0.85rem',
                            width: 'auto',
                            display: 'inline-block',
                            background: 'rgba(30, 41, 59, 0.8)',
                            color: 'var(--text-primary)',
                            border: '1px solid var(--border-highlight)',
                            borderRadius: '8px',
                            cursor: 'pointer'
                          }}
                          value={s.form_level || 1}
                          onChange={(e) => handleUpdateStudentLevel(s.id, e.target.value)}
                        >
                          {Array.from({ length: 12 }, (_, i) => i + 1).map((lvl) => (
                            <option key={lvl} value={lvl} style={{ background: '#1e293b', color: '#fff' }}>
                              Form {lvl}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td style={{ padding: '16px 20px' }}>
                        {s.status === 'approved' ? (
                          <span className="status-badge approved" style={{ padding: '4px 10px', fontSize: '0.8rem', borderRadius: '12px' }}>
                            ✓ Approved
                          </span>
                        ) : s.status === 'pending' ? (
                          <span className="status-badge pending" style={{ padding: '4px 10px', fontSize: '0.8rem', borderRadius: '12px' }}>
                            ⏳ Pending Review
                          </span>
                        ) : (
                          <span className="status-badge danger" style={{ padding: '4px 10px', fontSize: '0.8rem', borderRadius: '12px', background: 'var(--danger-bg)', color: 'var(--danger-text)', border: '1px solid var(--danger-border)' }}>
                            ✕ Revoked
                          </span>
                        )}
                      </td>
                      <td style={{ padding: '16px 20px', textAlign: 'right' }}>
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end', alignItems: 'center' }}>
                          {s.status !== 'approved' ? (
                            <button
                              className="btn btn-success"
                              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                              onClick={() => handleUpdateStudentStatus(s.id, 'approved')}
                            >
                              <UserCheck size={14} /> Grant Access
                            </button>
                          ) : (
                            <button
                              className="btn btn-secondary"
                              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                              onClick={() => handleUpdateStudentStatus(s.id, 'rejected')}
                            >
                              <UserX size={14} /> Revoke Access
                            </button>
                          )}

                          <button
                            className="btn btn-danger"
                            style={{ padding: '6px 12px', fontSize: '0.82rem' }}
                            title="Permanently Delete Student Account"
                            onClick={() => handleDeleteStudent(s.id, s.name)}
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* --- TAB 2: QBANK APPLICATION INTEGRATION HUB --- */}
      {adminTab === 'question_bank' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Main Launch Card */}
          <div className="glass-panel" style={{ padding: '36px', textAlign: 'center', background: 'linear-gradient(135deg, rgba(30, 27, 75, 0.6), rgba(15, 23, 42, 0.8))', border: '1px solid rgba(129, 140, 248, 0.3)' }}>
            <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg, var(--accent-primary), #6366f1)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 8px 24px rgba(99, 102, 241, 0.4)' }}>
              <BookOpen size={32} color="#fff" />
            </div>

            <h2 style={{ fontSize: '1.8rem', fontWeight: '700', marginBottom: '12px' }}>QBank Management Portal</h2>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '640px', margin: '0 auto 28px', fontSize: '1.05rem', lineHeight: '1.6' }}>
              All eTuition practice questions are dynamically powered by the <strong>QBank Engine</strong>. Direct question creation inside eTuition is disabled. To manage, create, edit, or import/export questions, open the QBank Application.
            </p>

            <button
              className="btn btn-primary"
              style={{ padding: '16px 36px', fontSize: '1.1rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '10px', boxShadow: '0 4px 20px rgba(99, 102, 241, 0.5)' }}
              onClick={handleOpenQBank}
            >
              <ExternalLink size={22} /> Launch QBank Application (Port 3000)
            </button>
          </div>

          {/* Microservice Architecture & Status Overview */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Database className="text-indigo-400" size={24} />
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>API Microservice Status</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '12px' }}>
                Endpoint: <code>http://localhost:5000</code>
              </p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 600 }}>
                {qbankStats.online ? (
                  <span style={{ color: '#34d399', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <CheckCircle2 size={16} /> Online & Synchronized
                  </span>
                ) : (
                  <span style={{ color: '#f87171' }}>⚠️ Microservice Offline</span>
                )}
              </div>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <BookOpen className="text-indigo-400" size={24} />
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Curriculum & Repository</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '4px' }}>
                <strong>44 Topics</strong> across DepEd MATATAG Form 1 to Form 10
              </p>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                <strong>{qbankStats.questionsCount}+ Questions</strong> pre-populated in static bank
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <FileSpreadsheet className="text-indigo-400" size={24} />
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Spreadsheet Management</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginBottom: '8px' }}>
                Bulk import and export via Excel (<code>questions_bank.xlsx</code>) available in QBank Excel Hub.
              </p>
            </div>

            <div className="glass-panel" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '12px' }}>
                <Cpu className="text-indigo-400" size={24} />
                <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Dynamic Fallback Generator</h3>
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
                Parameterized problem generator algorithm creates on-demand drill instances when repository questions are exhausted.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

