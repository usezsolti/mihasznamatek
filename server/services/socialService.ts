/** Közösség szolgáltatás — Node.js backend (Firestore REST + user token) */

import {
    conversationIdFor,
    defaultUsernameFrom,
    slugifyUsername,
    type ConversationPreview,
    type DirectMessage,
    type SocialComment,
    type SocialPost,
    type SocialProfile,
    type StudyGroup,
} from '../../utils/socialTypes';
import {
    commitIncrement,
    createDocument,
    deleteDocument,
    getDocument,
    listCollection,
    nowMs,
    runQuery,
    setDocument,
} from '../firestoreRest';

function asProfile(uid: string, d: Record<string, unknown>): SocialProfile {
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

async function readProgressXp(token: string, uid: string): Promise<{ xp: number; rank: string }> {
    const prog = await getDocument(`users/${uid}/progress/summary`, token);
    if (!prog) return { xp: 0, rank: 'BEGINNER' };
    return {
        xp: Number(prog.xp || 0),
        rank: String(prog.rank || 'BEGINNER'),
    };
}

export async function ensureProfile(
    token: string,
    uid: string,
    hints?: { name?: string; photoURL?: string }
): Promise<SocialProfile> {
    const existing = await getDocument(`socialProfiles/${uid}`, token);
    const progress = await readProgressXp(token, uid).catch(() => ({ xp: 0, rank: 'BEGINNER' }));

    if (existing) {
        const profile = asProfile(uid, existing);
        profile.xp = progress.xp || profile.xp;
        profile.rank = progress.rank || profile.rank;
        try {
            await setDocument(
                `socialProfiles/${uid}`,
                token,
                {
                    xp: profile.xp,
                    rank: profile.rank,
                    displayName: profile.displayName || hints?.name || 'Diák',
                    photoURL: profile.photoURL || hints?.photoURL || '',
                    updatedAtMs: nowMs(),
                },
                true
            );
        } catch {
            /* sync opcionális */
        }
        return profile;
    }

    const displayName = hints?.name || 'Diák';
    const profile: SocialProfile = {
        uid,
        username: defaultUsernameFrom(displayName, uid),
        displayName,
        photoURL: hints?.photoURL || '',
        bio: '',
        xp: progress.xp,
        rank: progress.rank,
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        showXp: true,
    };
    await setDocument(
        `socialProfiles/${uid}`,
        token,
        {
            ...profile,
            createdAtMs: nowMs(),
            updatedAtMs: nowMs(),
        },
        false
    );
    return profile;
}

export async function getProfile(token: string, uid: string): Promise<SocialProfile | null> {
    const d = await getDocument(`socialProfiles/${uid}`, token);
    return d ? asProfile(uid, d) : null;
}

export async function updateProfile(
    token: string,
    uid: string,
    patch: { username?: string; bio?: string; displayName?: string; showXp?: boolean }
): Promise<SocialProfile> {
    const data: Record<string, unknown> = { updatedAtMs: nowMs() };
    if (patch.bio !== undefined) data.bio = String(patch.bio).slice(0, 160);
    if (patch.displayName !== undefined) data.displayName = String(patch.displayName).slice(0, 40);
    if (patch.showXp !== undefined) data.showXp = !!patch.showXp;
    if (patch.username !== undefined) {
        const u = slugifyUsername(patch.username);
        if (u.length < 3) throw new Error('A felhasználónév legalább 3 karakter legyen.');
        const taken = await runQuery(token, {
            from: [{ collectionId: 'socialProfiles' }],
            where: {
                fieldFilter: {
                    field: { fieldPath: 'username' },
                    op: 'EQUAL',
                    value: { stringValue: u },
                },
            },
            limit: 5,
        });
        if (taken.some((doc) => String(doc.__id) !== uid)) {
            throw new Error('Ez a felhasználónév már foglalt.');
        }
        data.username = u;
    }
    await setDocument(`socialProfiles/${uid}`, token, data, true);
    const p = await getProfile(token, uid);
    if (!p) throw new Error('Profil nem található.');
    return p;
}

export async function listProfiles(token: string, limit = 30): Promise<SocialProfile[]> {
    try {
        const rows = await runQuery(token, {
            from: [{ collectionId: 'socialProfiles' }],
            orderBy: [{ field: { fieldPath: 'xp' }, direction: 'DESCENDING' }],
            limit,
        });
        return rows.map((d) => asProfile(String(d.__id), d));
    } catch {
        const rows = await listCollection('socialProfiles', token, { pageSize: limit });
        return rows
            .map((d) => asProfile(String(d.__id), d))
            .sort((a, b) => b.xp - a.xp);
    }
}

export async function listFeed(token: string, limit = 40): Promise<SocialPost[]> {
    try {
        const rows = await runQuery(token, {
            from: [{ collectionId: 'posts' }],
            orderBy: [{ field: { fieldPath: 'createdAtMs' }, direction: 'DESCENDING' }],
            limit,
        });
        return rows.map(mapPost);
    } catch {
        const rows = await listCollection('posts', token, { pageSize: limit });
        return rows.map(mapPost).sort((a, b) => b.createdAtMs - a.createdAtMs);
    }
}

function mapPost(d: Record<string, unknown>): SocialPost {
    return {
        id: String(d.__id || ''),
        authorId: String(d.authorId || ''),
        authorName: String(d.authorName || 'Diák'),
        authorUsername: String(d.authorUsername || ''),
        authorPhoto: String(d.authorPhoto || ''),
        text: String(d.text || ''),
        imageUrl: (d.imageUrl as string) || null,
        likeCount: Number(d.likeCount || 0),
        commentCount: Number(d.commentCount || 0),
        createdAtMs: Number(d.createdAtMs || Date.now()),
    };
}

export async function createPost(
    token: string,
    author: SocialProfile,
    text: string
): Promise<SocialPost> {
    const cleaned = text.trim().slice(0, 500);
    if (!cleaned) throw new Error('Írj valamit a posztba!');
    const createdAtMs = nowMs();
    const payload = {
        authorId: author.uid,
        authorName: author.displayName,
        authorUsername: author.username,
        authorPhoto: author.photoURL,
        text: cleaned,
        imageUrl: null,
        likeCount: 0,
        commentCount: 0,
        createdAtMs,
    };
    const id = await createDocument('posts', token, payload);
    try {
        await commitIncrement(token, `socialProfiles/${author.uid}`, 'postCount', 1);
    } catch {
        /* ignore counter fail */
    }
    return { id, ...payload };
}

export async function hasLiked(token: string, postId: string, uid: string): Promise<boolean> {
    const d = await getDocument(`posts/${postId}/likes/${uid}`, token);
    return !!d;
}

export async function toggleLike(
    token: string,
    postId: string,
    uid: string
): Promise<{ liked: boolean; likeCount: number }> {
    const liked = await hasLiked(token, postId, uid);
    if (liked) {
        await deleteDocument(`posts/${postId}/likes/${uid}`, token);
        await commitIncrement(token, `posts/${postId}`, 'likeCount', -1).catch(() => undefined);
    } else {
        await setDocument(`posts/${postId}/likes/${uid}`, token, { uid, createdAtMs: nowMs() }, false);
        await commitIncrement(token, `posts/${postId}`, 'likeCount', 1).catch(() => undefined);
    }
    const post = await getDocument(`posts/${postId}`, token);
    return { liked: !liked, likeCount: Number(post?.likeCount || 0) };
}

export async function addComment(
    token: string,
    postId: string,
    author: SocialProfile,
    text: string
): Promise<SocialComment> {
    const cleaned = text.trim().slice(0, 300);
    if (!cleaned) throw new Error('Üres komment.');
    const payload = {
        authorId: author.uid,
        authorName: author.displayName,
        authorPhoto: author.photoURL,
        text: cleaned,
        createdAtMs: nowMs(),
    };
    const id = await createDocument(`posts/${postId}/comments`, token, payload);
    await commitIncrement(token, `posts/${postId}`, 'commentCount', 1).catch(() => undefined);
    return { id, ...payload };
}

export async function listComments(token: string, postId: string, limit = 40): Promise<SocialComment[]> {
    try {
        const rows = await runQuery(token, {
            from: [{ collectionId: 'comments' }],
            orderBy: [{ field: { fieldPath: 'createdAtMs' }, direction: 'ASCENDING' }],
            limit,
        });
        // subcollection query needs different path - use list on parent
        void rows;
    } catch {
        /* fall through */
    }
    // List via documents path: firestore REST list on subcollection
    const urlRows = await listCollection(`posts/${postId}/comments`, token, { pageSize: limit });
    return urlRows
        .map((d) => ({
            id: String(d.__id || ''),
            authorId: String(d.authorId || ''),
            authorName: String(d.authorName || 'Diák'),
            authorPhoto: String(d.authorPhoto || ''),
            text: String(d.text || ''),
            createdAtMs: Number(d.createdAtMs || 0),
        }))
        .sort((a, b) => a.createdAtMs - b.createdAtMs);
}

export async function follow(token: string, followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) return;
    const id = `${followerId}_${followingId}`;
    const existing = await getDocument(`follows/${id}`, token);
    if (existing) return;
    await setDocument(
        `follows/${id}`,
        token,
        { followerId, followingId, createdAtMs: nowMs() },
        false
    );
    await commitIncrement(token, `socialProfiles/${followingId}`, 'followerCount', 1).catch(() => undefined);
    await commitIncrement(token, `socialProfiles/${followerId}`, 'followingCount', 1).catch(() => undefined);
}

