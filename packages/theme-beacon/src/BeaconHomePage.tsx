import type { NoxionTemplateProps, PostCardProps } from "@noxion/renderer";
import { PostList } from "@noxion/renderer";

function formatDate(dateStr: string): string {
  try {
    const d = new Date(dateStr + (dateStr.includes("T") ? "" : "T00:00:00"));
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  } catch {
    return dateStr;
  }
}

function BeaconCard({
  title,
  slug,
  date,
  coverImage,
  category,
  description,
  author,
  className,
  showImage = true,
  showExcerpt = true,
}: PostCardProps & { className?: string; showImage?: boolean; showExcerpt?: boolean }) {
  return (
    <a className={`beacon-card ${className ?? ""}`} href={`/${slug}`}>
      {showImage && coverImage && (
        <figure className="beacon-card__image">
          <img src={coverImage} alt={title} loading="lazy" decoding="async" />
        </figure>
      )}
      <div className="beacon-card__wrapper">
        {category && <p className="beacon-card__tag">{category}</p>}
        <h3 className="beacon-card__title">{title}</h3>
        {showExcerpt && description && (
          <p className="beacon-card__excerpt">{description}</p>
        )}
        <footer className="beacon-card__meta">
          {author && <span className="beacon-card__author">By {author}</span>}
          {date && (
            <time className="beacon-card__date" dateTime={date}>
              {formatDate(date)}
            </time>
          )}
        </footer>
      </div>
    </a>
  );
}

function BeaconSidebarCard({
  title,
  slug,
  date,
  coverImage,
  category,
  author,
}: PostCardProps) {
  return (
    <a className="beacon-sidebar-card" href={`/${slug}`}>
      {coverImage && (
        <figure className="beacon-sidebar-card__image">
          <img src={coverImage} alt={title} loading="lazy" decoding="async" />
        </figure>
      )}
      <div className="beacon-sidebar-card__wrapper">
        {category && <p className="beacon-sidebar-card__tag">{category}</p>}
        <h3 className="beacon-sidebar-card__title">{title}</h3>
        <footer className="beacon-sidebar-card__meta">
          {author && <span className="beacon-sidebar-card__author">By {author}</span>}
          {date && (
            <time className="beacon-sidebar-card__date" dateTime={date}>
              {formatDate(date)}
            </time>
          )}
        </footer>
      </div>
    </a>
  );
}

export function BeaconHomePage({ data, className }: NoxionTemplateProps) {
  const posts = (data.posts ?? []) as PostCardProps[];
  const feedTitle = (data.feedTitle as string) ?? "Latest";
  const baseClass = className
    ? `noxion-template-home beacon-home ${className}`
    : "noxion-template-home beacon-home";

  if (posts.length === 0) {
    return (
      <div className={baseClass}>
        <PostList posts={posts} />
      </div>
    );
  }

  const LEFT_COUNT = 1;
  const MIDDLE_COUNT = 3;
  const SIDEBAR_COUNT = 6;
  const HERO_TOTAL = LEFT_COUNT + MIDDLE_COUNT + SIDEBAR_COUNT;

  const heroCount = Math.min(posts.length, HERO_TOTAL);
  const heroPosts = posts.slice(0, heroCount);
  const feedPosts = posts.slice(heroCount);

  const leftPosts = heroPosts.slice(0, LEFT_COUNT);
  const middlePosts = heroPosts.slice(LEFT_COUNT, LEFT_COUNT + MIDDLE_COUNT);
  const sidebarPosts = heroPosts.slice(LEFT_COUNT + MIDDLE_COUNT);

  return (
    <div className={baseClass}>
      <section className="beacon-header-grid">
        {leftPosts.length > 0 && (
          <div className="beacon-header-grid__left">
            {leftPosts.map((post) => (
              <BeaconCard key={post.slug} {...post} className="beacon-card--large" />
            ))}
          </div>
        )}

        {middlePosts.length > 0 && (
          <div className="beacon-header-grid__middle">
            {middlePosts.map((post, i) => (
              <BeaconCard
                key={post.slug}
                {...post}
                showExcerpt={i === 0}
                className="beacon-card--medium"
              />
            ))}
          </div>
        )}

        {sidebarPosts.length > 0 && (
          <div className="beacon-header-grid__right">
            <div className="beacon-featured-feed">
              {sidebarPosts.map((post) => (
                <BeaconSidebarCard key={post.slug} {...post} />
              ))}
            </div>
          </div>
        )}
      </section>

      {feedPosts.length > 0 && (
        <section className="beacon-latest">
          <h2 className="beacon-latest__title">{feedTitle}</h2>
          <div className="beacon-latest__feed">
            {feedPosts.map((post) => (
              <BeaconCard
                key={post.slug}
                {...post}
                className="beacon-card--list"
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
