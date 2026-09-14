/** Feltöltés MihaSocial posztokhoz (csak kép) — Firebase Storage. */

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;

export type UploadedSocialMedia = {
    kind: 'image';
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

export function isSocialVideoFile(file: File): boolean {
    if (file.type.startsWith('video/')) return true;
    return /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(file.name);
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
    if (isSocialVideoFile(file) || !file.type.startsWith('image/')) {
        throw new Error('Videót nem lehet posztolni, csak képet vagy szöveget.');
    }
    if (file.size > MAX_IMAGE_BYTES) {
        throw new Error('A kép max. 8 MB lehet.');
    }

    const firebase = typeof window !== 'undefined' ? (window as any).firebase : null;
    const payload = await compressImageFile(file);
    const contentType = payload.type || 'image/jpeg';
    const name = safeFileName(file.name || 'image.jpg');
    const path = `socialPosts/${uid}/${Date.now()}_${name}`;

    if (firebase?.storage) {
        try {
            const ref = firebase.storage().ref(path);
            await ref.put(payload, { contentType });
            const url = await ref.getDownloadURL();
            return { kind: 'image', url };
        } catch (e) {
            console.warn('Firebase Storage upload failed', e);
        }
    }

    const dataUrl = await blobToDataUrl(payload);
    if (dataUrl.length > 900_000) {
        throw new Error('A kép túl nagy Storage nélkül. Kapcsold be a Firebase Storage-t.');
    }
    return { kind: 'image', url: dataUrl };
}
