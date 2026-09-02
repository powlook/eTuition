import React, { useState, useEffect } from 'react';
import { BookOpen, Play, CheckCircle, Sparkles } from 'lucide-react';

const MATATAG_STRANDS = ['Measurement and Geometry', 'Number and Algebra', 'Data and Probability'];

// DepEd MATATAG Philippines Curriculum Strand Mapping by Form Level (1-12)
const STRAND_MAPPING_BY_FORM = {
  1: MATATAG_STRANDS,
  2: MATATAG_STRANDS,
  3: MATATAG_STRANDS,
  4: MATATAG_STRANDS,
  5: MATATAG_STRANDS,
  6: MATATAG_STRANDS,
  7: MATATAG_STRANDS,
  8: MATATAG_STRANDS,
  9: MATATAG_STRANDS,
  10: MATATAG_STRANDS,
  11: ['Patterns and Algebra', 'Statistics and Probability'],
  12: ['Patterns and Algebra', 'Statistics and Probability']
};

export default function CurriculumBrowser({
  user,
  currentFormLevel,
  setFormLevel,
  onSelectTopic
}) {
  const [topics, setTopics] = useState([]);
  const [selectedStrand, setSelectedStrand] = useState('All Strands');
  const [loading, setLoading] = useState(true);

  const isStudent = user && user.role === 'student';
  const studentRegisteredLevel = isStudent ? user.form_level : null;

  // Available strands for the current Form level
  const validStrandsForForm = STRAND_MAPPING_BY_FORM[currentFormLevel] || MATATAG_STRANDS;
  const availableStrandChips = ['All Strands', ...validStrandsForForm];

  // Reset selected strand if it's not valid for the newly selected Form level
  useEffect(() => {
    if (selectedStrand !== 'All Strands' && !validStrandsForForm.includes(selectedStrand)) {
      setSelectedStrand('All Strands');
    }
  }, [currentFormLevel]);

  useEffect(() => {
    const fetchTopics = async () => {
      setLoading(true);
      try {
        let url = `/api/curriculum?form_level=${currentFormLevel}`;
        if (selectedStrand !== 'All Strands') {
          url += `&strand=${encodeURIComponent(selectedStrand)}`;
        }
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setTopics(data);
        }
      } catch (err) {
        console.error('Failed to load curriculum topics:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTopics();
  }, [currentFormLevel, selectedStrand]);

  return (
    <div className="container" style={{ padding: '32px 24px' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '32px', marginBottom: '28px', background: 'linear-gradient(135deg, rgba(23,32,54,0.85) 0%, rgba(30,42,69,0.95) 100%)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <span className="brand-badge" style={{ marginBottom: '8px', display: 'inline-block' }}>
              Philippines DepEd Mathematics Curriculum Framework
            </span>
            <h1 style={{ fontSize: '2rem', marginTop: '4px' }}>
              Form {currentFormLevel} Mathematics Syllabus
            </h1>
            <p style={{ color: 'var(--text-secondary)', marginTop: '6px', maxWidth: '640px' }}>
              {isStudent
                ? `You are registered for Form ${studentRegisteredLevel}. Showing official syllabus topics for your registered grade level.`
                : `Official syllabus topics mapped strictly to Form ${currentFormLevel}. Only active strands covered in the DepEd curriculum for this level are displayed.`}
            </p>
          </div>

          <div style={{ background: isStudent ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)', padding: '16px 20px', borderRadius: 'var(--radius-md)', border: `1px solid ${isStudent ? 'var(--success-border)' : 'var(--border-highlight)'}` }}>
            <div style={{ fontSize: '0.8rem', color: isStudent ? 'var(--success-text)' : 'var(--accent-secondary)', fontWeight: '700', textTransform: 'uppercase' }}>
              {isStudent ? '🔒 Registered Level' : 'Grade Level Descriptor'}
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: '700', marginTop: '2px' }}>
              {currentFormLevel <= 6
                ? `Primary ${currentFormLevel} (Grade ${currentFormLevel})`
                : currentFormLevel <= 10
                ? `Secondary ${currentFormLevel - 6} (Grade ${currentFormLevel})`
                : `Senior Sec ${currentFormLevel - 10} (Grade ${currentFormLevel})`}
            </div>
          </div>
        </div>

        {/* Level Tabs (Form 1 to 12) */}
        <div className="level-tabs" style={{ marginTop: '24px', paddingBottom: '4px' }}>
          {Array.from({ length: 12 }, (_, i) => i + 1).map((lvl) => {
            const isLockedForStudent = isStudent && lvl !== studentRegisteredLevel;
            return (
              <button
                key={lvl}
                className={`level-tab ${currentFormLevel === lvl ? 'active' : ''}`}
                disabled={isLockedForStudent}
                style={{
                  opacity: isLockedForStudent ? 0.35 : 1,
                  cursor: isLockedForStudent ? 'not-allowed' : 'pointer'
                }}
                title={isLockedForStudent ? `Registered Access Constraint: You are registered for Form ${studentRegisteredLevel}` : `View Form ${lvl}`}
                onClick={() => {
                  if (!isLockedForStudent) {
                    setFormLevel(lvl);
                  }
                }}
              >
                Form {lvl} {isLockedForStudent && '🔒'}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dynamic Strand Filter Chips (Only shows strands relevant to the active Form level) */}
      <div style={{ marginBottom: '12px', fontSize: '0.88rem', color: 'var(--text-secondary)', fontWeight: '600' }}>
        Active Syllabus Strands for Form {currentFormLevel}:
      </div>
      <div className="strand-chips">
        {availableStrandChips.map((strand) => (
          <button
            key={strand}
            className={`chip ${selectedStrand === strand ? 'active' : ''}`}
            onClick={() => setSelectedStrand(strand)}
          >
            {strand}
          </button>
        ))}
      </div>

      {/* Topics Grid */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          Loading syllabus topics...
        </div>
      ) : topics.length === 0 ? (
        <div className="glass-panel" style={{ textAlign: 'center', padding: '60px', color: 'var(--text-secondary)' }}>
          No syllabus topics listed for Form {currentFormLevel} under "{selectedStrand}".
          {user && (
            <div style={{ marginTop: '16px' }}>
              <button
                className="btn btn-primary"
                onClick={() => onSelectTopic({ form_level: currentFormLevel, strand: validStrandsForForm[0], title: `Form ${currentFormLevel} General Practice` })}
              >
                <Sparkles size={16} /> Start Dynamic Practice Drills
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="topics-grid">
          {topics.map((topic) => (
            <div key={topic.id} className="glass-panel topic-card">
              <div>
                <div className="topic-strand-badge">{topic.strand}</div>
                <h3 style={{ fontSize: '1.2rem', marginBottom: '8px' }}>{topic.title}</h3>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '16px' }}>
                  {topic.description}
                </p>

                <div style={{ background: 'rgba(0,0,0,0.2)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid rgba(255,255,255,0.05)', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  <strong style={{ color: 'var(--text-secondary)' }}>DepEd Competency:</strong> {topic.competencies}
                </div>
              </div>

              {user && (
                <button
                  className="btn btn-primary"
                  style={{ width: '100%', justifyContent: 'center' }}
                  onClick={() => onSelectTopic(topic)}
                >
                  <Play size={16} /> Practice Exercises
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
