import { Router } from 'express';
import {
  getCart,
  addToCart,
  updateCart,
  removeFromCart,
  syncCart,
} from '../../controllers/cart.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getCart);
router.post('/', addToCart);
router.put('/', updateCart);
router.delete('/', removeFromCart);
router.post('/sync', syncCart);

export default router;
