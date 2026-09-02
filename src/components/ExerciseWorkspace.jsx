import React, { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, HelpCircle, ChevronDown, ChevronUp, RefreshCw, Sparkles, Award } from 'lucide-react';
import MathRenderer from './MathRenderer.jsx';

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

export default function ExerciseWorkspace({
  topic,
  user,
  token,
  onBackToCurriculum
}) {
  const [exerciseData, setExerciseData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [showWorkings, setShowWorkings] = useState(false);
  const [startTime, setStartTime] = useState(Date.now());

  const fetchNewQuestion = async () => {
    setLoading(true);
    setSelectedOption(null);
    setSubmitted(false);
    setIsCorrect(false);
    setShowHint(false);
    setShowWorkings(false);
    setStartTime(Date.now());

    const headers = { 'Content-Type': 'application/json' };
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const res = await fetch('/api/exercises/generate', {
        method: 'POST',
        headers,
        body: JSON.stringify({
          form_level: topic.form_level,
          strand: topic.strand,
          topic_id: topic.id
        })
      });

      if (res.ok) {
        const data = await res.json();
        setExerciseData(data);
      } else {
        setExerciseData(null);
      }
    } catch (err) {
      console.error('Failed to generate exercise:', err);
      setExerciseData(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNewQuestion();
  }, [topic, token]);

  const handleSelectOption = (opt) => {
    if (submitted) return;
    setSelectedOption(opt);
  };

  const handleSubmitAnswer = async () => {
    if (!selectedOption || submitted || !exerciseData) return;

    const { exercise } = exerciseData;
    const correct = selectedOption === exercise.correctAnswer;
    setIsCorrect(correct);
    setSubmitted(true);
    setShowWorkings(true); // Automatically expand step-by-step workings upon submit

    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    const displayTitle = getFormattedQuestionTitle(exercise.title, topic?.id || exercise.topicId, exercise.id);

    if (token) {
      try {
        await fetch('/api/exercises/submit', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            topic_id: topic.id,
            question_title: displayTitle,
            is_correct: correct,
            time_taken_sec: timeTaken
          })
        });
      } catch (err) {
        console.error('Failed to record attempt:', err);
      }
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div style={{ color: 'var(--accent-secondary)', fontSize: '1.2rem', fontWeight: '600' }}>
          Loading topic practice exercise & step-by-step workings...
        </div>
      </div>
    );
  }

  if (!exerciseData || !exerciseData.exercise) {
    return (
      <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>
        <div className="glass-panel" style={{ padding: '40px', maxWidth: '540px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '1.4rem', marginBottom: '12px' }}>Exercise Workspace Ready</h2>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '24px' }}>
            Click below to load a practice exercise for {topic ? topic.title : 'this topic'}.
          </p>
          <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
            <button className="btn btn-secondary" onClick={onBackToCurriculum}>
              <ArrowLeft size={16} /> Back to Curriculum
            </button>
            <button className="btn btn-primary" onClick={fetchNewQuestion}>
              <RefreshCw size={16} /> Load Exercise
            </button>
          </div>
        </div>
      </div>
    );
  }

  const { exercise, strand, formLevel } = exerciseData;
  const formattedTitle = getFormattedQuestionTitle(exercise.title, topic?.id || exercise.topicId, exercise.id);

  return (
    <div className="container exercise-container">
      {/* Navigation Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <button className="btn btn-secondary" onClick={onBackToCurriculum}>
          <ArrowLeft size={16} /> Back to Curriculum
        </button>

        <div style={{ display: 'flex', gap: '8px' }}>
          <span className="brand-badge" style={{ background: 'rgba(99, 102, 241, 0.2)', color: 'var(--accent-secondary)' }}>
            Form {formLevel}
          </span>
          <span className="brand-badge" style={{ background: 'rgba(168, 85, 247, 0.2)', color: '#c084fc' }}>
            {strand}
          </span>
        </div>
      </div>

      {/* Main Problem Card */}
      <div className="glass-panel problem-box">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--text-primary)' }}>{formattedTitle}</h2>
        </div>

        <div style={{ fontSize: '1.1rem', marginBottom: '12px' }}>
          <MathRenderer text={exercise.questionText} />
        </div>

        {/* Display LaTeX Formula Box */}
        {Boolean(exercise.mathFormula) && (exercise.showFormula !== false && exercise.show_formula !== 0 && exercise.show_formula !== '0') && (
          <div className="math-formula-display">
            <MathRenderer text={`$$${exercise.mathFormula}$$`} />
          </div>
        )}

        {/* Display Figure / Diagram Image if present */}
        {Boolean(exercise.imageUrl) && (exercise.showImage !== false && exercise.show_image !== 0 && exercise.show_image !== '0') && (
          <div style={{ textAlign: 'center', margin: '16px 0', background: 'rgba(0,0,0,0.2)', padding: '12px', borderRadius: 'var(--radius-md)', border: '1px solid rgba(255,255,255,0.05)' }}>
            <img src={exercise.imageUrl} alt={exercise.imageAlt || 'Exercise Figure Diagram'} style={{ maxWidth: '100%', maxHeight: '220px', borderRadius: 'var(--radius-sm)' }} />
          </div>
        )}

        {/* Multiple Choice Options */}
        <div className="options-grid">
          {exercise.options.map((opt, idx) => {
            const isSelected = selectedOption === opt;
            const isCorrectOption = opt === exercise.correctAnswer;
            let btnClass = 'option-btn';

            if (submitted) {
              if (isCorrectOption) btnClass += ' selected' ; // green / selected
              else if (isSelected && !isCorrect) btnClass += ' btn-danger';
            } else if (isSelected) {
              btnClass += ' selected';
            }

            return (
              <button
                key={idx}
                className={btnClass}
                disabled={submitted}
                onClick={() => setSelectedOption(opt)}
                style={{
                  background: submitted && isCorrectOption ? 'var(--success-bg)' : undefined,
                  borderColor: submitted && isCorrectOption ? 'var(--success-border)' : undefined,
                  color: submitted && isCorrectOption ? 'var(--success-text)' : undefined
                }}
              >
                <MathRenderer text={opt} />
              </button>
            );
          })}
        </div>

        {/* Hint Box */}
        {showHint && exercise.hint && (
          <div style={{ background: 'var(--warning-bg)', border: '1px solid var(--warning-border)', color: 'var(--warning-text)', padding: '14px 18px', borderRadius: 'var(--radius-sm)', marginBottom: '20px', fontSize: '0.9rem' }}>
            <HelpCircle size={18} style={{ display: 'inline', marginRight: '6px', verticalAlign: 'middle' }} />
            <strong>Hint:</strong> <MathRenderer text={exercise.hint} />
          </div>
        )}

        {/* Feedback Alert after submission */}
        {submitted && (
          <div
            style={{
              background: isCorrect ? 'var(--success-bg)' : 'var(--danger-bg)',
              border: `1px solid ${isCorrect ? 'var(--success-border)' : 'var(--danger-border)'}`,
              color: isCorrect ? 'var(--success-text)' : 'var(--danger-text)',
              padding: '16px 20px',
              borderRadius: 'var(--radius-sm)',
              marginBottom: '20px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              {isCorrect ? <CheckCircle2 size={24} /> : <XCircle size={24} />}
              <div>
                <strong style={{ fontSize: '1.05rem' }}>{isCorrect ? 'Excellent! Correct Answer' : 'Not quite right!'}</strong>
                <div style={{ fontSize: '0.88rem', marginTop: '2px', opacity: 0.9 }}>
                  {isCorrect ? 'Great job! See the step-by-step working below.' : `The correct answer is: `}
                  {!isCorrect && <MathRenderer text={exercise.correctAnswer} />}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Actions Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          <div style={{ display: 'flex', gap: '10px' }}>
            {!submitted && (
              <button className="btn btn-secondary" onClick={() => setShowHint(!showHint)}>
                <HelpCircle size={16} /> {showHint ? 'Hide Hint' : 'Show Hint'}
              </button>
            )}

            <button className="btn btn-secondary" onClick={() => setShowWorkings(!showWorkings)}>
              {showWorkings ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              {showWorkings ? 'Hide Step-by-Step Workings' : 'View Step-by-Step Workings'}
            </button>
          </div>

          {!submitted ? (
            <button className="btn btn-primary" disabled={!selectedOption} onClick={handleSubmitAnswer}>
              Submit Answer
            </button>
          ) : (
            <button className="btn btn-primary" onClick={fetchNewQuestion}>
              <RefreshCw size={16} /> Try Next Problem
            </button>
          )}
        </div>
      </div>

      {/* Step-by-Step Workings Drawer */}
      {showWorkings && exercise.workingSteps && (
        <div className="workings-drawer">
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '18px', borderBottom: '1px solid var(--border-color)', paddingBottom: '12px' }}>
            <Sparkles className="text-purple-400" size={20} />
            <h3 style={{ fontSize: '1.2rem', color: 'var(--text-primary)' }}>
              Step-by-Step Solution & Working Derivation
            </h3>
          </div>

          <div>
            {exercise.workingSteps.map((step, idx) => (
              <div key={idx} className="working-step-item">
                <MathRenderer text={step} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
