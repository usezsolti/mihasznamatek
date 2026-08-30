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

    normalizeCommentText,

    normalizeGroupInput,

    normalizeMessageText,

    normalizePostText,

    normalizeUsernameOrThrow,

    participantMetaFromProfile,

    publicSocialProfiles,

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

            updatedAtMs: number;

            messages: DirectMessage[];

        }

    >;

};



const DB_PATH = path.join(process.cwd(), 'data', 'social-local.json');



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

        if (!fs.existsSync(DB_PATH)) return emptyDb();

        return { ...emptyDb(), ...JSON.parse(fs.readFileSync(DB_PATH, 'utf8')) };

    } catch {

        return emptyDb();

    }

}



function writeDb(db: DbShape) {

    const dir = path.dirname(DB_PATH);

    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

    fs.writeFileSync(DB_PATH, JSON.stringify(db, null, 2), 'utf8');

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

        return [...readDb().posts].sort((a, b) => b.createdAtMs - a.createdAtMs).slice(0, limit);

    },



    createPost(
        author: SocialProfile,
        text: string,
        media?: { imageUrl?: string | null; videoUrl?: string | null }
    ): SocialPost {
        const hasMedia = !!(media?.imageUrl || media?.videoUrl);
        const cleaned = normalizePostText(text, { allowEmpty: hasMedia });
        const db = readDb();
        const post: SocialPost = {
            id: `p_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`,
            ...buildPostFields(
                author,
                cleaned,
                Date.now(),
                media?.imageUrl || null,
                media?.videoUrl || null
            ),
        };
        db.posts.unshift(post);
        if (db.profiles[author.uid]) db.profiles[author.uid].postCount += 1;
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



    createGroup(owner: SocialProfile, name: string, description: string, topic: string): StudyGroup {

        const input = normalizeGroupInput(name, description, topic);

        const db = readDb();

        const g: StudyGroup = {

            id: `g_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,

            ...input,

            ownerId: owner.uid,

            ownerName: owner.displayName,

            memberIds: [owner.uid],

            memberCount: 1,

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



    sendMessage(from: SocialProfile, to: SocialProfile, text: string): void {

        const cleaned = normalizeMessageText(text);

        const db = readDb();

        const cid = conversationIdFor(from.uid, to.uid);

        if (!db.conversations[cid]) {

            db.conversations[cid] = {

                participants: [from.uid, to.uid].sort(),

                meta: {},

                lastMessage: '',

                updatedAtMs: Date.now(),

                messages: [],

            };

        }

        const conv = db.conversations[cid];

        conv.meta[from.uid] = participantMetaFromProfile(from);

        conv.meta[to.uid] = participantMetaFromProfile(to);

        conv.messages.push({

            id: `m_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,

            senderId: from.uid,

            text: cleaned,

            createdAtMs: Date.now(),

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

        return c ? [...c.messages].sort((a, b) => a.createdAtMs - b.createdAtMs) : [];

    },

};


