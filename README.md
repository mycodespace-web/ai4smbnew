# AI4SMB website

Static rebuild of the ai4smb.agency site (previously on Squarespace). Plain HTML, CSS and JavaScript with no build step: deploy the folder as-is to Netlify, Vercel, GitHub Pages, Cloudflare Pages or any web host.

## Pages

| Path | Page |
| --- | --- |
| `/` (`index.html`) | Home: hero slideshow, services, AI-readiness test (lightbox form), FAQ accordion, online sessions, chatbot |
| `/contact` | Contact form |
| `/podcast` | Spotify podcast embed |
| `/book-discovery-call` | Calendly booking embed |
| `/test-voicebot` | ElevenLabs voice agent demo, loaded after consent |
| `/tms`, `/ppl`, `/cpd` | Terms, Privacy, About/imprint (footer links) |
| `/home`, `/test-voice-bot`, `/testbot` | Redirects kept for old URLs |

The header, footer, cookie banner and voice agent are injected by `js/main.js`, so you edit them in one place.

## Configuration: `js/config.js`

- `forms.contact` / `forms.readiness`: URL that form submissions are POSTed to as JSON (Formspree, Getform, a Make.com or Zapier webhook, etc.). **Until you set these, submissions are only stored in the visitor's browser.**
- `elevenlabsAgentId`, `calendlyUrl`, `spotifyPlaylistId`, `loginUrl`, `logoSrc`

## Before going live

- Replace the placeholder legal text in `tms.html`, `ppl.html` and the address in `cpd.html` with your own.
- Add the real logo (`logoSrc`); the header currently shows a drawn placeholder wordmark.
- Add photos: hero slides (`style="background-image:url(images/…)"` on each `.slide-bg` in `index.html`), the footer band (`background-image` on `.site-footer` in `css/styles.css`) and the illustrations in the readiness, sessions and chatbot sections.
- Swap in the final page copy where needed.

## Design notes

The layout mirrors the original Squarespace site: centred logo and nav, hero slideshow with a light text box, gold `#c79e30` accent, warm grey `#eeece9` sections, slanted section edges, pill buttons and a grey footer band with a wavy edge. Headings use **Andika** (Google Fonts) as a free stand-in for the original's Bree typeface; change `--heading` in `css/styles.css` if you license Bree. Body text uses Verdana, as on the original.

## Local preview

```
python3 -m http.server 8000
```
Then open http://localhost:8000.
