import { proxyAdminRequest } from '../proxy';

export async function GET() {
  return proxyAdminRequest('/admin/export', {
    method: 'GET',
  });
}
