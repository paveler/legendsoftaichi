// Общая схема заявки: валидируется и на клиенте, и в /api/register

export const MAX_FORMS = 6;
export const MAX_WEAPON = 3;

export type Role = 'spectator' | 'athlete';
export type FormType = 'empty' | 'weapon';

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
}

export interface RegisterResult {
  paymentNeeded: boolean;
  paymentURL?: string;
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
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

  if (role !== 'athlete') {
    return errors.length ? { ok: false, errors } : { ok: true, data: { fullName, role: 'spectator' } };
  }

  const age = Number(raw.age);
  if (!Number.isInteger(age) || age < 3 || age > 120) errors.push('age');

  const email = str(raw.email);
  if (!EMAIL_RE.test(email)) errors.push('email');

  const experience = str(raw.experience);
  if (!experience) errors.push('experience');

  const forms = Array.isArray(raw.forms)
    ? raw.forms.map((f: Record<string, unknown>) => ({
        type: (f?.type === 'weapon' ? 'weapon' : 'empty') as FormType,
        description: str(f?.description),
      }))
    : [];
  if (forms.length < 1 || forms.length > MAX_FORMS) errors.push('forms');
  if (forms.filter((f) => f.type === 'weapon').length > MAX_WEAPON) errors.push('forms');
  forms.forEach((f, i) => { if (!f.description) errors.push(`forms.${i}`); });

  if (errors.length) return { ok: false, errors };
  return {
    ok: true,
    data: {
      fullName,
      role,
      age,
      email,
      phone: str(raw.phone),
      school: str(raw.school),
      experience,
      forms,
    },
  };
}
