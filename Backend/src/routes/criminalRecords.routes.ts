import { Router } from 'express';
import * as controller from '../controllers/criminalRecords.controller';
import { asyncHandler } from '../utils/asyncHandler';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.get('/incident/:incidentId', asyncHandler(controller.listByIncident));
router.get('/person/:personId', asyncHandler(controller.listByPerson));
router.get('/:id', asyncHandler(controller.getById));
router.post('/', asyncHandler(controller.create));
router.delete('/:id', asyncHandler(controller.remove));

export default router;
