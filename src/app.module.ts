import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'insecure_password',
      database: 'postgres',
      entities: [],
      synchronize: true, // WARN: Do not use in production!
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
