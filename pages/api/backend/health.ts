import type { NextApiRequest, NextApiResponse } from 'next';
import { BACKEND_FRAMEWORK, BACKEND_NAME, BACKEND_RUNTIME } from '../../../server/config';
import { sendOk } from '../../../server/http';
import { isLocalSocialStore } from '../../../server/localSocialDb';
import { usePrismaSocialStore } from '../../../server/socialStore';

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

    const socialDataStore = usePrismaSocialStore()
        ? 'prisma'
        : isLocalSocialStore()
          ? 'local'
          : 'prisma';

    return sendOk(res, {
        name: BACKEND_NAME,
        runtime: BACKEND_RUNTIME,
        framework: BACKEND_FRAMEWORK,
        node: process.version,
        database: usePrismaSocialStore() ? 'postgresql' : 'none',
        socialDataStore,
        apiOnly: String(process.env.NEXT_PUBLIC_SOCIAL_API_ONLY || '') === '1',
        time: new Date().toISOString(),
    });
}
