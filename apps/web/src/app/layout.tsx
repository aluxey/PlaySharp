import type { Metadata } from 'next';
import type { ReactNode } from 'react';
import { SiteHeader } from '../components/site-header';
import { siteConfig } from '../lib/site';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: siteConfig.name,
    template: `%s · ${siteConfig.name}`,
  },
  description: siteConfig.description,
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <div className="app-scene">
          <div className="app-scene__orb app-scene__orb--one" aria-hidden="true" />
          <div className="app-scene__orb app-scene__orb--two" aria-hidden="true" />
          <div className="app-scene__grid" aria-hidden="true" />
          <SiteHeader />
          {children}
        </div>
      </body>
    </html>
  );
}
