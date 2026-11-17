import 'server-only';

// Статус заказа для страниц возврата из платёжки. ЮКасса возвращает на один и тот же
// return_url и после оплаты, и после отмены — поэтому верить самому факту возврата нельзя,
// спрашиваем у Directual: GET orders/orderStatus?id= → один объект { id, isPaid }.
// Публичный эндпоинт, без сессии админа.

const API = 'https://api.directual.com/good/api/v5/data';

export async function isOrderPaid(id: string): Promise<boolean> {
  const appID = process.env.DIRECTUAL_APP_ID;
  if (!appID) throw new Error('DIRECTUAL_APP_ID is not set');

  const qs = new URLSearchParams({ appID, id });
  const res = await fetch(`${API}/orders/orderStatus?${qs}`, {
    cache: 'no-store',
    signal: AbortSignal.timeout(10_000),
  });
  if (!res.ok) throw new Error(`Directual orders/orderStatus HTTP ${res.status}`);

  const json = await res.json().catch(() => ({}));
  // объект может прийти в payload массивом или сам по себе
  const row = (Array.isArray(json?.payload) ? json.payload[0] : json?.payload ?? json) as
    | { isPaid?: boolean | string }
    | undefined;
  return row?.isPaid === true || row?.isPaid === 'true';
}
