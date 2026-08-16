import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { prisma } from '../../../server/prisma';
import { isAllowedOrigin, requireAuth } from '../../../utils/apiSecurity';

/** Diagnosztika — Prisma social profile read/write. Csak non-prod VAGY ALLOW_SOCIAL_DIAG=1. */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const allowed =
        process.env.NODE_ENV !== 'production' ||
        String(process.env.ALLOW_SOCIAL_DIAG || '') === '1';
    if (!allowed) {
        return sendErr(res, 'Not found', 404);
    }

    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }
    if (req.method !== 'POST') {
        return sendErr(res, 'Method not allowed', 405);
    }

    const user = await requireAuth(req, res);
    if (!user) return;

    try {
        const existing = await prisma.socialProfile.findUnique({ where: { uid: user.uid } });

        if (!existing) {
            await prisma.socialProfile.create({
                data: {
                    uid: user.uid,
                    username: `diag${user.uid.slice(0, 4)}`,
                    displayName: 'Diag',
                    bio: '',
                    photoURL: null,
                },
            });
            return sendOk(res, { step: 'create', ok: true });
        }

        await prisma.socialProfile.update({
            where: { uid: user.uid },
            data: { updatedAt: new Date() },
        });
        return sendOk(res, { step: 'update', ok: true, existed: true });
    } catch (e: unknown) {
        return sendOk(res, {
            step: 'prisma',
            ok: false,
            error: String((e as Error)?.message || e),
            hint: 'Ellenőrizd a DATABASE_URL-t és a Prisma migrációt.',
        });
    }
}
