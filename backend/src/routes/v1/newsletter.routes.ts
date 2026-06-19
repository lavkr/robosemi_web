import { Router } from 'express';
import {
  subscribe,
  unsubscribe,
  getSubscribers,
  createLead,
  getLeads,
} from '../../controllers/newsletter.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/role.middleware';

const router = Router();

router.post('/subscribe', subscribe);
router.post('/unsubscribe', unsubscribe);
router.post('/lead', createLead);

router.get('/subscribers', authenticate, requireAdmin, getSubscribers);
router.get('/leads', authenticate, requireAdmin, getLeads);

export default router;
