import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, TELEGRAM_CHAT } from '@/lib/site';
import BrandText from '../../brand-text';
import PaymentGate from '../../payment-gate';
import PayScreen from '../../pay-screen';

// Сюда ЮКасса возвращает спонсора — и после оплаты, и после отмены.
// «Успех» показываем, только когда Directual подтвердил заказ ?id=. В поиск не пускаем
export const metadata: Metadata = {
  title: `Оплата — ${SITE_NAME}`,
  description: 'Спонсорский взнос получен. Спасибо, что поддерживаете фестиваль.',
  alternates: { canonical: '/sponsor/success' },
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ id?: string | string[] }> };

export default async function SponsorSuccess({ searchParams }: Props) {
  const { id } = await searchParams;
  return (
    <PayScreen>
      <PaymentGate id={typeof id === 'string' && id ? id : undefined} retryHref="/sponsor">
        <p className="pay-kicker">Оплата прошла</p>
        <h1><BrandText text="Теперь вы спонсор" /></h1>
        <p className="pay-lead">
          Спасибо за поддержку «{SITE_NAME}»! Благодаря вам фестиваль станет ярче.
          Организаторы свяжутся с&nbsp;вами, чтобы обсудить детали.
        </p>
        <a className="cta" href={TELEGRAM_CHAT} target="_blank" rel="noopener">Телеграм-чат фестиваля</a>
        <Link className="pay-home" href="/">На главную</Link>
      </PaymentGate>
    </PayScreen>
  );
}
