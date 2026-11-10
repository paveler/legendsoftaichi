import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/site';
import './admin.css';

// Админка — не для поиска
export const metadata: Metadata = {
  title: `Админка — ${SITE_NAME}`,
  robots: { index: false, follow: false },
};

export default function AdminRoot({ children }: { children: React.ReactNode }) {
  return <div className="admin">{children}</div>;
}
