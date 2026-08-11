import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import PostCard, { resolveLikedMap } from '../components/community/PostCard';
import {
    apiCreateGroup,
    apiCreatePost,
    apiEnsureProfile,
    apiFollow,
    apiGetProfile,
    apiIsFollowing,
    apiJoinGroup,
    apiLeaveGroup,
    apiListConversations,
    apiListFeed,
    apiListFollowingIds,
    apiListGroups,
    apiListMessages,
    apiListProfiles,
    apiSendMessage,
    apiUnfollow,
    apiUpdateProfile,
} from '../utils/socialApi';
import {
    FALLBACK_MATH_SHORTS,
    listMathShorts,
    saveMathShort,
} from '../utils/social';
import { conversationIdFor, type ConversationPreview, type DirectMessage, type MathShort, type SocialPost, type SocialProfile, type StudyGroup } from '../utils/socialTypes';
import { backendHealth } from '../utils/backendClient';

type Tab = 'feed' | 'shorts' | 'explore' | 'groups' | 'messages' | 'profile';

function Avatar({ url, name, size = 40 }: { url?: string; name: string; size?: number }) {
    if (url) {
        // eslint-disable-next-line @next/next/no-img-element
        return <img className="mm-social-avatar" style={{ width: size, height: size }} src={url} alt="" />;
    }
    return (
        <span
            className="mm-social-avatar mm-social-avatar-fallback"
            style={{ width: size, height: size, fontSize: size * 0.4 }}
            aria-hidden
        >
            {(name[0] || '?').toUpperCase()}
        </span>
    );
}

