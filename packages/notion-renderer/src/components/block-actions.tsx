"use client";

import { useState } from "react";
import { cs } from "../utils";

export interface BlockActionsProps {
  blockId: string;
  blockType: string;
  content?: string;
  className?: string;
}

export function BlockActions({
  blockId,
  content,
  className,
}: BlockActionsProps) {
  const [copiedButton, setCopiedButton] = useState<"copy" | "share" | null>(null);

  const handleCopy = async () => {
    if (!content) return;

    try {
      await navigator.clipboard.writeText(content);
      setCopiedButton("copy");
      setTimeout(() => setCopiedButton(null), 2000);
    } catch (error) {
      console.error("Failed to copy to clipboard:", error);
    }
  };

  const handleShare = async () => {
    try {
      const shareUrl = `${typeof window !== "undefined" ? window.location.href : ""}#block-${blockId}`;
      await navigator.clipboard.writeText(shareUrl);
      setCopiedButton("share");
      setTimeout(() => setCopiedButton(null), 2000);
    } catch (error) {
      console.error("Failed to copy share link:", error);
    }
  };

  return (
    <div className={cs("noxion-block-actions", className)}>
      {content && (
        <button
          className="noxion-block-actions__button noxion-block-actions__copy"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          title="Copy"
        >
          {copiedButton === "copy" ? "Copied!" : "Copy"}
        </button>
      )}

      <button
        className="noxion-block-actions__button noxion-block-actions__share"
        onClick={handleShare}
        aria-label="Copy share link to clipboard"
        title="Share"
      >
        {copiedButton === "share" ? "Copied!" : "Share"}
      </button>
    </div>
  );
}
