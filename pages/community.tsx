import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CommunityExploreTab from '../components/community/CommunityExploreTab';
import CommunityFeedTab from '../components/community/CommunityFeedTab';
import CommunityGroupsTab from '../components/community/CommunityGroupsTab';
import CommunityMessagesTab from '../components/community/CommunityMessagesTab';
import CommunityProfileTab from '../components/community/CommunityProfileTab';
import CommunityShortsTab from '../components/community/CommunityShortsTab';
import { resolveLikedMap } from '../components/community/CommunityPostCard';
import type { CommunityTab } from '../components/community/types';
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
import { apiGenerateMathShort, apiSocialDiag } from '../utils/apiClient';
import {
    FALLBACK_MATH_SHORTS,
    listMathShorts,
    saveMathShort,
} from '../utils/social';
import {
    conversationIdFor,
    type ConversationPreview,
    type DirectMessage,
    type MathShort,
    type SocialPost,
    type SocialProfile,
    type StudyGroup,
} from '../utils/socialTypes';
import { backendHealth } from '../utils/backendClient';

export default function CommunityPage() {
    const router = useRouter();
    const [ready, setReady] = useState(false);
    const [uid, setUid] = useState<string | null>(null);
    const [me, setMe] = useState<SocialProfile | null>(null);
    const [rulesBlocked, setRulesBlocked] = useState(false);
    const [tab, setTab] = useState<CommunityTab>('feed');
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
            setTab(q as CommunityTab);
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

    useEffect(() => {
        document.body.classList.add('mm-social-body');
        return () => document.body.classList.remove('mm-social-body');
    }, []);

    useEffect(() => {
        let cancelled = false;
        const firebase = (window as any).firebase;
        if (!firebase?.auth) {
            setReady(true);
            return;
        }

        const unsub = firebase.auth().onAuthStateChanged(async (user: any) => {
            if (cancelled) return;
            if (!user) {
                setUid(null);
                setMe(null);
                setReady(true);
                return;
            }
            try {
                setUid(user.uid);
                const profile = await apiEnsureProfile(user.uid);
                if (cancelled) return;
                setMe(profile);
                setBioDraft(profile.bio);
                setUsernameDraft(profile.username);
                const following = await apiListFollowingIds(user.uid);
                if (cancelled) return;
                setFollowingIds(following);
                await refreshFeed(user.uid, following);
                if (cancelled) return;
                const [p, g, c, s, health] = await Promise.all([
                    apiListProfiles(30),
                    apiListGroups(),
                    apiListConversations(user.uid),
                    listMathShorts(20).catch(() => []),
                    backendHealth().catch(() => null),
                ]);
                if (cancelled) return;
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
                if (cancelled) return;
                console.error(e);
                const msg = String(e?.message || e || '');
                if (/permission|insufficient|PERMISSION_DENIED|403/i.test(msg)) {
                    setRulesBlocked(true);
                    showToast('Firestore jogosultság hiányzik — telepítsd a rules fájlt.');
                    try {
                        await apiSocialDiag();
                    } catch {
                        /* diag best-effort */
                    }
                } else {
                    showToast('Nem sikerült betölteni a közösséget.');
                }
            } finally {
                if (!cancelled) setReady(true);
            }
        });

        return () => {
            cancelled = true;
            unsub?.();
        };
    }, [refreshFeed]);

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

    const onSelectConversation = async (c: ConversationPreview) => {
        setActiveChat(c);
        setMessages(await apiListMessages(c.id));
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
            const res = await apiGenerateMathShort(shortTopic, 'közepes');
            if (!res.ok) throw new Error(res.error || 'Generálás sikertelen');
            const shortPayload = res.data;
            const short: MathShort = {
                id: `local-${Date.now()}`,
                topic: shortPayload.topic,
                title: shortPayload.title,
                hook: shortPayload.hook,
                body: shortPayload.body,
                tip: shortPayload.tip,
                difficulty: shortPayload.difficulty || 'közepes',
                createdAtMs: shortPayload.createdAtMs || Date.now(),
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

            <div className="mm-social-top">
                <div>
                    <p className="mm-social-kicker">MIHASZNA SOCIAL</p>
                    <h1>Közösség</h1>
                </div>
                <Link href="/dashboard" className="mm-social-ghost">
                    MyMihasznaMat
                </Link>
            </div>

            {rulesBlocked && (
                <div className="mm-social-rules-banner" role="alert">
                    <strong>Firestore rules nincs telepítve (vagy hibás)</strong>
                    <p>
                        A közösség <code>socialProfiles</code> / <code>posts</code> gyűjteményeihez
                        Publish kell.{' '}
                        <a href="/rules-setup">Nyisd meg a Rules setup oldalt</a> (egy kattintásos másolás +
                        diagnosztika), majd Firebase Console → <strong>Publish</strong>.
                    </p>
                    <button
                        type="button"
                        className="mm-social-ghost"
                        style={{ marginTop: '0.65rem' }}
                        onClick={async () => {
                            try {
                                const res = await apiSocialDiag();
                                if (!res.ok) {
                                    showToast(res.error || 'Diag hiba');
                                    return;
                                }
                                showToast(
                                    res.data?.ok
                                        ? 'Diag OK — rules rendben'
                                        : `Diag FAIL (${res.data?.step}): ${String(res.data?.error || '').slice(0, 120)}`
                                );
                                if (res.data?.ok) {
                                    setRulesBlocked(false);
                                    window.location.reload();
                                }
                            } catch (e: any) {
                                showToast(e?.message || 'Diag hiba');
                            }
                        }}
                    >
                        Rules diagnosztika futtatása
                    </button>
                </div>
            )}

            <div className="mm-social-tabs" role="navigation" aria-label="Közösség menü">
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
            </div>

            {tab === 'feed' && (
                <CommunityFeedTab
                    me={me}
                    postText={postText}
                    onPostTextChange={setPostText}
                    onCreatePost={onCreatePost}
                    busy={busy}
                    posts={posts}
                    likedMap={likedMap}
                    onOpenProfile={openProfile}
                    onMessage={startMessage}
                    onPostChanged={(next) =>
                        setPosts((prev) => prev.map((x) => (x.id === next.id ? next : x)))
                    }
                />
            )}

            {tab === 'shorts' && (
                <CommunityShortsTab
                    shortTopic={shortTopic}
                    onShortTopicChange={setShortTopic}
                    onGenerateShort={onGenerateShort}
                    busy={busy}
                    currentShort={currentShort}
                    shortIndex={shortIndex}
                    shortsLength={shorts.length}
                    onPrev={() => setShortIndex((i) => Math.max(0, i - 1))}
                    onNext={() => setShortIndex((i) => Math.min(shorts.length - 1, i + 1))}
                />
            )}

            {tab === 'explore' && (
                <CommunityExploreTab
                    me={me}
                    leaderboard={leaderboard}
                    profiles={profiles}
                    followingIds={followingIds}
                    busy={busy}
                    onOpenProfile={openProfile}
                    onToggleFollow={onToggleFollow}
                />
            )}

            {tab === 'groups' && (
                <CommunityGroupsTab
                    uid={uid}
                    groupName={groupName}
                    groupTopic={groupTopic}
                    groupDesc={groupDesc}
                    onGroupNameChange={setGroupName}
                    onGroupTopicChange={setGroupTopic}
                    onGroupDescChange={setGroupDesc}
                    onCreateGroup={onCreateGroup}
                    groups={groups}
                    onJoinLeave={onJoinLeave}
                    busy={busy}
                />
            )}

            {tab === 'messages' && (
                <CommunityMessagesTab
                    uid={uid}
                    conversations={conversations}
                    activeChat={activeChat}
                    messages={messages}
                    msgDraft={msgDraft}
                    onMsgDraftChange={setMsgDraft}
                    onSelectConversation={onSelectConversation}
                    onSendMsg={onSendMsg}
                    busy={busy}
                />
            )}

            {tab === 'profile' && profileShown && (
                <CommunityProfileTab
                    me={me}
                    profileShown={profileShown}
                    followingView={followingView}
                    busy={busy}
                    usernameDraft={usernameDraft}
                    bioDraft={bioDraft}
                    onUsernameDraftChange={setUsernameDraft}
                    onBioDraftChange={setBioDraft}
                    onToggleFollow={onToggleFollow}
                    onStartMessage={startMessage}
                    onSaveProfile={onSaveProfile}
                />
            )}

            {toast && <div className="mm-social-toast">{toast}</div>}
        </div>
    );
}