export default function CommunityPage() {
    const router = useRouter();
    const [ready, setReady] = useState(false);
    const [uid, setUid] = useState<string | null>(null);
    const [me, setMe] = useState<SocialProfile | null>(null);
    const [rulesBlocked, setRulesBlocked] = useState(false);
    const [tab, setTab] = useState<Tab>('feed');
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
    const [followingIds, setFollowingIds] = useState<string[]>([]);
    const [profiles, setProfiles] = useState<SocialProfile[]>([]);
    const [groups, setGroups] = useState<StudyGroup[]>([]);
    const [conversations, setConversations] = useState<ConversationPreview[]>([]);
    const [activeChat, setActiveChat] = useState<ConversationPreview | null>(null);
    const [messages, setMessages] = useState<DirectMessage[]>([]);
    const [shorts, setShorts] = useState<MathShort[]>([]);
    const [shortIndex, setShortIndex] = useState(0);
    const [viewProfile, setViewProfile] = useState<SocialProfile | null>(null);
    const [followingView, setFollowingView] = useState(false);
    const [toast, setToast] = useState('');
    const [busy, setBusy] = useState(false);

    const [postText, setPostText] = useState('');
    const [groupName, setGroupName] = useState('');
    const [groupDesc, setGroupDesc] = useState('');
    const [groupTopic, setGroupTopic] = useState('');
    const [msgDraft, setMsgDraft] = useState('');
    const [bioDraft, setBioDraft] = useState('');
    const [usernameDraft, setUsernameDraft] = useState('');
    const [shortTopic, setShortTopic] = useState('egyenletek');

    const showToast = (t: string) => {
        setToast(t);
        window.setTimeout(() => setToast(''), 2800);
    };

    useEffect(() => {
        const q = String(router.query.tab || '');
        if (['feed', 'shorts', 'explore', 'groups', 'messages', 'profile'].includes(q)) {
            setTab(q as Tab);
        }
    }, [router.query.tab]);

    const refreshFeed = useCallback(async (userId: string, following: string[]) => {
        const list = await apiListFeed(50);
        // Követettek előre
        if (following.length) {
            const set = new Set([...following, userId]);
            const followed = list.filter((p) => set.has(p.authorId));
            const rest = list.filter((p) => !set.has(p.authorId));
            setPosts([...followed, ...rest]);
            setLikedMap(await resolveLikedMap([...followed, ...rest], userId));
            return;
        }
        setPosts(list);
        setLikedMap(await resolveLikedMap(list, userId));
    }, []);

    const boot = useCallback(async () => {
        const firebase = (window as any).firebase;
        if (!firebase?.auth) {
            setReady(true);
            return;
        }
        const unsub = firebase.auth().onAuthStateChanged(async (user: any) => {
            if (!user) {
                setUid(null);
                setMe(null);
                setReady(true);
                return;
            }
            try {
                setUid(user.uid);
                const profile = await apiEnsureProfile(user.uid);
                setMe(profile);
                setBioDraft(profile.bio);
                setUsernameDraft(profile.username);
                const following = await apiListFollowingIds(user.uid);
                setFollowingIds(following);
                await refreshFeed(user.uid, following);
                const [p, g, c, s, health] = await Promise.all([
                    apiListProfiles(30),
                    apiListGroups(),
                    apiListConversations(user.uid),
                    listMathShorts(20).catch(() => []),
                    backendHealth().catch(() => null),
                ]);
                if (health && (health as any).ok) {
                    console.info('backend health', (health as any).data);
                }
                setProfiles(p);
                setGroups(g);
                setConversations(c);
                if (s.length) {
                    setShorts(s);
                } else {
                    setShorts(
                        FALLBACK_MATH_SHORTS.map((x, i) => ({
                            ...x,
                            id: `fallback-${i}`,
                        }))
                    );
                }
            } catch (e: any) {
                console.error(e);
                const msg = String(e?.message || e || '');
                if (/permission|insufficient|PERMISSION_DENIED|403/i.test(msg)) {
                    setRulesBlocked(true);
                    showToast('Firestore jogosultság hiányzik — telepítsd a rules fájlt.');
                } else {
                    showToast('Nem sikerült betölteni a közösséget.');
                }
            } finally {
                setReady(true);
            }
        });
        return () => unsub?.();
    }, [refreshFeed]);

    useEffect(() => {
        let cleanup: void | (() => void);
        boot().then((c) => {
            cleanup = c;
        });
        return () => {
            if (typeof cleanup === 'function') cleanup();
        };
    }, [boot]);

    const openProfile = async (targetUid: string) => {
        if (!uid) return;
        let p = profiles.find((x) => x.uid === targetUid) || null;
        if (!p) p = await apiGetProfile(targetUid);
        if (!p) {
            showToast('Profil nem található.');
            return;
        }
        setViewProfile(p);
        setFollowingView(await apiIsFollowing(uid, targetUid));
        setTab('profile');
    };

    const startMessage = async (targetUid: string) => {
        if (!me || !uid || targetUid === uid) return;
        let other = profiles.find((p) => p.uid === targetUid) || (await apiGetProfile(targetUid));
        if (!other) {
            showToast('Felhasználó nem található.');
            return;
        }
        const cid = conversationIdFor(uid, targetUid);
        let conv = conversations.find((c) => c.id === cid) || null;
        if (!conv) {
            conv = {
                id: cid,
                otherUid: targetUid,
                otherName: other.displayName,
                otherPhoto: other.photoURL,
                lastMessage: '',
                updatedAtMs: Date.now(),
            };
        }
        setActiveChat(conv);
        setMessages(await apiListMessages(cid).catch(() => []));
        setTab('messages');
    };

    const onCreatePost = async () => {
        if (!me || busy) return;
        setBusy(true);
        try {
            const p = await apiCreatePost(me, postText);
            setPostText('');
            setPosts((prev) => [p, ...prev]);
            showToast('Poszt kint van!');
        } catch (e: any) {
            showToast(e?.message || 'Poszt hiba');
        } finally {
            setBusy(false);
        }
    };

    const onToggleFollow = async (target: SocialProfile) => {
        if (!uid || uid === target.uid || busy) return;
        setBusy(true);
        try {
            const already = await apiIsFollowing(uid, target.uid);
            if (already) {
                await apiUnfollow(uid, target.uid);
                setFollowingIds((ids) => ids.filter((id) => id !== target.uid));
                setFollowingView(false);
                showToast('Követés leállítva');
            } else {
                await apiFollow(uid, target.uid);
                setFollowingIds((ids) => [...ids, target.uid]);
                setFollowingView(true);
                showToast(`Követed: @${target.username}`);
            }
            const fresh = await apiEnsureProfile(uid);
            setMe(fresh);
            setProfiles(await apiListProfiles(30));
        } catch (e: any) {
            showToast(e?.message || 'Követés hiba');
        } finally {
            setBusy(false);
        }
    };

    const onCreateGroup = async () => {
        if (!me || busy) return;
        setBusy(true);
        try {
            const g = await apiCreateGroup(me, groupName, groupDesc, groupTopic);
            setGroups((prev) => [g, ...prev]);
            setGroupName('');
            setGroupDesc('');
            setGroupTopic('');
            showToast('Tanulócsoport létrehozva!');
        } catch (e: any) {
            showToast(e?.message || 'Csoport hiba');
        } finally {
            setBusy(false);
        }
    };

    const onJoinLeave = async (g: StudyGroup) => {
        if (!uid || busy) return;
        setBusy(true);
        try {
            if (g.memberIds.includes(uid)) {
                await apiLeaveGroup(g.id, uid);
                showToast('Kiléptél a csoportból');
            } else {
                await apiJoinGroup(g.id, uid);
                showToast('Csatlakoztál!');
            }
            setGroups(await apiListGroups());
        } catch (e: any) {
            showToast(e?.message || 'Csoport művelet hiba');
        } finally {
            setBusy(false);
        }
    };

    const onSendMsg = async () => {
        if (!me || !uid || !activeChat || !msgDraft.trim() || busy) return;
        setBusy(true);
        try {
            let other =
                profiles.find((p) => p.uid === activeChat.otherUid) ||
                (await apiGetProfile(activeChat.otherUid));
            if (!other) throw new Error('Címzett hiányzik');
            await apiSendMessage(uid, activeChat.otherUid, msgDraft, me, other);
            setMsgDraft('');
            setMessages(await apiListMessages(activeChat.id));
            setConversations(await apiListConversations(uid));
        } catch (e: any) {
            showToast(e?.message || 'Üzenet hiba');
        } finally {
            setBusy(false);
        }
    };

    const onSaveProfile = async () => {
        if (!me || busy) return;
        setBusy(true);
        try {
            await apiUpdateProfile(me.uid, {
                bio: bioDraft,
                username: usernameDraft,
            });
            const fresh = await apiEnsureProfile(me.uid);
            setMe(fresh);
            showToast('Profil mentve');
        } catch (e: any) {
            showToast(e?.message || 'Profil hiba');
        } finally {
            setBusy(false);
        }
    };

    const onGenerateShort = async () => {
        if (!uid || busy) return;
        setBusy(true);
        try {
            const token = await (window as any).firebase?.auth?.()?.currentUser?.getIdToken?.();
            const res = await fetch('/api/generate-math-short', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...(token ? { Authorization: `Bearer ${token}` } : {}),
                },
                body: JSON.stringify({ topic: shortTopic, difficulty: 'közepes' }),
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data?.error || 'Generálás sikertelen');
            const short: MathShort = {
                id: `local-${Date.now()}`,
                topic: data.topic,
                title: data.title,
                hook: data.hook,
                body: data.body,
                tip: data.tip,
                difficulty: data.difficulty || 'közepes',
                createdAtMs: data.createdAtMs || Date.now(),
            };
            try {
                const saved = await saveMathShort({
                    topic: short.topic,
                    title: short.title,
                    hook: short.hook,
                    body: short.body,
                    tip: short.tip,
                    difficulty: short.difficulty,
                    createdAtMs: short.createdAtMs,
                });
                setShorts((prev) => [saved, ...prev]);
                setShortIndex(0);
            } catch {
                setShorts((prev) => [short, ...prev]);
                setShortIndex(0);
            }
            showToast('Új AI matek short kész!');
        } catch (e: any) {
            showToast(e?.message || 'Short hiba');
        } finally {
            setBusy(false);
        }
    };

    const leaderboard = useMemo(
        () => [...profiles].filter((p) => p.showXp).sort((a, b) => b.xp - a.xp).slice(0, 12),
        [profiles]
    );

    const currentShort = shorts[shortIndex] || null;

    if (!ready) {
        return (
            <div className="mm-social-page">
                <p className="mm-social-muted">Közösség betöltése…</p>
            </div>
        );
    }

    if (!uid || !me) {
        return (
            <div className="mm-social-page">
                <Head>
                    <title>Közösség | Mihaszna Matek</title>
                </Head>
                <div className="mm-social-gate">
                    <h1>Mihaszna Közösség</h1>
                    <p>Instagram-szerű matek közösség: posztok, követés, csoportok, üzenetek, AI shorts.</p>
                    <button
                        type="button"
                        className="mm-social-primary"
                        onClick={() => {
                            try {
                                window.dispatchEvent(
                                    new CustomEvent('mihaszna:open-auth-modal', {
                                        detail: { mode: 'login', redirectTo: '/community' },
                                    })
                                );
                            } catch {
                                router.push('/');
                            }
                        }}
                    >
                        Belépés
                    </button>
                    <Link href="/dashboard">Vissza a dashboardra</Link>
                </div>
            </div>
        );
    }

    const profileShown =
        tab === 'profile' ? (viewProfile && viewProfile.uid !== me.uid ? viewProfile : me) : null;

    return (
        <div className="mm-social-page">
            <Head>
                <title>Közösség | Mihaszna Matek</title>
            </Head>

            <header className="mm-social-top">
                <div>
                    <p className="mm-social-kicker">MIHASZNA SOCIAL</p>
                    <h1>Közösség</h1>
                </div>
                <Link href="/dashboard" className="mm-social-ghost">
                    MyMihasznaMat
                </Link>
            </header>

            {rulesBlocked && (
                <div className="mm-social-rules-banner" role="alert">
                    <strong>Firestore rules nincs telepítve</strong>
                    <p>
                        A közösséghez másold be a projekt <code>firestore.rules</code> tartalmát ide:
                        Firebase Console → Firestore Database → Rules → Publish.
                        Enélkül a poszt / követés / profil írás tiltva marad.
                    </p>
                </div>
            )}

            <nav className="mm-social-tabs" aria-label="Közösség menü">
                {(
                    [
                        ['feed', 'Feed'],
                        ['shorts', 'Shorts'],
                        ['explore', 'Felfedezés'],
                        ['groups', 'Csoportok'],
                        ['messages', 'Üzenetek'],
                        ['profile', 'Profil'],
                    ] as const
                ).map(([id, label]) => (
                    <button
                        key={id}
                        type="button"
                        className={tab === id ? 'is-on' : ''}
                        onClick={() => {
                            if (id === 'profile') setViewProfile(me);
                            setTab(id);
                        }}
                    >
                        {label}
                    </button>
                ))}
            </nav>

            {tab === 'feed' && (
                <section className="mm-social-panel">
                    <div className="mm-social-compose">
                        <Avatar url={me.photoURL} name={me.displayName} />
                        <textarea
                            value={postText}
                            onChange={(e) => setPostText(e.target.value)}
                            placeholder="Mi a matek hangulat? Ossz meg egy tippet, sikert, kérdést…"
                            maxLength={500}
                            rows={3}
                        />
                        <button type="button" className="mm-social-primary" onClick={onCreatePost} disabled={busy}>
                            Posztolás
                        </button>
                    </div>
                    <div className="mm-social-feed">
                        {posts.length === 0 && <p className="mm-social-muted">Még nincs poszt — légy te az első!</p>}
                        {posts.map((p) => (
                            <PostCard
                                key={p.id}
                                post={p}
                                me={me}
                                liked={!!likedMap[p.id]}
                                onOpenProfile={openProfile}
                                onMessage={startMessage}
                                onChanged={(next) =>
                                    setPosts((prev) => prev.map((x) => (x.id === next.id ? next : x)))
                                }
                            />
                        ))}
                    </div>
                </section>
            )}

            {tab === 'shorts' && (
                <section className="mm-social-panel">
                    <div className="mm-social-shorts-toolbar">
                        <input
                            value={shortTopic}
                            onChange={(e) => setShortTopic(e.target.value)}
                            placeholder="Téma (pl. deriválás)"
                        />
                        <button type="button" className="mm-social-primary" onClick={onGenerateShort} disabled={busy}>
                            AI short generálás
                        </button>
                    </div>
                    {currentShort ? (
                        <div className="mm-social-short-card">
                            <p className="mm-social-short-topic">
                                {currentShort.topic} · {currentShort.difficulty}
                            </p>
                            <h2>{currentShort.title}</h2>
                            <p className="mm-social-short-hook">{currentShort.hook}</p>
                            <p className="mm-social-short-body">{currentShort.body}</p>
                            <p className="mm-social-short-tip">Tipp: {currentShort.tip}</p>
                            <div className="mm-social-short-nav">
                                <button
                                    type="button"
                                    disabled={shortIndex <= 0}
                                    onClick={() => setShortIndex((i) => Math.max(0, i - 1))}
                                >
                                    ↑ Előző
                                </button>
                                <span>
                                    {shortIndex + 1}/{shorts.length}
                                </span>
                                <button
                                    type="button"
                                    disabled={shortIndex >= shorts.length - 1}
                                    onClick={() => setShortIndex((i) => Math.min(shorts.length - 1, i + 1))}
                                >
                                    Következő ↓
                                </button>
                            </div>
                        </div>
                    ) : (
                        <p className="mm-social-muted">Generálj egy AI matek shortot!</p>
                    )}
                </section>
            )}

            {tab === 'explore' && (
                <section className="mm-social-panel">
                    <h2>XP ranglista</h2>
                    <p className="mm-social-muted">Lásd egymás pontjait — aki megosztja az XP-jét.</p>
                    <div className="mm-social-leaderboard">
                        {leaderboard.map((p, i) => (
                            <button
                                key={p.uid}
                                type="button"
                                className="mm-social-leader-row"
                                onClick={() => openProfile(p.uid)}
                            >
                                <span className="mm-social-rank">#{i + 1}</span>
                                <Avatar url={p.photoURL} name={p.displayName} size={36} />
                                <span className="mm-social-leader-meta">
                                    <strong>{p.displayName}</strong>
                                    <small>
                                        @{p.username} · {p.rank}
                                    </small>
                                </span>
                                <strong className="mm-social-xp">{p.xp} XP</strong>
                            </button>
                        ))}
                    </div>
                    <h2>Diákok</h2>
                    <div className="mm-social-people">
                        {profiles.map((p) => (
                            <div key={p.uid} className="mm-social-person">
                                <button type="button" className="mm-social-userbtn" onClick={() => openProfile(p.uid)}>
                                    <Avatar url={p.photoURL} name={p.displayName} />
                                    <span>
                                        <strong>{p.displayName}</strong>
                                        <small>
                                            @{p.username}
                                            {p.showXp ? ` · ${p.xp} XP` : ''}
                                        </small>
                                    </span>
                                </button>
                                {p.uid !== me.uid && (
                                    <button
                                        type="button"
                                        className="mm-social-ghost"
                                        onClick={() => onToggleFollow(p)}
                                        disabled={busy}
                                    >
                                        {followingIds.includes(p.uid) ? 'Követed' : 'Követés'}
                                    </button>
                                )}
                            </div>
                        ))}
                    </div>
                </section>
            )}

            {tab === 'groups' && (
                <section className="mm-social-panel">
                    <div className="mm-social-compose mm-social-compose-stack">
                        <h2>Új tanulócsoport</h2>
                        <input value={groupName} onChange={(e) => setGroupName(e.target.value)} placeholder="Csoport neve" maxLength={60} />
                        <input value={groupTopic} onChange={(e) => setGroupTopic(e.target.value)} placeholder="Téma (pl. érettségi)" maxLength={60} />
                        <textarea value={groupDesc} onChange={(e) => setGroupDesc(e.target.value)} placeholder="Rövid leírás" maxLength={200} rows={2} />
                        <button type="button" className="mm-social-primary" onClick={onCreateGroup} disabled={busy}>
                            Létrehozás
                        </button>
                    </div>
                    <div className="mm-social-groups">
                        {groups.map((g) => (
                            <article key={g.id} className="mm-social-group">
                                <h3>{g.name}</h3>
                                <p>{g.description || 'Nincs leírás'}</p>
                                <small>
                                    {g.topic || 'Általános'} · {g.memberCount} tag · {g.ownerName}
                                </small>
                                <button type="button" className="mm-social-ghost" onClick={() => onJoinLeave(g)} disabled={busy || g.ownerId === uid}>
                                    {g.memberIds.includes(uid) ? (g.ownerId === uid ? 'Tulajdonos' : 'Kilépés') : 'Csatlakozás'}
                                </button>
                            </article>
                        ))}
                    </div>
                </section>
            )}

            {tab === 'messages' && (
                <section className="mm-social-panel mm-social-messages">
                    <div className="mm-social-inbox">
                        <h2>Bejövő</h2>
                        {conversations.length === 0 && <p className="mm-social-muted">Még nincs beszélgetés.</p>}
                        {conversations.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                className={`mm-social-inbox-row ${activeChat?.id === c.id ? 'is-on' : ''}`}
                                onClick={async () => {
                                    setActiveChat(c);
                                    setMessages(await apiListMessages(c.id));
                                }}
                            >
                                <Avatar url={c.otherPhoto} name={c.otherName} size={36} />
                                <span>
                                    <strong>{c.otherName}</strong>
                                    <small>{c.lastMessage || 'Új chat'}</small>
                                </span>
                            </button>
                        ))}
                    </div>
                    <div className="mm-social-thread">
                        {activeChat ? (
                            <>
                                <header>
                                    <strong>{activeChat.otherName}</strong>
                                </header>
                                <div className="mm-social-thread-list">
                                    {messages.map((m) => (
                                        <div
                                            key={m.id}
                                            className={`mm-social-bubble ${m.senderId === uid ? 'mine' : ''}`}
                                        >
                                            {m.text}
                                        </div>
                                    ))}
                                </div>
                                <div className="mm-social-comment-compose">
                                    <input
                                        value={msgDraft}
                                        onChange={(e) => setMsgDraft(e.target.value)}
                                        placeholder="Üzenet…"
                                        maxLength={500}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') onSendMsg();
                                        }}
                                    />
                                    <button type="button" onClick={onSendMsg} disabled={busy || !msgDraft.trim()}>
                                        Küld
                                    </button>
                                </div>
                            </>
                        ) : (
                            <p className="mm-social-muted">Válassz beszélgetést, vagy írj valakinek a feedről / felfedezésből.</p>
                        )}
                    </div>
                </section>
            )}

            {tab === 'profile' && profileShown && (
                <section className="mm-social-panel">
                    <div className="mm-social-profile-hero">
                        <Avatar url={profileShown.photoURL} name={profileShown.displayName} size={84} />
                        <div>
                            <h2>{profileShown.displayName}</h2>
                            <p>@{profileShown.username}</p>
                            <p className="mm-social-muted">{profileShown.bio || 'Még nincs bio.'}</p>
                            <div className="mm-social-stats">
                                <span>
                                    <strong>{profileShown.postCount}</strong> poszt
                                </span>
                                <span>
                                    <strong>{profileShown.followerCount}</strong> követő
                                </span>
                                <span>
                                    <strong>{profileShown.followingCount}</strong> követés
                                </span>
                                {profileShown.showXp && (
                                    <span>
                                        <strong>{profileShown.xp}</strong> XP · {profileShown.rank}
                                    </span>
                                )}
                            </div>
                            {profileShown.uid !== me.uid ? (
                                <div className="mm-social-profile-actions">
                                    <button type="button" className="mm-social-primary" onClick={() => onToggleFollow(profileShown)} disabled={busy}>
                                        {followingView ? 'Követed' : 'Követés'}
                                    </button>
                                    <button type="button" className="mm-social-ghost" onClick={() => startMessage(profileShown.uid)}>
                                        Üzenet
                                    </button>
                                </div>
                            ) : (
                                <div className="mm-social-compose mm-social-compose-stack">
                                    <h3>Saját profil szerkesztése</h3>
                                    <input value={usernameDraft} onChange={(e) => setUsernameDraft(e.target.value)} placeholder="Felhasználónév" maxLength={20} />
                                    <textarea value={bioDraft} onChange={(e) => setBioDraft(e.target.value)} placeholder="Bio" maxLength={160} rows={2} />
                                    <button type="button" className="mm-social-primary" onClick={onSaveProfile} disabled={busy}>
                                        Mentés
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {toast && <div className="mm-social-toast">{toast}</div>}
        </div>
    );
}
