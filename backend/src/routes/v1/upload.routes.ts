import { Router } from 'express';
import multer from 'multer';
import { uploadFile, deleteFile } from '../../controllers/upload.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { uploadRateLimiter } from '../../middlewares/rateLimit.middleware';

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
  fileFilter: (_req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'));
  },
});

const router = Router();

router.use(authenticate, uploadRateLimiter);

router.post('/', upload.single('image'), uploadFile);
router.post('/multiple', upload.array('images', 10), uploadFile);
router.delete('/', deleteFile);

export default router;
