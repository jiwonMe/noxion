import React from 'react';
import {useSidebarBreadcrumbs} from '@docusaurus/plugin-content-docs/client';
import DocBreadcrumbsStructuredData from '@theme/DocBreadcrumbs/StructuredData';

export default function DocBreadcrumbs(): React.ReactElement | null {
  const breadcrumbs = useSidebarBreadcrumbs();

  if (!breadcrumbs || breadcrumbs.length === 0) {
    return null;
  }

  const section = breadcrumbs[0];

  return (
    <>
      <DocBreadcrumbsStructuredData breadcrumbs={breadcrumbs} />
      <div className="doc-section-label">{section.label}</div>
    </>
  );
}
