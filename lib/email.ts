import { spaEmail, spaPhoneDisplay, siteName } from "./site";
import { secrets } from "./stripe";
import { purchaseCopy } from "./purchase";
import { voucherFileName } from "./voucher-document";
import type { Language } from "../app/i18n";

type VoucherMail = { title: string; code: string; claimToken: string; pdf?: Uint8Array | null };
type MailAttachment = { filename: string; content: string };
const customerEmailCopy: Record<Language, { hello: string; thanks: string; contacts: string; attached: string }> = {
  it: { hello: "Ciao", thanks: "Grazie per il tuo acquisto su", contacts: "Contatti", attached: "Trovi i voucher in PDF in allegato: puoi stamparli o mostrarli dal telefono in SPA." },
  en: { hello: "Hello", thanks: "Thank you for your purchase from", contacts: "Contact", attached: "Your vouchers are attached as PDF: print them or show them on your phone at the SPA." },
  es: { hello: "Hola", thanks: "Gracias por tu compra en", contacts: "Contacto", attached: "Encontrarás los bonos en PDF adjuntos: puedes imprimirlos o mostrarlos desde el móvil en el SPA." },
  fr: { hello: "Bonjour", thanks: "Merci pour votre achat auprès de", contacts: "Contact", attached: "Vos bons sont joints en PDF : imprimez-les ou présentez-les sur votre téléphone au SPA." },
  de: { hello: "Hallo", thanks: "Vielen Dank für deinen Einkauf bei", contacts: "Kontakt", attached: "Deine Gutscheine findest du als PDF im Anhang: ausdrucken oder im SPA auf dem Handy zeigen." },
};

const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': "&quot;",
  "'": "&#39;",
}[char] || char));

async function sendResendEmail(input: { to: string[]; subject: string; html: string; attachments?: MailAttachment[] }) {
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
    body: JSON.stringify({ from, to: input.to, subject: input.subject, html: input.html, ...(input.attachments?.length ? { attachments: input.attachments } : {}) }),
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
  const emailCopy = customerEmailCopy[input.language] ?? customerEmailCopy.it;
  const links = input.vouchers.map((voucher) => {
    const href = `${input.siteUrl.replace(/\/$/, "")}/api/vouchers/${voucher.claimToken}`;
    return `<li><strong>${escapeHtml(voucher.title)}</strong> — ${escapeHtml(voucher.code)} — <a href="${href}">${escapeHtml(copy.download)}</a></li>`;
  }).join("");
  const attachments = input.vouchers.flatMap((voucher) => voucher.pdf ? [{ filename: voucherFileName(voucher.code, "pdf"), content: Buffer.from(voucher.pdf).toString("base64") }] : []);

  const html = `<!doctype html><html><body style="font-family:Georgia,serif;color:#28382f;line-height:1.6">
<p>${escapeHtml(emailCopy.hello)} ${escapeHtml(input.customerName)},</p>
<p>${escapeHtml(emailCopy.thanks)} ${escapeHtml(siteName)}.</p>
<p><strong>${escapeHtml(copy.title)}</strong><br/>${escapeHtml(copy.body)}</p>
<p>${escapeHtml(copy.next)}</p>
${attachments.length ? `<p>${escapeHtml(emailCopy.attached)}</p>` : ""}
<ul>${links}</ul>
<p>${escapeHtml(emailCopy.contacts)}: ${escapeHtml(spaPhoneDisplay)} · <a href="mailto:${spaEmail}">${escapeHtml(spaEmail)}</a></p>
<p>— ${escapeHtml(siteName)}</p>
</body></html>`;

  return sendResendEmail({ to: [input.to], subject: copy.emailSubject, html, attachments });
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
