import { useState } from 'react';
import { FillInBlank } from '@/core/puroEngine';
import styles from './FillInBlankQuiz.module.css';

interface FillInBlankQuizProps {
  blanks: FillInBlank[];
}

export default function FillInBlankQuiz({ blanks }: FillInBlankQuizProps) {
  const [current, setCurrent] = useState(0);
  const [answer, setAnswer] = useState('');
  const [revealed, setRevealed] = useState(false);

  if (blanks.length === 0) return null;

  const blank = blanks[current];

  const checkAnswer = () => {
    setRevealed(true);
  };

  const next = () => {
    setAnswer('');
    setRevealed(false);
    setCurrent((current + 1) % blanks.length);
  };

  const isCorrect = answer.trim().toLowerCase() === blank.answer.toLowerCase();

  return (
    <div className={styles.container}>
      <h2>Fill in the Blank</h2>
      <div className={styles.counter}>
        {current + 1} / {blanks.length}
      </div>

      <div className={styles.card}>
        {blank.metadata && (
          <div className={styles.metadata}>
            {/* topic excluded: equals the correct answer */}
            {blank.metadata.difficulty && <span className={styles.difficulty}>{blank.metadata.difficulty}</span>}
          </div>
        )}
        
        <p className={styles.sentence}>{blank.sentence}</p>
        
        <input
          type="text"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Your answer..."
          className={styles.input}
          disabled={revealed}
        />

        {!revealed ? (
          <button onClick={checkAnswer} className={styles.button}>
            Check Answer
          </button>
        ) : (
          <div className={styles.result}>
            <div className={isCorrect ? styles.correct : styles.incorrect}>
              {isCorrect ? '✓ Correct!' : `✗ Incorrect. Answer: ${blank.answer}`}
            </div>
            <button onClick={next} className={styles.button}>
              Next Question
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
