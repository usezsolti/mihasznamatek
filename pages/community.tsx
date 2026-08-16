import Head from 'next/head';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CommunityAvatar from '../components/community/CommunityAvatar';
import CommunityChatDock from '../components/community/CommunityChatDock';
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
import { useLang } from '../utils/i18n';

export default function CommunityPage() {
    const router = useRouter();
    const { t } = useLang();
    const { data: session, status: authStatus } = useSession();
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
    const [chatDockOpen, setChatDockOpen] = useState(false);
    const [messages, setMessages] = useState<DirectMessage[]>([]);
    const [shorts, setShorts] = useState<MathShort[]>([]);
    const [shortIndex, setShortIndex] = useState(0);
    const [viewProfile, setViewProfile] = useState<SocialProfile | null>(null);
    const [followingView, setFollowingView] = useState(false);
    const [toast, setToast] = useState('');
    const [busy, setBusy] = useState(false);

    const [postText, setPostText] = useState('');
    const [mediaFile, setMediaFile] = useState<File | null>(null);
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
        if (authStatus === 'loading') return;

        let cancelled = false;

        if (!session?.user?.id) {
            setUid(null);
            setMe(null);
            setReady(true);
            return;
        }

        const userId = session.user.id;
        (async () => {
            try {
                setUid(userId);
                const profile = await apiEnsureProfile(userId);
                if (cancelled) return;
                setMe(profile);
                setBioDraft(profile.bio);
                setUsernameDraft(profile.username);
                const following = await apiListFollowingIds(userId);
                if (cancelled) return;
                setFollowingIds(following);
                await refreshFeed(userId, following);
                if (cancelled) return;
                const [p, g, c, s, health] = await Promise.all([
                    apiListProfiles(30),
                    apiListGroups(),
                    apiListConversations(userId),
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
                    showToast(t('community.toast.rulesMissing'));
                    try {
                        await apiSocialDiag();
                    } catch {
                        /* diag best-effort */
                    }
                } else {
                    showToast(t('community.toast.loadFailed'));
                }
            } finally {
                if (!cancelled) setReady(true);
            }
        })();

        return () => {
            cancelled = true;
        };
    }, [refreshFeed, authStatus, session?.user?.id, t]);

    const openProfile = async (targetUid: string) => {
        if (!uid) return;
        let p = profiles.find((x) => x.uid === targetUid) || null;
        if (!p) p = await apiGetProfile(targetUid);
        if (!p) {
            showToast(t('community.toast.profileNotFound'));
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
            showToast(t('community.toast.userNotFound'));
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
        setChatDockOpen(true);
    };

    const onCreatePost = async () => {
        if (!me || busy) return;
        if (!postText.trim() && !mediaFile) {
            showToast(t('community.toast.postNeedsContent'));
            return;
        }
        setBusy(true);
        try {
            let imageUrl: string | null = null;
            let videoUrl: string | null = null;
            if (mediaFile) {
                showToast(t('community.toast.mediaUploading'));
                const { uploadSocialMedia } = await import('../utils/socialMediaUpload');
                const uploaded = await uploadSocialMedia(mediaFile, me.uid);
                if (uploaded.kind === 'video') videoUrl = uploaded.url;
                else imageUrl = uploaded.url;
            }
            const p = await apiCreatePost(me, postText, { imageUrl, videoUrl });
            setPostText('');
            setMediaFile(null);
            setPosts((prev) => [p, ...prev]);
            showToast(t('community.toast.postPublished'));
        } catch (e: any) {
            showToast(e?.message || t('community.toast.postError'));
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
                showToast(t('community.toast.unfollowed'));
            } else {
                await apiFollow(uid, target.uid);
                setFollowingIds((ids) => [...ids, target.uid]);
                setFollowingView(true);
                showToast(t('community.toast.followingUser', { username: target.username }));
            }
            const fresh = await apiEnsureProfile(uid);
            setMe(fresh);
            setProfiles(await apiListProfiles(30));
        } catch (e: any) {
            showToast(e?.message || t('community.toast.followError'));
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
            showToast(t('community.toast.groupCreated'));
        } catch (e: any) {
            showToast(e?.message || t('community.toast.groupError'));
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
                showToast(t('community.toast.leftGroup'));
            } else {
                await apiJoinGroup(g.id, uid);
                showToast(t('community.toast.joinedGroup'));
            }
            setGroups(await apiListGroups());
        } catch (e: any) {
            showToast(e?.message || t('community.toast.groupActionError'));
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
            if (!other) throw new Error(t('community.toast.recipientMissing'));
            await apiSendMessage(uid, activeChat.otherUid, msgDraft, me, other);
            setMsgDraft('');
            setMessages(await apiListMessages(activeChat.id));
            setConversations(await apiListConversations(uid));
        } catch (e: any) {
            showToast(e?.message || t('community.toast.messageError'));
        } finally {
            setBusy(false);
        }
    };

    const onSelectConversation = async (c: ConversationPreview) => {
        setActiveChat(c);
        setMessages(await apiListMessages(c.id).catch(() => []));
    };

    // Live-ish DMs: poll while Messages tab or floating chat dock is open
    useEffect(() => {
        if (!uid) return;
        if (tab !== 'messages' && !chatDockOpen) return;
        let cancelled = false;
        const tick = async () => {
            try {
                const convs = await apiListConversations(uid);
                if (!cancelled) setConversations(convs);
                if (activeChat?.id) {
                    const msgs = await apiListMessages(activeChat.id);
                    if (!cancelled) setMessages(msgs);
                }
            } catch {
                /* ignore transient poll errors */
            }
        };
        void tick();
        const id = window.setInterval(tick, 3500);
        return () => {
            cancelled = true;
            window.clearInterval(id);
        };
    }, [tab, uid, activeChat?.id, chatDockOpen]);

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
            showToast(t('community.toast.profileSaved'));
        } catch (e: any) {
            showToast(e?.message || t('community.toast.profileError'));
        } finally {
            setBusy(false);
        }
    };

    const onGenerateShort = async () => {
        if (!uid || busy) return;
        setBusy(true);
        try {
            const res = await apiGenerateMathShort(shortTopic, 'közepes');
            if (!res.ok) throw new Error(res.error || t('community.toast.generateFailed'));
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
            showToast(t('community.toast.shortCreated'));
        } catch (e: any) {
            showToast(e?.message || t('community.toast.shortError'));
        } finally {
            setBusy(false);
        }
    };

    const leaderboard = useMemo(
        () => [...profiles].filter((p) => p.showXp).sort((a, b) => b.xp - a.xp).slice(0, 12),
        [profiles]
    );

    const storyProfiles = useMemo(() => {
        const myUid = me?.uid;
        if (!myUid) return [];
        const followed = profiles.filter((p) => followingIds.includes(p.uid) && p.uid !== myUid);
        const rest = profiles.filter((p) => !followingIds.includes(p.uid) && p.uid !== myUid);
        return [...followed, ...rest].slice(0, 12);
    }, [profiles, followingIds, me?.uid]);

    const suggested = useMemo(() => {
        const myUid = me?.uid;
        if (!myUid) return [];
        return profiles.filter((p) => p.uid !== myUid && !followingIds.includes(p.uid)).slice(0, 5);
    }, [profiles, followingIds, me?.uid]);

    const currentShort = shorts[shortIndex] || null;

    if (!ready) {
        return (
            <div className="mm-social-page mm-ig-shell mm-ig-boot">
                <Head>
                    <title>MihaSocial | Mihaszna Matek</title>
                </Head>
                <div className="mm-ig-boot-stage" aria-busy="true" aria-live="polite">
                    <div className="mm-ig-boot-glow" aria-hidden />
                    <div className="mm-ig-boot-orbit" aria-hidden>
                        <span />
                        <span />
                        <span />
                    </div>
                    <div className="mm-ig-boot-mark">
                        <div className="mm-ig-boot-ring">
                            <span className="mm-ig-boot-logo">M</span>
                        </div>
                        <h1 className="mm-ig-boot-title">MihaSocial</h1>
                        <p className="mm-ig-boot-sub">{t('community.loading')}</p>
                    </div>
                    <div className="mm-ig-boot-bar" aria-hidden>
                        <span />
                    </div>
                    <ul className="mm-ig-boot-dots" aria-hidden>
                        <li />
                        <li />
                        <li />
                    </ul>
                </div>
            </div>
        );
    }

    if (!uid || !me) {
        return (
            <div className="mm-social-page">
                <Head>
                    <title>MihaSocial | Mihaszna Matek</title>
                </Head>
                <div className="mm-social-gate">
                    <h1 className="mm-ig-wordmark">MihaSocial</h1>
                    <p>{t('community.gate.desc')}</p>
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
                        {t('community.gate.login')}
                    </button>
                    <Link href="/dashboard">{t('community.gate.backDashboard')}</Link>
                </div>
            </div>
        );
    }

    const profileShown =
        tab === 'profile' ? (viewProfile && viewProfile.uid !== me.uid ? viewProfile : me) : null;

    const navItems = [
        ['feed', t('community.tab.feed')],
        ['explore', t('community.tab.explore')],
        ['shorts', t('community.tab.shorts')],
        ['messages', t('community.tab.messages')],
        ['groups', t('community.tab.groups')],
        ['profile', t('community.tab.profile')],
    ] as const;

    return (
        <div
            className={`mm-social-page mm-ig-shell${tab === 'messages' ? ' is-messages' : ''}${
                tab === 'feed' ? ' is-feed' : ''
            }${tab === 'profile' ? ' is-profile' : ''}`}
        >
            <Head>
                <title>MihaSocial | Mihaszna Matek</title>
            </Head>

            <aside className="mm-ig-nav" aria-label={t('community.nav.ariaLabel')}>
                <div className="mm-ig-nav-brand">
                    <span className="mm-ig-wordmark">MihaSocial</span>
                </div>
                <nav className="mm-ig-nav-list">
                    {navItems.map(([id, label]) => (
                        <button
                            key={id}
                            type="button"
                            className={`mm-ig-nav-item${tab === id ? ' is-on' : ''}`}
                            onClick={() => {
                                if (id === 'profile') setViewProfile(me);
                                setTab(id);
                            }}
                        >
                            <span className={`mm-ig-ico mm-ig-ico--${id}`} aria-hidden />
                            <span className="mm-ig-nav-label">{label}</span>
                        </button>
                    ))}
                </nav>
                <Link href="/dashboard" className="mm-ig-nav-item mm-ig-nav-dash">
                    <span className="mm-ig-ico mm-ig-ico--more" aria-hidden />
                    <span className="mm-ig-nav-label">{t('community.nav.dashboard')}</span>
                </Link>
            </aside>

            <div className="mm-ig-center">
                {rulesBlocked && (
                    <div className="mm-social-rules-banner" role="alert">
                        <strong>{t('community.rules.title')}</strong>
                        <p>{t('community.rules.body')}</p>
                        <button
                            type="button"
                            className="mm-social-ghost"
                            style={{ marginTop: '0.65rem' }}
                            onClick={async () => {
                                try {
                                    const res = await apiSocialDiag();
                                    if (!res.ok) {
                                        showToast(res.error || t('community.toast.diagError'));
                                        return;
                                    }
                                    showToast(
                                        res.data?.ok
                                            ? t('community.toast.diagOk')
                                            : t('community.toast.diagFail', {
                                                  step: String(res.data?.step || ''),
                                                  error: String(res.data?.error || '').slice(0, 120),
                                              })
                                    );
                                    if (res.data?.ok) {
                                        setRulesBlocked(false);
                                        window.location.reload();
                                    }
                                } catch (e: any) {
                                    showToast(e?.message || t('community.toast.diagError'));
                                }
                            }}
                        >
                            {t('community.rules.runDiag')}
                        </button>
                    </div>
                )}

                <div className="mm-social-main">
                    {tab === 'feed' && (
                        <CommunityFeedTab
                            me={me}
                            postText={postText}
                            onPostTextChange={setPostText}
                            mediaFile={mediaFile}
                            onMediaFileChange={setMediaFile}
                            onCreatePost={onCreatePost}
                            busy={busy}
                            posts={posts}
                            likedMap={likedMap}
                            followingIds={followingIds}
                            storyProfiles={storyProfiles}
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
                            onMessage={startMessage}
                        />
                    )}

                    {tab === 'groups' && (
                        <CommunityGroupsTab
                            uid={uid}
                            me={me}
                            groupName={groupName}
                            groupTopic={groupTopic}
                            groupDesc={groupDesc}
                            onGroupNameChange={setGroupName}
                            onGroupTopicChange={setGroupTopic}
                            onGroupDescChange={setGroupDesc}
                            onCreateGroup={onCreateGroup}
                            groups={groups}
                            onJoinLeave={onJoinLeave}
                            onGroupUpdated={(next) =>
                                setGroups((prev) => prev.map((g) => (g.id === next.id ? next : g)))
                            }
                            onToast={showToast}
                            busy={busy}
                        />
                    )}

                    {tab === 'messages' && (
                        <CommunityMessagesTab
                            uid={uid}
                            me={me}
                            conversations={conversations}
                            activeChat={activeChat}
                            messages={messages}
                            msgDraft={msgDraft}
                            onMsgDraftChange={setMsgDraft}
                            onSelectConversation={onSelectConversation}
                            onBackToInbox={() => setActiveChat(null)}
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
                            posts={posts.filter((p) => p.authorId === profileShown.uid)}
                            likedMap={likedMap}
                            onUsernameDraftChange={setUsernameDraft}
                            onBioDraftChange={setBioDraft}
                            onToggleFollow={onToggleFollow}
                            onStartMessage={startMessage}
                            onSaveProfile={onSaveProfile}
                            onOpenProfile={openProfile}
                            onMessage={startMessage}
                            onPostChanged={(next) =>
                                setPosts((prev) => prev.map((x) => (x.id === next.id ? next : x)))
                            }
                        />
                    )}
                </div>
            </div>

            {tab === 'feed' && (
                <aside className="mm-ig-rail" aria-label={t('community.rail.ariaLabel')}>
                    <div className="mm-ig-rail-me">
                        <button type="button" className="mm-social-userbtn" onClick={() => openProfile(me.uid)}>
                            <CommunityAvatar url={me.photoURL} name={me.displayName} size={44} />
                            <span>
                                <strong>{me.username || me.displayName}</strong>
                                <small>{me.displayName}</small>
                            </span>
                        </button>
                        <Link href="/dashboard" className="mm-ig-link">
                            {t('community.rail.switch')}
                        </Link>
                    </div>

                    <div className="mm-ig-rail-head">
                        <span>{t('community.rail.suggested')}</span>
                        <button type="button" className="mm-ig-link" onClick={() => setTab('explore')}>
                            {t('community.rail.seeAll')}
                        </button>
                    </div>

                    <div className="mm-ig-suggest-list">
                        {suggested.length === 0 && <p className="mm-social-muted">{t('community.rail.noSuggestions')}</p>}
                        {suggested.map((p) => (
                            <div key={p.uid} className="mm-ig-suggest-row">
                                <button
                                    type="button"
                                    className="mm-social-userbtn"
                                    onClick={() => openProfile(p.uid)}
                                >
                                    <CommunityAvatar url={p.photoURL} name={p.displayName} size={36} />
                                    <span>
                                        <strong>{p.username || p.displayName}</strong>
                                        <small>{p.rank || t('community.rank.student')}</small>
                                    </span>
                                </button>
                                <button
                                    type="button"
                                    className="mm-ig-link"
                                    disabled={busy}
                                    onClick={() => onToggleFollow(p)}
                                >
                                    {t('community.rail.follow')}
                                </button>
                            </div>
                        ))}
                    </div>

                    <p className="mm-ig-rail-foot">{t('community.rail.footer')}</p>
                </aside>
            )}

            <nav className="mm-social-tabs mm-ig-bottom" role="navigation" aria-label={t('community.nav.menu')}>
                {navItems.map(([id, label]) => (
                    <button
                        key={id}
                        type="button"
                        className={tab === id ? 'is-on' : ''}
                        onClick={() => {
                            if (id === 'profile') setViewProfile(me);
                            setTab(id);
                        }}
                    >
                        <span className={`mm-ig-ico mm-ig-ico--${id}`} aria-hidden />
                        <span className="mm-social-tab-label">{label}</span>
                    </button>
                ))}
            </nav>

            {chatDockOpen && activeChat && tab !== 'messages' && (
                <CommunityChatDock
                    uid={uid}
                    peer={activeChat}
                    messages={messages}
                    msgDraft={msgDraft}
                    onMsgDraftChange={setMsgDraft}
                    onSend={onSendMsg}
                    busy={busy}
                    onClose={() => setChatDockOpen(false)}
                    onExpand={() => {
                        setChatDockOpen(false);
                        setTab('messages');
                    }}
                />
            )}

            {toast && <div className="mm-social-toast">{toast}</div>}
        </div>
    );
}
