/**

 * Lokális social adattár (JSON fájl) — Firestore rules Publish nélkül is működik dev-ben.

 * Engedélyezés: SOCIAL_DATA_STORE=local az .env.local-ban.

 */

import fs from 'fs';

import path from 'path';

import type {

    ConversationPreview,

    DirectMessage,

    SocialComment,

    SocialPost,

    SocialProfile,

    StudyGroup,

} from '../utils/socialTypes';

import { conversationIdFor } from '../utils/socialTypes';

import {

    applyProfilePatchFields,

    assertCanJoinGroup,

    assertCanLeaveGroup,

    buildCommentFields,

    buildPostFields,

    createBlankSocialProfile,

    mapConversationPreview,
    mapDirectMessage,
    toggleMessageReaction,
    assertConversationParticipant,

    normalizeCommentText,

    normalizeGroupInput,
    resolveGroupMemberIds,

    normalizeMessageText,
    buildMessageReply,

    assertMathOnlyPost,
    assertNoVideoPost,
    assertPublicSocialPost,
    canViewSocialPost,
    isPublicSocialPost,
    socialTodayKey,
    sortSocialFeed,

    normalizeUsernameOrThrow,

    participantMetaFromProfile,

    publicSocialProfiles,
    isPlaceholderSocialProfile,
    isInvalidSocialAuthor,

} from '../utils/socialDomain';



type DbShape = {

    profiles: Record<string, SocialProfile>;

    posts: SocialPost[];

    likes: Record<string, string[]>; // postId -> uids

    comments: Record<string, SocialComment[]>;

    follows: Array<{ followerId: string; followingId: string }>;

    groups: StudyGroup[];

    conversations: Record<

        string,

        {

            participants: string[];

            meta: Record<string, { name: string; photo: string; username: string }>;

            lastMessage: string;

            lastSenderId?: string;

            initiatorId?: string;

            updatedAtMs: number;

            messages: DirectMessage[];

        }

    >;

};



function dbPath(): string {
    const override = String(process.env.SOCIAL_LOCAL_DB_PATH || '').trim();
    if (override) {
        return path.isAbsolute(override) ? override : path.join(process.cwd(), override);
    }
    return path.join(process.cwd(), 'data', 'social-local.json');
}



function emptyDb(): DbShape {

    return {

        profiles: {},

        posts: [],

        likes: {},

        comments: {},

        follows: [],

        groups: [],

        conversations: {},

    };

}



function readDb(): DbShape {

    try {

        const file = dbPath();

        if (!fs.existsSync(file)) return emptyDb();

        return { ...emptyDb(), ...JSON.parse(fs.readFileSync(file, 'utf8')) };

    } catch {

        return emptyDb();

    }

}



function writeDb(db: DbShape) {

    const file = dbPath();

    const dir = path.dirname(file);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(file, JSON.stringify(db, null, 2), 'utf8');

}



export function isLocalSocialStore(): boolean {

    return String(process.env.SOCIAL_DATA_STORE || '').toLowerCase() === 'local';

}



