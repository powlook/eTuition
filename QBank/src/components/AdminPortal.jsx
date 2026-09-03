import React, { useState, useEffect } from 'react';
import MathRenderer from './MathRenderer';
import { Plus, Edit3, Trash2, Save, X, Image as ImageIcon, Eye, ChevronLeft, ChevronRight, CheckSquare } from 'lucide-react';

function getFormattedQuestionTitle(rawTitle, topicId, questionId) {
  if (!rawTitle) {
    const tid = topicId || 1;
    const qid = String(questionId || 1).padStart(3, '0');
    return `[T${tid}-Q${qid}]`;
  }

  const match = rawTitle.match(/\[?T\d+-Q\d+\]?/i);
  if (match) {
    let code = match[0];
    if (!code.startsWith('[')) code = '[' + code;
    if (!code.endsWith(']')) code = code + ']';
    return code;
  }

  const bracketMatch = rawTitle.match(/\[(.*?)\]/);
  if (bracketMatch) {
    return bracketMatch[0];
  }

  const tid = topicId || 1;
  const qid = String(questionId || 1).padStart(3, '0');
  return `[T${tid}-Q${qid}]`;
}

export default function AdminPortal({ activeFormLevel, topics, onRefreshNeeded, showFormulas, setShowFormulas, showImages, setShowImages }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const modalContentRef = React.useRef(null);

  useEffect(() => {
    if (isModalOpen) {
      if (modalContentRef.current) modalContentRef.current.scrollTop = 0;
      window.scrollTo({ top: 0, behavior: 'instant' });
    }
  }, [isModalOpen]);

  // Content Curriculum & Content Standard Filters State
  const [adminFormLevel, setAdminFormLevel] = useState(activeFormLevel || '');
  const [adminStrand, setAdminStrand] = useState('');
  const [filterTopicId, setFilterTopicId] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [allTopics, setAllTopics] = useState([]);

  // Selection & Bulk Actions State
  const [selectedIds, setSelectedIds] = useState([]);

  // Per-Question Display Toggle Overrides State
  const [customFormulasState, setCustomFormulasState] = useState({});
  const [customImagesState, setCustomImagesState] = useState({});

  // Display Settings Save State
  const [savingSettings, setSavingSettings] = useState(false);
  const [saveSuccessMsg, setSaveSuccessMsg] = useState('');

  // Mass check / uncheck state for current page
  const isAllPageFormulasChecked = questions.length > 0 && questions.every(q => {
    return customFormulasState[q.id] !== undefined
      ? customFormulasState[q.id]
      : (q.show_formula !== undefined ? Boolean(q.show_formula) : true);
  });

  const isAllPageImagesChecked = questions.length > 0 && questions.every(q => {
    return customImagesState[q.id] !== undefined
      ? customImagesState[q.id]
      : (q.show_image !== undefined ? Boolean(q.show_image) : true);
  });

  const handleMassToggleFormulas = (newVal) => {
    const updated = { ...customFormulasState };
    questions.forEach(q => {
      updated[q.id] = newVal;
      q.show_formula = newVal ? 1 : 0;
    });
    setCustomFormulasState(updated);
  };

  const handleMassToggleImages = (newVal) => {
    const updated = { ...customImagesState };
    questions.forEach(q => {
      updated[q.id] = newVal;
      q.show_image = newVal ? 1 : 0;
    });
    setCustomImagesState(updated);
  };

  const handleSaveDisplaySettings = async () => {
    if (questions.length === 0) return;
    setSavingSettings(true);
    setSaveSuccessMsg('');

    const settingsPayload = questions.map(q => {
      const fmlOn = customFormulasState[q.id] !== undefined
        ? customFormulasState[q.id]
        : (q.show_formula !== undefined ? Boolean(q.show_formula) : true);
      const imgOn = customImagesState[q.id] !== undefined
        ? customImagesState[q.id]
        : (q.show_image !== undefined ? Boolean(q.show_image) : true);

      return {
        id: q.id,
        show_formula: fmlOn ? 1 : 0,
        show_image: imgOn ? 1 : 0
      };
    });

    try {
      const res = await fetch('/api/admin/questions/batch-display-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ settings: settingsPayload })
      });
      const data = await res.json();

      if (window.location.port !== '6000') {
        await fetch('http://localhost:6000/api/admin/questions/batch-display-settings', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ settings: settingsPayload })
        }).catch(() => {});
      }

      if (data.success) {
        setSaveSuccessMsg(`✓ Display settings saved successfully for Page ${page} (${settingsPayload.length} questions)!`);
        setQuestions(prev => prev.map(q => {
          const match = settingsPayload.find(s => s.id === q.id);
          return match ? { ...q, show_formula: match.show_formula, show_image: match.show_image } : q;
        }));
        if (onRefreshNeeded) onRefreshNeeded();
        setTimeout(() => setSaveSuccessMsg(''), 4500);
      } else {
        alert(`Failed to save settings: ${data.message}`);
      }
    } catch (err) {
      console.error('Failed to save display settings:', err);
      alert('Failed to save display settings.');
    } finally {
      setSavingSettings(false);
    }
  };

  // Pagination State
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(15);
  const [pagination, setPagination] = useState({ total: 0, totalPages: 1 });

  const initialForm = {
    topic_id: topics[0]?.id || 1,
    question_title: '',
    question_text: '',
    math_formula: '',
    question_type: 'MCQ',
    optionA: '',
    optionB: '',
    optionC: '',
    optionD: '',
    correct_answer: '',
    hint: '',
    working_steps: '',
    image_url: '',
    image_alt: '',
    difficulty: 3
  };

  const [formData, setFormData] = useState(initialForm);

  const fetchAllTopics = async () => {
    try {
      const res = await fetch('/api/topics');
      const data = await res.json();
      if (data.success) {
        setAllTopics(data.topics);
      }
    } catch (e) {
      console.error('Failed to load all topics:', e);
    }
  };

  useEffect(() => {
    fetchAllTopics();
  }, []);

  useEffect(() => {
    if (activeFormLevel) {
      setAdminFormLevel(activeFormLevel);
    }
  }, [activeFormLevel]);

  const strandsList = [
    'Measurement and Geometry',
    'Number and Algebra',
    'Data and Probability'
  ];

  const topicsSource = allTopics.length > 0 ? allTopics : topics;

  const filteredTopics = topicsSource.filter(t => {
    if (adminFormLevel && t.form_level !== Number(adminFormLevel)) return false;
    if (adminStrand && t.strand !== adminStrand) return false;
    return true;
  });

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let url = `/api/questions?page=${page}&limit=${limit}`;
      if (adminFormLevel) url += `&form_level=${adminFormLevel}`;
      if (adminStrand) url += `&strand=${encodeURIComponent(adminStrand)}`;
      if (filterTopicId) url += `&topic_id=${filterTopicId}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setQuestions(data.questions);
        setPagination(data.pagination || { total: data.questions.length, page, limit, totalPages: 1 });
      }
    } catch (e) {
      console.error('Failed to fetch questions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1);
    setSelectedIds([]);
  }, [adminFormLevel, adminStrand, filterTopicId, searchTerm, limit]);

  useEffect(() => {
    fetchQuestions();
    setSelectedIds([]);
  }, [adminFormLevel, adminStrand, filterTopicId, searchTerm, page, limit]);

  const handleClearFilters = () => {
    setAdminFormLevel('');
    setAdminStrand('');
    setFilterTopicId('');
    setSearchTerm('');
  };

  const handleToggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleToggleSelectAllPage = () => {
    const currentPageIds = questions.map(q => q.id);
    const isAllSelected = currentPageIds.length > 0 && currentPageIds.every(id => selectedIds.includes(id));

    if (isAllSelected) {
      setSelectedIds(prev => prev.filter(id => !currentPageIds.includes(id)));
    } else {
      setSelectedIds(prev => Array.from(new Set([...prev, ...currentPageIds])));
    }
  };

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to delete ${selectedIds.length} selected question(s) from the Question Bank?`)) return;

    try {
      const res = await fetch('/api/admin/questions/bulk-delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ids: selectedIds })
      });
      const data = await res.json();
      if (data.success) {
        setSelectedIds([]);
        fetchQuestions();
        if (onRefreshNeeded) onRefreshNeeded();
      } else {
        alert(`Bulk delete failed: ${data.message}`);
      }
    } catch (e) {
      console.error('Bulk delete failed:', e);
    }
  };

  const handleOpenCreateModal = () => {
    setEditingQuestion(null);
    setFormData({
      ...initialForm,
      topic_id: filteredTopics[0]?.id || topics[0]?.id || 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (q) => {
    setEditingQuestion(q);
    const opts = q.options || [];
    const steps = (q.working_steps || []).join('\n');
    setFormData({
      topic_id: q.topic_id,
      question_title: q.question_title,
      question_text: q.question_text,
      math_formula: q.math_formula || '',
      question_type: q.question_type || 'MCQ',
      optionA: opts[0] || '',
      optionB: opts[1] || '',
      optionC: opts[2] || '',
      optionD: opts[3] || '',
      correct_answer: q.correct_answer,
      hint: q.hint || '',
      working_steps: steps,
      image_url: q.image_url || '',
      image_alt: q.image_alt || '',
      difficulty: q.difficulty || 3
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this question from the Question Bank?')) return;
    try {
      const res = await fetch(`/api/admin/questions/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        fetchQuestions();
        if (onRefreshNeeded) onRefreshNeeded();
      }
    } catch (e) {
      console.error('Delete failed:', e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const options = [formData.optionA, formData.optionB, formData.optionC, formData.optionD].filter(Boolean);
    const working_steps = formData.working_steps.split('\n').map(s => s.trim()).filter(Boolean);

    const payload = {
      topic_id: Number(formData.topic_id),
      question_title: formData.question_title,
      question_text: formData.question_text,
      math_formula: formData.math_formula,
      question_type: formData.question_type,
      options,
      correct_answer: formData.correct_answer || options[0] || '',
      hint: formData.hint,
      working_steps,
      image_url: formData.image_url,
      image_alt: formData.image_alt,
      difficulty: Number(formData.difficulty)
    };

    try {
      const url = editingQuestion ? `/api/admin/questions/${editingQuestion.id}` : '/api/admin/questions';
      const method = editingQuestion ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setIsModalOpen(false);
        fetchQuestions();
        if (onRefreshNeeded) onRefreshNeeded();
      }
    } catch (e) {
      console.error('Save question failed:', e);
    }
  };

  const totalPages = pagination.totalPages || 1;
  const startItem = questions.length > 0 ? (page - 1) * limit + 1 : 0;
  const endItem = Math.min(page * limit, pagination.total || questions.length);

  return (
    <div className="admin-portal animate-fade-in">
      <div className="glass-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>Admin Question Bank Management</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Filter by Content Curriculum & Content Standard, edit, search, or mass check/uncheck formula & image settings.
          </p>
        </div>

        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          {/* Display Checkbox Toggles & Save Settings Button */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.45rem 0.85rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px solid var(--border-card)',
              flexWrap: 'wrap'
            }}
            id="admin-display-toggles-bar"
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }} title="Mass check or uncheck formulas for all questions on this page">
              <input
                type="checkbox"
                checked={isAllPageFormulasChecked}
                onChange={(e) => handleMassToggleFormulas(e.target.checked)}
                style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--accent-cyan)' }}
                id="toggle-show-formulas"
              />
              <span>Show Formulas</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-primary)' }} title="Mass check or uncheck images for all questions on this page">
              <input
                type="checkbox"
                checked={isAllPageImagesChecked}
                onChange={(e) => handleMassToggleImages(e.target.checked)}
                style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--accent-cyan)' }}
                id="toggle-show-images"
              />
              <span>Show Images</span>
            </label>

            <button
              className="btn-primary"
              style={{
                padding: '0.45rem 1rem',
                fontSize: '0.85rem',
                background: 'linear-gradient(135deg, #10b981, #059669)',
                borderColor: '#10b981',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.35)'
              }}
              onClick={handleSaveDisplaySettings}
              disabled={savingSettings}
              id="admin-save-display-settings-btn"
            >
              <Save size={16} /> {savingSettings ? 'Saving...' : 'Save Settings'}
            </button>
          </div>

          <button className="btn-primary" onClick={handleOpenCreateModal} id="admin-create-btn">
            <Plus size={18} /> Add New Question
          </button>
        </div>
      </div>

      {/* Filters Bar: Content Curriculum & Content Standard */}
      <div className="glass-panel" style={{ marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.75rem' }}>
            <div style={{ fontSize: '0.9rem', fontWeight: '700', color: 'var(--accent-cyan)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Content Curriculum & Content Standard Filters</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
              {(adminFormLevel || adminStrand || filterTopicId || searchTerm) && (
                <button
                  className="btn-secondary"
                  style={{ padding: '0.35rem 0.75rem', fontSize: '0.8rem', color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                  onClick={handleClearFilters}
                  id="admin-clear-filters-btn"
                >
                  <X size={14} /> Clear All Filters
                </button>
              )}
            </div>
          </div>

          <div className="controls-bar" style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', flexWrap: 'wrap' }}>
            {/* Search Input */}
            <div className="search-box" style={{ flex: '1 1 200px' }}>
              <input
                type="text"
                className="search-input"
                placeholder="Search title, formula, or text..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                id="admin-search-input"
              />
            </div>

            {/* Content Curriculum: Grade / Form Level Selector */}
            <select
              className="select-dropdown"
              value={adminFormLevel}
              onChange={(e) => {
                setAdminFormLevel(e.target.value);
                setFilterTopicId('');
              }}
              id="admin-form-level-select"
            >
              <option value="">All Form Levels (Content Curriculum)</option>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(lvl => (
                <option key={lvl} value={lvl}>Form {lvl}</option>
              ))}
            </select>

            {/* Content Curriculum: Strand Selector */}
            <select
              className="select-dropdown"
              value={adminStrand}
              onChange={(e) => {
                setAdminStrand(e.target.value);
                setFilterTopicId('');
              }}
              id="admin-strand-select"
            >
              <option value="">All Content Domains (Curriculum)</option>
              {strandsList.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>

            {/* Content Standard: Topic Selector */}
            <select
              className="select-dropdown"
              value={filterTopicId}
              onChange={(e) => setFilterTopicId(e.target.value)}
              id="admin-topic-select"
              style={{ flex: '1 1 240px' }}
            >
              <option value="">
                {adminStrand || adminFormLevel
                  ? `All Topics (${filteredTopics.length})`
                  : `All Content Standards / Topics (${topicsSource.length})`}
              </option>
              {filteredTopics.map(t => (
                <option key={t.id} value={t.id}>
                  [Form {t.form_level}] {t.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Question Table / List */}
      <div className="glass-panel">
        {/* Bulk Action Bar */}
        {selectedIds.length > 0 && (
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justify: 'space-between',
              padding: '0.75rem 1rem',
              marginBottom: '1rem',
              background: 'rgba(244, 63, 94, 0.12)',
              border: '1px solid rgba(244, 63, 94, 0.4)',
              borderRadius: '10px'
            }}
            id="bulk-action-bar"
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-rose)', fontWeight: '700' }}>
              <CheckSquare size={18} />
              <span>{selectedIds.length} question(s) selected</span>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <button
                className="btn-secondary"
                style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem' }}
                onClick={() => setSelectedIds([])}
              >
                Clear Selection
              </button>
              <button
                className="btn-primary"
                style={{ background: 'var(--accent-rose)', borderColor: 'var(--accent-rose)', padding: '0.4rem 1rem', fontSize: '0.85rem' }}
                onClick={handleBulkDelete}
                id="bulk-delete-btn"
              >
                <Trash2 size={16} /> Delete Selected ({selectedIds.length})
              </button>
            </div>
          </div>
        )}

        {/* Save Success Alert Banner */}
        {saveSuccessMsg && (
          <div
            style={{
              padding: '0.75rem 1.25rem',
              marginBottom: '1rem',
              background: 'rgba(16, 185, 129, 0.15)',
              border: '1px solid rgba(16, 185, 129, 0.4)',
              color: '#34d399',
              borderRadius: '10px',
              fontWeight: '700',
              fontSize: '0.9rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
            id="save-success-banner"
          >
            <span>{saveSuccessMsg}</span>
          </div>
        )}

        {loading ? (
          <p style={{ textAlign: 'center', color: 'var(--text-secondary)', padding: '2rem' }}>Loading questions...</p>
        ) : (
          <>
            <div style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.9rem' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid var(--border-card)', textAlign: 'left' }}>
                    <th style={{ padding: '0.75rem', width: '40px', textAlign: 'center' }}>
                      <input
                        type="checkbox"
                        style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                        checked={questions.length > 0 && questions.every(q => selectedIds.includes(q.id))}
                        onChange={handleToggleSelectAllPage}
                        title="Select / Deselect all on this page"
                        id="admin-select-all-checkbox"
                      />
                    </th>
                    <th style={{ padding: '0.75rem' }}>ID</th>
                    <th style={{ padding: '0.75rem' }}>Form / Strand</th>
                    <th style={{ padding: '0.75rem' }}>Question Title</th>
                    <th style={{ padding: '0.75rem', minWidth: '220px' }}>Question / Problem Statement</th>
                    <th style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <input
                          type="checkbox"
                          checked={isAllPageFormulasChecked}
                          onChange={(e) => handleMassToggleFormulas(e.target.checked)}
                          style={{ cursor: 'pointer', width: '15px', height: '15px', accentColor: 'var(--accent-cyan)' }}
                          title="Mass check / uncheck formulas for all questions on this page"
                          id="header-mass-formula-checkbox"
                        />
                        <span>Formula</span>
                      </div>
                    </th>
                    <th style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                        <input
                          type="checkbox"
                          checked={isAllPageImagesChecked}
                          onChange={(e) => handleMassToggleImages(e.target.checked)}
                          style={{ cursor: 'pointer', width: '15px', height: '15px', accentColor: 'var(--accent-cyan)' }}
                          title="Mass check / uncheck images for all questions on this page"
                          id="header-mass-image-checkbox"
                        />
                        <span>Image / Graph</span>
                      </div>
                    </th>
                    <th style={{ padding: '0.75rem' }}>Correct Answer</th>
                    <th style={{ padding: '0.75rem', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {questions.length === 0 ? (
                    <tr>
                      <td colSpan={9} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                        No questions found matching the selected filter.
                      </td>
                    </tr>
                  ) : (
                    questions.map((q) => {
                      const isFormulaVisible = customFormulasState[q.id] !== undefined ? customFormulasState[q.id] : (q.show_formula !== undefined ? Boolean(q.show_formula) : showFormulas);
                      const isImageVisible = customImagesState[q.id] !== undefined ? customImagesState[q.id] : (q.show_image !== undefined ? Boolean(q.show_image) : showImages);

                      const handleToggleImage = async (newVal) => {
                        setCustomImagesState(prev => ({ ...prev, [q.id]: newVal }));
                        q.show_image = newVal ? 1 : 0;
                        const body = JSON.stringify({
                          show_image: newVal ? 1 : 0,
                          show_formula: isFormulaVisible ? 1 : 0
                        });
                        try {
                          await fetch(`/api/questions/${q.id}/display-settings`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body
                          });
                          if (window.location.port !== '6000') {
                            await fetch(`http://localhost:6000/api/questions/${q.id}/display-settings`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body
                            }).catch(() => {});
                          }
                        } catch (err) {
                          console.error('Failed to update image display setting:', err);
                        }
                      };

                      const handleToggleFormula = async (newVal) => {
                        setCustomFormulasState(prev => ({ ...prev, [q.id]: newVal }));
                        q.show_formula = newVal ? 1 : 0;
                        const body = JSON.stringify({
                          show_image: isImageVisible ? 1 : 0,
                          show_formula: newVal ? 1 : 0
                        });
                        try {
                          await fetch(`/api/questions/${q.id}/display-settings`, {
                            method: 'PUT',
                            headers: { 'Content-Type': 'application/json' },
                            body
                          });
                          if (window.location.port !== '6000') {
                            await fetch(`http://localhost:6000/api/questions/${q.id}/display-settings`, {
                              method: 'PUT',
                              headers: { 'Content-Type': 'application/json' },
                              body
                            }).catch(() => {});
                          }
                        } catch (err) {
                          console.error('Failed to update formula display setting:', err);
                        }
                      };

                      return (
                        <tr
                          key={q.id}
                          style={{
                            borderBottom: '1px solid var(--border-card)',
                            background: selectedIds.includes(q.id) ? 'rgba(244, 63, 94, 0.05)' : 'transparent'
                          }}
                          id={`admin-row-${q.id}`}
                        >
                          <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                            <input
                              type="checkbox"
                              style={{ cursor: 'pointer', width: '16px', height: '16px' }}
                              checked={selectedIds.includes(q.id)}
                              onChange={() => handleToggleSelect(q.id)}
                              id={`checkbox-q-${q.id}`}
                            />
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: '700', color: 'var(--accent-cyan)' }}>#{q.id}</td>
                          <td style={{ padding: '0.75rem' }}>
                            <span className="badge badge-form">Form {q.form_level}</span>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{q.strand}</div>
                          </td>
                          <td style={{ padding: '0.75rem', fontWeight: '700' }}>
                            {getFormattedQuestionTitle(q.question_title, q.topic_id, q.id)}
                          </td>
                          <td style={{ padding: '0.75rem', maxWidth: '300px', fontSize: '0.88rem', color: 'var(--text-primary)' }}>
                            <MathRenderer content={q.question_text || ''} />
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-start' }}>
                              {q.math_formula && (
                                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', color: isFormulaVisible ? 'var(--accent-cyan)' : 'var(--text-muted)' }} title="Toggle formula for this individual question">
                                  <input
                                    type="checkbox"
                                    checked={isFormulaVisible}
                                    onChange={(e) => handleToggleFormula(e.target.checked)}
                                    style={{ width: '14px', height: '14px', cursor: 'pointer' }}
                                    id={`admin-q-formula-${q.id}`}
                                  />
                                  <span>Formula</span>
                                </label>
                              )}
                              {isFormulaVisible && q.math_formula ? (
                                <div style={{ fontSize: '0.85rem', color: 'var(--accent-primary)', marginTop: '0.25rem', padding: '0.2rem 0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '6px' }}>
                                  <MathRenderer content={`$${q.math_formula}$`} inline />
                                </div>
                              ) : (
                                q.math_formula && (
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>Hidden</span>
                                )
                              )}
                            </div>
                          </td>
                          <td style={{ padding: '0.75rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.3rem', alignItems: 'flex-start' }}>
                              {q.image_url && (
                                <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.25rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', color: isImageVisible ? 'var(--accent-green)' : 'var(--text-muted)' }} title="Toggle image preview for this individual question">
                                  <input
                                    type="checkbox"
                                    checked={isImageVisible}
                                    onChange={(e) => handleToggleImage(e.target.checked)}
                                    style={{ width: '14px', height: '14px', cursor: 'pointer' }}
                                    id={`admin-q-image-${q.id}`}
                                  />
                                  <span>Show Image</span>
                                </label>
                              )}
                              {isImageVisible ? (
                                q.image_url ? (
                                  <>
                                    <img
                                      src={q.image_url}
                                      alt={q.image_alt || 'Visual Diagram'}
                                      style={{ maxHeight: '60px', maxWidth: '120px', borderRadius: '6px', border: '1px solid var(--border-card)', objectFit: 'contain', background: '#0f172a', padding: '2px' }}
                                    />
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', color: 'var(--accent-green)', fontSize: '0.75rem' }}>
                                      <ImageIcon size={12} /> {q.image_alt || 'Attached'}
                                    </div>
                                  </>
                                ) : (
                                  <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>None</span>
                                )
                              ) : (
                                <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem', fontStyle: 'italic' }}>
                                  {q.image_url ? 'Attached (Hidden)' : 'None'}
                                </span>
                              )}
                            </div>
                          </td>
                        <td style={{ padding: '0.75rem', fontWeight: '600', color: 'var(--accent-amber)' }}>
                          <MathRenderer content={q.correct_answer} inline />
                        </td>
                        <td style={{ padding: '0.75rem', textAlign: 'right' }}>
                          <div style={{ display: 'inline-flex', gap: '0.5rem' }}>
                            <button
                              className="btn-secondary"
                              style={{ padding: '0.4rem 0.6rem' }}
                              onClick={() => handleOpenEditModal(q)}
                              id={`edit-btn-${q.id}`}
                            >
                              <Edit3 size={16} /> Edit
                            </button>
                            <button
                              className="btn-secondary"
                              style={{ padding: '0.4rem 0.6rem', color: 'var(--accent-rose)', borderColor: 'rgba(244, 63, 94, 0.3)' }}
                              onClick={() => handleDelete(q.id)}
                              id={`delete-btn-${q.id}`}
                            >
                              <Trash2 size={16} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls Bar */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-card)' }}>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                Showing <strong>{startItem}</strong> to <strong>{endItem}</strong> of <strong>{pagination.total || questions.length}</strong> questions
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
                  <span>Per page:</span>
                  <select
                    className="select-dropdown"
                    style={{ padding: '0.25rem 0.5rem', fontSize: '0.85rem', width: 'auto' }}
                    value={limit}
                    onChange={(e) => setLimit(Number(e.target.value))}
                    id="admin-limit-select"
                  >
                    <option value={15}>15</option>
                    <option value={30}>30</option>
                    <option value={50}>50</option>
                    <option value={100}>100</option>
                  </select>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <button
                    className="btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    disabled={page <= 1}
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    id="admin-prev-page-btn"
                  >
                    <ChevronLeft size={16} /> Previous
                  </button>

                  <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0 0.5rem', color: 'var(--text-primary)' }}>
                    Page {page} of {totalPages}
                  </span>

                  <button
                    className="btn-secondary"
                    style={{ padding: '0.4rem 0.8rem', fontSize: '0.85rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    disabled={page >= totalPages}
                    onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                    id="admin-next-page-btn"
                  >
                    Next <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Create / Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content animate-fade-in" ref={modalContentRef} id="admin-question-modal">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: '800' }}>
                {editingQuestion ? `Edit Question #${editingQuestion.id}` : 'Create New Math Question'}
              </h3>
              <button className="btn-secondary" style={{ padding: '0.4rem' }} onClick={() => setIsModalOpen(false)}>
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label className="form-label">Topic Selection</label>
                <select
                  className="form-input"
                  value={formData.topic_id}
                  onChange={(e) => setFormData({ ...formData, topic_id: e.target.value })}
                  required
                >
                  {topics.map(t => (
                    <option key={t.id} value={t.id}>[Form {t.form_level}] {t.strand} - {t.title}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Question Title</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.question_title}
                  onChange={(e) => setFormData({ ...formData, question_title: e.target.value })}
                  placeholder="e.g. Factorization of Quadratic Polynomials"
                  required
                  id="modal-qtitle-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Question Text (Supports Markdown & LaTeX)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.question_text}
                  onChange={(e) => setFormData({ ...formData, question_text: e.target.value })}
                  placeholder="e.g. Calculate the hypotenuse length for right triangle with legs \(a=6\) and \(b=8\):"
                  required
                  id="modal-qtext-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">LaTeX Formula Expression (e.g. \frac&#123;a&#125;&#123;b&#125;)</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.math_formula}
                  onChange={(e) => setFormData({ ...formData, math_formula: e.target.value })}
                  placeholder="e.g. c = \sqrt{a^2 + b^2}"
                  id="modal-formula-input"
                />
                {formData.math_formula && (
                  <div style={{ marginTop: '0.4rem', padding: '0.5rem', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', fontSize: '0.9rem' }}>
                    <Eye size={14} style={{ display: 'inline', marginRight: 4 }} /> Live Math Preview: <MathRenderer content={`$$${formData.math_formula}$$`} />
                  </div>
                )}
              </div>

              {/* Options Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Option A</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.optionA}
                    onChange={(e) => setFormData({ ...formData, optionA: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Option B</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.optionB}
                    onChange={(e) => setFormData({ ...formData, optionB: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Option C</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.optionC}
                    onChange={(e) => setFormData({ ...formData, optionC: e.target.value })}
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Option D</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.optionD}
                    onChange={(e) => setFormData({ ...formData, optionD: e.target.value })}
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Correct Answer</label>
                <input
                  type="text"
                  className="form-input"
                  value={formData.correct_answer}
                  onChange={(e) => setFormData({ ...formData, correct_answer: e.target.value })}
                  placeholder="Must match exact option text"
                  required
                  id="modal-correct-input"
                />
              </div>

              {/* Image attachment fields */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '0.75rem' }}>
                <div className="form-group">
                  <label className="form-label">Graph / Image URL (Visual Asset)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.image_url}
                    onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                    placeholder="https://example.com/graph.png"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Image Alt Caption</label>
                  <input
                    type="text"
                    className="form-input"
                    value={formData.image_alt}
                    onChange={(e) => setFormData({ ...formData, image_alt: e.target.value })}
                    placeholder="Line graph trend"
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Step-by-Step Derivation Working (One step per line)</label>
                <textarea
                  className="form-textarea"
                  rows={3}
                  value={formData.working_steps}
                  onChange={(e) => setFormData({ ...formData, working_steps: e.target.value })}
                  placeholder="**Step 1: Identify leg lengths**&#10;$$a=6, b=8$$&#10;**Step 2: Apply formula**&#10;$$c = \sqrt{36+64} = 10$$"
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '1.5rem' }}>
                <button type="button" className="btn-secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary" id="modal-submit-btn">
                  <Save size={18} /> Save Question
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
