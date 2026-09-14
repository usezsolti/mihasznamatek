/**
 * Egységes social store — local JSON és Firestore ugyanazzal az API-val.
 * A route csak action-öket dispatch-el; nincs dupla switch.
 */
import type {
    ConversationPreview,
    DirectMessage,
    SocialComment,
    SocialPost,
    SocialProfile,
    StudyGroup,
} from '../utils/socialTypes';
import { isAdminEmail } from '../utils/admin';
import { isLocalSocialStore, localSocial } from './localSocialDb';
import * as firestoreSocial from './services/socialService';
import { assertSocialContentAllowed } from './socialAiFilter';
import { notifyAdminPendingPost } from './socialModerationMail';

export type ProfileHints = { name?: string; photoURL?: string };
export type ProfilePatch = {
    username?: string;
    bio?: string;
    displayName?: string;
    showXp?: boolean;
};

/** Közös szerződés a két adattár között (async, hogy a Firestore is illeszkedjen). */
export type SocialStore = {
    ensureProfile(uid: string, hints?: ProfileHints): Promise<SocialProfile>;
    getProfile(uid: string): Promise<SocialProfile | null>;
    updateProfile(uid: string, patch: ProfilePatch): Promise<SocialProfile>;
    listProfiles(limit?: number): Promise<SocialProfile[]>;
    listFeed(limit?: number): Promise<SocialPost[]>;
    listUserPosts(
        uid: string,
        limit?: number,
        viewer?: { uid?: string; isAdmin?: boolean }
    ): Promise<SocialPost[]>;
    listPendingPosts(limit?: number): Promise<SocialPost[]>;
    createPost(
        author: SocialProfile,
        text: string,
        media?: { imageUrl?: string | null; videoUrl?: string | null; topic?: string | null },
        opts?: { autoApprove?: boolean; daily?: boolean }
    ): Promise<SocialPost>;
    reviewPost(postId: string, decision: 'approved' | 'rejected'): Promise<SocialPost>;
    purgeSocialJunk(keepUid?: string): Promise<{ deletedPosts: number; deletedProfiles: number }>;
    toggleLike(postId: string, uid: string): Promise<{ liked: boolean; likeCount: number }>;
    hasLiked(postId: string, uid: string): Promise<boolean>;
    addComment(postId: string, author: SocialProfile, text: string): Promise<SocialComment>;
    listComments(postId: string): Promise<SocialComment[]>;
    follow(followerId: string, followingId: string): Promise<void>;
    unfollow(followerId: string, followingId: string): Promise<void>;
    isFollowing(followerId: string, followingId: string): Promise<boolean>;
    listFollowingIds(uid: string): Promise<string[]>;
    createGroup(
        owner: SocialProfile,
        name: string,
        description: string,
        topic: string,
        memberIds?: string[]
    ): Promise<StudyGroup>;
    listGroups(): Promise<StudyGroup[]>;
    joinGroup(groupId: string, uid: string): Promise<void>;
    leaveGroup(groupId: string, uid: string): Promise<void>;
    sendMessage(
        from: SocialProfile,
        to: SocialProfile,
        text: string,
        reply?: { id?: string | null; text?: string | null; senderId?: string | null } | null
    ): Promise<void>;
    listConversations(uid: string): Promise<ConversationPreview[]>;
    listMessages(conversationId: string): Promise<DirectMessage[]>;
    reactToMessage(
        conversationId: string,
        messageId: string,
        uid: string,
        emoji: string
    ): Promise<DirectMessage>;
};

const localStore: SocialStore = {
    ensureProfile: async (uid, hints) => localSocial.ensureProfile(uid, hints),
    getProfile: async (uid) => localSocial.getProfile(uid),
    updateProfile: async (uid, patch) => localSocial.updateProfile(uid, patch),
    listProfiles: async (limit) => localSocial.listProfiles(limit),
    listFeed: async (limit) => localSocial.listFeed(limit),
    listUserPosts: async (uid, limit, viewer) => localSocial.listUserPosts(uid, limit, viewer),
    listPendingPosts: async (limit) => localSocial.listPendingPosts(limit),
    createPost: async (author, text, media, opts) => localSocial.createPost(author, text, media, opts),
    reviewPost: async (postId, decision) => localSocial.reviewPost(postId, decision),
    purgeSocialJunk: async (keepUid) => localSocial.purgeSocialJunk(keepUid),
    toggleLike: async (postId, uid) => localSocial.toggleLike(postId, uid),
    hasLiked: async (postId, uid) => localSocial.hasLiked(postId, uid),
    addComment: async (postId, author, text) => localSocial.addComment(postId, author, text),
    listComments: async (postId) => localSocial.listComments(postId),
    follow: async (a, b) => {
        localSocial.follow(a, b);
    },
    unfollow: async (a, b) => {
        localSocial.unfollow(a, b);
    },
    isFollowing: async (a, b) => localSocial.isFollowing(a, b),
    listFollowingIds: async (uid) => localSocial.listFollowingIds(uid),
    createGroup: async (owner, name, description, topic, memberIds) =>
        localSocial.createGroup(owner, name, description, topic, memberIds),
    listGroups: async () => localSocial.listGroups(),
    joinGroup: async (groupId, uid) => {
        localSocial.joinGroup(groupId, uid);
    },
    leaveGroup: async (groupId, uid) => {
        localSocial.leaveGroup(groupId, uid);
    },
    sendMessage: async (from, to, text, reply) => {
        localSocial.sendMessage(from, to, text, reply);
    },
    listConversations: async (uid) => localSocial.listConversations(uid),
    listMessages: async (conversationId) => localSocial.listMessages(conversationId),
    reactToMessage: async (conversationId, messageId, uid, emoji) =>
        localSocial.reactToMessage(conversationId, messageId, uid, emoji),
};

