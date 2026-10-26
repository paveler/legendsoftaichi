import type { Metadata, Viewport } from 'next';
import { Cormorant_Garamond, Manrope, Noto_Serif_SC } from 'next/font/google';
import { SITE_NAME, SITE_URL } from '@/lib/site';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin', 'cyrillic'],
  weight: ['400', '500', '600'],
  variable: '--font-cormorant',
});
const manrope = Manrope({
  subsets: ['latin', 'cyrillic'],
  weight: ['300', '400', '500', '600'],
  variable: '--font-manrope',
});
// CJK-шрифт огромный — не прелоадим, нужен для пары иероглифов
const notoSC = Noto_Serif_SC({
  weight: ['400', '600'],
  variable: '--font-noto-sc',
  preload: false,
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
  themeColor: '#f4efe4',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${manrope.variable} ${notoSC.variable}`}>
      <body>{children}</body>
    </html>
  );
}
