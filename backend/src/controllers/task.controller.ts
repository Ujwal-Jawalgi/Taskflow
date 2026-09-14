import { Request, Response, NextFunction } from 'express';
import prisma from '../client';
import { createTaskSchema, updateTaskSchema, taskQuerySchema } from '../utils/validation';
import { getIO } from '../socket';

export const getTasks = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const query = taskQuerySchema.parse(req.query);

    const where: any = { userId };
    if (query.status) where.status = query.status;
    if (query.priority) where.priority = query.priority;

    let orderBy: any = { createdAt: query.sortOrder };
    if (query.sortBy === 'dueDate') {
      orderBy = { dueDate: query.sortOrder };
    }

    const skip = (query.page - 1) * query.limit;
    const take = query.limit;

    const [tasks, totalCount] = await Promise.all([
      prisma.task.findMany({
        where,
        orderBy,
        skip,
        take,
      }),
      prisma.task.count({ where }),
    ]);

    res.status(200).json({
      data: tasks,
      pagination: {
        page: query.page,
        limit: query.limit,
        totalCount,
        totalPages: Math.ceil(totalCount / query.limit),
      },
    });
  } catch (error) {
    next(error);
  }
};

export const createTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const data = createTaskSchema.parse(req.body);

    const task = await prisma.task.create({
      data: {
        ...data,
        userId,
      },
    });

    try {
      getIO().to(userId).emit('task:created', task);
    } catch (e) {
      // Ignore if socket not initialized in some test contexts
    }

    res.status(201).json(task);
  } catch (error) {
    next(error);
  }
};

export const getTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;

    const task = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!task) {
      return res.status(404).json({
        error: {
          message: 'Task not found',
          code: 'NOT_FOUND',
        },
      });
    }

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const updateTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;
    const data = updateTaskSchema.parse(req.body);

    // Verify ownership first
    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      return res.status(404).json({
        error: {
          message: 'Task not found',
          code: 'NOT_FOUND',
        },
      });
    }

    const task = await prisma.task.update({
      where: { id },
      data,
    });

    try {
      getIO().to(userId).emit('task:updated', task);
    } catch (e) {}

    res.status(200).json(task);
  } catch (error) {
    next(error);
  }
};

export const deleteTask = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = req.user!.userId;
    const id = req.params.id as string;

    const existingTask = await prisma.task.findFirst({
      where: { id, userId },
    });

    if (!existingTask) {
      return res.status(404).json({
        error: {
          message: 'Task not found',
          code: 'NOT_FOUND',
        },
      });
    }

    await prisma.task.delete({
      where: { id },
    });

    try {
      getIO().to(userId).emit('task:deleted', { id });
    } catch (e) {}

    res.status(204).send();
  } catch (error) {
    next(error);
  }
};
