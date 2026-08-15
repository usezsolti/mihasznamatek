import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import MatekCallRoom from './MatekCallRoom';
import MatekWhiteboard from './whiteboard/MatekWhiteboard';
import { useLang } from '../utils/i18n';
import {
    ensureLessonWhiteboard,
    lessonJoinPath,
    sendLessonMessage,
    subscribeLessonMessages,
    type LessonMessage,
    type LessonRoom,
} from '../utils/lessonRoom';

type LessonTab = 'lesson' | 'chat';

type Props = {
    room: LessonRoom;
    uid: string;
    displayName: string;
    photoURL?: string;
    onRoomUpdated?: (room: LessonRoom) => void;
};

export default function LessonHourRoom({
    room,
    uid,
    displayName,
    photoURL = '',
    onRoomUpdated,
}: Props) {
    const { t, lang } = useLang();
    const [tab, setTab] = useState<LessonTab>('lesson');
    const [callOpen, setCallOpen] = useState(false);
    const [messages, setMessages] = useState<LessonMessage[]>([]);
    const [draft, setDraft] = useState('');
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState('');
    const [boardId, setBoardId] = useState(room.whiteboardId || '');
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        return subscribeLessonMessages(room.id, setMessages);
    }, [room.id]);

    useEffect(() => {
        if (tab === 'chat') {
            bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages.length, tab]);

    useEffect(() => {
        setBoardId(room.whiteboardId || '');
    }, [room.whiteboardId]);

    const ensureBoard = useCallback(async () => {
        if (boardId) return boardId;
        setBusy(true);
        try {
            const res = await ensureLessonWhiteboard(room, uid);
            setBoardId(res.whiteboardId);
            onRoomUpdated?.(res.room);
            if (res.warning) setToast(res.warning);
            return res.whiteboardId;
        } catch (e: any) {
            setToast(e?.message || 'Tábla hiba');
            return '';
        } finally {
            setBusy(false);
        }
    }, [boardId, onRoomUpdated, room, uid]);

    useEffect(() => {
        void ensureBoard();
    }, [ensureBoard]);

    const joinUrl =
        typeof window !== 'undefined'
            ? `${window.location.origin}${lessonJoinPath(room.id)}`
            : lessonJoinPath(room.id);

    const copyLink = async () => {
        try {
            await navigator.clipboard.writeText(joinUrl);
            setToast(t('lesson.linkCopied'));
        } catch {
            setToast(joinUrl);
        }
    };

    const startCall = async () => {
        setCallOpen(true);
        setTab('lesson');
        await ensureBoard();
    };

    const send = async () => {
        if (!draft.trim() || busy) return;
        setBusy(true);
        try {
            const text = draft;
            setDraft('');
            await sendLessonMessage({
                roomId: room.id,
                senderId: uid,
                senderName: displayName,
                senderPhoto: photoURL,
                text,
            });
        } catch (e: any) {
            setToast(e?.message || 'Üzenet hiba');
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="lhr">
            <header className="lhr-head">
                <div className="lhr-head-main">
                    <div className="lhr-brand">
                        <span className="lhr-kicker">{t('lesson.live')}</span>
                        {callOpen ? <span className="lhr-live">{t('lesson.liveBadge')}</span> : null}
                    </div>
                    <h1 className="lhr-title">{room.title}</h1>
                    <p className="lhr-meta">
                        {displayName}
                        {room.studentName ? ` · ${t('lesson.student')}: ${room.studentName}` : ''}
                        {callOpen ? ` · ${t('lesson.metaLive')}` : ` · ${t('lesson.metaReady')}`}
                    </p>
                </div>
                <div className="lhr-head-actions">
                    <button type="button" className="lhr-btn lhr-btn-copy" onClick={() => void copyLink()}>
                        {t('lesson.copyLink')}
                    </button>
                    {!callOpen ? (
                        <button
                            type="button"
                            className="lhr-btn lhr-btn-primary"
                            onClick={() => void startCall()}
                        >
                            {t('lesson.startCall')}
                        </button>
                    ) : (
                        <button
                            type="button"
                            className="lhr-btn lhr-btn-end"
                            onClick={() => setCallOpen(false)}
                        >
                            {t('lesson.endCall')}
                        </button>
                    )}
                    <Link href="/dashboard" className="lhr-btn lhr-btn-exit">
                        {t('lesson.exit')}
                    </Link>
                </div>
            </header>

            {toast ? (
                <p className="lhr-toast" role="status">
                    {toast}
                </p>
            ) : null}

            <nav className="lhr-tabs" role="tablist" aria-label="Óra nézetek">
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'lesson'}
                    className={tab === 'lesson' ? 'is-on' : ''}
                    onClick={() => setTab('lesson')}
                >
                    {t('lesson.tabLesson')}
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={tab === 'chat'}
                    className={tab === 'chat' ? 'is-on' : ''}
                    onClick={() => setTab('chat')}
                >
                    {t('lesson.tabChat')}
                    {messages.length > 0 ? (
                        <span className="lhr-tab-count">{messages.length}</span>
                    ) : null}
                </button>
            </nav>

            <div
                className={`lhr-pane lhr-lesson ${callOpen ? 'is-live' : 'is-board-only'} ${
                    tab === 'lesson' ? 'is-shown' : 'is-hidden'
                }`}
            >
                {!callOpen ? (
                    <div className="lhr-call-strip">
                        <div>
                            <strong>{t('lesson.stripTitle')}</strong>
                            <p>{t('lesson.stripBody')}</p>
                        </div>
                        <button
                            type="button"
                            className="lhr-btn lhr-btn-primary"
                            onClick={() => void startCall()}
                        >
                            {t('lesson.startCall')}
                        </button>
                    </div>
                ) : null}

                <div className={`lhr-merge ${callOpen ? 'has-call' : ''}`}>
                    {callOpen ? (
                        <section className="lhr-merge-call" aria-label="Videóhívás">
                            <MatekCallRoom
                                roomId={room.id}
                                uid={uid}
                                displayName={displayName}
                                role={room.createdBy === uid ? 'teacher' : 'student'}
                                active={callOpen}
                                onClose={() => setCallOpen(false)}
                            />
                        </section>
                    ) : null}

                    <section className="lhr-merge-board" aria-label="Whiteboard">
                        {boardId ? (
                            <MatekWhiteboard
                                uid={uid}
                                displayName={displayName}
                                initialBoardId={boardId}
                                onBoardId={(id) => setBoardId(id)}
                            />
                        ) : (
                            <p className="lhr-muted" style={{ padding: '1rem' }}>
                                {busy ? t('lesson.boardLoading') : t('lesson.boardPrep')}
                            </p>
                        )}
                    </section>
                </div>
            </div>

            <div className={`lhr-pane lhr-chat ${tab === 'chat' ? 'is-shown' : 'is-hidden'}`}>
                <div className="lhr-chat-list">
                    {messages.length === 0 ? (
                        <p className="lhr-muted">{t('lesson.chatEmpty')}</p>
                    ) : (
                        messages.map((m) => (
                            <div
                                key={m.id}
                                className={`lhr-msg ${m.senderId === uid ? 'is-me' : ''}`}
                            >
                                <strong>{m.senderName}</strong>
                                <p>{m.text}</p>
                                <time>
                                    {new Date(m.createdAtMs).toLocaleTimeString(
                                        lang === 'en' ? 'en-GB' : 'hu-HU',
                                        {
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        }
                                    )}
                                </time>
                            </div>
                        ))
                    )}
                    <div ref={bottomRef} />
                </div>
                <div className="lhr-chat-compose">
                    <input
                        value={draft}
                        onChange={(e) => setDraft(e.target.value)}
                        placeholder={t('lesson.chatPlaceholder')}
                        maxLength={1000}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                void send();
                            }
                        }}
                    />
                    <button
                        type="button"
                        className="lhr-btn lhr-btn-primary"
                        disabled={busy || !draft.trim()}
                        onClick={() => void send()}
                    >
                        {t('lesson.send')}
                    </button>
                </div>
            </div>

            <style jsx>{`
                .lhr {
                    --line: rgba(57, 255, 20, 0.22);
                    --muted: #8b9a93;
                    --accent: #39ff14;
                    max-width: min(1480px, 100%);
                    margin: 0 auto;
                    padding: 0.6rem 0.75rem 1.25rem;
                    color: #e8f0ea;
                    min-height: calc(100vh - 72px);
                    display: flex;
                    flex-direction: column;
                    gap: 0.55rem;
                }
                .lhr-head {
                    display: flex;
                    justify-content: space-between;
                    gap: 1rem;
                    flex-wrap: wrap;
                    align-items: center;
                    padding: 0.85rem 1rem;
                    border: 1px solid var(--line);
                    border-radius: 16px;
                    background: linear-gradient(
                        135deg,
                        rgba(14, 22, 18, 0.98),
                        rgba(10, 14, 20, 0.95)
                    );
                }
                .lhr-head-main {
                    min-width: 0;
                    flex: 1;
                }
                .lhr-brand {
                    display: flex;
                    align-items: center;
                    gap: 0.45rem;
                    margin-bottom: 0.2rem;
                }
                .lhr-kicker {
                    margin: 0;
                    font-size: 0.68rem;
                    letter-spacing: 0.14em;
                    text-transform: uppercase;
                    color: var(--accent);
                    font-weight: 800;
                }
                .lhr-live {
                    font-size: 0.65rem;
                    font-weight: 800;
                    letter-spacing: 0.08em;
                    color: #061008;
                    background: #39ff14;
                    padding: 0.15rem 0.4rem;
                    border-radius: 999px;
                    animation: lhr-pulse 1.6s ease-in-out infinite;
                }
                @keyframes lhr-pulse {
                    0%,
                    100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.55;
                    }
                }
                .lhr-title {
                    margin: 0;
                    font-size: 1.28rem;
                    font-weight: 800;
                    letter-spacing: -0.02em;
                    line-height: 1.2;
                }
                .lhr-meta {
                    margin: 0.3rem 0 0;
                    color: var(--muted);
                    font-size: 0.84rem;
                }
                .lhr-muted {
                    color: var(--muted);
                    font-size: 0.88rem;
                    margin: 0.25rem 0 0;
                }
                .lhr-head-actions {
                    display: flex;
                    gap: 0.45rem;
                    flex-wrap: wrap;
                    align-items: center;
                }
                .lhr-toast {
                    margin: 0;
                    color: var(--accent);
                    font-size: 0.88rem;
                }
                .lhr-tabs {
                    display: flex;
                    gap: 0.35rem;
                    flex-wrap: wrap;
                    padding: 0.35rem;
                    border-radius: 14px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    background: rgba(0, 0, 0, 0.28);
                }
                .lhr-tabs button {
                    border: 1px solid transparent;
                    background: transparent;
                    color: var(--muted);
                    font-weight: 700;
                    padding: 0.55rem 1rem;
                    border-radius: 10px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.4rem;
                }
                .lhr-tabs button.is-on {
                    color: #061008;
                    background: linear-gradient(135deg, #39ff14, #b8ff5a);
                    border-color: transparent;
                    box-shadow: 0 4px 16px rgba(57, 255, 20, 0.25);
                }
                .lhr-tab-count {
                    font-size: 0.72rem;
                    font-weight: 800;
                    background: rgba(0, 0, 0, 0.2);
                    padding: 0.1rem 0.4rem;
                    border-radius: 999px;
                }
                .lhr-pane {
                    flex: 1;
                    min-height: 520px;
                    border: 1px solid var(--line);
                    border-radius: 16px;
                    background: rgba(12, 16, 22, 0.88);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }
                .lhr-pane.is-hidden {
                    display: none;
                }
                .lhr-lesson {
                    min-height: min(82vh, 920px);
                }
                .lhr-call-strip {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 1rem;
                    flex-wrap: wrap;
                    padding: 0.85rem 1rem;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    background: rgba(57, 255, 20, 0.06);
                    flex-shrink: 0;
                }
                .lhr-call-strip strong {
                    display: block;
                    color: var(--accent);
                    font-size: 0.95rem;
                }
                .lhr-call-strip p {
                    margin: 0.25rem 0 0;
                    color: var(--muted);
                    font-size: 0.84rem;
                    line-height: 1.4;
                    max-width: 40rem;
                }
                .lhr-merge {
                    flex: 1;
                    min-height: 0;
                    display: grid;
                    grid-template-columns: 1fr;
                    grid-template-rows: 1fr;
                }
                .lhr-merge.has-call {
                    grid-template-rows: minmax(240px, 32vh) minmax(420px, 1fr);
                }
                .lhr-merge-call {
                    min-height: 220px;
                    height: 100%;
                    border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                    display: flex;
                    flex-direction: column;
                    background: #0a0e13;
                }
                .lhr-merge-board {
                    min-height: 420px;
                    height: 100%;
                    overflow: hidden;
                    background: #1a1a1a;
                    position: relative;
                }
                .lhr-lesson.is-board-only .lhr-merge-board {
                    min-height: min(70vh, 720px);
                }
                .lhr-merge-board :global(.wb-app--board) {
                    height: 100% !important;
                    min-height: 420px !important;
                    max-height: none !important;
                }
                .lhr-merge-board :global(.wb-canvas-wrap),
                .lhr-merge-board :global(.wb-canvas) {
                    background: #f7f7f9;
                }
                @media (min-width: 1100px) {
                    .lhr-merge.has-call {
                        grid-template-columns: minmax(320px, 0.9fr) minmax(480px, 1.1fr);
                        grid-template-rows: minmax(560px, 74vh);
                    }
                    .lhr-merge-call {
                        border-bottom: none;
                        border-right: 1px solid rgba(255, 255, 255, 0.08);
                        min-height: 560px;
                    }
                    .lhr-merge-board {
                        min-height: 560px;
                    }
                }
                @media (max-width: 980px) {
                    .lhr-merge.has-call {
                        grid-template-columns: 1fr;
                        grid-template-rows: minmax(220px, 30vh) minmax(400px, 1fr);
                    }
                    .lhr-merge-call {
                        border-right: none;
                        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
                        min-height: 220px;
                    }
                }
                .lhr-chat-list {
                    flex: 1;
                    overflow: auto;
                    padding: 0.85rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.55rem;
                }
                .lhr-msg {
                    max-width: 85%;
                    padding: 0.55rem 0.7rem;
                    border-radius: 12px;
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 255, 255, 0.08);
                }
                .lhr-msg.is-me {
                    align-self: flex-end;
                    background: rgba(57, 255, 20, 0.12);
                    border-color: rgba(57, 255, 20, 0.28);
                }
                .lhr-msg strong {
                    display: block;
                    font-size: 0.78rem;
                    color: var(--accent);
                }
                .lhr-msg p {
                    margin: 0.2rem 0;
                    font-size: 0.92rem;
                }
                .lhr-msg time {
                    font-size: 0.7rem;
                    color: var(--muted);
                }
                .lhr-chat-compose {
                    display: flex;
                    gap: 0.45rem;
                    padding: 0.65rem;
                    border-top: 1px solid rgba(255, 255, 255, 0.08);
                }
                .lhr-chat-compose input {
                    flex: 1;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    background: #0a0e13;
                    color: #e8f0ea;
                    padding: 0.6rem 0.75rem;
                    font: inherit;
                }
                .lhr-btn {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    border: 1px solid var(--line);
                    background: rgba(57, 255, 20, 0.08);
                    color: var(--accent);
                    font-weight: 700;
                    padding: 0.55rem 0.95rem;
                    border-radius: 11px;
                    cursor: pointer;
                    text-decoration: none;
                    font-size: 0.88rem;
                    transition: transform 0.15s ease, background 0.15s ease, border-color 0.15s ease;
                }
                .lhr-btn:hover {
                    transform: translateY(-1px);
                }
                .lhr-btn-primary {
                    background: linear-gradient(135deg, #39ff14, #b8ff5a);
                    color: #061008;
                    border: none;
                    font-weight: 800;
                    padding: 0.7rem 1.25rem;
                }
                .lhr-btn-copy {
                    border-color: rgba(57, 255, 20, 0.4);
                    background: rgba(57, 255, 20, 0.12);
                }
                .lhr-btn-end {
                    border-color: rgba(255, 170, 60, 0.45);
                    background: rgba(80, 45, 8, 0.45);
                    color: #ffc46a;
                }
                .lhr-btn-exit {
                    border: 1px solid rgba(255, 90, 90, 0.55);
                    background: linear-gradient(
                        135deg,
                        rgba(120, 20, 28, 0.95),
                        rgba(70, 12, 18, 0.98)
                    );
                    color: #ffd0d0;
                    font-weight: 800;
                    padding: 0.55rem 1.1rem;
                    box-shadow: 0 4px 18px rgba(180, 30, 40, 0.28);
                }
                .lhr-btn-exit:hover {
                    border-color: rgba(255, 120, 120, 0.75);
                    color: #fff;
                    background: linear-gradient(135deg, rgba(150, 28, 36, 1), rgba(90, 14, 20, 1));
                }
                .lhr-btn:disabled {
                    opacity: 0.45;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}
