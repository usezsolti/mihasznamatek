import type { NextApiRequest, NextApiResponse } from "next";
import { getClientIp, rateLimit, requireAdmin } from "../../utils/apiSecurity";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ ok: false, error: "Method not allowed" });
    }

    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const ip = getClientIp(req);
    const rl = rateLimit(`email-status:${ip}`, 60, 60 * 1000);
    if (!rl.ok) {
        return res.status(429).json({ ok: false, error: "Túl sok kérés." });
    }

    const hasGmail = Boolean(process.env.GMAIL_APP_PASSWORD?.trim());
    const hasWeb3 = Boolean(process.env.WEB3FORMS_ACCESS_KEY?.trim());

    return res.status(200).json({
        ok: true,
        ready: hasGmail || hasWeb3,
        mode: hasGmail ? "gmail" : hasWeb3 ? "web3forms" : "none",
        hasGmail,
        hasWeb3,
        // Ne szivárogtass admin e-mailt / belső infót publikusra
        siteConfigured: Boolean(process.env.NEXT_PUBLIC_SITE_URL),
        hint: hasGmail
            ? "Gmail SMTP aktív."
            : "Állítsd be a GMAIL_APP_PASSWORD-öt a szerver env-ben.",
    });
}
