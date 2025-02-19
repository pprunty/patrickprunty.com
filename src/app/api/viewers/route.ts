// app/api/viewers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import redis from '@/app/redis';

export async function GET(req: NextRequest) {
  // Retrieve the IP address from the x-forwarded-for header.
  // This header can contain multiple comma-separated IPs. We take the first one.
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : null;

  // If an IP is found, increment the view count for that IP in our Redis hash.
  if (ip) {
    await redis.hincrby('unique-viewers', ip, 1);
  }

  // Retrieve all keys (i.e. unique IPs) from the hash.
  const keys = await redis.hkeys('unique-viewers');
  const uniqueCount = keys.length;

  // Return the count as JSON.
  return NextResponse.json({ count: uniqueCount });
}
