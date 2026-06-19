import { Router } from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getProductFilters,
  getProductReviews,
} from '../../controllers/product.controller';
import { createReview as addReview, toggleHelpful as markHelpful } from '../../controllers/review.controller';
import { authenticate } from '../../middlewares/auth.middleware';
import { requireAdmin, requireSeller } from '../../middlewares/role.middleware';

const router = Router();

router.get('/', getProducts);
router.get('/filters', getProductFilters);
// new-arrivals must be before /:id to avoid being caught as an ID
router.get('/new-arrivals', (req, res, next) => {
  req.query.sortBy = 'createdAt';
  req.query.sortOrder = 'desc';
  if (!req.query.limit) req.query.limit = '20';
  return getProducts(req, res, next);
});
router.get('/:id', getProductById);
router.get('/:id/reviews', getProductReviews);

router.post('/', authenticate, requireSeller, createProduct);
router.put('/:id', authenticate, requireSeller, updateProduct);
router.delete('/:id', authenticate, requireSeller, deleteProduct);

router.post('/:productId/reviews', authenticate, addReview);
router.post('/reviews/:id/helpful', authenticate, markHelpful);

export default router;
