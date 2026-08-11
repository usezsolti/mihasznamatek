/** Community adatréteg: Next.js Node backend, kliens Firestore fallbackkel. */

import { backendSocial } from './backendClient';
import * as clientSocial from './social';
import type {
    ConversationPreview,
    DirectMessage,
    SocialComment,
    SocialPost,
    SocialProfile,
    StudyGroup,
} from './socialTypes';

let preferBackend = true;

async function viaBackend<T>(action: string, body: Record<string, unknown>, fallback: () => Promise<T>): Promise<T> {
    if (!preferBackend) return fallback();
    try {
        return await backendSocial<T>(action, body);
    } catch (e) {
        console.warn(`backend ${action} failed, falling back to client:`, e);
        preferBackend = false;
        return fallback();
    }
}

export async function apiEnsureProfile(
    uid: string,
    hints?: { name?: string; photoURL?: string }
): Promise<SocialProfile> {
    return viaBackend('ensureProfile', { ...hints }, () => clientSocial.ensureSocialProfile(uid));
}

export async function apiGetProfile(uid: string): Promise<SocialProfile | null> {
    return viaBackend('getProfile', { uid }, () => clientSocial.getSocialProfile(uid));
}

export async function apiUpdateProfile(
    uid: string,
    patch: Partial<Pick<SocialProfile, 'username' | 'bio' | 'displayName' | 'showXp'>>
): Promise<void> {
    await viaBackend('updateProfile', { ...patch }, async () => {
        await clientSocial.updateSocialProfile(uid, patch);
    });
}

export async function apiListProfiles(limit = 30): Promise<SocialProfile[]> {
    return viaBackend('listProfiles', { limit }, () => clientSocial.listProfiles(limit));
}

export async function apiListFeed(limit = 40): Promise<SocialPost[]> {
    return viaBackend('listFeed', { limit }, () => clientSocial.listFeedPosts({ limit }));
}

export async function apiCreatePost(author: SocialProfile, text: string): Promise<SocialPost> {
    return viaBackend('createPost', { text }, () => clientSocial.createPost(author, text));
}

export async function apiToggleLike(postId: string, uid: string) {
    return viaBackend('toggleLike', { postId }, () => clientSocial.toggleLike(postId, uid));
}

export async function apiHasLiked(postId: string, uid: string): Promise<boolean> {
    return viaBackend(
        'hasLiked',
        { postId },
        async () => clientSocial.hasLiked(postId, uid)
    ).then((r: any) => (typeof r === 'boolean' ? r : !!r?.liked));
}

export async function apiAddComment(postId: string, author: SocialProfile, text: string): Promise<SocialComment> {
    return viaBackend('addComment', { postId, text }, () => clientSocial.addComment(postId, author, text));
}

export async function apiListComments(postId: string): Promise<SocialComment[]> {
    return viaBackend('listComments', { postId }, () => clientSocial.listComments(postId));
}

export async function apiFollow(followerId: string, followingId: string): Promise<void> {
    await viaBackend('follow', { uid: followingId }, () => clientSocial.followUser(followerId, followingId));
}

export async function apiUnfollow(followerId: string, followingId: string): Promise<void> {
    await viaBackend('unfollow', { uid: followingId }, () => clientSocial.unfollowUser(followerId, followingId));
}

export async function apiIsFollowing(followerId: string, followingId: string): Promise<boolean> {
    return viaBackend(
        'isFollowing',
        { uid: followingId },
        async () => clientSocial.isFollowing(followerId, followingId)
    ).then((r: any) => (typeof r === 'boolean' ? r : !!r?.following));
}

export async function apiListFollowingIds(uid: string): Promise<string[]> {
    return viaBackend('listFollowingIds', {}, () => clientSocial.listFollowingIds(uid));
}

export async function apiCreateGroup(
    owner: SocialProfile,
    name: string,
    description: string,
    topic: string
): Promise<StudyGroup> {
    return viaBackend('createGroup', { name, description, topic }, () =>
        clientSocial.createStudyGroup(owner, name, description, topic)
    );
}

export async function apiListGroups(): Promise<StudyGroup[]> {
    return viaBackend('listGroups', {}, () => clientSocial.listStudyGroups());
}

export async function apiJoinGroup(groupId: string, uid: string): Promise<void> {
    await viaBackend('joinGroup', { groupId }, () => clientSocial.joinStudyGroup(groupId, uid));
}

export async function apiLeaveGroup(groupId: string, uid: string): Promise<void> {
    await viaBackend('leaveGroup', { groupId }, () => clientSocial.leaveStudyGroup(groupId, uid));
}

export async function apiSendMessage(
    fromUid: string,
    toUid: string,
    text: string,
    from: SocialProfile,
    to: SocialProfile
): Promise<void> {
    await viaBackend('sendMessage', { toUid, text }, () =>
        clientSocial.sendDirectMessage(fromUid, toUid, text, from, to)
    );
}

export async function apiListConversations(uid: string): Promise<ConversationPreview[]> {
    return viaBackend('listConversations', {}, () => clientSocial.listConversations(uid));
}

export async function apiListMessages(conversationId: string): Promise<DirectMessage[]> {
    return viaBackend('listMessages', { conversationId }, () => clientSocial.listMessages(conversationId));
}

export { clientSocial };
