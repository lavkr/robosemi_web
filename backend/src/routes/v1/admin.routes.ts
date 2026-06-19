import { Router } from 'express';
import {
  getAdminDashboard,
  getUsers,
  updateUser,
  getSellers,
  updateSeller,
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getOrder,
  updateOrderStatus,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
  getAnalytics,
  getRegistrations,
  getSlides,
  createSlide,
  updateSlide,
  deleteSlide,
} from '../../controllers/admin.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/role.middleware';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', getAdminDashboard);
router.get('/analytics', getAnalytics);

router.get('/users', getUsers);
router.put('/users/:id', updateUser);

router.get('/sellers', getSellers);
router.put('/sellers/:id', updateSeller);

router.get('/categories', getCategories);
router.post('/categories', createCategory);
router.put('/categories/:id', updateCategory);
router.delete('/categories/:id', deleteCategory);

router.get('/orders/:id', getOrder);
router.put('/orders/:id', updateOrderStatus);

router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);

router.get('/registrations', getRegistrations);

router.get('/slides', getSlides);
router.post('/slides', createSlide);
router.put('/slides/:id', updateSlide);
router.delete('/slides/:id', deleteSlide);

export default router;
