import { useEffect, useRef } from 'react';
import type { DirectMessage } from '../../utils/socialTypes';
import { useLang } from '../../utils/i18n';
import CommunityAvatar from './CommunityAvatar';
import {
    CommunityChatEmojiPicker,
    CommunityChatReactionChips,
    CommunityChatReplyBar,
    insertTextAtCursor,
} from './CommunityChatTools';

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
    replyTo: DirectMessage | null;
    onReplyTo: (msg: DirectMessage | null) => void;
    onReactMessage: (msg: DirectMessage, emoji: string) => void;
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
    replyTo,
    onReplyTo,
    onReactMessage,
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
    }, [peer.otherUid, replyTo?.id]);

    const replyName = (senderId?: string | null) =>
        senderId === uid ? t('community.chat.you') : peer.otherName;

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
                        <div
                            key={m.id}
                            id={`msg-${m.id}`}
                            className={`mm-chat-dock-msg${mine ? ' is-mine' : ''}`}
                        >
                            {!mine && (
                                <CommunityAvatar url={peer.otherPhoto} name={peer.otherName} size={22} />
                            )}
                            <div className="mm-chat-dock-col">
                                {m.replyToText && (
                                    <button
                                        type="button"
                                        className="mm-chat-quote"
                                        onClick={() =>
                                            document
                                                .getElementById(`msg-${m.replyToId || ''}`)
                                                ?.scrollIntoView({ behavior: 'smooth', block: 'center' })
                                        }
                                    >
                                        <small>{replyName(m.replyToSenderId)}</small>
                                        <span>{m.replyToText}</span>
                                    </button>
                                )}
                                <div className="mm-chat-dock-row">
                                    <span className="mm-chat-dock-bubble">{m.text}</span>
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

            {replyTo && (
                <CommunityChatReplyBar
                    name={replyName(replyTo.senderId)}
                    text={replyTo.text}
                    onCancel={() => onReplyTo(null)}
                />
            )}

            <form
                className="mm-chat-dock-compose"
                onSubmit={(e) => {
                    e.preventDefault();
                    onSend();
                }}
            >
                <CommunityChatEmojiPicker
                    onPick={(emoji) =>
                        onMsgDraftChange(insertTextAtCursor(msgDraft, emoji, inputRef.current))
                    }
                />
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
                    <button
                        type="button"
                        className="mm-chat-dock-reply-hint"
                        onClick={() => inputRef.current?.focus()}
                        aria-label={t('community.chat.emoji')}
                    >
                        ♡
                    </button>
                )}
            </form>
        </div>
    );
}
