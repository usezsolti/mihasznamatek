import { useEffect, useMemo, useRef, useState } from 'react';
import type { ConversationPreview, DirectMessage, SocialPost, SocialProfile } from '../../utils/socialTypes';
import { isInboundMessageRequest, isPublicSocialPost } from '../../utils/socialDomain';
import { useLang, type Lang } from '../../utils/i18n';
import CommunityAvatar from './CommunityAvatar';
import {
    CommunityChatEmojiPicker,
    CommunityChatReactionChips,
    CommunityChatReplyBar,
    insertTextAtCursor,
} from './CommunityChatTools';

type ThreadPanel = 'info' | 'photos';

type CommunityMessagesTabProps = {
    uid: string;
    me: SocialProfile;
    followingIds: string[];
    profiles: SocialProfile[];
    conversations: ConversationPreview[];
    activeChat: ConversationPreview | null;
    messages: DirectMessage[];
    msgDraft: string;
    onMsgDraftChange: (value: string) => void;
    replyTo: DirectMessage | null;
    onReplyTo: (msg: DirectMessage | null) => void;
    onSelectConversation: (c: ConversationPreview) => void;
    onBackToInbox: () => void;
    onSendMsg: () => void;
    onReactMessage: (msg: DirectMessage, emoji: string) => void;
    onGetProfile: (uid: string) => Promise<SocialProfile | null>;
    onListUserPosts: (uid: string) => Promise<SocialPost[]>;
    onOpenProfile: (uid: string) => void;
    busy: boolean;
};

function formatListTime(ms: number, lang: Lang, t: (key: string, vars?: Record<string, string>) => string): string {
    if (!ms) return '';
    const diff = Date.now() - ms;
    const m = Math.floor(diff / 60000);
    if (m < 1) return t('community.time.now');
    if (m < 60) return t('community.time.minutes', { n: String(m) });
    const h = Math.floor(m / 60);
    if (h < 24) return t('community.time.hours', { n: String(h) });
    const d = Math.floor(h / 24);
    if (d < 7) return t('community.time.days', { n: String(d) });
    const locale = lang === 'en' ? 'en-US' : 'hu-HU';
    return new Date(ms).toLocaleDateString(locale, { month: 'short', day: 'numeric' });
}