export const localSocial = {

    ensureProfile(uid: string, hints?: { name?: string; photoURL?: string }): SocialProfile {

        const db = readDb();

        let profile = db.profiles[uid];

        if (profile) {

            if (hints?.name) profile.displayName = hints.name;

            if (hints?.photoURL) profile.photoURL = hints.photoURL;

        } else {

            profile = createBlankSocialProfile(uid, {

                displayName: hints?.name || 'Diák',

                photoURL: hints?.photoURL || '',

            });

            db.profiles[uid] = profile;

        }

        writeDb(db);

        return profile;

    },



    getProfile(uid: string): SocialProfile | null {

        return readDb().profiles[uid] || null;

    },



    updateProfile(

        uid: string,

        patch: { username?: string; bio?: string; displayName?: string; showXp?: boolean }

    ): SocialProfile {

        const db = readDb();

        const p = db.profiles[uid];

        if (!p) throw new Error('Profil nem található.');

        applyProfilePatchFields(p, patch);

        if (patch.username !== undefined) {

            const u = normalizeUsernameOrThrow(patch.username);

            const clash = Object.values(db.profiles).some((x) => x.uid !== uid && x.username === u);

            if (clash) throw new Error('Ez a felhasználónév már foglalt.');

            p.username = u;

        }

        writeDb(db);

        return p;

    },



    listProfiles(limit = 30): SocialProfile[] {

        return publicSocialProfiles(
            Object.values(readDb().profiles).sort((a, b) => b.xp - a.xp),
            limit
        );

    },



    listFeed(limit = 40): SocialPost[] {

        return sortSocialFeed(
            [...readDb().posts].filter((p) => isPublicSocialPost(p) && !isInvalidSocialAuthor(p))
        ).slice(0, limit);

    },

    listUserPosts(
        uid: string,
        limit = 40,
        viewer?: { uid?: string; isAdmin?: boolean }
    ): SocialPost[] {
        return [...readDb().posts]
            .filter((p) => p.authorId === uid && canViewSocialPost(p, viewer))
            .sort((a, b) => b.createdAtMs - a.createdAtMs)
            .slice(0, limit);
    },

    listPendingPosts(limit = 80): SocialPost[] {
        return [...readDb().posts]
            .filter(
                (p) =>
                    String(p.moderationStatus || '') === 'pending' && !isInvalidSocialAuthor(p)
            )
            .sort((a, b) => b.createdAtMs - a.createdAtMs)
            .slice(0, limit);
    },

    purgeSocialJunk(keepUid?: string): { deletedPosts: number; deletedProfiles: number } {
        const db = readDb();
        const deletedPosts = db.posts.length;
        const keep = String(keepUid || '');
        const removedUids = Object.values(db.profiles)
            .filter((p) => p.uid !== keep && isPlaceholderSocialProfile(p))
            .map((p) => p.uid);
        db.posts = [];
        db.likes = {};
        db.comments = {};
        for (const uid of removedUids) delete db.profiles[uid];
        db.follows = db.follows.filter(
            (f) => !removedUids.includes(f.followerId) && !removedUids.includes(f.followingId)
        );
        writeDb(db);
        return { deletedPosts, deletedProfiles: removedUids.length };
    },



    createPost(
        author: SocialProfile,
        text: string,
        media?: { imageUrl?: string | null; videoUrl?: string | null; topic?: string | null; daily?: boolean },
        opts?: { autoApprove?: boolean; daily?: boolean }
    ): SocialPost {
        assertNoVideoPost(media?.videoUrl);
        const hasMedia = !!media?.imageUrl;
        const cleaned = assertMathOnlyPost(text, media?.topic, hasMedia);
        const db = readDb();
        const approved = !!opts?.autoApprove;
        const daily = !!(opts?.daily || media?.daily);
        if (daily && !approved) {
            throw new Error('Napi posztot csak a tanár tehet ki.');
        }
        const dailyKey = daily ? socialTodayKey() : null;
        const post: SocialPost = {
            id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            ...buildPostFields(
                author,
                cleaned,
                Date.now(),
                media?.imageUrl || null,
                null,
                media?.topic || null,
                approved ? 'approved' : 'pending',
                dailyKey
            ),
        };
        if (dailyKey) {
            for (const p of db.posts) {
                if (p.dailyKey === dailyKey) p.dailyKey = null;
            }
        }
        db.posts.unshift(post);
        if (approved && db.profiles[author.uid]) db.profiles[author.uid].postCount += 1;
        writeDb(db);
        return post;
    },

    reviewPost(postId: string, decision: 'approved' | 'rejected'): SocialPost {
        const db = readDb();
        const post = db.posts.find((p) => p.id === postId);
        if (!post) throw new Error('Poszt nem található.');
        if (String(post.moderationStatus || '') !== 'pending') {
            throw new Error('Ez a poszt már el lett bírálva.');
        }
        post.moderationStatus = decision;
        if (decision === 'approved' && db.profiles[post.authorId]) {
            db.profiles[post.authorId].postCount += 1;
        }
        writeDb(db);
        return post;
    },



    hasLiked(postId: string, uid: string): boolean {

        return (readDb().likes[postId] || []).includes(uid);

    },



    toggleLike(postId: string, uid: string): { liked: boolean; likeCount: number } {

        const db = readDb();

        const post = db.posts.find((p) => p.id === postId);

        if (!post) throw new Error('Poszt nem található.');
        assertPublicSocialPost(post);

        const set = new Set(db.likes[postId] || []);

        let liked: boolean;

        if (set.has(uid)) {

            set.delete(uid);

            liked = false;

        } else {

            set.add(uid);

            liked = true;

        }

        db.likes[postId] = Array.from(set);

        post.likeCount = set.size;

        writeDb(db);

        return { liked, likeCount: post.likeCount };

    },



    addComment(postId: string, author: SocialProfile, text: string): SocialComment {

        const cleaned = normalizeCommentText(text);

        const db = readDb();

        const post = db.posts.find((p) => p.id === postId);

        if (!post) throw new Error('Poszt nem található.');
        assertPublicSocialPost(post);

        const c: SocialComment = {

            id: `c_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,

            ...buildCommentFields(author, cleaned, Date.now()),

        };

        db.comments[postId] = [...(db.comments[postId] || []), c];

        post.commentCount += 1;

        writeDb(db);

        return c;

    },



    listComments(postId: string): SocialComment[] {

        return [...(readDb().comments[postId] || [])].sort((a, b) => a.createdAtMs - b.createdAtMs);

    },



    follow(followerId: string, followingId: string): void {

        if (followerId === followingId) return;

        const db = readDb();

        if (db.follows.some((f) => f.followerId === followerId && f.followingId === followingId)) return;

        db.follows.push({ followerId, followingId });

        if (db.profiles[followingId]) db.profiles[followingId].followerCount += 1;

        if (db.profiles[followerId]) db.profiles[followerId].followingCount += 1;

        writeDb(db);

    },



    unfollow(followerId: string, followingId: string): void {

        const db = readDb();

        const before = db.follows.length;

        db.follows = db.follows.filter((f) => !(f.followerId === followerId && f.followingId === followingId));

        if (db.follows.length === before) return;

        if (db.profiles[followingId]) db.profiles[followingId].followerCount = Math.max(0, db.profiles[followingId].followerCount - 1);

        if (db.profiles[followerId]) db.profiles[followerId].followingCount = Math.max(0, db.profiles[followerId].followingCount - 1);

        writeDb(db);

    },



    isFollowing(followerId: string, followingId: string): boolean {

        return readDb().follows.some((f) => f.followerId === followerId && f.followingId === followingId);

    },



    listFollowingIds(uid: string): string[] {

        return readDb()

            .follows.filter((f) => f.followerId === uid)

            .map((f) => f.followingId);

    },



    createGroup(
        owner: SocialProfile,
        name: string,
        description: string,
        topic: string,
        invitedIds?: string[]
    ): StudyGroup {
        const input = normalizeGroupInput(name, description, topic);
        const db = readDb();
        const existing = new Set(Object.keys(db.profiles));
        const memberIds = resolveGroupMemberIds(owner.uid, invitedIds).filter(
            (id, i) => i === 0 || existing.has(id)
        );
        const g: StudyGroup = {
            id: `g_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            ...input,
            ownerId: owner.uid,
            ownerName: owner.displayName,
            memberIds,
            memberCount: memberIds.length,
            createdAtMs: Date.now(),
        };
        db.groups.unshift(g);
        writeDb(db);
        return g;
    },



    listGroups(): StudyGroup[] {

        return [...readDb().groups].sort((a, b) => b.createdAtMs - a.createdAtMs);

    },



    joinGroup(groupId: string, uid: string): void {

        const db = readDb();

        const g = db.groups.find((x) => x.id === groupId);

        if (!g) throw new Error('A csoport nem található.');

        assertCanJoinGroup(g.memberIds, uid);

        if (g.memberIds.includes(uid)) return;

        g.memberIds.push(uid);

        g.memberCount = g.memberIds.length;

        writeDb(db);

    },



    leaveGroup(groupId: string, uid: string): void {

        const db = readDb();

        const g = db.groups.find((x) => x.id === groupId);

        if (!g) return;

        assertCanLeaveGroup(g.ownerId, uid);

        g.memberIds = g.memberIds.filter((m) => m !== uid);

        g.memberCount = g.memberIds.length;

        writeDb(db);

    },



    sendMessage(
        from: SocialProfile,
        to: SocialProfile,
        text: string,
        reply?: { id?: string | null; text?: string | null; senderId?: string | null } | null
    ): void {
        const cleaned = normalizeMessageText(text);
        const quoted = buildMessageReply(reply);
        const db = readDb();
        const cid = conversationIdFor(from.uid, to.uid);
        if (!db.conversations[cid]) {
            db.conversations[cid] = {
                participants: [from.uid, to.uid].sort(),
                meta: {},
                lastMessage: '',
                lastSenderId: from.uid,
                initiatorId: from.uid,
                updatedAtMs: Date.now(),
                messages: [],
            };
        }
        const conv = db.conversations[cid];
        if (!conv.initiatorId) conv.initiatorId = from.uid;
        conv.lastSenderId = from.uid;
        conv.meta[from.uid] = participantMetaFromProfile(from);
        conv.meta[to.uid] = participantMetaFromProfile(to);
        conv.messages.push({
            id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
            senderId: from.uid,
            text: cleaned,
            createdAtMs: Date.now(),
            replyToId: quoted?.replyToId || null,
            replyToText: quoted?.replyToText || null,
            replyToSenderId: quoted?.replyToSenderId || null,
            reactions: [],
        });
        conv.lastMessage = cleaned;
        conv.updatedAtMs = Date.now();
        writeDb(db);
    },



    listConversations(uid: string): ConversationPreview[] {

        const db = readDb();

        return Object.entries(db.conversations)

            .filter(([, c]) => c.participants.includes(uid))

            .map(([id, c]) => mapConversationPreview(id, uid, c))

            .sort((a, b) => b.updatedAtMs - a.updatedAtMs);

    },



    listMessages(conversationId: string): DirectMessage[] {
        const c = readDb().conversations[conversationId];
        return c
            ? [...c.messages]
                  .map((m) => mapDirectMessage(m as unknown as Record<string, unknown>))
                  .sort((a, b) => a.createdAtMs - b.createdAtMs)
            : [];
    },

    reactToMessage(conversationId: string, messageId: string, uid: string, emoji: string): DirectMessage {
        const db = readDb();
        const conv = db.conversations[conversationId];
        if (!conv) throw new Error('Beszélgetés nem található.');
        assertConversationParticipant(conv.participants, uid);
        const msg = conv.messages.find((m) => m.id === messageId);
        if (!msg) throw new Error('Üzenet nem található.');
        msg.reactions = toggleMessageReaction(msg.reactions, uid, emoji);
        writeDb(db);
        return mapDirectMessage(msg as unknown as Record<string, unknown>);
    },

};


