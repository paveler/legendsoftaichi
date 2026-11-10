import 'server-only';
import { cookies } from 'next/headers';
import { check, isAdmin, SESSION_COOKIE, type DirectualUser } from './directual-auth';

/** Текущий админ по куке — или null (нет сессии, протухла, не админ). */
export async function getAdmin(): Promise<DirectualUser | null> {
  const sessionID = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!sessionID) return null;
  const user = await check(sessionID);
  return user && isAdmin(user.role) ? user : null;
}
