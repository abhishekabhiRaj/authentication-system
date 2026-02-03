import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { getPool, ensureTables } from './db.js';
import registerModules from './modules/routes.js';
import { requestLogger } from './middleware/requestLogger.js';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use(cookieParser());

app.use(requestLogger);

const apiRouter = await registerModules();
app.use('/api', apiRouter);

// Health check (GET so you can test in browser or Postman)
app.get('/api/health', (req, res) => {
  res.json({ ok: true, message: 'API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Not Found',
    hint: 'Use POST /api/login or POST /api/signup. Check URL and method.',
  });
});

app.listen(PORT, async () => {
  try {
    await getPool();
    await ensureTables();
    console.log('MySQL connected (Aiven). Users table ready.');
  } catch (e) {
    console.warn('MySQL not connected:', e.message);
    console.warn('Set MYSQL_* env (or MYSQL_URI). See backend/.env.example');
  }
  console.log(`Server running on http://localhost:${PORT}`);
});
