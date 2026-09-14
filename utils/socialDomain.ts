/**
 * Közös social domain — mappers + validátorok.
 * IO (Firestore / local JSON) a három adapterben marad; a szabályok itt.
 */
import {
    defaultUsernameFrom,
    slugifyUsername,
    type DirectMessage,
    type MessageReaction,
    type ConversationPreview,
    type SocialComment,
    type SocialPost,
    type SocialProfile,
    type StudyGroup,
    isMathPostTopic,
} from './socialTypes';
import { getBudapestDateKeyOffset } from './booking/dates';

export function mapSocialProfile(uid: string, d: Record<string, unknown>): SocialProfile {
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

/** Teszt / üres placeholder fiókok — ne jelenjenek meg a MihaSocial listákban. */
export function isPlaceholderSocialProfile(p: {
    displayName?: string;
    username?: string;
    photoURL?: string;
    bio?: string;
    postCount?: number;
}): boolean {
    const name = String(p.displayName || '').trim().toLowerCase();
    const username = String(p.username || '').trim().toLowerCase();
    if (name === 'teszt felhasználó' || name.includes('teszt felhasznál')) return true;
    if (username.startsWith('tesztfelhasznalo')) return true;
    if (name === 'diák' || name === 'diak' || name === 'student') return true;
    if (!name && (!username || /^diak[a-z0-9]{0,6}$/i.test(username))) return true;
    return false;
}

export function isInvalidSocialAuthor(post: {
    authorName?: string | null;
    authorUsername?: string | null;
}): boolean {
    return isPlaceholderSocialProfile({
        displayName: String(post.authorName || ''),
        username: String(post.authorUsername || ''),
    });
}

export function publicSocialProfiles<T extends Parameters<typeof isPlaceholderSocialProfile>[0]>(
    profiles: T[],
    limit?: number
): T[] {
    const out = profiles.filter((p) => !isPlaceholderSocialProfile(p));
    return typeof limit === 'number' ? out.slice(0, limit) : out;
}

export function createBlankSocialProfile(
    uid: string,
    hints?: { displayName?: string; photoURL?: string; xp?: number; rank?: string }
): SocialProfile {
    const displayName = hints?.displayName || 'Diák';
    return {
        uid,
        username: defaultUsernameFrom(displayName, uid),
        displayName,
        photoURL: hints?.photoURL || '',
        bio: '',
        xp: hints?.xp ?? 0,
        rank: hints?.rank || 'BEGINNER',
        followerCount: 0,
        followingCount: 0,
        postCount: 0,
        showXp: true,
    };
}

export type ProfilePatch = {
    username?: string;
    bio?: string;
    displayName?: string;
    showXp?: boolean;
};

/** Alkalmazza a patch mezőket (username uniqueness külön IO). */
export function applyProfilePatchFields(
    target: { bio?: string; displayName?: string; showXp?: boolean; username?: string },
    patch: ProfilePatch
): void {
    if (patch.bio !== undefined) target.bio = String(patch.bio).slice(0, 160);
    if (patch.displayName !== undefined) target.displayName = String(patch.displayName).slice(0, 40);
    if (patch.showXp !== undefined) target.showXp = !!patch.showXp;
}

export function normalizeUsernameOrThrow(raw: string): string {
    const u = slugifyUsername(raw);
    if (u.length < 3) throw new Error('A felhasználónév legalább 3 karakter legyen.');
    return u;
}

export function normalizePostText(text: string, opts?: { allowEmpty?: boolean }): string {
    const cleaned = text.trim().slice(0, 500);
    if (!cleaned && !opts?.allowEmpty) throw new Error('Írj valamit a posztba!');
    return cleaned;
}

const MATH_TOPIC_HINTS = [
    'feladat',
    'megoldas',
    'kerdes',
    'algebra',
    'geometria',
    'fuggveny',
    'szamitas',
    'valoszinuseg',
    'erettsegi',
    'felveteli',
    'egyetem',
    'egyenlet',
    'egyenletrendszer',
    'kifejezes',
    'toresek',
    'tort',
    'szam',
    'szamol',
    'haromszog',
    'negyzet',
    'teglalap',
    'kor',
    'szog',
    'pitagorasz',
    'derivalt',
    'integral',
    'matrix',
    'vektor',
    'statisztika',
    'kozponti',
    'lecke',
    'hazi',
    'dolgozat',
    'szigorlat',
    'zh',
    'gyok',
    'hatvany',
    'szorzat',
    'hanyados',
    'kerulet',
    'terulet',
    'terfogat',
    'koordinata',
    'grafikon',
    'diagram',
    'szazalek',
    'prim',
    'oszto',
    'tobbszoros',
    'logaritmus',
    'szinusz',
    'koszinusz',
    'analízis',
    'analizis',
    'diszkret',
    'kombinatorika',
    'indukcio',
    'bizonyitas',
    'keplet',
    'matek',
    'matematika',
    'szamitas',
    'bme',
    'nat',
];

const MATH_EXPR_RE =
    /\d+\s*([+\-–−*/:×÷=<>^]|plusz|minusz)\s*\d+|√|π|∫|∑|≤|≥|≠|∞|\\frac|\b(sin|cos|tan|log|ln|lim)\b|[²³⁴⁵]/i;

const OFF_TOPIC_RE =
    /\b(foci|focimeccs|politika|valasztas|cigaretta|alkohol|randi|tinder|csajoz|onlyfans|kriptovaluta|nft)\b/i;

function foldHu(text: string): string {
    return text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
}

export function postLooksLikeMath(text: string): boolean {
    const raw = String(text || '').trim();
    if (!raw) return false;
    if (MATH_EXPR_RE.test(raw)) return true;
    const folded = foldHu(raw);
    return MATH_TOPIC_HINTS.some((hint) => folded.includes(hint));
}

export function assertNoVideoPost(videoUrl?: string | null): void {
    if (String(videoUrl || '').trim()) {
        throw new Error('Videót nem lehet posztolni, csak képet vagy szöveget.');
    }
}

export function assertMathOnlyPost(
    text: string,
    topic?: string | null,
    hasMedia = false
): string {
    const cleaned = normalizePostText(text, { allowEmpty: hasMedia });
    if (!isMathPostTopic(topic || '')) {
        throw new Error('Válassz matektémát a posztoláshoz.');
    }
    if (!cleaned && hasMedia) return cleaned;
    const folded = foldHu(cleaned);
    if (OFF_TOPIC_RE.test(folded) && !postLooksLikeMath(cleaned)) {
        throw new Error('A MihaSocial csak matematikáról szól. Írj feladatot, kérdést vagy megoldást.');
    }
    if (!postLooksLikeMath(cleaned)) {
        throw new Error(
            'Csak matekos poszt mehet ki: írj feladatot, képletet, vagy legalább egy matekos szót (pl. egyenlet, tört, érettségi).'
        );
    }
    return cleaned;
}

export function socialPostModerationStatus(post: {
    moderationStatus?: string | null;
}): 'pending' | 'approved' | 'rejected' {
    const s = String(post.moderationStatus || '').trim();
    if (s === 'pending' || s === 'rejected') return s;
    return 'approved';
}

export function isPublicSocialPost(post: {
    moderationStatus?: string | null;
    authorName?: string | null;
    authorUsername?: string | null;
}): boolean {
    return socialPostModerationStatus(post) === 'approved' && !isInvalidSocialAuthor(post);
}

export function canViewSocialPost(
    post: SocialPost,
    viewer?: { uid?: string; isAdmin?: boolean }
): boolean {
    if (isPublicSocialPost(post)) return true;
    if (viewer?.isAdmin) return true;
    return !!(viewer?.uid && viewer.uid === post.authorId);
}

export function assertPublicSocialPost(post: { moderationStatus?: string | null }): void {
    if (!isPublicSocialPost(post)) {
        throw new Error('Ez a poszt még jóváhagyásra vár.');
    }
}

export function buildPostFields(
    author: SocialProfile,
    cleaned: string,
    createdAtMs: number,
    imageUrl: string | null = null,
    videoUrl: string | null = null,
    topic: string | null = null,
    moderationStatus: SocialPost['moderationStatus'] = 'pending',
    dailyKey: string | null = null
): Omit<SocialPost, 'id'> {
    return {
        authorId: author.uid,
        authorName: author.displayName,
        authorUsername: author.username,
        authorPhoto: author.photoURL,
        text: cleaned,
        topic: topic || null,
        imageUrl,
        videoUrl,
        likeCount: 0,
        commentCount: 0,
        createdAtMs,
        moderationStatus: moderationStatus || 'pending',
        dailyKey: dailyKey || null,
    };
}

export function socialTodayKey(): string {
    return getBudapestDateKeyOffset(0);
}

export function isTodaysDailyPost(post: { dailyKey?: string | null }): boolean {
    return !!post.dailyKey && post.dailyKey === socialTodayKey();
}

/** Sztorisáv: csak az aznapi napi poszt szerzői, a néző elöl. */
export function buildDailyStoryProfiles(
    posts: Array<{
        authorId: string;
        authorName?: string;
        authorUsername?: string;
        authorPhoto?: string;
        dailyKey?: string | null;
        createdAtMs?: number;
    }>,
    profiles: SocialProfile[] = [],
    myUid?: string
): SocialProfile[] {
    const latestByAuthor = new Map<string, (typeof posts)[number]>();
    const ordered = [...posts]
        .filter((p) => isTodaysDailyPost(p) && p.authorId)
        .sort((a, b) => Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0));
    for (const post of ordered) {
        if (!latestByAuthor.has(post.authorId)) latestByAuthor.set(post.authorId, post);
    }
    const ids = [...latestByAuthor.keys()];
    if (myUid && ids.includes(myUid)) {
        ids.splice(ids.indexOf(myUid), 1);
        ids.unshift(myUid);
    }
    const profileByUid = new Map(profiles.map((p) => [p.uid, p]));
    return ids.map((uid) => {
        const post = latestByAuthor.get(uid);
        const existing = profileByUid.get(uid);
        if (existing) {
            return {
                ...existing,
                username: existing.username || post?.authorUsername || existing.username,
                photoURL: existing.photoURL || post?.authorPhoto || '',
            };
        }
        const blank = createBlankSocialProfile(uid, {
            displayName: post?.authorName,
            photoURL: post?.authorPhoto,
        });
        return { ...blank, username: post?.authorUsername || blank.username };
    });
}

