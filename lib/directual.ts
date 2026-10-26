import 'server-only';
import type { RegisterResult, Registration } from './registration';

/** Шлёт заявку в вебхук Directual и приводит ответ к { paymentNeeded, paymentURL }. */
export async function submitRegistration(data: Registration): Promise<RegisterResult> {
  const url = process.env.DIRECTUAL_REGISTER_WEBHOOK;
  if (!url) throw new Error('DIRECTUAL_REGISTER_WEBHOOK is not set');

  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
    cache: 'no-store',
    signal: AbortSignal.timeout(15_000),
  });
  if (!res.ok) throw new Error(`Directual webhook HTTP ${res.status}`);

  const json = await res.json().catch(() => ({}));
  // Directual может отдать поля в корне или обернуть в result
  const r = (json?.result ?? json ?? {}) as Record<string, unknown>;
  const paymentNeeded = r.paymentNeeded === true || r.paymentNeeded === 'true';
  const paymentURL = typeof r.paymentURL === 'string' && r.paymentURL ? r.paymentURL : undefined;

  if (paymentNeeded && !paymentURL) throw new Error('paymentNeeded without paymentURL');
  return { paymentNeeded, paymentURL };
}
