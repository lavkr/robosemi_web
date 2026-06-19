import { Router } from 'express';
import {
  getSlides,
  getAllSlides,
  createSlide,
  updateSlide,
  deleteSlide,
} from '../../controllers/slide.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/role.middleware';

const router = Router();

router.get('/', getSlides);
router.get('/admin', authenticate, requireAdmin, getAllSlides);
router.post('/', authenticate, requireAdmin, createSlide);
router.put('/:id', authenticate, requireAdmin, updateSlide);
router.delete('/:id', authenticate, requireAdmin, deleteSlide);

export default router;
