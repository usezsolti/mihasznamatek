import { emailFromHeader } from '../utils/emailFrom';
import type { EmailSendResult } from '../utils/booking/types';

export type ResendMailItem = {
    to: string;
    subject: string;
    text: string;
    html?: string;
    replyTo?: string;
    cc?: string;
};

export function resendApiKey(): string {
    return String(process.env.RESEND_API_KEY || '').trim();
}

export function hasResend(): boolean {
    return resendApiKey().startsWith('re_');
}

async function sendOne(mail: ResendMailItem): Promise<void> {
    const key = resendApiKey();
    const body: Record<string, unknown> = {
        from: emailFromHeader(),
        to: [mail.to],
        subject: mail.subject,
        text: mail.text,
    };
    if (mail.html) body.html = mail.html;
    if (mail.replyTo) body.reply_to = mail.replyTo;
    if (mail.cc) body.cc = [mail.cc];

    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${key}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
    });
    const raw = await res.text();
    if (!res.ok) {
        let msg = raw.slice(0, 240);
        try {
            const parsed = JSON.parse(raw) as { message?: string };
            if (parsed.message) msg = parsed.message;
        } catch {
            /* keep raw */
        }
        throw new Error(msg || `Resend ${res.status}`);
    }
}

export async function sendViaResend(mails: ResendMailItem[]): Promise<EmailSendResult> {
    if (!hasResend()) return { ok: false, error: 'Nincs RESEND_API_KEY', provider: 'resend' };
    try {
        for (const mail of mails) {
            await sendOne(mail);
        }
        return { ok: true, provider: 'resend' };
    } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Resend hiba';
        return { ok: false, provider: 'resend', error: message };
    }
}
