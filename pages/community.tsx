import Head from 'next/head';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useMemo, useState } from 'react';
import CommunityAvatar from '../components/community/CommunityAvatar';
import CommunityChatDock from '../components/community/CommunityChatDock';
import CommunityExploreTab from '../components/community/CommunityExploreTab';
import CommunityFeedTab from '../components/community/CommunityFeedTab';
import CommunityGroupsTab from '../components/community/CommunityGroupsTab';
import CommunityMessagesTab from '../components/community/CommunityMessagesTab';
import CommunityProfileTab from '../components/community/CommunityProfileTab';
import CommunityReviewTab from '../components/community/CommunityReviewTab';
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
    apiListPendingPosts,
    apiListUserPosts,
    apiPurgeSocialJunk,
    apiReviewPost,
    apiListFollowingIds,
    apiListGroups,
    apiListMessages,
    apiListProfiles,
    apiReactToMessage,
    apiSendMessage,
    apiUnfollow,
    apiUpdateProfile,
} from '../utils/socialApi';
import { apiSocialDiag } from '../utils/apiClient';
import {
    conversationIdFor,
    type ConversationPreview,
    type DirectMessage,
    type SocialPost,
    type SocialProfile,
    type StudyGroup,
} from '../utils/socialTypes';
import { applyFeedRefresh, buildDailyStoryProfiles, isPlaceholderSocialProfile, isPublicSocialPost, toggleMessageReaction } from '../utils/socialDomain';
import { isAdminEmail } from '../utils/admin';
import { backendHealth } from '../utils/backendClient';
import { waitForFirebase } from '../utils/firebaseReady';
import { agentDebugLog } from '../utils/agentDebugLog';
import { useLang } from '../utils/i18n';

