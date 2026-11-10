import 'server-only';

// Авторизация через Directual — те же эндпоинты, что дёргает пакет directual-api
// (auth.login / auth.check / auth.logout), только на fetch, без axios.
// sessionID живёт в httpOnly-куке и в браузерный JS не попадает.

const API = 'https://api.directual.com/good/api';
export const SESSION_COOKIE = 'admin_session';
export const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 дней

export interface DirectualUser {
  username: string;
  role: string;
}

function appID(): string {
  const id = process.env.DIRECTUAL_APP_ID;
  if (!id) throw new Error('DIRECTUAL_APP_ID is not set');
  return id;
}

/** В Directual роли — строка через запятую: «admin,manager» */
export const isAdmin = (role: string | undefined) =>
  !!role && role.split(',').map((r) => r.trim()).includes('admin');

/** Логин/пароль → { sessionID, user }. Неверная пара — null. */
export async function login(username: string, password: string): Promise<{ sessionID: string; user: DirectualUser } | null> {
  const res = await fetch(`${API}/v5/auth?appID=${appID()}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ appID: appID(), provider: 'rest', username, password }),
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });
  // Directual на неверный пароль отвечает 4xx
  if (res.status >= 400 && res.status < 500) return null;
  if (!res.ok) throw new Error(`Directual auth HTTP ${res.status}`);

  const r = (await res.json().catch(() => ({})))?.result;
  if (!r?.token) return null;
  return { sessionID: r.token, user: { username: r.username, role: r.role ?? '' } };
}

/** Живая сессия → юзер, протухшая — null. Сетевые ошибки пробрасываются. */
export async function check(sessionID: string): Promise<DirectualUser | null> {
  const res = await fetch(`${API}/v4/auth/check?appID=${appID()}&sessionID=${encodeURIComponent(sessionID)}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });
  if (res.status >= 400 && res.status < 500) return null;
  if (!res.ok) throw new Error(`Directual auth/check HTTP ${res.status}`);

  // Ответ: { result: { result: true, token: { token, username, role, nid } } } — юзер лежит в token
  const r = (await res.json().catch(() => ({})))?.result;
  if (!r?.result) return null;
  const t = typeof r.token === 'object' && r.token ? r.token : r;
  return { username: t.username ?? '', role: t.role ?? '' };
}

export async function logout(sessionID: string): Promise<void> {
  await fetch(`${API}/v4/auth/logout?appID=${appID()}&sessionID=${encodeURIComponent(sessionID)}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  }).catch(() => {});
}
