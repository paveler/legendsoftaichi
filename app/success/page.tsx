import type { Metadata } from 'next';
import Link from 'next/link';
import { SITE_NAME, TELEGRAM_CHAT } from '@/lib/site';
import BrandText from '../brand-text';
import PayScreen from '../pay-screen';
import VenueInfo from '../venue-info';

// Сюда платёжка возвращает после успешной оплаты. В поиск не пускаем
export const metadata: Metadata = {
  title: `Оплата прошла — ${SITE_NAME}`,
  description: 'Регистрация на фестиваль оплачена. Детали отправили на почту.',
  alternates: { canonical: '/success' },
  robots: { index: false, follow: true },
};

export default function Success() {
  return (
    <PayScreen>
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
    </PayScreen>
  );
}
