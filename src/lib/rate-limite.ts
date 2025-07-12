import { NextRequest } from 'next/server';
import { Redis } from '@upstash/redis';
import { Ratelimit } from '@upstash/ratelimit';

export function getIp(req: NextRequest): string {
  const ip = (req.headers.get('x-forwarded-for') ?? '127.0.0.1').split(',')[0];
  return ip;
}

interface IRateLimitConfig {
  limit: number;
  duration: `${number} ${'s' | 'm' | 'h' | 'd'}`;
}

let redis: Redis;

if(process.env.NODE_ENV === 'production') {
  if(!process.env.REDIS_URL || !process.env.REDIS_TOKEN) {
    throw new Error('REDIS_URL and REDIS_TOKEN must be set in environment variables');
  }

  redis = new Redis({
    url: process.env.REDIS_URL,
    token: process.env.REDIS_TOKEN,
  });
}



export async function checkRateLimit(
  req: NextRequest,
  headers: Headers,
  cfg?: IRateLimitConfig,
): Promise<boolean> {
  const ip = getIp(req);

  const rateLimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(
      cfg?.limit || 200,
      cfg?.duration || '900 s',
    ),
  });

  const result = await rateLimit.limit(ip);

  headers.append('x-rateLimit-limit', String(result.limit));
  headers.append('x-rateLimit-remaining', String(result.remaining));

  if (!result.success) {
    return false;
  }

  return true;
}
