import { createApp } from './app.js';
import { connectDatabase } from './config/db.js';
import { config } from './config/env.js';
import { ensureAdminUser } from './bootstrap/adminBootstrap.js';

async function start() {
  try {
    await connectDatabase();
    await ensureAdminUser();
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
