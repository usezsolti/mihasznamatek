/**
 * Branded transactional mail (Gmail SMTP) — jobb kézbesítés, kevesebb spam jel.
 */
import nodemailer from 'nodemailer';
import { emailFromAddress, emailFromHeader, emailFromName } from '../utils/emailFrom';

function escapeHtml(s: string): string {
    return s
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;');
}

/** SMTP auth mindig a GMAIL_USER — a From display name lehet márka. */
function smtpUser(): string {
    return (process.env.GMAIL_USER || emailFromAddress()).trim();
}

export async function sendBrandedVerificationMail(opts: {
    to: string;
    link: string;
}): Promise<void> {
    const pass = String(process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
    const user = smtpUser();
    const brand = emailFromName();
    const site = 'https://mihasznamatek.hu';
    const safeLink = opts.link;
    const safeBrand = escapeHtml(brand);

    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
    });

    const text = [
        `Szia!`,
        ``,
        `Köszönjük a regisztrációdat a ${brand} oldalon.`,
        `Az e-mail címed megerősítéséhez nyisd meg ezt a linket:`,
        safeLink,
        ``,
        `A link 24 óráig érvényes.`,
        `Ha nem te regisztráltál, hagyd figyelmen kívül ezt az üzenetet.`,
        ``,
        `${brand}`,
        site,
    ].join('\n');

    const html = `<!DOCTYPE html>
<html lang="hu">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#f6f7f9;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#1a1a1a;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background:#f6f7f9;padding:24px 12px;">
    <tr><td align="center">
      <table role="presentation" width="100%" style="max-width:560px;background:#ffffff;border-radius:12px;padding:28px 24px;">
        <tr><td>
          <p style="margin:0 0 8px;font-size:20px;font-weight:700;">${safeBrand}</p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.5;">Szia!</p>
          <p style="margin:0 0 16px;font-size:15px;line-height:1.5;">
            Köszönjük a regisztrációdat. Az e-mail címed megerősítéséhez kattints az alábbi gombra:
          </p>
          <p style="margin:0 0 20px;">
            <a href="${escapeHtml(safeLink)}" style="display:inline-block;background:#0b6e4f;color:#ffffff;text-decoration:none;padding:12px 20px;border-radius:8px;font-weight:600;font-size:15px;">
              E-mail megerősítése
            </a>
          </p>
          <p style="margin:0 0 8px;font-size:13px;line-height:1.45;color:#555;">
            Ha a gomb nem működik, másold be böngészőbe:
          </p>
          <p style="margin:0 0 20px;font-size:12px;line-height:1.4;word-break:break-all;color:#333;">
            ${escapeHtml(safeLink)}
          </p>
          <p style="margin:0;font-size:12px;color:#777;line-height:1.45;">
            A link 24 óráig érvényes. Ha nem te regisztráltál, hagyd figyelmen kívül ezt az üzenetet.
          </p>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:11px;color:#888;">${safeBrand} · <a href="${site}" style="color:#888;">mihasznamatek.hu</a></p>
    </td></tr>
  </table>
</body>
</html>`;

    await transporter.sendMail({
        from: emailFromHeader(),
        to: opts.to,
        replyTo: user,
        envelope: { from: user, to: opts.to },
        subject: `${brand} – e-mail megerősítés`,
        text,
        html,
        headers: {
            'X-Mailer': 'MihasznaMatek',
            'X-Entity-Ref-ID': `verify-${Date.now()}`,
            'List-Unsubscribe': `<${site}/?auth=1>`,
            'List-Unsubscribe-Post': 'List-Unsubscribe=One-Click',
        },
    });
}
