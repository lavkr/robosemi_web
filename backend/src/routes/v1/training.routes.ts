import { Router } from 'express';
import {
  getTrainings,
  getTrainingBySlug,
  createTraining,
  updateTraining,
  deleteTraining,
  registerForTraining,
} from '../../controllers/training.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/role.middleware';

const router = Router();

router.get('/', getTrainings);
router.get('/:slug', getTrainingBySlug);
router.post('/:id/register', registerForTraining);

router.post('/', authenticate, requireAdmin, createTraining);
router.put('/:id', authenticate, requireAdmin, updateTraining);
router.delete('/:id', authenticate, requireAdmin, deleteTraining);

export default router;
