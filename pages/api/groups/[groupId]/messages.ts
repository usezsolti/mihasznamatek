import type { NextApiRequest, NextApiResponse } from 'next';
import { sendErr, sendOk } from '../../../../server/http';
import { prisma } from '../../../../server/prisma';
import { isAllowedOrigin, requireAuth, sanitizeText } from '../../../../utils/apiSecurity';

async function assertMember(groupId: string, uid: string): Promise<boolean> {
    const member = await prisma.studyGroupMember.findUnique({
        where: { groupId_uid: { groupId, uid } },
    });
    return !!member;
}

function mapMessage(
    row: { id: string; senderId: string; text: string; createdAt: Date },
    profile?: { displayName: string; photoURL: string | null } | null
) {
    return {
        id: row.id,
        senderId: row.senderId,
        senderName: profile?.displayName || 'Diák',
        senderPhoto: profile?.photoURL || '',
        text: row.text,
        createdAtMs: row.createdAt.getTime(),
    };
}

/**
 * GET  /api/groups/[groupId]/messages
 * POST /api/groups/[groupId]/messages
 */
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!isAllowedOrigin(req)) {
        return sendErr(res, 'Nem engedélyezett origin.', 403);
    }

    const user = await requireAuth(req, res);
    if (!user) return;

    const groupId = String(req.query.groupId || '').trim();
    if (!groupId) return sendErr(res, 'Hiányzó csoport azonosító.', 400);

    const isMember = await assertMember(groupId, user.uid);
    if (!isMember) return sendErr(res, 'Nem vagy tagja a csoportnak.', 403);

    if (req.method === 'GET') {
        try {
            const sinceMs = Number(req.query.sinceMs || 0);
            const rows = await prisma.groupMessage.findMany({
                where: {
                    groupId,
                    ...(sinceMs > 0 ? { createdAt: { gt: new Date(sinceMs) } } : {}),
                },
                orderBy: { createdAt: 'asc' },
                take: 120,
            });

            const senderIds = [...new Set(rows.map((r) => r.senderId))];
            const profiles = senderIds.length
                ? await prisma.socialProfile.findMany({
                      where: { uid: { in: senderIds } },
                      select: { uid: true, displayName: true, photoURL: true },
                  })
                : [];
            const profileMap = new Map(profiles.map((p) => [p.uid, p]));

            return sendOk(res, {
                messages: rows.map((r) => mapMessage(r, profileMap.get(r.senderId))),
            });
        } catch (e: any) {
            console.error('groups/messages GET', e);
            return sendErr(res, String(e?.message || e), 500);
        }
    }

    if (req.method === 'POST') {
        const body = (req.body && typeof req.body === 'object' ? req.body : {}) as Record<string, unknown>;
        const text = sanitizeText(body.text, 1000);
        if (!text) return sendErr(res, 'Üres üzenet.', 400);

        try {
            const profile = await prisma.socialProfile.findUnique({
                where: { uid: user.uid },
                select: { displayName: true, photoURL: true },
            });

            const row = await prisma.groupMessage.create({
                data: { groupId, senderId: user.uid, text },
            });
            return sendOk(res, { message: mapMessage(row, profile) }, 201);
        } catch (e: any) {
            console.error('groups/messages POST', e);
            return sendErr(res, String(e?.message || e), 500);
        }
    }

    return sendErr(res, 'Method not allowed', 405);
}
