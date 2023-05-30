import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import {
  RedisModule as Redis,
  RedisModuleOptions,
} from '@liaoliaots/nestjs-redis';

@Module({
  imports: [
    Redis.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (
        configService: ConfigService,
      ): Promise<RedisModuleOptions> => {
        return {
          config: {
            host: configService.getOrThrow('REDIS_HOST'),
            port: configService.getOrThrow('REDIS_PORT'),
            password: configService.get('REDIS_PASSWORD'),
          },
        };
      },
    }),
  ],
})
export class RedisModule {}
