import type { FooterProps } from "@noxion/renderer";

export function Footer({ siteName, author }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-neutral-200 dark:border-neutral-800">
      <div className="max-w-[1320px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-3 py-8 px-6 text-sm text-neutral-400 dark:text-neutral-500">
        <span>&copy; {year} {author ?? siteName}</span>
        <a
          href="https://github.com/jiwonme/noxion"
          target="_blank"
          rel="noopener noreferrer"
          className="hover:text-neutral-900 dark:hover:text-neutral-100 transition-colors"
        >
          Powered by Noxion
        </a>
      </div>
    </footer>
  );
}
