import type { NextApiRequest, NextApiResponse } from 'next';
import { BACKEND_FRAMEWORK, BACKEND_NAME, BACKEND_RUNTIME, FIREBASE_PROJECT_ID } from '../../../server/config';
import { backendMode } from '../../../server/firebaseAdmin';
import { sendOk } from '../../../server/http';

/** GET /api/backend/health — Node.js + Next.js backend él-e */
export default function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }
    return sendOk(res, {
        name: BACKEND_NAME,
        runtime: BACKEND_RUNTIME,
        framework: BACKEND_FRAMEWORK,
        node: process.version,
        projectId: FIREBASE_PROJECT_ID,
        firestoreMode: backendMode(),
        time: new Date().toISOString(),
    });
}
