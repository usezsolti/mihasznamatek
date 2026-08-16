import { useEffect, useRef } from 'react';
import type { DirectMessage } from '../../utils/socialTypes';
import { useLang } from '../../utils/i18n';
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
    const { t } = useLang();
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
                    <button type="button" title={t('community.chat.expandTitle')} onClick={onExpand} aria-label={t('community.chat.expand')}>
                        ⤢
                    </button>
                    <button type="button" title={t('common.close')} onClick={onClose} aria-label={t('common.close')}>
                        ×
                    </button>
                </div>
            </header>

            <div className="mm-chat-dock-list" ref={listRef}>
                {messages.length === 0 && (
                    <p className="mm-chat-dock-empty">{t('community.chat.empty')}</p>
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
                    placeholder={t('community.chat.placeholder')}
                    maxLength={500}
                    autoComplete="off"
                />
                {msgDraft.trim() ? (
                    <button type="submit" disabled={busy}>
                        {t('common.send')}
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
