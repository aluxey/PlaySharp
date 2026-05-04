import { proxyAdminRequest } from '../../proxy';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return proxyAdminRequest(`/admin/questions/${id}`, {
    method: 'PATCH',
    body: await request.json(),
  });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  return proxyAdminRequest(`/admin/questions/${id}`, {
    method: 'DELETE',
  });
}
