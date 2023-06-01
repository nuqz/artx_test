import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRedis } from '@liaoliaots/nestjs-redis';
import Redis from 'ioredis';
import { Md5 } from 'ts-md5';

const msPerSec = 1000;
const granularity = 60;

type KeyData = {
  controllerName: string;
  handlerName: string;
  tracker: string;
};

@Injectable()
export class ThrottlerService {
  readonly publicLimit: number;
  readonly privateLimit: number;
  readonly ttl: number;
  private granulesPerTTL: number;

  constructor(
    configService: ConfigService,
    @InjectRedis() private redis: Redis,
  ) {
    this.publicLimit = configService.get('THROTTLER_PUBLIC_LIMIT') ?? 100;
    this.privateLimit = configService.get('THROTTLER_PRIVATE_LIMIT') ?? 200;
    this.ttl = configService.get('THROTTLER_TTL') ?? 3600;
    this.granulesPerTTL = Math.ceil(this.ttl / granularity);
  }

  granulate(ms: number): number {
    return Math.floor(ms / msPerSec / granularity);
  }

  ungranulate(granule: number): Date {
    return new Date(granule * granularity * msPerSec);
  }

  private registerRequest(key: string, aggGranule: number) {
    // TODO: catch and process errors here
    this.redis.hincrby(key, aggGranule.toString(), 1);
  }

  private async getCurrentWindow(
    key: string,
    aggGranule: number,
  ): Promise<Map<number, number>> {
    const granulesAgo = aggGranule - this.granulesPerTTL;
    return await this.redis.hgetall(key).then((result) => {
      const parsed = Object.entries(result).reduce(
        (prev, [keyStr, valueStr]) =>
          prev.set(parseInt(keyStr), parseInt(valueStr)),
        new Map<number, number>(),
      );

      for (const key of parsed.keys())
        if (key < granulesAgo) parsed.delete(key);

      return parsed;
    });
  }

  private getWindowRequestsCount(window: Map<number, number>): number {
    let count = 0;
    for (const agg of window.values()) count += agg;
    return count;
  }

  private getAvailableAt(window: Map<number, number>, rateLimit: number): Date {
    const keys = [] as number[];
    for (const k of window.keys()) keys.push(k);

    let left = keys
      .sort()
      .find(
        (_k, i) =>
          keys.slice(i).reduce((sum, k) => sum + (window.get(k) ?? 0), 0) <
          rateLimit,
      );
    if (left === undefined) left = this.granulate(Date.now());
    return this.ungranulate(left + this.granulesPerTTL);
  }

  generateKey(keyData: KeyData): string {
    const prefix = `${keyData.controllerName}-${keyData.handlerName}`;
    return Md5.hashStr(`${prefix}-${keyData.tracker}`);
  }

  async filter(key: string, isPrivate: boolean): Promise<boolean> {
    let rateLimit = this.publicLimit;
    if (isPrivate) rateLimit = this.privateLimit;

    const aggGranule = this.granulate(Date.now());
    const window = await this.getCurrentWindow(key, aggGranule);
    const windowRequests = this.getWindowRequestsCount(window);

    if (windowRequests >= rateLimit) {
      const availableAt = this.getAvailableAt(window, rateLimit);
      throw new HttpException(
        `Request limit reached, try again at ${availableAt.toLocaleString()}.`,
        HttpStatus.TOO_MANY_REQUESTS,
      );
    }

    this.registerRequest(key, aggGranule);
    return true;
  }
}
