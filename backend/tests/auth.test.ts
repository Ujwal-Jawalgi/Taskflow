import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import app from '../src/index';
import prisma from '../src/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

jest.mock('../src/client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('Authentication API', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/register', () => {
    it('should create a new user and return 201', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const mockUser = {
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hashedpassword',
        googleId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.user.create.mockResolvedValue(mockUser);

      const response = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'Password1',
        name: 'Test User',
      });

      expect(response.status).toBe(201);
      expect(response.body.user).toHaveProperty('id', 'user-1');
      expect(response.body.user.email).toBe('test@example.com');
      expect(prismaMock.user.create).toHaveBeenCalled();
    });

    it('should return 400 for weak password validation error', async () => {
      const response = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'weak',
      });

      expect(response.status).toBe(400);
      expect(response.body.error.code).toBe('VALIDATION_ERROR');
    });

    it('should return 409 if email already exists', async () => {
      prismaMock.user.findUnique.mockResolvedValue({
        id: 'existing',
        email: 'test@example.com',
        name: 'Existing User',
        passwordHash: 'hashed',
        googleId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app).post('/api/auth/register').send({
        email: 'test@example.com',
        password: 'Password1',
      });

      expect(response.status).toBe(409);
      expect(response.body.error.code).toBe('CONFLICT');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should login and return tokens', async () => {
      const password = 'Password1';
      const salt = await bcrypt.genSalt(10);
      const passwordHash = await bcrypt.hash(password, salt);

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash,
        googleId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app).post('/api/auth/login').send({
        email: 'test@example.com',
        password,
      });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('refreshToken');
    });

    it('should return 401 for invalid credentials', async () => {
      prismaMock.user.findUnique.mockResolvedValue(null);

      const response = await request(app).post('/api/auth/login').send({
        email: 'notfound@example.com',
        password: 'Password1',
      });

      expect(response.status).toBe(401);
      expect(response.body.error.code).toBe('UNAUTHORIZED');
    });
  });

  describe('POST /api/auth/refresh', () => {
    it('should return new access token given valid refresh token', async () => {
      const validRefreshToken = jwt.sign(
        { userId: 'user-1' },
        process.env.JWT_REFRESH_SECRET || 'taskflow-refresh-secret-dev',
        { expiresIn: '7d' },
      );

      prismaMock.user.findUnique.mockResolvedValue({
        id: 'user-1',
        email: 'test@example.com',
        name: 'Test User',
        passwordHash: 'hash',
        googleId: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', [`refreshToken=${validRefreshToken}`]);

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
    });

    it('should return 401 if refresh token is missing', async () => {
      const response = await request(app).post('/api/auth/refresh');

      expect(response.status).toBe(401);
    });

    it('should return 403 if refresh token is invalid', async () => {
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', ['refreshToken=invalidtoken123']);

      expect(response.status).toBe(403);
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should clear refresh token cookie', async () => {
      const response = await request(app).post('/api/auth/logout');

      expect(response.status).toBe(200);
      expect(response.headers['set-cookie'][0]).toContain('refreshToken=;');
    });
  });
});
