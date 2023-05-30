import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';

import { DatabaseModule } from './database.module';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { UsersService } from './users/users.service';
import { RedisModule } from './redis/redis.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule,
    UsersModule,
    RedisModule,
  ],
  controllers: [AppController],
  providers: [UsersService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/secret');
  }
}