function firestoreStore(token: string): SocialStore {
    return {
        ensureProfile: (uid, hints) => firestoreSocial.ensureProfile(token, uid, hints),
        getProfile: (uid) => firestoreSocial.getProfile(token, uid),
        updateProfile: (uid, patch) => firestoreSocial.updateProfile(token, uid, patch),
        listProfiles: (limit) => firestoreSocial.listProfiles(token, limit),
        listFeed: (limit) => firestoreSocial.listFeed(token, limit),
        listUserPosts: (uid, limit, viewer) => firestoreSocial.listUserPosts(token, uid, limit, viewer),
        listPendingPosts: (limit) => firestoreSocial.listPendingPosts(token, limit),
        createPost: (author, text, media, opts) =>
            firestoreSocial.createPost(token, author, text, media, opts),
        reviewPost: (postId, decision) => firestoreSocial.reviewPost(token, postId, decision),
        purgeSocialJunk: (keepUid) => firestoreSocial.purgeSocialJunk(token, keepUid),
        toggleLike: (postId, uid) => firestoreSocial.toggleLike(token, postId, uid),
        hasLiked: (postId, uid) => firestoreSocial.hasLiked(token, postId, uid),
        addComment: (postId, author, text) => firestoreSocial.addComment(token, postId, author, text),
        listComments: (postId) => firestoreSocial.listComments(token, postId),
        follow: (a, b) => firestoreSocial.follow(token, a, b),
        unfollow: (a, b) => firestoreSocial.unfollow(token, a, b),
        isFollowing: (a, b) => firestoreSocial.isFollowing(token, a, b),
        listFollowingIds: (uid) => firestoreSocial.listFollowingIds(token, uid),
        createGroup: (owner, name, description, topic, memberIds) =>
            firestoreSocial.createGroup(token, owner, name, description, topic, memberIds),
        listGroups: () => firestoreSocial.listGroups(token),
        joinGroup: (groupId, uid) => firestoreSocial.joinGroup(token, groupId, uid),
        leaveGroup: (groupId, uid) => firestoreSocial.leaveGroup(token, groupId, uid),
        sendMessage: (from, to, text, reply) => firestoreSocial.sendMessage(token, from, to, text, reply),
        listConversations: (uid) => firestoreSocial.listConversations(token, uid),
        listMessages: (conversationId) => firestoreSocial.listMessages(token, conversationId),
        reactToMessage: (conversationId, messageId, uid, emoji) =>
            firestoreSocial.reactToMessage(token, conversationId, messageId, uid, emoji),
    };
}

export function createSocialStore(token: string): SocialStore {
    return isLocalSocialStore() ? localStore : firestoreStore(token);
}

export type SocialActionResult = { data: unknown; status?: number };
export type SocialActionCtx = { email?: string };

