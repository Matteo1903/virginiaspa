import { encode } from "uqr";

export const voucherQrPayload = (code: string) => code.trim();

export const voucherQrMatrix = (code: string) => encode(voucherQrPayload(code), { ecc: "M", border: 2 });

export const voucherQrSvg = (code: string, x: number, y: number, size: number) => {
  const qr = voucherQrMatrix(code);
  const cell = size / qr.size;
  const marks = qr.data.flatMap((row, rowIndex) => row.flatMap((on, columnIndex) => (
    on ? `<rect x="${(x + columnIndex * cell).toFixed(2)}" y="${(y + rowIndex * cell).toFixed(2)}" width="${(cell + 0.35).toFixed(2)}" height="${(cell + 0.35).toFixed(2)}" fill="#28382f"/>` : []
  ))).join("");
  return `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="8" fill="#fbf6ec"/>${marks}`;
};
