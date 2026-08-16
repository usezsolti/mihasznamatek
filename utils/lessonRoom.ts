/** Élő óra szoba — nyílt link, WebRTC + whiteboard + chat (Postgres poll). */

import { createWhiteboard } from './whiteboardSync';
import {
    apiGetAuth,
    apiPatchAuth,
    apiPostAuth,
} from './apiClient';

export type LessonRoom = {
    id: string;
    title: string;
    createdBy: string;
    whiteboardId: string;
    jitsiRoom: string;
    createdAtMs: number;
    bookingId?: string;
    studentName?: string;
};

export type LessonMessage = {
    id: string;
    senderId: string;
    senderName: string;
    senderPhoto: string;
    text: string;
    createdAtMs: number;
};

const POLL_MS = 1500;

export function lessonCallRoomName(roomId: string): string {
    const safe = roomId.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 48) || 'ora';
    return `MihasznaOra-${safe}`;
}

export function lessonCallUrl(room: Pick<LessonRoom, 'jitsiRoom' | 'id'>): string {
    const name = room.jitsiRoom || lessonCallRoomName(room.id);
    const hash = [
        'config.prejoinPageEnabled=true',
        'config.disableNS=false',
        'config.disableAEC=false',
        'config.disableAGC=false',
    ].join('&');
    return `https://meet.jit.si/${encodeURIComponent(name)}#${hash}`;
}

export function lessonJoinPath(roomId: string): string {
    return `/ora/${encodeURIComponent(roomId)}`;
}

export function mapLessonRoom(id: string, d: Record<string, unknown>): LessonRoom {
    return {
        id,
        title: String(d.title || 'Matek óra'),
        createdBy: String(d.createdBy || ''),
        whiteboardId: String(d.whiteboardId || ''),
        jitsiRoom: String(d.jitsiRoom || lessonCallRoomName(id)),
        createdAtMs: Number(d.createdAtMs || 0),
        bookingId: d.bookingId ? String(d.bookingId) : undefined,
        studentName: d.studentName ? String(d.studentName) : undefined,
    };
}

export function mapLessonMessage(id: string, d: Record<string, unknown>): LessonMessage {
    return {
        id,
        senderId: String(d.senderId || ''),
        senderName: String(d.senderName || 'Vendég'),
        senderPhoto: String(d.senderPhoto || ''),
        text: String(d.text || ''),
        createdAtMs: Number(d.createdAtMs || Date.now()),
    };
}

