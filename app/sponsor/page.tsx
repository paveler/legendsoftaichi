import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';
import BrandText from '../brand-text';
import PayScreen from '../pay-screen';
import SponsorForm from './sponsor-form';

export const metadata: Metadata = {
  title: `Стать спонсором — ${SITE_NAME}`,
  description: 'Поддержите фестиваль тайцзицюань «Легенды Тайцзи II» — 19 декабря 2026, Москва.',
  alternates: { canonical: '/sponsor' },
};

export default function Sponsor() {
  return (
    <PayScreen>
      <p className="pay-kicker no-check">Стать спонсором фестиваля</p>
      <h1><BrandText text="Спонсорство" /></h1>
      <p className="pay-lead">
        Поддержите «{SITE_NAME}» — фестиваль, где встречаются школы и&nbsp;мастера тайцзи.
        Укажите имя и&nbsp;сумму, дальше — оплата картой.
      </p>
      <div className="pay-card sponsor-card">
        <SponsorForm />
      </div>
      <Link className="pay-home" href="/">На главную</Link>
    </PayScreen>
  );
}
