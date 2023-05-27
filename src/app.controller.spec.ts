import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('/page', () => {
    it('should return {"foo":"bar"}', () => {
      expect(appController.getPage()).toEqual({ foo: 'bar' });
    });
  });

  describe('/secret', () => {
    it('should return {"some":"secret"}', () => {
      expect(appController.getSecret()).toEqual({ some: 'secret' });
    });
  });

  describe('/page', () => {
    it('should return {"foo":"bar"}', () => {
      expect(appController.getPage()).toEqual({ foo: 'bar' });
    });
  });

  describe('/secret', () => {
    it('should return {"some":"secret"}', () => {
      expect(appController.getSecret()).toEqual({ some: 'secret' });
    });
  });
});
