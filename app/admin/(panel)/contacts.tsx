import type { Participant } from '@/lib/participants';

export default function Contacts({ p }: { p: Pick<Participant, 'email' | 'phone'> }) {
  return (
    <div className="adm-contacts">
      {p.email && <a href={`mailto:${p.email}`}>{p.email}</a>}
      {p.phone && <a href={`tel:${p.phone.replace(/[^\d+]/g, '')}`}>{p.phone}</a>}
    </div>
  );
}
