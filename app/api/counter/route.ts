import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  const biosCreated = await kv.get('refinements');
  const res = new NextResponse(JSON.stringify(biosCreated), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache',
      Expires: '0',
    },
  });

  return res;
}

export const revalidate = 0;
