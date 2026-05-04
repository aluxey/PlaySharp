import { proxyAdminRequest } from '../proxy';

export async function POST(request: Request) {
  return proxyAdminRequest('/admin/questions', {
    method: 'POST',
    body: await request.json(),
  });
}
