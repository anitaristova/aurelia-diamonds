import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import {
  createOrder,
  listMyOrders,
  listAllOrders,
  getOrder,
} from '../controllers/orderController.js';

const router = Router();

router.use(requireAuth);
router.post('/', asyncHandler(createOrder));
router.get('/', asyncHandler(listMyOrders));
router.get('/all', requireAdmin, asyncHandler(listAllOrders));
router.get('/:id', asyncHandler(getOrder));

export default router;
