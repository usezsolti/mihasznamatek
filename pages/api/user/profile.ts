import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../server/prisma';
import { parseJsonField, stringifyJsonField } from '../../../server/jsonField';
import { isAllowedOrigin, requireAuth, sanitizeText } from '../../../utils/apiSecurity';
import { sendErr, sendOk } from '../../../server/http';

const GDPR_VERSION = '2026-08-03';

export type UserProfilePayload = {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    educationLevel: string | null;
    profile: Record<string, unknown> | null;
    gdprAccepted: boolean;
    gdprAcceptedAt: string | null;
    gdprVersion: string | null;
};

function serializeUser(user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    educationLevel: string | null;
    profile: string | null;
    gdprAccepted: boolean;
    gdprAcceptedAt: Date | null;
    gdprVersion: string | null;
}): UserProfilePayload {
    const profile = parseJsonField<Record<string, unknown> | null>(user.profile, null);
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        image: user.image,
        educationLevel: user.educationLevel,
        profile: profile && typeof profile === 'object' && !Array.isArray(profile) ? profile : null,
        gdprAccepted: user.gdprAccepted,
        gdprAcceptedAt: user.gdprAcceptedAt?.toISOString() || null,
        gdprVersion: user.gdprVersion,
    };
}

function parseProfileBody(body: Record<string, unknown>) {
    const profileRaw = body.profile;
    let profile: Record<string, unknown> | undefined;
    if (profileRaw && typeof profileRaw === 'object' && !Array.isArray(profileRaw)) {
        profile = profileRaw as Record<string, unknown>;
    }

    const name =
        body.name !== undefined ? sanitizeText(body.name, 120) || null : undefined;
    const image =
        body.image !== undefined ? sanitizeText(body.image, 2048) || null : undefined;
    const educationLevel =
        body.educationLevel !== undefined
            ? sanitizeText(body.educationLevel, 40) || null
            : undefined;

    const gdprAccepted =
        body.gdprAccepted === true || body.gdprAccepted === 'true' ? true : undefined;

    return { profile, name, image, educationLevel, gdprAccepted };
}

async function applyProfileUpdate(
    uid: string,
    body: Record<string, unknown>,
    opts?: { upsertMissing?: boolean }
) {
    const parsed = parseProfileBody(body);
    const existing = await prisma.user.findUnique({ where: { id: uid } });
    if (!existing) {
        if (!opts?.upsertMissing) return null;
    }

    const data: {
        name?: string | null;
        image?: string | null;
        educationLevel?: string | null;
        profile?: string;
        gdprAccepted?: boolean;
        gdprAcceptedAt?: Date;
        gdprVersion?: string;
        email?: string | null;
    } = {};
    if (parsed.name !== undefined) data.name = parsed.name;
    if (parsed.image !== undefined) data.image = parsed.image;
    if (parsed.educationLevel !== undefined) data.educationLevel = parsed.educationLevel;
    if (parsed.profile !== undefined) {
        const prev = parseJsonField<Record<string, unknown>>(existing?.profile, {});
        data.profile = stringifyJsonField({ ...prev, ...parsed.profile });
    }
    if (parsed.gdprAccepted) {
        data.gdprAccepted = true;
        data.gdprAcceptedAt = new Date();
        data.gdprVersion = GDPR_VERSION;
    }

    if (existing) {
        return prisma.user.update({ where: { id: uid }, data });
    }

    return prisma.user.create({
        data: {
            id: uid,
            email: sanitizeText(body.email, 200) || null,
            name: parsed.name || null,
            image: parsed.image || null,
            educationLevel: parsed.educationLevel || null,
            profile: parsed.profile ? stringifyJsonField(parsed.profile) : undefined,
            gdprAccepted: parsed.gdprAccepted || false,
            gdprAcceptedAt: parsed.gdprAccepted ? new Date() : null,
            gdprVersion: parsed.gdprAccepted ? GDPR_VERSION : null,
        },
    });
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (!isAllowedOrigin(req)) return sendErr(res, 'Nem engedélyezett origin.', 403);

    const user = await requireAuth(req, res);
    if (!user) return;

    if (req.method === 'GET') {
        const row = await prisma.user.findUnique({ where: { id: user.uid } });
        if (!row) return sendErr(res, 'Felhasználó nem található.', 404);
        return sendOk(res, serializeUser(row));
    }

    if (req.method === 'PATCH') {
        const body = (req.body || {}) as Record<string, unknown>;
        const updated = await applyProfileUpdate(user.uid, body);
        if (!updated) return sendErr(res, 'Felhasználó nem található.', 404);
        return sendOk(res, serializeUser(updated));
    }

    if (req.method === 'POST') {
        const body = (req.body || {}) as Record<string, unknown>;
        const updated = await applyProfileUpdate(user.uid, body, { upsertMissing: true });
        if (!updated) return sendErr(res, 'Profil mentése sikertelen.', 500);
        return sendOk(res, serializeUser(updated));
    }

    return sendErr(res, 'Method not allowed', 405);
}
