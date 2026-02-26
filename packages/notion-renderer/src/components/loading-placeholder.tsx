"use client";



/**
 * LoadingPlaceholder — styled loading state for lazy-loaded blocks
 * Matches noxion CSS with `.noxion-loading-placeholder` class
 * Shows animated skeleton while module loads
 */
export function LoadingPlaceholder() {
  return (
    <div className="noxion-loading-placeholder">
      <div className="noxion-loading-placeholder__skeleton">
        <div className="noxion-loading-placeholder__line" />
        <div className="noxion-loading-placeholder__line noxion-loading-placeholder__line--short" />
      </div>
    </div>
  );
}
