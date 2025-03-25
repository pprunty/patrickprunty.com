// app/api/viewers/route.ts
import { NextRequest, NextResponse } from 'next/server';
import redis from '@/app/redis';

export async function GET(req: NextRequest) {
  // Get the URL for the request
  const url = new URL(req.url);
  // Get the path from query params (e.g., '/' or '/blog/post-1')
  const path = url.searchParams.get('path') || '/';

  // Create a hash key that includes the path
  const redisHashKey = `unique-viewers:${path}`;

  // Retrieve the IP address from the x-forwarded-for header.
  // This header can contain multiple comma-separated IPs. We take the first one.
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = forwarded ? forwarded.split(',')[0] : null;

  // If an IP is found, increment the view count for that IP in our Redis hash.
  if (ip) {
    await redis.hincrby(redisHashKey, ip, 1);
  }

  // Retrieve all keys (i.e. unique IPs) from the hash for this specific path.
  const keys = await redis.hkeys(redisHashKey);
  const uniqueCount = keys.length;

  // Return the count as JSON.
  return NextResponse.json({ count: uniqueCount });
}
