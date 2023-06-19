import { Test, TestingModule } from '@nestjs/testing';
import { QuoteController } from './quote.controller';
import { QuoteService } from './quote.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Quote } from './entities';

describe('QuoteController', () => {
  let controller: QuoteController;
  let service: QuoteService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [QuoteController],
      providers: [
        QuoteService,
        {
          provide: getRepositoryToken(Quote),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            find: jest.fn(),
            findOneBy: jest.fn(),
            delete: jest.fn(),
            createQueryBuilder: jest.fn(() => ({
              orderBy: jest.fn().mockReturnThis(),
              getOne: jest.fn(),
            })),
          },
        },
      ],
    }).compile();

    controller = module.get<QuoteController>(QuoteController);
    service = module.get<QuoteService>(QuoteService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should create a new quote', async () => {
      const createQuoteDto: CreateQuoteDto = {
        quote: 'Test quote',
        character: 'Test character',
      };

      jest.spyOn(service, 'create').mockResolvedValueOnce(createQuoteDto);

      const result = await controller.create(createQuoteDto);

      expect(service.create).toHaveBeenCalledWith(createQuoteDto);
      expect(result).toEqual(createQuoteDto);
    });
  });

  describe('findAll', () => {
    it('should return an array of quotes', async () => {
      const pageNumber = 1;
      const quotes = [
        { id: 1, quote: 'Quote 1', character: 'Character 1' },
        { id: 2, quote: 'Quote 2', character: 'Character 2' },
      ];

      jest.spyOn(service, 'findAll').mockResolvedValueOnce(quotes);

      const result = await controller.findAll(pageNumber);

      expect(service.findAll).toHaveBeenCalledWith(pageNumber);
      expect(result).toEqual(quotes);
    });
  });

  describe('findOne', () => {
    it('should return a quote by ID', async () => {
      const id = '1';
      const quote = { id: 1, quote: 'Quote 1', character: 'Character 1' };

      jest.spyOn(service, 'findOne').mockResolvedValueOnce(quote);

      const result = await controller.findOne(id);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(quote);
    });
  });

  describe('findRandom', () => {
    it('should return a random quote', async () => {
      const quote = {
        id: 1,
        quote: 'Random quote',
        character: 'Random character',
      };

      jest.spyOn(service, 'findRandom').mockResolvedValueOnce(quote);

      const result = await controller.findRandom();

      expect(service.findRandom).toHaveBeenCalled();
      expect(result).toEqual(quote);
    });
  });

  describe('update', () => {
    it('should update a quote', async () => {
      const id = 1;
      const updateQuoteDto: UpdateQuoteDto = {
        quote: 'Updated quote',
        character: 'Updated character',
      };

      jest
        .spyOn(service, 'update')
        .mockResolvedValueOnce({ id, ...updateQuoteDto });

      const result = await controller.update(id, updateQuoteDto);

      expect(service.update).toHaveBeenCalledWith(id, updateQuoteDto);
      expect(result).toEqual({ id, ...updateQuoteDto });
    });
  });

  describe('remove', () => {
    it('should remove a quote', async () => {
      const id = '1';

      jest.spyOn(service, 'remove').mockResolvedValueOnce(undefined);

      await controller.remove(id);

      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
