import { handleLogoutRequest } from '../../../../lib/auth-route';

export async function POST() {
  return handleLogoutRequest();
}
