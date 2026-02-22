import Link from '@docusaurus/Link';
import useBaseUrl from '@docusaurus/useBaseUrl';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import { useColorMode } from '@docusaurus/theme-common';
import Layout from '@theme/Layout';
import CodeBlock from '@theme/CodeBlock';
import styles from '@site/src/pages/index.module.css';

const features = [
  {
    title: 'Notion으로 글쓰기',
    description: 'Notion을 CMS로 사용하세요. 데이터베이스가 곧 블로그가 됩니다 — 마이그레이션도, 번거로움도 없습니다.',
  },
  {
    title: '즉시 배포',
    description: '명령어 하나로 프로젝트 생성. ISR로 콘텐츠를 항상 최신으로 유지하고, 필요할 때 즉시 갱신할 수 있습니다.',
  },
  {
    title: '완벽한 SEO',
    description: 'Open Graph, JSON-LD, RSS, 사이트맵, robots.txt — Notion 데이터에서 자동으로 생성됩니다.',
  },
  {
    title: '이미지 최적화',
    description: 'Next.js Image로 AVIF/WebP 자동 변환. 빌드 시 이미지를 다운로드해 외부 의존 없이 서빙할 수도 있습니다.',
  },
  {
    title: '플러그인 시스템',
    description: '분석, 댓글, RSS — 한 줄로 추가. 플러그인 API로 나만의 플러그인을 만드세요.',
  },
  {
    title: '완전한 소유',
    description: '오픈소스, 셀프호스팅. Vercel, Docker, 정적 빌드 등 원하는 방식으로 배포하세요.',
  },
];

function Hero(): React.ReactElement {
  const { colorMode } = useColorMode();
  const heroSrc = useBaseUrl(colorMode === 'dark' ? '/img/hero-dark.png' : '/img/hero.png');

  return (
    <section className={styles.hero}>
      <div className={styles.heroInner}>
        <h1 className={styles.heroTitle}>
          Notion 데이터베이스가<br />
          블로그가 되는 순간.
        </h1>
        <p className={styles.heroSubtitle}>
          Noxion은 Notion 데이터베이스를 빠르고 SEO에 강한 블로그로 만들어 줍니다.
          오픈소스. 셀프호스팅. 온전히 내 것.
        </p>
        <div className={styles.heroActions}>
          <Link className={styles.primaryBtn} to="/docs/learn/quick-start">
            시작하기
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
      <h2 className={styles.sectionTitle}>설정 파일 하나. 그게 전부입니다.</h2>
      <p className={styles.sectionSubtitle}>
        Notion 페이지를 연결하고, 플러그인을 추가하고, 배포하세요.
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
  language: "ko",
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
      <h2 className={styles.ctaTitle}>지금 바로 시작하세요.</h2>
      <p className={styles.ctaSubtitle}>
        5분 안에 블로그를 설정하세요.
      </p>
      <div className={styles.heroActions}>
        <Link className={styles.primaryBtn} to="/docs/learn/quick-start">
          문서 읽기
        </Link>
        <Link className={styles.secondaryBtn} to="/docs/reference/overview">
          API 레퍼런스
        </Link>
      </div>
    </section>
  );
}

export default function Home(): React.ReactElement {
  const { siteConfig } = useDocusaurusContext();

  return (
    <Layout title={siteConfig.title} description="Notion 데이터베이스를 빠르고 SEO에 강한 블로그로 만들어 주는 오픈소스 빌더">
      <main>
        <Hero />
        <Features />
        <Config />
        <CTA />
      </main>
    </Layout>
  );
}
