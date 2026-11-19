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
    role: reg.role === 'athlete' || reg.role === 'group' ? reg.role : 'spectator',
    email: reg.email || row.email,
    forms: Array.isArray(reg.forms) ? reg.forms : [],
    members: Array.isArray(reg.members) ? reg.members : [],
    orderNum: row.order_num ?? '',
    sum: Number(row.sum) || 0,
    isPaid: row.isPaid === true || row.isPaid === 'true',
  };
}

/** Заявки из Directual по роли (athlete | spectator | group), isPaid = true | false; без роли — все.
 *  Роль берём из JSON формы (data.role), а не из поля type в Directual: группы могут прийти
 *  с любым type, поэтому тянем все заявки одним запросом и раскладываем здесь. */
export async function getParticipants(role?: Role, isPaid?: boolean): Promise<Participant[]> {
  const { payload } = await getData<ApplicationRow>('applications', 'getparticipants', {
    isPaid: isPaid === undefined ? undefined : String(isPaid),
    pageSize: 1000,
  });
  const all = payload.map(toParticipant);
  return role ? all.filter((p) => p.role === role) : all;
}
