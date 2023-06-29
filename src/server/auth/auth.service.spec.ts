import { Test, TestingModule } from '@nestjs/testing';
import { ForbiddenException } from '@nestjs/common';
import { Repository, QueryFailedError } from 'typeorm';
import argon from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { User } from './entities/user.entity';
import cookie from 'cookie';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthService', () => {
  let service: AuthService;
  let userRepository: Repository<User>;
  let jwtService: JwtService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getRepositoryToken(User),
          useClass: Repository,
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn().mockResolvedValue('mockToken'),
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn().mockReturnValue('mockSecret'),
          },
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
  });

  describe('signin', () => {
    it('should sign in a user and return a cookie', async () => {
      const authDto: AuthDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };
      const mockUser = { id: 1, email: 'test@example.com', hash: 'mockHash' };

      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(mockUser as User);
      jest.spyOn(argon, 'verify').mockResolvedValueOnce(true);
      jest.spyOn(service, 'generateCookie').mockResolvedValueOnce('mockCookie');

      const result = await service.signin(authDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: authDto.email },
      });
      expect(argon.verify).toHaveBeenCalledWith(
        mockUser.hash,
        authDto.password,
      );
      expect(service.generateCookie).toHaveBeenCalledWith(
        mockUser.id,
        mockUser.email,
      );
      expect(result).toEqual({ cookie: 'mockCookie' });
    });

    it('should throw a ForbiddenException if email is not found', async () => {
      const authDto: AuthDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValueOnce(null);

      await expect(service.signin(authDto)).rejects.toThrowError(
        ForbiddenException,
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: authDto.email },
      });
    });

    it('should throw a ForbiddenException if password is incorrect', async () => {
      const authDto: AuthDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };
      const mockUser = { id: 1, email: 'test@example.com', hash: 'mockHash' };

      jest
        .spyOn(userRepository, 'findOne')
        .mockResolvedValueOnce(mockUser as User);
      jest.spyOn(argon, 'verify').mockResolvedValueOnce(false);

      await expect(service.signin(authDto)).rejects.toThrowError(
        ForbiddenException,
      );
      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: authDto.email },
      });
      expect(argon.verify).toHaveBeenCalledWith(
        mockUser.hash,
        authDto.password,
      );
    });
  });

  describe('signup', () => {
    it('should sign up a new user and return a cookie', async () => {
      const authDto: AuthDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };
      const mockHash = 'mockHash';
      const mockUser = { id: 1, email: 'test@example.com', hash: mockHash };

      jest.spyOn(argon, 'hash').mockResolvedValueOnce(mockHash);
      jest
        .spyOn(userRepository, 'create')
        .mockReturnValueOnce(mockUser as User);
      jest
        .spyOn(userRepository, 'save')
        .mockResolvedValueOnce(mockUser as User);
      jest.spyOn(service, 'generateCookie').mockResolvedValueOnce('mockCookie');

      const result = await service.signup(authDto);

      expect(argon.hash).toHaveBeenCalledWith(authDto.password);
      expect(userRepository.create).toHaveBeenCalledWith({
        email: authDto.email,
        hash: mockHash,
      });
      expect(userRepository.save).toHaveBeenCalledWith(mockUser as User);
      expect(service.generateCookie).toHaveBeenCalledWith(
        mockUser.id,
        mockUser.email,
      );
      expect(result).toEqual({ cookie: 'mockCookie' });
    });

    it('should throw a ForbiddenException if email is already in use', async () => {
      const authDto: AuthDto = {
        email: 'test@example.com',
        password: 'testpassword',
      };

      jest.spyOn(argon, 'hash').mockResolvedValueOnce('mockHash');
      jest.spyOn(userRepository, 'create').mockImplementation(() => {
        throw new QueryFailedError('', [], '');
      });

      await expect(service.signup(authDto)).rejects.toThrowError(
        ForbiddenException,
      );
      expect(argon.hash).toHaveBeenCalledWith(authDto.password);
      expect(userRepository.create).toHaveBeenCalledWith({
        email: authDto.email,
        hash: 'mockHash',
      });
    });
  });

  describe('generateCookie', () => {
    it('should generate a serialized cookie', async () => {
      const userId = 1;
      const email = 'test@example.com';
      const mockToken = 'mockToken';
      const mockSecret = 'mockSecret';
      const mockSerializedCookie = 'mockSerializedCookie';

      jest
        .spyOn(jwtService, 'signAsync')
        .mockResolvedValueOnce(mockToken as string);
      jest.spyOn(configService, 'get').mockReturnValueOnce(mockSecret);
      jest.spyOn(cookie, 'serialize').mockReturnValueOnce(mockSerializedCookie);

      const result = await service.generateCookie(userId, email);

      expect(jwtService.signAsync).toHaveBeenCalledWith(
        { sub: userId, email },
        { expiresIn: '15m', secret: mockSecret },
      );
      expect(cookie.serialize).toHaveBeenCalledWith('jwt', mockToken, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 900,
        path: '/',
      });
      expect(result).toEqual(mockSerializedCookie);
    });
  });
});
