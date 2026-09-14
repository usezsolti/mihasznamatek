import nodemailer from 'nodemailer';
import { ADMIN_EMAIL } from '../utils/admin';
import { emailFromHeader } from '../utils/emailFrom';
import type { SocialPost } from '../utils/socialTypes';
import { hasResend, sendViaResend } from './resendMail';

function siteUrl(): string {
    return String(process.env.NEXT_PUBLIC_SITE_URL || 'https://mihasznamatek.hu').replace(/\/$/, '');
}

export async function notifyAdminPendingPost(post: SocialPost): Promise<void> {
    if (String(process.env.SOCIAL_SKIP_MODERATION_MAIL || '') === '1') return;
    const to = String(ADMIN_EMAIL || '').trim();
    if (!to) return;
    const reviewUrl = `${siteUrl()}/community?tab=review`;
    const excerpt = String(post.text || '').trim().slice(0, 280) || '(csak kép)';
    const author = post.authorName || post.authorUsername || 'Diák';
    const subject = `Új MihaSocial poszt jóváhagyásra — ${author}`;
    const text = [
        'Új poszt vár a jóváhagyásodra.',
        '',
        `Szerző: ${author}${post.authorUsername ? ` (@${post.authorUsername})` : ''}`,
        post.imageUrl ? 'Van kép a posztban.' : '',
        '',
        excerpt,
        '',
        `Engedélyezés: ${reviewUrl}`,
        '',
        '— Mihaszna Matek',
    ]
        .filter((line, i, arr) => line || arr[i - 1])
        .join('\n');

    const mail = { to, subject, text };
    if (hasResend()) {
        const sent = await sendViaResend([mail]);
        if (sent.ok) return;
    }
    const gmailUser = process.env.GMAIL_USER || to;
    const gmailPass = String(process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
    if (!gmailPass) return;
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user: gmailUser, pass: gmailPass },
    });
    await transporter.sendMail({
        from: emailFromHeader(),
        to: mail.to,
        subject: mail.subject,
        text: mail.text,
    });
}
