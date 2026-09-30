/**
 * Notification for a freshly-created Tech Radar draft.
 *
 * Reuses the Gmail/nodemailer path that the contact form already relies on, so
 * no new mail dependency and no second provider to configure.
 */

type Args = {
  title: string;
  previewUrl: string;
  excerpt: string;
};

/**
 * Returns whether mail was sent. Resolves false instead of throwing when email
 * is unconfigured, so the caller can report `emailed: false` and still keep the
 * draft.
 */
export async function sendRadarEmail({ title, previewUrl, excerpt }: Args): Promise<boolean> {
  const to = process.env.RADAR_NOTIFY_EMAIL;
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!to) {
    console.warn("[radar] RADAR_NOTIFY_EMAIL not set — skipping notification");
    return false;
  }
  if (!user || !pass) {
    console.warn("[radar] GMAIL_USER / GMAIL_APP_PASSWORD missing — skipping notification");
    return false;
  }

  const nodemailer = await import("nodemailer");
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: { user, pass },
  });

  await transport.sendMail({
    from: `"Tech Radar" <${user}>`,
    to,
    subject: `[radar] New draft ready — ${title}`,
    text: [
      `A new Tech Radar digest is waiting as a draft.`,
      ``,
      title,
      excerpt ? `\n${excerpt}\n` : ``,
      `Preview and publish: ${previewUrl}`,
      ``,
      `It stays hidden on the site until you publish it.`,
    ].join("\n"),
    html: [
      `<p>A new Tech Radar digest is waiting as a <strong>draft</strong>.</p>`,
      `<h2 style="margin:0 0 12px;font:600 16px ui-monospace,monospace">${escapeHtml(title)}</h2>`,
      excerpt ? `<p style="margin:0 0 20px;color:#555;line-height:1.6">${escapeHtml(excerpt)}</p>` : ``,
      `<p><a href="${previewUrl}" style="background:#d4f600;color:#0a0a0a;padding:10px 18px;border-radius:4px;text-decoration:none;font:600 13px ui-monospace,monospace">Preview &amp; publish →</a></p>`,
      `<p style="margin:20px 0 0;color:#888;font:12px ui-monospace,monospace">It stays hidden on the site until you publish it.</p>`,
    ].join(""),
  });

  return true;
}

/** Title and excerpt come from the digest body, so escape before embedding. */
function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}