function formatMsgTime(ms: number, lang: Lang): string {
    if (!ms) return '';
    const d = new Date(ms);
    const now = new Date();
    const sameDay =
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate();
    const locale = lang === 'en' ? 'en-US' : 'hu-HU';
    if (sameDay) {
        return d.toLocaleTimeString(locale, { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString(locale, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function CommunityMessagesTab({
    uid,
    me,
    followingIds = [],
    profiles,
    conversations,
    activeChat,
    messages,
    msgDraft,
    onMsgDraftChange,
    replyTo,
    onReplyTo,
    onSelectConversation,
    onBackToInbox,
    onSendMsg,
    onReactMessage,
    onGetProfile,
    onListUserPosts,
    onOpenProfile,
    busy,
}: CommunityMessagesTabProps) {
    const { lang, t } = useLang();
    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const loadedPeerRef = useRef<string | null>(null);
    const peerChatRef = useRef<string | null>(null);
    const [query, setQuery] = useState('');
    const [inboxTab, setInboxTab] = useState<'primary' | 'requests'>('primary');
    const [threadPanel, setThreadPanel] = useState<ThreadPanel | null>(null);
    const [peerProfile, setPeerProfile] = useState<SocialProfile | null>(null);
    const [peerPhotos, setPeerPhotos] = useState<SocialPost[]>([]);
    const [panelBusy, setPanelBusy] = useState(false);
    const [lightbox, setLightbox] = useState<SocialPost | null>(null);

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [messages, activeChat?.id]);

    useEffect(() => {
        if (activeChat && !threadPanel) inputRef.current?.focus();
    }, [activeChat?.id, replyTo?.id, threadPanel]);

    useEffect(() => {
        setThreadPanel(null);
        setPeerProfile(null);
        setPeerPhotos([]);
        setLightbox(null);
        loadedPeerRef.current = null;
    }, [activeChat?.id]);

    const requests = useMemo(
        () => conversations.filter((c) => isInboundMessageRequest(uid, c, followingIds)),
        [conversations, uid, followingIds]
    );
    const primary = useMemo(
        () => conversations.filter((c) => !isInboundMessageRequest(uid, c, followingIds)),
        [conversations, uid, followingIds]
    );
    const inbox = inboxTab === 'requests' ? requests : primary;

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return inbox;
        return inbox.filter(
            (c) =>
                c.otherName.toLowerCase().includes(q) ||
                (c.lastMessage || '').toLowerCase().includes(q)
        );
    }, [inbox, query]);

    const replyName = (senderId?: string | null) =>
        senderId === uid ? t('community.chat.you') : activeChat?.otherName || '';

    const shownPeer = activeChat
        ? profiles.find((p) => p.uid === activeChat.otherUid) || peerProfile
        : null;
    const handle = (shownPeer?.username || '').replace(/^@/, '');
    peerChatRef.current = activeChat?.otherUid || null;

    const loadPeerDetails = async () => {
        if (!activeChat) return;
        const otherUid = activeChat.otherUid;
        if (loadedPeerRef.current === otherUid) return;
        setPanelBusy(true);
        try {
            const fromList = profiles.find((p) => p.uid === otherUid) || null;
            const p = fromList || (await onGetProfile(otherUid));
            const posts = await onListUserPosts(otherUid);
            if (peerChatRef.current !== otherUid) return;
            setPeerProfile(p);
            setPeerPhotos(
                posts
                    .filter((post) => !!post.imageUrl && isPublicSocialPost(post))
                    .sort((a, b) => b.createdAtMs - a.createdAtMs)
            );
            loadedPeerRef.current = otherUid;
        } catch {
            if (peerChatRef.current !== otherUid) return;
            setPeerPhotos([]);
        } finally {
            if (peerChatRef.current === otherUid) setPanelBusy(false);
        }
    };

    const openPanel = (panel: ThreadPanel) => {
        setThreadPanel(panel);
        setLightbox(null);
        void loadPeerDetails();
    };

    const closeThreadView = () => {
        if (lightbox) {
            setLightbox(null);
            return;
        }
        if (threadPanel) {
            setThreadPanel(null);
            return;
        }
        onBackToInbox();
    };

    return (
        <div className={`mm-dm${activeChat ? ' has-thread' : ''}`}>
            <aside className="mm-dm-inbox" aria-label={t('community.messages.conversations')}>
                <div className="mm-dm-inbox-top">
                    <button type="button" className="mm-dm-user-menu" title={me.displayName}>
                        <span>{me.username || me.displayName}</span>
                        <span className="mm-dm-chevron" aria-hidden>
                            ▾
                        </span>
                    </button>
                    <span className="mm-dm-compose-ico" title={t('community.messages.newMessage')} aria-hidden>
                        ✎
                    </span>
                </div>

                <div className="mm-dm-tabs" role="tablist">
                    <button
                        type="button"
                        className={inboxTab === 'primary' ? 'is-on' : ''}
                        role="tab"
                        aria-selected={inboxTab === 'primary'}
                        onClick={() => setInboxTab('primary')}
                    >
                        {t('community.messages.primary')}
                    </button>
                    <button
                        type="button"
                        className={inboxTab === 'requests' ? 'is-on' : ''}
                        role="tab"
                        aria-selected={inboxTab === 'requests'}
                        onClick={() => setInboxTab('requests')}
                    >
                        {t('community.messages.requests')}
                        {requests.length > 0 ? ` (${requests.length})` : ''}
                    </button>
                </div>

                <label className="mm-dm-search">
                    <span className="mm-dm-search-ico" aria-hidden>
                        ⌕
                    </span>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder={t('community.messages.search')}
                        aria-label={t('community.messages.searchLabel')}
                    />
                </label>

                <div className="mm-dm-inbox-list">
                    {filtered.length === 0 && (
                        <p className="mm-dm-empty">
                            {query.trim()
                                ? t('community.messages.noResults')
                                : inboxTab === 'requests'
                                  ? t('community.messages.emptyRequests')
                                  : t('community.messages.emptyInbox')}
                        </p>
                    )}
                    {filtered.map((c) => (
                        <button
                            key={c.id}
                            type="button"
                            className={`mm-dm-row${activeChat?.id === c.id ? ' is-on' : ''}`}
                            onClick={() => onSelectConversation(c)}
                        >
                            <CommunityAvatar url={c.otherPhoto} name={c.otherName} size={56} />
                            <span className="mm-dm-row-meta">
                                <strong>{c.otherName}</strong>
                                <small>{c.lastMessage || t('community.messages.newChat')}</small>
                            </span>
                            <time className="mm-dm-row-time">{formatListTime(c.updatedAtMs, lang, t)}</time>
                        </button>
                    ))}
                </div>
            </aside>

            <section className={`mm-dm-thread${threadPanel ? ' has-panel' : ''}`} aria-label="Chat">
                {activeChat ? (
                    <>
                        <header className="mm-dm-thread-head">
                            <button
                                type="button"
                                className="mm-dm-back"
                                onClick={closeThreadView}
                                aria-label={t('community.messages.back')}
                            >
                                ←
                            </button>
                            <button
                                type="button"
                                className="mm-dm-head-avatar"
                                onClick={() => openPanel('photos')}
                                title={t('community.messages.sharedPhotos')}
                                aria-label={t('community.messages.sharedPhotos')}
                            >
                                <CommunityAvatar
                                    url={shownPeer?.photoURL || activeChat.otherPhoto}
                                    name={activeChat.otherName}
                                    size={40}
                                />
                            </button>
                            <button
                                type="button"
                                className="mm-dm-thread-title"
                                onClick={() => openPanel('info')}
                            >
                                <strong>{shownPeer?.displayName || activeChat.otherName}</strong>
                                <small>
                                    {threadPanel === 'photos'
                                        ? t('community.messages.sharedPhotos')
                                        : threadPanel === 'info'
                                          ? t('community.messages.peerInfo')
                                          : handle
                                            ? `@${handle}`
                                            : 'MihaSocial'}
                                </small>
                            </button>
                            <div className="mm-dm-thread-actions">
                                <button
                                    type="button"
                                    title={t('community.messages.info')}
                                    aria-label={t('community.messages.info')}
                                    aria-pressed={threadPanel === 'info'}
                                    onClick={() =>
                                        threadPanel === 'info' ? setThreadPanel(null) : openPanel('info')
                                    }
                                >
                                    ℹ
                                </button>
                            </div>
                        </header>

                        {threadPanel === 'info' && (
                            <div className="mm-dm-peer-panel">
                                {panelBusy && !shownPeer ? (
                                    <p className="mm-dm-empty">{t('community.messages.loadingPeer')}</p>
                                ) : (
                                    <div className="mm-dm-peer-info">
                                        <button
                                            type="button"
                                            className="mm-dm-peer-photo"
                                            onClick={() => openPanel('photos')}
                                            title={t('community.messages.sharedPhotos')}
                                            aria-label={t('community.messages.sharedPhotos')}
                                        >
                                            <CommunityAvatar
                                                url={shownPeer?.photoURL || activeChat.otherPhoto}
                                                name={activeChat.otherName}
                                                size={96}
                                            />
                                        </button>
                                        <strong>{shownPeer?.displayName || activeChat.otherName}</strong>
                                        {handle ? <small>@{handle}</small> : null}
                                        <div className="mm-dm-peer-stats">
                                            <span>
                                                <b>{shownPeer?.postCount ?? 0}</b>{' '}
                                                {t('community.profile.posts')}
                                            </span>
                                            <span>
                                                <b>{shownPeer?.followerCount ?? 0}</b>{' '}
                                                {t('community.profile.followers')}
                                            </span>
                                            <span>
                                                <b>{shownPeer?.followingCount ?? 0}</b>{' '}
                                                {t('community.profile.following')}
                                            </span>
                                        </div>
                                        <p className="mm-dm-peer-bio">
                                            {shownPeer?.bio?.trim() || t('community.profile.noBio')}
                                        </p>
                                        {shownPeer?.showXp ? (
                                            <p className="mm-dm-peer-xp">
                                                {shownPeer.xp} XP · {shownPeer.rank}
                                            </p>
                                        ) : null}
                                        <button
                                            type="button"
                                            className="mm-ig-btn mm-ig-btn-wide"
                                            onClick={() => onOpenProfile(activeChat.otherUid)}
                                        >
                                            {t('community.messages.openProfile')}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {threadPanel === 'photos' && (
                            <div className="mm-dm-peer-panel">
                                {panelBusy && peerPhotos.length === 0 ? (
                                    <p className="mm-dm-empty">{t('community.messages.loadingPeer')}</p>
                                ) : peerPhotos.length === 0 ? (
                                    <p className="mm-dm-empty">{t('community.messages.emptyPhotos')}</p>
                                ) : (
                                    <div className="mm-ig-post-grid mm-dm-peer-grid">
                                        {peerPhotos.map((p) => (
                                            <button
                                                key={p.id}
                                                type="button"
                                                className="mm-ig-grid-cell"
                                                onClick={() => setLightbox(p)}
                                            >
                                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                                <img src={p.imageUrl || ''} alt="" />
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}

                        {!threadPanel && (
                        <>
                        <div className="mm-dm-thread-list" ref={listRef}>
                            {messages.length === 0 && (
                                <div className="mm-dm-thread-empty">
                                    <CommunityAvatar
                                        url={activeChat.otherPhoto}
                                        name={activeChat.otherName}
                                        size={72}
                                    />
                                    <strong>{activeChat.otherName}</strong>
                                    <p>{t('community.messages.threadEmpty')}</p>
                                </div>
                            )}
                            {messages.map((m, i) => {
                                const mine = m.senderId === uid;
                                const prev = messages[i - 1];
                                const showAvatar =
                                    !mine && (!prev || prev.senderId !== m.senderId);
                                return (
                                    <div
                                        key={m.id}
                                        id={`msg-${m.id}`}
                                        className={`mm-dm-msg${mine ? ' is-mine' : ''}${
                                            showAvatar ? ' has-avatar' : ''
                                        }`}
                                    >
                                        {!mine && (
                                            <span className="mm-dm-msg-av">
                                                {showAvatar ? (
                                                    <CommunityAvatar
                                                        url={activeChat.otherPhoto}
                                                        name={activeChat.otherName}
                                                        size={28}
                                                    />
                                                ) : null}
                                            </span>
                                        )}
                                        <div className="mm-dm-bubble-wrap">
                                            {m.replyToText && (
                                                <button
                                                    type="button"
                                                    className="mm-chat-quote"
                                                    onClick={() =>
                                                        document
                                                            .getElementById(`msg-${m.replyToId || ''}`)
                                                            ?.scrollIntoView({
                                                                behavior: 'smooth',
                                                                block: 'center',
                                                            })
                                                    }
                                                >
                                                    <small>{replyName(m.replyToSenderId)}</small>
                                                    <span>{m.replyToText}</span>
                                                </button>
                                            )}
                                            <div className="mm-dm-bubble-row">
                                                <div className="mm-dm-bubble">
                                                    <span>{m.text}</span>
                                                    <time dateTime={new Date(m.createdAtMs).toISOString()}>
                                                        {formatMsgTime(m.createdAtMs, lang)}
                                                    </time>
                                                </div>
                                                <div className="mm-chat-msg-tools">
                                                    <CommunityChatEmojiPicker
                                                        className="is-msg"
                                                        icon="☺"
                                                        label={t('community.chat.react')}
                                                        onPick={(emoji) => onReactMessage(m, emoji)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="mm-chat-reply-btn"
                                                        title={t('community.chat.reply')}
                                                        aria-label={t('community.chat.reply')}
                                                        onClick={() => {
                                                            onReplyTo(m);
                                                            inputRef.current?.focus();
                                                        }}
                                                    >
                                                        ↩
                                                    </button>
                                                </div>
                                            </div>
                                            <CommunityChatReactionChips
                                                reactions={m.reactions}
                                                uid={uid}
                                                onToggle={(emoji) => onReactMessage(m, emoji)}
                                            />
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        <form
                            className="mm-dm-compose"
                            onSubmit={(e) => {
                                e.preventDefault();
                                onSendMsg();
                            }}
                        >
                            {replyTo && (
                                <CommunityChatReplyBar
                                    name={replyName(replyTo.senderId)}
                                    text={replyTo.text}
                                    onCancel={() => onReplyTo(null)}
                                />
                            )}
                            <div className="mm-dm-compose-bar">
                                <CommunityChatEmojiPicker
                                    onPick={(emoji) =>
                                        onMsgDraftChange(
                                            insertTextAtCursor(msgDraft, emoji, inputRef.current)
                                        )
                                    }
                                />
                                <input
                                    ref={inputRef}
                                    value={msgDraft}
                                    onChange={(e) => onMsgDraftChange(e.target.value)}
                                    placeholder={t('community.messages.placeholder')}
                                    maxLength={500}
                                    autoComplete="off"
                                />
                                {msgDraft.trim() ? (
                                    <button type="submit" className="mm-dm-send" disabled={busy}>
                                        {t('common.send')}
                                    </button>
                                ) : (
                                    <span className="mm-dm-compose-tools" aria-hidden>
                                        <span>♡</span>
                                    </span>
                                )}
                            </div>
                        </form>
                        </>
                        )}

                        {lightbox?.imageUrl && (
                            <div
                                className="mm-ig-lightbox mm-dm-photo-lightbox"
                                role="dialog"
                                aria-modal="true"
                                onClick={() => setLightbox(null)}
                            >
                                <button
                                    type="button"
                                    className="mm-ig-lightbox-close"
                                    onClick={() => setLightbox(null)}
                                    aria-label={t('common.close')}
                                >
                                    ×
                                </button>
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                    className="mm-dm-photo-lightbox-img"
                                    src={lightbox.imageUrl}
                                    alt=""
                                    onClick={(e) => e.stopPropagation()}
                                />
                                {lightbox.text ? (
                                    <p className="mm-dm-photo-lightbox-cap">{lightbox.text}</p>
                                ) : null}
                            </div>
                        )}
                    </>
                ) : (
                    <div className="mm-dm-placeholder">
                        <div className="mm-dm-placeholder-icon" aria-hidden>
                            ✉
                        </div>
                        <h3>{t('community.messages.title')}</h3>
                        <p>{t('community.messages.subtitle')}</p>
                    </div>
                )}
            </section>
        </div>
    );
}
