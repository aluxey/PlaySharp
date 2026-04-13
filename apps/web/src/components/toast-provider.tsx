'use client';

import type { ReactNode } from 'react';
import { createContext, useContext, useEffect, useRef, useState } from 'react';
import { CheckCircle2, CircleAlert, Info, X } from 'lucide-react';

type ToastTone = 'success' | 'error' | 'info';

type ToastInput = {
  title: string;
  description?: string;
  tone?: ToastTone;
  durationMs?: number;
};

type ToastRecord = {
  id: number;
  title: string;
  description?: string;
  tone: ToastTone;
  durationMs: number;
};

type ToastContextValue = {
  showToast: (input: ToastInput) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

function toastToneClasses(tone: ToastTone) {
  switch (tone) {
    case 'success':
      return 'border-success/30 bg-success/10 text-foreground';
    case 'error':
      return 'border-error/30 bg-error/10 text-foreground';
    case 'info':
      return 'border-primary/30 bg-surface-elevated text-foreground';
  }
}

function ToastIcon({ tone }: { tone: ToastTone }) {
  switch (tone) {
    case 'success':
      return <CheckCircle2 className="h-5 w-5 text-success" />;
    case 'error':
      return <CircleAlert className="h-5 w-5 text-error" />;
    case 'info':
      return <Info className="h-5 w-5 text-primary" />;
  }
}

function ToastCard({ toast, onDismiss }: { toast: ToastRecord; onDismiss: (id: number) => void }) {
  useEffect(() => {
    const timeoutId = window.setTimeout(() => {
      onDismiss(toast.id);
    }, toast.durationMs);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [onDismiss, toast.durationMs, toast.id]);

  return (
    <div
      className={`pointer-events-auto rounded-2xl border shadow-2xl shadow-background/40 backdrop-blur ${toastToneClasses(toast.tone)}`}
      role="status"
    >
      <div className="flex gap-3 p-4">
        <div className="mt-0.5 shrink-0">
          <ToastIcon tone={toast.tone} />
        </div>
        <div className="min-w-0 flex-1 space-y-1">
          <p className="font-semibold">{toast.title}</p>
          {toast.description ? (
            <p className="text-sm text-foreground-secondary">{toast.description}</p>
          ) : null}
        </div>
        <button
          aria-label="Dismiss notification"
          className="shrink-0 rounded-lg p-1 text-foreground-secondary transition-colors hover:bg-surface hover:text-foreground"
          onClick={() => onDismiss(toast.id)}
          type="button"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ReadonlyArray<ToastRecord>>([]);
  const nextToastId = useRef(1);

  function dismissToast(id: number) {
    setToasts((currentToasts) => currentToasts.filter((toast) => toast.id !== id));
  }

  function showToast(input: ToastInput) {
    const toast: ToastRecord = {
      id: nextToastId.current,
      title: input.title,
      tone: input.tone ?? 'info',
      durationMs: input.durationMs ?? 4500,
      ...(input.description ? { description: input.description } : {}),
    };

    nextToastId.current += 1;

    setToasts((currentToasts) => [...currentToasts, toast]);
  }

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div
        aria-atomic="true"
        aria-live="polite"
        className="pointer-events-none fixed inset-x-0 top-4 z-[120] flex justify-center px-4 sm:justify-end"
      >
        <div className="flex w-full max-w-sm flex-col gap-3">
          {toasts.map((toast) => (
            <ToastCard key={toast.id} toast={toast} onDismiss={dismissToast} />
          ))}
        </div>
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error('useToast must be used within a ToastProvider.');
  }

  return context;
}
