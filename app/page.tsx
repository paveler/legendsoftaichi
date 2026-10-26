import Image from 'next/image';
import { FORM_FEE, SPECTATOR_FEE } from '@/lib/registration';
import { EVENT_DATE, HASHTAGS, ORGANIZER, SITE_NAME, SITE_URL, TELEGRAM_CHAT, VENUE } from '@/lib/site';
import logo from '@/assets/brand/logo.png';
import peoniesLeft from '@/assets/brand/peonies-left.png';
import peoniesRight from '@/assets/brand/peonies-right.png';
import peonyRed from '@/assets/brand/peony-red.png';
import peonyRose from '@/assets/brand/peony-rose.png';
import BrandText from './brand-text';
import RegistrationForm from './registration-form';

// Разметка события для поисковиков
const eventJsonLd = {
  '@context': 'https://schema.org',
  '@type': 'SportsEvent',
  name: SITE_NAME,
  description: 'Фестиваль тайцзицюань: выступления спортсменов с формами без оружия и с оружием.',
  startDate: EVENT_DATE,
  eventStatus: 'https://schema.org/EventScheduled',
  eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
  image: `${SITE_URL}/opengraph-image.png`,
  url: SITE_URL,
  inLanguage: 'ru',
  location: {
    '@type': 'Place',
    name: VENUE.name,
    address: {
      '@type': 'PostalAddress',
      streetAddress: `${VENUE.street}, ${VENUE.details}`,
      addressLocality: VENUE.city,
      addressCountry: 'RU',
    },
  },
  organizer: { '@type': 'Organization', name: ORGANIZER.name, url: ORGANIZER.url },
  offers: [
    { name: 'Участие зрителем', price: SPECTATOR_FEE },
    { name: 'Участие спортсменом, за одну форму', price: FORM_FEE },
  ].map((o) => ({
    '@type': 'Offer',
    ...o,
    priceCurrency: 'RUB',
    url: `${SITE_URL}/#reg`,
    availability: 'https://schema.org/InStock',
  })),
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(eventJsonLd) }}
      />
      <header className="hero">
        {/* Композиция пресс-волла: кусты пионов по краям, всё остальное по центру */}
        <Image className="peonies peonies-l" src={peoniesLeft} alt="" priority sizes="(max-width: 760px) 64vw, 45vw" />
        <Image className="peonies peonies-r" src={peoniesRight} alt="" priority sizes="(max-width: 760px) 64vw, 45vw" />
        <p className="tag tag-l">{HASHTAGS[0]}</p>
        <p className="tag tag-r">{HASHTAGS[1]}</p>
        <div className="hero-inner">
          <h1>
            <img className="title" src="/brand/title.svg" width={4670} height={1100} alt="" />
            <span className="sr-only">Фестиваль «Легенды Тайцзи» II</span>
          </h1>
          <Image className="logo" src={logo} alt={ORGANIZER.name} priority sizes="240px" />
          <p className="slogan">
            <img src="/brand/slogan.svg" width={3550} height={500}
              alt="Пусть расцветают сто цветов, пусть соперничают сто школ" />
          </p>
          <img className="badge" src="/brand/badge.svg" width={2262} height={425} alt="百花齐放，百家争鸣" lang="zh" />
          <p className="date"><time dateTime={EVENT_DATE}>19 декабря 2026</time> · {VENUE.city}</p>
          <a className="cta" href="#reg">Регистрация</a>
        </div>
      </header>

      <section className="block venue" id="venue">
        <Image className="accent accent-r" src={peonyRed} alt="" sizes="(max-width: 760px) 50vw, 440px" />
        <div className="wrap">
          <h2><BrandText text="Где и когда" /></h2>
          <p className="venue-date"><time dateTime={EVENT_DATE}>19 декабря 2026</time></p>
          <address>
            <p className="venue-name">{VENUE.name}</p>
            <p>{VENUE.city}, {VENUE.street}</p>
            <p className="venue-note">{VENUE.details}</p>
          </address>
          <p className="venue-metro">
            <span className="metro">М</span> «{VENUE.metro}» — {VENUE.route.toLowerCase()}
          </p>
          <a className="cta cta-ghost" href={VENUE.mapUrl} target="_blank" rel="noopener">Открыть на карте</a>
        </div>
      </section>

      <section className="block reg" id="reg">
        <Image className="accent accent-l" src={peonyRose} alt="" sizes="(max-width: 760px) 50vw, 360px" />
        <div className="wrap">
          <RegistrationForm />
        </div>
      </section>

      <footer>
        <div className="foot-links">
          <a href={TELEGRAM_CHAT} target="_blank" rel="noopener">Телеграм-чат<br />Легенд Тайцзи</a>
          <a href={ORGANIZER.url} target="_blank" rel="noopener">Сайт академии<br /><b>taijipro.com</b></a>
        </div>
        <p className="foot-tags">{HASHTAGS.join('  ')}</p>
        <p>Организатор — {ORGANIZER.name}</p>
      </footer>
    </>
  );
}
