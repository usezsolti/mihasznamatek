import Link from 'next/link';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
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
import { agentDebugLog } from '../utils/agentDebugLog';

type LessonTab = 'call' | 'board' | 'chat';

type Props = {
    room: LessonRoom;
    uid: string;
    displayName: string;
    photoURL?: string;
    onRoomUpdated?: (room: LessonRoom) => void;
};

function friendlyName(raw: string, fallback: string): string {
    const s = String(raw || '').trim();
    if (!s) return fallback;
    if (s.includes('@')) return s.split('@')[0].replace(/\+/g, ' ');
    return s;
}

export default function LessonHourRoom({
    room,
    uid,
    displayName,
    photoURL = '',
    onRoomUpdated,
}: Props) {
    const { t, lang } = useLang();
    const isTeacher = room.createdBy === uid;
    const [tab, setTab] = useState<LessonTab>('call');
    const [callOpen, setCallOpen] = useState(false);
    const [messages, setMessages] = useState<LessonMessage[]>([]);
    const [draft, setDraft] = useState('');
    const [busy, setBusy] = useState(false);
    const [toast, setToast] = useState('');
    const [boardId, setBoardId] = useState(room.whiteboardId || '');
    const bottomRef = useRef<HTMLDivElement | null>(null);
    const autoStarted = useRef(false);

    const who = useMemo(
        () => friendlyName(displayName, t('lesson.youFallback')),
        [displayName, t]
    );
    const student = useMemo(
        () => friendlyName(room.studentName || '', ''),
        [room.studentName]
    );
    const title = useMemo(() => {
        const raw = String(room.title || '').trim();
        if (!raw) return t('lesson.live');
        if (raw.includes('@')) return t('lesson.defaultTitle');
        return raw;
    }, [room.title, t]);

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
            setToast(e?.message || t('lesson.boardError'));
            return '';
        } finally {
            setBusy(false);
        }
    }, [boardId, onRoomUpdated, room, t, uid]);

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

    const startCall = useCallback(async () => {
        setCallOpen(true);
        setTab('call');
        await ensureBoard();
    }, [ensureBoard]);

    useEffect(() => {
        // #region agent log
        agentDebugLog({
            hypothesisId: 'B',
            location: 'LessonHourRoom.tsx:role',
            message: 'lesson room role',
            data: {
                roomId: room.id,
                isTeacher,
                callOpen,
                createdByTail: String(room.createdBy || '').slice(-6),
                uidTail: uid.slice(-6),
                hasStudentName: Boolean(room.studentName),
            },
            runId: 'wb-call',
        });
        // #endregion
    }, [room.id, room.createdBy, room.studentName, isTeacher, callOpen, uid]);

    useEffect(() => {
        if (!isTeacher || autoStarted.current) return;
        autoStarted.current = true;
        // #region agent log
        agentDebugLog({
            hypothesisId: 'A',
            location: 'LessonHourRoom.tsx:autoStart',
            message: 'teacher auto-start call',
            data: { roomId: room.id, isTeacher },
            runId: 'wb-call',
        });
        // #endregion
        void startCall();
    }, [isTeacher, startCall, room.id]);

    const openBoard = () => {
        setTab('board');
        void ensureBoard();
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
            setToast(e?.message || t('lesson.chatError'));
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className={`lhr ${callOpen ? 'is-live' : 'is-ready'}`}>
            <header className="lhr-bar">
                <div className="lhr-bar-left">
                    <span className={`lhr-badge ${callOpen ? 'is-live' : ''}`}>
                        {callOpen ? t('lesson.liveBadge') : t('lesson.readyBadge')}
                    </span>
                    <div className="lhr-bar-text">
                        <strong className="lhr-bar-title">{title}</strong>
                        <span className="lhr-bar-sub">
                            {isTeacher ? t('lesson.roleTeacher') : t('lesson.roleStudent')}
                            {student ? ` · ${student}` : ''}
                            {` · ${who}`}
                        </span>
                    </div>
                </div>

                <nav className="lhr-tabs" role="tablist" aria-label={t('lesson.tabsLabel')}>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={tab === 'call'}
                        className={tab === 'call' ? 'is-on' : ''}
                        onClick={() => setTab('call')}
                    >
                        {t('lesson.tabCall')}
                    </button>
                    <button
                        type="button"
                        role="tab"
                        aria-selected={tab === 'board'}
                        className={tab === 'board' ? 'is-on' : ''}
                        onClick={() => openBoard()}
                    >
                        {t('lesson.tabBoard')}
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

                <div className="lhr-bar-actions">
                    <button type="button" className="lhr-btn lhr-btn-ghost" onClick={() => void copyLink()}>
                        {t('lesson.copyLink')}
                    </button>
                    {!callOpen ? (
                        <button type="button" className="lhr-btn lhr-btn-go" onClick={() => void startCall()}>
                            {t('lesson.startCall')}
                        </button>
                    ) : (
                        <button type="button" className="lhr-btn lhr-btn-end" onClick={() => setCallOpen(false)}>
                            {t('lesson.endCall')}
                        </button>
                    )}
                    <Link href="/dashboard" className="lhr-btn lhr-btn-ghost">
                        {t('lesson.exit')}
                    </Link>
                </div>
            </header>

            {toast ? (
                <p className="lhr-toast" role="status">
                    {toast}
                </p>
            ) : null}

            {tab === 'call' ? (
                <div className="lhr-pane lhr-call-pane">
                    {!callOpen ? (
                        <div className="lhr-ready">
                            <p className="lhr-ready-kicker">{t('lesson.stripTitle')}</p>
                            <h2>{t('lesson.startCall')}</h2>
                            <p>{t('lesson.stripBody')}</p>
                            <div className="lhr-ready-actions">
                                <button
                                    type="button"
                                    className="lhr-btn lhr-btn-go lhr-btn-lg"
                                    onClick={() => void startCall()}
                                >
                                    {t('lesson.startCall')}
                                </button>
                                <button
                                    type="button"
                                    className="lhr-btn lhr-btn-ghost"
                                    onClick={() => void copyLink()}
                                >
                                    {t('lesson.copyLink')}
                                </button>
                            </div>
                            <p className="lhr-ready-note">{t('lesson.studentWait')}</p>
                        </div>
                    ) : (
                        <MatekCallRoom
                            roomId={room.id}
                            uid={uid}
                            displayName={displayName}
                            role={isTeacher ? 'teacher' : 'student'}
                            active={callOpen}
                            onClose={() => setCallOpen(false)}
                        />
                    )}
                </div>
            ) : null}

            {tab === 'board' ? (
                <div className="lhr-pane lhr-board-pane">
                    {boardId ? (
                        <MatekWhiteboard
                            uid={uid}
                            displayName={displayName}
                            initialBoardId={boardId}
                            onBoardId={(id) => setBoardId(id)}
                        />
                    ) : (
                        <p className="lhr-muted">
                            {busy ? t('lesson.boardLoading') : t('lesson.boardPrep')}
                        </p>
                    )}
                </div>
            ) : null}

            {tab === 'chat' ? (
                <div className="lhr-pane lhr-chat">
                    <div className="lhr-chat-list">
                        {messages.length === 0 ? (
                            <p className="lhr-muted">{t('lesson.chatEmpty')}</p>
                        ) : (
                            messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`lhr-msg ${m.senderId === uid ? 'is-me' : ''}`}
                                >
                                    <strong>{friendlyName(m.senderName, t('lesson.student'))}</strong>
                                    <p>{m.text}</p>
                                    <time>
                                        {new Date(m.createdAtMs).toLocaleTimeString(
                                            lang === 'en' ? 'en-GB' : 'hu-HU',
                                            { hour: '2-digit', minute: '2-digit' }
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
                            className="lhr-btn lhr-btn-go"
                            disabled={busy || !draft.trim()}
                            onClick={() => void send()}
                        >
                            {t('lesson.send')}
                        </button>
                    </div>
                </div>
            ) : null}

            <style jsx>{`
                .lhr {
                    --line: rgba(57, 255, 20, 0.28);
                    --muted: #b7cfc0;
                    --accent: #39ff14;
                    width: 100%;
                    max-width: 920px;
                    margin: 0.75rem auto 1.5rem;
                    padding: 0 0.75rem;
                    color: #eef7f0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.55rem;
                    box-sizing: border-box;
                }
                .lhr-bar {
                    display: flex;
                    flex-wrap: wrap;
                    align-items: center;
                    gap: 0.55rem 0.75rem;
                    padding: 0.55rem 0.7rem;
                    border: 1px solid var(--line);
                    border-radius: 12px;
                    background: linear-gradient(135deg, #101812, #0d1218);
                }
                .lhr-bar-left {
                    display: flex;
                    align-items: center;
                    gap: 0.55rem;
                    min-width: 0;
                    flex: 1 1 200px;
                }
                .lhr-badge {
                    flex-shrink: 0;
                    font-size: 0.68rem;
                    font-weight: 900;
                    letter-spacing: 0.06em;
                    color: #061008;
                    background: #9eb5a8;
                    padding: 0.26rem 0.5rem;
                    border-radius: 999px;
                }
                .lhr-badge.is-live {
                    background: var(--accent);
                }
                .lhr-bar-text {
                    min-width: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.05rem;
                }
                .lhr-bar-title {
                    font-size: 0.95rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .lhr-bar-sub {
                    color: var(--muted);
                    font-size: 0.75rem;
                    white-space: nowrap;
                    overflow: hidden;
                    text-overflow: ellipsis;
                }
                .lhr-tabs {
                    display: inline-flex;
                    gap: 0.2rem;
                    padding: 0.2rem;
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.08);
                    background: rgba(0, 0, 0, 0.35);
                    flex: 0 0 auto;
                }
                .lhr-tabs button {
                    border: none;
                    background: transparent;
                    color: var(--muted);
                    font-weight: 700;
                    padding: 0.38rem 0.7rem;
                    border-radius: 8px;
                    cursor: pointer;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.3rem;
                    font-size: 0.84rem;
                }
                .lhr-tabs button.is-on {
                    color: #061008;
                    background: linear-gradient(135deg, #39ff14, #b8ff5a);
                }
                .lhr-tab-count {
                    font-size: 0.68rem;
                    font-weight: 800;
                    background: rgba(0, 0, 0, 0.18);
                    padding: 0.06rem 0.32rem;
                    border-radius: 999px;
                }
                .lhr-bar-actions {
                    display: flex;
                    gap: 0.35rem;
                    flex-wrap: wrap;
                    align-items: center;
                    margin-left: auto;
                }
                .lhr-toast {
                    margin: 0;
                    color: var(--accent);
                    font-size: 0.82rem;
                }
                .lhr-pane {
                    border: 1px solid var(--line);
                    border-radius: 14px;
                    background: rgba(8, 12, 14, 0.95);
                    overflow: hidden;
                }
                .lhr-call-pane {
                    min-height: 0;
                }
                .lhr-ready {
                    padding: 1.25rem 1.15rem;
                    display: flex;
                    flex-direction: column;
                    gap: 0.45rem;
                    background: radial-gradient(circle at top left, rgba(57, 255, 20, 0.12), transparent 55%),
                        #0e1512;
                }
                .lhr-ready-kicker {
                    margin: 0;
                    color: var(--accent);
                    font-size: 0.72rem;
                    font-weight: 800;
                    letter-spacing: 0.06em;
                    text-transform: uppercase;
                }
                .lhr-ready h2 {
                    margin: 0;
                    font-size: 1.35rem;
                    line-height: 1.2;
                }
                .lhr-ready p {
                    margin: 0;
                    color: var(--muted);
                    line-height: 1.45;
                    max-width: 36rem;
                    font-size: 0.92rem;
                }
                .lhr-ready-actions {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.45rem;
                    margin-top: 0.35rem;
                }
                .lhr-ready-note {
                    font-size: 0.82rem !important;
                }
                .lhr-board-pane {
                    height: min(62vh, 560px);
                    min-height: 360px;
                }
                .lhr-board-pane :global(.wb-app--board) {
                    height: 100% !important;
                    min-height: 100% !important;
                    max-height: none !important;
                }
                .lhr-chat {
                    display: flex;
                    flex-direction: column;
                    height: min(52vh, 420px);
                    min-height: 280px;
                }
                .lhr-muted {
                    color: var(--muted);
                    padding: 1rem;
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
                    background: rgba(255, 255, 255, 0.05);
                }
                .lhr-msg.is-me {
                    align-self: flex-end;
                    background: rgba(57, 255, 20, 0.12);
                }
                .lhr-msg strong {
                    display: block;
                    font-size: 0.78rem;
                    color: var(--accent);
                }
                .lhr-msg p {
                    margin: 0.2rem 0;
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
                    background: #0a0f0c;
                    color: #fff;
                    padding: 0.65rem 0.75rem;
                }
                .lhr-btn {
                    border-radius: 10px;
                    border: 1px solid rgba(255, 255, 255, 0.14);
                    background: rgba(255, 255, 255, 0.04);
                    color: #eef7f0;
                    font-weight: 800;
                    padding: 0.42rem 0.7rem;
                    cursor: pointer;
                    text-decoration: none;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.84rem;
                }
                .lhr-btn-ghost {
                    border-color: rgba(57, 255, 20, 0.35);
                    color: var(--accent);
                }
                .lhr-btn-go {
                    border: none;
                    color: #061008;
                    background: linear-gradient(135deg, #39ff14, #b8ff5a);
                }
                .lhr-btn-lg {
                    padding: 0.7rem 1.05rem;
                    font-size: 0.95rem;
                }
                .lhr-btn-end {
                    border-color: rgba(255, 180, 70, 0.55);
                    color: #ffd59a;
                }
                .lhr-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }
            `}</style>
        </div>
    );
}
