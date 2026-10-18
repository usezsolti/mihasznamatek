import { getIdToken } from './apiClient';
import type { ConversationPreview, DirectMessage } from './socialTypes';

export type InboxLiveSnapshot = {
    conversations: ConversationPreview[];
    conversationId: string;
    messages: DirectMessage[];
};

type StartArgs = {
    conversationId: string;
    poll: (isCurrent: () => boolean) => Promise<void>;
    onSnapshot: (snapshot: InboxLiveSnapshot) => void;
};

const POLL_WITH_SOCKET_MS = 8000;
const POLL_WITHOUT_SOCKET_MS = 2500;
const TOKEN_REFRESH_MS = 20 * 60 * 1000;

function socketUrl(): string {
    const proto = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    return `${proto}//${window.location.host}/api/social-live`;
}

/**
 * Polls the inbox, and opens a WebSocket when the host can upgrade one
 * (Vercel Fluid). `next dev` does not upgrade, so polling stays the local path.
 */
export function startInboxLive({ conversationId, poll, onSnapshot }: StartArgs): () => void {
    let cancelled = false;
    let socket: WebSocket | null = null;
    let socketOpen = false;
    let attempt = 0;
    let pollTimer = 0;
    let reconnectTimer = 0;
    let refreshTimer = 0;
    let pingTimer = 0;

    const schedulePoll = () => {
        window.clearInterval(pollTimer);
        const every = socketOpen ? POLL_WITH_SOCKET_MS : POLL_WITHOUT_SOCKET_MS;
        pollTimer = window.setInterval(() => {
            void poll(() => !cancelled).catch(() => {
                /* transient poll errors stay quiet; the next tick retries */
            });
        }, every);
    };

    const sendHello = async (current: WebSocket) => {
        const token = await getIdToken();
        if (!token || cancelled || current.readyState !== WebSocket.OPEN) return;
        current.send(
            JSON.stringify({
                type: 'hello',
                token,
                conversationId,
            })
        );
    };

    const connect = () => {
        if (cancelled) return;
        let next: WebSocket;
        try {
            next = new WebSocket(socketUrl());
        } catch {
            return;
        }
        socket = next;

        next.onopen = () => {
            if (cancelled || socket !== next) return;
            socketOpen = true;
            attempt = 0;
            schedulePoll();
            void sendHello(next);
            window.clearInterval(refreshTimer);
            refreshTimer = window.setInterval(() => {
                void sendHello(next);
            }, TOKEN_REFRESH_MS);
            window.clearInterval(pingTimer);
            pingTimer = window.setInterval(() => {
                if (next.readyState === WebSocket.OPEN) {
                    next.send(JSON.stringify({ type: 'ping' }));
                }
            }, 2000);
        };

        next.onmessage = (ev) => {
            if (cancelled) return;
            try {
                const data = JSON.parse(String(ev.data)) as Partial<InboxLiveSnapshot> & { type?: string };
                if (data.type !== 'snapshot') return;
                if (!Array.isArray(data.conversations)) return;
                onSnapshot({
                    conversations: data.conversations,
                    conversationId: typeof data.conversationId === 'string' ? data.conversationId : '',
                    messages: Array.isArray(data.messages) ? data.messages : [],
                });
            } catch {
                /* ignore malformed frames */
            }
        };

        const lost = () => {
            if (socket !== next) return;
            socketOpen = false;
            window.clearInterval(refreshTimer);
            window.clearInterval(pingTimer);
            schedulePoll();
            if (cancelled) return;
            const wait = Math.min(15000, 1000 * 2 ** attempt);
            attempt += 1;
            reconnectTimer = window.setTimeout(connect, wait);
        };

        next.onerror = () => {
            next.close();
        };
        next.onclose = lost;
    };

    void poll(() => !cancelled).catch(() => {
        /* ignore */
    });
    schedulePoll();
    connect();

    return () => {
        cancelled = true;
        window.clearInterval(pollTimer);
        window.clearInterval(refreshTimer);
        window.clearInterval(pingTimer);
        window.clearTimeout(reconnectTimer);
        socket?.close();
        socket = null;
    };
}