export default function CommunityPage() {
    const router = useRouter();
    const { t } = useLang();
    const [ready, setReady] = useState(false);
    const [uid, setUid] = useState<string | null>(null);
    const [myEmail, setMyEmail] = useState('');
    const [me, setMe] = useState<SocialProfile | null>(null);
    const [pendingPosts, setPendingPosts] = useState<SocialPost[]>([]);
    const [rulesBlocked, setRulesBlocked] = useState(false);
    const [tab, setTab] = useState<CommunityTab>('feed');
    const [posts, setPosts] = useState<SocialPost[]>([]);
    const [profilePosts, setProfilePosts] = useState<SocialPost[]>([]);
    const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
    const [followingIds, setFollowingIds] = useState<string[]>([]);
    const [profiles, setProfiles] = useState<SocialProfile[]>([]);
    const [groups, setGroups] = useState<StudyGroup[]>([]);
    const [conversations, setConversations] = useState<ConversationPreview[]>([]);
    const [activeChat, setActiveChat] = useState<ConversationPreview | null>(null);
    const [chatDockOpen, setChatDockOpen] = useState(false);
    const [messages, setMessages] = useState<DirectMessage[]>([]);
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
    const [replyTo, setReplyTo] = useState<DirectMessage | null>(null);
    const [bioDraft, setBioDraft] = useState('');
    const [usernameDraft, setUsernameDraft] = useState('');

    const showToast = (t: string) => {
        setToast(t);
        window.setTimeout(() => setToast(''), 2800);
    };

    useEffect(() => {
        const q = String(router.query.tab || '');
        if (['feed', 'explore', 'groups', 'messages', 'profile', 'review'].includes(q)) {
            setTab(q as CommunityTab);
        }
    }, [router.query.tab]);

    const refreshFeed = useCallback(async (userId: string, following: string[]) => {
        // Nyilvános feed
        const list = (await apiListFeed(80)).filter(isPublicSocialPost);
        const ordered = following.length
            ? (() => {
                const set = new Set([...following, userId]);
                const followed = list.filter((p) => set.has(p.authorId));
                const rest = list.filter((p) => !set.has(p.authorId));
                return [...followed, ...rest];
            })()
            : list;
        setPosts((prev) => applyFeedRefresh(ordered, prev));
        setLikedMap(await resolveLikedMap(ordered, userId));
    }, []);

    useEffect(() => {
        document.body.classList.add('mm-social-body');
        return () => document.body.classList.remove('mm-social-body');
    }, []);

    useEffect(() => {
        let cancelled = false;
        // #region agent log
        agentDebugLog({
            hypothesisId: 'A',
            location: 'community.tsx:auth-effect-start',
            message: 'community auth effect start',
            data: {
                hasFirebase: !!(typeof window !== 'undefined' && (window as any).firebase),
                hasAuth: !!(typeof window !== 'undefined' && (window as any).firebase?.auth),
                apps: typeof window !== 'undefined' ? Number((window as any).firebase?.apps?.length || 0) : 0,
            },
            runId: 'social-login',
        });
        // #endregion

        const unsubHolder: { fn?: () => void } = {};

        (async () => {
            const firebase = await waitForFirebase();
            if (cancelled) return;
            // #region agent log
            agentDebugLog({
                hypothesisId: 'A',
                location: 'community.tsx:after-waitForFirebase',
                message: 'firebase wait result',
                data: {
                    hasFirebase: !!firebase,
                    apps: Number(firebase?.apps?.length || 0),
                    hasAuth: !!firebase?.auth,
                    currentUid: firebase?.auth?.()?.currentUser?.uid || null,
                },
                runId: 'social-login',
            });
            // #endregion
            if (!firebase?.auth) {
                setReady(true);
                return;
            }

            unsubHolder.fn = firebase.auth().onAuthStateChanged(async (user: any) => {
                if (cancelled) return;
                if (!user) {
                    // #region agent log
                    agentDebugLog({
                        hypothesisId: 'C',
                        location: 'community.tsx:auth-null',
                        message: 'onAuthStateChanged null',
                        data: {},
                        runId: 'social-login',
                    });
                    // #endregion
                    setUid(null);
                    setMyEmail('');
                    setMe(null);
                    setPendingPosts([]);
                    setReady(true);
                    return;
                }
                try {
                    setUid(user.uid);
                    setMyEmail(String(user.email || ''));
                    const profile = await apiEnsureProfile(user.uid, {
                        name: user.displayName || undefined,
                        photoURL: user.photoURL || undefined,
                    });
                    if (cancelled) return;
                    // #region agent log
                    agentDebugLog({
                        hypothesisId: 'B',
                        location: 'community.tsx:profile-ok',
                        message: 'ensureProfile ok',
                        data: { uid: user.uid, username: profile?.username || null },
                        runId: 'social-login',
                    });
                    // #endregion
                    setMe(profile);
                    setBioDraft(profile.bio);
                    setUsernameDraft(profile.username);
                    const following = await apiListFollowingIds(user.uid);
                    if (cancelled) return;
                    setFollowingIds(following);
                    if (isAdminEmail(user.email)) {
                        try {
                            if (sessionStorage.getItem('mmSocialPurgeV1') !== '1') {
                                await apiPurgeSocialJunk();
                                sessionStorage.setItem('mmSocialPurgeV1', '1');
                                setPosts([]);
                                setPendingPosts([]);
                                setProfilePosts([]);
                            }
                        } catch {
                            /* purge best-effort */
                        }
                    }
                    if (cancelled) return;
                    await refreshFeed(user.uid, following);
                    if (cancelled) return;
                    if (isAdminEmail(user.email)) {
                        const pending = await apiListPendingPosts(80).catch(() => []);
                        if (cancelled) return;
                        setPendingPosts(pending);
                    } else {
                        setPendingPosts([]);
                    }
                    const [p, g, c, health] = await Promise.all([
                        apiListProfiles(80),
                        apiListGroups(),
                        apiListConversations(user.uid),
                        backendHealth().catch(() => null),
                    ]);
                    if (cancelled) return;
                    if (health && (health as any).ok) {
                        console.info('backend health', (health as any).data);
                    }
                    setProfiles(p.filter((x) => !isPlaceholderSocialProfile(x)));
                    setGroups(g);
                    setConversations(c);
                } catch (e: any) {
                    if (cancelled) return;
                    const msg = String(e?.message || e || '');
                    // #region agent log
                    agentDebugLog({
                        hypothesisId: 'B',
                        location: 'community.tsx:profile-error',
                        message: 'community load failed',
                        data: { uid: user.uid, err: msg.slice(0, 180) },
                        runId: 'social-login',
                    });
                    // #endregion
                    console.error(e);
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
            });
        })();

        return () => {
            cancelled = true;
            unsubHolder.fn?.();
        };
    }, [refreshFeed]);

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
        try {
            setProfilePosts(await apiListUserPosts(targetUid, 50));
        } catch {
            setProfilePosts([]);
        }
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
                lastSenderId: uid,
                initiatorId: uid,
                updatedAtMs: Date.now(),
            };
        }
        setActiveChat(conv);
        setReplyTo(null);
        setMessages(await apiListMessages(cid).catch(() => []));
        setChatDockOpen(true);
    };

    const onCreatePost = async (fileOverride?: File | null, daily = false) => {
        if (!me || busy) return;
        const file = fileOverride ?? mediaFile;
        if (!postText.trim() && !file) {
            showToast(t('community.toast.postNeedsContent'));
            return;
        }
        if (file && (file.type.startsWith('video/') || /\.(mp4|webm|mov|m4v|avi|mkv)$/i.test(file.name))) {
            showToast(t('community.toast.videoNotAllowed'));
            return;
        }
        setBusy(true);
        try {
            let imageUrl: string | null = null;
            if (file) {
                showToast(t('community.toast.mediaUploading'));
                const { uploadSocialMedia } = await import('../utils/socialMediaUpload');
                const uploaded = await uploadSocialMedia(file, me.uid);
                imageUrl = uploaded.url;
            }
            showToast(t('community.toast.aiChecking'));
            const p = await apiCreatePost(me, postText, {
                imageUrl,
                videoUrl: null,
                topic: 'feladat',
                daily: daily && isAdminEmail(myEmail),
            });
            setPostText('');
            setMediaFile(null);
            const live = isPublicSocialPost(p);
            if (live) {
                setPosts((prev) => [p, ...prev.filter((x) => x.id !== p.id)]);
                setMe((prev) => (prev ? { ...prev, postCount: (prev.postCount || 0) + 1 } : prev));
            } else {
                setPendingPosts((prev) => [p, ...prev.filter((x) => x.id !== p.id)]);
            }
            setProfilePosts((prev) =>
                !viewProfile || viewProfile.uid === me.uid
                    ? [p, ...prev.filter((x) => x.id !== p.id)]
                    : prev
            );
            void refreshFeed(me.uid, followingIds).catch(() => undefined);
            showToast(
                p.dailyKey
                    ? t('community.toast.dailyPublished')
                    : live
                      ? t('community.toast.postPublished')
                      : t('community.toast.postPending')
            );
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
            setProfiles(await apiListProfiles(80));
        } catch (e: any) {
            showToast(e?.message || t('community.toast.followError'));
        } finally {
            setBusy(false);
        }
    };

    const onCreateGroup = async (memberIds: string[]) => {
        if (!me || busy) return;
        setBusy(true);
        try {
            const g = await apiCreateGroup(me, groupName, groupDesc, groupTopic, memberIds);
            setGroups((prev) => [g, ...prev]);
            setGroupName('');
            setGroupDesc('');
            setGroupTopic('');
            showToast(t('community.toast.groupCreated'));
        } catch (e: any) {
            showToast(e?.message || t('community.toast.groupError'));
            throw e;
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
            await apiSendMessage(uid, activeChat.otherUid, msgDraft, me, other, replyTo);
            setMsgDraft('');
            setReplyTo(null);
            setMessages(await apiListMessages(activeChat.id));
            setConversations(await apiListConversations(uid));
        } catch (e: any) {
            showToast(e?.message || t('community.toast.messageError'));
        } finally {
            setBusy(false);
        }
    };

    const onReactMessage = async (msg: DirectMessage, emoji: string) => {
        if (!uid || !activeChat) return;
        const cid = activeChat.id;
        try {
            const optimistic = toggleMessageReaction(msg.reactions, uid, emoji);
            setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, reactions: optimistic } : m)));
            const next = await apiReactToMessage(cid, msg.id, uid, emoji);
            setMessages((prev) => prev.map((m) => (m.id === next.id ? next : m)));
        } catch (e: any) {
            const fresh = await apiListMessages(cid).catch(() => null);
            if (fresh) setMessages(fresh);
            showToast(e?.message || t('community.toast.reactError'));
        }
    };

    const onSelectConversation = async (c: ConversationPreview) => {
        setReplyTo(null);
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

    // Live feed
    useEffect(() => {
        if (!uid) return;
        if (tab !== 'feed') return;
        let cancelled = false;
        const tick = async () => {
            try {
                await refreshFeed(uid, followingIds);
            } catch {
                /* ignore */
            }
            if (cancelled) return;
        };
        void tick();
        const id = window.setInterval(tick, 5000);
        return () => {
            cancelled = true;
            window.clearInterval(id);
        };
    }, [tab, uid, followingIds, refreshFeed]);

    useEffect(() => {
        if (!uid || tab !== 'profile') return;
        const target = viewProfile && viewProfile.uid !== uid ? viewProfile.uid : uid;
        let cancelled = false;
        void apiListUserPosts(target, 50)
            .then((list) => {
                if (!cancelled) setProfilePosts(list);
            })
            .catch(() => {
                if (!cancelled) setProfilePosts([]);
            });
        return () => {
            cancelled = true;
        };
    }, [tab, uid, viewProfile?.uid]);

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

    const leaderboard = useMemo(
        () => [...profiles].filter((p) => p.showXp).sort((a, b) => b.xp - a.xp).slice(0, 12),
        [profiles]
    );

    const storyProfiles = useMemo(
        () => buildDailyStoryProfiles(posts, profiles, me?.uid),
        [posts, profiles, me?.uid]
    );

    const suggested = useMemo(() => {
        const myUid = me?.uid;
        if (!myUid) return [];
        return profiles.filter((p) => p.uid !== myUid && !followingIds.includes(p.uid)).slice(0, 5);
    }, [profiles, followingIds, me?.uid]);

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
                        <p className="mm-ig-boot-sub">{t('community.boot.sub')}</p>
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

    const isReviewer = isAdminEmail(myEmail);
    const profileShown =
        tab === 'profile' ? (viewProfile && viewProfile.uid !== me.uid ? viewProfile : me) : null;

    const onReviewPost = async (postId: string, decision: 'approved' | 'rejected') => {
        if (busy) return;
        setBusy(true);
        try {
            const next = await apiReviewPost(postId, decision);
            setPendingPosts((prev) => prev.filter((p) => p.id !== postId));
            if (decision === 'approved') {
                setPosts((prev) => [next, ...prev.filter((x) => x.id !== next.id)]);
                if (next.authorId === me.uid) {
                    setMe((prev) => (prev ? { ...prev, postCount: (prev.postCount || 0) + 1 } : prev));
                }
                showToast(t('community.toast.postApproved'));
            } else {
                showToast(t('community.toast.postRejected'));
            }
            setProfilePosts((prev) => prev.map((x) => (x.id === next.id ? next : x)));
            void refreshFeed(me.uid, followingIds).catch(() => undefined);
        } catch (e: any) {
            showToast(e?.message || t('community.toast.postError'));
        } finally {
            setBusy(false);
        }
    };

    const navItems = [
        ['feed', t('community.tab.feed')],
        ['explore', t('community.tab.explore')],
        ['messages', t('community.tab.messages')],
        ['groups', t('community.tab.groups')],
        ...(isReviewer ? [['review', t('community.tab.review')] as const] : []),
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
                            <span className="mm-ig-nav-label">
                                {label}
                                {id === 'review' && pendingPosts.length > 0 ? ` (${pendingPosts.length})` : ''}
                            </span>
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
                            canPostDaily={isReviewer}
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
                            profiles={profiles}
                            followingIds={followingIds}
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
                            followingIds={followingIds}
                            conversations={conversations}
                            activeChat={activeChat}
                            messages={messages}
                            msgDraft={msgDraft}
                            onMsgDraftChange={setMsgDraft}
                            replyTo={replyTo}
                            onReplyTo={setReplyTo}
                            onSelectConversation={onSelectConversation}
                            onBackToInbox={() => setActiveChat(null)}
                            onSendMsg={onSendMsg}
                            onReactMessage={onReactMessage}
                            profiles={profiles}
                            onGetProfile={async (id) =>
                                profiles.find((p) => p.uid === id) || (await apiGetProfile(id))
                            }
                            onListUserPosts={(id) => apiListUserPosts(id, 50)}
                            onOpenProfile={openProfile}
                            busy={busy}
                        />
                    )}

                    {tab === 'review' && isReviewer && (
                        <CommunityReviewTab
                            me={me}
                            posts={pendingPosts}
                            likedMap={likedMap}
                            busy={busy}
                            onApprove={(id) => onReviewPost(id, 'approved')}
                            onReject={(id) => onReviewPost(id, 'rejected')}
                            onOpenProfile={openProfile}
                            onMessage={startMessage}
                            onPostChanged={(next) =>
                                setPendingPosts((prev) => prev.map((x) => (x.id === next.id ? next : x)))
                            }
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
                            posts={profilePosts}
                            likedMap={likedMap}
                            onCreatePost={onCreatePost}
                            onUsernameDraftChange={setUsernameDraft}
                            onBioDraftChange={setBioDraft}
                            onToggleFollow={onToggleFollow}
                            onStartMessage={startMessage}
                            onSaveProfile={onSaveProfile}
                            onOpenProfile={openProfile}
                            onMessage={startMessage}
                            onPostChanged={(next) => {
                                setPosts((prev) => prev.map((x) => (x.id === next.id ? next : x)));
                                setProfilePosts((prev) => prev.map((x) => (x.id === next.id ? next : x)));
                            }}
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
                        {suggested.length === 0 && (
                            <p className="mm-social-muted">{t('community.rail.noSuggestions')}</p>
                        )}
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
                        <span className="mm-social-tab-label">
                            {label}
                            {id === 'review' && pendingPosts.length > 0 ? ` (${pendingPosts.length})` : ''}
                        </span>
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
                    replyTo={replyTo}
                    onReplyTo={setReplyTo}
                    onSend={onSendMsg}
                    onReactMessage={onReactMessage}
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
