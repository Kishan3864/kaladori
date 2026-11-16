/** UPI payment details + QR generation. SERVER ONLY. */
import QRCode from "qrcode";
import { site } from "@/lib/site";

/**
 * Configure on the server in .env.production:
 *   UPI_ID=yourname@okaxis        (required for the dynamic QR)
 *   UPI_NAME=KalaDori Textile     (payee name shown in UPI apps)
 * Alternatively drop a static QR image at public/payment/upi-qr.png.
 */
export function upiConfig() {
  return {
    id: (process.env.UPI_ID || "").trim(),
    name: (process.env.UPI_NAME || site.name).trim(),
  };
}

export function upiLink(amount: number, note: string) {
  const { id, name } = upiConfig();
  if (!id) return null;
  const params = new URLSearchParams({
    pa: id,
    pn: name,
    am: amount.toFixed(2),
    cu: "INR",
    tn: note.slice(0, 50),
  });
  return `upi://pay?${params.toString()}`;
}

/** SVG markup for a UPI QR (or null when no UPI ID is configured). */
export async function upiQrSvg(amount: number, note: string) {
  const link = upiLink(amount, note);
  if (!link) return null;
  return QRCode.toString(link, {
    type: "svg",
    errorCorrectionLevel: "M",
    margin: 1,
    color: { dark: "#1A1A1A", light: "#FFFFFF" },
  });
}
