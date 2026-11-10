'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    setBusy(true);
    setError('');
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: f.get('username'), password: f.get('password') }),
      });
      if (res.ok) {
        router.replace('/admin');
        router.refresh();
        return;
      }
      setError((await res.json().catch(() => ({}))).error || 'Не получилось войти');
    } catch {
      setError('Нет связи с сервером');
    }
    setBusy(false);
  }

  return (
    <form onSubmit={onSubmit}>
      <div className="field">
        <label htmlFor="username">Логин</label>
        <input id="username" name="username" type="text" autoComplete="username" required autoFocus />
      </div>
      <div className="field">
        <label htmlFor="password">Пароль</label>
        <input id="password" name="password" type="password" autoComplete="current-password" required />
      </div>
      <p className="error-msg" role="alert">{error}</p>
      <button className="submit" type="submit" disabled={busy}>{busy ? 'Входим…' : 'Войти'}</button>
    </form>
  );
}
