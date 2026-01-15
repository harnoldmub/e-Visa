import type { Express } from "express";
import path from "path";
import fs from "fs/promises";

// ============================
// CONFIG
// ============================
export const ASSETS_DIR = path.resolve(process.cwd(), "client/public/assets/logo-eVisa");

export const RESEND_API_KEY = process.env.RESEND_API_KEY || "";
export const PUBLIC_BASE_URL = process.env.PUBLIC_BASE_URL || "https://evisa.gouv.cd";

// ============================
// UTILS
// ============================
export function formatDateDDMMYYYY(d = new Date()) {
    const dd = String(d.getDate()).padStart(2, "0");
    const mm = String(d.getMonth() + 1).padStart(2, "0");
    const yyyy = String(d.getFullYear());
    return `${dd}-${mm}-${yyyy}`;
}

export function safeUpper(s: unknown) {
    return (s ?? "").toString().trim().toUpperCase();
}

export async function fileExists(p: string) {
    try {
        await fs.access(p);
        return true;
    } catch {
        return false;
    }
}

export async function tryImage(doc: any, imgPath: string, x: number, y: number, opts: any) {
    try {
        if (await fileExists(imgPath)) doc.image(imgPath, x, y, opts);
    } catch (e: any) {
        console.warn("Image load failed:", imgPath, e?.message || e);
    }
}

export async function drawBarcode(doc: any, text: string, x: number, y: number, width: number, height: number) {
    try {
        const bwipjs = await import("bwip-js");
        const png = await bwipjs.default.toBuffer({
            bcid: "code128",
            text,
            scale: 3,
            height: 12,
            includetext: false,
            backgroundcolor: "FFFFFF",
        });
        doc.image(png, x, y, { width, height });
    } catch (e: any) {
        console.warn("Barcode generation failed:", e?.message || e);
        // Fallback to QR code
        try {
            const QRCode = await import("qrcode");
            const qrImage = await QRCode.default.toDataURL(text, { width: Math.floor(width * 1.5) });
            doc.image(qrImage, x, y, { width, height: height * 2 });
        } catch (qrError: any) {
            console.warn("QR code fallback failed:", qrError?.message || qrError);
            doc.font("Helvetica").fontSize(8).text(text, x, y + 16, { width, align: "center" });
        }
    }
}

export function generateVisaNumber(sequence: number) {
    const paddedSeq = String(sequence).padStart(7, "0");
    return `E-VVL/DGM/DG/CAB/${paddedSeq}`;
}

export function generateVerificationCode() {
    return `VFY-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}
