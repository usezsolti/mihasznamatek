/** Community adatréteg: Next.js backend only (no client Firestore). */

import { backendSocial } from './backendClient';
import type {
    ConversationPreview,
    DirectMessage,
    SocialComment,
    SocialPost,
    SocialProfile,
    StudyGroup,
} from './socialTypes';

async function viaBackend<T>(action: string, body: Record<string, unknown> = {}): Promise<T> {
    return backendSocial<T>(action, body);
}

export async function apiEnsureProfile(
    uid: string,
    hints?: { name?: string; photoURL?: string }
): Promise<SocialProfile> {
    return viaBackend('ensureProfile', { ...hints });
}

export async function apiGetProfile(uid: string): Promise<SocialProfile | null> {
    return viaBackend('getProfile', { uid });
}

export async function apiUpdateProfile(
    uid: string,
    patch: Partial<Pick<SocialProfile, 'username' | 'bio' | 'displayName' | 'showXp'>>
): Promise<void> {
    await viaBackend('updateProfile', { ...patch });
}

export async function apiSyncSocialIdentity(
    uid: string,
    patch: { photoURL?: string; displayName?: string }
): Promise<void> {
    await viaBackend('ensureProfile', {
        name: patch.displayName,
        photoURL: patch.photoURL,
    });
    if (patch.displayName) {
        await viaBackend('updateProfile', { displayName: patch.displayName });
    }
}

export async function apiListProfiles(limit = 30): Promise<SocialProfile[]> {
    return viaBackend('listProfiles', { limit });
}

export async function apiListFeed(limit = 40): Promise<SocialPost[]> {
    return viaBackend('listFeed', { limit });
}

export async function apiCreatePost(
    author: SocialProfile,
    text: string,
    media?: { imageUrl?: string | null; videoUrl?: string | null }
): Promise<SocialPost> {
    return viaBackend('createPost', {
        text,
        imageUrl: media?.imageUrl || null,
        videoUrl: media?.videoUrl || null,
    });
}

export async function apiToggleLike(postId: string, uid: string) {
    return viaBackend('toggleLike', { postId });
}

export async function apiHasLiked(postId: string, uid: string): Promise<boolean> {
    const r: any = await viaBackend('hasLiked', { postId });
    return typeof r === 'boolean' ? r : !!r?.liked;
}

export async function apiAddComment(
    postId: string,
    author: SocialProfile,
    text: string
): Promise<SocialComment> {
    return viaBackend('addComment', { postId, text });
}

export async function apiListComments(postId: string): Promise<SocialComment[]> {
    return viaBackend('listComments', { postId });
}

export async function apiFollow(followerId: string, followingId: string): Promise<void> {
    await viaBackend('follow', { uid: followingId });
}

export async function apiUnfollow(followerId: string, followingId: string): Promise<void> {
    await viaBackend('unfollow', { uid: followingId });
}

export async function apiIsFollowing(followerId: string, followingId: string): Promise<boolean> {
    const r: any = await viaBackend('isFollowing', { uid: followingId });
    return typeof r === 'boolean' ? r : !!r?.following;
}

export async function apiListFollowingIds(uid: string): Promise<string[]> {
    return viaBackend('listFollowingIds', {});
}

export async function apiCreateGroup(
    owner: SocialProfile,
    name: string,
    description: string,
    topic: string
): Promise<StudyGroup> {
    return viaBackend('createGroup', { name, description, topic });
}

export async function apiListGroups(): Promise<StudyGroup[]> {
    return viaBackend('listGroups', {});
}

export async function apiJoinGroup(groupId: string, uid: string): Promise<void> {
    await viaBackend('joinGroup', { groupId });
}

export async function apiLeaveGroup(groupId: string, uid: string): Promise<void> {
    await viaBackend('leaveGroup', { groupId });
}

export async function apiSendMessage(
    fromUid: string,
    toUid: string,
    text: string,
    _from: SocialProfile,
    _to: SocialProfile
): Promise<void> {
    await viaBackend('sendMessage', { toUid, text });
}

export async function apiListConversations(uid: string): Promise<ConversationPreview[]> {
    return viaBackend('listConversations', {});
}

export async function apiListMessages(conversationId: string): Promise<DirectMessage[]> {
    return viaBackend('listMessages', { conversationId });
}
