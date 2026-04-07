'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

import { routes } from '../lib/routes';
import { siteConfig } from '../lib/site';

function isActivePath(pathname: string, href: string) {
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function SiteHeader() {
  const pathname = usePathname();

  return (
    <header className="site-header">
      <Link className="brand" href={routes.home}>
        <span className="brand__mark" aria-hidden="true" />
        <span className="brand__copy">
          <span className="brand__name">{siteConfig.name}</span>
          <span className="brand__tag">Poker and blackjack studio</span>
        </span>
      </Link>

      <nav className="site-nav" aria-label="Main navigation">
        {siteConfig.navItems.map((item) => (
          <Link
            key={item.href}
            className={
              isActivePath(pathname, item.href)
                ? 'site-nav__link site-nav__link--active'
                : 'site-nav__link'
            }
            href={item.href}
          >
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="site-header__actions">
        <Link className="button button--secondary button--small" href={routes.login}>
          Log in
        </Link>
        <Link className="button button--primary button--small" href={routes.quiz}>
          Daily quiz
        </Link>
      </div>
    </header>
  );
}
