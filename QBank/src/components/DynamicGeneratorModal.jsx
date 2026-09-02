import React, { useState } from 'react';
import MathRenderer from './MathRenderer';
import { Cpu, X, Sparkles, CheckCircle2 } from 'lucide-react';

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

export default function DynamicGeneratorModal({ topics, onClose, onGenerated }) {
  const [selectedTopicId, setSelectedTopicId] = useState(topics[0]?.id || 1);
  const [difficulty, setDifficulty] = useState(3);
  const [generating, setGenerating] = useState(false);
  const [result, setResult] = useState(null);

  const handleGenerate = async (e) => {
    e.preventDefault();
    setGenerating(true);
    setResult(null);

    try {
      const res = await fetch('/api/questions/generate-fallback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ topic_id: selectedTopicId, difficulty })
      });
      const data = await res.json();
      if (data.success) {
        setResult(data.question);
        if (onGenerated) onGenerated();
      }
    } catch (err) {
      console.error('Dynamic generation failed:', err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content animate-fade-in" style={{ maxWidth: '600px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.25rem', fontWeight: '800', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Cpu color="var(--accent-cyan)" size={24} /> Dynamic Algorithmic Math Generator
          </h3>
          <button className="btn-secondary" style={{ padding: '0.4rem' }} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
          On-demand algorithmic fallback engine generates parameterized math instances with dynamic numerical values, distracted choices, and step-by-step LaTeX solution derivations.
        </p>

        <form onSubmit={handleGenerate}>
          <div className="form-group">
            <label className="form-label">Target Topic</label>
            <select
              className="form-input"
              value={selectedTopicId}
              onChange={(e) => setSelectedTopicId(e.target.value)}
            >
              {topics.map(t => (
                <option key={t.id} value={t.id}>[Form {t.form_level}] {t.title}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">Difficulty Rating (1 = Basic, 5 = Advanced)</label>
            <input
              type="range"
              min="1"
              max="5"
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              style={{ width: '100%', accentColor: 'var(--accent-primary)', cursor: 'pointer' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <span>1 (Foundation)</span>
              <span style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>Level {difficulty}</span>
              <span>5 (Senior Secondary)</span>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
            <button type="submit" className="btn-primary" disabled={generating} id="generate-dynamic-submit">
              <Sparkles size={18} /> {generating ? 'Generating Instance...' : 'Generate New Dynamic Problem'}
            </button>
          </div>
        </form>

        {result && (
          <div style={{ marginTop: '1.5rem', padding: '1.25rem', borderRadius: '14px', background: 'rgba(6, 182, 212, 0.15)', border: '1px solid rgba(6, 182, 212, 0.3)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--accent-cyan)', fontWeight: 700, marginBottom: '0.5rem' }}>
              <CheckCircle2 size={18} /> Instance Generated & Inserted to Bank (#{result.id})
            </div>
            <h4 style={{ fontWeight: 700 }}>{getFormattedQuestionTitle(result.question_title, result.topic_id, result.id)}</h4>
            <p style={{ fontSize: '0.9rem', margin: '0.4rem 0' }}><MathRenderer content={result.question_text} /></p>
            {result.math_formula && <div style={{ margin: '0.4rem 0' }}><MathRenderer content={`$$${result.math_formula}$$`} /></div>}
          </div>
        )}
      </div>
    </div>
  );
}
