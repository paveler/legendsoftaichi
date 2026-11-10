'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ADMIN_NAV } from './nav';

export default function SidebarNav() {
  const path = usePathname();
  return (
    <nav className="adm-nav" aria-label="Разделы админки">
      {ADMIN_NAV.map((item) => {
        const active = path === item.href || path.startsWith(item.href + '/');
        return (
          <Link key={item.href} href={item.href} className={active ? 'active' : undefined} aria-current={active ? 'page' : undefined}>
            {item.title}
          </Link>
        );
      })}
    </nav>
  );
}
