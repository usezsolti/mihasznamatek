import { FormEvent, useEffect, useRef, useState } from 'react';
import { useMatekChat } from '../hooks/useMatekChat';

const QUICK = [
    'Mennyibe kerül egy óra?',
    'Kiket vállalsz?',
    'Van online óra?',
    'Hogyan foglalhatok?',
];

/** Presentation: UI only — chat use-case a hooks/useMatekChat-ben. */
export default function MatekChatBot() {
    const [open, setOpen] = useState(false);
    const [minimized, setMinimized] = useState(false);
    const [input, setInput] = useState('');
    const { messages, busy, send } = useMatekChat();
    const endRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (open && !minimized) {
            endRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages, open, minimized]);

    const sendAndClear = async (text: string) => {
        setInput('');
        await send(text);
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
                    title="MihaAI chat"
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
                        aria-label="MihaAI chat"
                    >
                        <div className="chat-header">
                            <div className="chat-title">
                                <span className="chat-avatar" aria-hidden>
                                    π
                                </span>
                                <div>
                                    <h3>MihaAI</h3>
                                    <div className="chat-status">
                                        {busy ? 'Gondolkodom…' : 'MihaAI chat'}
                                    </div>
                                </div>
                            </div>
                            <div className="chat-header-actions">
                                <button
                                    type="button"
                                    className="chat-minimize"
                                    aria-label={minimized ? 'Kibontás' : 'Minimalizálás'}
                                    onClick={() => setMinimized((v) => !v)}
                                >
                                    {minimized ? '□' : '–'}
                                </button>
                                <button
                                    type="button"
                                    className="chat-close"
                                    aria-label="Bezárás"
                                    onClick={() => setOpen(false)}
                                >
                                    ×
                                </button>
                            </div>
                        </div>

                        {!minimized && (
                            <>
                                <div className="chat-messages">
                                    {messages.map((m) => (
                                        <div
                                            key={m.id}
                                            className={`message ${m.isUser ? 'user-message' : 'bot-message'}`}
                                        >
                                            <div className="message-content">{m.text}</div>
                                        </div>
                                    ))}
                                    {messages.length <= 2 && (
                                        <div className="quick-replies">
                                            {QUICK.map((q) => (
                                                <button
                                                    key={q}
                                                    type="button"
                                                    className="quick-reply-btn"
                                                    disabled={busy}
                                                    onClick={() => void sendAndClear(q)}
                                                >
                                                    {q}
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                    <div ref={endRef} />
                                </div>

                                <form className="chat-input" onSubmit={onSubmit}>
                                    <textarea
                                        value={input}
                                        onChange={(e) => setInput(e.target.value)}
                                        placeholder="Írd ide a kérdésed…"
                                        rows={2}
                                        maxLength={800}
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
                                        aria-label="Küldés"
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
