/* Worker entry point. Every request passes through the gate in access.js (shared
   password for the site, Cloudflare Access for admin), then is routed to the contact
   API, the admin API, or the static site in public/. */
import { onRequest as requireAccess } from './access.js';
import { onRequestPost as contactPost } from './contact.js';
import { onRequest as admin } from './admin.js';
import { loginGet, loginPost, logout } from './gate.js';
import { isCaseContent, filterCaseContent } from './content.js';

export default {
  async fetch(request, env) {
    const data = {};
    const next = async () => {
      const url = new URL(request.url);
      if (url.pathname === '/login') return request.method === 'POST' ? loginPost(request, env) : loginGet(request);
      if (url.pathname === '/logout') return logout();
      if (url.pathname === '/api/contact') {
        return request.method === 'POST' ? contactPost({ request, env, data }) : new Response('Method not allowed', { status: 405 });
      }
      if (url.pathname === '/api/admin') return admin({ request, env, data });
      if (isCaseContent(url.pathname)) return filterCaseContent(request, env, data);
      return env.ASSETS.fetch(request);
    };
    return requireAccess({ request, env, data, next });
  }
};
