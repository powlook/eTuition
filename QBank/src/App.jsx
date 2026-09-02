import React, { useState, useEffect } from 'react';
import PracticeExplorer from './components/PracticeExplorer';
import ExcelHub from './components/ExcelHub';
import AdminPortal from './components/AdminPortal';
import DynamicGeneratorModal from './components/DynamicGeneratorModal';
import { BookOpen, FileSpreadsheet, ShieldCheck, Cpu, Moon, Sun } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('practice');
  const [activeFormLevel, setActiveFormLevel] = useState(6);
  const [topics, setTopics] = useState([]);
  const [selectedTopicId, setSelectedTopicId] = useState('');
  const [activeStrand, setActiveStrand] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [theme, setTheme] = useState('dark');
  const [isGeneratorOpen, setIsGeneratorOpen] = useState(false);

  // Shared Display Toggle Controls Across App
  const [showFormulas, setShowFormulas] = useState(true);
  const [showImages, setShowImages] = useState(true);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const fetchTopics = async () => {
    try {
      let url = `/api/topics`;
      if (activeFormLevel) url += `?form_level=${activeFormLevel}`;
      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setTopics(data.topics);
      }
    } catch (e) {
      console.error('Failed to load topics:', e);
    }
  };

  useEffect(() => {
    fetchTopics();
    setSelectedTopicId('');
  }, [activeFormLevel]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header-glass">
        <div className="logo-group">
          <div className="logo-badge">Q</div>
          <div>
            <h1 className="logo-title">QBank</h1>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
              DepEd Philippines MATATAG K-10 Mathematics Engine
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="nav-tabs">
          <button
            className={`nav-btn ${activeTab === 'practice' ? 'active' : ''}`}
            onClick={() => setActiveTab('practice')}
            id="tab-practice-btn"
          >
            <BookOpen size={18} /> Practice Explorer
          </button>
          <button
            className={`nav-btn ${activeTab === 'excel' ? 'active' : ''}`}
            onClick={() => setActiveTab('excel')}
            id="tab-excel-btn"
          >
            <FileSpreadsheet size={18} /> Excel Hub
          </button>
          <button
            className={`nav-btn ${activeTab === 'admin' ? 'active' : ''}`}
            onClick={() => setActiveTab('admin')}
            id="tab-admin-btn"
          >
            <ShieldCheck size={18} /> Admin Portal
          </button>
        </nav>

        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          <button className="btn-primary" onClick={() => setIsGeneratorOpen(true)} id="btn-open-generator">
            <Cpu size={16} /> Dynamic Generator
          </button>

          <button className="theme-toggle-btn" onClick={toggleTheme} title="Toggle Dark/Light Mode" id="theme-toggle-btn">
            {theme === 'dark' ? <Sun size={20} color="var(--accent-amber)" /> : <Moon size={20} color="var(--accent-primary)" />}
          </button>
        </div>
      </header>

      {/* Grade Level Selector (Form 1 to 10) */}
      <div className="form-level-bar">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(lvl => (
          <button
            key={lvl}
            className={`form-level-tab ${activeFormLevel === lvl ? 'active' : ''}`}
            onClick={() => setActiveFormLevel(lvl)}
            id={`form-level-tab-${lvl}`}
          >
            Form {lvl}
          </button>
        ))}
      </div>

      {/* Main View Router */}
      <main>
        {activeTab === 'practice' && (
          <PracticeExplorer
            activeFormLevel={activeFormLevel}
            topics={topics}
            selectedTopicId={selectedTopicId}
            setSelectedTopicId={setSelectedTopicId}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            activeStrand={activeStrand}
            setActiveStrand={setActiveStrand}
            showFormulas={showFormulas}
            setShowFormulas={setShowFormulas}
            showImages={showImages}
            setShowImages={setShowImages}
          />
        )}

        {activeTab === 'excel' && <ExcelHub />}

        {activeTab === 'admin' && (
          <AdminPortal
            activeFormLevel={activeFormLevel}
            topics={topics}
            onRefreshNeeded={fetchTopics}
            showFormulas={showFormulas}
            setShowFormulas={setShowFormulas}
            showImages={showImages}
            setShowImages={setShowImages}
          />
        )}
      </main>

      {/* Dynamic Generator Modal */}
      {isGeneratorOpen && (
        <DynamicGeneratorModal
          topics={topics}
          onClose={() => setIsGeneratorOpen(false)}
          onGenerated={fetchTopics}
        />
      )}

      <footer style={{ textAlign: 'center', padding: '20px 16px', borderTop: '1px solid var(--border-color)', color: 'var(--text-muted)', fontSize: '0.88rem', marginTop: 'auto' }}>
        Developed by Yap Pow Look, 2026
      </footer>
    </div>
  );
}