export function sortSocialFeed(posts: SocialPost[]): SocialPost[] {
    const today = socialTodayKey();
    return [...posts].sort((a, b) => {
        const ad = a.dailyKey === today ? 1 : 0;
        const bd = b.dailyKey === today ? 1 : 0;
        if (ad !== bd) return bd - ad;
        return Number(b.createdAtMs || 0) - Number(a.createdAtMs || 0);
    });
}

/** Feed-frissítés: üres válasz ne törölje a már látható posztokat; az épp közzétett maradjon. */
export function applyFeedRefresh(incoming: SocialPost[], previous: SocialPost[]): SocialPost[] {
    if (!incoming.length) return previous;
    const seen = new Set(incoming.map((p) => p.id).filter(Boolean));
    const optimistic = previous.filter(
        (p) => p.id && !seen.has(p.id) && Date.now() - Number(p.createdAtMs || 0) < 90_000
    );
    return sortSocialFeed([...optimistic, ...incoming]);
}

export function mapSocialPost(d: Record<string, unknown>): SocialPost {
    return {
        id: String(d.__id || d.id || ''),
        authorId: String(d.authorId || ''),
        authorName: String(d.authorName || 'Diák'),
        authorUsername: String(d.authorUsername || ''),
        authorPhoto: String(d.authorPhoto || ''),
        text: String(d.text || ''),
        topic: (d.topic as string) || null,
        imageUrl: (d.imageUrl as string) || null,
        videoUrl: (d.videoUrl as string) || null,
        likeCount: Number(d.likeCount || 0),
        commentCount: Number(d.commentCount || 0),
        createdAtMs: Number(d.createdAtMs || Date.now()),
        moderationStatus:
            d.moderationStatus === 'pending' || d.moderationStatus === 'rejected'
                ? d.moderationStatus
                : d.moderationStatus === 'approved'
                  ? 'approved'
                  : 'approved',
        dailyKey: String(d.dailyKey || '').trim() || null,
    };
}

