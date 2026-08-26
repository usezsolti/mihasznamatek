import { getFirebase, type BookingAttachment } from './types';

const BOOKING_FILE_MAX_BYTES = 8 * 1024 * 1024;
const BOOKING_FILE_MAX_COUNT = 5;
const BOOKING_FILE_ACCEPT = /\.(pdf|jpe?g|png|docx?)$/i;

function sanitizeFileName(name: string): string {
    return name.replace(/[^\w.\-()\u00C0-\u024F ]+/g, '_').slice(0, 120) || 'file';
}

/** Foglaláshoz csatolt fájlok feltöltése Firebase Storage-ba. */
export async function uploadBookingAttachments(
    bookingId: string,
    files: File[]
): Promise<{ ok: boolean; files: BookingAttachment[]; error?: string }> {
    if (!files.length) return { ok: true, files: [] };
    if (files.length > BOOKING_FILE_MAX_COUNT) {
        return {
            ok: false,
            files: [],
            error: `Maximum ${BOOKING_FILE_MAX_COUNT} fájl csatolható.`,
        };
    }

    for (const file of files) {
        if (file.size > BOOKING_FILE_MAX_BYTES) {
            return {
                ok: false,
                files: [],
                error: `"${file.name}" túl nagy (max. 8 MB).`,
            };
        }
        if (!BOOKING_FILE_ACCEPT.test(file.name)) {
            return {
                ok: false,
                files: [],
                error: `"${file.name}" nem támogatott. Engedélyezett: PDF, JPG, PNG, DOC, DOCX.`,
            };
        }
    }

    const firebase = getFirebase();
    if (!firebase?.storage) {
        return {
            ok: false,
            files: [],
            error: 'A fájlfeltöltés most nem elérhető (Storage). Próbáld fájl nélkül, vagy később.',
        };
    }
    if (!firebase.auth?.()?.currentUser) {
        return {
            ok: false,
            files: [],
            error:
                'A fájlfeltöltéshez bejelentkezés kell. Vendégként foglalj fájl nélkül, vagy lépj be előbb.',
        };
    }

    const uploaded: BookingAttachment[] = [];
    try {
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            const safe = sanitizeFileName(file.name);
            const path = `booking-files/${bookingId}/${Date.now()}_${i}_${safe}`;
            const ref = firebase.storage().ref(path);
            await ref.put(file, { contentType: file.type || 'application/octet-stream' });
            const url = await ref.getDownloadURL();
            uploaded.push({ name: file.name, url });
        }
        return { ok: true, files: uploaded };
    } catch (err: any) {
        console.error('uploadBookingAttachments failed:', err);
        const denied = /permission|unauthorized|storage\/unauthorized/i.test(
            String(err?.code || err?.message || '')
        );
        return {
            ok: false,
            files: uploaded,
            error: denied
                ? 'Fájlfeltöltéshez bejelentkezés szükséges. Lépj be, vagy küldd fájl nélkül.'
                : err?.message ||
                  'Fájlfeltöltés sikertelen. Ellenőrizd a Firebase Storage szabályokat, vagy küldd fájl nélkül.',
        };
    }
}
