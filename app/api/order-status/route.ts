import { NextResponse } from 'next/server';
import { isOrderPaid } from '@/lib/order-status';

// GET /api/order-status?id=… → { isPaid } — опрашивается со страниц успеха
export async function GET(req: Request) {
  const id = new URL(req.url).searchParams.get('id')?.trim() ?? '';
  if (!/^[\w-]{1,64}$/.test(id)) return NextResponse.json({ error: 'bad id' }, { status: 400 });

  try {
    return NextResponse.json({ isPaid: await isOrderPaid(id) }, { headers: { 'Cache-Control': 'no-store' } });
  } catch (err) {
    console.error('[order-status]', err);
    return NextResponse.json({ error: 'upstream' }, { status: 502 });
  }
}
