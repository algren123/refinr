import { kv } from '@vercel/kv';
import { NextResponse } from 'next/server';

export async function GET() {
  const instaBiosCreated = await kv.get('biocounter');
  const res = new NextResponse(JSON.stringify(instaBiosCreated), {
    status: 200, // HTTP status code
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
