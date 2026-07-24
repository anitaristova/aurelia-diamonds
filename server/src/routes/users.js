import { Router } from 'express';
import { requireAuth } from '../middleware/auth.js';
import { updateProfile } from '../controllers/userController.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const router = Router();

router.put('/me', requireAuth, asyncHandler(updateProfile));

export default router;
