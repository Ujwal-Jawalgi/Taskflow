import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import prisma from '../client';
import { registerSchema, loginSchema } from '../utils/validation';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/jwt';

export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (existingUser) {
      return res.status(409).json({
        error: {
          message: 'Email is already registered',
          code: 'CONFLICT',
        },
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        passwordHash,
        name: data.name,
      },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      },
    });

    res.status(201).json({ user });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const data = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
          code: 'UNAUTHORIZED',
        },
      });
    }

    if (!user.passwordHash) {
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
          code: 'UNAUTHORIZED',
        },
      });
    }

    const isPasswordValid = await bcrypt.compare(data.password, user.passwordHash);

    if (!isPasswordValid) {
      return res.status(401).json({
        error: {
          message: 'Invalid email or password',
          code: 'UNAUTHORIZED',
        },
      });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    // Set refresh token in HTTP-only cookie
    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (!refreshToken) {
      return res.status(401).json({
        error: {
          message: 'Refresh token missing',
          code: 'UNAUTHORIZED',
        },
      });
    }

    try {
      const payload = verifyRefreshToken(refreshToken);

      // Ensure user still exists
      const user = await prisma.user.findUnique({
        where: { id: payload.userId },
      });

      if (!user) {
        throw new Error('User not found');
      }

      const newAccessToken = generateAccessToken(user.id);

      res.status(200).json({
        accessToken: newAccessToken,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
        },
      });
    } catch (err) {
      return res.status(403).json({
        error: {
          message: 'Invalid or expired refresh token',
          code: 'FORBIDDEN',
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

import { OAuth2Client } from 'google-auth-library';
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || '');

export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res
        .status(400)
        .json({ error: { message: 'Google token is required', code: 'BAD_REQUEST' } });
    }

    const ticket = await googleClient.verifyIdToken({
      idToken: token,
      audience: process.env.GOOGLE_CLIENT_ID || '',
    });
    const payload = ticket.getPayload();

    if (!payload || !payload.email) {
      return res
        .status(400)
        .json({ error: { message: 'Invalid Google token', code: 'BAD_REQUEST' } });
    }

    const { email, sub: googleId, name } = payload;

    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      // Create new user
      user = await prisma.user.create({
        data: {
          email,
          googleId,
          name: name || '',
          passwordHash: null,
        },
      });
    } else if (!user.googleId) {
      // Link existing account to Google
      user = await prisma.user.update({
        where: { email },
        data: { googleId },
      });
    }

    const accessToken = generateAccessToken(user.id);
    const refreshToken = generateRefreshToken(user.id);

    res.cookie('refreshToken', refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.status(200).json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
      },
      accessToken,
    });
  } catch (error) {
    next(error);
  }
};
