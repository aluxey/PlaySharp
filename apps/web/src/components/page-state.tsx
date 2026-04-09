'use client';

import Link from 'next/link';
import type { ReactNode } from 'react';

type StatePanelProps = {
  eyebrow?: string;
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  aside?: ReactNode;
  tone?: 'default' | 'error';
};

export function StatePanel({
  eyebrow,
  title,
  description,
  actionLabel,
  actionHref,
  aside,
  tone = 'default',
}: StatePanelProps) {
  return (
    <div
      className={`rounded-3xl border p-8 md:p-10 ${
        tone === 'error' ? 'bg-error/10 border-error/30' : 'bg-surface-elevated border-border'
      }`}
    >
      <div className="space-y-4">
        {eyebrow ? (
          <p className="text-sm uppercase tracking-[0.22em] text-foreground-secondary">{eyebrow}</p>
        ) : null}
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
          <p className="max-w-2xl text-foreground-secondary">{description}</p>
        </div>
        {aside}
        {actionLabel && actionHref ? (
          <Link
            className="inline-flex items-center rounded-xl bg-primary px-4 py-2 font-semibold text-primary-foreground"
            href={actionHref}
          >
            {actionLabel}
          </Link>
        ) : null}
      </div>
    </div>
  );
}

export function PageLoadingState({ title, description }: { title: string; description: string }) {
  return (
    <div className="min-h-screen max-w-6xl mx-auto px-4 py-12">
      <div className="animate-pulse space-y-6">
        <div className="rounded-3xl border border-border bg-surface-elevated p-8 md:p-10">
          <div className="mb-4 h-4 w-36 rounded-full bg-surface" />
          <div className="mb-4 h-12 w-80 max-w-full rounded-2xl bg-surface" />
          <div className="h-5 w-[32rem] max-w-full rounded-full bg-surface" />
          <p className="sr-only">
            {title}. {description}
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <div
              key={index}
              className="h-36 rounded-2xl border border-border bg-surface-elevated"
            />
          ))}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <div className="h-72 rounded-3xl border border-border bg-surface-elevated" />
          <div className="h-72 rounded-3xl border border-border bg-surface-elevated" />
        </div>
      </div>
    </div>
  );
}
