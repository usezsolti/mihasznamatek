import type { NextApiRequest, NextApiResponse } from 'next';
import { BACKEND_FRAMEWORK, BACKEND_NAME, BACKEND_RUNTIME, FIREBASE_PROJECT_ID } from '../../../server/config';
import { backendMode } from '../../../server/firebaseAdmin';
import { sendOk } from '../../../server/http';
import { isLocalSocialStore } from '../../../server/localSocialDb';

/** GET /api/backend/health — productionben minimális válasz. */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }

    const isProd = process.env.NODE_ENV === 'production';
    const verbose =
        !isProd || String(process.env.ALLOW_HEALTH_DETAILS || '') === '1';

    if (!verbose) {
        return sendOk(res, {
            name: BACKEND_NAME,
            okAlive: true,
            time: new Date().toISOString(),
        });
    }

    let firestoreMode: string = 'user-token';
    try {
        firestoreMode = backendMode();
    } catch {
        firestoreMode = 'user-token';
    }
    return sendOk(res, {
        name: BACKEND_NAME,
        runtime: BACKEND_RUNTIME,
        framework: BACKEND_FRAMEWORK,
        node: process.version,
        projectId: FIREBASE_PROJECT_ID,
        firestoreMode,
        socialDataStore: isLocalSocialStore() ? 'local' : 'firestore',
        apiOnly: String(process.env.NEXT_PUBLIC_SOCIAL_API_ONLY || '') === '1',
        time: new Date().toISOString(),
    });
}
