// Controlers call fucntions from service classes to handle requests.

import {
  Controller,
  Post,
  Body,
  HttpStatus,
  HttpCode,
  Get,
  Res,
} from '@nestjs/common';
// import { Response } from 'express';
import type { Response } from 'express';
import { AuthService } from './auth.service';
import { AuthDto } from './dto';

@Controller('/api/auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @HttpCode(HttpStatus.OK)
  @Post('signin')
  async signin(@Body() dto: AuthDto, @Res() res: Response) {
    const { cookie } = await this.authService.signin(dto);
    res.setHeader('Set-Cookie', cookie);
    res.json('Successfully signed in.');
    return res;
  }

  @Post('signup')
  async signup(@Body() dto: AuthDto, @Res() res: Response) {
    const { cookie } = await this.authService.signup(dto);
    res.setHeader('Set-Cookie', cookie);
    res.json('Successfully signed up.');
    return res;
  }

  @Get('signout')
  signout(@Res({ passthrough: true }) res: Response) {
    res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
    res.send({
      message: 'Successfully signed out.',
      ok: true,
    });
    return res;
  }
}
