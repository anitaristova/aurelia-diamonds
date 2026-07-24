import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from '../controllers/cartController.js';

const router = Router();

router.use(requireAuth);
router.get('/', asyncHandler(getCart));
router.post('/', asyncHandler(addToCart));
router.put('/:productId', asyncHandler(updateCartItem));
router.delete('/:productId', asyncHandler(removeCartItem));

export default router;
