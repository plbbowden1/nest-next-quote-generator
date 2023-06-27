import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { QuoteService } from './quote.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { JwtGuard } from '../auth/guard';

@Controller('/api/quote')
export class QuoteController {
  constructor(private readonly quoteService: QuoteService) {}

  @Post()
  async create(@Body() createQuoteDto: CreateQuoteDto) {
    return await this.quoteService.create(createQuoteDto);
  }

  @UseGuards(JwtGuard)
  @Get('page=:pageNumber')
  findAll(@Param('pageNumber') pageNumber: number) {
    return this.quoteService.findAll(pageNumber);
  }

  @Get('id=:id')
  async findOne(@Param('id') id: string) {
    return await this.quoteService.findOne(+id);
  }

  @Get('random')
  findRandom() {
    return this.quoteService.findRandom();
  }

  @Patch(':id')
  update(@Param('id') id: number, @Body() updateQuoteDto: UpdateQuoteDto) {
    return this.quoteService.update(id, updateQuoteDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.quoteService.remove(+id);
  }
}
