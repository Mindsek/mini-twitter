import { Test, TestingModule } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { User } from './entities/user.entity';
import { UsersService } from './users.service';

describe('UsersService', () => {
  let service: UsersService;
  let _prisma: PrismaService;

  const mockUser: User = {
    id: '1',
    username: 'testuser',
    email: 'test@example.com',
    password: 'hashedPassword',
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const mockPrismaService = {
    user: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    _prisma = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockPrismaService.user.findMany.mockResolvedValue([mockUser]);
      expect(await service.findAll()).toEqual([mockUser]);
    });
  });

  describe('findByEmail', () => {
    it('should return a user if found by email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      expect(await service.findByEmail('test@example.com')).toEqual(mockUser);
    });

    it('should return null if user not found by email', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      expect(await service.findByEmail('nonexistent@example.com')).toBeNull();
    });
  });

  describe('findByUsername', () => {
    it('should return a user if found by username', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      expect(await service.findByUsername('testuser')).toEqual(mockUser);
    });

    it('should return null if user not found by username', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      expect(await service.findByUsername('nonexistent')).toBeNull();
    });
  });

  describe('findOne', () => {
    it('should return a user if found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(mockUser);
      expect(await service.findOne('1')).toEqual(mockUser);
    });

    it('should return null if user not found', async () => {
      mockPrismaService.user.findUnique.mockResolvedValue(null);
      expect(await service.findOne('999')).toBeNull();
    });
  });

  describe('create', () => {
    it('should create a user', async () => {
      const createDto = {
        username: 'newuser',
        email: 'new@example.com',
        password: 'password123',
      };
      mockPrismaService.user.create.mockResolvedValue({
        ...mockUser,
        ...createDto,
      });
      expect(await service.create(createDto)).toEqual({
        ...mockUser,
        ...createDto,
      });
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateDto = { username: 'updateduser' };
      mockPrismaService.user.update.mockResolvedValue({
        ...mockUser,
        ...updateDto,
      });
      expect(await service.update('1', updateDto)).toEqual({
        ...mockUser,
        ...updateDto,
      });
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockPrismaService.user.delete.mockResolvedValue(mockUser);
      expect(await service.remove('1')).toEqual(mockUser);
    });
  });
});
