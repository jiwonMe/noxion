import { useState, useMemo, useCallback } from 'react';
import Layout from '@theme/Layout';
import SiteCard from '@site/src/components/Showcase/SiteCard';
import FeatureCard from '@site/src/components/Showcase/FeatureCard';
import ThemeCard from '@site/src/components/Showcase/ThemeCard';
import ShowcaseFilters from '@site/src/components/Showcase/ShowcaseFilters';
import sites from '@site/src/data/showcase/sites';
import features from '@site/src/data/showcase/features';
import themes from '@site/src/data/showcase/themes';
import type { SiteTag, ThemeTag } from '@site/src/data/showcase/types';
import styles from '@site/src/components/Showcase/Showcase.module.css';

type TabId = 'sites' | 'features' | 'themes';

const TABS: { id: TabId; label: string }[] = [
  { id: 'sites', label: '사이트' },
  { id: 'features', label: '기능' },
  { id: 'themes', label: '테마' },
];

const SITE_TAGS: SiteTag[] = ['blog', 'docs', 'portfolio', 'personal', 'company'];
const THEME_TAGS: ThemeTag[] = ['minimal', 'magazine', 'technical', 'creative', 'dark-first'];

function matchesSearch(text: string, query: string): boolean {
  return text.toLowerCase().includes(query.toLowerCase());
}

export default function ShowcasePage(): React.ReactElement {
  const [activeTab, setActiveTab] = useState<TabId>('sites');
  const [siteActiveTags, setSiteActiveTags] = useState<SiteTag[]>([]);
  const [siteSearch, setSiteSearch] = useState('');
  const [themeActiveTags, setThemeActiveTags] = useState<ThemeTag[]>([]);
  const [themeSearch, setThemeSearch] = useState('');

  const handleSiteTagToggle = useCallback((tag: string) => {
    setSiteActiveTags((prev) =>
      prev.includes(tag as SiteTag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag as SiteTag],
    );
  }, []);

  const handleThemeTagToggle = useCallback((tag: string) => {
    setThemeActiveTags((prev) =>
      prev.includes(tag as ThemeTag)
        ? prev.filter((t) => t !== tag)
        : [...prev, tag as ThemeTag],
    );
  }, []);

  const filteredSites = useMemo(() => {
    return sites.filter((site) => {
      const tagsMatch = siteActiveTags.length === 0 || site.tags.some((t) => siteActiveTags.includes(t));
      const searchMatch = siteSearch === '' || matchesSearch(site.title, siteSearch) || matchesSearch(site.description, siteSearch);
      return tagsMatch && searchMatch;
    });
  }, [siteActiveTags, siteSearch]);

  const filteredThemes = useMemo(() => {
    return themes.filter((theme) => {
      const tagsMatch = themeActiveTags.length === 0 || theme.tags.some((t) => themeActiveTags.includes(t));
      const searchMatch = themeSearch === '' || matchesSearch(theme.title, themeSearch) || matchesSearch(theme.description, themeSearch);
      return tagsMatch && searchMatch;
    });
  }, [themeActiveTags, themeSearch]);

  return (
    <Layout title="쇼케이스" description="Noxion으로 만든 프로젝트들을 둘러보세요">
      <main className={styles.showcasePage}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>쇼케이스</h1>
          <p className={styles.heroSubtitle}>
            Noxion으로 만든 프로젝트들을 둘러보세요
          </p>
        </div>

        <div className={styles.tabs}>
          {TABS.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'sites' && (
          <section className={styles.section} id="sites">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Noxion으로 만든 사이트</h2>
              <p className={styles.sectionSubtitle}>
                Notion으로 운영되는 블로그, 문서, 포트폴리오
              </p>
            </div>
            <ShowcaseFilters
              tags={SITE_TAGS}
              activeTags={siteActiveTags}
              onTagToggle={handleSiteTagToggle}
              searchQuery={siteSearch}
              onSearchChange={setSiteSearch}
              placeholder="사이트 검색..."
            />
            <div className={styles.cardGrid}>
              {filteredSites.length > 0 ? (
                filteredSites.map((site) => (
                  <SiteCard key={site.url} site={site} />
                ))
              ) : (
                <p className={styles.emptyState}>필터에 맞는 사이트가 없습니다.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === 'features' && (
          <section className={styles.section} id="features">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>기능</h2>
              <p className={styles.sectionSubtitle}>
                Notion 기반 웹사이트를 만들기 위한 모든 것
              </p>
            </div>
            {features.map((feature) => (
              <FeatureCard key={feature.title} feature={feature} />
            ))}
          </section>
        )}

        {activeTab === 'themes' && (
          <section className={styles.section} id="themes">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>테마 & 템플릿</h2>
              <p className={styles.sectionSubtitle}>
                테마를 고르고, 커스터마이징하고, 나만의 사이트를 만드세요
              </p>
            </div>
            <ShowcaseFilters
              tags={THEME_TAGS}
              activeTags={themeActiveTags}
              onTagToggle={handleThemeTagToggle}
              searchQuery={themeSearch}
              onSearchChange={setThemeSearch}
              placeholder="테마 검색..."
            />
            <div className={styles.cardGrid}>
              {filteredThemes.length > 0 ? (
                filteredThemes.map((theme) => (
                  <ThemeCard key={theme.title} theme={theme} />
                ))
              ) : (
                <p className={styles.emptyState}>필터에 맞는 테마가 없습니다.</p>
              )}
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
