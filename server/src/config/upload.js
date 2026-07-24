import multer from 'multer';
import path from 'path';
import fs from 'fs';

export const uploadsDir = path.resolve('uploads');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadsDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`);
  },
});

function imageFilter(req, file, cb) {
  if (/^image\/(jpe?g|png|webp|gif|avif)$/.test(file.mimetype)) {
    cb(null, true);
  } else {
    const err = new Error('Only image files are allowed');
    err.status = 400;
    cb(err);
  }
}

export const uploadImages = multer({
  storage,
  fileFilter: imageFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});
