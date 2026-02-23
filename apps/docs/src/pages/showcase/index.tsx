import { useState, useMemo, useCallback } from 'react';
import Layout from '@theme/Layout';
import SiteCard from '../../components/Showcase/SiteCard';
import FeatureCard from '../../components/Showcase/FeatureCard';
import ThemeCard from '../../components/Showcase/ThemeCard';
import ShowcaseFilters from '../../components/Showcase/ShowcaseFilters';
import sites from '../../data/showcase/sites';
import features from '../../data/showcase/features';
import themes from '../../data/showcase/themes';
import type { SiteTag, ThemeTag } from '../../data/showcase/types';
import styles from '../../components/Showcase/Showcase.module.css';

type TabId = 'sites' | 'features' | 'themes';

const TABS: { id: TabId; label: string }[] = [
  { id: 'sites', label: 'Sites' },
  { id: 'features', label: 'Features' },
  { id: 'themes', label: 'Themes' },
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
    <Layout title="Showcase" description="Explore what people are building with Noxion">
      <main className={styles.showcasePage}>
        <div className={styles.hero}>
          <h1 className={styles.heroTitle}>Showcase</h1>
          <p className={styles.heroSubtitle}>
            Explore what people are building with Noxion
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
              <h2 className={styles.sectionTitle}>Built with Noxion</h2>
              <p className={styles.sectionSubtitle}>
                Blogs, docs, and portfolios powered by Notion
              </p>
            </div>
            <ShowcaseFilters
              tags={SITE_TAGS}
              activeTags={siteActiveTags}
              onTagToggle={handleSiteTagToggle}
              searchQuery={siteSearch}
              onSearchChange={setSiteSearch}
              placeholder="Search sites..."
            />
            <div className={styles.cardGrid}>
              {filteredSites.length > 0 ? (
                filteredSites.map((site) => (
                  <SiteCard key={site.url} site={site} />
                ))
              ) : (
                <p className={styles.emptyState}>No sites match your filters.</p>
              )}
            </div>
          </section>
        )}

        {activeTab === 'features' && (
          <section className={styles.section} id="features">
            <div className={styles.sectionHeader}>
              <h2 className={styles.sectionTitle}>Features</h2>
              <p className={styles.sectionSubtitle}>
                Everything you need to build a Notion-powered website
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
              <h2 className={styles.sectionTitle}>Themes &amp; Templates</h2>
              <p className={styles.sectionSubtitle}>
                Start with a theme, customize it, make it yours
              </p>
            </div>
            <ShowcaseFilters
              tags={THEME_TAGS}
              activeTags={themeActiveTags}
              onTagToggle={handleThemeTagToggle}
              searchQuery={themeSearch}
              onSearchChange={setThemeSearch}
              placeholder="Search themes..."
            />
            <div className={styles.cardGrid}>
              {filteredThemes.length > 0 ? (
                filteredThemes.map((theme) => (
                  <ThemeCard key={theme.title} theme={theme} />
                ))
              ) : (
                <p className={styles.emptyState}>No themes match your filters.</p>
              )}
            </div>
          </section>
        )}
      </main>
    </Layout>
  );
}
