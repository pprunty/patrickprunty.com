import redis from '@/app/redis';
import postsData from '@/app/posts.json';
import commaNumber from 'comma-number';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const id = url.searchParams.get('id');

  if (!id || id === 'undefined') {
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

  // Find the post in posts.json as a fallback
  const post = postsData.posts.find((post) => post.slug === id);

  if (!post) {
    return NextResponse.json(
      {
        error: {
          message: 'Unknown post',
          code: 'UNKNOWN_POST',
        },
      },
      { status: 400 },
    );
  }

  // Check if the deployment is in the production environment
  const isProduction = process.env.VERCEL_ENV === 'production';

  // Increment or retrieve views from Redis only in production
  if (isProduction && url.searchParams.get('incr') != null) {
    const views = await redis.hincrby('views', id, 1);
    return NextResponse.json({
      ...post,
      views,
      viewsFormatted: commaNumber(views),
    });
  } else {
    const views = (await redis.hget('views', id)) ?? 0;
    return NextResponse.json({
      ...post,
      views,
      viewsFormatted: commaNumber(Number(views)),
    });
  }
}
