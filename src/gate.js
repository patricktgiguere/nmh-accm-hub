/* Shared-password gate for fellows.

   Fellows enter one shared password (SITE_PASSWORD secret) on /login. On success the
   Worker sets a signed, HttpOnly cookie that lasts 30 days. The admin page and admin
   API are NOT covered here; they stay behind Cloudflare Access (see access.js).

   Secret (Worker > Settings > Variables and Secrets):
     SITE_PASSWORD   the shared password. Compared case-insensitively with all
                     whitespace removed, so "ACCM Fellowship" and "accmfellowship" match.
                     Changing it invalidates every existing cookie.

   Wrong attempts: a 1.5 s delay on every failure, and after 10 failures from one IP in
   15 minutes the IP is refused for 15 minutes. Counts live in the RATE_LIMIT KV namespace
   when it is bound, otherwise in this isolate's memory (best effort). */

const COOKIE = 'accm_hub';
const DAYS = 30;
const MAX_FAILS = 10;
const WINDOW_S = 15 * 60;
const memFails = new Map();

function normalize(s) { return String(s || '').toLowerCase().replace(/\s+/g, ''); }

async function cookieKey(env) {
  const raw = new TextEncoder().encode('accm-hub-cookie:' + normalize(env.SITE_PASSWORD));
  return crypto.subtle.importKey('raw', raw, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign', 'verify']);
}
function b64url(bytes) {
  return btoa(String.fromCharCode(...new Uint8Array(bytes))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
async function sign(env, exp) {
  const key = await cookieKey(env);
  const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(String(exp)));
  return `${exp}.${b64url(sig)}`;
}

export async function hasValidCookie(request, env) {
  if (!env.SITE_PASSWORD) return false;
  const m = (request.headers.get('cookie') || '').match(new RegExp(COOKIE + '=([^;]+)'));
  if (!m) return false;
  const [exp, sig] = m[1].split('.');
  if (!exp || !sig) return false;
  if (parseInt(exp, 10) < Math.floor(Date.now() / 1000)) return false;
  const expected = await sign(env, exp);
  if (expected.length !== m[1].length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) diff |= expected.charCodeAt(i) ^ m[1].charCodeAt(i);
  return diff === 0;
}

async function getFails(env, ip) {
  if (env.RATE_LIMIT) return parseInt((await env.RATE_LIMIT.get('login:' + ip)) || '0', 10);
  const e = memFails.get(ip);
  return e && e.until > Date.now() ? e.n : 0;
}
async function addFail(env, ip) {
  const n = (await getFails(env, ip)) + 1;
  if (env.RATE_LIMIT) await env.RATE_LIMIT.put('login:' + ip, String(n), { expirationTtl: WINDOW_S });
  else memFails.set(ip, { n, until: Date.now() + WINDOW_S * 1000 });
}

function page(opts) {
  const msg = opts.error ? `<p class="err" role="alert">${opts.error}</p>` : '';
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow, noarchive"><title>Sign in · ACCM Curriculum Hub</title>
<style>
:root{--bg:#f7f6fa;--ink:#1f1a2e;--ink-soft:#4f4a63;--accent:#3b1f6e;--accent-ink:#fff;--card:#fff;--line:#d9d4e6;--err:#9b1c31}
@media (prefers-color-scheme:dark){:root{--bg:#15111f;--ink:#ebe6f3;--ink-soft:#b3abc4;--accent:#c9b3ec;--accent-ink:#1f1a2e;--card:#1e1830;--line:#3a3250;--err:#f0a3b1}}
*{box-sizing:border-box}body{margin:0;background:var(--bg);color:var(--ink);font:16px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:16px}
main{width:100%;max-width:420px;background:var(--card);border:1px solid var(--line);border-radius:12px;padding:28px}
h1{font-size:1.25rem;margin:0 0 4px}p{margin:0 0 16px;color:var(--ink-soft)}label{display:block;font-weight:600;margin-bottom:6px}
input{width:100%;font:inherit;padding:10px 12px;border:1px solid var(--line);border-radius:8px;background:var(--bg);color:var(--ink)}
button{margin-top:14px;width:100%;font:inherit;font-weight:600;padding:11px;border:0;border-radius:8px;background:var(--accent);color:var(--accent-ink);cursor:pointer}
.err{color:var(--err);font-weight:600}.small{font-size:.85rem;margin-top:16px;margin-bottom:0}
</style></head><body><main>
<h1>ACCM Curriculum Hub</h1>
<p>Anesthesiology Critical Care Medicine Fellowship, Northwestern Memorial Hospital. This site is for fellows and faculty.</p>
${msg}
<form method="post" action="/login">
<input type="hidden" name="next" value="${opts.next}">
<label for="pw">Fellowship password</label>
<input id="pw" name="password" type="password" autocomplete="current-password" autofocus required>
<button type="submit">Enter</button>
</form>
<p class="small">Ask a co-fellow or the associate program director if you do not have the password. You will stay signed in on this device for ${DAYS} days.</p>
</main></body></html>`;
}

function safeNext(v) {
  return typeof v === 'string' && v.startsWith('/') && !v.startsWith('//') && !v.includes('\n') ? v.replace(/"/g, '') : '/';
}

const htmlHeaders = { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store', 'X-Robots-Tag': 'noindex, nofollow, noarchive' };

export async function loginGet(request) {
  const url = new URL(request.url);
  return new Response(page({ next: safeNext(url.searchParams.get('next')) }), { headers: htmlHeaders });
}

export async function loginPost(request, env) {
  if (!env.SITE_PASSWORD) return new Response('Site misconfigured: SITE_PASSWORD is not set. See DEPLOYMENT_GUIDE.md.', { status: 503 });
  const form = await request.formData();
  const next = safeNext(form.get('next'));
  const ip = request.headers.get('cf-connecting-ip') || 'unknown';

  if ((await getFails(env, ip)) >= MAX_FAILS) {
    return new Response(page({ next, error: 'Too many attempts. Try again in 15 minutes.' }), { status: 429, headers: htmlHeaders });
  }
  if (normalize(form.get('password')) !== normalize(env.SITE_PASSWORD)) {
    await addFail(env, ip);
    await new Promise(r => setTimeout(r, 1500));
    return new Response(page({ next, error: 'That password is not right.' }), { status: 401, headers: htmlHeaders });
  }
  const exp = Math.floor(Date.now() / 1000) + DAYS * 86400;
  const value = await sign(env, exp);
  return new Response(null, {
    status: 303,
    headers: {
      'Location': next,
      'Set-Cookie': `${COOKIE}=${value}; Path=/; Max-Age=${DAYS * 86400}; HttpOnly; Secure; SameSite=Lax`
    }
  });
}

export function logout() {
  return new Response(null, {
    status: 303,
    headers: { 'Location': '/login', 'Set-Cookie': `${COOKIE}=; Path=/; Max-Age=0; HttpOnly; Secure; SameSite=Lax` }
  });
}

export function redirectToLogin(request) {
  const url = new URL(request.url);
  const next = encodeURIComponent(url.pathname + url.search);
  return new Response(null, { status: 302, headers: { 'Location': '/login?next=' + next, 'X-Robots-Tag': 'noindex' } });
}
