import 'server-only';
import { getData } from './directual-api';
import type { Registration, Role } from './registration';

/** Строка структуры applications, как её отдаёт эндпоинт getparticipants */
interface ApplicationRow {
  id: string;
  email?: string;
  /** JSON заявки строкой — то самое, что ушло с формы */
  data?: string;
  order_num?: string;
  sum?: number;
  isPaid?: boolean | string;
}

export interface Participant extends Omit<Registration, 'amount'> {
  id: string;
  orderNum: string;
  sum: number;
  isPaid: boolean;
}

function toParticipant(row: ApplicationRow): Participant {
  let reg: Partial<Registration> = {};
  try { reg = JSON.parse(row.data || '{}'); } catch { /* битый JSON — покажем то, что есть в строке */ }
  return {
    ...reg,
    id: row.id,
    fullName: reg.fullName || '—',
    role: reg.role === 'athlete' ? 'athlete' : 'spectator',
    email: reg.email || row.email,
    forms: Array.isArray(reg.forms) ? reg.forms : [],
    orderNum: row.order_num ?? '',
    sum: Number(row.sum) || 0,
    isPaid: row.isPaid === true || row.isPaid === 'true',
  };
}

/** Участники из Directual: type = athlete | spectator, isPaid = true | false; без параметра — все */
export async function getParticipants(type?: Role, isPaid?: boolean): Promise<Participant[]> {
  const { payload } = await getData<ApplicationRow>('applications', 'getparticipants', {
    type,
    isPaid: isPaid === undefined ? undefined : String(isPaid),
    pageSize: 1000,
  });
  return payload.map(toParticipant);
}
