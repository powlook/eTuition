import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar.jsx';
import AuthModal from './components/AuthModal.jsx';
import CurriculumBrowser from './components/CurriculumBrowser.jsx';
import ExerciseWorkspace from './components/ExerciseWorkspace.jsx';
import AdminDashboard from './components/AdminDashboard.jsx';
import StudentDashboard from './components/StudentDashboard.jsx';

export default function App() {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [currentFormLevel, setFormLevel] = useState(5);
  const [activeTab, setActiveTab] = useState('curriculum'); // 'curriculum' | 'exercise' | 'progress' | 'admin'
  const [selectedTopic, setSelectedTopic] = useState(null);

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login'); // 'login' | 'register'

  // Restore stored session on mount
  useEffect(() => {
    const storedToken = localStorage.getItem('etuition_token');
    const storedUser = localStorage.getItem('etuition_user');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        const parsed = JSON.parse(storedUser);
        setUser(parsed);
        if (parsed.form_level) {
          setFormLevel(parsed.form_level);
        }
      } catch (e) {
        localStorage.removeItem('etuition_token');
        localStorage.removeItem('etuition_user');
      }
    }
  }, []);

  const handleOpenAuthModal = (mode) => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setToken(localStorage.getItem('etuition_token'));
    if (userData.form_level) {
      setFormLevel(userData.form_level);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('etuition_token');
    localStorage.removeItem('etuition_user');
    setUser(null);
    setToken(null);
    setActiveTab('curriculum');
  };

  const handleSelectTopic = (topic) => {
    setSelectedTopic(topic);
    setActiveTab('exercise');
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Navbar
        user={user}
        currentFormLevel={currentFormLevel}
        setFormLevel={setFormLevel}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenAuthModal={handleOpenAuthModal}
        onLogout={handleLogout}
      />

      <main style={{ flex: 1 }}>
        {activeTab === 'curriculum' && (
          <CurriculumBrowser
            user={user}
            currentFormLevel={user && user.role === 'student' ? user.form_level : currentFormLevel}
            setFormLevel={setFormLevel}
            onSelectTopic={handleSelectTopic}
          />
        )}

        {activeTab === 'exercise' && selectedTopic && (
          <ExerciseWorkspace
            topic={selectedTopic}
            user={user}
            token={token}
            onBackToCurriculum={() => setActiveTab('curriculum')}
          />
        )}

        {activeTab === 'admin' && user && user.role === 'admin' && (
          <AdminDashboard token={token} />
        )}

        {activeTab === 'progress' && user && (
          <StudentDashboard user={user} token={token} onSelectTopic={handleSelectTopic} />
        )}
      </main>

      <footer style={{ textAlign: 'center', padding: '20px 16px', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.88rem' }}>
        Developed by Yap Pow Look, 2026
      </footer>

      <AuthModal
        isOpen={authModalOpen}
        mode={authMode}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
}
