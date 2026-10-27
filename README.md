# ACCM Fellowship Curriculum Hub

A private, per-user authenticated curriculum site for the Anesthesia Critical Care Medicine Fellowship at Northwestern Memorial Hospital. Static HTML with a single small server function for the contact form. Hosted on Cloudflare Pages, gated by Cloudflare Access.

Read `DEPLOYMENT_GUIDE.md` first if you have not deployed yet. This file is the day-to-day manual.

## How it works, in one paragraph

Every page is a plain HTML file in `public/`. Content lives in `public/content/` as Markdown and JSON files that the pages load and render in the browser. There is no build step and no database. Cloudflare Access sits in front of the whole site: nobody sees anything, including PDFs in `public/files/`, without logging in with an email on your allowlist. A fellow's progress and notes are stored only in their own browser. The contact form posts to `functions/api/contact.js`, which emails you through Resend.

## Folder map

```
public/                  everything the browser can see (after login)
  index.html             Home
  orientation.html       Orientation page (reads content/orientation.md)
  cases.html             Case Library list (reads content/cases/index.json)
  case.html              Renders one case (reads content/cases/<id>.json)
  resources.html         Resources index (reads content/resources/manifest.json)
  contact.html           General contact form
  robots.txt, _headers   Noindex and security headers
  assets/                CSS and JavaScript. You should not need to edit these.
  content/
    orientation.md       Edit freely. Plain text with simple Markdown.
    cases/index.json     The list the library shows
    cases/<id>.json      One file per case
    cases/_TEMPLATE.json Copy this to start a new case
    resources/manifest.json  The list the Resources page shows
  files/                 Put PDFs and documents here
functions/
  _middleware.js         Verifies the Cloudflare Access login on every request
  api/contact.js         Contact form email sender
wrangler.toml            Cloudflare project settings
```

## Making changes

There are two ways. Use the first.

**The admin page.** Log in to the site as usual and open `/admin.html` (there is a "Faculty admin" link in the Home page footer). Only emails listed in the `ADMIN_EMAILS` setting can use it. From there you can edit the orientation text, upload documents and add them to the Resources index, change a case's status, edit a case, or start a new case from the template. Each save goes live in about a minute. Setup is Step 7 of the deployment guide.

**GitHub directly.** Everything below describes the files themselves, which you can also edit in the GitHub web interface: open the file, click the pencil icon, edit, then "Commit changes". Useful if the admin page is ever unavailable.

If a page shows "could not load", the most common cause is a JSON syntax error: a missing comma, a stray quote, or a quote inside text that was not escaped as `\"`. Paste the file into https://jsonlint.com to find the line.

### Add a fellow

1. Cloudflare dashboard, Zero Trust, Access, Applications, open "ACCM Hub".
2. Open the policy "Allowed users", edit the Include rule "Emails", add the fellow's email, save.
3. That is all. They go to the site, enter their email, receive a one-time code, and are in. No code changes, no deploy.

### Remove a fellow

Same screen, delete the email from the list, save. Their session expires at the next login check (the session length is set in the Access application settings; the deployment guide sets it to 24 hours).

### Annual rollover

In June or July:

1. Access policy: remove graduating fellows, add incoming fellows.
2. `content/orientation.md`: update schedule, contacts, and dates.
3. `content/resources/manifest.json`: update the `updated` field on anything you replaced.
4. Review each case's `version` and `status`. Anything you reviewed over the year can move from `draft` to `released`.
5. Optional: ask departing fellows to export their notes (button at the bottom of the Case Library) if they want them.

### Add or replace a file (PDF, document)

1. Upload the file to `public/files/` in GitHub (Add file, Upload files). Use a simple name with no spaces: `vasoactive-protocol-2026.pdf`.
2. Open `public/content/resources/manifest.json` and add an entry:

```json
{
  "title": "Vasoactive infusion protocol",
  "path": "/files/vasoactive-protocol-2026.pdf",
  "description": "CTICU vasoactive titration guidance.",
  "type": "PDF",
  "tags": ["protocols", "hemodynamics", "orientation"],
  "updated": "2026-07-01"
}
```

3. Commit. Entries tagged `orientation` also appear on the Orientation page.

To replace a file, upload the new one with the same name and commit. To link to an intranet page instead of hosting a file, set `path` to the full `https://` address.

Before uploading any institutional protocol, read the governance section of `DEPLOYMENT_GUIDE.md`.

### Edit an existing case

Open `public/content/cases/<id>.json`. Every piece of text is a string you can edit. Text supports:

- `#` and `##` at the start of a line for headings
- `-` at the start of a line for bullets, `1.` for numbered lists
- `**bold**`, `*italic*`
- `[link text](https://...)`
- Three flags that render as coloured highlights: `[VERIFY]`, `[NMH protocol, insert]`, `[REVIEW]`. Delete them as you resolve them.

Line breaks inside a string are written as `\n`. Quotation marks inside text must be written as `\"`.

Each case ends with a `reviewChecklist` listing every claim that needs your sign-off. When you have cleared the list, change `"status": "draft"` to `"status": "released"` in both the case file and `index.json`.

### Add a new case

1. Copy `_TEMPLATE.json` to a new file named with a short, non-revealing id, for example `third-shock-this-hour.json`.
2. Fill it in. The `id` inside the file must match the file name.
3. Add an entry to `index.json` with the same `id`, title, tags, and `status`.
4. Commit. The case appears in the library.

Titles, subtitles, and file names describe the presentation, not the diagnosis, so fellows meet the case the way they would meet the patient. Put the diagnosis in the `topic` field. It, and the learning objectives, are shown only in the wrap-up after the last stage.

Case structure, briefly: `stages` is a list. Each stage has a `narrative` and a list of `questions`. Every question is open response: `"type": "free"` with a `prompt` and a `modelAnswer`. The fellow types a response and presses Enter, and the model answer appears. Nothing is graded. Stages after the first stay locked until every question in the current stage has been answered and the fellow clicks "Commit and continue".

## Privacy and data

- Progress, answers, and notes are stored in the fellow's browser (localStorage) under keys beginning `accm-hub:`. They are never sent to a server. Clearing browser data erases them. Export and import buttons exist on the Case Library page.
- The contact form sends the fellow's signed-in email, the case title, the page address, and the message to your email via Resend. Nothing is stored on Cloudflare beyond a one-hour rate-limit counter keyed to the sender's email.
- No analytics, no cookies other than the Cloudflare Access session cookie.

## Local preview (optional, for anyone comfortable with a terminal)

```
npm install -g wrangler
cd nmh-accm-hub
wrangler pages dev public
```

Locally the Access check will block you (no token). To preview content only, open `public/index.html` through any simple static server, or temporarily comment out the body of `onRequest` in `functions/_middleware.js` and restore it before committing.
