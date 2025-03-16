// app/api/subscribe/route.ts
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

    // Check if email is already in the subscribers list
    const isAlreadySubscribed = await redis.sismember('subscribers', email);

    if (isAlreadySubscribed) {
      return NextResponse.json(
        {
          success: true,
          message: 'Email already subscribed',
          alreadySubscribed: true,
        },
        { status: 200 },
      );
    }

    // Add email to the Redis subscribers set
    await redis.sadd('subscribers', email);

    // Store the timestamp of when they subscribed
    await redis.hset('subscriber_timestamps', {
      [email]: Date.now(),
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Successfully subscribed',
      },
      { status: 200 },
    );
  } catch (error) {
    console.error('Error in subscribe API:', error);
    return NextResponse.json(
      { success: false, message: 'Server error' },
      { status: 500 },
    );
  }
}
