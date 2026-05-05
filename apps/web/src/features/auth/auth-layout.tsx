import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowUpRight, Zap } from 'lucide-react';

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
  footer?: ReactNode;
};

const slideDots: ReadonlyArray<{ id: number; registerActive: boolean; loginActive: boolean }> = [
  { id: 1, registerActive: true, loginActive: false },
  { id: 2, registerActive: false, loginActive: true },
  { id: 3, registerActive: false, loginActive: false },
];

export function AuthLayout({
  activeTab,
  nextPath,
  formDescription,
  helper,
  children,
  footer,
}: AuthLayoutProps) {
  const registerHref = buildRegisterRoute(nextPath);
  const loginHref = buildLoginRoute(nextPath);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,rgba(34,45,90,0.28),transparent_55%),#050914] px-3 py-3 sm:px-5 sm:py-5 md:px-8 md:py-8">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(120deg,rgba(255,255,255,0.03),transparent_34%)]" />

      <div className="auth-shell-enter relative mx-auto grid min-h-[calc(100vh-1.5rem)] max-w-[1100px] overflow-hidden rounded-[22px] border border-[#242b47] bg-[#060b17] shadow-[0_45px_120px_rgba(0,0,0,0.58)] xl:grid-cols-[0.94fr_1.06fr]">
        <aside className="relative overflow-hidden border-b border-[#293054] bg-[linear-gradient(166deg,#24135f_0%,#28196b_38%,#171f59_100%)] px-5 pb-8 pt-5 sm:px-8 sm:pb-10 sm:pt-7 xl:border-b-0 xl:border-r">
          <div className="auth-bubble-a pointer-events-none absolute -left-36 bottom-[-5.5rem] h-[24rem] w-[24rem] rounded-full bg-[#5f43cb]/38" />
          <div className="auth-bubble-b pointer-events-none absolute -left-14 bottom-[5.2rem] h-[22rem] w-[22rem] rounded-full bg-[#7453ea]/28" />
          <div className="auth-bubble-c pointer-events-none absolute right-[-7rem] top-[20%] h-[15.5rem] w-[15.5rem] rounded-full bg-[#6e8dff]/28" />

          <div className="auth-panel-enter relative z-10 flex h-full flex-col justify-between gap-10">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <Link className="inline-flex items-center gap-3" href={routes.home}>
                <span className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[linear-gradient(160deg,#5f67f6,#5a78ff)] text-white shadow-[0_12px_30px_rgba(39,59,184,0.42)]">
                  <Zap className="h-5 w-5" />
                </span>
                <span className="text-2xl font-semibold tracking-[-0.01em] text-white sm:text-3xl">
                  PlaySharp
                </span>
              </Link>

              <Link
                className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-sm text-slate-100 transition-colors hover:bg-white/10"
                href={routes.home}
              >
                <span>Back to website</span>
                <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="mt-auto space-y-3 pb-2">
              <h1 className="max-w-md text-[38px] font-semibold leading-tight tracking-tight text-white sm:text-[52px]">
                Capturing Moments,
              </h1>
              <p className="text-[32px] leading-none text-slate-300/68 sm:text-[46px]">
                Creating Memories
              </p>
              <div className="flex items-center gap-3 pt-5">
                {slideDots.map((dot) => {
                  const isActive = activeTab === 'register' ? dot.registerActive : dot.loginActive;

                  return (
                    <span
                      key={dot.id}
                      className={
                        isActive
                          ? 'h-2.5 w-7 rounded-full bg-white/90'
                          : 'h-2.5 w-2.5 rounded-full bg-white/45'
                      }
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </aside>

        <section className="flex items-center justify-center bg-[linear-gradient(180deg,#060913_0%,#040712_100%)] px-5 py-7 sm:px-8 sm:py-8 lg:px-14">
          <div className="auth-content-enter w-full max-w-[430px]">
            <div className="border-b border-[#1d2338] pb-5">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-base sm:text-xl">
                <Link
                  className={`relative pb-3 transition-colors ${
                    activeTab === 'register' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  href={registerHref}
                  aria-current={activeTab === 'register' ? 'page' : undefined}
                >
                  Create an account
                  {activeTab === 'register' ? (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#4f6dff]" />
                  ) : null}
                </Link>
                <Link
                  className={`relative pb-3 transition-colors ${
                    activeTab === 'login' ? 'text-white' : 'text-slate-500 hover:text-slate-300'
                  }`}
                  href={loginHref}
                  aria-current={activeTab === 'login' ? 'page' : undefined}
                >
                  Sign in
                  {activeTab === 'login' ? (
                    <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#4f6dff]" />
                  ) : null}
                </Link>
              </div>
            </div>

            <div className="pt-6">
              <p className="text-[18px] leading-relaxed text-slate-400">{formDescription}</p>
              <div className="mt-2 text-[18px] text-slate-300">{helper}</div>
            </div>

            <div className="mt-6">{children}</div>

            {footer ? <div className="mt-6 border-t border-[#1d2338] pt-6">{footer}</div> : null}
          </div>
        </section>
      </div>
    </div>
  );
}
