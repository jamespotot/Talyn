import styles from './ModeSelector.module.css';
import { QuizType, LearningMode } from '@/pages/api/generate';

interface Props {
  onSelect: (quizType: QuizType, mode: LearningMode) => void;
  loading: boolean;
}

const QUIZ_TYPES: { value: QuizType; label: string; desc: string }[] = [
  { value: 'flashcards', label: 'Flashcards', desc: 'Term on front, definition on back' },
  { value: 'fillblank',  label: 'Fill in the Blank', desc: 'Complete the missing word' },
  { value: 'mcq',        label: 'Multiple Choice', desc: '4 options, one correct answer' },
];

const MODES: { value: LearningMode; label: string; desc: string; badge: string }[] = [
  {
    value: 'puro',
    label: 'Puro Mode',
    desc: 'Exact extraction — no modification. Every answer is lifted directly from your document.',
    badge: 'Strict',
  },
  {
    value: 'talyno',
    label: 'Talyno Mode',
    desc: 'Light AI enhancement — concepts preserved but lightly rephrased for better clarity.',
    badge: 'Enhanced',
  },
];

import { useState } from 'react';

export default function ModeSelector({ onSelect, loading }: Props) {
  const [quizType, setQuizType] = useState<QuizType>('flashcards');
  const [mode, setMode] = useState<LearningMode>('puro');

  return (
    <div className={styles.container}>
      <div className={styles.section}>
        <h3 className={styles.sectionLabel}>Quiz Format</h3>
        <div className={styles.optionRow}>
          {QUIZ_TYPES.map(q => (
            <button
              key={q.value}
              className={`${styles.optionCard} ${quizType === q.value ? styles.optionActive : ''}`}
              onClick={() => setQuizType(q.value)}
            >
              <span className={styles.optionTitle}>{q.label}</span>
              <span className={styles.optionDesc}>{q.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <div className={styles.section}>
        <h3 className={styles.sectionLabel}>Learning Mode</h3>
        <div className={styles.modeRow}>
          {MODES.map(m => (
            <button
              key={m.value}
              className={`${styles.modeCard} ${mode === m.value ? styles.modeActive : ''}`}
              onClick={() => setMode(m.value)}
            >
              <div className={styles.modeTop}>
                <span className={styles.modeTitle}>{m.label}</span>
                <span className={`${styles.modeBadge} ${m.value === 'puro' ? styles.badgePuro : styles.badgeTalyno}`}>
                  {m.badge}
                </span>
              </div>
              <span className={styles.modeDesc}>{m.desc}</span>
            </button>
          ))}
        </div>
      </div>

      <button
        className={styles.generateBtn}
        onClick={() => onSelect(quizType, mode)}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Generate Study Materials'}
      </button>
    </div>
  );
}
