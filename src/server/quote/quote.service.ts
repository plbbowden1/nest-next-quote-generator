import { Injectable } from '@nestjs/common';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Quote } from './entities';

@Injectable()
export class QuoteService {
  constructor(
    @InjectRepository(Quote)
    private quoteRepository: Repository<Quote>,
  ) {}

  create(createQuoteDto: CreateQuoteDto): Promise<Quote> {
    const quote = this.quoteRepository.create(createQuoteDto);
    return this.quoteRepository.save(quote);
  }

  async findAll(currentPage: number): Promise<Quote[]> {
    if (currentPage < 1) throw new Error('Invalid page number');
    const quotesPerPage = 10;
    const quotes = await this.quoteRepository.find({
      take: quotesPerPage,
      skip: quotesPerPage * (currentPage - 1),
    });
    return quotes;
  }

  findOne(id: number): Promise<Quote | null> {
    return this.quoteRepository.findOneBy({ id });
  }

  findRandom() {
    return this.quoteRepository
      .createQueryBuilder('quote')
      .orderBy('RANDOM()')
      .getOne();
  }

  update(id: number, updateQuoteDto: UpdateQuoteDto) {
    return this.quoteRepository.save({
      id,
      ...updateQuoteDto,
    });
  }

  async remove(id: number): Promise<void> {
    await this.quoteRepository.delete(id);
  }
}
