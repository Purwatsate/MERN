import { Router } from 'express';
import * as controller from '../controllers/people.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(controller.list));
router.get('/search', asyncHandler(controller.search));
router.get('/:id', asyncHandler(controller.getById));
router.post('/', asyncHandler(controller.create));
router.put('/:id', asyncHandler(controller.update));
router.delete('/:id', asyncHandler(controller.remove));

export default router;
