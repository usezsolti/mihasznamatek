import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk, withBackendAuth } from '../../../server/http';
import { isLocalSocialStore } from '../../../server/localSocialDb';
import { createSocialStore, runSocialAction } from '../../../server/socialStore';

/**
 * POST /api/backend/social
 * Body: { action: string, ...params }
 * Auth: Bearer Firebase ID token
 * SOCIAL_DATA_STORE=local → fájl store; egyébként Firestore
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const useLocal = isLocalSocialStore();
    const auth = await withBackendAuth(req, res, {
        methods: ['POST'],
        rateKey: useLocal ? 'social-local' : 'social-v2',
        limit: useLocal ? 300 : 120,
        windowMs: 60 * 1000,
    });
    if (!auth) return;

    const { user, token } = auth;
    const action = String(req.body?.action || '');
    const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;

    try {
        const store = createSocialStore(token);
        const result = await runSocialAction(store, action, user.uid, body);
        return sendOk(res, result.data, result.status || 200);
    } catch (e: any) {
        const status = typeof e?.status === 'number' ? e.status : 500;
        console.error('backend/social', action, e);
        return sendErr(res, e?.message || 'Backend hiba', status);
    }
}
