import React from 'react';
import clsx from 'clsx';
import {useThemeConfig, ErrorCauseBoundary} from '@docusaurus/theme-common';
import {
  splitNavbarItems,
  useNavbarMobileSidebar,
} from '@docusaurus/theme-common/internal';
import NavbarItem from '@theme/NavbarItem';
import NavbarColorModeToggle from '@theme/Navbar/ColorModeToggle';
import SearchBar from '@theme/SearchBar';
import NavbarMobileSidebarToggle from '@theme/Navbar/MobileSidebar/Toggle';
import NavbarLogo from '@theme/Navbar/Logo';
import NavbarSearch from '@theme/Navbar/Search';
import styles from './styles.module.css';

function useNavbarItems() {
  return useThemeConfig().navbar.items as any[];
}

function NavbarItems({items}: {items: any[]}): React.ReactElement {
  return (
    <>
      {items.map((item, i) => (
        <ErrorCauseBoundary
          key={i}
          onError={(error: Error) =>
            new Error(`A theme navbar item failed to render.`, {cause: error})
          }>
          <NavbarItem {...item} />
        </ErrorCauseBoundary>
      ))}
    </>
  );
}

export default function NavbarContent(): React.ReactElement {
  const mobileSidebar = useNavbarMobileSidebar();
  const items = useNavbarItems();
  const [leftItems, rightItems] = splitNavbarItems(items);
  const searchBarItem = items.find((item: any) => item.type === 'search');

  return (
    <div className={styles.navbarWrapper}>
      <div className={styles.topRow}>
        <div className={styles.topLeft}>
          {!mobileSidebar.disabled && <NavbarMobileSidebarToggle />}
          <NavbarLogo />
        </div>
        <div className={styles.topRight}>
          <NavbarSearch>
            <SearchBar />
          </NavbarSearch>
          <NavbarItems items={rightItems} />
          <NavbarColorModeToggle className={styles.colorModeToggle} />
        </div>
      </div>
      <div className={styles.bottomRow}>
        <NavbarItems items={leftItems} />
      </div>
    </div>
  );
}
