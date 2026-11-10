import { NextResponse, type NextRequest } from 'next/server';
import { logout, SESSION_COOKIE } from '@/lib/directual-auth';

export async function POST(request: NextRequest) {
  const sessionID = request.cookies.get(SESSION_COOKIE)?.value;
  if (sessionID) await logout(sessionID);

  const res = NextResponse.json({ ok: true });
  res.cookies.set(SESSION_COOKIE, '', { httpOnly: true, maxAge: 0, path: '/' });
  return res;
}
