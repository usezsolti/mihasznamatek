import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { getFirebaseAdmin } from '../../../server/firebaseAdmin';
import {
    isEmailVerified,
    isUidEmailVerified,
    signEmailVerifyToken,
} from '../../../server/emailVerificationStore';
import { sendBrandedVerificationMail } from '../../../server/brandedMail';
import { hasResend } from '../../../server/resendMail';
import {
    getClientIp,
    isAllowedOrigin,
    mailLinkOrigin,
    rateLimit,
    requireAuth,
} from '../../../utils/apiSecurity';
import { agentDebugLog } from '../../../utils/agentDebugLog';
import { emailFromName } from '../../../utils/emailFrom';

/**
 * Levélben SOHA ne legyen localhost — az Spam mappába löki.
 * A megerősítő link a publikus HTTPS originre mutat.
 * Lokális custom tokenhez a válaszban külön localVerifyLink megy (UI gomb).
 */
function requestLocalOrigin(req: NextApiRequest): string | null {
    const originHeader = String(req.headers.origin || '').replace(/\/$/, '');
    if (/localhost|127\.0\.0\.1/i.test(originHeader)) return originHeader;
    const host = String(req.headers.host || '');
    if (/localhost|127\.0\.0\.1/i.test(host)) return `http://${host}`;
    return null;
}

/**
 * POST /api/auth/send-verification-email
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') return sendErr(res, 'Method not allowed', 405);
    if (!isAllowedOrigin(req)) return sendErr(res, 'Origin nem engedélyezett', 403);

    const ip = getClientIp(req);
    const rl = rateLimit(`verify-email:${ip}`, 8, 60 * 60 * 1000);
    if (!rl.ok) return sendErr(res, 'Túl sok megerősítő kérés. Várj egy órát.', 429);

    const user = await requireAuth(req, res);
    if (!user) return;
    if (!user.email) return sendErr(res, 'Nincs e-mail a fiókhoz.', 400);
    if (user.emailVerified || isUidEmailVerified(user.uid) || isEmailVerified(user.email)) {
        return sendOk(res, { alreadyVerified: true });
    }

    const admin = getFirebaseAdmin();
    const gmailPass = String(process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
    const origin = mailLinkOrigin(req);

    if (!gmailPass && !hasResend()) {
        // #region agent log
        agentDebugLog({
            hypothesisId: 'S1',
            location: 'api/auth/send-verification-email.ts',
            message: 'no gmail — firebase fallback',
            data: { hasAdmin: Boolean(admin), hasGmail: false, fromName: emailFromName() },
            runId: 'spam-deliverability',
        });
        // #endregion
        return sendOk(res, {
            fallback: 'firebase',
            hint: 'Nincs GMAIL_APP_PASSWORD — Firebase noreply levél.',
        });
    }

    try {
        let link: string;
        let mode: 'gmail-admin' | 'gmail-custom';
        const localOrigin = requestLocalOrigin(req);
        const token = signEmailVerifyToken(user.email);

        if (admin) {
            try {
                link = await admin.auth().generateEmailVerificationLink(user.email, {
                    url: `${origin}/dashboard`,
                    handleCodeInApp: false,
                });
                mode = 'gmail-admin';
            } catch {
                link = `${origin}/verify-email?token=${encodeURIComponent(token)}`;
                mode = 'gmail-custom';
            }
        } else {
            link = `${origin}/verify-email?token=${encodeURIComponent(token)}`;
            mode = 'gmail-custom';
        }

        const tokenFromLink = (() => {
            try {
                return new URL(link).searchParams.get('token') || '';
            } catch {
                return '';
            }
        })();
        const uiLink =
            mode === 'gmail-custom' && localOrigin && tokenFromLink
                ? `${localOrigin}/verify-email?token=${encodeURIComponent(tokenFromLink)}`
                : link;

        const linkHasLocalhost = /localhost|127\.0\.0\.1/i.test(link);
        await sendBrandedVerificationMail({ to: user.email, link });

        // #region agent log
        agentDebugLog({
            hypothesisId: 'S1-S2',
            location: 'api/auth/send-verification-email.ts:ok',
            message: 'verification sent via gmail (deliverability pass)',
            data: {
                ok: true,
                fromName: emailFromName(),
                provider: 'gmail',
                mode,
                hasAdmin: Boolean(admin),
                linkHasLocalhost,
                linkHost: (() => {
                    try {
                        return new URL(link).host;
                    } catch {
                        return 'invalid';
                    }
                })(),
                uiLinkIsLocal: /localhost|127\.0\.0\.1/i.test(uiLink),
            },
            runId: 'spam-deliverability',
        });
        // #endregion

        return sendOk(res, {
            provider: hasResend() ? 'resend' : 'gmail',
            mode,
            verifyLink: uiLink,
        });
    } catch (err: any) {
        console.error('send-verification-email', err);
        // #region agent log
        agentDebugLog({
            hypothesisId: 'S4',
            location: 'api/auth/send-verification-email.ts:err',
            message: 'gmail verify send failed',
            data: { err: String(err?.message || err).slice(0, 160) },
            runId: 'spam-deliverability',
        });
        // #endregion
        return sendErr(
            res,
            `Gmail küldés sikertelen: ${String(err?.message || err).slice(0, 120)}`,
            502
        );
    }
}
