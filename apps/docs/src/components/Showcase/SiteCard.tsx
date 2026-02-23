import { useState } from 'react';
import type { ShowcaseSite } from '../../data/showcase/types';
import styles from './Showcase.module.css';

type Props = {
  site: ShowcaseSite;
};

export default function SiteCard({ site }: Props): React.ReactElement {
  const [imgError, setImgError] = useState(false);

  return (
    <a
      href={site.url}
      target="_blank"
      rel="noopener noreferrer"
      className={styles.siteCard}
    >
      {imgError ? (
        <div className={styles.siteCardThumbnail} />
      ) : (
        <img
          src={site.thumbnail}
          alt={site.title}
          className={styles.siteCardThumbnail}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      )}
      <div className={styles.siteCardBody}>
        <h3 className={styles.siteCardTitle}>{site.title}</h3>
        <p className={styles.siteCardDesc}>{site.description}</p>
        <div className={styles.siteCardMeta}>
          <div className={styles.siteCardTags}>
            {site.tags.map((tag) => (
              <span key={tag} className={styles.tag}>{tag}</span>
            ))}
          </div>
          {site.author && (
            <span className={styles.siteCardAuthor}>{site.author}</span>
          )}
        </div>
      </div>
    </a>
  );
}
