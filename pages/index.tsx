import { useState, useEffect } from 'react';
import Head from 'next/head';
import Image from 'next/image';
import Upload from '@/components/Upload';
import AnalysisReview from '@/components/AnalysisReview';
import ModeSelector from '@/components/ModeSelector';
import Flashcards from '@/components/Flashcards';
import FillInBlankQuiz from '@/components/FillInBlankQuiz';
import MCQQuiz from '@/components/MCQQuiz';
import { Flashcard, FillInBlank, MCQ } from '@/core/puroEngine';
import { AnalysisResult } from '@/pages/api/analyze';
import { QuizType, LearningMode } from '@/pages/api/generate';
import styles from '@/styles/Home.module.css';

type Step = 'upload' | 'analyzing' | 'review' | 'select' | 'generating' | 'quiz';
type QuizView = 'flashcards' | 'fillblank' | 'mcq';

export default function Home() {
  const [step, setStep] = useState<Step>('upload');
  const [error, setError] = useState('');
  const [transferring, setTransferring] = useState(false);
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('talyn-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('talyn-theme', next ? 'dark' : 'light');
  };

  // Pipeline state
  const [rawText, setRawText] = useState('');
  const [analysis, setAnalysis] = useState<AnalysisResult | null>(null);
  const [confirmedTopics, setConfirmedTopics] = useState<AnalysisResult['topics']>([]);
  const [activeMode, setActiveMode] = useState<LearningMode | null>(null);
  const [quizView, setQuizView] = useState<QuizView>('flashcards');

  // Quiz data
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [fillBlanks, setFillBlanks] = useState<FillInBlank[]>([]);
  const [mcqs, setMcqs] = useState<MCQ[]>([]);

  // ── Step 1 → 2: Text extracted, send to Gemini for analysis
  const handleTextExtracted = async (text: string) => {
    setRawText(text);
    setError('');
    setStep('analyzing');

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setAnalysis(data);
      setStep('review');
    } catch (e: any) {
      setError(e.message ?? 'Analysis failed');
      setStep('upload');
    }
  };

  // ── Step 3 → 4: User confirmed topics
  const handleTopicsConfirmed = (topics: AnalysisResult['topics']) => {
    setConfirmedTopics(topics);
    setStep('select');
  };

  // ── Step 5 → 6: Generate quiz
  const handleGenerate = async (quizType: QuizType, mode: LearningMode) => {
    setError('');
    setActiveMode(mode);
    setQuizView(quizType as QuizView);
    setStep('generating');

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText, topics: confirmedTopics, quizType, mode }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (quizType === 'flashcards') setFlashcards(data.data);
      if (quizType === 'fillblank')  setFillBlanks(data.data);
      if (quizType === 'mcq')        setMcqs(data.data);

      setStep('quiz');
    } catch (e: any) {
      setError(e.message ?? 'Generation failed');
      setStep('select');
    }
  };

  const reset = () => {
    setStep('upload');
    setRawText('');
    setAnalysis(null);
    setConfirmedTopics([]);
    setFlashcards([]);
    setFillBlanks([]);
    setMcqs([]);
    setError('');
    setTransferring(false);
  };

  // Transfer Processing: switch to a quiz type, generate on-demand if not yet loaded
  const handleTransfer = async (view: QuizView) => {
    setQuizView(view);
    setError('');

    const alreadyLoaded =
      (view === 'flashcards' && flashcards.length > 0) ||
      (view === 'fillblank'  && fillBlanks.length > 0) ||
      (view === 'mcq'        && mcqs.length > 0);

    if (alreadyLoaded) return;

    setTransferring(true);
    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: rawText, topics: confirmedTopics, quizType: view, mode: activeMode ?? 'puro' }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      if (view === 'flashcards') setFlashcards(data.data);
      if (view === 'fillblank')  setFillBlanks(data.data);
      if (view === 'mcq')        setMcqs(data.data);
    } catch (e: any) {
      setError(e.message ?? 'Transfer failed. Please try again.');
    } finally {
      setTransferring(false);
    }
  };

  const isQuiz = step === 'quiz';

  return (
    <>
      <Head>
        <title>Talyn — Document Reviewer</title>
        <meta name="description" content="Convert documents into study materials" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <main className={styles.main}>
        {/* ── Header ── */}
        <header className={styles.header}>
          <div className={styles.logoContainer}>
            <Image
              src="/talyn-logo-final.png"
              alt="Talyn Logo"
              width={38}
              height={38}
              className={styles.logo}
              priority
            />
            <h1 className={styles.title}>Talyn<span className={styles.titleAccent}>.</span></h1>
          </div>
          <div className={styles.headerRight}>
            <button className={styles.themeToggle} onClick={toggleTheme} aria-label="Toggle theme">
              <span className={styles.themeToggleIcon}>
                {dark ? (
                  // Sun icon
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="3" stroke="currentColor" strokeWidth="1.5"/>
                    <line x1="8" y1="1" x2="8" y2="3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="8" y1="13" x2="8" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="1" y1="8" x2="3" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="13" y1="8" x2="15" y2="8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="2.93" y1="2.93" x2="4.34" y2="4.34" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="11.66" y1="11.66" x2="13.07" y2="13.07" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="2.93" y1="13.07" x2="4.34" y2="11.66" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    <line x1="11.66" y1="4.34" x2="13.07" y2="2.93" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                ) : (
                  // Moon icon
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M13.5 9.5A6 6 0 0 1 6.5 2.5a6 6 0 1 0 7 7z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </span>
              {dark ? 'Light' : 'Dark'}
            </button>
            {activeMode && step === 'quiz' && (
              <div className={styles.modeIndicator}>
                <span className={styles.modeLabel}>Mode</span>
                <span className={`${styles.modeBadge} ${activeMode === 'talyno' ? styles.modeBadgeTalyno : ''}`}>
                  {activeMode === 'puro' ? 'Puro' : 'Talyno'}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* ── Quiz nav ── */}
        {isQuiz && (
          <nav className={styles.nav}>
            {(['flashcards', 'fillblank', 'mcq'] as QuizView[]).map((view) => {
              const labels: Record<QuizView, string> = { flashcards: 'Flashcards', fillblank: 'Fill in Blank', mcq: 'Multiple Choice' };
              const isActive = quizView === view;
              const isLoading = isActive && transferring;
              return (
                <button
                  key={view}
                  onClick={() => handleTransfer(view)}
                  className={isActive ? styles.navActive : styles.navButton}
                  disabled={transferring}
                >
                  {isLoading ? 'Loading…' : labels[view]}
                </button>
              );
            })}
            <button onClick={reset} className={styles.navButton} disabled={transferring}>
              New Document
            </button>
          </nav>
        )}

        {/* ── Error banner ── */}
        {error && (
          <div className={styles.errorBanner}>
            {error}
            <button onClick={() => setError('')} className={styles.errorClose}>×</button>
          </div>
        )}

        {/* ── Pipeline steps ── */}
        {step === 'upload'     && <Upload onTextExtracted={handleTextExtracted} />}
        {step === 'analyzing'  && <StatusScreen message="Analyzing your document…" sub="Talyn is extracting topics and keywords" />}
        {step === 'review'     && analysis && (
          <AnalysisReview analysis={analysis} onConfirm={handleTopicsConfirmed} />
        )}
        {step === 'select'     && <ModeSelector onSelect={handleGenerate} loading={false} />}
        {step === 'generating' && <StatusScreen message="Generating study materials…" sub="Building your personalized reviewer" />}

        {isQuiz && quizView === 'flashcards' && (
          flashcards.length > 0
            ? <Flashcards cards={flashcards} />
            : transferring ? <StatusScreen message="Loading Flashcards…" sub="Generating from your document" /> : null
        )}
        {isQuiz && quizView === 'fillblank' && (
          fillBlanks.length > 0
            ? <FillInBlankQuiz blanks={fillBlanks} />
            : transferring ? <StatusScreen message="Loading Fill in the Blank…" sub="Generating from your document" /> : null
        )}
        {isQuiz && quizView === 'mcq' && (
          mcqs.length > 0
            ? <MCQQuiz mcqs={mcqs} />
            : transferring ? <StatusScreen message="Loading Multiple Choice…" sub="Generating from your document" /> : null
        )}
      </main>
    </>
  );
}

function StatusScreen({ message, sub }: { message: string; sub: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      justifyContent: 'center', minHeight: '40vh', gap: '10px',
      padding: '48px 24px', textAlign: 'center',
    }}>
      <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--navy)', letterSpacing: '0.2px' }}>{message}</div>
      <div style={{ fontSize: '13px', color: 'var(--text-muted)' }}>{sub}</div>
      <div style={{
        marginTop: '16px', width: '40px', height: '3px', borderRadius: '2px',
        background: 'var(--sky)', animation: 'pulse 1.4s ease-in-out infinite',
      }} />
      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }`}</style>
    </div>
  );
}
