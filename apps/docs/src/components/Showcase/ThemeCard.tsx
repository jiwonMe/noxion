import { useState, useCallback } from 'react';
import type { ShowcaseTheme } from '../../data/showcase/types';
import styles from './Showcase.module.css';

type Props = {
  theme: ShowcaseTheme;
};

export default function ThemeCard({ theme }: Props): React.ReactElement {
  const [showDark, setShowDark] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [copied, setCopied] = useState(false);

  const previewSrc = showDark && theme.previewDark ? theme.previewDark : theme.preview;

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(theme.command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      void 0;
    }
  }, [theme.command]);

  return (
    <div className={styles.themeCard}>
      <div className={styles.themeCardPreviewWrap}>
        {imgError ? (
          <div className={styles.themeCardPreview} />
        ) : (
          <img
            src={previewSrc}
            alt={`${theme.title} theme preview`}
            className={styles.themeCardPreview}
            loading="lazy"
            onError={() => setImgError(true)}
          />
        )}
        {theme.previewDark && (
          <button
            type="button"
            className={styles.themeCardModeToggle}
            onClick={() => setShowDark((v) => !v)}
          >
            {showDark ? 'Light' : 'Dark'}
          </button>
        )}
      </div>
      <div className={styles.themeCardBody}>
        <div className={styles.themeCardHeader}>
          <h3 className={styles.themeCardTitle}>{theme.title}</h3>
          <span className={styles.themeCardAuthor}>by {theme.author}</span>
        </div>
        <p className={styles.themeCardDesc}>{theme.description}</p>
        <button
          type="button"
          className={styles.themeCardCommand}
          onClick={handleCopy}
          title="Copy to clipboard"
        >
          <span className={styles.themeCardCommandText}>{theme.command}</span>
          <span className={styles.themeCardCommandCopy}>
            {copied ? 'Copied!' : 'Copy'}
          </span>
        </button>
        <div className={styles.themeCardFooter}>
          <div className={styles.themeCardTags}>
            {theme.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
          <div className={styles.themeCardLinks}>
            {theme.repoUrl && (
              <a href={theme.repoUrl} target="_blank" rel="noopener noreferrer" className={styles.themeCardLink}>
                GitHub
              </a>
            )}
            {theme.npmUrl && (
              <a href={theme.npmUrl} target="_blank" rel="noopener noreferrer" className={styles.themeCardLink}>
                npm
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
