import { Request, Response, NextFunction } from 'express';
import { ZodError } from 'zod';

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);

  if (err && err.name === 'ZodError') {
    const issues = err.issues || err.errors || [];
    const message = issues.map((e: any) => e.message).join(', ');
    return res.status(400).json({
      error: {
        message,
        code: 'VALIDATION_ERROR',
      },
    });
  }

  // Handle unique constraint violations from Prisma
  if (err.code === 'P2002') {
    return res.status(409).json({
      error: {
        message: 'A record with this value already exists',
        code: 'CONFLICT_ERROR',
      },
    });
  }

  const status = err.status || 500;
  const message = err.message || 'Internal Server Error';
  const code = err.code || 'INTERNAL_SERVER_ERROR';

  res.status(status).json({
    error: {
      message,
      code,
    },
  });
};
