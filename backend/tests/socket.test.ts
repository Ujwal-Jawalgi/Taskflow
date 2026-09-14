import request from 'supertest';
import { io as ioc, Socket as ClientSocket } from 'socket.io-client';
import { AddressInfo } from 'net';
import { PrismaClient } from '@prisma/client';
import { mockDeep, DeepMockProxy } from 'jest-mock-extended';
import { server } from '../src/index';
import prisma from '../src/client';
import jwt from 'jsonwebtoken';

jest.mock('../src/client', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}));

const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>;

describe('Socket.io Integration', () => {
  const PORT = 3001; // use different port for tests
  let clientSocketA: ClientSocket;
  let clientSocketB: ClientSocket;
  const userA = 'user-A';
  const userB = 'user-B';
  let tokenA: string;
  let tokenB: string;

  beforeAll((done) => {
    // Use port 0 to let the OS assign an available port
    server.listen(0, () => {
      const address = server.address() as AddressInfo;
      const PORT = address.port;

      tokenA = jwt.sign(
        { userId: userA },
        process.env.JWT_ACCESS_SECRET || 'taskflow-access-secret-dev',
        { expiresIn: '1h' },
      );

      tokenB = jwt.sign(
        { userId: userB },
        process.env.JWT_ACCESS_SECRET || 'taskflow-access-secret-dev',
        { expiresIn: '1h' },
      );

      clientSocketA = ioc(`http://localhost:${PORT}`, {
        auth: { token: tokenA },
      });
      clientSocketB = ioc(`http://localhost:${PORT}`, {
        auth: { token: tokenB },
      });

      let connected = 0;
      const checkDone = () => {
        connected++;
        if (connected === 2) done();
      };

      clientSocketA.on('connect', checkDone);
      clientSocketB.on('connect', checkDone);
    });
  });

  afterAll((done) => {
    clientSocketA.disconnect();
    clientSocketB.disconnect();
    server.close(() => done());
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should emit task:updated to user A but not user B when user A updates task', (done) => {
    const updatedTask = {
      id: 'task-1',
      title: 'Updated via REST',
      description: null,
      status: 'DONE',
      priority: 'MEDIUM',
      dueDate: null,
      userId: userA,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // User A owns the task
    prismaMock.task.findFirst.mockResolvedValue(updatedTask as any);
    prismaMock.task.update.mockResolvedValue(updatedTask as any);

    let bReceivedEvent = false;
    clientSocketB.on('task:updated', () => {
      bReceivedEvent = true;
    });

    clientSocketA.on('task:updated', (task) => {
      expect(task.title).toBe('Updated via REST');
      expect(task.status).toBe('DONE');
      expect(bReceivedEvent).toBe(false); // B should not receive it

      clientSocketA.off('task:updated');
      clientSocketB.off('task:updated');
      done();
    });

    // Trigger update via REST
    request(server)
      .patch('/api/tasks/task-1')
      .set('Authorization', `Bearer ${tokenA}`)
      .send({
        status: 'DONE',
        title: 'Updated via REST',
      })
      .then((res) => {
        expect(res.status).toBe(200);
      });
  });
});
