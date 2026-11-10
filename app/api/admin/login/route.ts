import { NextResponse } from 'next/server';
import { isAdmin, login, logout, SESSION_COOKIE, SESSION_MAX_AGE } from '@/lib/directual-auth';

export async function POST(request: Request) {
  const { username, password } = await request.json().catch(() => ({}));
  if (typeof username !== 'string' || typeof password !== 'string' || !username.trim() || !password) {
    return NextResponse.json({ error: 'Введите логин и пароль' }, { status: 400 });
  }

  try {
    const session = await login(username.trim(), password);
    if (!session) {
      return NextResponse.json({ error: 'Неверный логин или пароль' }, { status: 401 });
    }
    // Пароль верный, но роли admin нет — сессию сразу гасим
    if (!isAdmin(session.user.role)) {
      await logout(session.sessionID);
      return NextResponse.json({ error: 'У этой учётки нет доступа к админке' }, { status: 403 });
    }

    const res = NextResponse.json({ ok: true });
    res.cookies.set(SESSION_COOKIE, session.sessionID, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_MAX_AGE,
      path: '/',
    });
    return res;
  } catch (e) {
    console.error('[admin/login]', e);
    return NextResponse.json({ error: 'Directual не отвечает, попробуйте ещё раз' }, { status: 502 });
  }
}
