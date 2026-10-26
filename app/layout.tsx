import type { Metadata } from 'next';
import { Cormorant_Garamond, Manrope, Noto_Serif_SC } from 'next/font/google';
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

export const metadata: Metadata = {
  metadataBase: new URL('https://legendsoftaichi.ru'),
  title: 'Легенды Тайцзи II — регистрация',
  description:
    'Фестиваль «Легенды Тайцзи II» — 19 декабря. Регистрация зрителей и спортсменов. Организатор — Академия Цигун и Тайцзи Cheng Long.',
  openGraph: {
    title: 'Легенды Тайцзи II',
    description: 'Фестиваль тайцзи · 19 декабря · Регистрация открыта',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ru" className={`${cormorant.variable} ${manrope.variable} ${notoSC.variable}`}>
      <body>{children}</body>
    </html>
  );
}
