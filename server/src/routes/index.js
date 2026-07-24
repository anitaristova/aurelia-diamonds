import { Router } from 'express';
import authRouter from './auth.js';
import usersRouter from './users.js';
import productsRouter from './products.js';
import uploadsRouter from './uploads.js';

export const apiRouter = Router();

apiRouter.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

apiRouter.use('/auth', authRouter);
apiRouter.use('/users', usersRouter);
apiRouter.use('/products', productsRouter);
apiRouter.use('/uploads', uploadsRouter);
