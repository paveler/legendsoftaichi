import 'server-only';
import { getData } from './directual-api';
import type { Sponsorship } from './sponsorship';

/** Строка структуры sponsors, как её отдаёт эндпоинт getSponsors */
interface SponsorRow {
  id: string;
  /** JSON заявки строкой — то, что ушло с формы /sponsor */
  data?: string;
  order_num?: string;
  sum?: number;
}

export interface Sponsor {
  id: string;
  fullName: string;
  phone: string;
  orderNum: string;
  sum: number;
}

function toSponsor(row: SponsorRow): Sponsor {
  let s: Partial<Sponsorship> = {};
  try { s = JSON.parse(row.data || '{}'); } catch { /* битый JSON — покажем, что есть */ }
  return {
    id: row.id,
    fullName: s.fullName?.trim() || '—',
    phone: s.phone?.trim() ?? '',
    orderNum: row.order_num ?? '',
    sum: Number(row.sum ?? s.amount) || 0,
  };
}

export async function getSponsors(): Promise<Sponsor[]> {
  const { payload } = await getData<SponsorRow>('sponsors', 'getSponsors', { pageSize: 1000 });
  return payload.map(toSponsor);
}
