// Общая схема заявки: валидируется и на клиенте, и в /api/register
import { emailError } from './email';

/** Не больше 3 форм каждого типа — итого до 6 */
export const MAX_PER_TYPE = 3;
export const MAX_FORMS = MAX_PER_TYPE * 2;

/** Сколько человек можно записать в одну группу (без руководителя) */
export const MAX_MEMBERS = 50;

/** Взнос, ₽: зритель платит фиксированно, спортсмен — за каждую заявленную форму,
 *  группа — за каждую форму каждого участника (руководитель не считается) */
export const SPECTATOR_FEE = 1000;
export const FORM_FEE = 1000;

export type Role = 'spectator' | 'athlete' | 'group';
export type FormType = 'empty' | 'weapon';

export const feeOf = (role: Role, formsCount: number, membersCount = 0) =>
  role === 'athlete' ? formsCount * FORM_FEE
  : role === 'group' ? formsCount * membersCount * FORM_FEE
  : SPECTATOR_FEE;

/** 6000 → «6 000 ₽» (неразрывные пробелы, без Intl — чтобы SSR и браузер совпадали) */
export const rub = (n: number) => String(n).replace(/\B(?=(\d{3})+$)/g, ' ') + ' ₽';

export interface PerformedForm {
  type: FormType;
  description: string;
}

export interface GroupMember {
  fullName: string;
  age: number;
}

export interface Registration {
  /** У группы — имя руководителя */
  fullName: string;
  role: Role;
  age?: number;
  email?: string;
  phone?: string;
  school?: string;
  experience?: string;
  forms?: PerformedForm[];
  /** Только у группы: кто выступает (без руководителя) */
  members?: GroupMember[];
  /** Сумма к оплате, ₽ — считается здесь, с клиента не принимается */
  amount: number;
}

export interface RegisterResult {
  paymentNeeded: boolean;
  paymentURL?: string;
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const validAge = (n: number) => Number.isInteger(n) && n >= 3 && n <= 120;

function parseForms(raw: unknown, errors: string[]): PerformedForm[] {
  const forms = Array.isArray(raw)
    ? raw.map((f: Record<string, unknown>) => ({
        type: (f?.type === 'weapon' ? 'weapon' : 'empty') as FormType,
        description: str(f?.description),
      }))
    : [];
  if (forms.length < 1 || forms.length > MAX_FORMS) errors.push('forms');
  if (forms.filter((f) => f.type === 'weapon').length > MAX_PER_TYPE) errors.push('forms');
  if (forms.filter((f) => f.type === 'empty').length > MAX_PER_TYPE) errors.push('forms');
  forms.forEach((f, i) => { if (!f.description) errors.push(`forms.${i}`); });
  return forms;
}

/** Возвращает нормализованную заявку или список ошибочных полей. */
export function parseRegistration(input: unknown):
  | { ok: true; data: Registration }
  | { ok: false; errors: string[] } {
  const raw = (input ?? {}) as Record<string, unknown>;
  const errors: string[] = [];

  const fullName = str(raw.fullName);
  if (!fullName) errors.push('fullName');

  const role: Role | null =
    raw.role === 'athlete' || raw.role === 'spectator' || raw.role === 'group' ? raw.role : null;
  if (!role) errors.push('role');

  const email = str(raw.email);
  if (emailError(email)) errors.push('email');
  const phone = str(raw.phone);

  if (role === 'group') {
    const school = str(raw.school);
    if (!school) errors.push('school');
    const forms = parseForms(raw.forms, errors);
    const members = Array.isArray(raw.members)
      ? raw.members.map((m: Record<string, unknown>) => ({ fullName: str(m?.fullName), age: Number(m?.age) }))
      : [];
    if (members.length < 1 || members.length > MAX_MEMBERS) errors.push('members');
    members.forEach((m, i) => {
      if (!m.fullName) errors.push(`members.${i}.fullName`);
      if (!validAge(m.age)) errors.push(`members.${i}.age`);
    });
    if (errors.length) return { ok: false, errors };
    return {
      ok: true,
      data: {
        fullName, role, email, phone, school, forms, members,
        amount: feeOf('group', forms.length, members.length),
      },
    };
  }

  if (role !== 'athlete') {
    return errors.length
      ? { ok: false, errors }
      : { ok: true, data: { fullName, role: 'spectator', email, phone, amount: SPECTATOR_FEE } };
  }

  const age = Number(raw.age);
  if (!validAge(age)) errors.push('age');

  const experience = str(raw.experience);
  if (!experience) errors.push('experience');

  const forms = parseForms(raw.forms, errors);

  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      fullName,
      role,
      age,
      email,
      phone,
      school: str(raw.school),
      experience,
      forms,
      amount: feeOf('athlete', forms.length),
    },
  };
}
