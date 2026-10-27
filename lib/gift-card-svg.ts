import { voucherQrSvg } from "./voucher-qr";

const escapeXml = (value: string) => value.replace(/[<>&'"]/g, (char) => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "'": "&apos;", "\"": "&quot;" }[char] || char));

const wrap = (value: string, width: number, limit: number) => {
  const words = value.trim().split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";
  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (current && next.length > width) {
      lines.push(current);
      current = word;
      if (lines.length === limit) return lines;
    } else {
      current = next;
    }
  }
  if (current && lines.length < limit) lines.push(current);
  return lines;
};

export type GiftCardSvgInput = {
  eyebrow: string;
  title: string;
  message: string;
  recipient: string;
  sender: string;
  amount: string;
  code: string;
  validUntil: string;
  stub: string;
  note: string;
};

export const renderGiftCardSvg = (input: GiftCardSvgInput) => {
  const message = wrap(input.message, 36, 3);
  const title = wrap(input.title, 34, 2);
  const dedication = [input.recipient, input.sender].filter(Boolean).join("  ·  ");
  const messageSvg = message.map((line, index) => `<text x="92" y="${300 + index * 44}" font-family="Georgia, 'Times New Roman', serif" font-size="34" font-style="italic" fill="#503044">${escapeXml(line)}</text>`).join("");
  const titleSvg = title.map((line, index) => `<text x="92" y="${448 + index * 30}" font-family="Georgia, 'Times New Roman', serif" font-size="22" fill="#28382f">${escapeXml(line)}</text>`).join("");
  return `<svg xmlns="http://www.w3.org/2000/svg" width="1280" height="760" viewBox="0 0 1280 760">
  <rect width="1280" height="760" rx="36" fill="#f3e7d4"/>
  <rect x="36" y="36" width="1208" height="688" rx="28" fill="#fbf6ec" stroke="#c7a56a" stroke-width="1.5"/>
  <rect x="52" y="52" width="1176" height="656" rx="18" fill="none" stroke="#b86145" stroke-width="0.7" opacity=".5"/>
  <circle cx="960" cy="36" r="16" fill="#f3e7d4"/>
  <circle cx="960" cy="724" r="16" fill="#f3e7d4"/>
  <path d="M960 64 V696" fill="none" stroke="#28382f" stroke-width="2" stroke-dasharray="2 9" opacity=".35"/>
  <text x="92" y="132" font-family="Georgia, 'Times New Roman', serif" font-size="44" fill="#28382f">Virginia <tspan fill="#b86145" font-size="22" letter-spacing="4">SPA</tspan></text>
  <text x="92" y="172" font-family="Arial, Helvetica, sans-serif" font-size="15" letter-spacing="4" fill="#b86145">${escapeXml(input.eyebrow)}</text>
  <text x="910" y="140" text-anchor="end" font-family="Georgia, 'Times New Roman', serif" font-size="42" fill="#b86145">${escapeXml(input.amount)}</text>
  ${messageSvg}
  ${titleSvg}
  <text x="92" y="620" font-family="Arial, Helvetica, sans-serif" font-size="18" fill="#697169">${escapeXml(dedication)}</text>
  <text x="92" y="668" font-family="Arial, Helvetica, sans-serif" font-size="16" fill="#b86145">${escapeXml(input.note)}</text>
  <text x="1120" y="168" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="13" letter-spacing="2.5" fill="#b86145">${escapeXml(input.stub)}</text>
  ${input.code ? voucherQrSvg(input.code, 1036, 188, 168) : ""}
  <text x="1120" y="400" text-anchor="middle" font-family="Georgia, 'Times New Roman', serif" font-size="18" fill="#28382f">${escapeXml(input.code)}</text>
  <text x="1120" y="432" text-anchor="middle" font-family="Arial, Helvetica, sans-serif" font-size="14" fill="#697169">${escapeXml(input.validUntil)}</text>
</svg>`;
};
