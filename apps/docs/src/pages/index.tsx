import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import Translate from '@docusaurus/Translate';
import styles from './index.module.css';

const features = [
  {
    icon: '📝',
    titleKey: 'homepage.feature.notion.title',
    title: 'Notion as CMS',
    descriptionKey: 'homepage.feature.notion.description',
    description: 'Write in Notion, publish to the web. Your database schema becomes your blog — no migration needed.',
  },
  {
    icon: '🚀',
    titleKey: 'homepage.feature.seo.title',
    title: 'Extreme SEO',
    descriptionKey: 'homepage.feature.seo.description',
    description: 'Open Graph, JSON-LD (BlogPosting, BreadcrumbList, SearchAction), RSS, sitemap — all generated automatically.',
  },
  {
    icon: '🖼️',
    titleKey: 'homepage.feature.images.title',
    title: 'Image Optimization',
    descriptionKey: 'homepage.feature.images.description',
    description: 'Next.js Image with AVIF/WebP auto-conversion. Or opt-in build-time download for full URL independence.',
  },
  {
    icon: '🔌',
    titleKey: 'homepage.feature.plugins.title',
    title: 'Plugin System',
    descriptionKey: 'homepage.feature.plugins.description',
    description: 'Analytics (Google, Plausible, Umami), RSS, Comments (Giscus, Utterances, Disqus) — plug and play.',
  },
  {
    icon: '🎨',
    titleKey: 'homepage.feature.themes.title',
    title: 'Theme System',
    descriptionKey: 'homepage.feature.themes.description',
    description: 'CSS variable-based colors and fonts. Dark / light / system mode. Full component override support.',
  },
  {
    icon: '⚡',
    titleKey: 'homepage.feature.isr.title',
    title: 'ISR + On-demand',
    descriptionKey: 'homepage.feature.isr.description',
    description: 'Incremental Static Regeneration every hour. On-demand revalidation API for instant refreshes.',
  },
];

export default function Home() {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout
      title={siteConfig.title}
      description={siteConfig.tagline}
    >
      <main>
        <section className="hero-section">
          <h1 className="hero-title">Noxion</h1>
          <p className="hero-tagline">
            <Translate id="homepage.tagline">
              Notion-powered blog builder for developers.
              Point it at a Notion database and get a fully-rendered, SEO-optimized blog website.
            </Translate>
          </p>
          <div className="hero-actions">
            <Link className="button button--primary button--lg" to="/docs/learn/quick-start">
              <Translate id="homepage.getStarted">Get Started</Translate> →
            </Link>
            <Link className="button button--secondary button--lg" to="/docs/reference/overview">
              <Translate id="homepage.apiRef">API Reference</Translate>
            </Link>
            <Link
              className="button button--secondary button--lg"
              href="https://github.com/jiwonme/noxion"
            >
              GitHub
            </Link>
          </div>

          <div style={{ marginTop: '2.5rem', maxWidth: '600px', marginLeft: 'auto', marginRight: 'auto' }}>
            <CodeBlock language="bash">
              {`bun create noxion my-blog\ncd my-blog && bun run dev`}
            </CodeBlock>
          </div>
        </section>

        <section className="feature-grid">
          {features.map((f) => (
            <div key={f.icon} className="feature-card">
              <div className="feature-icon">{f.icon}</div>
              <div className="feature-title">{f.title}</div>
              <div className="feature-description">{f.description}</div>
            </div>
          ))}
        </section>

        <section style={{ padding: '3rem 2rem', maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '2rem' }}>
            <Translate id="homepage.howItWorks">How it works</Translate>
          </h2>
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
        </section>
      </main>
    </Layout>
  );
}
