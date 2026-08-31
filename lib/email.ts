import { spaEmail, spaPhoneDisplay, siteName } from "./site";
import { secrets } from "./stripe";
import { purchaseCopy } from "./purchase";
import type { Language } from "../app/i18n";

type VoucherMail = { title: string; code: string; claimToken: string };

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[char] || char));

async function sendResendEmail(input: { to: string[]; subject: string; html: string }) {
  const env = await secrets();
  const apiKey = env.RESEND_API_KEY;
  const from = env.EMAIL_FROM;
  if (!apiKey || !from) {
    console.warn("RESEND_API_KEY o EMAIL_FROM assenti: email non inviata");
    return { skipped: true as const };
  }
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to: input.to, subject: input.subject, html: input.html }),
  });
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Invio email fallito: ${detail.slice(0, 200)}`);
  }
  return { skipped: false as const };
}

export async function sendVoucherEmail(input: {
  to: string;
  customerName: string;
  language: Language;
  vouchers: VoucherMail[];
  siteUrl: string;
}) {
  if (!input.vouchers.length || !input.siteUrl) return { skipped: true as const };
  const copy = purchaseCopy[input.language] ?? purchaseCopy.it;
  const links = input.vouchers.map((voucher) => {
    const href = `${input.siteUrl.replace(/\/$/, "")}/api/vouchers/${voucher.claimToken}`;
    return `<li><strong>${escapeHtml(voucher.title)}</strong> — ${escapeHtml(voucher.code)} — <a href="${href}">${escapeHtml(copy.download)}</a></li>`;
  }).join("");

  const html = `<!doctype html><html><body style="font-family:Georgia,serif;color:#28382f;line-height:1.6">
<p>Ciao ${escapeHtml(input.customerName)},</p>
<p>Grazie per il tuo acquisto su ${escapeHtml(siteName)}.</p>
<p><strong>${escapeHtml(copy.title)}</strong><br/>${escapeHtml(copy.body)}</p>
<p>${escapeHtml(copy.next)}</p>
<ul>${links}</ul>
<p>Contatti: ${escapeHtml(spaPhoneDisplay)} · <a href="mailto:${spaEmail}">${escapeHtml(spaEmail)}</a></p>
<p>— ${escapeHtml(siteName)}</p>
</body></html>`;

  return sendResendEmail({ to: [input.to], subject: copy.emailSubject, html });
}

export async function sendContactNotification(input: {
  name: string;
  email: string;
  phone: string;
  message: string;
  language: Language;
}) {
  const html = `<!doctype html><html><body style="font-family:Georgia,serif;color:#28382f;line-height:1.6">
<p>Nuovo messaggio dal sito ${escapeHtml(siteName)}.</p>
<p><strong>${escapeHtml(input.name)}</strong><br/>
<a href="mailto:${escapeHtml(input.email)}">${escapeHtml(input.email)}</a><br/>
${escapeHtml(input.phone)}<br/>
Lingua: ${escapeHtml(input.language)}</p>
<p>${escapeHtml(input.message).replace(/\n/g, "<br/>")}</p>
</body></html>`;
  return sendResendEmail({
    to: [spaEmail],
    subject: `${siteName}: messaggio da ${input.name}`,
    html,
  });
}
