// Правка заявки из админки: что можно менять и как это проверяется.
// Число форм и участников группы не меняем — от них зависит взнос, а сумма в Directual не пересчитывается
import { emailError } from './email';
import { MAX_PER_TYPE, type FormType, type GroupMember, type PerformedForm, type Role } from './registration';

export interface RequestEdit {
  fullName: string;
  email: string;
  phone: string;
  age?: number;
  school?: string;
  experience?: string;
  forms?: PerformedForm[];
  members?: GroupMember[];
}

const str = (v: unknown) => (typeof v === 'string' ? v.trim() : '');
const validAge = (n: number) => Number.isInteger(n) && n >= 3 && n <= 120;
const len = (v: unknown) => (Array.isArray(v) ? v.length : 0);

/** Проверяет правку против исходной заявки. Возвращает чистые поля или список ошибочных полей
 *  (те же ключи, что у формы регистрации: fullName, age, forms.0, members.1.age …) */
export function parseRequestEdit(raw: Record<string, unknown>, input: unknown):
  | { ok: true; data: RequestEdit }
  | { ok: false; errors: string[] } {
  const e = (input ?? {}) as Record<string, unknown>;
  const role = raw.role as Role;
  const errors: string[] = [];

  const data: RequestEdit = { fullName: str(e.fullName), email: str(e.email), phone: str(e.phone) };
  if (!data.fullName) errors.push('fullName');
  if (emailError(data.email)) errors.push('email');

  if (role === 'athlete') {
    data.age = Number(e.age);
    if (!validAge(data.age)) errors.push('age');
    data.experience = str(e.experience);
    if (!data.experience) errors.push('experience');
    data.school = str(e.school);
  }
  if (role === 'group') {
    data.school = str(e.school);
    if (!data.school) errors.push('school');
  }

  if (role === 'athlete' || role === 'group') {
    const forms = Array.isArray(e.forms)
      ? e.forms.map((f: Record<string, unknown>) => ({
          type: (f?.type === 'weapon' ? 'weapon' : 'empty') as FormType,
          description: str(f?.description),
        }))
      : [];
    if (forms.length !== len(raw.forms)) errors.push('forms');
    if (forms.filter((f) => f.type === 'weapon').length > MAX_PER_TYPE) errors.push('forms.weapon');
    if (forms.filter((f) => f.type === 'empty').length > MAX_PER_TYPE) errors.push('forms.empty');
    forms.forEach((f, i) => { if (!f.description) errors.push(`forms.${i}`); });
    data.forms = forms;
  }

  if (role === 'group') {
    const members = Array.isArray(e.members)
      ? e.members.map((m: Record<string, unknown>) => ({ fullName: str(m?.fullName), age: Number(m?.age) }))
      : [];
    if (members.length !== len(raw.members)) errors.push('members');
    members.forEach((m, i) => {
      if (!m.fullName) errors.push(`members.${i}.fullName`);
      if (!validAge(m.age)) errors.push(`members.${i}.age`);
    });
    data.members = members;
  }

  return errors.length ? { ok: false, errors } : { ok: true, data };
}
