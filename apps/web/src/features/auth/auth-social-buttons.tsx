'use client';

import { useToast } from '../../components';

function GoogleIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4" viewBox="0 0 24 24">
      <path
        d="M21.6 12.23c0-.68-.06-1.33-.17-1.95H12v3.69h5.39a4.62 4.62 0 0 1-2 3.04v2.52h3.24c1.9-1.75 2.97-4.34 2.97-7.3Z"
        fill="#4285F4"
      />
      <path
        d="M12 22c2.7 0 4.96-.9 6.61-2.45l-3.24-2.52c-.9.6-2.05.96-3.37.96-2.59 0-4.78-1.75-5.56-4.1H3.1v2.6A10 10 0 0 0 12 22Z"
        fill="#34A853"
      />
      <path
        d="M6.44 13.89A6 6 0 0 1 6.13 12c0-.66.11-1.3.31-1.89V7.5H3.1A10 10 0 0 0 2 12c0 1.61.39 3.14 1.1 4.5l3.34-2.61Z"
        fill="#FBBC04"
      />
      <path
        d="M12 5.97c1.47 0 2.8.5 3.84 1.47l2.88-2.88C16.95 2.91 14.7 2 12 2A10 10 0 0 0 3.1 7.5l3.34 2.61c.78-2.35 2.97-4.14 5.56-4.14Z"
        fill="#EA4335"
      />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg aria-hidden="true" className="h-4 w-4 fill-current" viewBox="0 0 24 24">
      <path d="M16.37 12.15c.02-1.94 1.58-2.87 1.65-2.91-.9-1.32-2.3-1.5-2.8-1.52-1.2-.13-2.34.71-2.95.71-.62 0-1.57-.69-2.58-.67-1.32.02-2.55.77-3.23 1.96-1.39 2.4-.35 5.94 1 7.9.67.96 1.46 2.03 2.5 2 .99-.04 1.37-.64 2.57-.64 1.2 0 1.53.64 2.59.62 1.08-.02 1.77-.97 2.43-1.94.76-1.1 1.08-2.16 1.09-2.21-.02 0-2.08-.8-2.06-3.2ZM14.5 6.5c.55-.67.92-1.6.82-2.53-.79.03-1.74.53-2.3 1.19-.5.57-.95 1.51-.83 2.4.88.07 1.77-.45 2.31-1.06Z" />
    </svg>
  );
}

type AuthSocialButtonsProps = {
  contextLabel: 'login' | 'register';
};

export function AuthSocialButtons({ contextLabel }: AuthSocialButtonsProps) {
  const { showToast } = useToast();

  function handleProviderClick(provider: 'Google' | 'Apple') {
    showToast({
      title: `${provider} ${contextLabel === 'login' ? 'sign-in' : 'sign-up'} coming soon`,
      description: 'Email and password are the active auth path for now.',
      tone: 'info',
    });
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 text-sm text-slate-500">
        <span className="h-px flex-1 bg-[#252c45]" />
        <span>{contextLabel === 'register' ? 'Or register with' : 'Or sign in with'}</span>
        <span className="h-px flex-1 bg-[#252c45]" />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#4a5165] bg-transparent px-4 py-3 text-lg font-medium text-white transition-colors hover:bg-white/5"
          type="button"
          onClick={() => handleProviderClick('Google')}
        >
          <GoogleIcon />
          <span>Google</span>
        </button>

        <button
          className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#4a5165] bg-transparent px-4 py-3 text-lg font-medium text-white transition-colors hover:bg-white/5"
          type="button"
          onClick={() => handleProviderClick('Apple')}
        >
          <AppleIcon />
          <span>Apple</span>
        </button>
      </div>
    </div>
  );
}
