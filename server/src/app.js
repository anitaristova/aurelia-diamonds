import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import { apiRouter } from './routes/index.js';
import { uploadsDir } from './config/upload.js';

export function createApp() {
  const app = express();

  app.use(cors());
  app.use(express.json());
  app.use(morgan('dev'));

  app.use('/uploads', express.static(uploadsDir));
  app.use('/api', apiRouter);

  app.use((req, res) => {
    res.status(404).json({ error: 'Not found' });
  });

  // eslint-disable-next-line no-unused-vars
  app.use((err, req, res, next) => {
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors)
        .map((e) => e.message)
        .join(', ');
      return res.status(400).json({ error: message });
    }
    if (err.code === 11000) {
      const field = Object.keys(err.keyPattern || {})[0] || 'value';
      return res.status(409).json({ error: `A record with this ${field} already exists` });
    }
    if (err.name === 'MulterError') {
      return res.status(400).json({ error: err.message });
    }
    if (err.status && err.status < 500) {
      return res.status(err.status).json({ error: err.message });
    }
    console.error(err);
    res.status(500).json({ error: err.message || 'Server error' });
  });

  return app;
}
