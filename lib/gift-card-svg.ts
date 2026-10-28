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
  accent?: string;
  wash?: string;
  paper?: string;
  deep?: string;
  family?: string;
  kind?: "gift" | "voucher";
  mark?: string;
  art?: string;
};

const serif = "'Crimson Text', Georgia, 'Times New Roman', serif";
const sans = "Lato, Arial, Helvetica, sans-serif";
const foil = "#d9be87";
const ivory = "#fbf6ec";

const image = (href: string, x: number, y: number, width: number, height: number, clip: string) =>
  `<image href="${href}" xlink:href="${href}" x="${x}" y="${y}" width="${width}" height="${height}" preserveAspectRatio="xMidYMid slice" clip-path="url(#${clip})"/>`;

export const renderGiftCardSvg = (input: GiftCardSvgInput) => {
  const accent = input.accent || "#b86145";
  const wash = input.wash || "#f3e7d4";
  const paper = input.paper || ivory;
  const deep = input.deep || "#22312a";
  const voucher = input.kind === "voucher";
  const art = input.art || "";
  const textX = voucher ? 418 : 100;
  const ink = voucher ? "#28382f" : ivory;
  const soft = voucher ? "#697169" : "rgba(251,246,236,.72)";
  const lead = voucher ? deep : ivory;
  const gold = voucher ? accent : foil;
  const message = wrap(input.message, voucher ? 26 : 30, 3);
  const title = wrap(input.title, voucher ? 30 : 34, 2);
  const dedication = [input.recipient, input.sender].filter(Boolean).join("  ·  ");
  const messageSvg = message.map((line, index) => `<text x="${textX}" y="${330 + index * 46}" font-family="${serif}" font-size="38" font-style="italic" fill="${lead}">${escapeXml(line)}</text>`).join("");
  const titleSvg = title.map((line, index) => `<text x="${textX}" y="${482 + index * 30}" font-family="${serif}" font-size="22" fill="${ink}">${escapeXml(line)}</text>`).join("");
  const family = input.family && !voucher ? `<text x="${textX}" y="226" font-family="${sans}" font-size="13" letter-spacing="3" fill="rgba(251,246,236,.8)">${escapeXml(input.family.toUpperCase())}</text>` : "";
  const mark = escapeXml((input.mark || "Voucher").toUpperCase());

  const defs = `<defs>
    <clipPath id="plate"><rect x="52" y="52" width="330" height="656" rx="18"/></clipPath>
    <clipPath id="face"><rect x="36" y="36" width="940" height="688" rx="28"/></clipPath>
    <linearGradient id="plateFade" x1="0" y1="0" x2="0" y2="1"><stop offset=".4" stop-color="${deep}" stop-opacity="0"/><stop offset="1" stop-color="${deep}" stop-opacity=".82"/></linearGradient>
    <linearGradient id="veil" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${deep}"/><stop offset=".32" stop-color="${deep}" stop-opacity=".9"/><stop offset=".7" stop-color="${deep}" stop-opacity=".55"/><stop offset="1" stop-color="${deep}" stop-opacity=".4"/></linearGradient>
  </defs>`;

  const face = voucher
    ? `<rect x="36" y="36" width="1208" height="688" rx="28" fill="${paper}" stroke="#c7a56a" stroke-width="1.5"/>
  <rect x="52" y="52" width="330" height="656" rx="18" fill="${accent}"/>
  ${art ? image(art, 52, 52, 330, 656, "plate") : ""}
  <rect x="52" y="52" width="330" height="656" rx="18" fill="url(#plateFade)"/>
  <rect x="64" y="64" width="306" height="632" rx="12" fill="none" stroke="${ivory}" stroke-opacity=".6"/>
  <rect x="84" y="86" width="${44 + mark.length * 13}" height="34" rx="17" fill="${ivory}"/>
  <text x="${106}" y="109" font-family="${sans}" font-size="14" font-weight="700" letter-spacing="3.5" fill="${deep}">${mark}</text>
  ${input.family ? `<text x="86" y="664" font-family="${serif}" font-size="64" font-style="italic" fill="${ivory}">${escapeXml(input.family)}</text>` : ""}`
    : `<rect x="36" y="36" width="1208" height="688" rx="28" fill="${deep}"/>
  ${art ? image(art, 36, 36, 940, 688, "face") : ""}
  <rect x="36" y="36" width="940" height="688" rx="28" fill="url(#veil)" clip-path="url(#face)"/>
  <path d="M960 36H1216a28 28 0 0 1 28 28V696a28 28 0 0 1-28 28H960Z" fill="${deep}"/>
  <path d="M960 36H1216a28 28 0 0 1 28 28V696a28 28 0 0 1-28 28H960Z" fill="#000" fill-opacity=".18"/>
  <rect x="50" y="50" width="1180" height="660" rx="18" fill="none" stroke="${foil}" stroke-opacity=".6"/>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="1280" height="760" viewBox="0 0 1280 760">
  ${defs}
  <rect width="1280" height="760" rx="36" fill="${wash}"/>
  ${face}
  <circle cx="960" cy="36" r="16" fill="${wash}"/>
  <circle cx="960" cy="724" r="16" fill="${wash}"/>
  <path d="M960 64 V696" fill="none" stroke="${voucher ? "#28382f" : foil}" stroke-width="2" stroke-dasharray="2 9" opacity="${voucher ? ".35" : ".55"}"/>
  <text x="${textX}" y="150" font-family="${serif}" font-size="44" fill="${ink}">Virginia <tspan fill="${gold}" font-size="22" letter-spacing="4">SPA</tspan></text>
  <text x="${textX}" y="192" font-family="${sans}" font-size="15" letter-spacing="4" fill="${gold}">${escapeXml(input.eyebrow)}</text>
  ${family}
  <text x="920" y="150" text-anchor="end" font-family="${serif}" font-size="44" fill="${gold}">${escapeXml(input.amount)}</text>
  ${messageSvg}
  ${titleSvg}
  <text x="${textX}" y="624" font-family="${sans}" font-size="18" fill="${soft}">${escapeXml(dedication)}</text>
  <text x="${textX}" y="668" font-family="${sans}" font-size="16" fill="${gold}">${escapeXml(input.note)}</text>
  <text x="1102" y="168" text-anchor="middle" font-family="${sans}" font-size="13" letter-spacing="2.5" fill="${gold}">${escapeXml(input.stub)}</text>
  ${input.code ? voucherQrSvg(input.code, 1018, 188, 168) : ""}
  <text x="1102" y="400" text-anchor="middle" font-family="${serif}" font-size="18" fill="${ink}">${escapeXml(input.code)}</text>
  <text x="1102" y="432" text-anchor="middle" font-family="${sans}" font-size="14" fill="${soft}">${escapeXml(input.validUntil)}</text>
</svg>`;
};

