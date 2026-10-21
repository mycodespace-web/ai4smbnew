// Cloudflare Pages Function: receives contact and AI-readiness form submissions
// and forwards them as JSON to FORM_WEBHOOK_URL (e.g. a Make.com or Zapier webhook
// that emails you, adds a CRM entry or writes to a spreadsheet).
// Set FORM_WEBHOOK_URL under Pages project > Settings > Variables and Secrets.

const MAX_BYTES = 50_000;
const FORMS = new Set(["contact", "readiness"]);

export async function onRequestPost({ request, env }) {
  if (!env.FORM_WEBHOOK_URL) {
    return json({ ok: false, error: "Form delivery is not configured." }, 503);
  }

  const raw = await request.text();
  if (raw.length > MAX_BYTES) return json({ ok: false, error: "Submission too large." }, 413);

  let data;
  try {
    data = JSON.parse(raw);
  } catch {
    return json({ ok: false, error: "Invalid JSON." }, 400);
  }
  if (!data || typeof data !== "object" || !FORMS.has(data._form) || !isEmail(data.email)) {
    return json({ ok: false, error: "Invalid submission." }, 400);
  }

  const res = await fetch(env.FORM_WEBHOOK_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...data, _receivedAt: new Date().toISOString() })
  });
  if (!res.ok) return json({ ok: false, error: "Delivery failed." }, 502);

  return json({ ok: true });
}

function isEmail(v) {
  return typeof v === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function json(body, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" }
  });
}
