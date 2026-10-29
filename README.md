# ACCM Fellowship Curriculum Hub

A private curriculum site for the Anesthesia Critical Care Medicine Fellowship at Northwestern Memorial Hospital, at https://nmaccm.org (also reachable at the original workers.dev address). Static HTML with a small Cloudflare Worker in front for login checks, the contact form, and the admin page. Hosted on Cloudflare Workers. Fellows enter a shared password; the admin page is gated by Cloudflare Access.

Read `DEPLOYMENT_GUIDE.md` first if you have not deployed yet. This file is the day-to-day manual.

## How it works, in one paragraph

Every page is a plain HTML file in `public/`. Content lives in `public/content/` as Markdown and JSON files that the pages load and render in the browser. There is no build step and no database. A shared fellowship password sits in front of the whole site: nobody sees anything, including PDFs in `public/files/`, without entering it on `/login`. The admin page and admin API are additionally gated by Cloudflare Access with a one-time email code. A fellow's progress and notes are stored only in their own browser. The contact form posts to `/api/contact`, which emails you through Cloudflare Email Routing from hub@nmaccm.org.

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
src/
  index.js               Worker entry: routes requests
  access.js              Checks the fellowship password cookie (site) or the Cloudflare Access login (admin) on every request
  gate.js                The /login page, password check, signed 30-day cookie, and wrong-attempt limiting
  contact.js             Contact form email sender
  admin.js               Admin page backend (commits to GitHub)
wrangler.toml            Cloudflare Worker settings (KV namespace ID lives here)
```

## Making changes

There are two ways. Use the first.

**The admin page.** Log in to the site as usual and open `/admin.html` (there is a "Faculty admin" link in the Home page footer). Only emails listed in the `ADMIN_EMAILS` setting can use it. From there you can edit the orientation text, upload documents and add them to the Resources index, change a case's status, edit a case, or start a new case from the template. Each save goes live in about a minute. Setup is Step 7 of the deployment guide.

**GitHub directly.** Everything below describes the files themselves, which you can also edit in the GitHub web interface: open the file, click the pencil icon, edit, then "Commit changes". Useful if the admin page is ever unavailable.

If a page shows "could not load", the most common cause is a JSON syntax error: a missing comma, a stray quote, or a quote inside text that was not escaped as `\"`. Paste the file into https://jsonlint.com to find the line.

### Add a fellow

Tell them the fellowship password. They open the site, enter it on the login page, and stay signed in on that device for 30 days. Nothing to configure.

### Change the password

Cloudflare dashboard, Workers & Pages, the worker, Settings, Variables and Secrets, edit `SITE_PASSWORD`. Every device is signed out immediately and needs the new password. Case and spaces do not matter when entering it.

### Add an administrator

The admin page uses Cloudflare Access, not the shared password. Zero Trust, Access, Applications, open "ACCM Hub", edit the "Allowed users" policy to add the email, and also add it to the `ADMIN_EMAILS` variable on the worker.

### Annual rollover

In June or July:

1. Change `SITE_PASSWORD` so graduating fellows' devices sign out, and give incoming fellows the new one.
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

## Appearance

The site follows the device's light or dark setting by default. The Auto / Light / Dark control in the header overrides it, and the choice is remembered on that device only. Colours are defined once at the top of `public/assets/css/site.css`, so changing the palette is a matter of editing those values.

## Privacy and data

- Progress, answers, and notes are stored in the fellow's browser (localStorage) under keys beginning `accm-hub:`. They are never sent to a server. Clearing browser data erases them. Export and import buttons exist on the Case Library page.
- The contact form sends the name and email the fellow entered, the case title, the page address, and the message to your email via Cloudflare Email Routing. Nothing is stored on Cloudflare beyond a one-hour rate-limit counter keyed to the sender's email.
- No analytics, no cookies other than the signed login cookie (`accm_hub`, 30 days, holds only an expiry and a signature) and, on the admin page, the Cloudflare Access session cookie.

## Local preview (optional, for anyone comfortable with a terminal)

```
cd nmh-accm-hub
npx wrangler dev
```

Locally the gate returns 503 unless `SITE_PASSWORD` is set in `.dev.vars`. To preview content only, serve the `public` folder with any simple static server, for example `python3 -m http.server --directory public`.
