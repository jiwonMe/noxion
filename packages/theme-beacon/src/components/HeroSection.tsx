import type { HeroSectionProps } from "@noxion/renderer";
import { FeaturedPostCard } from "./FeaturedPostCard";
import { PostCard } from "./PostCard";
import * as styles from "./HeroSection.css";

export function HeroSection({ posts }: HeroSectionProps) {
  if (posts.length === 0) return null;

  const [primary, ...secondary] = posts;

  return (
    <section className={styles.hero}>
      <FeaturedPostCard {...primary} />
      {secondary.length > 0 && (
        <div className={styles.posts}>
          {secondary.map((post) => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>
      )}
    </section>
  );
}
