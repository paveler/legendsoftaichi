import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, TELEGRAM_CHAT } from '@/lib/site';
import BrandText from '../brand-text';
import PayScreen from '../pay-screen';

// Сюда платёжка возвращает, если оплата не прошла или её отменили. В поиск не пускаем
export const metadata: Metadata = {
  title: `Оплата не прошла — ${SITE_NAME}`,
  description: 'Платёж не прошёл. Попробуйте зарегистрироваться и оплатить ещё раз.',
  alternates: { canonical: '/fail' },
  robots: { index: false, follow: true },
};

export default function Fail() {
  return (
    <PayScreen>
      <h1><BrandText text="Оплата не прошла" /></h1>
      <p className="pay-lead">
        Платёж не прошёл или был отменён. Попробуйте ещё раз — заполните форму регистрации заново.
      </p>
      <div className="pay-actions">
        <Link className="cta" href="/#reg">Попробовать ещё раз</Link>
        <a className="cta cta-ghost" href={TELEGRAM_CHAT} target="_blank" rel="noopener">Телеграм-чат</a>
      </div>
      <p className="pay-note">
        Если деньги списались, а письма с подтверждением нет — напишите в&nbsp;телеграм&#8209;чат, разберёмся.
      </p>
    </PayScreen>
  );
}
