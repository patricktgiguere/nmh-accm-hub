/* Defence in depth for Cloudflare Access.
   Cloudflare Access enforces login at the edge before any request reaches this site.
   This middleware re-checks the Access JWT so that nothing is served if Access is
   accidentally disabled, misconfigured, or bypassed via a preview URL.

   Required environment variables (set in Pages > Settings > Variables):
     ACCESS_TEAM_DOMAIN  e.g.  nmh-accm.cloudflareaccess.com
     ACCESS_AUD          the Application Audience (AUD) tag from the Access application
   If either is missing, the middleware fails CLOSED and returns 503 so you notice. */

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

  // robots.txt must be reachable by crawlers so they see the Disallow. Everything else is gated.
  if (url.pathname === '/robots.txt') return next();

  if (!env.ACCESS_TEAM_DOMAIN || !env.ACCESS_AUD) {
    return new Response('Site misconfigured: ACCESS_TEAM_DOMAIN and ACCESS_AUD are not set. See DEPLOYMENT_GUIDE.md step 5.', { status: 503 });
  }

  const token = request.headers.get('cf-access-jwt-assertion') || (request.headers.get('cookie') || '').match(/CF_Authorization=([^;]+)/)?.[1];
  let claims = null;
  if (token) { try { claims = await verifyAccessJWT(token, env.ACCESS_TEAM_DOMAIN, env.ACCESS_AUD); } catch (e) { claims = null; } }
  if (!claims) {
    return new Response('Not signed in. Open the site at its main address to log in.', { status: 401, headers: { 'X-Robots-Tag': 'noindex' } });
  }
  data.userEmail = claims.email || '';
  const res = await next();
  // Belt and braces: ensure noindex even if _headers is edited incorrectly.
  const out = new Response(res.body, res);
  out.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
  return out;
}
