import type { Metadata, Viewport } from 'next';
import { Rubik } from 'next/font/google';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

// Ближайший к шрифту хэштегов и подписей на пресс-волле
const rubik = Rubik({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '700'],
  variable: '--font-rubik',
});

const description =
  'Фестиваль тайцзицюань «Легенды Тайцзи II» — 19 декабря 2026, Москва, Грандзал (м. Сокол). Регистрация зрителей и спортсменов: выступления с формами без оружия и с оружием. Организатор — Академия Цигун и Тайцзи Cheng Long.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Легенды Тайцзи II — фестиваль тайцзи в Москве 19 декабря 2026 | Регистрация',
  description,
  keywords: ['фестиваль тайцзи', 'тайцзицюань', 'соревнования по тайцзи', 'Легенды Тайцзи', 'Cheng Long', 'ушу', 'цигун'],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'ru_RU',
    url: '/',
    siteName: SITE_NAME,
    title: 'Легенды Тайцзи II — фестиваль тайцзи, 19 декабря, Москва',
    description: 'Регистрация зрителей и спортсменов открыта',
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: '#ffffff',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={rubik.variable}>
      <body>{children}</body>
    </html>
  );
}
