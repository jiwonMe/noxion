"use client";

import type { ComponentType } from "react";
import type { PostCardProps } from "../theme/types";
import { useNoxionComponents } from "../theme/ThemeProvider";
import { FeaturedPostCard as DefaultFeaturedPostCard } from "./FeaturedPostCard";
import { PostCard as DefaultPostCard } from "./PostCard";

export interface HeroSectionProps {
  posts: PostCardProps[];
  className?: string;
}

export function HeroSection({ posts, className }: HeroSectionProps) {
  const overrides = useNoxionComponents();
  const FeaturedCard = (overrides.FeaturedPostCard ?? DefaultFeaturedPostCard) as ComponentType<PostCardProps & { className?: string }>;
  const Card = (overrides.PostCard ?? DefaultPostCard) as ComponentType<PostCardProps & { className?: string }>;

  if (posts.length === 0) return null;

  const [primary, ...secondary] = posts;
  const baseClass = className ? `noxion-home-hero ${className}` : "noxion-home-hero";

  return (
    <section className={baseClass}>
      <FeaturedCard {...primary} className="noxion-home-hero__primary" />
      {secondary.length > 0 && (
        <div className="noxion-home-hero__secondary">
          {secondary.map((post) => (
            <Card key={post.slug} {...post} />
          ))}
        </div>
      )}
    </section>
  );
}
