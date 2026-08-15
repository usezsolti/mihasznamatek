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
import { isLocalSocialStore, localSocial } from './localSocialDb';
import * as firestoreSocial from './services/socialService';

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
    createPost(
        author: SocialProfile,
        text: string,
        media?: { imageUrl?: string | null; videoUrl?: string | null }
    ): Promise<SocialPost>;
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
        topic: string
    ): Promise<StudyGroup>;
    listGroups(): Promise<StudyGroup[]>;
    joinGroup(groupId: string, uid: string): Promise<void>;
    leaveGroup(groupId: string, uid: string): Promise<void>;
    sendMessage(from: SocialProfile, to: SocialProfile, text: string): Promise<void>;
    listConversations(uid: string): Promise<ConversationPreview[]>;
    listMessages(conversationId: string): Promise<DirectMessage[]>;
};

const localStore: SocialStore = {
    ensureProfile: async (uid, hints) => localSocial.ensureProfile(uid, hints),
    getProfile: async (uid) => localSocial.getProfile(uid),
    updateProfile: async (uid, patch) => localSocial.updateProfile(uid, patch),
    listProfiles: async (limit) => localSocial.listProfiles(limit),
    listFeed: async (limit) => localSocial.listFeed(limit),
    createPost: async (author, text, media) => localSocial.createPost(author, text, media),
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
    createGroup: async (owner, name, description, topic) =>
        localSocial.createGroup(owner, name, description, topic),
    listGroups: async () => localSocial.listGroups(),
    joinGroup: async (groupId, uid) => {
        localSocial.joinGroup(groupId, uid);
    },
    leaveGroup: async (groupId, uid) => {
        localSocial.leaveGroup(groupId, uid);
    },
    sendMessage: async (from, to, text) => {
        localSocial.sendMessage(from, to, text);
    },
    listConversations: async (uid) => localSocial.listConversations(uid),
    listMessages: async (conversationId) => localSocial.listMessages(conversationId),
};

function firestoreStore(token: string): SocialStore {
    return {
        ensureProfile: (uid, hints) => firestoreSocial.ensureProfile(token, uid, hints),
        getProfile: (uid) => firestoreSocial.getProfile(token, uid),
        updateProfile: (uid, patch) => firestoreSocial.updateProfile(token, uid, patch),
        listProfiles: (limit) => firestoreSocial.listProfiles(token, limit),
        listFeed: (limit) => firestoreSocial.listFeed(token, limit),
        createPost: (author, text, media) => firestoreSocial.createPost(token, author, text, media),
        toggleLike: (postId, uid) => firestoreSocial.toggleLike(token, postId, uid),
        hasLiked: (postId, uid) => firestoreSocial.hasLiked(token, postId, uid),
        addComment: (postId, author, text) => firestoreSocial.addComment(token, postId, author, text),
        listComments: (postId) => firestoreSocial.listComments(token, postId),
        follow: (a, b) => firestoreSocial.follow(token, a, b),
        unfollow: (a, b) => firestoreSocial.unfollow(token, a, b),
        isFollowing: (a, b) => firestoreSocial.isFollowing(token, a, b),
        listFollowingIds: (uid) => firestoreSocial.listFollowingIds(token, uid),
        createGroup: (owner, name, description, topic) =>
            firestoreSocial.createGroup(token, owner, name, description, topic),
        listGroups: () => firestoreSocial.listGroups(token),
        joinGroup: (groupId, uid) => firestoreSocial.joinGroup(token, groupId, uid),
        leaveGroup: (groupId, uid) => firestoreSocial.leaveGroup(token, groupId, uid),
        sendMessage: (from, to, text) => firestoreSocial.sendMessage(token, from, to, text),
        listConversations: (uid) => firestoreSocial.listConversations(token, uid),
        listMessages: (conversationId) => firestoreSocial.listMessages(token, conversationId),
    };
}

export function createSocialStore(token: string): SocialStore {
    return isLocalSocialStore() ? localStore : firestoreStore(token);
}

export type SocialActionResult = { data: unknown; status?: number };

/** Egy helyen az összes social action — a HTTP route csak ezt hívja. */
export async function runSocialAction(
    store: SocialStore,
    action: string,
    uid: string,
    body: Record<string, unknown>
): Promise<SocialActionResult> {
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
        case 'createPost': {
            const me = await store.ensureProfile(uid);
            return {
                data: await store.createPost(me, String(body.text || ''), {
                    imageUrl: (body.imageUrl as string) || null,
                    videoUrl: (body.videoUrl as string) || null,
                }),
                status: 201,
            };
        }
        case 'toggleLike':
            return { data: await store.toggleLike(String(body.postId || ''), uid) };
        case 'hasLiked':
            return { data: { liked: await store.hasLiked(String(body.postId || ''), uid) } };
        case 'addComment': {
            const me = await store.ensureProfile(uid);
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
                    String(body.topic || '')
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
            await store.sendMessage(me, to, String(body.text || ''));
            return { data: { sent: true } };
        }
        case 'listConversations':
            return { data: await store.listConversations(uid) };
        case 'listMessages':
            return { data: await store.listMessages(String(body.conversationId || '')) };
        default:
            throw Object.assign(new Error(`Ismeretlen action: ${action}`), { status: 400 });
    }
}
