import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AppShell } from '../components/app-shell';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'PlaySharp',
    template: '%s · PlaySharp',
  },
  description: 'Interactive poker and blackjack training studio.',
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
