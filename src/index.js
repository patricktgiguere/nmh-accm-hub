/* Worker entry point. Every request passes through the Access check in access.js,
   then is routed to the contact API, the admin API, or the static site in public/. */
import { onRequest as requireAccess } from './access.js';
import { onRequestPost as contactPost } from './contact.js';
import { onRequest as admin } from './admin.js';

export default {
  async fetch(request, env) {
    const data = {};
    const next = async () => {
      const url = new URL(request.url);
      if (url.pathname === '/api/contact') {
        return request.method === 'POST' ? contactPost({ request, env, data }) : new Response('Method not allowed', { status: 405 });
      }
      if (url.pathname === '/api/admin') return admin({ request, env, data });
      return env.ASSETS.fetch(request);
    };
    return requireAccess({ request, env, data, next });
  }
};
