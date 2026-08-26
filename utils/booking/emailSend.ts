import {
    ADMIN_BOOKING_EMAIL,
    type BookingEmailType,
    type BookingPayload,
    type EmailSendResult,
    type MailPayload,
} from './types';

/** FormSubmit AJAX – a JSON success mezőt is ellenőrzi. */
export async function sendViaFormSubmit(
    mail: MailPayload,
    origin: string
): Promise<EmailSendResult> {
    try {
        const res = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(mail.to)}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
                Origin: origin,
                Referer: `${origin}/booking`,
            },
            body: JSON.stringify({
                name: 'Mihaszna Matek',
                email: mail.replyTo || ADMIN_BOOKING_EMAIL,
                _replyto: mail.replyTo || ADMIN_BOOKING_EMAIL,
                _subject: mail.subject,
                ...(mail.cc ? { _cc: mail.cc } : {}),
                _template: 'table',
                _captcha: 'false',
                message: mail.text,
            }),
        });

        const raw = await res.text();
        let data: any = null;
        try {
            data = JSON.parse(raw);
        } catch {
            // HTML válasz = gyakran CF / hiba
        }

        const msg = String(data?.message || raw || '');
        const needsActivation = /activat/i.test(msg) || /Activate Form/i.test(msg);

        if (needsActivation) {
            console.error('FormSubmit needs activation:', msg);
            return {
                ok: false,
                provider: 'formsubmit',
                needsActivation: true,
                error: `FormSubmit aktiválás kell: nézd meg a(z) ${mail.to} postaládát (Spam is!), kattints az „Activate Form” linkre, majd foglalj újra.`,
            };
        }

        const successFlag = data?.success;
        const success =
            successFlag === true ||
            successFlag === 'true' ||
            /email has been sent|successfully sent|thank you/i.test(msg);

        if (success && res.ok) {
            return { ok: true, provider: 'formsubmit' };
        }

        console.error('FormSubmit rejected:', msg || raw);
        return {
            ok: false,
            provider: 'formsubmit',
            error: msg || 'Ismeretlen FormSubmit hiba',
        };
    } catch (err: any) {
        console.error('FormSubmit error:', err);
        return { ok: false, provider: 'formsubmit', error: err?.message || 'FormSubmit hálózati hiba' };
    }
}

/** Kliens: mindig az API-n keresztül (+ Firebase ID token, ha van). */
export async function sendBookingEmailFromClient(
    type: BookingEmailType,
    booking: BookingPayload
): Promise<EmailSendResult> {
    try {
        const { apiSendBookingEmail } = await import('../apiClient');
        const res = await apiSendBookingEmail(type, booking as unknown as Record<string, unknown>);
        if (res.ok) {
            return {
                ok: true,
                provider: res.data.provider as EmailSendResult['provider'],
                warning: res.data.warning,
            };
        }
        return {
            ok: false,
            needsActivation: !!res.meta?.needsActivation,
            error: res.error || 'E-mail API hiba',
            provider: res.meta?.provider as EmailSendResult['provider'],
        };
    } catch (err: any) {
        console.error('sendBookingEmailFromClient error:', err);
        return { ok: false, error: err?.message || 'E-mail küldés sikertelen' };
    }
}

/** @deprecated */
export async function sendBookingAdminEmail(booking: BookingPayload): Promise<boolean> {
    const r = await sendBookingEmailFromClient('admin_new', booking);
    return r.ok;
}
