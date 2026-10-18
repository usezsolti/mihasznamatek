import type { ConversationPreview, DirectMessage } from '../utils/socialTypes';

export type InboxSnapshot = {
    conversations: ConversationPreview[];
    conversationId: string;
    messages: DirectMessage[];
};

/** Messages leave the socket only when this user is already in that conversation. */
export function inboxSnapshot(
    conversations: ConversationPreview[],
    conversationId: string,
    messages: DirectMessage[]
): InboxSnapshot {
    const allowed = Boolean(conversationId) && conversations.some((c) => c.id === conversationId);
    return {
        conversations,
        conversationId: allowed ? conversationId : '',
        messages: allowed ? messages : [],
    };
}

export function snapshotKey(snapshot: InboxSnapshot): string {
    return JSON.stringify(snapshot);
}
