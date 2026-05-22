import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.post('/login', asyncHandler(authController.login));
router.post('/register', authenticate, requireAdmin, asyncHandler(authController.register));
router.get('/me', authenticate, asyncHandler(authController.me));

export default router;
