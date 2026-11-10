import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, TELEGRAM_CHAT } from '@/lib/site';
import BrandText from '../../brand-text';
import PayScreen from '../../pay-screen';

// Сюда платёжка возвращает спонсора, если оплата не прошла. В поиск не пускаем
export const metadata: Metadata = {
  title: `Оплата не прошла — ${SITE_NAME}`,
  description: 'Платёж не прошёл. Попробуйте ещё раз.',
  alternates: { canonical: '/sponsor/fail' },
  robots: { index: false, follow: true },
};

export default function SponsorFail() {
  return (
    <PayScreen>
      <h1><BrandText text="Оплата не прошла" /></h1>
      <p className="pay-lead">Платёж не прошёл или был отменён. Попробуйте ещё раз.</p>
      <div className="pay-actions">
        <Link className="cta" href="/sponsor">Попробовать ещё раз</Link>
        <a className="cta cta-ghost" href={TELEGRAM_CHAT} target="_blank" rel="noopener">Телеграм-чат</a>
      </div>
      <p className="pay-note">
        Если деньги списались, а подтверждения нет — напишите в&nbsp;телеграм&#8209;чат, разберёмся.
      </p>
    </PayScreen>
  );
}
