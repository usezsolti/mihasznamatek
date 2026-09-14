import { useEffect, useLayoutEffect, useRef, useState, type CSSProperties } from 'react';
import { createPortal } from 'react-dom';
import { useLang } from '../../utils/i18n';

export const CHAT_EMOJIS = [
    '😀', '😃', '😄', '😁', '😅', '😂', '🤣', '😊',
    '😇', '🙂', '😉', '😍', '🥰', '😘', '😜', '🤗',
    '🤔', '😎', '🤩', '😴', '😭', '😤', '😮', '🙃',
    '❤️', '🔥', '👍', '👎', '👏', '🙏', '🎉', '✨',
    '💯', '📚', '✏️', '✅', '💪', '🤝', '👋', '🤓',
];

export function insertTextAtCursor(
    value: string,
    insert: string,
    el: HTMLInputElement | HTMLTextAreaElement | null,
    maxLen = 500
): string {
    const start = el?.selectionStart ?? value.length;
    const end = el?.selectionEnd ?? value.length;
    const next = `${value.slice(0, start)}${insert}${value.slice(end)}`.slice(0, maxLen);
    const pos = Math.min(start + insert.length, next.length);
    requestAnimationFrame(() => {
        if (!el) return;
        el.focus();
        el.setSelectionRange(pos, pos);
    });
    return next;
}

export function CommunityChatEmojiPicker({
    onPick,
    label,
    icon = '☺',
    className,
}: {
    onPick: (emoji: string) => void;
    label?: string;
    icon?: string;
    className?: string;
}) {
    const { t } = useLang();
    const [open, setOpen] = useState(false);
    const [popStyle, setPopStyle] = useState<CSSProperties>({});
    const wrapRef = useRef<HTMLDivElement>(null);
    const popRef = useRef<HTMLDivElement>(null);
    const aria = label || t('community.chat.emoji');
    const floating = !!className?.includes('is-msg');

    useEffect(() => {
        if (!open) return;
        const onDoc = (e: MouseEvent) => {
            const node = e.target as Node;
            if (wrapRef.current?.contains(node) || popRef.current?.contains(node)) return;
            setOpen(false);
        };
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') setOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        document.addEventListener('keydown', onKey);
        return () => {
            document.removeEventListener('mousedown', onDoc);
            document.removeEventListener('keydown', onKey);
        };
    }, [open]);

    useLayoutEffect(() => {
        if (!open || !floating) return;
        const place = () => {
            const btn = wrapRef.current?.querySelector('button');
            if (!btn) return;
            const r = btn.getBoundingClientRect();
            const width = 248;
            const height = 176;
            const gap = 8;
            const mine = !!wrapRef.current?.closest('.is-mine');
            let left = mine ? r.right - width : r.left;
            left = Math.max(8, Math.min(left, window.innerWidth - width - 8));
            let top = r.bottom + gap;
            if (top + height > window.innerHeight - 8) {
                top = Math.max(8, r.top - height - gap);
            }
            setPopStyle({ top, left });
        };
        place();
        window.addEventListener('resize', place);
        window.addEventListener('scroll', place, true);
        return () => {
            window.removeEventListener('resize', place);
            window.removeEventListener('scroll', place, true);
        };
    }, [open, floating]);

    const pop = open ? (
        <div
            ref={popRef}
            className={`mm-chat-emoji-pop${floating ? ' is-float' : ''}`}
            role="listbox"
            aria-label={aria}
            style={floating ? popStyle : undefined}
        >
            {CHAT_EMOJIS.map((emoji) => (
                <button
                    key={emoji}
                    type="button"
                    className="mm-chat-emoji-item"
                    onClick={() => {
                        onPick(emoji);
                        setOpen(false);
                    }}
                >
                    {emoji}
                </button>
            ))}
        </div>
    ) : null;

    return (
        <div className={`mm-chat-emoji-wrap${className ? ` ${className}` : ''}`} ref={wrapRef}>
            <button
                type="button"
                className="mm-chat-emoji-btn"
                aria-label={aria}
                title={aria}
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
            >
                {icon}
            </button>
            {floating && typeof document !== 'undefined' ? createPortal(pop, document.body) : pop}
        </div>
    );
}

export function CommunityChatReactionChips({
    reactions,
    uid,
    onToggle,
}: {
    reactions?: { emoji: string; uids: string[] }[];
    uid: string;
    onToggle: (emoji: string) => void;
}) {
    if (!reactions?.length) return null;
    return (
        <div className="mm-chat-reacts">
            {reactions.map((r) => (
                <button
                    key={r.emoji}
                    type="button"
                    className={r.uids.includes(uid) ? 'is-mine' : ''}
                    aria-pressed={r.uids.includes(uid)}
                    onClick={() => onToggle(r.emoji)}
                >
                    <span>{r.emoji}</span>
                    {r.uids.length > 1 ? <small>{r.uids.length}</small> : null}
                </button>
            ))}
        </div>
    );
}

export function CommunityChatReplyBar({
    name,
    text,
    onCancel,
}: {
    name: string;
    text: string;
    onCancel: () => void;
}) {
    const { t } = useLang();
    return (
        <div className="mm-chat-reply-bar">
            <div className="mm-chat-reply-bar-meta">
                <strong>{t('community.chat.replying', { name })}</strong>
                <span>{text}</span>
            </div>
            <button type="button" onClick={onCancel} aria-label={t('common.close')}>
                ×
            </button>
        </div>
    );
}
