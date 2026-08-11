import type { NextApiRequest, NextApiResponse } from 'next';
import { withBackendAuth, sendOk, sendErr } from '../../../server/http';
import { getDocument, setDocument, nowMs } from '../../../server/firestoreRest';

/** Diagnosztika — csak non-prod VAGY ALLOW_SOCIAL_DIAG=1. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const allowed =
        process.env.NODE_ENV !== 'production' ||
        String(process.env.ALLOW_SOCIAL_DIAG || '') === '1';
    if (!allowed) {
        return sendErr(res, 'Not found', 404);
    }

    const auth = await withBackendAuth(req, res, {
        methods: ['POST'],
        rateKey: 'social-diag',
        limit: 20,
        windowMs: 60 * 60 * 1000,
    });
    if (!auth) return;
    const { user, token } = auth;
    const pathDoc = `socialProfiles/${user.uid}`;

    try {
        let existing: Record<string, unknown> | null = null;
        try {
            existing = await getDocument(pathDoc, token);
        } catch (e: any) {
            return sendOk(res, {
                step: 'get',
                ok: false,
                error: String(e?.message || e),
                hint: 'Firestore rules valószínűleg nincs Publish-olva a socialProfiles-ra.',
            });
        }

        if (!existing) {
            try {
                await setDocument(
                    pathDoc,
                    token,
                    {
                        uid: user.uid,
                        username: `diag${user.uid.slice(0, 4)}`,
                        displayName: 'Diag',
                        photoURL: '',
                        bio: '',
                        xp: 0,
                        rank: 'BEGINNER',
                        followerCount: 0,
                        followingCount: 0,
                        postCount: 0,
                        showXp: true,
                        createdAtMs: nowMs(),
                        updatedAtMs: nowMs(),
                    },
                    false
                );
                return sendOk(res, { step: 'create', ok: true });
            } catch (e: any) {
                return sendOk(res, {
                    step: 'create',
                    ok: false,
                    error: String(e?.message || e),
                    hint: 'CREATE tiltva — Publish a firestore.rules-t.',
                });
            }
        }

        try {
            await setDocument(pathDoc, token, { updatedAtMs: nowMs() }, true);
            return sendOk(res, { step: 'update', ok: true, existed: true });
        } catch (e: any) {
            return sendOk(res, {
                step: 'update',
                ok: false,
                error: String(e?.message || e),
                hint: 'UPDATE tiltva a saját socialProfiles dokumentumon.',
            });
        }
    } catch (e: any) {
        return sendErr(res, e?.message || 'diag hiba', 500);
    }
}