export async function unfollow(token: string, followerId: string, followingId: string): Promise<void> {
    const id = `${followerId}_${followingId}`;
    const existing = await getDocument(`follows/${id}`, token);
    if (!existing) return;
    await deleteDocument(`follows/${id}`, token);
    await commitIncrement(token, `socialProfiles/${followingId}`, 'followerCount', -1).catch(() => undefined);
    await commitIncrement(token, `socialProfiles/${followerId}`, 'followingCount', -1).catch(() => undefined);
}

export async function isFollowing(token: string, followerId: string, followingId: string): Promise<boolean> {
    return !!(await getDocument(`follows/${followerId}_${followingId}`, token));
}

export async function listFollowingIds(token: string, uid: string): Promise<string[]> {
    const rows = await runQuery(token, {
        from: [{ collectionId: 'follows' }],
        where: {
            fieldFilter: {
                field: { fieldPath: 'followerId' },
                op: 'EQUAL',
                value: { stringValue: uid },
            },
        },
        limit: 200,
    }).catch(() => [] as Array<Record<string, unknown>>);
    return rows.map((r) => String(r.followingId || '')).filter(Boolean);
}

export async function createGroup(
    token: string,
    owner: SocialProfile,
    name: string,
    description: string,
    topic: string
): Promise<StudyGroup> {
    const cleaned = name.trim().slice(0, 60);
    if (cleaned.length < 3) throw new Error('Adj nevet a csoportnak (min. 3 karakter).');
    const payload = {
        name: cleaned,
        description: description.trim().slice(0, 200),
        topic: topic.trim().slice(0, 60),
        ownerId: owner.uid,
        ownerName: owner.displayName,
        memberIds: [owner.uid],
        memberCount: 1,
        createdAtMs: nowMs(),
    };
    const id = await createDocument('studyGroups', token, payload);
    return { id, ...payload };
}

