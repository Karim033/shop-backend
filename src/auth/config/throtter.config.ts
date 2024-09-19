import { registerAs } from '@nestjs/config';
import { JwtModuleOptions } from '@nestjs/jwt';
import { ThrottlerModuleOptions } from '@nestjs/throttler';

export default registerAs('throttler', () => {
  const config = [
    {
      ttl: +process.env.THROTTLE_TTL * 1000,
      limit: +process.env.THROTTLER_LIMIT,
    },
  ] as const satisfies ThrottlerModuleOptions;
  return config;
});
