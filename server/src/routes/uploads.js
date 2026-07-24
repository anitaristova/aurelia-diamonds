import { Router } from 'express';
import { requireAuth, requireAdmin } from '../middleware/auth.js';
import { uploadImages } from '../config/upload.js';

const router = Router();

router.post(
  '/',
  requireAuth,
  requireAdmin,
  uploadImages.array('images', 8),
  (req, res) => {
    const urls = (req.files || []).map((file) => `/uploads/${file.filename}`);
    res.status(201).json({ urls });
  }
);

export default router;
