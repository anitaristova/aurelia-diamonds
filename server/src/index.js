import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { config } from './config/env.js';

async function start() {
  try {
    await connectDatabase();
    const app = createApp();
    app.listen(config.port, () => {
      console.log(`Server listening on port ${config.port}`);
    });
  } catch (err) {
    console.error('Failed to start server', err);
    process.exit(1);
  }
}

start();
