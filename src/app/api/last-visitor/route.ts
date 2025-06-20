// app/api/last-visitor/route.ts
import { NextRequest, NextResponse } from 'next/server';
import redis from '@/app/redis';

export async function GET(req: NextRequest) {
  // Get geolocation from Vercel's headers (available automatically)
  const country = req.headers.get('x-vercel-ip-country');
  const city = req.headers.get('x-vercel-ip-city');
  const region = req.headers.get('x-vercel-ip-country-region');

  // Fallback to CF headers if available
  const cfCountry = req.headers.get('cf-ipcountry');
  const cfCity = req.headers.get('cf-ipcity');

  // Use Vercel data first, then Cloudflare as fallback
  const locationCountry = country || cfCountry;
  const locationCity = city || cfCity;
  const locationRegion = region;

  // For testing: allow in development OR production
  if (locationCity && locationCountry) {
    const locationString = locationRegion
      ? `${locationCity}, ${locationRegion}, ${locationCountry}`
      : `${locationCity}, ${locationCountry}`;

    // Store the last visitor location with timestamp
    await redis.set('last-visitor-location', locationString);
    await redis.set('last-visitor-timestamp', Date.now());
  }

  // Retrieve current last visitor data
  const lastLocation = await redis.get('last-visitor-location');
  const lastTimestamp = await redis.get('last-visitor-timestamp');

  return NextResponse.json({
    lastLocation: lastLocation || 'Unknown',
    lastTimestamp: lastTimestamp ? Number(lastTimestamp) : null,
  });
}
