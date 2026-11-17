import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, TELEGRAM_CHAT } from '@/lib/site';
import BrandText from '../brand-text';
import PaymentGate from '../payment-gate';
import PayScreen from '../pay-screen';
import VenueInfo from '../venue-info';

// Сюда ЮКасса возвращает после оплаты — и после отмены тоже (return_url один).
// Поэтому «успех» показываем, только когда Directual подтвердил заказ ?id=. В поиск не пускаем
export const metadata: Metadata = {
  title: `Оплата — ${SITE_NAME}`,
  description: 'Регистрация на фестиваль оплачена. Детали отправили на почту.',
  alternates: { canonical: '/success' },
  robots: { index: false, follow: true },
};

type Props = { searchParams: Promise<{ id?: string | string[] }> };

export default async function Success({ searchParams }: Props) {
  const { id } = await searchParams;
  return (
    <PayScreen>
      <PaymentGate id={typeof id === 'string' && id ? id : undefined} retryHref="/#reg">
        <p className="pay-kicker">Оплата прошла</p>
        <h1><BrandText text="До встречи на фестивале" /></h1>
        <p className="pay-lead">
          Спасибо! Вы зарегистрированы на «{SITE_NAME}». Подтверждение и&nbsp;все детали отправили
          на&nbsp;почту — если письма нет, загляните в&nbsp;«Спам».
        </p>
        <div className="venue pay-card">
          <VenueInfo />
        </div>
        <a className="cta" href={TELEGRAM_CHAT} target="_blank" rel="noopener">Телеграм-чат фестиваля</a>
        <Link className="pay-home" href="/">На главную</Link>
      </PaymentGate>
    </PayScreen>
  );
}
