/**
 * Social adattár Prisma / PostgreSQL backend — ugyanaz az API mint localSocialDb.
 */
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
    buildPostFields,
    createBlankSocialProfile,
    mapConversationPreview,
    normalizeCommentText,
    normalizeGroupInput,
    normalizeMessageText,
    normalizePostText,
    normalizeUsernameOrThrow,
    participantMetaFromProfile,
} from '../utils/socialDomain';
import { prisma } from './prisma';
import { parseJsonField } from './jsonField';

type DbProfile = Awaited<ReturnType<typeof fetchProfileRow>>;

async function readProgressXp(uid: string): Promise<{ xp: number; rank: string }> {
    const prog = await prisma.practiceProgress.findUnique({ where: { userId: uid } });
    if (!prog?.data) return { xp: 0, rank: 'BEGINNER' };
    const d = parseJsonField<Record<string, unknown>>(prog.data, {});
    return { xp: Number(d.xp || 0), rank: String(d.rank || 'BEGINNER') };
}

async function fetchProfileRow(uid: string) {
    return prisma.socialProfile.findUnique({
        where: { uid },
        include: {
            _count: { select: { followers: true, following: true, posts: true } },
        },
    });
}

function mapDbProfile(row: NonNullable<DbProfile>, xp: number, rank: string): SocialProfile {
    return {
        uid: row.uid,
        username: row.username,
        displayName: row.displayName,
        photoURL: row.photoURL || '',
        bio: row.bio,
        xp,
        rank,
        followerCount: row._count.followers,
        followingCount: row._count.following,
        postCount: row._count.posts,
        showXp: row.showXp,
        updatedAt: row.updatedAt,
    };
}

async function profileToSocial(row: NonNullable<DbProfile>): Promise<SocialProfile> {
    const progress = await readProgressXp(row.uid);
    return mapDbProfile(row, progress.xp, progress.rank);
}

function mapDbPost(
    post: {
        id: string;
        authorId: string;
        text: string;
        imageUrl: string | null;
        videoUrl: string | null;
        createdAt: Date;
        author: { displayName: string; username: string; photoURL: string | null };
        _count: { likes: number; comments: number };
    }
): SocialPost {
    return {
        id: post.id,
        authorId: post.authorId,
        authorName: post.author.displayName,
        authorUsername: post.author.username,
        authorPhoto: post.author.photoURL || '',
        text: post.text,
        imageUrl: post.imageUrl,
        videoUrl: post.videoUrl,
        likeCount: post._count.likes,
        commentCount: post._count.comments,
        createdAt: post.createdAt,
        createdAtMs: post.createdAt.getTime(),
    };
}

function mapDbComment(
    c: {
        id: string;
        authorId: string;
        text: string;
        createdAt: Date;
        author: { displayName: string; photoURL: string | null };
    }
): SocialComment {
    return {
        id: c.id,
        authorId: c.authorId,
        authorName: c.author.displayName,
        authorPhoto: c.author.photoURL || '',
        text: c.text,
        createdAtMs: c.createdAt.getTime(),
    };
}

async function maybeSeedWelcomePost(profile: SocialProfile): Promise<void> {
    const total = await prisma.socialPost.count();
    if (total > 0) return;
    const fields = buildPostFields(
        profile,
        'Üdv a MihaSocialban! Írj egy tippet, kérdést vagy sikert — ez a te első feeded.',
        Date.now()
    );
    await prisma.socialPost.create({
        data: {
            authorId: profile.uid,
            text: fields.text,
            imageUrl: fields.imageUrl,
            videoUrl: fields.videoUrl,
        },
    });
}

