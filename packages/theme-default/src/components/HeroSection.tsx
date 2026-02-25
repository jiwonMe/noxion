"use client";

import type { HeroSectionProps } from "@noxion/renderer";
import { FeaturedPostCard } from "./FeaturedPostCard";
import { PostCard } from "./PostCard";

export function HeroSection({ posts }: HeroSectionProps) {
  if (posts.length === 0) return null;

  const [primary, ...secondary] = posts;

  return (
    <section className="">
      <div className="">
        <FeaturedPostCard {...primary} />
      </div>
      {secondary.length > 0 && (
        <div className="">
          {secondary.map((post) => (
            <PostCard key={post.slug} {...post} />
          ))}
        </div>
      )}
    </section>
  );
}
