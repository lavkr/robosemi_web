import { Router } from 'express';
import {
  getSellerProfile,
  updateSellerProfile,
  getSellerProducts,
  createSellerProduct,
  updateSellerProduct,
  deleteSellerProduct,
  getSellerOrders,
  getSellerDashboard,
  getSellerAnalytics,
  getSellerInventory,
  getSellerReviews,
  getSellerCoupons,
  createSellerCoupon,
  updateSellerCoupon,
  deleteSellerCoupon,
  getSellerShipping,
  getTopSellerProducts,
} from '../../controllers/seller.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireSeller } from '../../middlewares/role.middleware';

const router = Router();

router.use(authenticate);

router.get('/dashboard', requireSeller, getSellerDashboard);
router.get('/analytics', requireSeller, getSellerAnalytics);
router.get('/inventory', requireSeller, getSellerInventory);
router.get('/reviews', requireSeller, getSellerReviews);
router.get('/shipping', requireSeller, getSellerShipping);
router.get('/top-products', requireSeller, getTopSellerProducts);

router.get('/profile', getSellerProfile);
router.put('/profile', requireSeller, updateSellerProfile);

router.get('/products', requireSeller, getSellerProducts);
router.post('/products', requireSeller, createSellerProduct);
router.put('/products/:id', requireSeller, updateSellerProduct);
router.delete('/products/:id', requireSeller, deleteSellerProduct);

router.get('/orders', requireSeller, getSellerOrders);

router.get('/coupons', requireSeller, getSellerCoupons);
router.post('/coupons', requireSeller, createSellerCoupon);
router.put('/coupons/:id', requireSeller, updateSellerCoupon);
router.delete('/coupons/:id', requireSeller, deleteSellerCoupon);

export default router;
