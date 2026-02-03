import { Router } from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { requireAuth } from '../middleware/authMiddleware.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const middlewares = { auth: requireAuth };

/**
 * Scans modules folder for subfolders, loads each module's index.js (route config)
 * and controller. Supports route.middleware: ['auth'] to protect routes with JWT.
 */
export default async function registerModules() {
  const router = Router();
  const modulesDir = __dirname;
  const entries = fs.readdirSync(modulesDir, { withFileTypes: true });
  const subdirs = entries.filter((e) => e.isDirectory());

  for (const dir of subdirs) {
    const moduleName = dir.name;
    const configPath = path.join(modulesDir, moduleName, 'index.js');
    const controllerPath = path.join(modulesDir, moduleName, 'controllers', `${moduleName}.controller.js`);

    if (!fs.existsSync(configPath) || !fs.existsSync(controllerPath)) {
      continue;
    }

    const config = (await import(`./${moduleName}/index.js`)).default;
    const controller = await import(`./${moduleName}/controllers/${moduleName}.controller.js`);

    for (const route of config.routes) {
      const { method, path: routePath, action, middleware: routeMiddleware } = route;
      const handler = controller[action];
      if (!handler || typeof router[method] !== 'function') continue;

      const chain = [];
      if (Array.isArray(routeMiddleware)) {
        for (const name of routeMiddleware) {
          if (middlewares[name]) chain.push(middlewares[name]);
        }
      }
      chain.push(handler);
      router[method](routePath, ...chain);
    }
  }

  return router;
}
