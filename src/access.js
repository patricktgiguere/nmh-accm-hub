/* Two gates, one middleware. Runs on every request (see index.js).

   1. Admin (/admin.html and /api/admin): Cloudflare Access enforces an email one-time
      PIN at the edge, scoped to those paths in the Access application. This middleware
      re-checks the Access JWT so nothing is served if Access is disabled or bypassed.
   2. Everything else: the shared fellowship password (gate.js). A valid Access JWT is
      also accepted, so an admin signed in through Access never sees the password page.

   Required environment variables (Worker > Settings > Variables and Secrets):
     ACCESS_TEAM_DOMAIN  e.g.  nmh-accm.cloudflareaccess.com
     ACCESS_AUD          the Application Audience (AUD) tag from the Access application
     SITE_PASSWORD       (secret) the shared fellowship password
   If any is missing, the middleware fails CLOSED and returns 503 so you notice. */
import { hasValidCookie, redirectToLogin } from './gate.js';

const ADMIN_PATHS = ['/admin.html', '/admin', '/api/admin'];
const OPEN_PATHS = ['/robots.txt', '/login', '/logout'];

const certCache = { keys: null, fetched: 0 };

async function getKeys(teamDomain) {
  const now = Date.now();
  if (certCache.keys && now - certCache.fetched < 60 * 60 * 1000) return certCache.keys;
  const r = await fetch(`https://${teamDomain}/cdn-cgi/access/certs`);
  if (!r.ok) throw new Error('certs ' + r.status);
  const j = await r.json();
  certCache.keys = j.keys; certCache.fetched = now;
  return certCache.keys;
}

function b64urlToBytes(s) {
  s = s.replace(/-/g, '+').replace(/_/g, '/'); while (s.length % 4) s += '=';
  return Uint8Array.from(atob(s), c => c.charCodeAt(0));
}

async function verifyAccessJWT(token, teamDomain, aud) {
  const [h, p, s] = token.split('.');
  if (!h || !p || !s) return null;
  const header = JSON.parse(new TextDecoder().decode(b64urlToBytes(h)));
  const payload = JSON.parse(new TextDecoder().decode(b64urlToBytes(p)));
  if (header.alg !== 'RS256') return null;
  const keys = await getKeys(teamDomain);
  const jwk = keys.find(k => k.kid === header.kid);
  if (!jwk) return null;
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64urlToBytes(s), new TextEncoder().encode(h + '.' + p));
  if (!ok) return null;
  const now = Math.floor(Date.now() / 1000);
  if (payload.exp && payload.exp < now) return null;
  if (payload.iss !== `https://${teamDomain}`) return null;
  const auds = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!auds.includes(aud)) return null;
  return payload;
}

export async function onRequest(context) {
  const { request, env, next, data } = context;
  const url = new URL(request.url);

  // robots.txt must be reachable by crawlers so they see the Disallow. The login page is open by nature.
  if (OPEN_PATHS.includes(url.pathname)) return next();

  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD || !env.SITE_PASSWORD) {
    return new Response('Site misconfigured: ACCESS_TEAM_DOMAIN, ACCESS_AUD, and SITE_PASSWORD must all be set. See DEPLOYMENT_GUIDE.md.', { status: 503 });
  }

  const token = request.headers.get('cf-access-jwt-assertion') || (request.headers.get('cookie') || '').match(/CF_Authorization=([^;]+)/)?.[1];
  let claims = null;
  if (token) { try { claims = await verifyAccessJWT(token, env.ACCESS_TEAM_DOMAIN, env.ACCESS_AUD); } catch (e) { claims = null; } }
  const isAdminPath = ADMIN_PATHS.some(p => url.pathname === p || url.pathname.startsWith(p + '/'));

  if (isAdminPath) {
    if (!claims) return new Response('Not signed in. Open the admin page at its main address to log in.', { status: 401, headers: { 'X-Robots-Tag': 'noindex' } });
  } else if (!claims && !(await hasValidCookie(request, env))) {
    if (url.pathname.startsWith('/api/')) return new Response(JSON.stringify({ error: 'Not signed in.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
    return redirectToLogin(request);
  }
  data.userEmail = claims ? (claims.email || '') : '';
  const res = await next();
  // Belt and braces: ensure noindex even if _headers is edited incorrectly.
  const out = new Response(res.body, res);
  out.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return out;
}
