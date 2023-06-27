import {
  Controller,
  Get,
  Param,
  Render,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { QuoteService } from '../quote/quote.service';
import { AuthFilter } from '../auth/filters';
import { JwtGuard } from '../auth/guard';

@Controller()
export class AppController {
  constructor(private readonly quoteService: QuoteService) {}

  @Get('/')
  @Render('index')
  async home() {
    const quote = await this.quoteService.findRandom();
    return { quote };
  }

  @Get('id=:id')
  @Render('[id]')
  async quote(@Param('id') id: string) {
    const quote = await this.quoteService.findOne(+id);
    return { id, quote };
  }

  @Get('/login')
  @Render('login')
  login() {
    return {};
  }

  @Get('/signup')
  @Render('signup')
  signup() {
    return {};
  }

  @Get('/dashboard')
  @Render('dashboard')
  @UseGuards(JwtGuard)
  @UseFilters(AuthFilter)
  async dashboard() {
    const quotes = await this.quoteService.findAll(1);
    return { quotes };
  }
}
