"use client";

import React from "react";

export interface HeadingAnchorProps {
  id: string;
  className?: string;
}

/**
 * Heading anchor component that renders a link icon next to a heading.
 * 
 * Features:
 * - Renders an <a> tag with href="#${id}"
 * - Shows a link icon (# symbol)
 * - Hidden by default, visible on parent hover
 * - Click handler copies the full URL with hash to clipboard
 * 
 * CSS class: .noxion-heading-anchor
 */
export function HeadingAnchor({ id, className }: HeadingAnchorProps) {
  const handleClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    
    // Copy the full URL with hash to clipboard
    const url = `${window.location.href.split("#")[0]}#${id}`;
    try {
      await navigator.clipboard.writeText(url);
    } catch (err) {
      console.error("Failed to copy heading link:", err);
    }
  };

  return (
    <a
      href={`#${id}`}
      className={`noxion-heading-anchor${className ? ` ${className}` : ""}`}
      onClick={handleClick}
      aria-label={`Link to heading ${id}`}
      title="Copy link to heading"
    >
      #
    </a>
  );
}
