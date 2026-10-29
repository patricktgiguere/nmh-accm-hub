/* Draft cases are visible to administrators only.

   Case files are static assets under /content/cases/. This filter sits in front of them:
   - index.json: entries whose status is not "released" are removed unless the requester
     is an administrator (a valid Cloudflare Access login whose email is in ADMIN_EMAILS).
   - <id>.json: a case whose status is not "released" returns 404 to non-administrators.
   Fellows therefore cannot see, list, or fetch a draft, even by typing its address.
   Administrators see drafts with the "Draft" pill in the Case Library. To be recognised,
   an administrator must have signed in to /admin.html in this browser, which sets the
   Access cookie that is then sent with every page on the site. */
import { isAdmin } from './admin.js';

const CASES = '/content/cases/';

export function isCaseContent(pathname) {
  return pathname.startsWith(CASES) && pathname.endsWith('.json');
}

export async function filterCaseContent(request, env, data) {
  const url = new URL(request.url);
  const res = await env.ASSETS.fetch(request);
  if (!res.ok) return res;
  if (isAdmin(env, data.userEmail)) return res;

  let body;
  try { body = await res.json(); } catch { return res; }

  if (url.pathname === CASES + 'index.json') {
    if (Array.isArray(body.cases)) body.cases = body.cases.filter(c => c && c.status === 'released');
    return new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
  if (url.pathname === CASES + '_TEMPLATE.json' || body.status !== 'released') {
    return new Response(JSON.stringify({ error: 'Not found.' }), { status: 404, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
  }
  return new Response(JSON.stringify(body), { status: 200, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });
}
