import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOGS_DIR = path.join(__dirname, '..', 'logs');

function getLogFileName() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `log_${y}_${m}_${d}.txt`;
}

function formatPayload(body) {
  if (body == null || (typeof body === 'object' && Object.keys(body).length === 0)) {
    return '(none)';
  }
  return JSON.stringify(body);
}

/**
 * Middleware: logs every request (method, path, payload) to a date-wise txt file.
 * Files: src/logs/log_2026_02_03.txt, src/logs/log_2026_02_04.txt, ...
 */
export function requestLogger(req, res, next) {
  const timestamp = new Date().toISOString();
  const method = req.method;
  const pathName = req.originalUrl || req.url;
  const payload = formatPayload(req.body);
  const ip = req.ip || req.socket?.remoteAddress || '-';

  const line = `[${timestamp}] ${method} ${pathName} | IP: ${ip} | Payload: ${payload}\n`;

  if (!fs.existsSync(LOGS_DIR)) {
    fs.mkdirSync(LOGS_DIR, { recursive: true });
  }

  const filePath = path.join(LOGS_DIR, getLogFileName());
  fs.appendFile(filePath, line, (err) => {
    if (err) console.error('Request log write error:', err.message);
  });

  next();
}
