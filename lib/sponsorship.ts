// Спонсорский взнос: валидируется и на клиенте, и в /api/sponsor. Уходит на тот же вебхук, что и регистрация
import { rub } from './registration';

export const SPONSOR_MIN = 1000;
export const SPONSOR_DEFAULT = 50_000;
/** Быстрые суммы в форме */
export const SPONSOR_PRESETS = [50_000, 100_000, 200_000];

export interface Sponsorship {
  fullName: string;
  phone: string;
  role: 'sponsor';
  amount: number;
  /** Куда платёжке вернуть человека — у спонсоров свои страницы */
  successURL?: string;
  failURL?: string;
}

/** «50 000» / «50000 ₽» → 50000; мусор → NaN */
export const parseAmount = (v: unknown) =>
  typeof v === 'number' ? v : Number(String(v ?? '').replace(/[^\d]/g, '') || NaN);

export function amountError(amount: number): string | null {
  if (!Number.isFinite(amount) || amount <= 0) return 'Укажите сумму';
  if (!Number.isInteger(amount)) return 'Сумма — целое число рублей';
  if (amount < SPONSOR_MIN) return `Минимальная сумма — ${rub(SPONSOR_MIN)}`;
  return null;
}

/** Что не так с телефоном — или null. Формат не навязываем, нужны хотя бы 10 цифр */
export function phoneError(raw: string): string | null {
  const digits = raw.replace(/\D/g, '');
  if (!digits) return 'Укажите телефон — по нему свяжемся';
  if (digits.length < 10) return 'Номер короткий — проверьте, все ли цифры на месте';
  if (digits.length > 15) return 'Слишком много цифр — проверьте номер';
  return null;
}

export function parseSponsorship(input: unknown):
  | { ok: true; data: Sponsorship }
  | { ok: false; errors: string[] } {
  const raw = (input ?? {}) as Record<string, unknown>;
  const errors: string[] = [];
  const fullName = typeof raw.fullName === 'string' ? raw.fullName.trim() : '';
  if (!fullName) errors.push('fullName');
  const phone = typeof raw.phone === 'string' ? raw.phone.trim() : '';
  if (phoneError(phone)) errors.push('phone');
  const amount = parseAmount(raw.amount);
  if (amountError(amount)) errors.push('amount');
  return errors.length ? { ok: false, errors } : { ok: true, data: { fullName, phone, role: 'sponsor', amount } };
}
