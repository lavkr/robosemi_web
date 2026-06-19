import { Router } from 'express';
import { register, login, getMe, oauthLogin } from '../../controllers/auth.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { authRateLimiter } from '../../middlewares/rateLimit.middleware';

const router = Router();

router.post('/register', authRateLimiter, register);
router.post('/login', authRateLimiter, login);
router.post('/oauth', authRateLimiter, oauthLogin);
router.get('/me', authenticate, getMe);

export default router;
