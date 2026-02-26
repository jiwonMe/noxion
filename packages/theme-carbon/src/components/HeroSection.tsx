import type { HeroSectionProps } from "@noxion/renderer";
import { FeaturedPostCard } from "./FeaturedPostCard";
import { PostCard } from "./PostCard";

export function HeroSection({ posts }: HeroSectionProps) {
  if (posts.length === 0) return null;

  const [primary, ...secondary] = posts;

  return (
    <section className="border-x border-b border-[var(--color-border)]">
      <FeaturedPostCard {...primary} />
      {secondary.length > 0 && (
        <div className="grid grid-cols-1 gap-0 border-t border-[var(--color-border)] md:grid-cols-2">
          {secondary.map((post, i) => (
            <div
              key={post.slug}
              className={`border-b border-[var(--color-border)]${
                i % 2 === 0 ? " md:border-r" : ""
              }`}
            >
              <PostCard {...post} borderMode="cell" />
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
