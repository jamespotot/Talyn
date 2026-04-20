import { useState } from 'react';
import { parseFile } from '@/parsers/fileParser';
import styles from './Upload.module.css';

interface UploadProps {
  onTextExtracted: (text: string) => void;
}

export default function Upload({ onTextExtracted }: UploadProps) {
  const [loading, setLoading] = useState(false);
  const [manualText, setManualText] = useState('');

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setLoading(true);
    try {
      const text = await parseFile(file);
      onTextExtracted(text);
    } catch (error) {
      alert('Error parsing file');
    } finally {
      setLoading(false);
    }
  };

  const handleManualSubmit = () => {
    if (manualText.trim()) {
      onTextExtracted(manualText);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h2>Upload Document</h2>
        <div className={styles.fileZone}>
          <input
            type="file"
            accept=".txt,.pdf,.docx"
            onChange={handleFileUpload}
            disabled={loading}
          />
          <span className={styles.fileZoneIcon}>📄</span>
          <span className={styles.fileZoneText}>
            {loading ? 'Processing...' : 'Click or drag a file here'}
          </span>
          <span className={styles.fileZoneHint}>PDF, DOCX, or TXT</span>
        </div>
      </div>

      <div className={styles.divider}>or</div>

      <div className={styles.card}>
        <h2>Paste Text</h2>
        <textarea
          value={manualText}
          onChange={(e) => setManualText(e.target.value)}
          placeholder="Paste your notes or document text here..."
          className={styles.textarea}
        />
        <button onClick={handleManualSubmit} className={styles.button} disabled={!manualText.trim()}>
          Generate Study Materials
        </button>
      </div>
    </div>
  );
}