export function normalizeCommentText(text: string): string {
    const cleaned = text.trim().slice(0, 300);
    if (!cleaned) throw new Error('Üres komment.');
    return cleaned;
}

export function buildCommentFields(
    author: SocialProfile,
    cleaned: string,
    createdAtMs: number
): Omit<SocialComment, 'id'> {
    return {
        authorId: author.uid,
        authorName: author.displayName,
        authorPhoto: author.photoURL,
        text: cleaned,
        createdAtMs,
    };
}

export function mapSocialComment(d: Record<string, unknown>): SocialComment {
    return {
        id: String(d.__id || d.id || ''),
        authorId: String(d.authorId || ''),
        authorName: String(d.authorName || 'Diák'),
        authorPhoto: String(d.authorPhoto || ''),
        text: String(d.text || ''),
        createdAtMs: Number(d.createdAtMs || Date.now()),
    };
}

export function normalizeMessageText(text: string): string {
    const cleaned = text.trim().slice(0, 500);
    if (!cleaned) throw new Error('Üres üzenet.');
    return cleaned;
}

export function buildMessageReply(reply?: {
    id?: string | null;
    text?: string | null;
    senderId?: string | null;
} | null): { replyToId: string; replyToText: string; replyToSenderId: string } | null {
    const id = String(reply?.id || '').trim();
    const senderId = String(reply?.senderId || '').trim();
    const text = String(reply?.text || '')
        .trim()
        .replace(/\s+/g, ' ')
        .slice(0, 140);
    if (!id || !senderId || !text) return null;
    return { replyToId: id, replyToText: text, replyToSenderId: senderId };
}

