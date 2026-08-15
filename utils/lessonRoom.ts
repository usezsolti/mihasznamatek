/** Élő óra szoba — nyílt link, Jitsi + whiteboard + chat. */

import { createWhiteboard } from './whiteboardSync';

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

function getFirebase(): any {
    if (typeof window === 'undefined') return null;
    return (window as any).firebase || null;
}

function db() {
    const firebase = getFirebase();
    if (!firebase?.firestore) return null;
    return firebase.firestore();
}

function newRoomId(): string {
    return `ora_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

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

    const id = newRoomId();
    const title = (params.title || 'Matek óra').trim().slice(0, 120) || 'Matek óra';
    const board = await createWhiteboard(uid, `${title} tábla`);
    const jitsiRoom = lessonCallRoomName(id);
    const room: LessonRoom = {
        id,
        title,
        createdBy: uid,
        whiteboardId: board.meta.id,
        jitsiRoom,
        createdAtMs: Date.now(),
        bookingId: params.bookingId,
        studentName: params.studentName,
    };

    const firestore = db();
    if (firestore) {
        try {
            await firestore.collection('lessonRooms').doc(id).set({
                title: room.title,
                createdBy: room.createdBy,
                whiteboardId: room.whiteboardId,
                jitsiRoom: room.jitsiRoom,
                createdAtMs: room.createdAtMs,
                bookingId: room.bookingId || '',
                studentName: room.studentName || '',
            });
            return { room, warning: board.warning };
        } catch (err: any) {
            return {
                room,
                warning:
                    board.warning ||
                    String(err?.message || 'Óra létrehozás részben helyi.').slice(0, 160),
            };
        }
    }

    return { room, warning: board.warning || 'Nincs Firestore — helyi óra azonosító.' };
}

export async function loadLessonRoom(roomId: string): Promise<LessonRoom | null> {
    const id = String(roomId || '').trim();
    if (!id) return null;
    const firestore = db();
    if (!firestore) return null;
    try {
        const snap = await firestore.collection('lessonRooms').doc(id).get();
        if (!snap.exists) return null;
        return mapLessonRoom(snap.id, snap.data() || {});
    } catch {
        return null;
    }
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
    const firestore = db();
    if (firestore) {
        try {
            await firestore.collection('lessonRooms').doc(room.id).update({ whiteboardId });
        } catch (err: any) {
            return {
                whiteboardId,
                room: next,
                warning:
                    created.warning ||
                    String(err?.message || 'Tábla csatolás részben helyi.').slice(0, 160),
            };
        }
    }
    return { whiteboardId, room: next, warning: created.warning };
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
    const firestore = db();
    if (!firestore) {
        onMessages(readLocalMsgs(roomId));
        return () => undefined;
    }

    const unsub = firestore
        .collection('lessonRooms')
        .doc(roomId)
        .collection('messages')
        .orderBy('createdAtMs', 'asc')
        .limit(120)
        .onSnapshot(
            (snap: any) => {
                const msgs = snap.docs.map((doc: any) =>
                    mapLessonMessage(doc.id, doc.data() || {})
                );
                writeLocalMsgs(roomId, msgs);
                onMessages(msgs);
            },
            (err: any) => {
                onMessages(readLocalMsgs(roomId));
                onError?.(String(err?.message || err).slice(0, 160));
            }
        );

    return () => {
        try {
            unsub();
        } catch {
            /* ignore */
        }
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

    const msg: LessonMessage = {
        id: `lm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        senderId: params.senderId,
        senderName: params.senderName || 'Vendég',
        senderPhoto: params.senderPhoto || '',
        text: cleaned,
        createdAtMs: Date.now(),
    };

    const firestore = db();
    if (firestore) {
        try {
            const ref = firestore
                .collection('lessonRooms')
                .doc(params.roomId)
                .collection('messages')
                .doc();
            await ref.set({
                senderId: msg.senderId,
                senderName: msg.senderName,
                senderPhoto: msg.senderPhoto,
                text: msg.text,
                createdAtMs: msg.createdAtMs,
            });
            return { ...msg, id: ref.id };
        } catch {
            const next = [...readLocalMsgs(params.roomId), msg];
            writeLocalMsgs(params.roomId, next);
            return msg;
        }
    }

    const next = [...readLocalMsgs(params.roomId), msg];
    writeLocalMsgs(params.roomId, next);
    return msg;
}
