import type { NextApiRequest, NextApiResponse } from "next";
import { ADMIN_BOOKING_EMAIL } from "../../utils/bookingNotify";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== "GET") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const hasGmail = Boolean(process.env.GMAIL_APP_PASSWORD?.trim());
    const hasWeb3 = Boolean(process.env.WEB3FORMS_ACCESS_KEY?.trim());
    const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "") || null;

    let mode: "gmail" | "web3forms" | "formsubmit" | "none" = "formsubmit";
    if (hasGmail) mode = "gmail";
    else if (hasWeb3) mode = "web3forms";

    return res.status(200).json({
        adminEmail: ADMIN_BOOKING_EMAIL,
        siteUrl,
        hasGmail,
        hasWeb3,
        mode,
        ready: hasGmail || hasWeb3,
        hint: hasGmail
            ? "Gmail SMTP aktív — helyben és élesen is megbízható."
            : hasWeb3
              ? "Web3Forms aktív (főleg admin értesítés). Diák levelekhez Gmail ajánlott."
              : "Nincs Gmail/Web3Forms kulcs. Állítsd be a GMAIL_APP_PASSWORD-öt a .env.local-ban (és a hostingon), majd indítsd újra a szervert.",
    });
}
