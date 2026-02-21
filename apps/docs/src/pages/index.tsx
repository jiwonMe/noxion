import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import styles from './index.module.css';

const features = [
  {
    title: 'Write in Notion',
    description: 'Use Notion as your CMS. Your database becomes your blog — no migration, no friction.',
  },
  {
    title: 'Instant deploy',
    description: 'One command to scaffold. ISR keeps content fresh. On-demand revalidation for instant updates.',
  },
  {
    title: 'SEO out of the box',
    description: 'Open Graph, JSON-LD, RSS, sitemap, robots.txt — all generated automatically from your Notion data.',
  },
  {
    title: 'Image optimization',
    description: 'AVIF/WebP via Next.js Image. Optional build-time download for full URL independence.',
  },
  {
    title: 'Plugin system',
    description: 'Analytics, comments, RSS — add with a single line. Build your own with the plugin API.',
  },
  {
    title: 'Own your stack',
    description: 'Open-source, self-hosted. Deploy to Vercel, Docker, or static export. No vendor lock-in.',
  },
];

function Hero(): React.ReactElement {
  const { colorMode } = useColorMode();
  const heroSrc = useBaseUrl(colorMode === 'dark' ? '/img/hero-dark.png' : '/img/hero.png');

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <h1 className={styles.heroTitle}>
          Your Notion database,<br />
          your blog.
        </h1>
        <p className={styles.heroSubtitle}>
          Noxion turns a Notion database into a fast, SEO-optimized blog you fully own.
          Open-source. Self-hosted. Zero lock-in.
        </p>
        <div className={styles.heroActions}>
          <Link className={styles.primaryBtn} to="/docs/learn/quick-start">
            Get started
          </Link>
          <Link className={styles.secondaryBtn} href="https://github.com/jiwonme/noxion">
            GitHub
          </Link>
        </div>
      </div>
      <div className={styles.heroIllust}>
        <img
          src={heroSrc}
          alt="Noxion — Notion to blog"
          className={styles.heroImage}
        />
      </div>
    </section>
  );
}

function Features(): React.ReactElement {
  return (
    <section className={styles.features}>
      <div className={styles.featuresGrid}>
        {features.map((f) => (
          <div key={f.title} className={styles.featureCard}>
            <h3 className={styles.featureTitle}>{f.title}</h3>
            <p className={styles.featureDesc}>{f.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

function Config(): React.ReactElement {
  return (
    <section className={styles.configSection}>
      <h2 className={styles.sectionTitle}>One config file. That's it.</h2>
      <p className={styles.sectionSubtitle}>
        Point Noxion at your Notion page, add plugins, deploy.
      </p>
      <div className={styles.configCode}>
        <CodeBlock language="ts" title="noxion.config.ts">
{`import { defineConfig, createRSSPlugin } from "@noxion/core";

export default defineConfig({
  rootNotionPageId: process.env.NOTION_PAGE_ID!,
  name: "My Blog",
  domain: "myblog.com",
  author: "Your Name",
  description: "A blog about things I find interesting",
  language: "en",
  plugins: [
    createRSSPlugin({ feedPath: "/feed.xml" }),
  ],
});`}
        </CodeBlock>
      </div>
    </section>
  );
}

function CTA(): React.ReactElement {
  return (
    <section className={styles.cta}>
      <h2 className={styles.ctaTitle}>Ready to ship?</h2>
      <p className={styles.ctaSubtitle}>
        Set up your blog in under 5 minutes.
      </p>
      <div className={styles.heroActions}>
        <Link className={styles.primaryBtn} to="/docs/learn/quick-start">
          Read the docs
        </Link>
        <Link className={styles.secondaryBtn} to="/docs/reference/overview">
          API Reference
        </Link>
      </div>
    </section>
  );
}

export default function Home(): React.ReactElement {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={siteConfig.title} description={siteConfig.tagline}>
      <main>
        <Hero />
        <Features />
        <Config />
        <CTA />
      </main>
    </Layout>
  );
}
