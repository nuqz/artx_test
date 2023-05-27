import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from './../src/users/users.service';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let usersSvc: UsersService;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    usersSvc = app.get(UsersService);
    await app.init();
  });

  it('/page (GET)', () => {
    return request(app.getHttpServer())
      .get('/page')
      .expect(200)
      .expect({ foo: 'bar' });
  });

  // TODO: following test cases of auth middleware should not be repeated
  // anywhere in the same way
  describe('when request comes without Authorization header', () => {
    it('/secret (GET)', () => {
      return request(app.getHttpServer())
        .get('/secret')
        .expect(401)
        .expect('"unauthorized"');
    });
  });

  describe('when request comes with invalid access token', () => {
    it('/secret (GET)', () => {
      return request(app.getHttpServer())
        .get('/secret')
        .set('Authorization', 'unknown_token')
        .expect(401)
        .expect('"unauthorized"');
    });
  });

  describe('when request comes with valid access token', () => {
    it('/secret (GET)', async () => {
      const user = await usersSvc.first();
      expect(user).not.toBeNull();

      return (
        request(app.getHttpServer())
          .get('/secret')
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .set('Authorization', user!.access_token)
          .expect(200)
          .expect({ some: 'secret' })
      );
    });
  });
});
