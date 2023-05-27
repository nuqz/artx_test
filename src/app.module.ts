import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { AppController } from './app.controller';

import { DatabaseModule } from './database.module';
import { UsersModule } from './users/users.module';
import { AuthMiddleware } from './middleware/auth.middleware';
import { UsersService } from './users/users.service';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule, UsersModule],
  controllers: [AppController],
  providers: [UsersService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes('/secret');
  }
}
