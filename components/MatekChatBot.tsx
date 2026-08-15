import { FormEvent, Fragment, useEffect, useRef, useState, type ReactNode } from 'react';
import { useRouter } from 'next/router';
import { useMatekChat } from '../hooks/useMatekChat';
import { useLang } from '../utils/i18n';

const NEAR_BOTTOM_PX = 80;

const SITE_PATHS =
    /(?:https?:\/\/(?:www\.)?mihasznamatek\.hu)?(\/(?:booking|community|dashboard|workout|game|adatkezelesi-tajekoztato)(?:[?#][^\s]*)?|\/#[\w-]+)/gi;

/** Turn site URLs / paths into in-app links (same origin — works on localhost & production). */
function linkifyMessage(
    text: string,
    onInternalNav: (href: string) => void
): ReactNode[] {
    const nodes: ReactNode[] = [];
    let last = 0;
    let key = 0;
    const re = new RegExp(SITE_PATHS.source, 'gi');
    let match: RegExpExecArray | null;
    while ((match = re.exec(text)) !== null) {
        if (match.index > last) {
            nodes.push(<Fragment key={`t${key++}`}>{text.slice(last, match.index)}</Fragment>);
        }
        const full = match[0];
        const path = match[1] || full.replace(/^https?:\/\/[^/]+/i, '') || '/';
        const href = path.startsWith('/') ? path : `/${path}`;
        nodes.push(
            <a
                key={`a${key++}`}
                href={href}
                className="chat-inline-link"
                onClick={(e) => {
                    e.preventDefault();
                    onInternalNav(href);
                }}
            >
                {full.includes('http') ? href : full}
            </a>
        );
        last = match.index + full.length;
    }
    if (last < text.length) {
        nodes.push(<Fragment key={`t${key++}`}>{text.slice(last)}</Fragment>);
    }
    return nodes.length ? nodes : [text];
}

/** Presentation: UI only — chat use-case lives in hooks/useMatekChat. */
export default function MatekChatBot() {
    const { t } = useLang();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [input, setInput] = useState('');
    const { messages, busy, send } = useMatekChat();
    const endRef = useRef<HTMLDivElement>(null);
    const messagesRef = useRef<HTMLDivElement>(null);
    /** Only auto-scroll when the user is already near the bottom (or just sent). */
    const stickToBottomRef = useRef(true);
    const wasOpenRef = useRef(false);

    const goInternal = (href: string) => {
        setOpen(false);
        void router.push(href);
    };

    const isNearBottom = () => {
        const el = messagesRef.current;
        if (!el) return true;
        return el.scrollHeight - el.scrollTop - el.clientHeight <= NEAR_BOTTOM_PX;
    };

    const scrollToBottom = (behavior: ScrollBehavior = 'smooth') => {
        const el = messagesRef.current;
        if (!el) {
            endRef.current?.scrollIntoView({ behavior, block: 'end' });
            return;
        }
        el.scrollTo({ top: el.scrollHeight, behavior });
    };

    useEffect(() => {
        if (open && !wasOpenRef.current) {
            stickToBottomRef.current = false;
            requestAnimationFrame(() => {
                const el = messagesRef.current;
                if (el) el.scrollTop = 0;
            });
        }
        wasOpenRef.current = open;
    }, [open]);

    useEffect(() => {
        if (!open || minimized) return;
        if (!stickToBottomRef.current) return;
        scrollToBottom('smooth');
    }, [messages, busy, open, minimized]);

    const sendAndClear = async (text: string) => {
        const cleaned = text.trim();
        if (!cleaned) return;
        setInput('');
        stickToBottomRef.current = true;
        scrollToBottom('auto');
        await send(cleaned);
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        void sendAndClear(input);
    };

    return (
        <>
            {!open && (
                <button
                    type="button"
                    className="chat-button"
                    title={t('chat.open')}
                    aria-label={t('chat.open')}
                    onClick={() => {
                        setOpen(true);
                        setMinimized(false);
                    }}
                >
                    <div className="chat-button-icon" aria-hidden>
                        💬
                    </div>
                    <div className="chat-button-text">AI</div>
                </button>
            )}

            {open && (
                <div
                    className="chat-bot-overlay"
                    onClick={(e) => {
                        if (e.target === e.currentTarget) setOpen(false);
                    }}
                >
                    <div
                        className={`chat-bot-container${minimized ? ' minimized' : ''}`}
                        role="dialog"
                        aria-label={t('chat.dialog')}
                    >
                        <div className="chat-header">
                            <div className="chat-title">
                                <span className="chat-avatar" aria-hidden>
                                    π
                                </span>
                                <div>
                                    <h3>MihAIy</h3>
                                    <div className="chat-status">
                                        {busy ? t('chat.thinking') : t('chat.statusReady')}
                                    </div>
                                </div>
                            </div>
                            <div className="chat-header-actions">
                                <button
                                    type="button"
                                    className="chat-minimize"
                                    aria-label={minimized ? t('chat.expand') : t('chat.minimize')}
                                    onClick={() => setMinimized((v) => !v)}
                                >
                                    {minimized ? '□' : '–'}
                                </button>
                                <button
                                    type="button"
                                    className="chat-close"
                                    aria-label={t('common.close')}
                                    onClick={() => setOpen(false)}
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        {!minimized && (
                            <>
                                <div
                                    className="chat-messages"
                                    ref={messagesRef}
                                    onScroll={() => {
                                        stickToBottomRef.current = isNearBottom();
                                    }}
                                >
                                    {messages.map((m) => (
                                        <div
                                            key={m.id}
                                            className={`message ${m.isUser ? 'user-message' : 'bot-message'}`}
                                        >
                                            <div className="message-content">{linkifyMessage(m.text, goInternal)}</div>
                                        </div>
                                    ))}
                                    <div ref={endRef} />
                                </div>

                                <form className="chat-input" onSubmit={onSubmit}>
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder={t('chat.placeholder')}
                                        rows={2}
                                        maxLength={2000}
                                        disabled={busy}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                void sendAndClear(input);
                                            }
                                        }}
                                    />
                                    <button
                                        type="submit"
                                        className="send-button"
                                        disabled={busy || !input.trim()}
                                        aria-label={t('chat.send')}
                                    >
                                        →
                                    </button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            )}
        </>
    );
}
