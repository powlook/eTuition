import React, { useState, useEffect } from 'react';
import MathRenderer from './MathRenderer';
import { CheckCircle2, XCircle, Lightbulb, ChevronDown, ChevronUp, Image as ImageIcon, RefreshCw } from 'lucide-react';

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

export default function PracticeExplorer({ activeFormLevel, topics, selectedTopicId, setSelectedTopicId, searchTerm, setSearchTerm, activeStrand, setActiveStrand, showFormulas, setShowFormulas, showImages, setShowImages }) {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [userAnswers, setUserAnswers] = useState({});
  const [validationResults, setValidationResults] = useState({});
  const [showSteps, setShowSteps] = useState({});
  const [showHints, setShowHints] = useState({});
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1 });

  // Per-Question Display Toggle Overrides State
  const [customFormulasState, setCustomFormulasState] = useState({});
  const [customImagesState, setCustomImagesState] = useState({});

  const fetchQuestions = async () => {
    setLoading(true);
    try {
      let url = `/api/questions?page=${page}&limit=10`;
      if (activeFormLevel) url += `&form_level=${activeFormLevel}`;
      if (selectedTopicId) url += `&topic_id=${selectedTopicId}`;
      if (activeStrand) url += `&strand=${encodeURIComponent(activeStrand)}`;
      if (searchTerm) url += `&search=${encodeURIComponent(searchTerm)}`;

      const res = await fetch(url);
      const data = await res.json();
      if (data.success) {
        setQuestions(data.questions);
        setPagination(data.pagination);
      }
    } catch (e) {
      console.error('Failed to fetch questions:', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [activeFormLevel, selectedTopicId, activeStrand, searchTerm, page]);

  const handleSelectOption = (questionId, option) => {
    setUserAnswers(prev => ({ ...prev, [questionId]: option }));
  };

  const handleVerifyAnswer = async (questionId) => {
    const submitted = userAnswers[questionId];
    if (!submitted) return;

    try {
      const res = await fetch('/api/questions/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question_id: questionId, submitted_answer: submitted })
      });
      const data = await res.json();
      if (data.success) {
        setValidationResults(prev => ({ ...prev, [questionId]: data }));
      }
    } catch (e) {
      console.error('Verification failed:', e);
    }
  };

  const toggleSteps = (questionId) => {
    setShowSteps(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const toggleHint = (questionId) => {
    setShowHints(prev => ({ ...prev, [questionId]: !prev[questionId] }));
  };

  const strandsList = [
    'Measurement and Geometry',
    'Number and Algebra',
    'Data and Probability'
  ];

  const filteredTopics = activeStrand
    ? topics.filter(t => t.strand === activeStrand)
    : topics;

  useEffect(() => {
    setPage(1);
  }, [activeFormLevel, selectedTopicId, activeStrand, searchTerm]);

  const renderPagination = (idPrefix) => {
    if (!pagination || pagination.totalPages <= 1) return null;

    const total = pagination.total || questions.length;
    const startItem = questions.length > 0 ? (page - 1) * 10 + 1 : 0;
    const endItem = Math.min(page * 10, total);

    return (
      <div
        style={{
          display: 'flex',
          justify: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '0.75rem',
          margin: '1.25rem 0',
          padding: '0.85rem 1.25rem',
          background: 'rgba(255, 255, 255, 0.03)',
          borderRadius: '12px',
          border: '1px solid var(--border-card)'
        }}
        id={`${idPrefix}-pagination-bar`}
      >
        <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Showing <strong>{startItem}</strong> - <strong>{endItem}</strong> of <strong>{total}</strong> questions
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <button
            className="btn-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
            disabled={page <= 1}
            onClick={() => setPage(p => Math.max(1, p - 1))}
            id={`${idPrefix}-prev-btn`}
          >
            Previous
          </button>

          <span style={{ fontSize: '0.85rem', fontWeight: 700, padding: '0 0.6rem', color: 'var(--text-primary)' }}>
            Page {page} of {pagination.totalPages}
          </span>

          <button
            className="btn-secondary"
            style={{ padding: '0.4rem 0.85rem', fontSize: '0.85rem' }}
            disabled={page >= pagination.totalPages}
            onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
            id={`${idPrefix}-next-btn`}
          >
            Next
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="practice-explorer animate-fade-in">
      {/* Filters Bar */}
      <div className="glass-panel">
        <div className="controls-bar" style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div className="search-box">
            <input
              type="text"
              className="search-input"
              placeholder="Search content standards, topics, formulas, or competencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <select
            className="select-dropdown"
            value={activeStrand}
            onChange={(e) => {
              setActiveStrand(e.target.value);
              setSelectedTopicId('');
            }}
          >
            <option value="">All Content Domains (Curriculum)</option>
            {strandsList.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>

          <select
            className="select-dropdown"
            value={selectedTopicId}
            onChange={(e) => setSelectedTopicId(e.target.value)}
          >
            <option value="">
              {activeStrand ? `All ${activeStrand} Topics (${filteredTopics.length})` : `All Form ${activeFormLevel} Content Standards (${topics.length})`}
            </option>
            {filteredTopics.map(t => (
              <option key={t.id} value={t.id}>{t.title}</option>
            ))}
          </select>

          {/* Display Checkbox Toggles */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.85rem',
              padding: '0.45rem 0.85rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px',
              border: '1px solid var(--border-card)'
            }}
            id="practice-display-toggles-bar"
          >
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              <input
                type="checkbox"
                checked={showFormulas}
                onChange={(e) => setShowFormulas(e.target.checked)}
                style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--accent-cyan)' }}
                id="practice-toggle-formulas"
              />
              <span>Show Formulas</span>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600', color: 'var(--text-primary)' }}>
              <input
                type="checkbox"
                checked={showImages}
                onChange={(e) => setShowImages(e.target.checked)}
                style={{ cursor: 'pointer', width: '16px', height: '16px', accentColor: 'var(--accent-cyan)' }}
                id="practice-toggle-images"
              />
              <span>Show Images</span>
            </label>
          </div>

          <button className="btn-secondary" onClick={fetchQuestions}>
            <RefreshCw size={16} /> Refresh
          </button>
        </div>
      </div>

      {/* Top Pagination Controls */}
      {renderPagination('top')}

      {/* Question List */}
      {loading ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading Question Bank repository...</p>
        </div>
      ) : questions.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem' }}>
          <p style={{ color: 'var(--text-secondary)' }}>No questions matched your current criteria.</p>
        </div>
      ) : (
        questions.map((q) => {
          const result = validationResults[q.id];
          const isStepsVisible = showSteps[q.id];
          const isHintVisible = showHints[q.id];

          const isFormulaVisible = customFormulasState[q.id] !== undefined ? customFormulasState[q.id] : (q.show_formula !== undefined ? Boolean(q.show_formula) : showFormulas);
          const isImageVisible = customImagesState[q.id] !== undefined ? customImagesState[q.id] : (q.show_image !== undefined ? Boolean(q.show_image) : showImages);

          return (
            <div key={q.id} className="question-card" id={`question-card-${q.id}`}>
              <div className="card-header-meta" style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span className="badge badge-form">Form {q.form_level}</span>
                <span className="badge badge-strand">{q.strand}</span>
                <span className="badge badge-diff">Difficulty {q.difficulty}/5</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Content Standard: {q.topic_title}
                </span>

                {/* Per-Question Individual Display Checkboxes */}
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', marginLeft: 'auto', background: 'rgba(255, 255, 255, 0.04)', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid var(--border-card)' }}>
                  {q.math_formula && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent-cyan)' }} title="Toggle formula for this individual question">
                      <input
                        type="checkbox"
                        checked={isFormulaVisible}
                        onChange={(e) => setCustomFormulasState(prev => ({ ...prev, [q.id]: e.target.checked }))}
                        style={{ cursor: 'pointer', width: '14px', height: '14px' }}
                        id={`practice-q-formula-${q.id}`}
                      />
                      <span>Show Formula</span>
                    </label>
                  )}
                  {q.image_url && (
                    <label style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '600', color: 'var(--accent-green)' }} title="Toggle image for this individual question">
                      <input
                        type="checkbox"
                        checked={isImageVisible}
                        onChange={(e) => setCustomImagesState(prev => ({ ...prev, [q.id]: e.target.checked }))}
                        style={{ cursor: 'pointer', width: '14px', height: '14px' }}
                        id={`practice-q-image-${q.id}`}
                      />
                      <span>Show Image</span>
                    </label>
                  )}
                </div>
              </div>

              <h3 className="question-title-text">{getFormattedQuestionTitle(q.question_title, q.topic_id, q.id)}</h3>
              <p className="question-body-text">
                <MathRenderer content={q.question_text} />
              </p>

              {isFormulaVisible && q.math_formula && (
                <div style={{ margin: '0.75rem 0', padding: '0.75rem 1rem', background: 'rgba(0,0,0,0.2)', borderRadius: '10px' }}>
                  <MathRenderer content={`$$${q.math_formula}$$`} />
                </div>
              )}

              {/* Visual Graph / Image Attachment */}
              {isImageVisible && q.image_url && (
                <div style={{ margin: '1rem 0', textAlign: 'center' }}>
                  <img
                    src={q.image_url}
                    alt={q.image_alt || q.question_title}
                    style={{
                      maxHeight: '260px',
                      maxWidth: '100%',
                      borderRadius: '12px',
                      border: '1px solid var(--border-card)',
                      background: '#0f172a',
                      padding: '0.75rem',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
                    }}
                  />
                </div>
              )}

              {/* Options */}
              {q.options && q.options.length > 0 && (
                <div className="options-grid">
                  {q.options.map((opt, idx) => {
                    const letter = String.fromCharCode(65 + idx);
                    const isSelected = userAnswers[q.id] === opt;
                    let optionClass = 'option-btn';

                    if (isSelected) optionClass += ' selected';
                    if (result) {
                      if (opt === result.correct_answer) optionClass += ' correct';
                      else if (isSelected && !result.is_correct) optionClass += ' incorrect';
                    }

                    return (
                      <button
                        key={idx}
                        className={optionClass}
                        onClick={() => handleSelectOption(q.id, opt)}
                      >
                        <span className="option-key">{letter}</span>
                        <span className="option-text">
                          <MathRenderer content={opt} inline />
                        </span>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center', marginTop: '1rem' }}>
                <button
                  className="btn-primary"
                  onClick={() => handleVerifyAnswer(q.id)}
                  disabled={!userAnswers[q.id]}
                >
                  Verify Answer
                </button>

                <button className="btn-secondary" onClick={() => toggleHint(q.id)}>
                  <Lightbulb size={16} /> {isHintVisible ? 'Hide Hint' : 'Show Hint'}
                </button>

                <button className="btn-secondary" onClick={() => toggleSteps(q.id)}>
                  {isStepsVisible ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  {isStepsVisible ? 'Hide Solution Steps' : 'Step-by-Step Derivation'}
                </button>

                {result && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontWeight: '700', color: result.is_correct ? 'var(--accent-green)' : 'var(--accent-rose)' }}>
                    {result.is_correct ? <CheckCircle2 size={20} /> : <XCircle size={20} />}
                    {result.is_correct ? 'Correct Answer!' : 'Incorrect. Check solution derivation below.'}
                  </div>
                )}
              </div>

              {/* Hint Box */}
              {isHintVisible && q.hint && (
                <div style={{ margin: '1rem 0 0', padding: '0.85rem 1rem', background: 'rgba(245, 158, 11, 0.1)', border: '1px solid rgba(245, 158, 11, 0.3)', borderRadius: '12px', color: 'var(--accent-amber)', fontSize: '0.9rem' }}>
                  <strong>Hint:</strong> <MathRenderer content={q.hint} inline />
                </div>
              )}

              {/* Derivation Steps Accordion */}
              {isStepsVisible && q.working_steps && q.working_steps.length > 0 && (
                <div className="derivation-panel">
                  <h4 className="derivation-title">Step-by-Step Mathematical Derivation</h4>
                  {q.working_steps.map((step, idx) => (
                    <div key={idx} className="step-item">
                      <MathRenderer content={step} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })
      )}

      {/* Bottom Pagination Controls */}
      {renderPagination('bottom')}
    </div>
  );
}
