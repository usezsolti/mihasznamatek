import { useEffect, useRef, useState } from 'react';
import type { GroupMessage, SocialProfile, StudyGroup } from '../../utils/socialTypes';
import {
    ensureGroupWhiteboard,
    groupCallUrl,
    sendGroupMessage,
    subscribeGroupMessages,
} from '../../utils/groupRoom';
import CommunityAvatar from './CommunityAvatar';

type RoomTab = 'chat' | 'call' | 'board';

type CommunityGroupRoomProps = {
    me: SocialProfile;
    group: StudyGroup;
    onBack: () => void;
    onGroupUpdated: (next: StudyGroup) => void;
    onToast: (msg: string) => void;
};

export default function CommunityGroupRoom({
    me,
    group,
    onBack,
    onGroupUpdated,
    onToast,
}: CommunityGroupRoomProps) {
    const [tab, setTab] = useState<RoomTab>('chat');
    const [messages, setMessages] = useState<GroupMessage[]>([]);
    const [draft, setDraft] = useState('');
    const [busy, setBusy] = useState(false);
    const [callOpen, setCallOpen] = useState(false);
    const bottomRef = useRef<HTMLDivElement | null>(null);

    useEffect(() => {
        return subscribeGroupMessages(group.id, setMessages);
    }, [group.id]);

    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages.length, tab]);

    const send = async () => {
        if (!draft.trim() || busy) return;
        setBusy(true);
        try {
            const text = draft;
            setDraft('');
            await sendGroupMessage(group, me, text);
        } catch (e: any) {
            onToast(e?.message || 'Üzenet hiba');
        } finally {
            setBusy(false);
        }
    };

    const openBoard = async () => {
        if (busy) return;
        setBusy(true);
        try {
            const res = await ensureGroupWhiteboard(group, me.uid);
            onGroupUpdated(res.group);
            if (res.warning) onToast(res.warning);
            window.open(`/whiteboard?board=${encodeURIComponent(res.whiteboardId)}`, '_blank');
        } catch (e: any) {
            onToast(e?.message || 'Tábla hiba');
        } finally {
            setBusy(false);
        }
    };

    const startCall = () => {
        setTab('call');
        setCallOpen(true);
    };

    return (
        <div className="mm-group-room">
            <div className="mm-group-room-head">
                <button type="button" className="mm-ig-btn" onClick={onBack}>
                    ← Vissza
                </button>
                <div className="mm-group-room-title">
                    <h2>{group.name}</h2>
                    <p>
                        {group.topic || 'Tanulócsoport'} · {group.memberCount} tag
                    </p>
                </div>
            </div>

            <p className="mm-group-room-hint">
                Itt tudtok írni egymásnak, közös táblán számolni, és csoportos hívást indítani.
            </p>

            <div className="mm-group-room-tabs" role="tablist">
                <button
                    type="button"
                    className={tab === 'chat' ? 'is-on' : ''}
                    onClick={() => setTab('chat')}
                >
                    Csevegés
                </button>
                <button type="button" className={tab === 'call' ? 'is-on' : ''} onClick={startCall}>
                    Hívás
                </button>
                <button
                    type="button"
                    className={tab === 'board' ? 'is-on' : ''}
                    onClick={() => {
                        setTab('board');
                    }}
                >
                    Tábla
                </button>
            </div>

            {tab === 'chat' && (
                <div className="mm-group-chat">
                    <div className="mm-group-chat-list">
                        {messages.length === 0 && (
                            <p className="mm-social-muted">Még nincs üzenet — írjatok valamit!</p>
                        )}
                        {messages.map((m) => {
                            const mine = m.senderId === me.uid;
                            return (
                                <div
                                    key={m.id}
                                    className={`mm-group-bubble${mine ? ' is-mine' : ''}`}
                                >
                                    {!mine && (
                                        <CommunityAvatar
                                            url={m.senderPhoto}
                                            name={m.senderName}
                                            size={28}
                                        />
                                    )}
                                    <div>
                                        {!mine && <strong>{m.senderName}</strong>}
                                        <p>{m.text}</p>
                                    </div>
                                </div>
                            );
                        })}
                        <div ref={bottomRef} />
                    </div>
                    <div className="mm-group-chat-compose">
                        <input
                            value={draft}
                            onChange={(e) => setDraft(e.target.value)}
                            placeholder="Üzenet a csoportnak…"
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
                            className="mm-ig-btn is-primary"
                            onClick={() => void send()}
                            disabled={busy || !draft.trim()}
                        >
                            Küldés
                        </button>
                    </div>
                </div>
            )}

            {tab === 'call' && (
                <div className="mm-group-call">
                    {!callOpen ? (
                        <div className="mm-group-call-start">
                            <p>Csoportos hang-/videóhívás (Jitsi Meet).</p>
                            <button type="button" className="mm-ig-btn is-primary" onClick={startCall}>
                                Hívás indítása / csatlakozás
                            </button>
                            <a
                                className="mm-ig-link"
                                href={groupCallUrl(group.id)}
                                target="_blank"
                                rel="noreferrer"
                            >
                                Megnyitás új lapon
                            </a>
                        </div>
                    ) : (
                        <>
                            <div className="mm-group-call-bar">
                                <span>Élő hívás</span>
                                <button
                                    type="button"
                                    className="mm-ig-btn"
                                    onClick={() => setCallOpen(false)}
                                >
                                    Hívás bezárása
                                </button>
                            </div>
                            <iframe
                                className="mm-group-call-frame"
                                title={`${group.name} hívás`}
                                allow="camera; microphone; fullscreen; display-capture; autoplay"
                                src={`${groupCallUrl(group.id)}#config.prejoinPageEnabled=true`}
                            />
                        </>
                    )}
                </div>
            )}

            {tab === 'board' && (
                <div className="mm-group-board">
                    <p>
                        Közös matek tábla a csoportnak. Mindenki ugyanazt a táblát látja és rajzolhat
                        rá.
                    </p>
                    <button
                        type="button"
                        className="mm-ig-btn is-primary"
                        onClick={() => void openBoard()}
                        disabled={busy}
                    >
                        {group.whiteboardId ? 'Tábla megnyitása' : 'Tábla létrehozása és megnyitás'}
                    </button>
                    {group.whiteboardId && (
                        <p className="mm-social-muted">
                            Board ID: <code>{group.whiteboardId}</code>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
