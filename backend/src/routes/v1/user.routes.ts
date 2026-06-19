import { Router } from 'express';
import {
  getProfile,
  updateProfile,
  updatePassword,
  getAddresses,
  addAddress,
  updateAvatar,
  getNotificationPrefs,
  updateNotificationPrefs,
  getDashboard,
} from '../../controllers/user.controller';
import { authenticate } from '../../middlewares/auth.middleware';

const router = Router();

router.use(authenticate);

router.get('/profile', getProfile);
router.put('/profile', updateProfile);
router.put('/password', updatePassword);
router.put('/avatar', updateAvatar);
router.get('/addresses', getAddresses);
router.post('/addresses', addAddress);
router.get('/notifications', getNotificationPrefs);
router.put('/notifications', updateNotificationPrefs);
router.get('/dashboard', getDashboard);

export default router;
