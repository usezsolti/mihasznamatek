/** Közösség szolgáltatás — Node.js backend (Firestore REST + user token) */



import {

    conversationIdFor,

    type ConversationPreview,

    type DirectMessage,

    type SocialComment,

    type SocialPost,

    type SocialProfile,

    type StudyGroup,

} from '../../utils/socialTypes';

import {

    applyProfilePatchFields,

    assertCanJoinGroup,

    assertCanLeaveGroup,

    buildCommentFields,

    buildPostFields,

    createBlankSocialProfile,

    followDocId,

    mapConversationPreview,

    mapSocialComment,

    mapSocialPost,

    mapSocialProfile,

    mapStudyGroup,

    normalizeCommentText,

    normalizeGroupInput,
    resolveGroupMemberIds,

    normalizeMessageText,
    buildMessageReply,
    mapDirectMessage,
    toggleMessageReaction,
    assertConversationParticipant,

    assertMathOnlyPost,
    assertNoVideoPost,
    assertPublicSocialPost,
    canViewSocialPost,
    isPublicSocialPost,
    socialTodayKey,
    sortSocialFeed,
    isPlaceholderSocialProfile,
    isInvalidSocialAuthor,

    normalizeUsernameOrThrow,

    participantMetaFromProfile,

    publicSocialProfiles,

} from '../../utils/socialDomain';

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

        const profile = mapSocialProfile(uid, existing);

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



    const profile = createBlankSocialProfile(uid, {

        displayName: hints?.name || 'Diák',

        photoURL: hints?.photoURL || '',

        xp: progress.xp,

        rank: progress.rank,

    });

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

    return d ? mapSocialProfile(uid, d) : null;

}



export async function updateProfile(

    token: string,

    uid: string,

    patch: { username?: string; bio?: string; displayName?: string; showXp?: boolean }

): Promise<SocialProfile> {

    const data: Record<string, unknown> = { updatedAtMs: nowMs() };

    applyProfilePatchFields(data as { bio?: string; displayName?: string; showXp?: boolean }, patch);

    if (patch.username !== undefined) {

        const u = normalizeUsernameOrThrow(patch.username);

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

        return publicSocialProfiles(rows.map((d) => mapSocialProfile(String(d.__id), d)), limit);

    } catch {

        const rows = await listCollection('socialProfiles', token, { pageSize: limit });

        return publicSocialProfiles(
            rows
                .map((d) => mapSocialProfile(String(d.__id), d))
                .sort((a, b) => b.xp - a.xp),
            limit
        );

    }

}



function sortPostsNewest(posts: SocialPost[]): SocialPost[] {
    return sortSocialFeed(posts);
}

export async function listFeed(token: string, limit = 40): Promise<SocialPost[]> {
    try {
        const rows = await runQuery(token, {
            from: [{ collectionId: 'posts' }],
            orderBy: [{ field: { fieldPath: 'createdAtMs' }, direction: 'DESCENDING' }],
            limit,
        });
        const mapped = rows.map(mapSocialPost).filter((p) => p.id && p.authorId && isPublicSocialPost(p));
        if (mapped.length) return sortPostsNewest(mapped).slice(0, limit);
    } catch {
        /* fallback below */
    }
    const rows = await listCollection('posts', token, { pageSize: Math.max(limit, 80) });
    return sortPostsNewest(
        rows.map(mapSocialPost).filter((p) => p.id && p.authorId && isPublicSocialPost(p))
    ).slice(0, limit);
}

export async function listUserPosts(
    token: string,
    authorId: string,
    limit = 40,
    viewer?: { uid?: string; isAdmin?: boolean }
): Promise<SocialPost[]> {
    const uid = String(authorId || '');
    if (!uid) return [];
    try {
        const rows = await runQuery(token, {
            from: [{ collectionId: 'posts' }],
            where: {
                fieldFilter: {
                    field: { fieldPath: 'authorId' },
                    op: 'EQUAL',
                    value: { stringValue: uid },
                },
            },
            orderBy: [{ field: { fieldPath: 'createdAtMs' }, direction: 'DESCENDING' }],
            limit,
        });
        const mapped = rows.map(mapSocialPost).filter((p) => p.id && canViewSocialPost(p, viewer));
        if (mapped.length) return sortPostsNewest(mapped).slice(0, limit);
    } catch {
        /* try without orderBy (no composite index yet) */
    }
    try {
        const rows = await runQuery(token, {
            from: [{ collectionId: 'posts' }],
            where: {
                fieldFilter: {
                    field: { fieldPath: 'authorId' },
                    op: 'EQUAL',
                    value: { stringValue: uid },
                },
            },
            limit,
        });
        const mapped = rows.map(mapSocialPost).filter((p) => p.id && canViewSocialPost(p, viewer));
        if (mapped.length) return sortPostsNewest(mapped).slice(0, limit);
    } catch {
        /* last resort: scan */
    }
    const rows = await listCollection('posts', token, { pageSize: 120 });
    return sortPostsNewest(
        rows.map(mapSocialPost).filter((p) => p.authorId === uid && canViewSocialPost(p, viewer))
    ).slice(0, limit);
}

