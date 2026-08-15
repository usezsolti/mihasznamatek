import { useEffect, useRef, useState } from 'react';
import type { DirectMessage, SocialProfile } from '../../utils/socialTypes';
import CommunityAvatar from './CommunityAvatar';

type CommunityChatDockProps = {
    uid: string;
    peer: {
        otherUid: string;
        otherName: string;
        otherPhoto: string;
    };
    messages: DirectMessage[];
    msgDraft: string;
    onMsgDraftChange: (value: string) => void;
    onSend: () => void;
    onClose: () => void;
    onExpand: () => void;
    busy: boolean;
};

export default function CommunityChatDock({
    uid,
    peer,
    messages,
    msgDraft,
    onMsgDraftChange,
    onSend,
    onClose,
    onExpand,
    busy,
}: CommunityChatDockProps) {
    const listRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const el = listRef.current;
        if (!el) return;
        el.scrollTop = el.scrollHeight;
    }, [messages]);

    useEffect(() => {
        inputRef.current?.focus();
    }, [peer.otherUid]);

    return (
        <div className="mm-chat-dock" role="dialog" aria-label={`Chat: ${peer.otherName}`}>
            <header className="mm-chat-dock-head">
                <CommunityAvatar url={peer.otherPhoto} name={peer.otherName} size={28} />
                <strong>{peer.otherName}</strong>
                <div className="mm-chat-dock-actions">
                    <button type="button" title="Teljes üzenetek" onClick={onExpand} aria-label="Kibontás">
                        ⤢
                    </button>
                    <button type="button" title="Bezárás" onClick={onClose} aria-label="Bezárás">
                        ×
                    </button>
                </div>
            </header>

            <div className="mm-chat-dock-list" ref={listRef}>
                {messages.length === 0 && (
                    <p className="mm-chat-dock-empty">Írd meg az első üzenetet…</p>
                )}
                {messages.map((m) => {
                    const mine = m.senderId === uid;
                    return (
                        <div key={m.id} className={`mm-chat-dock-msg${mine ? ' is-mine' : ''}`}>
                            {!mine && (
                                <CommunityAvatar url={peer.otherPhoto} name={peer.otherName} size={22} />
                            )}
                            <span className="mm-chat-dock-bubble">{m.text}</span>
                        </div>
                    );
                })}
            </div>

            <form
                className="mm-chat-dock-compose"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSend();
                }}
            >
                <span aria-hidden>☺</span>
                <input
                    ref={inputRef}
                    value={msgDraft}
                    onChange={(e) => onMsgDraftChange(e.target.value)}
                    placeholder="Üzenet…"
                    maxLength={500}
                    autoComplete="off"
                />
                {msgDraft.trim() ? (
                    <button type="submit" disabled={busy}>
                        Küldés
                    </button>
                ) : (
                    <span className="mm-chat-dock-tools" aria-hidden>
                        ♡
                    </span>
                )}
            </form>
        </div>
    );
}
