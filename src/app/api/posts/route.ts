import { NextResponse } from 'next/server';
import { getAllPosts } from '@/__samwise/utils/getAllPosts';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const filterDrafts = process.env.NODE_ENV === 'production';
  const posts = await getAllPosts(filterDrafts);

  return NextResponse.json(posts);
}
