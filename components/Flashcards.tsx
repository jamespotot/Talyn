import { useState } from 'react';
import { Flashcard } from '@/core/puroEngine';
import styles from './Flashcards.module.css';

interface FlashcardsProps {
  cards: Flashcard[];
}

export default function Flashcards({ cards }: FlashcardsProps) {
  const [current, setCurrent] = useState(0);
  const [flipped, setFlipped] = useState(false);

  if (cards.length === 0) return null;

  const card = cards[current];

  const next = () => {
    setFlipped(false);
    setCurrent((current + 1) % cards.length);
  };

  const prev = () => {
    setFlipped(false);
    setCurrent((current - 1 + cards.length) % cards.length);
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Flashcards</h2>
        <div className={styles.counter}>{current + 1} / {cards.length}</div>
      </div>

      <div className={styles.progressBar}>
        <div className={styles.progressFill} style={{ width: `${((current + 1) / cards.length) * 100}%` }} />
      </div>

      <div className={`${styles.card} ${flipped ? styles.flipped : ''}`} onClick={() => setFlipped(!flipped)}>
        {!flipped ? (
          <div className={styles.front}>
            <div className={styles.label}>Term</div>
            <div className={styles.content}>{card.term}</div>
          </div>
        ) : (
          <div className={styles.back}>
            <div className={styles.label}>Definition</div>
            <div className={styles.content}>{card.definition}</div>
          </div>
        )}
        <span className={styles.flipHint}>click to flip</span>
      </div>

      <div className={styles.controls}>
        <button onClick={prev} className={styles.button}>← Previous</button>
        <button onClick={next} className={styles.button}>Next →</button>
      </div>
    </div>
  );
}
