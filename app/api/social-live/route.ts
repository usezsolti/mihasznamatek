import { upgradeWebSocket } from '@vercel/functions';
import { createSocialStore } from '../../../server/socialStore';
import { inboxSnapshot, snapshotKey, type InboxSnapshot } from '../../../server/socialLiveTail';
import { verifyFirebaseIdToken } from '../../../utils/apiSecurity';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';
/** Fluid keeps the socket open; the client reconnects when the instance recycles. */
export const maxDuration = 60;

const TICK_MS = 1500;
const MAX_FRAME_CHARS = 12_000;

type LiveSocket = {
    send: (data: string) => void;
    close: (code?: number, reason?: string) => void;
    on: (event: 'message' | 'close' | 'error', listener: (...args: unknown[]) => void) => void;
};

function asText(raw: unknown): string {
    if (typeof raw === 'string') return raw;
    if (raw instanceof Uint8Array) return new TextDecoder().decode(raw);
    if (raw && typeof raw === 'object' && 'toString' in raw) return String(raw);
    return '';
}

function attachLiveSocket(ws: LiveSocket) {
    let closed = false;
    let token = '';
    let uid = '';
    let conversationId = '';
    let lastKey = '';
    let ticking = false;
    let timer: ReturnType<typeof setInterval> | null = null;

    const stop = () => {
        closed = true;
        if (timer) clearInterval(timer);
        timer = null;
    };

    const publish = async () => {
        if (closed || ticking || !token) return;
        ticking = true;
        try {
            if (!uid) {
                const user = await verifyFirebaseIdToken(token);
                if (!user) {
                    ws.close(4401, 'auth');
                    stop();
                    return;
                }
                uid = user.uid;
            }
            const store = createSocialStore(token);
            const conversations = await store.listConversations(uid);
            const messages = conversationId ? await store.listMessages(conversationId) : [];
            const snapshot: InboxSnapshot = inboxSnapshot(conversations, conversationId, messages);
            const key = snapshotKey(snapshot);
            if (key === lastKey) return;
            lastKey = key;
            ws.send(JSON.stringify({ type: 'snapshot', ...snapshot }));
        } catch {
            /* next tick retries; a dead socket closes below */
        } finally {
            ticking = false;
        }
    };

    ws.on('close', stop);
    ws.on('error', stop);
    ws.on('message', (raw) => {
        const text = asText(raw);
        if (!text || text.length > MAX_FRAME_CHARS) return;
        let body: { type?: string; token?: string; conversationId?: string };
        try {
            body = JSON.parse(text) as typeof body;
        } catch {
            return;
        }
        if (body.type === 'ping') {
            void publish();
            return;
        }
        if (body.type !== 'hello') return;
        if (typeof body.token === 'string' && body.token && body.token !== token) {
            token = body.token;
            uid = '';
            lastKey = '';
        }
        conversationId =
            typeof body.conversationId === 'string' && /^[A-Za-z0-9_-]{1,180}$/.test(body.conversationId)
                ? body.conversationId
                : '';
        lastKey = '';
        void publish();
    });

    timer = setInterval(() => {
        void publish();
    }, TICK_MS);
}

export function GET() {
    return upgradeWebSocket((ws) => {
        attachLiveSocket(ws as LiveSocket);
    }).catch(() => Response.json({ ok: false, live: 'poll' }, { status: 501 }));
}
