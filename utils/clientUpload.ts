/** Közös kliens feltöltés — POST /api/upload (Vercel Blob). */

async function blobToBase64(blob: Blob): Promise<string> {
    const buffer = await blob.arrayBuffer();
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunk = 0x8000;
    for (let i = 0; i < bytes.length; i += chunk) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
    }
    return btoa(binary);
}

export async function uploadFileViaApi(
    file: Blob,
    filename: string,
    contentType: string,
    path?: string
): Promise<string> {
    const dataBase64 = await blobToBase64(file);
    const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
            filename: path || filename,
            contentType: contentType || file.type || 'application/octet-stream',
            dataBase64,
        }),
    });
    const json = (await res.json().catch(() => ({}))) as { ok?: boolean; url?: string; error?: string };
    if (!res.ok || !json.ok || !json.url) {
        throw new Error(json.error || `Feltöltés sikertelen (${res.status}).`);
    }
    return json.url;
}
