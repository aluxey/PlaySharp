import Link from 'next/link';
import type { ReactNode } from 'react';
import { Flame } from 'lucide-react';

import { buildLoginRoute, buildRegisterRoute, routes } from '../../lib/routes';

type AuthTab = 'register' | 'login';

type AuthLayoutProps = {
  activeTab: AuthTab;
  nextPath: string | null;
  formEyebrow: string;
  formTitle: string;
  formDescription: string;
  helper: ReactNode;
  children: ReactNode;
  footer: ReactNode;
};

const slideDots: ReadonlyArray<{ id: number; registerActive: boolean; loginActive: boolean }> = [
  { id: 1, registerActive: true, loginActive: false },
  { id: 2, registerActive: false, loginActive: true },
  { id: 3, registerActive: false, loginActive: false },
];

export function AuthLayout({
  activeTab,
  nextPath,
  formEyebrow,
  formTitle,
  formDescription,
  helper,
  children,
  footer,
}: AuthLayoutProps) {
  const registerHref = buildRegisterRoute(nextPath);
  const loginHref = buildLoginRoute(nextPath);

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-5 md:px-8 md:py-8">
      <div className="auth-mesh pointer-events-none absolute inset-0 opacity-90" />
      <div className="auth-scanlines pointer-events-none absolute inset-0 opacity-35" />

      <div className="relative mx-auto grid min-h-[calc(100vh-2.5rem)] max-w-6xl overflow-hidden rounded-[2rem] border border-white/10 bg-[#0d1117]/90 shadow-[0_35px_120px_rgba(2,6,23,0.74)] backdrop-blur xl:grid-cols-[1.08fr_0.92fr]">
        <aside className="relative overflow-hidden border-b border-white/10 bg-[linear-gradient(155deg,#190f35_0%,#2b185a_48%,#111827_100%)] px-6 py-8 md:px-10 md:py-10 xl:border-b-0 xl:border-r xl:border-white/10">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(59,130,246,0.24),transparent_28%),radial-gradient(circle_at_84%_24%,rgba(139,92,246,0.28),transparent_26%),linear-gradient(135deg,rgba(255,255,255,0.05),transparent_46%)]" />
          <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] bg-[size:44px_44px] opacity-15" />
          <div className="auth-orb pointer-events-none absolute -right-20 top-10 h-72 w-72 rounded-full bg-primary/35 blur-3xl" />
          <div className="auth-orb-delay pointer-events-none absolute bottom-0 left-6 h-56 w-56 rounded-full bg-secondary/35 blur-3xl" />
          <div className="pointer-events-none absolute right-[-2rem] top-1/3 h-px w-72 rotate-[-18deg] bg-gradient-to-r from-transparent via-sky-300/80 to-transparent" />
          <div className="pointer-events-none absolute left-[-3rem] bottom-20 h-px w-72 rotate-[12deg] bg-gradient-to-r from-transparent via-violet-300/70 to-transparent" />

          <div className="relative z-10 flex h-full flex-col justify-between gap-10">
            <div className="space-y-8">
              <Link className="inline-flex items-center gap-3" href={routes.home}>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-secondary text-white shadow-[0_12px_30px_rgba(59,130,246,0.28)]">
                  <Flame className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-base font-semibold text-white">PlaySharp</p>
                  <p className="text-xs uppercase tracking-[0.22em] text-slate-300/75">
                    Training Studio
                  </p>
                </div>
              </Link>

              <div className="space-y-5">
                <span className="inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium uppercase tracking-[0.26em] text-slate-200/90">
                  Premium performance access
                </span>

                <div className="space-y-4">
                  <h1 className="auth-display max-w-xl text-5xl leading-[0.92] text-white sm:text-6xl xl:text-7xl">
                    Capturing Moments, Creating Memories
                  </h1>
                  <p className="max-w-xl text-sm leading-7 text-slate-200/80 md:text-base">
                    A dark athletic entry point for athletes and learners who want sharp focus,
                    premium motion, and zero-friction access into the next session.
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-5">
              <div className="relative overflow-hidden rounded-[1.75rem] border border-white/10 bg-white/5 p-5 shadow-[0_18px_44px_rgba(2,6,23,0.42)]">
                <div className="pointer-events-none absolute inset-0 bg-[repeating-linear-gradient(-32deg,rgba(59,130,246,0.16)_0,rgba(59,130,246,0.16)_2px,transparent_2px,transparent_18px)] opacity-40" />
                <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-r from-primary/20 via-white/5 to-secondary/20 blur-2xl" />

                <div className="relative z-10 space-y-5">
                  <div className="flex items-center justify-between gap-3">
                    <p className="text-xs font-medium uppercase tracking-[0.22em] text-slate-300/70">
                      Motion preview
                    </p>
                    <span className="rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.18em] text-sky-100">
                      Live flow
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-3">
                    <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-3 py-4">
                      <p className="text-xl font-semibold text-white md:text-2xl">24/7</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-300/65">
                        access
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-3 py-4">
                      <p className="text-xl font-semibold text-white md:text-2xl">Fast</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-300/65">
                        entry
                      </p>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-slate-950/30 px-3 py-4">
                      <p className="text-xl font-semibold text-white md:text-2xl">Focus</p>
                      <p className="mt-1 text-[11px] uppercase tracking-[0.18em] text-slate-300/65">
                        mode
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="h-2 overflow-hidden rounded-full bg-white/10">
                      <div className="h-full w-2/3 rounded-full bg-gradient-to-r from-primary via-sky-400 to-secondary shadow-[0_0_28px_rgba(59,130,246,0.55)]" />
                    </div>
                    <p className="text-sm leading-relaxed text-slate-200/75">
                      Premium styling with focused motion keeps the auth experience aligned with the
                      rest of the studio.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {slideDots.map((dot) => {
                  const isActive = activeTab === 'register' ? dot.registerActive : dot.loginActive;

                  return (
                    <span
                      key={dot.id}
                      className={`h-2.5 rounded-full transition-all ${
                        isActive
                          ? 'w-9 bg-white shadow-[0_0_18px_rgba(255,255,255,0.35)]'
                          : 'w-2.5 bg-white/35'
                      }`}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        <section className="flex items-center justify-center bg-[#090d14] px-5 py-8 md:px-10 md:py-10">
          <div className="auth-form-enter w-full max-w-md rounded-[1.75rem] border border-white/10 bg-[linear-gradient(180deg,rgba(15,20,30,0.98),rgba(8,11,18,0.98))] p-6 shadow-[0_24px_80px_rgba(2,6,23,0.52)] md:p-8">
            <div className="space-y-5">
              <div className="inline-flex w-full rounded-full border border-white/10 bg-white/5 p-1">
                <Link
                  className={`flex-1 rounded-full px-4 py-2.5 text-center text-sm font-medium transition-all ${
                    activeTab === 'register'
                      ? 'bg-[#3B82F6] text-white shadow-[0_0_24px_rgba(59,130,246,0.35)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  href={registerHref}
                  aria-current={activeTab === 'register' ? 'page' : undefined}
                >
                  Register
                </Link>
                <Link
                  className={`flex-1 rounded-full px-4 py-2.5 text-center text-sm font-medium transition-all ${
                    activeTab === 'login'
                      ? 'bg-[#3B82F6] text-white shadow-[0_0_24px_rgba(59,130,246,0.35)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                  href={loginHref}
                  aria-current={activeTab === 'login' ? 'page' : undefined}
                >
                  Login
                </Link>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-medium uppercase tracking-[0.26em] text-slate-400">
                  {formEyebrow}
                </p>
                <div className="space-y-2">
                  <h2 className="auth-display text-4xl leading-none text-white md:text-5xl">
                    {formTitle}
                  </h2>
                  <p className="text-sm leading-7 text-slate-300 md:text-base">{formDescription}</p>
                </div>
              </div>
            </div>

            <div className="mt-5 inline-flex max-w-full items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-2 text-xs font-medium text-sky-200">
              {helper}
            </div>

            <div className="mt-6">{children}</div>

            <div className="mt-6 border-t border-white/10 pt-5">{footer}</div>
          </div>
        </section>
      </div>
    </div>
  );
}
