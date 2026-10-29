# Deployment guide

Written for a physician who has never deployed a website. Budget about 90 minutes the first time. You will create two free accounts (GitHub, Cloudflare) and optionally buy one domain name.

## Why this architecture

| Option | Per-user login | Files protected | Cost | Yearly maintenance | Verdict |
|---|---|---|---|---|---|
| Cloudflare Workers (static assets) + Cloudflare Access | Yes, one-time code to allowlisted emails | Yes, Access gates the whole hostname | Free (Access free tier covers up to 50 users) | Edit an email list in a web form | **Recommended** |
| Self-built magic links (Workers + KV + mail provider) | Yes | Yes, if written correctly | Free to low | You own session security, token expiry, and the mailer | More code for you to maintain, no benefit over Access |
| Netlify or Vercel password protection | No, shared password (or paid per-user tiers) | Partial | Paid tiers for anything beyond a shared password | Low | Fails your per-user requirement |

Cloudflare Access wins because the hard part (identity, sessions, one-time codes, file protection) is handled by a product that exists for exactly this, and the allowlist is a text box you edit once a year.

## Before you start

- Decide on a site address. Easiest: a domain you buy through Cloudflare (roughly $10 per year, for example `accm-hub.org` or similar). Alternative: the free `*.pages.dev` address Cloudflare gives you, which works but is less memorable and makes the email sending step slightly more awkward.
- Have this project folder on your computer.

## Step 1. Put the project on GitHub

1. Create a free account at https://github.com.
2. Click the "+" at top right, "New repository". Name it `nmh-accm-hub`. Set it to **Private**. Create.
3. On the empty repository page, click "uploading an existing file". Drag the entire contents of the project folder (the `public` folder, the `functions` folder, `wrangler.toml`, `README.md`, this guide) into the browser. Click "Commit changes".

GitHub is now the place you edit content. Cloudflare will watch it and republish automatically.

## Step 2. Create the Cloudflare Worker

1. Create a free account at https://dash.cloudflare.com.
2. Left menu: "Workers & Pages". Click "Create", then "Import a repository" (connect to Git).
3. Authorize GitHub and select the `nmh-accm-hub` repository.
4. Build settings: leave the defaults. Build command empty, deploy command `npx wrangler deploy`, root directory `/`. Click "Create and deploy".
5. After a minute the Worker is live at an address like `https://nmh-accm-hub.<yourname>.workers.dev`. Opening it shows a 503 "Site misconfigured" message. That is expected and correct: the site refuses to serve anything until Access is wired up in Steps 4 and 5.

## Step 3. Add your domain (optional but recommended)

1. In Cloudflare, "Domain Registration", "Register Domains", buy your chosen name.
2. Back in Workers & Pages, open the Worker, "Settings", "Domains & Routes", "Add", "Custom domain", enter the domain. Cloudflare configures DNS automatically because it manages the domain.

## Step 4. Turn on Cloudflare Access

Done on 2026-10-26. Recorded here so it can be repeated or audited.

1. Left menu: "Zero Trust" (Cloudflare One). The team name was auto-assigned: `wandering-scene-8ab6`. It appears only in the login page address. It can be renamed under Settings if desired, in which case `ACCESS_TEAM_DOMAIN` in `wrangler.toml` and the dashboard must be updated to match.
2. Login method: "Integrations", "Identity providers". **One-time PIN** is the only provider. (Cloudflare auto-adds a "Cloudflare" provider on new accounts, which would ask fellows for Cloudflare accounts. It was deleted.)
3. "Access controls", "Applications", "Create new application", "Self-hosted and private".
4. Under Public hostnames click "Switch to custom input" and enter the `workers.dev` address. When a custom domain is added later, add it as a second public hostname on the same application. **Both must be listed**, otherwise the workers.dev address is an unprotected back door.
5. Policy: "Create new policy". Rule: Include, selector "Emails", one address per entry. Name `Allowed users`, action Allow. Save.
6. Name the application `ACCM Hub`, session duration 24 hours, Create.
7. Open the application, "Additional settings" tab, copy the **Application Audience (AUD) Tag**.

**Adding or removing a fellow** is step 5's email list: Zero Trust, Access controls, Policies, "Allowed users", edit, save.

