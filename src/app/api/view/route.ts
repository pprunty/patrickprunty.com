import redis from '@/app/redis';
import commaNumber from 'comma-number';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');
  console.log("id:", id);

  if (!id) {
    return NextResponse.json(
      {
        error: {
          message: 'Missing "id" query',
          code: 'MISSING_ID',
        },
      },
      { status: 400 },
    );
  }

  // Increment or retrieve views from Redis
  if (url.searchParams.get('incr') != null) {
    console.log('Incrementing views for', id);
    const views = await redis.hincrby('views', id, 1);
    return NextResponse.json({
      id,
      views,
      viewsFormatted: commaNumber(views),
    });
  } else {
    const views = (await redis.hget('views', id)) ?? 0;
    console.log('views', views);
    return NextResponse.json({
      id,
      views,
      viewsFormatted: commaNumber(Number(views)),
    });
  }
}
