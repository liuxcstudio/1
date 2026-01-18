import { handleRegister, handleLogin, handleVerify, handleLogout } from './handlers/auth.js';
import { handleGenerateCode, handleListCodes, handleValidateCode } from './handlers/codes.js';
import { ASSETS } from './assets.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    if (path === '/' && method === 'GET') {
      return new Response(ASSETS.index, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    }

    if (path === '/admin' && method === 'GET') {
      return new Response(ASSETS.admin, {
        headers: { 'Content-Type': 'text/html;charset=UTF-8' }
      });
    }

    if (path === '/js/app.js' && method === 'GET') {
      return new Response(ASSETS.appJs, {
        headers: { 'Content-Type': 'application/javascript;charset=UTF-8' }
      });
    }

    if (path === '/js/admin.js' && method === 'GET') {
      return new Response(ASSETS.adminJs, {
        headers: { 'Content-Type': 'application/javascript;charset=UTF-8' }
      });
    }

    if (path === '/api/register' && method === 'POST') {
      return handleRegister(request, env);
    }

    if (path === '/api/login' && method === 'POST') {
      return handleLogin(request, env);
    }

    if (path === '/api/verify' && method === 'GET') {
      return handleVerify(request, env);
    }

    if (path === '/api/logout' && method === 'POST') {
      return handleLogout(request, env);
    }

    if (path === '/api/codes/generate' && method === 'POST') {
      return handleGenerateCode(request, env);
    }

    if (path === '/api/codes/list' && method === 'GET') {
      return handleListCodes(request, env);
    }

    if (path === '/api/codes/validate' && method === 'POST') {
      return handleValidateCode(request, env);
    }

    return new Response('Not Found', { status: 404 });
  }
};