/* Admin API: lets the site owner edit content and upload files from /admin.html
   without touching GitHub. Every change is a commit to the GitHub repository via
   the GitHub Contents API, which triggers a Cloudflare Pages redeploy.

   Who may use it: only signed-in users whose email is listed in ADMIN_EMAILS.
   The identity comes from the verified Cloudflare Access token (see _middleware.js).

   Environment variables (Worker > Settings > Variables and Secrets):
     ADMIN_EMAILS    comma-separated, e.g. "patrick.giguere@nm.org"
     GITHUB_TOKEN    (secret) fine-grained personal access token with
                     "Contents: Read and write" on this one repository
     GITHUB_REPO     e.g. "yourusername/nmh-accm-hub"
     GITHUB_BRANCH   usually "main"

   Only paths under public/content/ and public/files/ can be read or written. */

const EDITABLE_PREFIXES = ['public/content/', 'public/files/'];

function json(obj, status = 200) {
  return new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' } });
}
function safePath(p) {
  if (typeof p !== 'string' || p.includes('..') || p.startsWith('/') || p.includes('\\')) return null;
  if (!EDITABLE_PREFIXES.some(pre => p.startsWith(pre))) return null;
  if (!/^[A-Za-z0-9._\/-]+$/.test(p)) return null;
  return p;
}
export function isAdmin(env, email) {
  return (env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean).includes((email || '').toLowerCase());
}
function gh(env, path, init = {}) {
  const url = `https://api.github.com/repos/${env.GITHUB_REPO}/contents/${path}` + (init.method === 'GET' || !init.method ? `?ref=${env.GITHUB_BRANCH || 'main'}` : '');
  return fetch(url, {
    ...init,
    headers: {
      'Authorization': `Bearer ${env.GITHUB_TOKEN}`,
      'Accept': 'application/vnd.github+json',
      'User-Agent': 'nmh-accm-hub-admin',
      'X-GitHub-Api-Version': '2022-11-28',
      ...(init.headers || {})
    }
  });
}
function b64encodeUtf8(str) {
  const bytes = new TextEncoder().encode(str);
  let bin = ''; bytes.forEach(b => bin += String.fromCharCode(b));
  return btoa(bin);
}
function b64decodeUtf8(b64) {
  const bin = atob(b64.replace(/\n/g, ''));
  const bytes = Uint8Array.from(bin, c => c.charCodeAt(0));
  return new TextDecoder().decode(bytes);
}

export async function onRequest({ request, env, data }) {
  const email = (data && data.userEmail) || request.headers.get('cf-access-authenticated-user-email') || '';
  const url = new URL(request.url);
  const action = url.searchParams.get('action');

  if (action === 'whoami') return json({ email, admin: isAdmin(env, email), configured: !!(env.GITHUB_TOKEN && env.GITHUB_REPO) });
  if (!isAdmin(env, email)) return json({ error: 'Not authorized.' }, 403);
  if (!env.GITHUB_TOKEN || !env.GITHUB_REPO) return json({ error: 'Admin editing is not configured. Set GITHUB_TOKEN and GITHUB_REPO (DEPLOYMENT_GUIDE.md step 7).' }, 503);

  try {
    if (request.method === 'GET') {
      if (action === 'list') {
        const dir = safePath(url.searchParams.get('dir') || '');
        if (!dir) return json({ error: 'Bad path.' }, 400);
        const r = await gh(env, dir, { method: 'GET' });
        if (r.status === 404) return json({ entries: [] });
        if (!r.ok) return json({ error: 'GitHub ' + r.status }, 502);
        const arr = await r.json();
        return json({ entries: arr.map(e => ({ name: e.name, path: e.path, size: e.size, sha: e.sha, type: e.type })) });
      }
      if (action === 'read') {
        const path = safePath(url.searchParams.get('path') || '');
        if (!path) return json({ error: 'Bad path.' }, 400);
        const r = await gh(env, path, { method: 'GET' });
        if (!r.ok) return json({ error: 'GitHub ' + r.status }, r.status === 404 ? 404 : 502);
        const f = await r.json();
        return json({ path, sha: f.sha, content: b64decodeUtf8(f.content) });
      }
      return json({ error: 'Unknown action.' }, 400);
    }

    if (request.method === 'POST') {
      const body = await request.json();
      const path = safePath(body.path || '');
      if (!path) return json({ error: 'Bad path.' }, 400);
      const by = { name: 'ACCM Hub admin', email };

      if (body.action === 'write' || body.action === 'upload') {
        let contentB64;
        if (body.action === 'write') {
          if (typeof body.content !== 'string') return json({ error: 'No content.' }, 400);
          if (path.endsWith('.json')) { try { JSON.parse(body.content); } catch (e) { return json({ error: 'That is not valid JSON: ' + e.message }, 400); } }
          contentB64 = b64encodeUtf8(body.content);
        } else {
          if (typeof body.base64 !== 'string' || !body.base64) return json({ error: 'No file data.' }, 400);
          if (body.base64.length > 20 * 1024 * 1024) return json({ error: 'File too large (limit about 15 MB).' }, 400);
          contentB64 = body.base64;
        }
        // If the file exists and no sha was supplied, fetch it so the write replaces rather than fails.
        let sha = body.sha;
        if (!sha) { const r = await gh(env, path, { method: 'GET' }); if (r.ok) sha = (await r.json()).sha; }
        const r = await gh(env, path, {
          method: 'PUT',
          body: JSON.stringify({ message: body.message || `Update ${path} via admin page`, content: contentB64, sha, branch: env.GITHUB_BRANCH || 'main', committer: by, author: by })
        });
        if (!r.ok) return json({ error: 'GitHub rejected the change (' + r.status + '). ' + (await r.text()).slice(0, 300) }, 502);
        const out = await r.json();
        return json({ ok: true, sha: out.content && out.content.sha });
      }

      if (body.action === 'delete') {
        let sha = body.sha;
        if (!sha) { const r = await gh(env, path, { method: 'GET' }); if (!r.ok) return json({ error: 'File not found.' }, 404); sha = (await r.json()).sha; }
        const r = await gh(env, path, { method: 'DELETE', body: JSON.stringify({ message: `Delete ${path} via admin page`, sha, branch: env.GITHUB_BRANCH || 'main', committer: by, author: by }) });
        if (!r.ok) return json({ error: 'GitHub rejected the delete (' + r.status + ').' }, 502);
        return json({ ok: true });
      }
      return json({ error: 'Unknown action.' }, 400);
    }
    return json({ error: 'Method not allowed.' }, 405);
  } catch (e) {
    return json({ error: 'Admin error: ' + (e.message || e) }, 500);
  }
}