export async function listGroups(token: string, limit = 40): Promise<StudyGroup[]> {
    try {
        const rows = await runQuery(token, {
            from: [{ collectionId: 'studyGroups' }],
            orderBy: [{ field: { fieldPath: 'createdAtMs' }, direction: 'DESCENDING' }],
            limit,
        });
        return rows.map(mapGroup);
    } catch {
        const rows = await listCollection('studyGroups', token, { pageSize: limit });
        return rows.map(mapGroup).sort((a, b) => b.createdAtMs - a.createdAtMs);
    }
}

function mapGroup(d: Record<string, unknown>): StudyGroup {
    return {
        id: String(d.__id || ''),
        name: String(d.name || ''),
        description: String(d.description || ''),
        topic: String(d.topic || ''),
        ownerId: String(d.ownerId || ''),
        ownerName: String(d.ownerName || ''),
        memberIds: Array.isArray(d.memberIds) ? d.memberIds.map(String) : [],
        memberCount: Number(d.memberCount || 0),
        createdAtMs: Number(d.createdAtMs || 0),
    };
}

export async function joinGroup(token: string, groupId: string, uid: string): Promise<void> {
    const g = await getDocument(`studyGroups/${groupId}`, token);
    if (!g) throw new Error('A csoport nem található.');
    const members = Array.isArray(g.memberIds) ? g.memberIds.map(String) : [];
    if (members.includes(uid)) return;
    if (members.length >= 50) throw new Error('A csoport tele van (max 50 fő).');
    await setDocument(
        `studyGroups/${groupId}`,
        token,
        { memberIds: [...members, uid], memberCount: members.length + 1 },
        true
    );
}