export const MESSAGE_REACTION_MAX_KINDS = 24;

export function normalizeReactionEmoji(raw: string): string {
    const emoji = String(raw || '').trim();
    if (!emoji) throw new Error('Adj emojit.');
    if ([...emoji].length > 8 || emoji.length > 24) throw new Error('Érvénytelen emoji.');
    if (/^[\s\w.,:;!?@#\-]+$/i.test(emoji)) throw new Error('Érvénytelen emoji.');
    return emoji;
}

export function mapMessageReactions(raw: unknown): MessageReaction[] {
    if (Array.isArray(raw)) {
        return raw
            .map((row) => {
                if (!row || typeof row !== 'object') return null;
                const r = row as Record<string, unknown>;
                const emoji = String(r.emoji || '').trim();
                const uids = Array.isArray(r.uids) ? [...new Set(r.uids.map(String).filter(Boolean))] : [];
                if (!emoji || !uids.length) return null;
                return { emoji, uids };
            })
            .filter((row): row is MessageReaction => !!row);
    }
    if (raw && typeof raw === 'object') {
        return Object.entries(raw as Record<string, unknown>)
            .map(([emoji, uids]) => ({
                emoji: String(emoji || '').trim(),
                uids: Array.isArray(uids) ? [...new Set(uids.map(String).filter(Boolean))] : [],
            }))
            .filter((row) => row.emoji && row.uids.length);
    }
    return [];
}

export function toggleMessageReaction(
    reactions: MessageReaction[] | unknown,
    uid: string,
    emoji: string
): MessageReaction[] {
    const who = String(uid || '').trim();
    if (!who) throw new Error('Be kell jelentkezned.');
    const cleaned = normalizeReactionEmoji(emoji);
    const list = mapMessageReactions(reactions);
    const existing = list.find((r) => r.emoji === cleaned);
    const already = !!existing?.uids.includes(who);
    if (already) {
        return list
            .map((r) => (r.emoji === cleaned ? { ...r, uids: r.uids.filter((id) => id !== who) } : r))
            .filter((r) => r.uids.length > 0);
    }
    if (!existing && list.length >= MESSAGE_REACTION_MAX_KINDS) {
        throw new Error('Túl sok reakció van ezen az üzeneten.');
    }
    if (existing) {
        return list.map((r) => (r.emoji === cleaned ? { ...r, uids: [...r.uids, who] } : r));
    }
    return [...list, { emoji: cleaned, uids: [who] }];
}

export function assertConversationParticipant(participants: unknown, uid: string): void {
    const ids = Array.isArray(participants) ? participants.map(String) : [];
    if (!uid || !ids.includes(uid)) {
        throw new Error('Nincs jogosultságod ehhez a beszélgetéshez.');
    }
}

export function mapDirectMessage(d: Record<string, unknown>): DirectMessage {
    const reply = buildMessageReply({
        id: d.replyToId as string,
        text: d.replyToText as string,
        senderId: d.replyToSenderId as string,
    });
    return {
        id: String(d.__id || d.id || ''),
        senderId: String(d.senderId || ''),
        text: String(d.text || ''),
        createdAtMs: Number(d.createdAtMs || 0),
        replyToId: reply?.replyToId || null,
        replyToText: reply?.replyToText || null,
        replyToSenderId: reply?.replyToSenderId || null,
        reactions: mapMessageReactions(d.reactions),
    };
}

export function normalizeGroupInput(name: string, description: string, topic: string) {
    const cleaned = name.trim().slice(0, 60);
    if (cleaned.length < 3) throw new Error('Adj nevet a csoportnak (min. 3 karakter).');
    return {
        name: cleaned,
        description: description.trim().slice(0, 200),
        topic: topic.trim().slice(0, 60),
    };
}

export const GROUP_MAX_MEMBERS = 50;

export function assertCanJoinGroup(memberIds: string[], uid: string): void {
    if (memberIds.includes(uid)) return;
    if (memberIds.length >= GROUP_MAX_MEMBERS) {
        throw new Error('A csoport tele van (max 50 fő).');
    }
}

export function assertCanLeaveGroup(ownerId: string, uid: string): void {
    if (ownerId === uid) throw new Error('A tulajdonos nem léphet ki.');
}

/** Tulajdonos elöl, ismétlés nélkül, max GROUP_MAX_MEMBERS. */
export function resolveGroupMemberIds(ownerUid: string, invited?: unknown): string[] {
    const owner = String(ownerUid || '').trim();
    if (!owner) throw new Error('Tulajdonos hiányzik.');
    const extra = (Array.isArray(invited) ? invited : [])
        .map((id) => String(id || '').trim())
        .filter((id) => id && id !== owner);
    return [owner, ...new Set(extra)].slice(0, GROUP_MAX_MEMBERS);
}

export function mapStudyGroup(d: Record<string, unknown>): StudyGroup {
    const memberIds = Array.isArray(d.memberIds) ? (d.memberIds as string[]) : [];
    return {
        id: String(d.__id || d.id || ''),
        name: String(d.name || ''),
        description: String(d.description || ''),
        topic: String(d.topic || ''),
        ownerId: String(d.ownerId || ''),
        ownerName: String(d.ownerName || ''),
        memberIds,
        memberCount: Number(d.memberCount || memberIds.length || 0),
        createdAtMs: Number(d.createdAtMs || Date.now()),
        whiteboardId: d.whiteboardId ? String(d.whiteboardId) : null,
    };
}

export function followDocId(followerId: string, followingId: string): string {
    return `${followerId}_${followingId}`;
}

export function participantMetaFromProfile(p: SocialProfile) {
    return { name: p.displayName, photo: p.photoURL, username: p.username };
}

export function mapConversationPreview(
    id: string,
    viewerUid: string,
    d: {
        participants: string[];
        meta?: Record<string, { name?: string; photo?: string; username?: string }>;
        lastMessage?: string;
        updatedAtMs?: number;
        lastSenderId?: string | null;
        initiatorId?: string | null;
    }
): ConversationPreview {
    const otherUid = d.participants.find((p) => p !== viewerUid) || '';
    const meta = d.meta?.[otherUid] || { name: 'Diák', photo: '', username: '' };
    return {
        id,
        otherUid,
        otherName: meta.name || 'Diák',
        otherPhoto: meta.photo || '',
        lastMessage: d.lastMessage || '',
        updatedAtMs: Number(d.updatedAtMs || 0),
        lastSenderId: String(d.lastSenderId || '').trim() || null,
        initiatorId: String(d.initiatorId || '').trim() || null,
    };
}

/** Kérés: nem követed, de ő írt rád először. */
export function isInboundMessageRequest(
    viewerUid: string,
    conv: { otherUid?: string | null; initiatorId?: string | null; lastSenderId?: string | null },
    followingIds: string[] = []
): boolean {
    const other = String(conv.otherUid || '').trim();
    if (!viewerUid || !other || other === viewerUid) return false;
    if (followingIds.includes(other)) return false;
    const startedBy = String(conv.initiatorId || conv.lastSenderId || '').trim();
    return startedBy === other;
}
