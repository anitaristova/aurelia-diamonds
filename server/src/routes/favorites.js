import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  getFavorites,
  addFavorite,
  removeFavorite,
} from '../controllers/favoritesController.js';

const router = Router();

router.use(requireAuth);
router.get('/', asyncHandler(getFavorites));
router.post('/:productId', asyncHandler(addFavorite));
router.delete('/:productId', asyncHandler(removeFavorite));

export default router;
