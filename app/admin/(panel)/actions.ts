'use server';

import { getAdmin } from '@/lib/admin-session';
import { postData } from '@/lib/directual-api';

// POST-эндпоинт структуры actions в Directual: { action, payload } → сценарий на стороне Directual
const ACTIONS_ENDPOINT = 'post';

async function sendAction(action: string, payload: Record<string, unknown>) {
  if (!(await getAdmin())) throw new Error('Нет доступа');
  await postData('actions', ACTIONS_ENDPOINT, { action, payload });
}

/** Удалить заявку (неоплаченную) по id */
export async function deleteRequest(id: string): Promise<{ ok: boolean }> {
  try {
    await sendAction('delete_request', { id });
    return { ok: true };
  } catch (e) {
    console.error('[admin/deleteRequest]', e);
    return { ok: false };
  }
}
