/**
 * Route config for auth module. Used by modules/routes.js to auto-register APIs.
 */
export default {
  routes: [
    { method: 'post', path: '/login', action: 'login' },
    { method: 'post', path: '/signup', action: 'signup' },
    { method: 'post', path: '/refresh', action: 'refresh' },
    { method: 'post', path: '/logout', action: 'logout' },
  ],
};
