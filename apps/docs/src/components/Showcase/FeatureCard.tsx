import { useState } from 'react';
import Link from '@docusaurus/Link';
import type { ShowcaseFeature } from '../../data/showcase/types';
import styles from './Showcase.module.css';

type Props = {
  feature: ShowcaseFeature;
};

export default function FeatureCard({ feature }: Props): React.ReactElement {
  const [imgError, setImgError] = useState(false);

  return (
    <div className={styles.featureCard}>
      {imgError ? (
        <div className={styles.featureCardImage} />
      ) : (
        <img
          src={feature.image}
          alt={feature.title}
          className={styles.featureCardImage}
          loading="lazy"
          onError={() => setImgError(true)}
        />
      )}
      <div className={styles.featureCardContent}>
        <div className={styles.featureCardTitleRow}>
          <h3 className={styles.featureCardTitle}>{feature.title}</h3>
          {feature.badge && (
            <span className={styles.badge}>{feature.badge}</span>
          )}
        </div>
        <p className={styles.featureCardDesc}>{feature.description}</p>
        <Link to={feature.docsUrl} className={styles.featureCardLink}>
          Learn more &rarr;
        </Link>
      </div>
    </div>
  );
}
