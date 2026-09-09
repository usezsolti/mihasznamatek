import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { getAdminDb } from '../../../server/firebaseAdmin';
import {
    isAllowedOrigin,
    requireAuth,
    sanitizeText,
} from '../../../utils/apiSecurity';
import { agentDebugLog } from '../../../utils/agentDebugLog';
import {
    normalizeUsername,
    validateRegistrationProfile,
    type PreferredLessonType,
} from '../../../utils/registrationProfile';

/**
 * Google-regisztráció profil mentése — Admin SDK ha van, különben a kliens ír.
 * Soha ne dőljön el 500-zal.
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    try {
        if (req.method !== 'POST') return sendErr(res, 'Method not allowed', 405);
        if (!isAllowedOrigin(req)) return sendErr(res, 'Nem engedélyezett origin.', 403);

        const user = await requireAuth(req, res);
        if (!user) return;

        const name = sanitizeText(req.body?.name, 120);
        const username = normalizeUsername(sanitizeText(req.body?.username, 24));
        const preferredLessonType: PreferredLessonType =
            req.body?.preferredLessonType === 'personal' ? 'personal' : 'online';
        const preferredSubject = sanitizeText(req.body?.preferredSubject, 80);
        const hobby = sanitizeText(req.body?.hobby, 200);
        const postalCode = sanitizeText(req.body?.postalCode, 16);
        const street = sanitizeText(req.body?.street, 120);
        const houseNumber = sanitizeText(req.body?.houseNumber, 32);

        const profileErr = validateRegistrationProfile({
            name,
            username,
            preferredLessonType,
            preferredSubject,
            hobby,
            postalCode,
            street,
            houseNumber,
        });
        if (profileErr) return sendErr(res, profileErr, 400);

        const db = getAdminDb();
        // #region agent log
        agentDebugLog({
            hypothesisId: 'B',
            location: 'complete-profile.ts',
            message: 'complete-profile write',
            data: { hasAdminDb: Boolean(db), uidLen: user.uid.length },
            runId: 'reg-save',
        });
        // #endregion
        if (!db) {
            return sendOk(res, { fallback: 'client' as const });
        }

        const now = new Date();
        await db.collection('users').doc(user.uid).set(
            {
                email: user.email || '',
                name,
                username,
                preferredLessonType,
                preferredSubject,
                hobby,
                postalCode,
                street,
                houseNumber,
                gdprAccepted: true,
                gdprAcceptedAt: now,
                gdprVersion: '2026-08-03',
                profileCompletedAt: now,
                updatedAt: now,
            },
            { merge: true }
        );

        return sendOk(res, { saved: true });
    } catch (err) {
        console.error('complete-profile:', err);
        return sendErr(res, 'A profil mentése nem sikerült. Próbáld újra.', 503);
    }
}
