import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, TELEGRAM_CHAT } from '@/lib/site';
import BrandText from '../../brand-text';
import PayScreen from '../../pay-screen';

// Сюда платёжка возвращает спонсора после успешной оплаты. В поиск не пускаем
export const metadata: Metadata = {
  title: `Спасибо за поддержку — ${SITE_NAME}`,
  description: 'Спонсорский взнос получен. Спасибо, что поддерживаете фестиваль.',
  alternates: { canonical: '/sponsor/success' },
  robots: { index: false, follow: true },
};

export default function SponsorSuccess() {
  return (
    <PayScreen>
      <p className="pay-kicker">Оплата прошла</p>
      <h1><BrandText text="Теперь вы спонсор" /></h1>
      <p className="pay-lead">
        Спасибо за поддержку «{SITE_NAME}»! Благодаря вам фестиваль станет ярче.
        Организаторы свяжутся с&nbsp;вами, чтобы обсудить детали.
      </p>
      <a className="cta" href={TELEGRAM_CHAT} target="_blank" rel="noopener">Телеграм-чат фестиваля</a>
      <Link className="pay-home" href="/">На главную</Link>
    </PayScreen>
  );
}
