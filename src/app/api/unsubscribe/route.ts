import { NextRequest, NextResponse } from 'next/server';
import redis from '@/app/redis';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json(
        { success: false, message: 'Invalid email format' },
        { status: 400 },
      );
    }

    // Check if email is in the subscribers list
    const isSubscribed = await redis.sismember('subscribers', email);

    if (!isSubscribed) {
      return NextResponse.json(
        {
          success: false,
          message: 'Email not found in subscribers list',
        },
        { status: 404 },
      );
    }

    // Remove email from the Redis subscribers set
    await redis.srem('subscribers', email);

    // Remove the timestamp entry
    await redis.hdel('subscriber_timestamps', email);

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully unsubscribed',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error in unsubscribe API:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
