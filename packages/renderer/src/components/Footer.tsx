import type { FooterProps } from "../theme/types";

export function Footer({ siteName, author, className }: FooterProps & { className?: string }) {
  const year = new Date().getFullYear();

  return (
    <footer className={className ? `noxion-footer ${className}` : "noxion-footer"}>
      <span className="noxion-footer__copyright">
        &copy; {year} {author ?? siteName}
      </span>
      <a
        href="https://github.com/jiwonme/noxion"
        target="_blank"
        rel="noopener noreferrer"
        className="noxion-footer__powered-by"
      >
        Powered by Noxion
      </a>
    </footer>
  );
}
