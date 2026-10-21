// Site-wide settings. Edit these values instead of touching the page code.
window.SITE_CONFIG = {
  brand: "AI4SMB",
  domain: "ai4smb.agency",

  // Optional logo image (e.g. "images/logo.png"). Leave empty to use the placeholder wordmark.
  logoSrc: "",

  // Forms are POSTed as JSON to this endpoint. On Cloudflare Pages it is handled by
  // functions/api/submit.js, which forwards each submission to FORM_WEBHOOK_URL.
  formEndpoint: "/api/submit",

  // ElevenLabs Conversational AI voice agent (loaded only after the visitor agrees).
  elevenlabsAgentId: "6B1CwePhRvZdEwBmcYpq",

  // Calendly scheduling page used on /book-discovery-call (loaded on click).
  calendlyUrl: "https://calendly.com/team-ai4smb/30min?hide_event_type_details=1&primary_color=c79e2f",

  // Spotify playlist on /podcast (loaded on click).
  spotifyPlaylistId: "26VyL8hJhVNweHM0oG3aRn",

  // Target for the "Login" link in the header.
  loginUrl: "#"
};
