import { Router } from 'express';
import { createPaymentOrder, verifyPayment } from '../../controllers/payment.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.post('/create-order', createPaymentOrder);
router.post('/verify', verifyPayment);

export default router;
