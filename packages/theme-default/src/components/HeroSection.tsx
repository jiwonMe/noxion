"use client";

import type { HeroSectionProps } from "@noxion/renderer";
import { FeaturedPostCard } from "./FeaturedPostCard";
import { PostCard } from "./PostCard";

export function HeroSection({ posts }: HeroSectionProps) {
  if (posts.length === 0) return null;

  const [primary, ...secondary] = posts;

  return (
    <section className="space-y-8">
      <div className="w-full">
        <FeaturedPostCard {...primary} />
      </div>
      {secondary.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {secondary.map((post) => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>
      )}
    </section>
  );
}
