import { NextResponse } from 'next/server';
import { getAllPosts } from '@/__samwise/utils/getAllPosts';

export const dynamic = 'force-dynamic';

export async function GET() {
  return NextResponse.json(await getAllPosts());
}
