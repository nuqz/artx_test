import { Reflector } from '@nestjs/core';
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Observable } from 'rxjs';
import { ThrottlerService } from './throttler.service';

@Injectable()
export class ThrottlerGuard implements CanActivate {
  constructor(
    private throttlerService: ThrottlerService,
    private reflector: Reflector,
  ) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const handler = context.getHandler();
    const isPrivate = this.reflector.get<boolean>('isPrivate', handler);

    const req = context.switchToHttp().getRequest() as Record<string, any>;
    const key = this.throttlerService.generateKey({
      controllerName: context.getClass().name,
      handlerName: handler.name,
      tracker: isPrivate ? req.headers.authorization : req.ip,
    });

    return this.throttlerService.filter(key, isPrivate);
  }
}
