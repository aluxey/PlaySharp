export type AuthenticatedUser = {
  id: string;
  email: string;
  role: 'user' | 'admin';
  plan: 'free' | 'premium';
};

export type RequestWithAuthenticatedUser = {
  headers: Record<string, string | string[] | undefined>;
  user?: AuthenticatedUser;
};
