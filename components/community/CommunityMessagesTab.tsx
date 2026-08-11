import type { ConversationPreview, DirectMessage } from '../../utils/socialTypes';
import CommunityAvatar from './CommunityAvatar';

type CommunityMessagesTabProps = {
    uid: string;
    conversations: ConversationPreview[];
    activeChat: ConversationPreview | null;
    messages: DirectMessage[];
    msgDraft: string;
    onMsgDraftChange: (value: string) => void;
    onSelectConversation: (c: ConversationPreview) => void;
    onSendMsg: () => void;
    busy: boolean;
};

export default function CommunityMessagesTab({
    uid,
    conversations,
    activeChat,
    messages,
    msgDraft,
    onMsgDraftChange,
    onSelectConversation,
    onSendMsg,
    busy,
}: CommunityMessagesTabProps) {
    return (
        <div className="mm-social-panel mm-social-messages">
            <div className="mm-social-inbox">
                <h2>Bejövő</h2>
                {conversations.length === 0 && <p className="mm-social-muted">Még nincs beszélgetés.</p>}
                {conversations.map((c) => (
                    <button
                        key={c.id}
                        type="button"
                        className={`mm-social-inbox-row ${activeChat?.id === c.id ? 'is-on' : ''}`}
                        onClick={() => onSelectConversation(c)}
                    >
                        <CommunityAvatar url={c.otherPhoto} name={c.otherName} size={36} />
                        <span>
                            <strong>{c.otherName}</strong>
                            <small>{c.lastMessage || 'Új chat'}</small>
                        </span>
                    </button>
                ))}
            </div>
            <div className="mm-social-thread">
                {activeChat ? (
                    <>
                        <div className="mm-social-thread-head">
                            <strong>{activeChat.otherName}</strong>
                        </div>
                        <div className="mm-social-thread-list">
                            {messages.map((m) => (
                                <div
                                    key={m.id}
                                    className={`mm-social-bubble ${m.senderId === uid ? 'mine' : ''}`}
                                >
                                    {m.text}
                                </div>
                            ))}
                        </div>
                        <div className="mm-social-comment-compose">
                            <input
                                value={msgDraft}
                                onChange={(e) => onMsgDraftChange(e.target.value)}
                                placeholder="Üzenet…"
                                maxLength={500}
                                onKeyDown={(e) => {
                                    if (e.key === 'Enter') onSendMsg();
                                }}
                            />
                            <button type="button" onClick={onSendMsg} disabled={busy || !msgDraft.trim()}>
                                Küld
                            </button>
                        </div>
                    </>
                ) : (
                    <p className="mm-social-muted">
                        Válassz beszélgetést, vagy írj valakinek a feedről / felfedezésből.
                    </p>
                )}
            </div>
        </div>
    );
}