export async function createLessonRoom(params: {
    title: string;
    createdBy: string;
    bookingId?: string;
    studentName?: string;
}): Promise<{ room: LessonRoom; warning?: string }> {
    const uid = params.createdBy;
    if (!uid) throw new Error('Nincs felhasználó');

    const res = await apiPostAuth<{ room: Record<string, unknown> }>('/api/lesson/rooms', {
        title: (params.title || 'Matek óra').trim().slice(0, 120) || 'Matek óra',
        bookingId: params.bookingId,
        studentName: params.studentName,
    });

    if (res.ok) {
        const room = mapLessonRoom(String(res.data.room.id), res.data.room);
        return { room };
    }

    // Fallback: local-only room if API unavailable
    const title = (params.title || 'Matek óra').trim().slice(0, 120) || 'Matek óra';
    const board = await createWhiteboard(uid, `${title} tábla`);
    const id = `ora_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
    const room: LessonRoom = {
        id,
        title,
        createdBy: uid,
        whiteboardId: board.meta.id,
        jitsiRoom: lessonCallRoomName(id),
        createdAtMs: Date.now(),
        bookingId: params.bookingId,
        studentName: params.studentName,
    };
    return {
        room,
        warning: board.warning || res.error || 'Óra létrehozás helyi módban.',
    };
}

export async function loadLessonRoom(roomId: string): Promise<LessonRoom | null> {
    const id = String(roomId || '').trim();
    if (!id) return null;

    const res = await apiGetAuth<{ room: Record<string, unknown> }>(
        `/api/lesson/rooms?id=${encodeURIComponent(id)}`
    );
    if (res.ok) {
        return mapLessonRoom(String(res.data.room.id || id), res.data.room);
    }
    return null;
}

export async function ensureLessonWhiteboard(
    room: LessonRoom,
    uid: string
): Promise<{ whiteboardId: string; room: LessonRoom; warning?: string }> {
    if (room.whiteboardId) {
        return { whiteboardId: room.whiteboardId, room };
    }

    const created = await createWhiteboard(uid, `${room.title} tábla`);
    const whiteboardId = created.meta.id;
    const next = { ...room, whiteboardId };

    const res = await apiPatchAuth<{ room: Record<string, unknown> }>('/api/lesson/rooms', {
        roomId: room.id,
        whiteboardId,
    });

    if (res.ok) {
        return {
            whiteboardId,
            room: mapLessonRoom(room.id, res.data.room),
            warning: created.warning,
        };
    }

    return {
        whiteboardId,
        room: next,
        warning: created.warning || res.error || 'Tábla csatolás helyi módban.',
    };
}

function localMsgKey(roomId: string) {
    return `mm_lesson_msgs_${roomId}`;
}

function readLocalMsgs(roomId: string): LessonMessage[] {
    if (typeof localStorage === 'undefined') return [];
    try {
        const raw = localStorage.getItem(localMsgKey(roomId));
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeLocalMsgs(roomId: string, msgs: LessonMessage[]) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(localMsgKey(roomId), JSON.stringify(msgs.slice(-200)));
}

export function subscribeLessonMessages(
    roomId: string,
    onMessages: (msgs: LessonMessage[]) => void,
    onError?: (err: string) => void
): () => void {
    let stopped = false;
    let sinceMs = 0;
    const byId = new Map<string, LessonMessage>();

    const seed = readLocalMsgs(roomId);
    seed.forEach((m) => byId.set(m.id, m));
    if (seed.length) {
        sinceMs = Math.max(...seed.map((m) => m.createdAtMs));
        onMessages([...byId.values()].sort((a, b) => a.createdAtMs - b.createdAtMs));
    } else {
        onMessages([]);
    }

    const emit = () => {
        const list = [...byId.values()].sort((a, b) => a.createdAtMs - b.createdAtMs);
        writeLocalMsgs(roomId, list);
        onMessages(list);
    };

    const poll = async () => {
        if (stopped) return;
        try {
            const res = await apiGetAuth<{ messages: LessonMessage[] }>(
                `/api/lesson/${encodeURIComponent(roomId)}/messages?since=${sinceMs}`
            );
            if (!res.ok) {
                onError?.(res.error);
                return;
            }
            let changed = false;
            for (const m of res.messages) {
                if (!byId.has(m.id)) {
                    byId.set(m.id, m);
                    changed = true;
                }
                sinceMs = Math.max(sinceMs, m.createdAtMs);
            }
            if (changed) emit();
        } catch (err: any) {
            onError?.(String(err?.message || err).slice(0, 160));
        }
    };

    void poll();
    const timer = setInterval(() => void poll(), POLL_MS);

    return () => {
        stopped = true;
        clearInterval(timer);
    };
}

export async function sendLessonMessage(params: {
    roomId: string;
    senderId: string;
    senderName: string;
    senderPhoto?: string;
    text: string;
}): Promise<LessonMessage> {
    const cleaned = params.text.trim().slice(0, 1000);
    if (!cleaned) throw new Error('Üres üzenet');
    if (!params.senderId) throw new Error('Nincs felhasználó');

    const res = await apiPostAuth<{ message: LessonMessage }>(
        `/api/lesson/${encodeURIComponent(params.roomId)}/messages`,
        {
            text: cleaned,
            senderName: params.senderName || 'Vendég',
            senderPhoto: params.senderPhoto || '',
        }
    );

    if (res.ok) return res.data.message;

    const msg: LessonMessage = {
        id: `lm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        senderId: params.senderId,
        senderName: params.senderName || 'Vendég',
        senderPhoto: params.senderPhoto || '',
        text: cleaned,
        createdAtMs: Date.now(),
    };
    const next = [...readLocalMsgs(params.roomId), msg];
    writeLocalMsgs(params.roomId, next);
    return msg;
}
