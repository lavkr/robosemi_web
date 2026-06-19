import { Router } from 'express';
import {
  getOrders,
  createOrder,
  getOrderById,
  cancelOrder,
  requestReturn,
  trackOrder,
  getInvoice,
  checkPurchase,
} from '../../controllers/order.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/', getOrders);
router.post('/', createOrder);
router.get('/track', trackOrder);
router.get('/check-purchase', checkPurchase);
router.get('/:id', getOrderById);
router.post('/:id/cancel', cancelOrder);
router.post('/:id/return', requestReturn);
router.get('/:id/invoice', getInvoice);

export default router;
