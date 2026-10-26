import { NextResponse } from 'next/server';
import { submitRegistration } from '@/lib/directual';
import { parseRegistration } from '@/lib/registration';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = parseRegistration(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: 'validation', fields: parsed.errors }, { status: 400 });
  }

  try {
    return NextResponse.json(await submitRegistration(parsed.data));
  } catch (err) {
    console.error('[register]', err);
    return NextResponse.json({ error: 'upstream' }, { status: 502 });
  }
}
