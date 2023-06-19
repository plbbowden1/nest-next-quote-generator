import { Controller, Get, Param, Render } from '@nestjs/common';
import { UseInterceptors } from '@nestjs/common';
import { ParamsInterceptor } from './params.interceptor';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('/')
  @Render('index')
  @UseInterceptors(ParamsInterceptor)
  home() {
    return {};
  }

  @Get('id=:id')
  @Render('[id]')
  @UseInterceptors(ParamsInterceptor)
  public quote(@Param('id') id: string) {
    return { id };
  }

  @Get('/login')
  @Render('login')
  @UseInterceptors(ParamsInterceptor)
  login() {
    return {};
  }

  @Get('/signup')
  @Render('signup')
  @UseInterceptors(ParamsInterceptor)
  signup() {
    return {};
  }

  @Get('/dashboard')
  @Render('dashboard')
  @UseInterceptors(ParamsInterceptor)
  dashboard() {
    return {};
  }
}
