/* POST /api/contact
   Sends a fellow's question to the APD by email using Resend (https://resend.com).
   Spam and abuse controls:
     1. The site is behind Cloudflare Access, so only allowlisted users reach this endpoint,
        and the sender's identity comes from the verified Access token (not from the form).
     2. Honeypot field ("website") must be empty.
     3. Rate limit: at most RATE_LIMIT_PER_HOUR messages per user per hour, tracked in KV.
     4. Message length capped; HTML stripped.

   Environment variables (Pages > Settings > Variables and Secrets):
     RESEND_API_KEY   (secret)   from resend.com
     CONTACT_TO       patrick.giguere@nm.org
     CONTACT_FROM     e.g. "ACCM Hub <hub@yourdomain.org>"  (a domain you verified in Resend)
     RATE_LIMIT_PER_HOUR  optional, default 5
   KV binding (Pages > Settings > Bindings):  RATE_LIMIT */

export async function onRequestPost({ request, env, data }) {
  const json = (obj, status = 200) => new Response(JSON.stringify(obj), { status, headers: { 'Content-Type': 'application/json' } });

  const fromEmail = (data && data.userEmail) || request.headers.get('cf-access-authenticated-user-email') || '';
  if (!fromEmail) return json({ error: 'Not signed in.' }, 401);

  let body;
  try { body = await request.json(); } catch { return json({ error: 'Bad request.' }, 400); }
  if (body.website) return json({ ok: true }); // honeypot: pretend success, send nothing

  const message = String(body.message || '').trim();
  const caseTitle = String(body.caseTitle || 'General question').slice(0, 200);
  if (message.length < 5) return json({ error: 'Please write a question.' }, 400);
  if (message.length > 4000) return json({ error: 'Message too long.' }, 400);

  // Rate limiting
  const limit = parseInt(env.RATE_LIMIT_PER_HOUR || '5', 10);
  if (env.RATE_LIMIT) {
    const hour = Math.floor(Date.now() / 3600000);
    const key = `contact:${fromEmail.toLowerCase()}:${hour}`;
    const n = parseInt((await env.RATE_LIMIT.get(key)) || '0', 10);
    if (n >= limit) return json({ error: 'Too many messages this hour. Please try again later.' }, 429);
    await env.RATE_LIMIT.put(key, String(n + 1), { expirationTtl: 3700 });
  }

  if (!env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM) {
    return json({ error: 'Contact form is not configured yet. Email the APD directly.' }, 503);
  }

  const clean = s => s.replace(/[<>]/g, c => ({ '<': '&lt;', '>': '&gt;' }[c]));
  const text = `Case / topic: ${caseTitle}\nFrom: ${fromEmail}\nPage: ${body.page || ''}\n\n${message}`;
  const html = `<p><strong>Case / topic:</strong> ${clean(caseTitle)}<br><strong>From:</strong> ${clean(fromEmail)}<br><strong>Page:</strong> ${clean(String(body.page || ''))}</p><pre style="white-space:pre-wrap;font-family:inherit">${clean(message)}</pre>`;

  const r = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM,
      to: [env.CONTACT_TO],
      reply_to: fromEmail,
      subject: `[ACCM Hub] ${caseTitle}`,
      text, html
    })
  });
  if (!r.ok) {
    const detail = await r.text().catch(() => '');
    console.log('Resend error', r.status, detail);
    return json({ error: 'Email service error. Try again later.' }, 502);
  }
  return json({ ok: true });
}

export async function onRequestGet() {
  return new Response('Method not allowed', { status: 405 });
}
