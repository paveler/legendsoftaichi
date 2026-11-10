import { NextResponse } from 'next/server';
import { submitRegistration } from '@/lib/directual';
import { SITE_URL } from '@/lib/site';
import { parseSponsorship } from '@/lib/sponsorship';

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = parseSponsorship(body);
  if (!parsed.ok) {
    return NextResponse.json({ error: 'validation', fields: parsed.errors }, { status: 400 });
  }

  try {
    return NextResponse.json(await submitRegistration({
      ...parsed.data,
      successURL: `${SITE_URL}/sponsor/success`,
      failURL: `${SITE_URL}/sponsor/fail`,
    }));
  } catch (err) {
    console.error('[sponsor]', err);
    return NextResponse.json({ error: 'upstream' }, { status: 502 });
  }
}