export async function leaveGroup(token: string, groupId: string, uid: string): Promise<void> {
    const g = await getDocument(`studyGroups/${groupId}`, token);
    if (!g) return;
    if (String(g.ownerId) === uid) throw new Error('A tulajdonos nem léphet ki.');
    const members = Array.isArray(g.memberIds) ? g.memberIds.map(String) : [];
    if (!members.includes(uid)) return;
    const next = members.filter((m) => m !== uid);
    await setDocument(
        `studyGroups/${groupId}`,
        token,
        { memberIds: next, memberCount: next.length },
        true
    );
}

export async function sendMessage(
    token: string,
    from: SocialProfile,
    to: SocialProfile,
    text: string
): Promise<void> {
    const cleaned = text.trim().slice(0, 500);
    if (!cleaned) throw new Error('Üres üzenet.');
    const cid = conversationIdFor(from.uid, to.uid);
    const createdAtMs = nowMs();
    await setDocument(
        `conversations/${cid}`,
        token,
        {
            participants: [from.uid, to.uid].sort(),
            participantMeta: {
                [from.uid]: {
                    name: from.displayName,
                    photo: from.photoURL,
                    username: from.username,
                },
                [to.uid]: {
                    name: to.displayName,
                    photo: to.photoURL,
                    username: to.username,
                },
            },
            lastMessage: cleaned,
            updatedAtMs: createdAtMs,
        },
        true
    );
    await createDocument(`conversations/${cid}/messages`, token, {
        senderId: from.uid,
        text: cleaned,
        createdAtMs,
    });
}

export async function listConversations(token: string, uid: string): Promise<ConversationPreview[]> {
    const rows = await runQuery(token, {
        from: [{ collectionId: 'conversations' }],
        where: {
            fieldFilter: {
                field: { fieldPath: 'participants' },
                op: 'ARRAY_CONTAINS',
                value: { stringValue: uid },
            },
        },
        limit: 40,
    }).catch(() => [] as Array<Record<string, unknown>>);

    return rows
        .map((d) => {
            const parts = Array.isArray(d.participants) ? d.participants.map(String) : [];
            const otherUid = parts.find((p) => p !== uid) || '';
            const meta = ((d.participantMeta as any)?.[otherUid] || {}) as Record<string, string>;
            return {
                id: String(d.__id || ''),
                otherUid,
                otherName: String(meta.name || 'Diák'),
                otherPhoto: String(meta.photo || ''),
                lastMessage: String(d.lastMessage || ''),
                updatedAtMs: Number(d.updatedAtMs || 0),
            } as ConversationPreview;
        })
        .sort((a, b) => b.updatedAtMs - a.updatedAtMs);
}

export async function listMessages(
    token: string,
    conversationId: string,
    limit = 80
): Promise<DirectMessage[]> {
    const rows = await listCollection(`conversations/${conversationId}/messages`, token, {
        pageSize: limit,
    });
    return rows
        .map((d) => ({
            id: String(d.__id || ''),
            senderId: String(d.senderId || ''),
            text: String(d.text || ''),
            createdAtMs: Number(d.createdAtMs || 0),
        }))
        .sort((a, b) => a.createdAtMs - b.createdAtMs);
}
