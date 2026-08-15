/** Közösségi (Instagram-szerű) típusok — Mihaszna Matek Social */

export type SocialProfile = {
    uid: string;
    username: string;
    displayName: string;
    photoURL: string;
    bio: string;
    xp: number;
    rank: string;
    followerCount: number;
    followingCount: number;
    postCount: number;
    showXp: boolean;
    updatedAt?: unknown;
};

export type SocialPost = {
    id: string;
    authorId: string;
    authorName: string;
    authorUsername: string;
    authorPhoto: string;
    text: string;
    imageUrl?: string | null;
    videoUrl?: string | null;
    likeCount: number;
    commentCount: number;
    createdAt?: unknown;
    createdAtMs: number;
};

export type PostMedia = {
    imageUrl?: string | null;
    videoUrl?: string | null;
};

export type SocialComment = {
    id: string;
    authorId: string;
    authorName: string;
    authorPhoto: string;
    text: string;
    createdAtMs: number;
};

export type StudyGroup = {
    id: string;
    name: string;
    description: string;
    topic: string;
    ownerId: string;
    ownerName: string;
    memberIds: string[];
    memberCount: number;
    createdAtMs: number;
    whiteboardId?: string | null;
};

export type GroupMessage = {
    id: string;
    senderId: string;
    senderName: string;
    senderPhoto: string;
    text: string;
    createdAtMs: number;
};

export type DirectMessage = {
    id: string;
    senderId: string;
    text: string;
    createdAtMs: number;
};

export type ConversationPreview = {
    id: string;
    otherUid: string;
    otherName: string;
    otherPhoto: string;
    lastMessage: string;
    updatedAtMs: number;
};

export type MathShort = {
    id: string;
    topic: string;
    title: string;
    hook: string;
    body: string;
    tip: string;
    difficulty: string;
    createdAtMs: number;
};

export function slugifyUsername(raw: string): string {
    return raw
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase()
        .replace(/[^a-z0-9_]/g, '')
        .slice(0, 20);
}

export function conversationIdFor(a: string, b: string): string {
    return [a, b].sort().join('_');
}

export function defaultUsernameFrom(name: string, uid: string): string {
    const base = slugifyUsername(name || 'matek') || 'matek';
    return `${base}${uid.slice(0, 4)}`;
}
