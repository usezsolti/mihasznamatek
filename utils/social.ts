/** Közösségi Firestore műveletek — követés, poszt, like, komment, csoport, DM */

import { FALLBACK_MATH_SHORTS } from './mathShortFallbacks';
import { loadUserPracticeProgress } from './practiceProgress';
import {
    conversationIdFor,
    defaultUsernameFrom,
    slugifyUsername,
    type ConversationPreview,
    type DirectMessage,
    type MathShort,
    type SocialComment,
    type SocialPost,
    type SocialProfile,
    type StudyGroup,
} from './socialTypes';

export { FALLBACK_MATH_SHORTS } from './mathShortFallbacks';

function fb(): any {
    if (typeof window === 'undefined') return null;
    return (window as any).firebase || null;
}

function db() {
    const firebase = fb();
    if (!firebase?.firestore) throw new Error('Firestore nem elérhető');
    return firebase.firestore();
}

function tsMs(v: any): number {
    if (!v) return Date.now();
    if (typeof v.toMillis === 'function') return v.toMillis();
    if (typeof v.seconds === 'number') return v.seconds * 1000;
    if (typeof v === 'number') return v;
    return Date.now();
}

export async function ensureSocialProfile(uid: string): Promise<SocialProfile> {
    const firebase = fb();
    const firestore = db();
    const ref = firestore.collection('socialProfiles').doc(uid);
    const snap = await ref.get();
    const userSnap = await firestore.collection('users').doc(uid).get();
    const user = userSnap.exists ? userSnap.data() || {} : {};
    const authUser = firebase?.auth?.()?.currentUser;
    const progress = await loadUserPracticeProgress(uid);

    if (snap.exists) {
        const d = snap.data() || {};
        const profile: SocialProfile = {
            uid,
            username: String(d.username || defaultUsernameFrom(user.name || '', uid)),
            displayName: String(d.displayName || user.name || authUser?.displayName || 'Diák'),
            photoURL: String(d.photoURL || user.photoURL || authUser?.photoURL || ''),
            bio: String(d.bio || ''),
            xp: Number(progress.xp || d.xp || 0),
            rank: String(progress.rank || d.rank || 'BEGINNER'),
            followerCount: Number(d.followerCount || 0),
            followingCount: Number(d.followingCount || 0),
            postCount: Number(d.postCount || 0),
            showXp: d.showXp !== false,
            updatedAt: d.updatedAt,
        };
        // XP szinkron
        await ref.set(
            {
                xp: profile.xp,
                rank: profile.rank,
                displayName: profile.displayName,
                photoURL: profile.photoURL,
                updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            },
            { merge: true }
        );
        return profile;
    }

    const profile: SocialProfile = {
        uid,
        username: defaultUsernameFrom(String(user.name || authUser?.displayName || ''), uid),
        displayName: String(user.name || authUser?.displayName || 'Diák'),
        photoURL: String(user.photoURL || authUser?.photoURL || ''),
        bio: '',
        xp: Number(progress.xp || 0),
        rank: String(progress.rank || 'BEGINNER'),
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        showXp: true,
    };
    await ref.set({
        ...profile,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    return profile;
}

export async function getSocialProfile(uid: string): Promise<SocialProfile | null> {
    const snap = await db().collection('socialProfiles').doc(uid).get();
    if (!snap.exists) return null;
    const d = snap.data() || {};
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

export async function updateSocialProfile(
    uid: string,
    patch: Partial<Pick<SocialProfile, 'username' | 'bio' | 'displayName' | 'showXp'>>
): Promise<void> {
    const firebase = fb();
    const data: Record<string, unknown> = {
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
    };
    if (patch.bio !== undefined) data.bio = String(patch.bio).slice(0, 160);
    if (patch.displayName !== undefined) data.displayName = String(patch.displayName).slice(0, 40);
    if (patch.showXp !== undefined) data.showXp = !!patch.showXp;
    if (patch.username !== undefined) {
        const u = slugifyUsername(patch.username);
        if (u.length < 3) throw new Error('A felhasználónév legalább 3 karakter legyen.');
        const taken = await db()
            .collection('socialProfiles')
            .where('username', '==', u)
            .limit(5)
            .get();
        const clash = taken.docs.some((doc: any) => doc.id !== uid);
        if (clash) throw new Error('Ez a felhasználónév már foglalt.');
        data.username = u;
    }
    await db().collection('socialProfiles').doc(uid).set(data, { merge: true });
}

export async function listProfiles(limit = 24): Promise<SocialProfile[]> {
    const mapDoc = (doc: any): SocialProfile => {
        const d = doc.data() || {};
        return {
            uid: doc.id,
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
    };
    try {
        const snap = await db()
            .collection('socialProfiles')
            .orderBy('xp', 'desc')
            .limit(limit)
            .get();
        return snap.docs.map(mapDoc);
    } catch {
        const snap = await db().collection('socialProfiles').limit(limit).get();
        return snap.docs.map(mapDoc).sort((a, b) => b.xp - a.xp);
    }
}

export async function isFollowing(followerId: string, followingId: string): Promise<boolean> {
    const id = `${followerId}_${followingId}`;
    const snap = await db().collection('follows').doc(id).get();
    return snap.exists;
}

export async function followUser(followerId: string, followingId: string): Promise<void> {
    if (followerId === followingId) return;
    const firebase = fb();
    const firestore = db();
    const id = `${followerId}_${followingId}`;
    const ref = firestore.collection('follows').doc(id);
    const existing = await ref.get();
    if (existing.exists) return;
    const batch = firestore.batch();
    batch.set(ref, {
        followerId,
        followingId,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
    });
    batch.set(
        firestore.collection('socialProfiles').doc(followingId),
        { followerCount: firebase.firestore.FieldValue.increment(1) },
        { merge: true }
    );
    batch.set(
        firestore.collection('socialProfiles').doc(followerId),
        { followingCount: firebase.firestore.FieldValue.increment(1) },
        { merge: true }
    );
    await batch.commit();
}

export async function unfollowUser(followerId: string, followingId: string): Promise<void> {
    const firebase = fb();
    const firestore = db();
    const id = `${followerId}_${followingId}`;
    const ref = firestore.collection('follows').doc(id);
    const existing = await ref.get();
    if (!existing.exists) return;
    const batch = firestore.batch();
    batch.delete(ref);
    batch.set(
        firestore.collection('socialProfiles').doc(followingId),
        { followerCount: firebase.firestore.FieldValue.increment(-1) },
        { merge: true }
    );
    batch.set(
        firestore.collection('socialProfiles').doc(followerId),
        { followingCount: firebase.firestore.FieldValue.increment(-1) },
        { merge: true }
    );
    await batch.commit();
}

export async function listFollowingIds(uid: string): Promise<string[]> {
    const snap = await db().collection('follows').where('followerId', '==', uid).limit(200).get();
    return snap.docs.map((d: any) => String(d.data()?.followingId || '')).filter(Boolean);
}

function mapPost(doc: any): SocialPost {
    const d = doc.data() || {};
    return {
        id: doc.id,
        authorId: String(d.authorId || ''),
        authorName: String(d.authorName || 'Diák'),
        authorUsername: String(d.authorUsername || ''),
        authorPhoto: String(d.authorPhoto || ''),
        text: String(d.text || ''),
        imageUrl: d.imageUrl || null,
        likeCount: Number(d.likeCount || 0),
        commentCount: Number(d.commentCount || 0),
        createdAt: d.createdAt,
        createdAtMs: tsMs(d.createdAt) || Number(d.createdAtMs || Date.now()),
    };
}

export async function createPost(
    author: SocialProfile,
    text: string,
    imageUrl?: string | null
): Promise<SocialPost> {
    const firebase = fb();
    const firestore = db();
    const cleaned = text.trim().slice(0, 500);
    if (!cleaned) throw new Error('Írj valamit a posztba!');
    const ref = firestore.collection('posts').doc();
    const payload = {
        authorId: author.uid,
        authorName: author.displayName,
        authorUsername: author.username,
        authorPhoto: author.photoURL,
        text: cleaned,
        imageUrl: imageUrl || null,
        likeCount: 0,
        commentCount: 0,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdAtMs: Date.now(),
    };
    const batch = firestore.batch();
    batch.set(ref, payload);
    batch.set(
        firestore.collection('socialProfiles').doc(author.uid),
        { postCount: firebase.firestore.FieldValue.increment(1) },
        { merge: true }
    );
    await batch.commit();
    return { id: ref.id, ...payload, createdAtMs: Date.now() };
}

export async function listFeedPosts(opts?: {
    authorIds?: string[];
    limit?: number;
}): Promise<SocialPost[]> {
    const limit = opts?.limit ?? 40;
    const firestore = db();
    // Egyszerű globális feed (Instagram-szerű felfedezés); követettek előre rendezve kliensen
    const snap = await firestore.collection('posts').orderBy('createdAtMs', 'desc').limit(limit).get();
    let posts = snap.docs.map(mapPost);
    if (opts?.authorIds?.length) {
        const set = new Set(opts.authorIds);
        const followed = posts.filter((p) => set.has(p.authorId));
        const rest = posts.filter((p) => !set.has(p.authorId));
        posts = [...followed, ...rest];
    }
    return posts;
}

export async function listUserPosts(uid: string, limit = 30): Promise<SocialPost[]> {
    try {
        const snap = await db()
            .collection('posts')
            .where('authorId', '==', uid)
            .orderBy('createdAtMs', 'desc')
            .limit(limit)
            .get();
        return snap.docs.map(mapPost);
    } catch {
        const snap = await db().collection('posts').where('authorId', '==', uid).limit(limit).get();
        return snap.docs
            .map(mapPost)
            .sort((a: SocialPost, b: SocialPost) => b.createdAtMs - a.createdAtMs);
    }
}

export async function hasLiked(postId: string, uid: string): Promise<boolean> {
    const snap = await db().collection('posts').doc(postId).collection('likes').doc(uid).get();
    return snap.exists;
}

export async function toggleLike(postId: string, uid: string): Promise<{ liked: boolean; likeCount: number }> {
    const firebase = fb();
    const firestore = db();
    const likeRef = firestore.collection('posts').doc(postId).collection('likes').doc(uid);
    const postRef = firestore.collection('posts').doc(postId);
    const liked = (await likeRef.get()).exists;
    const batch = firestore.batch();
    if (liked) {
        batch.delete(likeRef);
        batch.set(postRef, { likeCount: firebase.firestore.FieldValue.increment(-1) }, { merge: true });
    } else {
        batch.set(likeRef, {
            uid,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        });
        batch.set(postRef, { likeCount: firebase.firestore.FieldValue.increment(1) }, { merge: true });
    }
    await batch.commit();
    const post = await postRef.get();
    return { liked: !liked, likeCount: Number(post.data()?.likeCount || 0) };
}

export async function addComment(
    postId: string,
    author: SocialProfile,
    text: string
): Promise<SocialComment> {
    const firebase = fb();
    const firestore = db();
    const cleaned = text.trim().slice(0, 300);
    if (!cleaned) throw new Error('Üres komment.');
    const ref = firestore.collection('posts').doc(postId).collection('comments').doc();
    const payload = {
        authorId: author.uid,
        authorName: author.displayName,
        authorPhoto: author.photoURL,
        text: cleaned,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdAtMs: Date.now(),
    };
    const batch = firestore.batch();
    batch.set(ref, payload);
    batch.set(
        firestore.collection('posts').doc(postId),
        { commentCount: firebase.firestore.FieldValue.increment(1) },
        { merge: true }
    );
    await batch.commit();
    return { id: ref.id, ...payload };
}

export async function listComments(postId: string, limit = 40): Promise<SocialComment[]> {
    const snap = await db()
        .collection('posts')
        .doc(postId)
        .collection('comments')
        .orderBy('createdAtMs', 'asc')
        .limit(limit)
        .get();
    return snap.docs.map((doc: any) => {
        const d = doc.data() || {};
        return {
            id: doc.id,
            authorId: String(d.authorId || ''),
            authorName: String(d.authorName || 'Diák'),
            authorPhoto: String(d.authorPhoto || ''),
            text: String(d.text || ''),
            createdAtMs: Number(d.createdAtMs || tsMs(d.createdAt)),
        } as SocialComment;
    });
}

export async function createStudyGroup(
    owner: SocialProfile,
    name: string,
    description: string,
    topic: string
): Promise<StudyGroup> {
    const firebase = fb();
    const cleaned = name.trim().slice(0, 60);
    if (cleaned.length < 3) throw new Error('Adj nevet a csoportnak (min. 3 karakter).');
    const ref = db().collection('studyGroups').doc();
    const payload = {
        name: cleaned,
        description: description.trim().slice(0, 200),
        topic: topic.trim().slice(0, 60),
        ownerId: owner.uid,
        ownerName: owner.displayName,
        memberIds: [owner.uid],
        memberCount: 1,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdAtMs: Date.now(),
    };
    await ref.set(payload);
    return { id: ref.id, ...payload };
}

export async function listStudyGroups(limit = 40): Promise<StudyGroup[]> {
    const snap = await db()
        .collection('studyGroups')
        .orderBy('createdAtMs', 'desc')
        .limit(limit)
        .get();
    return snap.docs.map((doc: any) => {
        const d = doc.data() || {};
        return {
            id: doc.id,
            name: String(d.name || ''),
            description: String(d.description || ''),
            topic: String(d.topic || ''),
            ownerId: String(d.ownerId || ''),
            ownerName: String(d.ownerName || ''),
            memberIds: Array.isArray(d.memberIds) ? d.memberIds.map(String) : [],
            memberCount: Number(d.memberCount || 0),
            createdAtMs: Number(d.createdAtMs || tsMs(d.createdAt)),
        } as StudyGroup;
    });
}

export async function joinStudyGroup(groupId: string, uid: string): Promise<void> {
    const firebase = fb();
    const ref = db().collection('studyGroups').doc(groupId);
    const snap = await ref.get();
    if (!snap.exists) throw new Error('A csoport nem található.');
    const members: string[] = Array.isArray(snap.data()?.memberIds)
        ? snap.data().memberIds.map(String)
        : [];
    if (members.includes(uid)) return;
    if (members.length >= 50) throw new Error('A csoport tele van (max 50 fő).');
    await ref.set(
        {
            memberIds: [...members, uid],
            memberCount: firebase.firestore.FieldValue.increment(1),
        },
        { merge: true }
    );
}

export async function leaveStudyGroup(groupId: string, uid: string): Promise<void> {
    const firebase = fb();
    const ref = db().collection('studyGroups').doc(groupId);
    const snap = await ref.get();
    if (!snap.exists) return;
    const d = snap.data() || {};
    if (d.ownerId === uid) throw new Error('A tulajdonos nem léphet ki — töröld a csoportot.');
    const members: string[] = Array.isArray(d.memberIds) ? d.memberIds.map(String) : [];
    if (!members.includes(uid)) return;
    await ref.set(
        {
            memberIds: members.filter((m) => m !== uid),
            memberCount: firebase.firestore.FieldValue.increment(-1),
        },
        { merge: true }
    );
}

export async function sendDirectMessage(
    fromUid: string,
    toUid: string,
    text: string,
    fromProfile: SocialProfile,
    toProfile: SocialProfile
): Promise<void> {
    const firebase = fb();
    const firestore = db();
    const cleaned = text.trim().slice(0, 500);
    if (!cleaned) throw new Error('Üres üzenet.');
    const cid = conversationIdFor(fromUid, toUid);
    const convRef = firestore.collection('conversations').doc(cid);
    const msgRef = convRef.collection('messages').doc();
    const batch = firestore.batch();
    batch.set(
        convRef,
        {
            participants: [fromUid, toUid].sort(),
            participantMeta: {
                [fromUid]: {
                    name: fromProfile.displayName,
                    photo: fromProfile.photoURL,
                    username: fromProfile.username,
                },
                [toUid]: {
                    name: toProfile.displayName,
                    photo: toProfile.photoURL,
                    username: toProfile.username,
                },
            },
            lastMessage: cleaned,
            updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
            updatedAtMs: Date.now(),
        },
        { merge: true }
    );
    batch.set(msgRef, {
        senderId: fromUid,
        text: cleaned,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        createdAtMs: Date.now(),
    });
    await batch.commit();
}

export async function listConversations(uid: string): Promise<ConversationPreview[]> {
    const mapConv = (doc: any): ConversationPreview => {
        const d = doc.data() || {};
        const parts: string[] = Array.isArray(d.participants) ? d.participants.map(String) : [];
        const otherUid = parts.find((p) => p !== uid) || '';
        const meta = d.participantMeta?.[otherUid] || {};
        return {
            id: doc.id,
            otherUid,
            otherName: String(meta.name || 'Diák'),
            otherPhoto: String(meta.photo || ''),
            lastMessage: String(d.lastMessage || ''),
            updatedAtMs: Number(d.updatedAtMs || tsMs(d.updatedAt)),
        };
    };
    try {
        const snap = await db()
            .collection('conversations')
            .where('participants', 'array-contains', uid)
            .orderBy('updatedAtMs', 'desc')
            .limit(40)
            .get();
        return snap.docs.map(mapConv);
    } catch {
        const snap = await db()
            .collection('conversations')
            .where('participants', 'array-contains', uid)
            .limit(40)
            .get();
        return snap.docs
            .map(mapConv)
            .sort((a: ConversationPreview, b: ConversationPreview) => b.updatedAtMs - a.updatedAtMs);
    }
}

export async function listMessages(conversationId: string, limit = 80): Promise<DirectMessage[]> {
    const snap = await db()
        .collection('conversations')
        .doc(conversationId)
        .collection('messages')
        .orderBy('createdAtMs', 'asc')
        .limit(limit)
        .get();
    return snap.docs.map((doc: any) => {
        const d = doc.data() || {};
        return {
            id: doc.id,
            senderId: String(d.senderId || ''),
            text: String(d.text || ''),
            createdAtMs: Number(d.createdAtMs || tsMs(d.createdAt)),
        } as DirectMessage;
    });
}

export async function saveMathShort(short: Omit<MathShort, 'id'>): Promise<MathShort> {
    const firebase = fb();
    const ref = db().collection('mathShorts').doc();
    const payload = { ...short, createdAt: firebase.firestore.FieldValue.serverTimestamp() };
    await ref.set(payload);
    return { id: ref.id, ...short };
}

export async function listMathShorts(limit = 20): Promise<MathShort[]> {
    const snap = await db()
        .collection('mathShorts')
        .orderBy('createdAtMs', 'desc')
        .limit(limit)
        .get();
    return snap.docs.map((doc: any) => {
        const d = doc.data() || {};
        return {
            id: doc.id,
            topic: String(d.topic || ''),
            title: String(d.title || ''),
            hook: String(d.hook || ''),
            body: String(d.body || ''),
            tip: String(d.tip || ''),
            difficulty: String(d.difficulty || 'közepes'),
            createdAtMs: Number(d.createdAtMs || tsMs(d.createdAt)),
        } as MathShort;
    });
}