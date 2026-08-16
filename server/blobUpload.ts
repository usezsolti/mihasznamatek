import { put } from '@vercel/blob';

export class BlobUploadError extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'BlobUploadError';
    }
}

/** Vercel Blob feltöltés — nyilvános URL visszaadása. */
export async function uploadBlob(
    filename: string,
    data: Buffer | Uint8Array | Blob | string,
    contentType: string
): Promise<string> {
    const token = String(process.env.BLOB_READ_WRITE_TOKEN || '').trim();
    if (!token) {
        throw new BlobUploadError('A fájlfeltöltés nincs konfigurálva (BLOB_READ_WRITE_TOKEN).');
    }

    const safeName = filename.replace(/[^\w.\-/]+/g, '_').slice(0, 200) || 'upload.bin';
    const result = await put(safeName, data, {
        access: 'public',
        contentType: contentType || 'application/octet-stream',
        token,
    });
    return result.url;
}
