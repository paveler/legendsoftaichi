import 'server-only';
import { cookies } from 'next/headers';
import { SESSION_COOKIE } from './directual-auth';

// Фетчер данных Directual: GET /good/api/v5/data/{структура}/{эндпоинт}.
// Ходит от имени залогиненного админа — sessionID берётся из httpOnly-куки.

const API = 'https://api.directual.com/good/api/v5/data';

export interface DirectualPage<T> {
  payload: T[];
  pageInfo?: { page: number; pageSize: number; totalPage: number; tableSize: number };
}

export async function getData<T>(
  structure: string,
  endpoint: string,
  params: Record<string, string | number | undefined> = {},
): Promise<DirectualPage<T>> {
  const appID = process.env.DIRECTUAL_APP_ID;
  if (!appID) throw new Error('DIRECTUAL_APP_ID is not set');

  const qs = new URLSearchParams({ appID });
  const sessionID = (await cookies()).get(SESSION_COOKIE)?.value;
  if (sessionID) qs.set('sessionID', sessionID);
  for (const [k, v] of Object.entries(params)) if (v !== undefined) qs.set(k, String(v));

  const res = await fetch(`${API}/${structure}/${endpoint}?${qs}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Directual ${structure}/${endpoint} HTTP ${res.status}`);

  const json = await res.json().catch(() => ({}));
  return { payload: Array.isArray(json?.payload) ? json.payload : [], pageInfo: json?.pageInfo };
}

/** POST в эндпоинт структуры: тело уходит объектом-записью, Directual кладёт его в структуру */
export async function postData<T = unknown>(
  structure: string,
  endpoint: string,
  body: Record<string, unknown>,
): Promise<T> {
  const appID = process.env.DIRECTUAL_APP_ID;
  if (!appID) throw new Error('DIRECTUAL_APP_ID is not set');

  const qs = new URLSearchParams({ appID });
  const sessionID = (await cookies()).get(SESSION_COOKIE)?.value;
  if (sessionID) qs.set('sessionID', sessionID);

  const res = await fetch(`${API}/${structure}/${endpoint}?${qs}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });
  const json = await res.json().catch(() => ({}));
  if (!res.ok || json?.status === 'ERROR') {
    throw new Error(`Directual POST ${structure}/${endpoint} HTTP ${res.status} ${json?.msg ?? ''}`.trim());
  }
  return json as T;
}
