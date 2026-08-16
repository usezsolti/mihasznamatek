import type { NextApiRequest, NextApiResponse } from 'next';
import { BlobUploadError, uploadBlob } from '../../server/blobUpload';
import { getClientIp, isAllowedOrigin, rateLimit, requireAuth, sanitizeText } from '../../utils/apiSecurity';

export const config = {
    api: { bodyParser: { sizeLimit: '55mb' } },
};

const MAX_BYTES = 50 * 1024 * 1024;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ ok: false, error: 'Method not allowed' });
    }
    if (!isAllowedOrigin(req)) {
        return res.status(403).json({ ok: false, error: 'Nem engedélyezett origin.' });
    }

    const user = await requireAuth(req, res);
    if (!user) return;

    const ip = getClientIp(req);
    const rl = rateLimit(`upload:${ip}:${user.uid}`, 30, 60 * 60 * 1000);
    if (!rl.ok) {
        return res.status(429).json({ ok: false, error: 'Túl sok feltöltés. Próbáld később.' });
    }

    const filename = sanitizeText(req.body?.filename, 220);
    const contentType = sanitizeText(req.body?.contentType, 120) || 'application/octet-stream';
    const dataBase64 = String(req.body?.dataBase64 || '');

    if (!filename || !dataBase64) {
        return res.status(400).json({ ok: false, error: 'filename és dataBase64 kötelező.' });
    }

    let buffer: Buffer;
    try {
        buffer = Buffer.from(dataBase64, 'base64');
    } catch {
        return res.status(400).json({ ok: false, error: 'Érvénytelen base64 adat.' });
    }

    if (!buffer.length) {
        return res.status(400).json({ ok: false, error: 'Üres fájl.' });
    }
    if (buffer.length > MAX_BYTES) {
        return res.status(413).json({ ok: false, error: 'A fájl túl nagy (max. 50 MB).' });
    }

    const scopedName = filename.includes('/')
        ? filename
        : `uploads/${user.uid}/${Date.now()}_${filename}`;

    try {
        const url = await uploadBlob(scopedName, buffer, contentType);
        return res.status(200).json({ ok: true, url });
    } catch (e) {
        const message =
            e instanceof BlobUploadError
                ? e.message
                : e instanceof Error
                  ? e.message
                  : 'Feltöltés sikertelen.';
        console.error('api/upload', e);
        return res.status(503).json({ ok: false, error: message });
    }
}
