import { Router } from 'express';
import {
  subscribeNewsletter,
  createContact,
  createLead,
  createCareerInquiry,
  createTechSupport,
  createBulkOrderInquiry,
  getHeroSlides,
  trackAnalytics,
  calculateShipping,
  registerAsSeller,
  sendInvoiceEmail,
} from '../../controllers/misc.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.post('/newsletter/subscribe', subscribeNewsletter);
router.post('/contact', createContact);
router.post('/lead', createLead);
router.post('/career', createCareerInquiry);
router.post('/tech-support', createTechSupport);
router.post('/bulk-order', createBulkOrderInquiry);
router.get('/slides', getHeroSlides);
router.post('/analytics', trackAnalytics);
router.get('/shipping-rates', calculateShipping);
router.post('/seller/register', authenticate, registerAsSeller);
router.post('/send-invoice-email', authenticate, sendInvoiceEmail);

export default router;