export async function listPendingPosts(token: string, limit = 80): Promise<SocialPost[]> {
    const rows = await listCollection('posts', token, { pageSize: Math.max(limit, 120) });
    return sortPostsNewest(
        rows
            .map(mapSocialPost)
            .filter(
                (p) =>
                    p.id &&
                    String(p.moderationStatus || '') === 'pending' &&
                    !isInvalidSocialAuthor(p)
            )
    ).slice(0, limit);
}



export async function createPost(
    token: string,
    author: SocialProfile,
    text: string,
    media?: { imageUrl?: string | null; videoUrl?: string | null; topic?: string | null; daily?: boolean },
    opts?: { autoApprove?: boolean; daily?: boolean }
): Promise<SocialPost> {
    assertNoVideoPost(media?.videoUrl);
    const hasMedia = !!media?.imageUrl;
    const cleaned = assertMathOnlyPost(text, media?.topic, hasMedia);
    const createdAtMs = nowMs();
    const approved = !!opts?.autoApprove;
    const daily = !!(opts?.daily || media?.daily);
    if (daily && !approved) {
        throw new Error('Napi posztot csak a tanár tehet ki.');
    }
    const dailyKey = daily ? socialTodayKey() : null;
    const payload = buildPostFields(
        author,
        cleaned,
        createdAtMs,
        media?.imageUrl || null,
        null,
        media?.topic || null,
        approved ? 'approved' : 'pending',
        dailyKey
    );
    if (dailyKey) {
        const existing = await listCollection('posts', token, { pageSize: 80 });
        for (const row of existing) {
            const id = String(row.__id || row.id || '');
            if (!id || String(row.dailyKey || '') !== dailyKey) continue;
            await setDocument(`posts/${id}`, token, { dailyKey: null }, true).catch(() => undefined);
        }
    }
    const id = await createDocument('posts', token, payload);
    if (approved) {
        try {
            await commitIncrement(token, `socialProfiles/${author.uid}`, 'postCount', 1);
        } catch {
            /* ignore counter fail */
        }
    }
    return { id, ...payload };
}

export async function reviewPost(
    token: string,
    postId: string,
    decision: 'approved' | 'rejected'
): Promise<SocialPost> {
    const raw = await getDocument(`posts/${postId}`, token);
    if (!raw) throw new Error('Poszt nem található.');
    const current = mapSocialPost({ ...raw, __id: postId, id: postId });
    if (String(current.moderationStatus || '') !== 'pending') {
        throw new Error('Ez a poszt már el lett bírálva.');
    }
    await setDocument(`posts/${postId}`, token, { moderationStatus: decision }, true);
    if (decision === 'approved') {
        try {
            await commitIncrement(token, `socialProfiles/${current.authorId}`, 'postCount', 1);
        } catch {
            /* ignore */
        }
    }
    return { ...current, moderationStatus: decision };
}

export async function purgeSocialJunk(
    token: string,
    keepUid?: string
): Promise<{ deletedPosts: number; deletedProfiles: number }> {
    const keep = String(keepUid || '');
    const posts = await listCollection('posts', token, { pageSize: 200 });
    let deletedPosts = 0;
    for (const row of posts) {
        const id = String(row.__id || row.id || '');
        if (!id) continue;
        try {
            await deleteDocument(`posts/${id}`, token);
            deletedPosts += 1;
        } catch {
            /* skip locked */
        }
    }
    const profiles = await listCollection('socialProfiles', token, { pageSize: 200 });
    let deletedProfiles = 0;
    for (const row of profiles) {
        const uid = String(row.__id || row.uid || '');
        if (!uid || uid === keep) continue;
        const profile = mapSocialProfile(uid, row);
        if (!isPlaceholderSocialProfile(profile)) continue;
        try {
            await deleteDocument(`socialProfiles/${uid}`, token);
            deletedProfiles += 1;
        } catch {
            /* skip locked */
        }
    }
    return { deletedPosts, deletedProfiles };
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
    const raw = await getDocument(`posts/${postId}`, token);
    if (!raw) throw new Error('Poszt nem található.');
    assertPublicSocialPost(mapSocialPost({ ...raw, __id: postId, id: postId }));

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
    const raw = await getDocument(`posts/${postId}`, token);
    if (!raw) throw new Error('Poszt nem található.');
    assertPublicSocialPost(mapSocialPost({ ...raw, __id: postId, id: postId }));

    const cleaned = normalizeCommentText(text);

    const payload = buildCommentFields(author, cleaned, nowMs());

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

    return urlRows.map(mapSocialComment).sort((a, b) => a.createdAtMs - b.createdAtMs);

}



