import { Router } from 'express';
import {
  getShippingRates,
  checkServiceability,
  trackShipment,
} from '../../controllers/shipping.controller';

const router = Router();

router.get('/rates', getShippingRates);
router.get('/serviceability', checkServiceability);
router.get('/track/:awb', trackShipment);

export default router;
