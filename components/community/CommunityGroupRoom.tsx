import { useEffect, useRef, useState } from 'react';
import type { GroupMessage, SocialProfile, StudyGroup } from '../../utils/socialTypes';
import {
    ensureGroupWhiteboard,
    groupCallUrl,
    sendGroupMessage,
    subscribeGroupMessages,
} from '../../utils/groupRoom';
import { useLang } from '../../utils/i18n';
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
    const { t } = useLang();
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
            onToast(e?.message || t('community.toast.messageError'));
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
            onToast(e?.message || t('community.groupRoom.boardError'));
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
                    {t('community.groupRoom.back')}
                </button>
                <div className="mm-group-room-title">
                    <h2>{group.name}</h2>
                    <p>
                        {t('community.groupRoom.members', {
                            topic: group.topic || t('community.groupRoom.studyGroup'),
                            count: String(group.memberCount),
                        })}
                    </p>
                </div>
            </div>

            <p className="mm-group-room-hint">{t('community.groupRoom.hint')}</p>

            <div className="mm-group-room-tabs" role="tablist">
                <button
                    type="button"
                    className={tab === 'chat' ? 'is-on' : ''}
                    onClick={() => setTab('chat')}
                >
                    {t('community.groupRoom.chat')}
                </button>
                <button type="button" className={tab === 'call' ? 'is-on' : ''} onClick={startCall}>
                    {t('community.groupRoom.call')}
                </button>
                <button
                    type="button"
                    className={tab === 'board' ? 'is-on' : ''}
                    onClick={() => {
                        setTab('board');
                    }}
                >
                    {t('community.groupRoom.board')}
                </button>
            </div>

            {tab === 'chat' && (
                <div className="mm-group-chat">
                    <div className="mm-group-chat-list">
                        {messages.length === 0 && (
                            <p className="mm-social-muted">{t('community.groupRoom.emptyChat')}</p>
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
                            placeholder={t('community.groupRoom.placeholder')}
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
                            {t('common.send')}
                        </button>
                    </div>
                </div>
            )}

            {tab === 'call' && (
                <div className="mm-group-call">
                    {!callOpen ? (
                        <div className="mm-group-call-start">
                            <p>{t('community.groupRoom.callDesc')}</p>
                            <button type="button" className="mm-ig-btn is-primary" onClick={startCall}>
                                {t('community.groupRoom.startCall')}
                            </button>
                            <a
                                className="mm-ig-link"
                                href={groupCallUrl(group.id)}
                                target="_blank"
                                rel="noreferrer"
                            >
                                {t('community.groupRoom.openNewTab')}
                            </a>
                        </div>
                    ) : (
                        <>
                            <div className="mm-group-call-bar">
                                <span>{t('community.groupRoom.liveCall')}</span>
                                <button
                                    type="button"
                                    className="mm-ig-btn"
                                    onClick={() => setCallOpen(false)}
                                >
                                    {t('community.groupRoom.closeCall')}
                                </button>
                            </div>
                            <iframe
                                className="mm-group-call-frame"
                                title={t('community.groupRoom.callTitle', { name: group.name })}
                                allow="camera; microphone; fullscreen; display-capture; autoplay"
                                src={`${groupCallUrl(group.id)}#config.prejoinPageEnabled=true`}
                            />
                        </>
                    )}
                </div>
            )}

            {tab === 'board' && (
                <div className="mm-group-board">
                    <p>{t('community.groupRoom.boardDesc')}</p>
                    <button
                        type="button"
                        className="mm-ig-btn is-primary"
                        onClick={() => void openBoard()}
                        disabled={busy}
                    >
                        {group.whiteboardId ? t('community.groupRoom.openBoard') : t('community.groupRoom.createBoard')}
                    </button>
                    {group.whiteboardId && (
                        <p className="mm-social-muted">
                            {t('community.groupRoom.boardId')} <code>{group.whiteboardId}</code>
                        </p>
                    )}
                </div>
            )}
        </div>
    );
}
