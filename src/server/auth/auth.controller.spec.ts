import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { Repository } from 'typeorm';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth.dto';
import { User } from './entities/user.entity';
import { getRepositoryToken } from '@nestjs/typeorm';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
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

    controller = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  describe('signin', () => {
    it('should sign in a user and return a response with a cookie', async () => {
      const authDto: AuthDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const mockCookie = 'mockCookie';

      jest
        .spyOn(authService, 'signin')
        .mockResolvedValueOnce({ cookie: mockCookie });
      const res = { setHeader: jest.fn(), json: jest.fn() } as any;

      await controller.signin(authDto, res);

      expect(authService.signin).toHaveBeenCalledWith(authDto);
      expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', mockCookie);
      expect(res.json).toHaveBeenCalledWith('Successfully signed in.');
    });
  });

  describe('signup', () => {
    it('should sign up a new user and return a response with a cookie', async () => {
      const authDto: AuthDto = {
        email: 'test@example.com',
        password: 'password',
      };
      const mockCookie = 'mockCookie';

      jest
        .spyOn(authService, 'signup')
        .mockResolvedValueOnce({ cookie: mockCookie });
      const res = { setHeader: jest.fn(), json: jest.fn() } as any;

      await controller.signup(authDto, res);

      expect(authService.signup).toHaveBeenCalledWith(authDto);
      expect(res.setHeader).toHaveBeenCalledWith('Set-Cookie', mockCookie);
      expect(res.json).toHaveBeenCalledWith('Successfully signed up.');
    });
  });

  describe('signout', () => {
    it('should sign out the user and return a response with a success message', () => {
      const res = { cookie: jest.fn(), send: jest.fn() } as any;

      controller.signout(res);

      expect(res.cookie).toHaveBeenCalledWith('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
      });
      expect(res.send).toHaveBeenCalledWith({
        message: 'Successfully signed out.',
        ok: true,
      });
    });
  });
});
