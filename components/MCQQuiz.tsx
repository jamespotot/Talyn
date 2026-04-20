import { useState, useMemo } from 'react';
import { MCQ } from '@/core/puroEngine';
import styles from './MCQQuiz.module.css';

interface MCQQuizProps {
  mcqs: MCQ[];
}

export default function MCQQuiz({ mcqs }: MCQQuizProps) {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [revealed, setRevealed] = useState(false);
  const [hintOpen, setHintOpen] = useState(false);

  if (mcqs.length === 0) return null;

  const mcq = mcqs[current];

  // Shuffle options once per question (not on every render)
  const options = useMemo(
    () => [mcq.correctAnswer, ...mcq.distractors].sort(() => Math.random() - 0.5),
    [current] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const checkAnswer = () => { if (selected) setRevealed(true); };

  const next = () => {
    setSelected(null);
    setRevealed(false);
    setHintOpen(false);
    setCurrent((current + 1) % mcqs.length);
  };

  const isCorrect = selected === mcq.correctAnswer;

  return (
    <div className={styles.container}>
      <h2>Multiple Choice</h2>
      <div className={styles.counter}>{current + 1} / {mcqs.length}</div>

      <div className={styles.card}>
        {/* METADATA — separate container, never inside question */}
        {/* topic is intentionally excluded: it equals the correct answer */}
        {mcq.metadata && (
          <div className={styles.metadata}>
            {mcq.metadata.difficulty && <span className={styles.difficulty}>{mcq.metadata.difficulty}</span>}
            {mcq.metadata.conceptType && <span className={styles.conceptType}>{mcq.metadata.conceptType}</span>}
            {mcq.metadata.domain && <span className={styles.domain}>{mcq.metadata.domain}</span>}
          </div>
        )}

        {/* PURE QUESTION — no metadata, no hints */}
        <p className={styles.question}>{mcq.question}</p>

        {/* HINT — UI-only side panel, never in question body */}
        {mcq.hint && !revealed && (
          <div className={styles.hintWrapper}>
            <button className={styles.hintToggle} onClick={() => setHintOpen(o => !o)}>
              {hintOpen ? 'Hide Hint' : 'Show Hint'}
            </button>
            {hintOpen && <p className={styles.hint}>{mcq.hint}</p>}
          </div>
        )}

        <div className={styles.options}>
          {options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => !revealed && setSelected(option)}
              className={[
                styles.option,
                selected === option ? styles.selected : '',
                revealed && option === mcq.correctAnswer ? styles.correct : '',
                revealed && selected === option && !isCorrect ? styles.incorrect : '',
              ].join(' ')}
              disabled={revealed}
            >
              <span className={styles.optionLabel}>{String.fromCharCode(65 + idx)}.</span>
              {option}
            </button>
          ))}
        </div>

        {!revealed ? (
          <button onClick={checkAnswer} className={styles.button} disabled={!selected}>
            Check Answer
          </button>
        ) : (
          <div className={styles.result}>
            <div className={isCorrect ? styles.correctText : styles.incorrectText}>
              {isCorrect ? '✓ Correct!' : `✗ Incorrect — Answer: ${mcq.correctAnswer}`}
            </div>

            {/* EXPLANATION — learning reinforcement layer, shown after answer */}
            {mcq.explanation && (
              <div className={styles.explanation}>
                {mcq.explanation.split('\n').map((line, i) => (
                  <p key={i} className={i === 0 ? styles.explanationCorrect : styles.explanationDistractor}>
                    {line}
                  </p>
                ))}
              </div>
            )}

            <button onClick={next} className={styles.button}>Next Question</button>
          </div>
        )}
      </div>
    </div>
  );
}
