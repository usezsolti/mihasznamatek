/** Study group chat — Postgres API + local fallback. */
import type { GroupMessage, SocialProfile, StudyGroup } from './socialTypes';
import { createWhiteboard } from './whiteboardSync';

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

async function fetchGroupMessagesApi(groupId: string): Promise<GroupMessage[] | null> {
    try {
        const { apiGetAuth } = await import('./apiClient');
        const res = await apiGetAuth<{ messages: GroupMessage[] }>(
            `/api/groups/${encodeURIComponent(groupId)}/messages`
        );
        if (!res.ok) return null;
        return res.data.messages || [];
    } catch {
        return null;
    }
}

export function subscribeGroupMessages(
    groupId: string,
    onMessages: (msgs: GroupMessage[]) => void,
    onError?: (err: string) => void
): () => void {
    let stopped = false;

    const poll = async () => {
        if (stopped) return;
        const remote = await fetchGroupMessagesApi(groupId);
        if (remote) {
            writeLocal(groupId, remote);
            onMessages(remote);
        } else {
            onMessages(readLocal(groupId));
        }
    };

    void poll();
    const intervalId = window.setInterval(() => void poll(), 4000);

    return () => {
        stopped = true;
        window.clearInterval(intervalId);
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

    try {
        const { apiPostAuth } = await import('./apiClient');
        const res = await apiPostAuth<{ message: GroupMessage }>(
            `/api/groups/${encodeURIComponent(group.id)}/messages`,
            { text: cleaned }
        );
        if (res.ok && res.data.message) {
            const next = [...readLocal(group.id), res.data.message];
            writeLocal(group.id, next);
            return res.data.message;
        }
    } catch {
        /* fall through to local */
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