## Step 4b. Shared fellowship password (added 2026-10-28)

Fellows no longer need an email on the Access list. The site is gated by one shared password; Access now covers only the admin page.

1. Worker, Settings, Variables and Secrets, add a **secret** named `SITE_PASSWORD` with the password. Entry is case-insensitive and ignores spaces.
2. Zero Trust, Access, Applications, open "ACCM Hub", edit the application's public hostname entries so the path is `admin.html` (and a second entry for `api/admin`) rather than the whole site. Keep the "Allowed users" policy; it now lists administrators only.
3. Open the site in a private window. You should see the password page, not an email prompt. Open `/admin.html` and you should get the email one-time code.

Wrong attempts are slowed by 1.5 seconds and an IP is refused after 10 failures in 15 minutes. Failure counts use the `RATE_LIMIT` KV namespace when it is bound and are otherwise kept in memory per Worker instance (good enough; see Step 6 for the KV binding).

## Step 4c. Custom domain (done 2026-10-28)

`nmaccm.org` was registered through Cloudflare Registrar (auto-renew on) and attached to the Worker under Domains & Routes as `nmaccm.org` and `www.nmaccm.org`. Cloudflare manages the DNS records and certificate. The Access application lists `admin.html` and `api/admin` on both `nmaccm.org` and the workers.dev hostname. The shared password gate lives in the Worker and applies to every hostname.

## Step 5. Tell the site about Access

Done on 2026-10-26. `ACCESS_TEAM_DOMAIN` and `ACCESS_AUD` are set both in the Worker's Variables and Secrets and in `wrangler.toml` under `[vars]`, so they survive redeploys. If the Access application is ever recreated, update the AUD tag in both places.

1. Visit your site. You should be sent to a Cloudflare login page asking for your email. Enter it, get the code by email, enter the code. The Home page appears.

Test the back door: open the `workers.dev` address in a private window. You should see the same login page, not the site.

## Step 6. Contact form email (done 2026-10-28, Cloudflare Email Routing)

The form sends through Cloudflare's own Email Routing, so there is no third-party account. Mail goes from `hub@nmaccm.org` to `CONTACT_TO`.

1. Cloudflare, Email Service, Email Routing, Destination addresses: `patrick.giguere@nm.org` was added and must be **verified** by clicking the link Cloudflare emails to it. Until it is verified, sends fail.
2. Email Routing for `nmaccm.org`: enabled, DNS records (MX, SPF, DKIM) added automatically.
3. `wrangler.toml` has a `[[send_email]]` binding named `EMAIL`. Worker variables: `CONTACT_TO` = `patrick.giguere@nm.org`, `CONTACT_FROM` = `hub@nmaccm.org`, `RATE_LIMIT_PER_HOUR` = `5` (optional).
4. Rate limiting storage (optional but recommended): left menu "Storage & Databases", "KV", "Create a namespace", name `accm-hub-ratelimit`. Copy its ID. Then in `wrangler.toml` remove the `# ` from the three lines beginning `[[kv_namespaces]]`, pasting the ID in place of `paste-your-namespace-id-here`. Commit. This also makes login attempt limiting exact.
5. Send yourself a test question from the Contact page. It should arrive within a minute, with reply-to set to the name and email entered in the form. NM's mail filter may junk the first one.

A note on where the email lands: NM's mail filters may quarantine mail from an unfamiliar domain the first time. Check junk, and if needed ask NM IT to allowlist the sender address.

## Step 7. Turn on the admin page (editing without GitHub)

The site has a page at `/admin.html` where you can edit the orientation text, upload documents, and edit or create cases. It works by writing changes to your GitHub repository on your behalf, so it needs a key.

