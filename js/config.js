// Site-wide settings. Edit these values instead of touching the page code.
window.SITE_CONFIG = {
  brand: "AI4SMB",
  domain: "ai4smb.agency",

  // Optional logo image (e.g. "images/logo.png"). Leave empty to use the text logo.
  logoSrc: "",

  // Where form submissions are POSTed (JSON). Works with Formspree, Getform,
  // Basin, a Make.com/Zapier webhook, or your own endpoint.
  // Leave empty and submissions are only kept in the visitor's browser (demo mode).
  forms: {
    contact: "",
    readiness: ""
  },

  // ElevenLabs Conversational AI voice agent shown on every page.
  elevenlabsAgentId: "6B1CwePhRvZdEwBmcYpq",

  // Calendly scheduling page used on /book-discovery-call.
  calendlyUrl: "https://calendly.com/team-ai4smb/30min?hide_event_type_details=1&primary_color=c79e2f",

  // Spotify playlist embedded on /podcast.
  spotifyPlaylistId: "26VyL8hJhVNweHM0oG3aRn",

  // Target for the "Login Account" link in the header.
  loginUrl: "#"
};
