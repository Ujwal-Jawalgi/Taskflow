import { Router } from 'express';
import { register, login, refresh, logout, googleLogin } from '../controllers/auth.controller';
import { authRateLimiter, refreshRateLimiter } from '../middleware/rateLimit.middleware';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/google', authRateLimiter, googleLogin);
router.post('/refresh', refreshRateLimiter, refresh);
router.post('/logout', logout);

export default router;