export const prismaSocial = {
    async ensureProfile(uid: string, hints?: { name?: string; photoURL?: string }): Promise<SocialProfile> {
        const progress = await readProgressXp(uid);
        let row = await fetchProfileRow(uid);

        if (row) {
            const updates: { displayName?: string; photoURL?: string } = {};
            if (hints?.name) updates.displayName = hints.name;
            if (hints?.photoURL) updates.photoURL = hints.photoURL;
            if (Object.keys(updates).length) {
                row = await prisma.socialProfile.update({
                    where: { uid },
                    data: updates,
                    include: { _count: { select: { followers: true, following: true, posts: true } } },
                });
            }
            const profile = mapDbProfile(row, progress.xp, progress.rank);
            await maybeSeedWelcomePost(profile);
            return profile;
        }

        const blank = createBlankSocialProfile(uid, {
            displayName: hints?.name || 'Diák',
            photoURL: hints?.photoURL || '',
            xp: progress.xp,
            rank: progress.rank,
        });

        await prisma.user.upsert({
            where: { id: uid },
            create: { id: uid, name: blank.displayName, image: blank.photoURL || null },
            update: {},
        });

        row = await prisma.socialProfile.create({
            data: {
                uid,
                username: blank.username,
                displayName: blank.displayName,
                photoURL: blank.photoURL || null,
                bio: blank.bio,
                showXp: blank.showXp,
            },
            include: { _count: { select: { followers: true, following: true, posts: true } } },
        });

        const profile = mapDbProfile(row, progress.xp, progress.rank);
        await maybeSeedWelcomePost(profile);
        return profile;
    },

    async getProfile(uid: string): Promise<SocialProfile | null> {
        const row = await fetchProfileRow(uid);
        if (!row) return null;
        return profileToSocial(row);
    },

    async updateProfile(
        uid: string,
        patch: { username?: string; bio?: string; displayName?: string; showXp?: boolean }
    ): Promise<SocialProfile> {
        const row = await fetchProfileRow(uid);
        if (!row) throw new Error('Profil nem található.');

        const data: {
            bio?: string;
            displayName?: string;
            showXp?: boolean;
            username?: string;
        } = {};
        applyProfilePatchFields(data, patch);

        if (patch.username !== undefined) {
            const u = normalizeUsernameOrThrow(patch.username);
            const clash = await prisma.socialProfile.findFirst({
                where: { username: u, NOT: { uid } },
            });
            if (clash) throw new Error('Ez a felhasználónév már foglalt.');
            data.username = u;
        }

        const updated = await prisma.socialProfile.update({
            where: { uid },
            data,
            include: { _count: { select: { followers: true, following: true, posts: true } } },
        });
        return profileToSocial(updated);
    },

    async listProfiles(limit = 30): Promise<SocialProfile[]> {
        const rows = await prisma.socialProfile.findMany({
            take: limit * 3,
            include: { _count: { select: { followers: true, following: true, posts: true } } },
        });
        const withXp = await Promise.all(
            rows.map(async (row) => {
                const progress = await readProgressXp(row.uid);
                return mapDbProfile(row, progress.xp, progress.rank);
            })
        );
        return withXp.sort((a, b) => b.xp - a.xp).slice(0, limit);
    },

    async listFeed(limit = 40): Promise<SocialPost[]> {
        const posts = await prisma.socialPost.findMany({
            take: limit,
            orderBy: { createdAt: 'desc' },
            include: {
                author: { select: { displayName: true, username: true, photoURL: true } },
                _count: { select: { likes: true, comments: true } },
            },
        });
        return posts.map(mapDbPost);
    },

    async createPost(
        author: SocialProfile,
        text: string,
        media?: { imageUrl?: string | null; videoUrl?: string | null }
    ): Promise<SocialPost> {
        const hasMedia = !!(media?.imageUrl || media?.videoUrl);
        const cleaned = normalizePostText(text, { allowEmpty: hasMedia });
        const createdAtMs = Date.now();
        const fields = buildPostFields(
            author,
            cleaned,
            createdAtMs,
            media?.imageUrl || null,
            media?.videoUrl || null
        );
        const post = await prisma.socialPost.create({
            data: {
                authorId: author.uid,
                text: fields.text,
                imageUrl: fields.imageUrl,
                videoUrl: fields.videoUrl,
            },
            include: {
                author: { select: { displayName: true, username: true, photoURL: true } },
                _count: { select: { likes: true, comments: true } },
            },
        });
        return mapDbPost(post);
    },

    async hasLiked(postId: string, uid: string): Promise<boolean> {
        const like = await prisma.socialLike.findUnique({
            where: { postId_uid: { postId, uid } },
        });
        return !!like;
    },

    async toggleLike(postId: string, uid: string): Promise<{ liked: boolean; likeCount: number }> {
        const post = await prisma.socialPost.findUnique({ where: { id: postId } });
        if (!post) throw new Error('Poszt nem található.');

        const existing = await prisma.socialLike.findUnique({
            where: { postId_uid: { postId, uid } },
        });

        if (existing) {
            await prisma.socialLike.delete({ where: { postId_uid: { postId, uid } } });
        } else {
            await prisma.socialLike.create({ data: { postId, uid } });
        }

        const likeCount = await prisma.socialLike.count({ where: { postId } });
        return { liked: !existing, likeCount };
    },

    async addComment(postId: string, author: SocialProfile, text: string): Promise<SocialComment> {
        const cleaned = normalizeCommentText(text);
        const post = await prisma.socialPost.findUnique({ where: { id: postId } });
        if (!post) throw new Error('Poszt nem található.');

        const comment = await prisma.socialComment.create({
            data: {
                postId,
                authorId: author.uid,
                text: cleaned,
            },
            include: {
                author: { select: { displayName: true, photoURL: true } },
            },
        });
        return mapDbComment(comment);
    },

    async listComments(postId: string): Promise<SocialComment[]> {
        const comments = await prisma.socialComment.findMany({
            where: { postId },
            orderBy: { createdAt: 'asc' },
            include: {
                author: { select: { displayName: true, photoURL: true } },
            },
        });
        return comments.map(mapDbComment);
    },

    async follow(followerId: string, followingId: string): Promise<void> {
        if (followerId === followingId) return;
        try {
            await prisma.follow.create({ data: { followerId, followingId } });
        } catch {
            return;
        }
    },

    async unfollow(followerId: string, followingId: string): Promise<void> {
        await prisma.follow.deleteMany({ where: { followerId, followingId } });
    },

    async isFollowing(followerId: string, followingId: string): Promise<boolean> {
        const row = await prisma.follow.findUnique({
            where: { followerId_followingId: { followerId, followingId } },
        });
        return !!row;
    },

    async listFollowingIds(uid: string): Promise<string[]> {
        const rows = await prisma.follow.findMany({
            where: { followerId: uid },
            select: { followingId: true },
            take: 200,
        });
        return rows.map((r) => r.followingId);
    },

    async createGroup(
        owner: SocialProfile,
        name: string,
        description: string,
        topic: string
    ): Promise<StudyGroup> {
        const input = normalizeGroupInput(name, description, topic);
        const group = await prisma.studyGroup.create({
            data: {
                name: input.name,
                description: input.description,
                topic: input.topic,
                ownerId: owner.uid,
                members: { create: { uid: owner.uid } },
            },
            include: {
                members: { select: { uid: true } },
                owner: { select: { displayName: true } },
            },
        });
        return {
            id: group.id,
            name: group.name,
            description: group.description,
            topic: group.topic,
            ownerId: group.ownerId,
            ownerName: group.owner.displayName,
            memberIds: group.members.map((m) => m.uid),
            memberCount: group.members.length,
            createdAtMs: group.createdAt.getTime(),
        };
    },

    async listGroups(): Promise<StudyGroup[]> {
        const groups = await prisma.studyGroup.findMany({
            orderBy: { createdAt: 'desc' },
            include: {
                members: { select: { uid: true } },
                owner: { select: { displayName: true } },
            },
        });
        return groups.map((g) => ({
            id: g.id,
            name: g.name,
            description: g.description,
            topic: g.topic,
            ownerId: g.ownerId,
            ownerName: g.owner.displayName,
            memberIds: g.members.map((m) => m.uid),
            memberCount: g.members.length,
            createdAtMs: g.createdAt.getTime(),
        }));
    },

    async joinGroup(groupId: string, uid: string): Promise<void> {
        const group = await prisma.studyGroup.findUnique({
            where: { id: groupId },
            include: { members: { select: { uid: true } } },
        });
        if (!group) throw new Error('A csoport nem található.');
        const memberIds = group.members.map((m) => m.uid);
        assertCanJoinGroup(memberIds, uid);
        if (memberIds.includes(uid)) return;
        await prisma.studyGroupMember.create({ data: { groupId, uid } });
    },

    async leaveGroup(groupId: string, uid: string): Promise<void> {
        const group = await prisma.studyGroup.findUnique({ where: { id: groupId } });
        if (!group) return;
        assertCanLeaveGroup(group.ownerId, uid);
        await prisma.studyGroupMember.deleteMany({ where: { groupId, uid } });
    },

    async sendMessage(from: SocialProfile, to: SocialProfile, text: string): Promise<void> {
        const cleaned = normalizeMessageText(text);
        const [userAId, userBId] = [from.uid, to.uid].sort();
        const id = conversationIdFor(from.uid, to.uid);

        await prisma.conversation.upsert({
            where: { id },
            create: { id, userAId, userBId },
            update: { updatedAt: new Date() },
        });

        await prisma.directMessage.create({
            data: {
                conversationId: id,
                fromUid: from.uid,
                toUid: to.uid,
                text: cleaned,
            },
        });
    },

    async listConversations(uid: string): Promise<ConversationPreview[]> {
        const convs = await prisma.conversation.findMany({
            where: { OR: [{ userAId: uid }, { userBId: uid }] },
            orderBy: { updatedAt: 'desc' },
            include: {
                messages: { orderBy: { createdAt: 'desc' }, take: 1 },
            },
            take: 40,
        });

        const previews: ConversationPreview[] = [];
        for (const c of convs) {
            const otherUid = c.userAId === uid ? c.userBId : c.userAId;
            const otherProfile = await fetchProfileRow(otherUid);
            const otherSocial = otherProfile
                ? await profileToSocial(otherProfile)
                : createBlankSocialProfile(otherUid);
            const lastMsg = c.messages[0];
            previews.push(
                mapConversationPreview(c.id, uid, {
                    participants: [c.userAId, c.userBId],
                    meta: {
                        [otherUid]: participantMetaFromProfile(otherSocial),
                    },
                    lastMessage: lastMsg?.text || '',
                    updatedAtMs: lastMsg?.createdAt.getTime() || c.updatedAt.getTime(),
                })
            );
        }
        return previews.sort((a, b) => b.updatedAtMs - a.updatedAtMs);
    },

    async listMessages(conversationId: string): Promise<DirectMessage[]> {
        const messages = await prisma.directMessage.findMany({
            where: { conversationId },
            orderBy: { createdAt: 'asc' },
            take: 80,
        });
        return messages.map((m) => ({
            id: m.id,
            senderId: m.fromUid,
            text: m.text,
            createdAtMs: m.createdAt.getTime(),
        }));
    },
};
