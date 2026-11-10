import Image from 'next/image';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import logo from '@/assets/brand/logo.png';
import { getAdmin } from '@/lib/admin-session';
import LogoutButton from './logout-button';
import SidebarNav from './sidebar-nav';

// Всё внутри (panel) — только для залогиненного админа. Проверка на сервере, на каждый запрос
export const dynamic = 'force-dynamic';

export default async function AdminPanel({ children }: { children: React.ReactNode }) {
  const admin = await getAdmin();
  if (!admin) redirect('/admin/login');

  return (
    <div className="adm">
      <aside className="adm-side">
        <Link href="/admin" className="adm-brand">
          <Image src={logo} alt="" width={40} height={40} />
          <span>
            <b>Легенды Тайцзи</b>
            <small>админка</small>
          </span>
        </Link>
        <SidebarNav />
        <div className="adm-me">
          <span className="adm-avatar" aria-hidden>{admin.username.slice(0, 1).toUpperCase()}</span>
          <span className="adm-name">{admin.username}</span>
          <LogoutButton />
        </div>
      </aside>
      <main className="adm-main">{children}</main>
    </div>
  );
}
