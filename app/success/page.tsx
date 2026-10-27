import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { HASHTAGS, ORGANIZER, SITE_NAME, TELEGRAM_CHAT } from '@/lib/site';
import logo from '@/assets/brand/logo.png';
import peoniesLeft from '@/assets/brand/peonies-left.png';
import peoniesRight from '@/assets/brand/peonies-right.png';
import BrandText from '../brand-text';
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
    <main className="hero thanks">
      <Image className="peonies peonies-l" src={peoniesLeft} alt="" priority sizes="(max-width: 760px) 64vw, 45vw" />
      <Image className="peonies peonies-r" src={peoniesRight} alt="" priority sizes="(max-width: 760px) 64vw, 45vw" />
      <p className="tag tag-l">{HASHTAGS[0]}</p>
      <p className="tag tag-r">{HASHTAGS[1]}</p>
      <div className="thanks-inner">
        <Image className="thanks-logo" src={logo} alt={ORGANIZER.name} priority sizes="120px" />
        <p className="thanks-kicker">Оплата прошла</p>
        <h1><BrandText text="До встречи на фестивале" /></h1>
        <p className="thanks-lead">
          Спасибо! Вы зарегистрированы на «{SITE_NAME}». Подтверждение и&nbsp;все детали отправили
          на&nbsp;почту — если письма нет, загляните в&nbsp;«Спам».
        </p>
        <div className="venue thanks-card">
          <VenueInfo />
        </div>
        <a className="cta" href={TELEGRAM_CHAT} target="_blank" rel="noopener">Телеграм-чат фестиваля</a>
        <Link className="thanks-home" href="/">На главную</Link>
      </div>
    </main>
  );
}
