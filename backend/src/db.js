import mysql from 'mysql2/promise';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Build MySQL connection config from environment variables.
 * Get values from Aiven Console: https://console.aiven.io → your project → MySQL service → Overview.
 */
function getDbConfig() {
  if (process.env.MYSQL_URI) {
    return { uri: process.env.MYSQL_URI };
  }

  const host = process.env.MYSQL_HOST;
  const port = process.env.MYSQL_PORT || 25060;
  const user = process.env.MYSQL_USER;
  const password = process.env.MYSQL_PASSWORD;
  const database = process.env.MYSQL_DATABASE;

  if (!host || !user || !password || !database) {
    throw new Error(
      'Missing MySQL env: set MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE (or MYSQL_URI). ' +
        'Get them from Aiven Console → your MySQL service → Overview.'
    );
  }

  const config = {
    host,
    port: Number(port),
    user,
    password,
    database,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  const caPath = process.env.MYSQL_SSL_CA_PATH;
  if (caPath) {
    const fullPath = path.isAbsolute(caPath) ? caPath : path.join(__dirname, caPath);
    if (fs.existsSync(fullPath)) {
      config.ssl = {
        ca: fs.readFileSync(fullPath),
        rejectUnauthorized: true,
      };
    }
  } else if (process.env.MYSQL_SSL === 'true' || process.env.MYSQL_SSL === '1') {
    // Aiven (and many managed DBs) use certs that trigger "self-signed certificate in certificate chain".
    // Accept the server cert without strict CA verification when no MYSQL_SSL_CA_PATH is set.
    config.ssl = { rejectUnauthorized: false };
  }

  return config;
}

let pool = null;

export async function getPool() {
  if (pool) return pool;
  const config = getDbConfig();
  if (config.uri) {
    pool = mysql.createPool(config.uri);
  } else {
    pool = mysql.createPool(config);
  }
  return pool;
}

export async function query(sql, params = []) {
  const p = await getPool();
  const [rows] = await p.execute(sql, params);
  return rows;
}

/**
 * Create users table if it doesn't exist. Call on server startup so deployment won't fail.
 */
export async function ensureTables() {
  const p = await getPool();
  await p.execute(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
  await p.execute(`
    CREATE TABLE IF NOT EXISTS products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      description TEXT,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);
}

export { getDbConfig };
