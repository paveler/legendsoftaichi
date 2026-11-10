'use client';

import { useRouter } from 'next/navigation';

export default function LogoutButton() {
  const router = useRouter();
  async function onClick() {
    await fetch('/api/admin/logout', { method: 'POST' }).catch(() => {});
    router.replace('/admin/login');
    router.refresh();
  }
  return <button className="admin-logout" type="button" onClick={onClick}>Выйти</button>;
}
