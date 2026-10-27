import { EVENT_DATE, VENUE } from '@/lib/site';

// Дата, адрес и как добраться — на лендинге и на странице после оплаты. Стили — внутри .venue
export default function VenueInfo() {
  return (
    <>
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
    </>
  );
}
