import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { UsersService } from '../users/users.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private usersService: UsersService) {}

  use(req: Request, res: Response, next: NextFunction) {
    const access_token = req.headers.authorization;
    if (access_token === undefined) {
      res.status(401).json('unauthorized');
      return;
    }

    this.usersService
      .findOneByToken(access_token)
      .then((user) => {
        if (user === null) {
          res.status(401).json('unauthorized');
          return;
        }

        next();
      })
      .catch((err) => {
        console.error('Unexpected error occured: ', err);
        res.status(500).json('unexpected server error');
      });
  }
}
