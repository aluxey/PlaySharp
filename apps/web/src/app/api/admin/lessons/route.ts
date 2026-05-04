import { proxyAdminRequest } from '../proxy';

export async function POST(request: Request) {
  return proxyAdminRequest('/admin/lessons', {
    method: 'POST',
    body: await request.json(),
  });
}
