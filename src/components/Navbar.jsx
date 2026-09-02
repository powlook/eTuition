import React from 'react';
import { BookOpen, User, LogOut, Shield, Award, CheckCircle, Clock } from 'lucide-react';

export default function Navbar({
  user,
  currentFormLevel,
  setFormLevel,
  activeTab,
  setActiveTab,
  onOpenAuthModal,
  onLogout
}) {
  return (
    <header className="navbar">
      <div className="container navbar-content">
        <a href="#" className="brand-logo" onClick={() => setActiveTab('curriculum')}>
          <BookOpen className="w-6 h-6 text-indigo-400" />
          <span>eTuition</span>
          <span className="brand-badge">Philippine K-12 Math</span>
        </a>

        <div className="nav-actions">
          {user && (
            <button
              className={`btn ${activeTab === 'progress' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('progress')}
            >
              <Award size={16} /> Progress
            </button>
          )}

          {user && user.role === 'admin' && (
            <button
              className={`btn ${activeTab === 'admin' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setActiveTab('admin')}
            >
              <Shield size={16} /> Admin Portal
            </button>
          )}

          {/* User Status / Login Buttons */}
          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.9rem', fontWeight: '700' }}>{user.name}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.75rem' }}>
                  {user.status === 'approved' ? (
                    <span className="status-badge approved" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <CheckCircle size={12} /> Approved
                    </span>
                  ) : (
                    <span className="status-badge pending" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} /> Pending Approval
                    </span>
                  )}
                </div>
              </div>
              <button className="btn btn-secondary" onClick={onLogout} title="Log Out">
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '8px' }}>
              <button className="btn btn-secondary" onClick={() => onOpenAuthModal('login')}>
                Log In
              </button>
              <button className="btn btn-primary" onClick={() => onOpenAuthModal('register')}>
                Sign Up
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
