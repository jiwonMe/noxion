"use client";

import type { HeroSectionProps } from "@noxion/renderer";
import { FeaturedPostCard } from "./FeaturedPostCard";

export function HeroSection({ posts }: HeroSectionProps) {
  if (posts.length === 0) return null;

  const [primary] = posts;

  return (
    <section>
      <FeaturedPostCard {...primary} />
    </section>
  );
}
