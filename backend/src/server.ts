import { config } from 'dotenv';
config(); // load .env before Zod validation
import './config/env'; // validate env vars
import connectDatabase from './config/database';
import app from './app';
import { env } from './config/env';

const PORT = env.PORT ?? 5000;

async function start(): Promise<void> {
  await connectDatabase();

  app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
    console.log(`Environment: ${env.NODE_ENV}`);
    console.log(`API base: http://localhost:${PORT}/api/v1`);
  });
}

start().catch((err) => {
  console.error('Fatal startup error:', err);
  process.exit(1);
});
