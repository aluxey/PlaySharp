import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import { AppShell, AuthProvider, ToastProvider } from '../components';
import { getAuthState } from '../lib/auth-state';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'PlaySharp',
    template: '%s · PlaySharp',
  },
  description: 'Interactive poker and blackjack training studio.',
};

export default async function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const authState = await getAuthState();

  return (
    <html lang="en">
      <body className="bg-background text-foreground">
        <ToastProvider>
          <AuthProvider initialUser={authState.user}>
            <AppShell>{children}</AppShell>
          </AuthProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
