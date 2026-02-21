import React from 'react';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/DocPaginator';

function ArrowLeft(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="15 18 9 12 15 6" />
    </svg>
  );
}

function ArrowRight(): React.ReactElement {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  );
}

export default function DocPaginator({previous, next}: Props): React.ReactElement {
  return (
    <nav className="pagination-nav docusaurus-mt-lg" aria-label="Docs pages">
      {previous && (
        <Link className="pagination-nav__link pagination-nav__link--prev" to={previous.permalink}>
          <div className="pagination-nav__sublabel">
            <ArrowLeft />
            Previous
          </div>
          <div className="pagination-nav__label">{previous.title}</div>
        </Link>
      )}
      {next && (
        <Link className="pagination-nav__link pagination-nav__link--next" to={next.permalink}>
          <div className="pagination-nav__sublabel">
            Next
            <ArrowRight />
          </div>
          <div className="pagination-nav__label">{next.title}</div>
        </Link>
      )}
    </nav>
  );
}
