import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, XCircle, Clock, BarChart2, BookOpen, Play } from 'lucide-react';

export default function StudentDashboard({ user, token, onSelectTopic }) {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProgress = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/students/progress', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (res.ok) {
          const data = await res.json();
          setProgress(data);
        }
      } catch (err) {
        console.error('Failed to fetch student progress:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProgress();
  }, [token]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-secondary)' }}>
        Loading your learning statistics...
      </div>
    );
  }

  const { totalAttempts = 0, correctCount = 0, accuracyRate = 0, recentAttempts = [] } = progress || {};

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      {/* Header Summary Panel */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '28px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
          <Award className="text-indigo-400" size={32} />
          <div>
            <h1 style={{ fontSize: '1.8rem' }}>Welcome back, {user.name}!</h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem' }}>
              Student Learning Dashboard — Form {user.form_level} ({user.school || 'Philippines DepEd Student'})
            </p>
          </div>
        </div>

        {/* Metrics Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '20px', marginTop: '28px' }}>
          <div style={{ background: 'rgba(0,0,0,0.25)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-color)' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
              Total Exercises Attempted
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '4px', color: 'var(--text-primary)' }}>
              {totalAttempts}
            </div>
          </div>

          <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--success-border)' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--success-text)', fontWeight: '600', textTransform: 'uppercase' }}>
              Correctly Solved
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '4px', color: 'var(--success-text)' }}>
              {correctCount}
            </div>
          </div>

          <div style={{ background: 'rgba(99, 102, 241, 0.1)', padding: '20px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-highlight)' }}>
            <div style={{ fontSize: '0.82rem', color: 'var(--accent-secondary)', fontWeight: '600', textTransform: 'uppercase' }}>
              Overall Accuracy Rate
            </div>
            <div style={{ fontSize: '2.2rem', fontWeight: '800', marginTop: '4px', color: 'var(--text-primary)' }}>
              {accuracyRate}%
            </div>
          </div>
        </div>
      </div>

      {/* Recent Attempts History */}
      <div className="glass-panel" style={{ padding: '28px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
          <h2 style={{ fontSize: '1.4rem' }}>Recent Exercise History</h2>
          <button
            className="btn btn-primary"
            onClick={() => onSelectTopic({ form_level: user.form_level, strand: 'Numbers and Number Sense', title: `Form ${user.form_level} Practice` })}
          >
            <Play size={16} /> Continue Practice
          </button>
        </div>

        {recentAttempts.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: 'var(--text-secondary)' }}>
            You haven't attempted any exercise drills yet. Select a topic from the curriculum to begin practicing!
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', color: 'var(--text-secondary)' }}>
                  <th style={{ padding: '12px 16px' }}>Question / Topic</th>
                  <th style={{ padding: '12px 16px' }}>Strand</th>
                  <th style={{ padding: '12px 16px' }}>Result</th>
                  <th style={{ padding: '12px 16px' }}>Time Taken</th>
                  <th style={{ padding: '12px 16px', textAlign: 'right' }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {recentAttempts.map((att) => (
                  <tr key={att.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                    <td style={{ padding: '14px 16px', fontWeight: '600' }}>
                      {att.question_title}
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{att.topic_title || 'Dynamic Drill'}</div>
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>{att.strand || 'Mathematics'}</td>
                    <td style={{ padding: '14px 16px' }}>
                      {att.is_correct === 1 ? (
                        <span className="status-badge approved" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <CheckCircle2 size={14} /> Correct
                        </span>
                      ) : (
                        <span className="status-badge danger" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'var(--danger-bg)', color: 'var(--danger-text)', border: '1px solid var(--danger-border)' }}>
                          <XCircle size={14} /> Incorrect
                        </span>
                      )}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--text-secondary)' }}>
                      <Clock size={14} style={{ display: 'inline', marginRight: '4px' }} />
                      {att.time_taken_sec}s
                    </td>
                    <td style={{ padding: '14px 16px', textAlign: 'right', color: 'var(--text-muted)' }}>
                      {new Date(att.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
