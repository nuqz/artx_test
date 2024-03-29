import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { User } from './user.entity';

@Module({
  exports: [TypeOrmModule],
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UsersService],
  controllers: [],
})
export class UsersModule {}
