import { Router } from 'express';
import {
  getBlogs,
  getBlogBySlug,
  getAllBlogsAdmin,
  createBlog,
  updateBlog,
  deleteBlog,
} from '../../controllers/blog.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireAdmin } from '../../middlewares/role.middleware';

const router = Router();

router.get('/', getBlogs);
router.get('/:slug', getBlogBySlug);

router.get('/admin/all', authenticate, requireAdmin, getAllBlogsAdmin);
router.post('/', authenticate, requireAdmin, createBlog);
router.put('/:id', authenticate, requireAdmin, updateBlog);
router.delete('/:id', authenticate, requireAdmin, deleteBlog);

export default router;
