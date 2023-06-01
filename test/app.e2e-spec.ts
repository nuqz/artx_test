import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from './../src/app.module';
import { UsersService } from './../src/users/users.service';
import { ThrottlerService } from './../src/throttler/throttler.service';
import { RedisService } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let usersSvc: UsersService;
  let throttlerSvc: ThrottlerService;
  let redis: Redis;

  const cleanRedisKeys = async () => {
    return redis.keys('*').then((keys) => {
      if (keys.length > 0) return redis.del(keys);
      return 0;
    });
  };

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    usersSvc = app.get(UsersService);
    throttlerSvc = app.get(ThrottlerService);
    redis = app.get(RedisService).getClient();

    await cleanRedisKeys();

    await app.init();
  });

  it('/page (GET)', () => {
    return request(app.getHttpServer())
      .get('/page')
      .expect(HttpStatus.OK)
      .expect({ foo: 'bar' });
  });

  // TODO: following test cases of auth middleware should not be repeated
  // anywhere in the same way
  describe('when request comes without Authorization header', () => {
    it('/secret (GET)', () => {
      return request(app.getHttpServer())
        .get('/secret')
        .expect(HttpStatus.UNAUTHORIZED)
        .expect('"unauthorized"');
    });
  });

  describe('when request comes with invalid access token', () => {
    it('/secret (GET)', () => {
      return request(app.getHttpServer())
        .get('/secret')
        .set('Authorization', 'unknown_token')
        .expect(HttpStatus.UNAUTHORIZED)
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
          .expect(HttpStatus.OK)
          .expect({ some: 'secret' })
      );
    });
  });

  // TODO: following test cases of throttler guard should not be repeated
  // anywhere in the same way
  describe('when request limit is not reached', () => {
    it('/page (GET)', () => {
      return request(app.getHttpServer())
        .get('/page')
        .expect(HttpStatus.OK)
        .expect({ foo: 'bar' });
    });
  });

  describe('when request limit is reached', () => {
    it('/page (GET)', async () => {
      const key = throttlerSvc.generateKey({
        controllerName: 'AppController',
        handlerName: 'getPage',
        tracker: '::ffff:127.0.0.1',
      });

      await redis.hincrby(
        key,
        throttlerSvc.granulate(Date.now()).toString(),
        throttlerSvc.publicLimit,
      );

      return request(app.getHttpServer())
        .get('/page')
        .expect(HttpStatus.TOO_MANY_REQUESTS);
    });
  });
});
