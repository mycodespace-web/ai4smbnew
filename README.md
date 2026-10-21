# AI4SMB website

Static rebuild of the ai4smb.agency site (previously on Squarespace), ready for **Cloudflare Pages**. Plain HTML, CSS and JavaScript with no build step and no dependencies.

**Cookie-free by design:** no cookies, no browser storage, no analytics, and self-hosted fonts. Calendly, Spotify and the ElevenLabs voice agent only load after a visitor clicks to open them, so no cookie banner is needed.

## Structure

```
public/                 ← everything that gets served
  index.html            Home: hero slideshow, services, AI-readiness test, FAQ, sessions, chatbot
  contact.html          Contact form
  podcast.html          Spotify podcast (click to load)
  book-discovery-call.html  Calendly booking (click to load)
  test-voicebot.html    ElevenLabs voice agent demo (loads after consent)
  tms.html, ppl.html, cpd.html   Terms, Privacy, About/imprint
  css/styles.css        All styling
  js/config.js          Site settings (IDs, URLs, logo)
  js/main.js            Shared header/footer and interactive components
  fonts/                Self-hosted Andika font (SIL Open Font License)
  _headers, _redirects  Cloudflare Pages headers and redirects
functions/api/submit.js Cloudflare Pages Function that handles both forms
```

## Deploying to Cloudflare Pages

1. In the Cloudflare dashboard go to **Workers & Pages → Create → Pages → Connect to Git** and pick this repository.
2. Build settings: **Framework preset:** None, **Build command:** leave empty, **Build output directory:** `public`.
3. Under **Settings → Variables and Secrets**, add `FORM_WEBHOOK_URL`: a webhook that receives the form data as JSON (for example a Make.com or Zapier webhook that emails you or adds a row to a sheet). Redeploy after adding it.
4. Add your domain under **Custom domains**.

Cloudflare serves clean URLs automatically (`/contact` → `contact.html`). Old Squarespace paths (`/home`, `/test-voice-bot`, `/testbot`) redirect via `_redirects`.

Until `FORM_WEBHOOK_URL` is set, form submissions get a "not configured" error, so nothing is silently lost.

## Before going live

- Replace the placeholder legal text in `tms.html`, `ppl.html` and the address in `cpd.html` with your own.
- Add the real logo (`logoSrc` in `js/config.js`); the header currently shows a drawn placeholder wordmark.
- Images live in `public/images/`. Slides 1, 2 and 4 use the original Unsplash photos (`hero-1/2/4.webp`); slides 3 and 5, the readiness test, online sessions, chatbot and footer use original illustrations (`.svg`). To swap one for a photo, add the file and change its path: slides and footer in `css/styles.css` (`.slide-bg--N`, `.site-footer`), section pictures in `index.html`.
- Swap in the final page copy where needed.

## Design notes

The layout mirrors the original Squarespace site: centred logo and nav, hero slideshow with a light text box, gold `#c79e30` accent, warm grey `#eeece9` sections, slanted section edges, pill buttons and a grey footer band with a wavy edge. Headings use **Andika** (self-hosted) as a free stand-in for the original's Bree typeface; change `--heading` in `css/styles.css` if you license Bree. Body text uses Verdana, as on the original.

## Local preview

```
npx wrangler pages dev public     # full preview including the form function
# or, static pages only:
python3 -m http.server 8000 --directory public
```
