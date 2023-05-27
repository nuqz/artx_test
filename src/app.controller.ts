import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/page')
  getPage() {
    return { foo: 'bar' };
  }

  @Get('/secret')
  getSecret() {
    return { some: 'secret' };
  }
}
