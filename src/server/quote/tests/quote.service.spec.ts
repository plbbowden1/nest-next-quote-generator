import { Test, TestingModule } from '@nestjs/testing';
import { QuoteService } from '../quote.service';
import { QuoteController } from '../quote.controller';
import { Quote } from '../entities';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UpdateQuoteDto } from '../dto/update-quote.dto';

describe('QuoteService', () => {
  let service: QuoteService;
  let quoteRepository: Repository<Quote>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuoteService,
        {
          provide: getRepositoryToken(Quote),
          useValue: {
            create: jest.fn(),
            save: jest.fn(),
            update: jest.fn(),
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
      controllers: [QuoteController],
    }).compile();

    service = module.get<QuoteService>(QuoteService);
    quoteRepository = module.get<Repository<Quote>>(getRepositoryToken(Quote));
  });

  it('service should be defined', () => {
    expect(service).toBeDefined();
  });

  it('repo should be defined', () => {
    expect(quoteRepository).toBeDefined();
  });

  describe('create', () => {
    it('should create a quote', async () => {
      const quote: Quote = {
        id: 1,
        quote: 'test quote',
        character: 'test character',
      };
      jest.spyOn(quoteRepository, 'create').mockReturnValue(quote);
      jest.spyOn(quoteRepository, 'save').mockResolvedValue(quote);

      expect(await service.create(quote)).toEqual(quote);
    });
    it('should throw an error if quote is not created', async () => {
      const quote: Quote = {
        id: 1,
        quote: 'test quote',
        character: 'test character',
      };
      jest.spyOn(quoteRepository, 'create').mockReturnValue(quote);
      jest.spyOn(quoteRepository, 'save').mockRejectedValue(new Error());

      await expect(service.create(quote)).rejects.toThrowError();
    });
    describe('findAll', () => {
      it('should return an array of quotes', async () => {
        const quotes: Quote[] = [
          { id: 1, quote: 'Quote 1', character: 'Character 1' },
          { id: 2, quote: 'Quote 2', character: 'Character 2' },
          { id: 3, quote: 'Quote 3', character: 'Character 1' },
          { id: 4, quote: 'Quote 4', character: 'Character 2' },
          { id: 5, quote: 'Quote 5', character: 'Character 1' },
          { id: 6, quote: 'Quote 6', character: 'Character 2' },
          { id: 7, quote: 'Quote 7', character: 'Character 1' },
          { id: 8, quote: 'Quote 8', character: 'Character 2' },
          { id: 9, quote: 'Quote 9', character: 'Character 1' },
          { id: 10, quote: 'Quote 10', character: 'Character 2' },
        ];

        const findSpy = jest
          .spyOn(quoteRepository, 'find')
          .mockResolvedValueOnce(quotes);

        const result = await service.findAll(1);

        expect(findSpy).toHaveBeenCalledWith({
          take: 10,
          skip: 0,
        });
        expect(result).toEqual(quotes);
      });

      it('should throw an error if page number is invalid', async () => {
        await expect(service.findAll(0)).rejects.toThrowError(
          'Invalid page number',
        );
      });
    });

    describe('findOne', () => {
      it('should return a quote by ID', async () => {
        const quote: Quote = {
          id: 1,
          quote: 'Quote 1',
          character: 'Character 1',
        };

        const findOneSpy = jest
          .spyOn(quoteRepository, 'findOneBy')
          .mockResolvedValueOnce(quote);

        const result = await service.findOne(1);

        expect(findOneSpy).toHaveBeenCalledWith({ id: 1 });
        expect(result).toEqual(quote);
      });

      it('should return null if quote is not found', async () => {
        const findOneSpy = jest
          .spyOn(quoteRepository, 'findOneBy')
          .mockResolvedValueOnce(null);

        const result = await service.findOne(1);

        expect(findOneSpy).toHaveBeenCalledWith({ id: 1 });
        expect(result).toBeNull();
      });
    });
    describe('findRandom', () => {
      it('should return a random quote', async () => {
        const quote: Quote = {
          id: 1,
          quote: 'Random quote',
          character: 'Random character',
        };

        const getOneSpy = jest
          .spyOn(quoteRepository, 'createQueryBuilder')
          .mockReturnValueOnce({
            orderBy: jest.fn().mockReturnThis(),
            getOne: jest.fn().mockResolvedValueOnce(quote),
          } as any);

        const result = await service.findRandom();

        expect(getOneSpy).toHaveBeenCalled();
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

        const updateSpy = jest
          .spyOn(quoteRepository, 'update')
          .mockResolvedValueOnce(updateQuoteDto as any);

        const result = await service.update(id, updateQuoteDto);

        expect(updateSpy).toHaveBeenCalledWith(id, updateQuoteDto);
        expect(result).toEqual(updateQuoteDto);
      });
    });

    describe('remove', () => {
      it('should remove a quote', async () => {
        const id = 1;
        const deleteSpy = jest
          .spyOn(quoteRepository, 'delete')
          .mockResolvedValueOnce({} as any);

        await service.remove(id);

        expect(deleteSpy).toHaveBeenCalledWith(id);
      });
    });
  });
});
