import rateLimit from 'express-rate-limit';
import { Request, Response } from 'express';

const isProduction = process.env.NODE_ENV === 'production';

export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: isProduction ? 5 : 100, // Limit each IP to 5 requests per `window` (here, per 15 minutes) in prod
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: {
        message: 'Too many auth requests from this IP, please try again after 15 minutes',
        code: 'RATE_LIMITED',
      },
    });
  },
});

export const refreshRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: {
        message: 'Too many refresh requests from this IP, please try again after 15 minutes',
        code: 'RATE_LIMITED',
      },
    });
  },
});

export const taskRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,
  keyGenerator: (req: Request) => {
    // Uses the authenticated user's ID as the key. Fallback to IP if not authenticated.
    return req.user?.userId || req.ip || 'unknown';
  },
  standardHeaders: true,
  legacyHeaders: false,
  handler: (req: Request, res: Response) => {
    res.status(429).json({
      error: {
        message: 'Too many task operations, please try again after 15 minutes',
        code: 'RATE_LIMITED',
      },
    });
  },
});
