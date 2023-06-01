import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { RedisModule } from '../redis/redis.module';
import { ThrottlerService } from './throttler.service';

@Module({
  imports: [ConfigModule, RedisModule],
  providers: [ThrottlerService],
  exports: [ThrottlerService],
})
export class ThrottlerModule {}
