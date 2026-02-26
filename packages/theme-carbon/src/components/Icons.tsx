/**
 * Carbon-style inline SVG icons.
 * Matches IBM Carbon Design System icon conventions:
 *  - viewBox 0 0 {size} {size}
 *  - fill="currentColor" (no stroke-based icons — Carbon uses filled paths)
 *  - Default size 20 (Carbon's standard icon size)
 *  - 16 for small / 24 for large / 32 for extra-large
 */

interface IconProps {
  size?: number;
  className?: string;
  "aria-label"?: string;
}

/* ------------------------------------------------------------------ */
/*  Arrow Right  (→)                                                   */
/* ------------------------------------------------------------------ */
export function ArrowRightIcon({ size = 20, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden={!rest["aria-label"]}
      {...rest}
    >
      <path d="M18 6l-1.43 1.393L24.15 15H4v2h20.15l-7.58 7.573L18 26l10-10z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Arrow Up-Right  (↗)                                                */
/* ------------------------------------------------------------------ */
export function ArrowUpRightIcon({ size = 20, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden={!rest["aria-label"]}
      {...rest}
    >
      <path d="M10 6v2h12.59L6 24.59 7.41 26 24 9.41V22h2V6z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Arrow Left  (←)                                                    */
/* ------------------------------------------------------------------ */
export function ArrowLeftIcon({ size = 20, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden={!rest["aria-label"]}
      {...rest}
    >
      <path d="M14 26l1.41-1.41L7.83 17H28v-2H7.83l7.58-7.59L14 6 4 16z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Search  (🔍)                                                       */
/* ------------------------------------------------------------------ */
export function SearchIcon({ size = 20, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden={!rest["aria-label"]}
      {...rest}
    >
      <path d="M29 27.586l-7.552-7.552a11.018 11.018 0 10-1.414 1.414L27.586 29zM4 13a9 9 0 119 9 9.01 9.01 0 01-9-9z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Close  (✕)                                                         */
/* ------------------------------------------------------------------ */
export function CloseIcon({ size = 20, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden={!rest["aria-label"]}
      {...rest}
    >
      <path d="M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4l6.6 6.6L8 22.6 9.4 24l6.6-6.6 6.6 6.6 1.4-1.4-6.6-6.6z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Menu / Hamburger  (≡)                                              */
/* ------------------------------------------------------------------ */
export function MenuIcon({ size = 20, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden={!rest["aria-label"]}
      {...rest}
    >
      <path d="M4 6h24v2H4zM4 14h24v2H4zM4 22h24v2H4z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Chevron Down  (v)                                                  */
/* ------------------------------------------------------------------ */
export function ChevronDownIcon({ size = 20, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden={!rest["aria-label"]}
      {...rest}
    >
      <path d="M16 22L6 12l1.4-1.4 8.6 8.6 8.6-8.6L26 12z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Chevron Right  (>)                                                 */
/* ------------------------------------------------------------------ */
export function ChevronRightIcon({ size = 16, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden={!rest["aria-label"]}
      {...rest}
    >
      <path d="M22 16L12 26l-1.4-1.4 8.6-8.6-8.6-8.6L12 6z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Checkmark  (✓)                                                     */
/* ------------------------------------------------------------------ */
export function CheckmarkIcon({ size = 16, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="currentColor"
      className={className}
      aria-hidden={!rest["aria-label"]}
      {...rest}
    >
      <path d="M13 24l-9-9 1.414-1.414L13 21.171 26.586 7.586 28 9z" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  IBM 8-bar logo (simplified)                                        */
/* ------------------------------------------------------------------ */
export function IbmLogoIcon({ size = 65, className, ...rest }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={Math.round(size * (26 / 65))}
      viewBox="0 0 65 26"
      fill="currentColor"
      className={className}
      aria-hidden={!rest["aria-label"]}
      {...rest}
    >
      {/* Simplified 8-bar representation */}
      <rect x="0" y="0" width="12" height="2" />
      <rect x="0" y="4" width="12" height="2" />
      <rect x="3" y="8" width="6" height="2" />
      <rect x="3" y="12" width="6" height="2" />
      <rect x="3" y="16" width="6" height="2" />
      <rect x="3" y="20" width="6" height="2" />
      <rect x="0" y="24" width="12" height="2" />

      <rect x="16" y="0" width="12" height="2" />
      <rect x="16" y="4" width="12" height="2" />
      <rect x="16" y="8" width="6" height="2" />
      <rect x="16" y="12" width="12" height="2" />
      <rect x="16" y="16" width="6" height="2" />
      <rect x="16" y="20" width="12" height="2" />
      <rect x="16" y="24" width="12" height="2" />

      <rect x="32" y="0" width="12" height="2" />
      <rect x="49" y="0" width="12" height="2" />
      <rect x="32" y="4" width="12" height="2" />
      <rect x="49" y="4" width="12" height="2" />
      <rect x="35" y="8" width="6" height="2" />
      <rect x="44" y="8" width="6" height="2" />
      <rect x="35" y="12" width="21" height="2" />
      <rect x="35" y="16" width="6" height="2" />
      <rect x="52" y="16" width="6" height="2" />
      <rect x="32" y="20" width="12" height="2" />
      <rect x="49" y="20" width="12" height="2" />
      <rect x="32" y="24" width="12" height="2" />
      <rect x="49" y="24" width="12" height="2" />
    </svg>
  );
}
