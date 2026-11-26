import 'server-only';
import { getData, postData } from './directual-api';
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
  /** Заявка как есть (распарсенный data) — основа для правки, чтобы не потерять незнакомые поля */
  raw: Record<string, unknown>;
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
    raw: reg as Record<string, unknown>,
  };
}

/** Заявки из Directual: type = athlete | spectator | group (обязателен — без него эндпоинт
 *  ничего не отдаёт), isPaid = true | false; без isPaid — все. */
export async function getParticipants(type: Role, isPaid?: boolean): Promise<Participant[]> {
  const { payload } = await getData<ApplicationRow>('applications', 'getparticipants', {
    type,
    isPaid: isPaid === undefined ? undefined : String(isPaid),
    pageSize: 1000,
  });
  return payload.map(toParticipant);
}

/** Перезаписать JSON заявки: POST в тот же getparticipants, на запись открыты только id и data */
export async function saveParticipantData(id: string, data: Record<string, unknown>): Promise<void> {
  await postData('applications', 'getparticipants', { id, data: JSON.stringify(data) });
}
