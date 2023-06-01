import { Controller, Get, SetMetadata, UseGuards } from '@nestjs/common';
import { ThrottlerGuard } from './throttler/throttler.guard';

@Controller()
@UseGuards(ThrottlerGuard)
export class AppController {
  @Get('/page')
  getPage() {
    return { foo: 'bar' };
  }

  @Get('/secret')
  @SetMetadata('isPrivate', true)
  getSecret() {
    return { some: 'secret' };
  }
}
