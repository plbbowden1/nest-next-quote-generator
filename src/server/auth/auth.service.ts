import { ForbiddenException, Injectable } from '@nestjs/common';
import { Repository, QueryFailedError } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import * as argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthDto } from './dto';
import { User } from './entities';
import cookie from 'cookie';

@Injectable() // NOTE: can accept objects
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwt: JwtService,
    private config: ConfigService,
  ) {}
  async signin(authDto: AuthDto) {
    const user = await this.userRepository.findOne({
      where: {
        email: authDto.email,
      },
    });

    if (!user) {
      throw new ForbiddenException('Email not found');
    }
    const pwMatches = await argon.verify(user.hash, authDto.password);

    if (!pwMatches) {
      throw new ForbiddenException('Incorrect password');
    }
    const cookie = await this.generateCookie(user.id, user.email);
    return { cookie };
  }

  async signup(dto: AuthDto) {
    const hash = await argon.hash(dto.password);

    try {
      const user = this.userRepository.create({
        email: dto.email,
        hash,
      });
      await this.userRepository.save(user);
      const cookie = await this.generateCookie(user.id, user.email);
      return { cookie };
    } catch (error) {
      if (error instanceof QueryFailedError) {
        throw new ForbiddenException('Email already in use.');
      }
      throw error;
    }
  }

  async generateCookie(userId: number, email: string): Promise<string> {
    const payload = {
      sub: userId,
      email,
    };
    const secret = this.config.get<string>('JWT_SECRET');
    const token = await this.jwt.signAsync(payload, {
      expiresIn: '15m',
      secret,
    });
    const serialisedCookie = cookie.serialize('jwt', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV !== 'development',
      sameSite: 'strict',
      maxAge: 900,
      path: '/',
    });
    return serialisedCookie;
  }
}
