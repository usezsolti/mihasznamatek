/** Feltöltés MihaSocial posztokhoz (kép / videó) — Firebase Storage. */

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const MAX_VIDEO_BYTES = 50 * 1024 * 1024;

export type UploadedSocialMedia = {
    kind: 'image' | 'video';
    url: string;
};

function safeFileName(name: string): string {
    return name.replace(/[^\w.\-áéíóöőúüűÁÉÍÓÖŐÚÜŰ]+/gi, '_').slice(0, 80) || 'media';
}

function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result || ''));
        reader.onerror = () => reject(new Error('Fájl olvasási hiba'));
        reader.readAsDataURL(blob);
    });
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

    const firebase = typeof window !== 'undefined' ? (window as any).firebase : null;
    const kind: 'image' | 'video' = isVideo ? 'video' : 'image';
    const payload = isImage ? await compressImageFile(file) : file;
    const contentType = isImage ? (payload.type || 'image/jpeg') : file.type || 'video/mp4';
    const name = safeFileName(file.name || (isVideo ? 'video.mp4' : 'image.jpg'));
    const path = `socialPosts/${uid}/${Date.now()}_${name}`;

    if (firebase?.storage) {
        try {
            const ref = firebase.storage().ref(path);
            await ref.put(payload, { contentType });
            const url = await ref.getDownloadURL();
            return { kind, url };
        } catch (e) {
            console.warn('Firebase Storage upload failed', e);
            if (isVideo) {
                throw new Error(
                    'Videó feltöltéshez Firebase Storage kell. Állítsd be a Storage-t, vagy tölts fel képet.'
                );
            }
        }
    } else if (isVideo) {
        throw new Error('Videóhoz Firebase Storage szükséges.');
    }

    // Kép fallback: data URL (csak ha Storage nincs / elbukott)
    const dataUrl = await blobToDataUrl(payload);
    if (dataUrl.length > 900_000) {
        throw new Error('A kép túl nagy Storage nélkül. Kapcsold be a Firebase Storage-t.');
    }
    return { kind: 'image', url: dataUrl };
}
