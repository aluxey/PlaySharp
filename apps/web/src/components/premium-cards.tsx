'use client';

import type { ReactNode } from 'react';

interface HeroCardProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  gradient?: boolean;
  children?: ReactNode;
}

export function HeroCard({ title, description, icon, action, gradient, children }: HeroCardProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-3xl p-6 md:p-8 border ${
        gradient
          ? 'bg-gradient-to-br from-primary/20 via-surface-elevated to-secondary/20 border-primary/30'
          : 'bg-surface-elevated border-border'
      }`}
    >
      {gradient && <div className="absolute inset-0 bg-surface-elevated/60 backdrop-blur-sm" />}
      <div className="relative">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            {icon && <div className="text-primary">{icon}</div>}
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
              <p className="text-foreground-secondary mt-1">{description}</p>
            </div>
          </div>
          {action}
        </div>
        {children}
      </div>
    </div>
  );
}

interface ActionCardProps {
  title: string;
  description?: string;
  icon: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'success';
  disabled?: boolean;
}

export function ActionCard({
  title,
  description,
  icon,
  onClick,
  variant = 'primary',
  disabled,
}: ActionCardProps) {
  const variantStyles = {
    primary: 'bg-primary/10 border-primary/30 hover:bg-primary/20 text-primary',
    secondary: 'bg-secondary/10 border-secondary/30 hover:bg-secondary/20 text-secondary',
    success: 'bg-success/10 border-success/30 hover:bg-success/20 text-success',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`w-full p-6 rounded-2xl border transition-all text-left ${variantStyles[variant]} ${
        disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer shadow-lg'
      }`}
    >
      <div className="w-8 h-8 mb-3 text-foreground">{icon}</div>
      <h3 className="font-semibold text-foreground mb-1">{title}</h3>
      {description && <p className="text-foreground-secondary text-sm">{description}</p>}
    </button>
  );
}

interface DataCardProps {
  label: string;
  value: string | number;
  change?: string | undefined;
  positive?: boolean | undefined;
  icon?: ReactNode | undefined;
  tone?: 'blue' | 'violet' | 'gold' | 'emerald' | 'rose';
}

export function DataCard({ label, value, change, positive, icon, tone = 'blue' }: DataCardProps) {
  return (
    <div
      className={`bg-surface-elevated border border-border rounded-2xl p-6 hover:border-primary/30 transition-all ${
        tone ? `data-card--${tone}` : ''
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <span className="text-foreground-secondary text-sm">{label}</span>
        {icon ? <span className="w-5 h-5 text-primary">{icon}</span> : null}
      </div>
      <div className="flex items-end justify-between">
        <span className="text-3xl font-bold text-foreground">{value}</span>
        {change && (
          <span className={`text-sm font-medium ${positive ? 'text-success' : 'text-error'}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}

interface ContentCardProps {
  title: string;
  description: string;
  image?: string | undefined;
  tags?: ReadonlyArray<string>;
  difficulty?: 'beginner' | 'intermediate' | 'advanced';
  duration?: string | undefined;
  locked?: boolean | undefined;
  onClick?: () => void;
}

export function ContentCard({
  title,
  description,
  image,
  tags,
  difficulty,
  duration,
  locked,
  onClick,
}: ContentCardProps) {
  const difficultyColors = {
    beginner: 'bg-success/10 text-success border-success/30',
    intermediate: 'bg-warning/10 text-warning border-warning/30',
    advanced: 'bg-error/10 text-error border-error/30',
  };

  return (
    <div
      onClick={locked ? undefined : onClick}
      className={`bg-surface-elevated border border-border rounded-2xl overflow-hidden hover:border-primary/30 transition-all ${
        locked ? 'opacity-60' : 'cursor-pointer'
      }`}
    >
      {image && (
        <div className="relative h-40 bg-surface overflow-hidden">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          {locked && (
            <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
              <div className="text-premium">🔒</div>
            </div>
          )}
        </div>
      )}
      <div className="p-6">
        <div className="flex items-start justify-between gap-2 mb-3">
          <h3 className="font-semibold text-foreground">{title}</h3>
          {difficulty && (
            <span className={`text-xs px-2 py-1 rounded-lg border ${difficultyColors[difficulty]}`}>
              {difficulty}
            </span>
          )}
        </div>
        <p className="text-foreground-secondary text-sm mb-4">{description}</p>
        <div className="flex items-center gap-2 flex-wrap">
          {tags?.map((tag, index) => (
            <span
              key={index}
              className="text-xs px-2 py-1 bg-surface rounded-lg text-foreground-secondary"
            >
              {tag}
            </span>
          ))}
          {duration && (
            <span className="text-xs text-foreground-secondary ml-auto">{duration}</span>
          )}
        </div>
      </div>
    </div>
  );
}

interface ProgressBarProps {
  value: number;
  max?: number;
  variant?: 'primary' | 'success' | 'warning';
  showLabel?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  variant = 'primary',
  showLabel,
}: ProgressBarProps) {
  const percentage = (value / max) * 100;

  const variantColors = {
    primary: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm text-foreground-secondary">Progress</span>
          <span className="text-sm font-medium text-foreground">{Math.round(percentage)}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-surface rounded-full overflow-hidden">
        <div
          className={`h-full ${variantColors[variant]} rounded-full`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
