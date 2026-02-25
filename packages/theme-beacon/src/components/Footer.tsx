import type { FooterProps } from "@noxion/renderer";

export function Footer({ siteName, author }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="">
      <div className="">
        <span className="">
          &copy; {year} {author ?? siteName}
        </span>

        <a
          href="https://github.com/jiwonme/noxion"
          target="_blank"
          rel="noopener noreferrer"
          className=""
        >
          Powered by Noxion
        </a>
      </div>
    </footer>
  );
}