1. GitHub, click your profile photo, Settings, Developer settings, Personal access tokens, Fine-grained tokens, "Generate new token".
2. Name: `accm-hub-admin`. Expiration: one year (set a calendar reminder to renew). Repository access: "Only select repositories", choose `nmh-accm-hub`. Permissions: Repository permissions, Contents: "Read and write". Generate and copy the token.
3. Cloudflare, Workers & Pages, your Worker, Settings, Variables and Secrets:
   - `GITHUB_TOKEN`, type **Secret**, value: the token.
   - `GITHUB_REPO`, value: `yourgithubusername/nmh-accm-hub`.
   - `GITHUB_BRANCH`, value: `main`.
   - `ADMIN_EMAILS`, value: `patrick.giguere@nm.org` (add the PD's email after a comma if they should edit too).
4. Visit `/admin.html`. It should greet you as administrator. Anyone not in `ADMIN_EMAILS` sees a "not an administrator" message and nothing else.

Everything you save on the admin page becomes a commit in GitHub and goes live about a minute later. The GitHub web editor still works as a fallback.

## Step 8. Final checks

- Visit `/robots.txt` in a private window without logging in. It should display `Disallow: /`.
- View one of the example resources. Open the same file address in a private window. It should demand login.
- Open a case on your phone. Commit an answer, close the browser, reopen. The answer should still be there.
- Check that the draft badge appears on the two cases. They are flagged `draft` until you clear their review checklists.

## Governance: approvals to obtain before uploading protocols

The site itself contains only synthetic cases and your own writing. Institutional documents are different. Before uploading anything that is NM property or contains third-party material:

1. **NM Information Security.** This site stores files on Cloudflare's network under an account you personally own. Ask whether hosting internal (non-PHI) educational and protocol documents on a personally administered, access-controlled external site is permitted, and whether they want the account registered to an institutional email instead. Get the answer in writing.
2. **Compliance / Privacy.** Confirm that no PHI will ever be present, and that the warning on the contact form satisfies their expectations. The site collects no learner data, which you should state explicitly because it simplifies their review.
3. **Legal / Policy owner for each protocol.** Many protocols carry internal review dates and are managed in a policy system. Hosting a copy creates a stale-copy risk. Preferred approach: link to the intranet location rather than hosting the file, which also sidesteps the storage question entirely.
4. **Copyright and licensing.** Journal PDFs, textbook chapters, and society guidelines are typically licensed to the institution for personal use, not for redistribution on a site you run. Link to the publisher or library proxy page rather than uploading the PDF. Society guideline documents are usually free to link; some are not free to host.
5. **GME office.** Not an approval as such, but they should know the site exists, since it is part of the fellowship's educational program and may appear in accreditation materials.

Where the data lives: static files and case content are on Cloudflare's global network as Worker assets (US-based account, content replicated worldwide for delivery). Access login identities are stored by Cloudflare Zero Trust. Contact-form emails are sent by Cloudflare Email Routing and land in your NM mailbox. Fellow notes exist only in each fellow's browser.

## Assumptions made in this build

- You own the Cloudflare and GitHub accounts personally, as you stated.
- Fellows may use any email address; the allowlist is by individual email, not by domain. If every fellow has an @northwestern.edu or @nm.org address, you can add a domain rule to the Access policy for convenience, but keep the explicit list as the primary control.
- Fewer than 50 users total, which keeps Access on the free tier.
- Fellows will use personal phones and shared hospital workstations. Local-only notes therefore do not sync. The export and import buttons are the mitigation. If this turns out to be a real friction, the alternative is opt-in server-side notes keyed to the Access identity, which would require a privacy review and is deliberately not built.
- The two drafted cases are marked `draft` and will stay that way until you clear each `reviewChecklist`. The remaining nine cases are listed in `index.json` as `hidden` placeholders.
- Cloudflare Email Routing is used for email. Any transactional email API would work with a small change to `src/contact.js`.
- The contact form does not use a CAPTCHA. Access authentication, a honeypot field, and per-user rate limiting are the controls. If you ever remove Access, add Cloudflare Turnstile to the form before going live.

## If something breaks

- Site shows 503 "misconfigured": the two Access variables are missing. Check Step 5.
- Login loop or 401: the AUD tag does not match. Re-copy it from the Access application.
- Contact form says "not configured": a Resend variable is missing. Check Step 6.
- Admin page says "Editing not configured": GITHUB_TOKEN or GITHUB_REPO is missing. Check Step 7. If saves fail with a GitHub error, the token may have expired or lack Contents write permission.
- A page says "could not load": a JSON file has a syntax error. See the README.
- Anything else: copy the exact error text and the file you last edited into a new chat and ask for help.
