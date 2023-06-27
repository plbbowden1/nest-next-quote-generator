import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Request } from 'express';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../entities';

@Injectable()
export class JwtStrategy extends PassportStrategy(
  Strategy,
  'jwt', //default value is 'jwt'
) {
  constructor(
    config: ConfigService,
    @InjectRepository(User)
    private quoteRepository: Repository<User>,
  ) {
    super({
      ignoreExpiration: false,
      secretOrKey: config.get<string>('JWT_SECRET'),
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          const token = request?.cookies?.jwt;
          if (!token) {
            return null;
          }
          return token;
        },
      ]),
    });
  }

  async validate(payload: { sub: number; email: string }) {
    const user = await this.quoteRepository.findOne({
      where: { id: payload.sub },
    });
    return user;
  }
}