/** Egy helyen az összes social action — a HTTP route csak ezt hívja. */
export async function runSocialAction(
    store: SocialStore,
    action: string,
    uid: string,
    body: Record<string, unknown>,
    ctx: SocialActionCtx = {}
): Promise<SocialActionResult> {
    const isReviewer = isAdminEmail(ctx.email);
    switch (action) {
        case 'ensureProfile':
            return {
                data: await store.ensureProfile(uid, {
                    name: body.name as string | undefined,
                    photoURL: body.photoURL as string | undefined,
                }),
            };
        case 'getProfile':
            return { data: await store.getProfile(String(body.uid || uid)) };
        case 'updateProfile':
            return {
                data: await store.updateProfile(uid, {
                    username: body.username as string | undefined,
                    bio: body.bio as string | undefined,
                    displayName: body.displayName as string | undefined,
                    showXp: body.showXp as boolean | undefined,
                }),
            };
        case 'listProfiles':
            return { data: await store.listProfiles(Number(body.limit) || 30) };
        case 'listFeed':
            return { data: await store.listFeed(Number(body.limit) || 40) };
        case 'listUserPosts':
            return {
                data: await store.listUserPosts(String(body.uid || uid), Number(body.limit) || 40, {
                    uid,
                    isAdmin: isReviewer,
                }),
            };
        case 'listPendingPosts':
            if (!isReviewer) {
                throw Object.assign(new Error('Csak a tanár bírálhatja a posztokat.'), { status: 403 });
            }
            return { data: await store.listPendingPosts(Number(body.limit) || 80) };
        case 'createPost': {
            const me = await store.ensureProfile(uid);
            const imageUrl = (body.imageUrl as string) || null;
            await assertSocialContentAllowed({
                kind: 'post',
                text: String(body.text || ''),
                imageUrl,
            });
            const daily = body.daily === true;
            if (daily && !isReviewer) {
                throw Object.assign(new Error('Napi posztot csak a tanár tehet ki.'), { status: 403 });
            }
            const post = await store.createPost(
                me,
                String(body.text || ''),
                {
                    imageUrl,
                    videoUrl: (body.videoUrl as string) || null,
                    topic: (body.topic as string) || null,
                    daily,
                },
                { autoApprove: isReviewer, daily }
            );
            if (post.moderationStatus === 'pending') {
                void notifyAdminPendingPost(post).catch((err) =>
                    console.warn('pending-post mail', err?.message || err)
                );
            }
            return { data: post, status: 201 };
        }
        case 'reviewPost': {
            if (!isReviewer) {
                throw Object.assign(new Error('Csak a tanár bírálhatja a posztokat.'), { status: 403 });
            }
            const decision = String(body.decision || '');
            if (decision !== 'approved' && decision !== 'rejected') {
                throw Object.assign(new Error('Érvénytelen döntés.'), { status: 400 });
            }
            return { data: await store.reviewPost(String(body.postId || ''), decision) };
        }
        case 'purgeSocialJunk':
            if (!isReviewer) {
                throw Object.assign(new Error('Csak a tanár törölheti a szemetet.'), { status: 403 });
            }
            return { data: await store.purgeSocialJunk(uid) };
        case 'toggleLike':
            return { data: await store.toggleLike(String(body.postId || ''), uid) };
        case 'hasLiked':
            return { data: { liked: await store.hasLiked(String(body.postId || ''), uid) } };
        case 'addComment': {
            const me = await store.ensureProfile(uid);
            await assertSocialContentAllowed({
                kind: 'comment',
                text: String(body.text || ''),
            });
            return {
                data: await store.addComment(String(body.postId || ''), me, String(body.text || '')),
                status: 201,
            };
        }
        case 'listComments':
            return { data: await store.listComments(String(body.postId || '')) };
        case 'follow':
            await store.follow(uid, String(body.uid || ''));
            return { data: { following: true } };
        case 'unfollow':
            await store.unfollow(uid, String(body.uid || ''));
            return { data: { following: false } };
        case 'isFollowing':
            return {
                data: { following: await store.isFollowing(uid, String(body.uid || '')) },
            };
        case 'listFollowingIds':
            return { data: await store.listFollowingIds(uid) };
        case 'createGroup': {
            const me = await store.ensureProfile(uid);
            return {
                data: await store.createGroup(
                    me,
                    String(body.name || ''),
                    String(body.description || ''),
                    String(body.topic || ''),
                    Array.isArray(body.memberIds) ? body.memberIds.map(String) : []
                ),
                status: 201,
            };
        }
        case 'listGroups':
            return { data: await store.listGroups() };
        case 'joinGroup':
            await store.joinGroup(String(body.groupId || ''), uid);
            return { data: { joined: true } };
        case 'leaveGroup':
            await store.leaveGroup(String(body.groupId || ''), uid);
            return { data: { left: true } };
        case 'sendMessage': {
            const me = await store.ensureProfile(uid);
            const to = await store.getProfile(String(body.toUid || ''));
            if (!to) throw new Error('Címzett nem található.');
            await store.sendMessage(me, to, String(body.text || ''), {
                id: String(body.replyToId || ''),
                text: String(body.replyToText || ''),
                senderId: String(body.replyToSenderId || ''),
            });
            return { data: { sent: true } };
        }
        case 'listConversations':
            return { data: await store.listConversations(uid) };
        case 'listMessages':
            return { data: await store.listMessages(String(body.conversationId || '')) };
        case 'reactToMessage':
            return {
                data: await store.reactToMessage(
                    String(body.conversationId || ''),
                    String(body.messageId || ''),
                    uid,
                    String(body.emoji || '')
                ),
            };
        default:
            throw Object.assign(new Error(`Ismeretlen action: ${action}`), { status: 400 });
    }
}