export async function follow(token: string, followerId: string, followingId: string): Promise<void> {

    if (followerId === followingId) return;

    const id = followDocId(followerId, followingId);

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

    const id = followDocId(followerId, followingId);

    const existing = await getDocument(`follows/${id}`, token);

    if (!existing) return;

    await deleteDocument(`follows/${id}`, token);

    await commitIncrement(token, `socialProfiles/${followingId}`, 'followerCount', -1).catch(() => undefined);

    await commitIncrement(token, `socialProfiles/${followerId}`, 'followingCount', -1).catch(() => undefined);

}



export async function isFollowing(token: string, followerId: string, followingId: string): Promise<boolean> {

    return !!(await getDocument(`follows/${followDocId(followerId, followingId)}`, token));

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

    topic: string,

    invitedIds?: string[]

): Promise<StudyGroup> {

    const input = normalizeGroupInput(name, description, topic);

    const requested = resolveGroupMemberIds(owner.uid, invitedIds);

    const extras = requested.slice(1);

    const found = await Promise.all(extras.map((id) => getProfile(token, id)));

    const memberIds = [owner.uid, ...extras.filter((_, i) => !!found[i])];

    const payload = {

        ...input,

        ownerId: owner.uid,

        ownerName: owner.displayName,

        memberIds,

        memberCount: memberIds.length,

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

        return rows.map(mapStudyGroup);

    } catch {

        const rows = await listCollection('studyGroups', token, { pageSize: limit });

        return rows.map(mapStudyGroup).sort((a, b) => b.createdAtMs - a.createdAtMs);

    }

}



export async function joinGroup(token: string, groupId: string, uid: string): Promise<void> {

    const g = await getDocument(`studyGroups/${groupId}`, token);

    if (!g) throw new Error('A csoport nem található.');

    const members = Array.isArray(g.memberIds) ? g.memberIds.map(String) : [];

    assertCanJoinGroup(members, uid);

    if (members.includes(uid)) return;

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

    assertCanLeaveGroup(String(g.ownerId), uid);

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

    text: string,

    reply?: { id?: string | null; text?: string | null; senderId?: string | null } | null

): Promise<void> {

    const cleaned = normalizeMessageText(text);

    const quoted = buildMessageReply(reply);

    const cid = conversationIdFor(from.uid, to.uid);

    const createdAtMs = nowMs();

    const existing = await getDocument(`conversations/${cid}`, token);

    await setDocument(

        `conversations/${cid}`,

        token,

        {

            participants: [from.uid, to.uid].sort(),

            participantMeta: {

                [from.uid]: participantMetaFromProfile(from),

                [to.uid]: participantMetaFromProfile(to),

            },

            lastMessage: cleaned,

            lastSenderId: from.uid,

            initiatorId: String(existing?.initiatorId || from.uid),

            updatedAtMs: createdAtMs,

        },

        true

    );

    await createDocument(`conversations/${cid}/messages`, token, {

        senderId: from.uid,

        text: cleaned,

        createdAtMs,

        ...(quoted || {}),

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

            return mapConversationPreview(String(d.__id || ''), uid, {

                participants: parts,

                meta: (d.participantMeta as Record<string, { name?: string; photo?: string; username?: string }>) || {},

                lastMessage: String(d.lastMessage || ''),

                lastSenderId: String(d.lastSenderId || ''),

                initiatorId: String(d.initiatorId || ''),

                updatedAtMs: Number(d.updatedAtMs || 0),

            });

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

        .map((d) => mapDirectMessage(d))

        .sort((a, b) => a.createdAtMs - b.createdAtMs);

}

export async function reactToMessage(
    token: string,
    conversationId: string,
    messageId: string,
    uid: string,
    emoji: string
): Promise<DirectMessage> {
    const cid = String(conversationId || '').trim();
    const mid = String(messageId || '').trim();
    if (!cid || !mid) throw new Error('Hiányzó üzenet.');
    const conv = await getDocument(`conversations/${cid}`, token);
    if (!conv) throw new Error('Beszélgetés nem található.');
    assertConversationParticipant(conv.participants, uid);
    const raw = await getDocument(`conversations/${cid}/messages/${mid}`, token);
    if (!raw) throw new Error('Üzenet nem található.');
    const current = mapDirectMessage({ ...raw, __id: mid, id: mid });
    const reactions = toggleMessageReaction(current.reactions, uid, emoji);
    await setDocument(`conversations/${cid}/messages/${mid}`, token, { reactions }, true);
    return { ...current, reactions };
}


