import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { UsersService } from '../src/users/users.service';

import { faker } from '@faker-js/faker';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  const usersSvc = app.get(UsersService);

  const promises = [];
  for (let i = 0; i < 10; i++) {
    promises[i] = usersSvc.create(
      faker.person.firstName(),
      faker.string.uuid(),
    );
  }
  await Promise.all(promises);

  await app.close();
}

bootstrap();
