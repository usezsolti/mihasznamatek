/**
 * Közös social domain — mappers + validátorok.
 * IO (Firestore / local JSON) a három adapterben marad; a szabályok itt.
 */
import {
    defaultUsernameFrom,
    slugifyUsername,
    type ConversationPreview,
    type SocialComment,
    type SocialPost,
    type SocialProfile,
    type StudyGroup,
} from './socialTypes';

export function mapSocialProfile(uid: string, d: Record<string, unknown>): SocialProfile {
    return {
        uid,
        username: String(d.username || ''),
        displayName: String(d.displayName || 'Diák'),
        photoURL: String(d.photoURL || ''),
        bio: String(d.bio || ''),
        xp: Number(d.xp || 0),
        rank: String(d.rank || 'BEGINNER'),
        followerCount: Number(d.followerCount || 0),
        followingCount: Number(d.followingCount || 0),
        postCount: Number(d.postCount || 0),
        showXp: d.showXp !== false,
    };
}

export function createBlankSocialProfile(
    uid: string,
    hints?: { displayName?: string; photoURL?: string; xp?: number; rank?: string }
): SocialProfile {
    const displayName = hints?.displayName || 'Diák';
    return {
        uid,
        username: defaultUsernameFrom(displayName, uid),
        displayName,
        photoURL: hints?.photoURL || '',
        bio: '',
        xp: hints?.xp ?? 0,
        rank: hints?.rank || 'BEGINNER',
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        showXp: true,
    };
}

export type ProfilePatch = {
    username?: string;
    bio?: string;
    displayName?: string;
    showXp?: boolean;
};

/** Alkalmazza a patch mezőket (username uniqueness külön IO). */
export function applyProfilePatchFields(
    target: { bio?: string; displayName?: string; showXp?: boolean; username?: string },
    patch: ProfilePatch
): void {
    if (patch.bio !== undefined) target.bio = String(patch.bio).slice(0, 160);
    if (patch.displayName !== undefined) target.displayName = String(patch.displayName).slice(0, 40);
    if (patch.showXp !== undefined) target.showXp = !!patch.showXp;
}

export function normalizeUsernameOrThrow(raw: string): string {
    const u = slugifyUsername(raw);
    if (u.length < 3) throw new Error('A felhasználónév legalább 3 karakter legyen.');
    return u;
}

export function normalizePostText(text: string, opts?: { allowEmpty?: boolean }): string {
    const cleaned = text.trim().slice(0, 500);
    if (!cleaned && !opts?.allowEmpty) throw new Error('Írj valamit a posztba!');
    return cleaned;
}

export function buildPostFields(
    author: SocialProfile,
    cleaned: string,
    createdAtMs: number,
    imageUrl: string | null = null,
    videoUrl: string | null = null
): Omit<SocialPost, 'id'> {
    return {
        authorId: author.uid,
        authorName: author.displayName,
        authorUsername: author.username,
        authorPhoto: author.photoURL,
        text: cleaned,
        imageUrl,
        videoUrl,
        likeCount: 0,
        commentCount: 0,
        createdAtMs,
    };
}

export function mapSocialPost(d: Record<string, unknown>): SocialPost {
    return {
        id: String(d.__id || d.id || ''),
        authorId: String(d.authorId || ''),
        authorName: String(d.authorName || 'Diák'),
        authorUsername: String(d.authorUsername || ''),
        authorPhoto: String(d.authorPhoto || ''),
        text: String(d.text || ''),
        imageUrl: (d.imageUrl as string) || null,
        videoUrl: (d.videoUrl as string) || null,
        likeCount: Number(d.likeCount || 0),
        commentCount: Number(d.commentCount || 0),
        createdAtMs: Number(d.createdAtMs || Date.now()),
    };
}

export function normalizeCommentText(text: string): string {
    const cleaned = text.trim().slice(0, 300);
    if (!cleaned) throw new Error('Üres komment.');
    return cleaned;
}

export function buildCommentFields(
    author: SocialProfile,
    cleaned: string,
    createdAtMs: number
): Omit<SocialComment, 'id'> {
    return {
        authorId: author.uid,
        authorName: author.displayName,
        authorPhoto: author.photoURL,
        text: cleaned,
        createdAtMs,
    };
}

export function mapSocialComment(d: Record<string, unknown>): SocialComment {
    return {
        id: String(d.__id || d.id || ''),
        authorId: String(d.authorId || ''),
        authorName: String(d.authorName || 'Diák'),
        authorPhoto: String(d.authorPhoto || ''),
        text: String(d.text || ''),
        createdAtMs: Number(d.createdAtMs || Date.now()),
    };
}

export function normalizeMessageText(text: string): string {
    const cleaned = text.trim().slice(0, 500);
    if (!cleaned) throw new Error('Üres üzenet.');
    return cleaned;
}

export function normalizeGroupInput(name: string, description: string, topic: string) {
    const cleaned = name.trim().slice(0, 60);
    if (cleaned.length < 3) throw new Error('Adj nevet a csoportnak (min. 3 karakter).');
    return {
        name: cleaned,
        description: description.trim().slice(0, 200),
        topic: topic.trim().slice(0, 60),
    };
}

export const GROUP_MAX_MEMBERS = 50;

export function assertCanJoinGroup(memberIds: string[], uid: string): void {
    if (memberIds.includes(uid)) return;
    if (memberIds.length >= GROUP_MAX_MEMBERS) {
        throw new Error('A csoport tele van (max 50 fő).');
    }
}

export function assertCanLeaveGroup(ownerId: string, uid: string): void {
    if (ownerId === uid) throw new Error('A tulajdonos nem léphet ki.');
}

export function mapStudyGroup(d: Record<string, unknown>): StudyGroup {
    const memberIds = Array.isArray(d.memberIds) ? (d.memberIds as string[]) : [];
    return {
        id: String(d.__id || d.id || ''),
        name: String(d.name || ''),
        description: String(d.description || ''),
        topic: String(d.topic || ''),
        ownerId: String(d.ownerId || ''),
        ownerName: String(d.ownerName || ''),
        memberIds,
        memberCount: Number(d.memberCount || memberIds.length || 0),
        createdAtMs: Number(d.createdAtMs || Date.now()),
        whiteboardId: d.whiteboardId ? String(d.whiteboardId) : null,
    };
}

export function followDocId(followerId: string, followingId: string): string {
    return `${followerId}_${followingId}`;
}

export function participantMetaFromProfile(p: SocialProfile) {
    return { name: p.displayName, photo: p.photoURL, username: p.username };
}

export function mapConversationPreview(
    id: string,
    viewerUid: string,
    d: {
        participants: string[];
        meta?: Record<string, { name?: string; photo?: string; username?: string }>;
        lastMessage?: string;
        updatedAtMs?: number;
    }
): ConversationPreview {
    const otherUid = d.participants.find((p) => p !== viewerUid) || '';
    const meta = d.meta?.[otherUid] || { name: 'Diák', photo: '', username: '' };
    return {
        id,
        otherUid,
        otherName: meta.name || 'Diák',
        otherPhoto: meta.photo || '',
        lastMessage: d.lastMessage || '',
        updatedAtMs: Number(d.updatedAtMs || 0),
    };
}
