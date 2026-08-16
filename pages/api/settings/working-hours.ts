import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../server/http';
import { prisma } from '../../../server/prisma';
import { parseJsonField, stringifyJsonField } from '../../../server/jsonField';
import { isAllowedOrigin, requireAdmin } from '../../../utils/apiSecurity';
import {
    DEFAULT_WORKING_HOURS,
    normalizeWorkingHours,
} from '../../../utils/bookingSlots';

const SETTINGS_ID = 'workingHours';

/**
 * GET /api/settings/working-hours — public
 * PUT /api/settings/working-hours — admin
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'GET' && req.method !== 'PUT') {
        return sendErr(res, 'Method not allowed', 405);
    }
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }

    if (req.method === 'GET') {
        try {
            const row = await prisma.setting.findUnique({ where: { id: SETTINGS_ID } });
            const hours = normalizeWorkingHours(
                parseJsonField(row?.value, { hours: DEFAULT_WORKING_HOURS })
            );
            return sendOk(res, { hours });
        } catch (e: any) {
            return sendOk(res, { hours: normalizeWorkingHours(DEFAULT_WORKING_HOURS) });
        }
    }

    const admin = await requireAdmin(req, res);
    if (!admin) return;

    const raw = (req.body as { hours?: WorkingHoursMap })?.hours;
    const hours = normalizeWorkingHours(raw);

    try {
        await prisma.setting.upsert({
            where: { id: SETTINGS_ID },
            create: { id: SETTINGS_ID, value: stringifyJsonField({ hours }) },
            update: { value: stringifyJsonField({ hours }) },
        });
        return sendOk(res, { hours });
    } catch (e: any) {
        return sendErr(res, String(e?.message || e), 500);
    }
}
