import { handleAuthSessionRequest } from '../../../../lib/auth-route';

export async function POST(request: Request) {
  return handleAuthSessionRequest(request, 'login');
}
