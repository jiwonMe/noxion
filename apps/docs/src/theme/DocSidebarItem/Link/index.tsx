import React from 'react';
import clsx from 'clsx';
import {ThemeClassNames} from '@docusaurus/theme-common';
import {isActiveSidebarItem} from '@docusaurus/plugin-content-docs/client';
import Link from '@docusaurus/Link';
import type {Props} from '@theme/DocSidebarItem/Link';
import styles from './styles.module.css';

export default function DocSidebarItemLink({
  item,
  onItemClick,
  activePath,
  level,
  index,
  ...props
}: Props): React.ReactElement {
  const {href, label, className, autoAddBaseUrl} = item;
  const isActive = isActiveSidebarItem(item, activePath);

  return (
    <li
      className={clsx(
        ThemeClassNames.docs.docSidebarItemLink,
        ThemeClassNames.docs.docSidebarItemLinkLevel(level),
        'menu__list-item',
        className,
      )}
      key={label}>
      <Link
        className={clsx('menu__link', {'menu__link--active': isActive})}
        autoAddBaseUrl={autoAddBaseUrl}
        aria-current={isActive ? 'page' : undefined}
        to={href}
        onClick={onItemClick ? () => onItemClick(item) : undefined}
        {...props}>
        <span className={styles.linkLabel}>{label}</span>
      </Link>
    </li>
  );
}
