import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  create(username: string, access_token: string): Promise<User> {
    const user = this.usersRepository.create({
      username,
      access_token,
    });
    return this.usersRepository.save(user);
  }

  findOneByToken(access_token: string): Promise<User | null> {
    return this.usersRepository.findOneBy({ access_token });
  }

  first(): Promise<User | null> {
    return this.usersRepository.find({ take: 1 }).then((users) => users[0]);
  }
}
