import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import app from '../src/index';
import prisma from '../src/client';
import jwt from 'jsonwebtoken';

jest.mock('../src/client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('Task API', () => {
  const userId = 'user-1';
  let token: string;

  beforeEach(() => {
    jest.clearAllMocks();
    token = jwt.sign({ userId }, process.env.JWT_ACCESS_SECRET || 'taskflow-access-secret-dev', {
      expiresIn: '15m',
    });
  });

  describe('GET /api/tasks', () => {
    it('should return tasks with default pagination', async () => {
      const mockTasks = Array(5)
        .fill(0)
        .map((_, i) => ({
          id: `task-${i}`,
          title: `Task ${i}`,
          description: null,
          status: 'TODO' as any,
          priority: 'MEDIUM' as any,
          dueDate: null,
          userId,
          createdAt: new Date(),
          updatedAt: new Date(),
        }));

      prismaMock.task.findMany.mockResolvedValue(mockTasks);
      prismaMock.task.count.mockResolvedValue(25);

      const response = await request(app).get('/api/tasks').set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toHaveLength(5);
      expect(response.body.pagination).toEqual({
        page: 1,
        limit: 10,
        totalCount: 25,
        totalPages: 3,
      });
      expect(prismaMock.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId },
          skip: 0,
          take: 10,
        }),
      );
    });

    it('should apply custom page and limit', async () => {
      prismaMock.task.findMany.mockResolvedValue([]);
      prismaMock.task.count.mockResolvedValue(5);

      const response = await request(app)
        .get('/api/tasks?page=2&limit=5')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.pagination.page).toBe(2);
      expect(response.body.pagination.limit).toBe(5);
      expect(prismaMock.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          skip: 5,
          take: 5,
        }),
      );
    });

    it('should enforce maximum limit of 50', async () => {
      const response = await request(app)
        .get('/api/tasks?limit=100')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(400); // Validation error max 50
    });

    it('should return empty array if page is beyond available results', async () => {
      prismaMock.task.findMany.mockResolvedValue([]);
      prismaMock.task.count.mockResolvedValue(5);

      const response = await request(app)
        .get('/api/tasks?page=10')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.data).toEqual([]);
    });

    it('should filter by status and priority', async () => {
      prismaMock.task.findMany.mockResolvedValue([]);
      prismaMock.task.count.mockResolvedValue(0);

      const response = await request(app)
        .get('/api/tasks?status=DONE&priority=HIGH')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(prismaMock.task.findMany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { userId, status: 'DONE', priority: 'HIGH' },
        }),
      );
    });
  });

  describe('POST /api/tasks', () => {
    it('should create a task successfully', async () => {
      const newTask = {
        id: 'new-task',
        title: 'Test',
        description: 'Test description',
        status: 'TODO' as any,
        priority: 'MEDIUM' as any,
        dueDate: null,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      prismaMock.task.create.mockResolvedValue(newTask);

      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test',
          description: 'Test description',
        });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id', 'new-task');
    });

    it('should return 400 if title is missing', async () => {
      const response = await request(app)
        .post('/api/tasks')
        .set('Authorization', `Bearer ${token}`)
        .send({
          description: 'No title provided',
        });

      expect(response.status).toBe(400);
    });
  });

  describe('GET /api/tasks/:id', () => {
    it('should return task if it belongs to user', async () => {
      prismaMock.task.findFirst.mockResolvedValue({
        id: 'task-1',
        title: 'Test',
        description: null,
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: null,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .get('/api/tasks/task-1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(200);
      expect(response.body.id).toBe('task-1');
    });

    it('should return 404 if task belongs to another user', async () => {
      prismaMock.task.findFirst.mockResolvedValue(null); // Simulated findFirst with { id, userId } returning null

      const response = await request(app)
        .get('/api/tasks/task-2')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });

  describe('PATCH /api/tasks/:id', () => {
    it('should update a task successfully', async () => {
      prismaMock.task.findFirst.mockResolvedValue({
        id: 'task-1',
        title: 'Test',
        description: null,
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: null,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      prismaMock.task.update.mockResolvedValue({
        id: 'task-1',
        title: 'Test Updated',
        description: null,
        status: 'DONE',
        priority: 'MEDIUM',
        dueDate: null,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .patch('/api/tasks/task-1')
        .set('Authorization', `Bearer ${token}`)
        .send({
          title: 'Test Updated',
          status: 'DONE',
        });

      expect(response.status).toBe(200);
      expect(response.body.title).toBe('Test Updated');
      expect(response.body.status).toBe('DONE');
    });

    it('should return 404 if trying to update another user task', async () => {
      prismaMock.task.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .patch('/api/tasks/task-2')
        .set('Authorization', `Bearer ${token}`)
        .send({ title: 'Hacked' });

      expect(response.status).toBe(404);
    });
  });

  describe('DELETE /api/tasks/:id', () => {
    it('should delete task and return 204', async () => {
      prismaMock.task.findFirst.mockResolvedValue({
        id: 'task-1',
        title: 'Test',
        description: null,
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: null,
        userId,
        createdAt: new Date(),
        updatedAt: new Date(),
      });

      const response = await request(app)
        .delete('/api/tasks/task-1')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(204);
      expect(prismaMock.task.delete).toHaveBeenCalledWith({ where: { id: 'task-1' } });
    });

    it('should return 404 if trying to delete another user task', async () => {
      prismaMock.task.findFirst.mockResolvedValue(null);

      const response = await request(app)
        .delete('/api/tasks/task-2')
        .set('Authorization', `Bearer ${token}`);

      expect(response.status).toBe(404);
    });
  });
});
