import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  @Get('/page')
  getPage() {
    return { foo: 'bar' };
  }

  @Get('/secret')
  getSecret() {
    return { some: 'secret' };
  }
}
