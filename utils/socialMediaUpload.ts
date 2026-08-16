/** Feltöltés MihaSocial posztokhoz (kép / videó) — Vercel Blob via /api/upload. */

import { uploadFileViaApi } from './clientUpload';

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export type UploadedSocialMedia = {
    kind: 'image' | 'video';
    url: string;
};

function safeFileName(name: string): string {
    return name.replace(/[^\w.\-áéíóöőúüűÁÉÍÓÖŐÚÜŰ]+/gi, '_').slice(0, 80) || 'media';
}

async function compressImageFile(file: File): Promise<Blob> {
    if (!file.type.startsWith('image/') || file.type === 'image/gif') return file;
    const bitmap = await createImageBitmap(file);
    const maxSide = 1600;
    const scale = Math.min(1, maxSide / Math.max(bitmap.width, bitmap.height));
    const w = Math.max(1, Math.round(bitmap.width * scale));
    const h = Math.max(1, Math.round(bitmap.height * scale));
    const canvas = document.createElement('canvas');
    canvas.width = w;
    canvas.height = h;
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, w, h);
    bitmap.close?.();
    const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob((b) => resolve(b), 'image/jpeg', 0.85)
    );
    return blob || file;
}

export async function uploadSocialMedia(file: File, uid: string): Promise<UploadedSocialMedia> {
    const isVideo = file.type.startsWith('video/');
    const isImage = file.type.startsWith('image/');
    if (!isVideo && !isImage) {
        throw new Error('Csak képet vagy videót tölthetsz fel.');
    }
    if (isImage && file.size > MAX_IMAGE_BYTES) {
        throw new Error('A kép max. 8 MB lehet.');
    }
    if (isVideo && file.size > MAX_VIDEO_BYTES) {
        throw new Error('A videó max. 50 MB lehet.');
    }

    const kind: 'image' | 'video' = isVideo ? 'video' : 'image';
    const payload = isImage ? await compressImageFile(file) : file;
    const contentType = isImage ? (payload.type || 'image/jpeg') : file.type || 'video/mp4';
    const name = safeFileName(file.name || (isVideo ? 'video.mp4' : 'image.jpg'));
    const path = `socialPosts/${uid}/${Date.now()}_${name}`;

    const url = await uploadFileViaApi(payload, name, contentType, path);
    return { kind, url };
}
