import type { GroupMessage, SocialProfile, StudyGroup } from './socialTypes';
import { createWhiteboard } from './whiteboardSync';

function getFirebase(): any {
    if (typeof window === 'undefined') return null;
    return (window as any).firebase || null;
}

function db() {
    const firebase = getFirebase();
    if (!firebase?.firestore) return null;
    return firebase.firestore();
}

function localKey(groupId: string) {
    return `mm_group_msgs_${groupId}`;
}

function readLocal(groupId: string): GroupMessage[] {
    if (typeof localStorage === 'undefined') return [];
    try {
        const raw = localStorage.getItem(localKey(groupId));
        if (!raw) return [];
        const parsed = JSON.parse(raw);
        return Array.isArray(parsed) ? parsed : [];
    } catch {
        return [];
    }
}

function writeLocal(groupId: string, msgs: GroupMessage[]) {
    if (typeof localStorage === 'undefined') return;
    localStorage.setItem(localKey(groupId), JSON.stringify(msgs.slice(-200)));
}

export function mapGroupMessage(id: string, d: Record<string, unknown>): GroupMessage {
    return {
        id,
        senderId: String(d.senderId || ''),
        senderName: String(d.senderName || 'Diák'),
        senderPhoto: String(d.senderPhoto || ''),
        text: String(d.text || ''),
        createdAtMs: Number(d.createdAtMs || Date.now()),
    };
}

export function subscribeGroupMessages(
    groupId: string,
    onMessages: (msgs: GroupMessage[]) => void,
    onError?: (err: string) => void
): () => void {
    const firestore = db();
    if (!firestore) {
        onMessages(readLocal(groupId));
        return () => undefined;
    }

    const unsub = firestore
        .collection('studyGroups')
        .doc(groupId)
        .collection('messages')
        .orderBy('createdAtMs', 'asc')
        .limit(120)
        .onSnapshot(
            (snap: any) => {
                const msgs = snap.docs.map((doc: any) => mapGroupMessage(doc.id, doc.data() || {}));
                writeLocal(groupId, msgs);
                onMessages(msgs);
            },
            (err: any) => {
                onMessages(readLocal(groupId));
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

export async function sendGroupMessage(
    group: StudyGroup,
    me: SocialProfile,
    text: string
): Promise<GroupMessage> {
    const cleaned = text.trim().slice(0, 1000);
    if (!cleaned) throw new Error('Üres üzenet');
    if (!group.memberIds.includes(me.uid)) throw new Error('Nem vagy tagja a csoportnak.');

    const msg: GroupMessage = {
        id: `gm_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
        senderId: me.uid,
        senderName: me.displayName || me.username || 'Diák',
        senderPhoto: me.photoURL || '',
        text: cleaned,
        createdAtMs: Date.now(),
    };

    const firestore = db();
    if (firestore) {
        try {
            const ref = firestore.collection('studyGroups').doc(group.id).collection('messages').doc();
            await ref.set({
                senderId: msg.senderId,
                senderName: msg.senderName,
                senderPhoto: msg.senderPhoto,
                text: msg.text,
                createdAtMs: msg.createdAtMs,
            });
            return { ...msg, id: ref.id };
        } catch {
            const next = [...readLocal(group.id), msg];
            writeLocal(group.id, next);
            return msg;
        }
    }

    const next = [...readLocal(group.id), msg];
    writeLocal(group.id, next);
    return msg;
}

export async function ensureGroupWhiteboard(
    group: StudyGroup,
    uid: string
): Promise<{ whiteboardId: string; group: StudyGroup; warning?: string }> {
    if (group.whiteboardId) {
        return { whiteboardId: group.whiteboardId, group };
    }

    const created = await createWhiteboard(uid, `${group.name} tábla`);
    const whiteboardId = created.meta.id;
    const firestore = db();

    if (firestore) {
        try {
            await firestore.collection('studyGroups').doc(group.id).update({ whiteboardId });
        } catch (err: any) {
            return {
                whiteboardId,
                group: { ...group, whiteboardId },
                warning:
                    created.warning ||
                    String(err?.message || 'Whiteboard csatolás részben helyi.').slice(0, 160),
            };
        }
    }

    return {
        whiteboardId,
        group: { ...group, whiteboardId },
        warning: created.warning,
    };
}

export function groupCallRoomName(groupId: string): string {
    const safe = groupId.replace(/[^a-zA-Z0-9-_]/g, '').slice(0, 48) || 'group';
    return `MihasznaMatek-${safe}`;
}

export function groupCallUrl(groupId: string): string {
    return `https://meet.jit.si/${groupCallRoomName(groupId)}`;
}
