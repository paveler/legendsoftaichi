// Общая схема заявки: валидируется и на клиенте, и в /api/register
import { emailError } from './email';

/** Не больше 3 форм каждого типа — итого до 6 */
export const MAX_PER_TYPE = 3;
export const MAX_FORMS = MAX_PER_TYPE * 2;

/** Взнос, ₽: зритель платит фиксированно, спортсмен — за каждую заявленную форму */
export const SPECTATOR_FEE = 1000;
export const FORM_FEE = 1000;

export type Role = 'spectator' | 'athlete';
export type FormType = 'empty' | 'weapon';

export const feeOf = (role: Role, formsCount: number) =>
  role === 'athlete' ? formsCount * FORM_FEE : SPECTATOR_FEE;

/** 6000 → «6 000 ₽» (неразрывные пробелы, без Intl — чтобы SSR и браузер совпадали) */
export const rub = (n: number) => String(n).replace(/\B(?=(\d{3})+$)/g, ' ') + ' ₽';

export interface PerformedForm {
  type: FormType;
  description: string;
}

export interface Registration {
  fullName: string;
  role: Role;
  age?: number;
  email?: string;
  phone?: string;
  school?: string;
  experience?: string;
  forms?: PerformedForm[];
  /** Сумма к оплате, ₽ — считается здесь, с клиента не принимается */
  amount: number;
}

export interface RegisterResult {
  paymentNeeded: boolean;
  paymentURL?: string;
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');

/** Возвращает нормализованную заявку или список ошибочных полей. */
export function parseRegistration(input: unknown):
  | { ok: true; data: Registration }
  | { ok: false; errors: string[] } {
  const raw = (input ?? {}) as Record<string, unknown>;
  const errors: string[] = [];

  const fullName = str(raw.fullName);
  if (!fullName) errors.push('fullName');

  const role = raw.role === 'athlete' ? 'athlete' : raw.role === 'spectator' ? 'spectator' : null;
  if (!role) errors.push('role');

  const email = str(raw.email);
  if (emailError(email)) errors.push('email');
  const phone = str(raw.phone);

  if (role !== 'athlete') {
    return errors.length
      ? { ok: false, errors }
      : { ok: true, data: { fullName, role: 'spectator', email, phone, amount: SPECTATOR_FEE } };
  }

  const age = Number(raw.age);
  if (!Number.isInteger(age) || age < 3 || age > 120) errors.push('age');

  const experience = str(raw.experience);
  if (!experience) errors.push('experience');

  const forms = Array.isArray(raw.forms)
    ? raw.forms.map((f: Record<string, unknown>) => ({
        type: (f?.type === 'weapon' ? 'weapon' : 'empty') as FormType,
        description: str(f?.description),
      }))
    : [];
  if (forms.length < 1 || forms.length > MAX_FORMS) errors.push('forms');
  if (forms.filter((f) => f.type === 'weapon').length > MAX_PER_TYPE) errors.push('forms');
  if (forms.filter((f) => f.type === 'empty').length > MAX_PER_TYPE) errors.push('forms');
  forms.forEach((f, i) => { if (!f.description) errors.push(`forms.${i}`); });

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
