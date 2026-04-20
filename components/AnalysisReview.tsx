import { useState } from 'react';
import { AnalysisResult } from '@/pages/api/analyze';
import styles from './AnalysisReview.module.css';

interface Props {
  analysis: AnalysisResult;
  onConfirm: (topics: AnalysisResult['topics']) => void;
}

export default function AnalysisReview({ analysis, onConfirm }: Props) {
  const [topics, setTopics] = useState(analysis.topics);

  const removeKeyword = (topicIdx: number, kwIdx: number) => {
    setTopics(prev =>
      prev.map((t, i) =>
        i === topicIdx ? { ...t, keywords: t.keywords.filter((_, j) => j !== kwIdx) } : t
      )
    );
  };

  const removeTopic = (topicIdx: number) => {
    setTopics(prev => prev.filter((_, i) => i !== topicIdx));
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>Document Analysis</h2>
        <p className={styles.subtitle}>Review the extracted topics and keywords before generating your study materials.</p>
      </div>

      <div className={styles.summary}>
        <span className={styles.summaryLabel}>Summary</span>
        <p className={styles.summaryText}>{analysis.summary}</p>
      </div>

      <div className={styles.topicsGrid}>
        {topics.map((topic, ti) => (
          <div key={ti} className={styles.topicCard}>
            <div className={styles.topicHeader}>
              <span className={styles.topicTitle}>{topic.title}</span>
              <button className={styles.removeBtn} onClick={() => removeTopic(ti)} title="Remove topic">×</button>
            </div>
            <div className={styles.keywords}>
              {topic.keywords.map((kw, ki) => (
                <span key={ki} className={styles.keyword}>
                  {kw}
                  <button className={styles.kwRemove} onClick={() => removeKeyword(ti, ki)}>×</button>
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.actions}>
        <p className={styles.hint}>{topics.length} topic{topics.length !== 1 ? 's' : ''} · Remove any you don't need</p>
        <button
          className={styles.confirmBtn}
          onClick={() => onConfirm(topics)}
          disabled={topics.length === 0}
        >
          Confirm & Continue
        </button>
      </div>
    </div>
  );
}
