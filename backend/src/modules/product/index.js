/**
 * Route config for product module. All routes require auth (Bearer token).
 */
export default {
  routes: [
    { method: 'get', path: '/products', action: 'list', middleware: ['auth'] },
    { method: 'post', path: '/products', action: 'create', middleware: ['auth'] },
  ],
};
