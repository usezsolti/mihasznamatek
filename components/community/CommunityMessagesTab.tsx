import { useEffect, useMemo, useRef, useState } from 'react';
import type { ConversationPreview, DirectMessage, SocialProfile } from '../../utils/socialTypes';
import CommunityAvatar from './CommunityAvatar';

type CommunityMessagesTabProps = {
    uid: string;
    me: SocialProfile;
    conversations: ConversationPreview[];
    activeChat: ConversationPreview | null;
    messages: DirectMessage[];
    msgDraft: string;
    onMsgDraftChange: (value: string) => void;
    onSelectConversation: (c: ConversationPreview) => void;
    onBackToInbox: () => void;
    onSendMsg: () => void;
    busy: boolean;
};

function formatListTime(ms: number): string {
    if (!ms) return '';
    const diff = Date.now() - ms;
    const m = Math.floor(diff / 60000);
    if (m < 1) return 'most';
    if (m < 60) return `${m}p`;
    const h = Math.floor(m / 60);
    if (h < 24) return `${h}ó`;
    const d = Math.floor(h / 24);
    if (d < 7) return `${d}n`;
    return new Date(ms).toLocaleDateString('hu-HU', { month: 'short', day: 'numeric' });
}

function formatMsgTime(ms: number): string {
    if (!ms) return '';
    const d = new Date(ms);
    const now = new Date();
    const sameDay =
        d.getFullYear() === now.getFullYear() &&
        d.getMonth() === now.getMonth() &&
        d.getDate() === now.getDate();
    if (sameDay) {
        return d.toLocaleTimeString('hu-HU', { hour: '2-digit', minute: '2-digit' });
    }
    return d.toLocaleDateString('hu-HU', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' });
}

export default function CommunityMessagesTab({
    uid,
    me,
    conversations,
    activeChat,
    messages,
    msgDraft,
    onMsgDraftChange,
    onSelectConversation,
    onBackToInbox,
    onSendMsg,
    busy,
}: CommunityMessagesTabProps) {
    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [messages, activeChat?.id]);

    useEffect(() => {
        if (activeChat) inputRef.current?.focus();
    }, [activeChat?.id]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        if (!q) return conversations;
        return conversations.filter(
            (c) =>
                c.otherName.toLowerCase().includes(q) ||
                (c.lastMessage || '').toLowerCase().includes(q)
        );
    }, [conversations, query]);

    return (
        <div className={`mm-dm${activeChat ? ' has-thread' : ''}`}>
            <aside className="mm-dm-inbox" aria-label="Beszélgetések">
                <div className="mm-dm-inbox-top">
                    <button type="button" className="mm-dm-user-menu" title={me.displayName}>
                        <span>{me.username || me.displayName}</span>
                        <span className="mm-dm-chevron" aria-hidden>
                            ▾
                        </span>
                    </button>
                    <span className="mm-dm-compose-ico" title="Új üzenet" aria-hidden>
                        ✎
                    </span>
                </div>

                <div className="mm-dm-tabs" role="tablist">
                    <button type="button" className="is-on" role="tab" aria-selected>
                        Elsődleges
                    </button>
                    <button type="button" role="tab" aria-selected={false} disabled title="Hamarosan">
                        Általános
                    </button>
                    <button type="button" role="tab" aria-selected={false} disabled title="Hamarosan">
                        Kérések
                    </button>
                </div>

                <label className="mm-dm-search">
                    <span className="mm-dm-search-ico" aria-hidden>
                        ⌕
                    </span>
                    <input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Keresés"
                        aria-label="Beszélgetés keresése"
                    />
                </label>

                <div className="mm-dm-note">
                    <CommunityAvatar url={me.photoURL} name={me.displayName} size={56} />
                    <span className="mm-dm-note-bubble">Your turn…</span>
                    <span className="mm-dm-note-label">Jegyzeted</span>
                </div>

                <div className="mm-dm-inbox-list">
                    {filtered.length === 0 && (
                        <p className="mm-dm-empty">
                            {conversations.length === 0
                                ? 'Még nincs beszélgetés — írj valakinek a feedről.'
                                : 'Nincs találat.'}
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
                                <small>{c.lastMessage || 'Új chat'}</small>
                            </span>
                            <time className="mm-dm-row-time">{formatListTime(c.updatedAtMs)}</time>
                        </button>
                    ))}
                </div>
            </aside>

            <section className="mm-dm-thread" aria-label="Chat">
                {activeChat ? (
                    <>
                        <header className="mm-dm-thread-head">
                            <button
                                type="button"
                                className="mm-dm-back"
                                onClick={onBackToInbox}
                                aria-label="Vissza"
                            >
                                ←
                            </button>
                            <CommunityAvatar
                                url={activeChat.otherPhoto}
                                name={activeChat.otherName}
                                size={40}
                            />
                            <div className="mm-dm-thread-title">
                                <strong>{activeChat.otherName}</strong>
                                <small>MihaSocial</small>
                            </div>
                            <div className="mm-dm-thread-actions" aria-hidden>
                                <span title="Hívás">☎</span>
                                <span title="Videó">◎</span>
                                <span title="Infó">ℹ</span>
                            </div>
                        </header>

                        <div className="mm-dm-thread-list" ref={listRef}>
                            {messages.length === 0 && (
                                <div className="mm-dm-thread-empty">
                                    <CommunityAvatar
                                        url={activeChat.otherPhoto}
                                        name={activeChat.otherName}
                                        size={72}
                                    />
                                    <strong>{activeChat.otherName}</strong>
                                    <p>MihaSocial · Írd meg az első üzenetet</p>
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
                                        <div className="mm-dm-bubble">
                                            <span>{m.text}</span>
                                            <time dateTime={new Date(m.createdAtMs).toISOString()}>
                                                {formatMsgTime(m.createdAtMs)}
                                            </time>
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
                            <div className="mm-dm-compose-bar">
                                <span className="mm-dm-emoji" aria-hidden>
                                    ☺
                                </span>
                                <input
                                    ref={inputRef}
                                    value={msgDraft}
                                    onChange={(e) => onMsgDraftChange(e.target.value)}
                                    placeholder="Üzenet…"
                                    maxLength={500}
                                    autoComplete="off"
                                />
                                {msgDraft.trim() ? (
                                    <button type="submit" className="mm-dm-send" disabled={busy}>
                                        Küldés
                                    </button>
                                ) : (
                                    <span className="mm-dm-compose-tools" aria-hidden>
                                        <span>🎙</span>
                                        <span>🖼</span>
                                        <span>♡</span>
                                    </span>
                                )}
                            </div>
                        </form>
                    </>
                ) : (
                    <div className="mm-dm-placeholder">
                        <div className="mm-dm-placeholder-icon" aria-hidden>
                            ✉
                        </div>
                        <h3>Üzeneteid</h3>
                        <p>Küldj üzenetet egy diáknak — válassz beszélgetést bal oldalon.</p>
                    </div>
                )}
            </section>
        </div>
    );
}
