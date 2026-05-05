import { handleLogoutRequest } from '../../../../lib/auth-route';

export async function POST(request: Request) {
  return handleLogoutRequest(request);
}
