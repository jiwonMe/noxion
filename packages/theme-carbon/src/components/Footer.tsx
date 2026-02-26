import type { FooterProps } from "@noxion/renderer";

export function Footer({ siteName, author }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full bg-[var(--color-footer-bg)] text-[var(--color-footer-text)]">
      <div className="mx-auto max-w-[var(--width-content)] px-4">
        {/* Top columns */}
        <div className="grid grid-cols-1 gap-8 border-b border-[var(--color-footer-heading)] py-10 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <h3 className="mb-4 text-sm font-semibold text-[var(--color-footer-heading)]">
              {siteName}
            </h3>
            <p className="text-xs leading-relaxed">
              Powered by Noxion. Built with Notion as CMS.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-[var(--color-footer-heading)]">
              Navigate
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="/"
                  className="text-sm transition-colors duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:text-[var(--color-footer-heading)]"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/archive"
                  className="text-sm transition-colors duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:text-[var(--color-footer-heading)]"
                >
                  Archive
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold text-[var(--color-footer-heading)]">
              Connect
            </h3>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://github.com/jiwonme/noxion"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm transition-colors duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:text-[var(--color-footer-heading)]"
                >
                  GitHub
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col items-center justify-between gap-3 py-6 text-xs sm:flex-row">
          <span>&copy; {year} {author ?? siteName}</span>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/jiwonme/noxion"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors duration-[110ms] ease-[cubic-bezier(0.2,0,0.38,0.9)] hover:text-[var(--color-footer-heading)]"
            >
              Powered by Noxion
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
