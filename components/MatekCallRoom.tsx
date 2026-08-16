import { useEffect, useRef, useState } from 'react';
import { useLang } from '../utils/i18n';
import {
    startLessonCall,
    type CallPeerRole,
    type CallShareState,
    type CallStatus,
    type LessonCallControls,
} from '../utils/webrtcLessonCall';

type Props = {
    roomId: string;
    uid: string;
    displayName: string;
    role?: CallPeerRole;
    active: boolean;
    onClose?: () => void;
};

function shareLabel(
    t: (key: string, vars?: Record<string, string>) => string,
    role: CallPeerRole | '',
    name: string,
    self: boolean
): string {
    if (self) {
        return role === 'teacher' ? t('call.shareYouTeacher') : t('call.shareYouStudent');
    }
    if (role === 'teacher') return t('call.shareTeacher');
    if (role === 'student') return t('call.shareStudent');
    if (name) return t('call.shareNamed', { name });
    return t('call.shareGeneric');
}

/** Saját Mihaszna hívás UI — WebRTC + képernyőmegosztás (nagy nézet + ki osztja). */
export default function MatekCallRoom({
    roomId,
    uid,
    displayName,
    role = 'student',
    active,
    onClose,
}: Props) {
    const { t } = useLang();
    const localRef = useRef<HTMLVideoElement | null>(null);
    const remoteRef = useRef<HTMLVideoElement | null>(null);
    const controlsRef = useRef<LessonCallControls | null>(null);
    const [status, setStatus] = useState<CallStatus>('idle');
    const [detail, setDetail] = useState('');
    const [muted, setMuted] = useState(false);
    const [cameraOff, setCameraOff] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [remoteSharing, setRemoteSharing] = useState(false);
    const [remoteName, setRemoteName] = useState('');
    const [remoteRole, setRemoteRole] = useState<CallPeerRole | ''>('');
    const [busy, setBusy] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!active) return;
        let cancelled = false;
        setReady(false);
        setSharing(false);
        setRemoteSharing(false);
        setRemoteName('');
        setRemoteRole('');

        const run = async () => {
            if (!localRef.current || !remoteRef.current) return;
            setBusy(true);
            try {
                const controls = await startLessonCall({
                    roomId,
                    uid,
                    displayName,
                    role,
                    localVideo: localRef.current,
                    remoteVideo: remoteRef.current,
                    onStatus: (s, d) => {
                        if (cancelled) return;
                        setStatus(s);
                        setDetail(d || '');
                    },
                    onShareState: (state: CallShareState) => {
                        if (cancelled) return;
                        setSharing(state.localSharing);
                        setRemoteSharing(state.remoteSharing);
                        setRemoteName(state.remoteName);
                        setRemoteRole(state.remoteRole);
                    },
                });
                if (cancelled) {
                    await controls.stop();
                    return;
                }
                controlsRef.current = controls;
                setReady(true);
            } catch (err: any) {
                if (!cancelled) {
                    setStatus('error');
                    setDetail(String(err?.message || err).slice(0, 160));
                    setReady(false);
                }
            } finally {
                if (!cancelled) setBusy(false);
            }
        };

        void run();

        return () => {
            cancelled = true;
            const c = controlsRef.current;
            controlsRef.current = null;
            setReady(false);
            void c?.stop();
        };
    }, [active, roomId, uid, displayName, role]);

    if (!active) return null;

    const hangUp = async () => {
        setBusy(true);
        try {
            await controlsRef.current?.stop();
            controlsRef.current = null;
            setStatus('ended');
            setSharing(false);
            setRemoteSharing(false);
            onClose?.();
        } finally {
            setBusy(false);
        }
    };

    const toggleShare = async () => {
        const c = controlsRef.current;
        if (!c) return;
        setBusy(true);
        try {
            if (c.isSharingScreen()) {
                await c.stopScreenShare();
                setSharing(false);
            } else {
                const res = await c.startScreenShare();
                if (!res.ok) {
                    setDetail(res.error || t('call.shareFail'));
                } else {
                    setSharing(true);
                }
            }
        } finally {
            setBusy(false);
        }
    };

    const anyoneSharing = sharing || remoteSharing;
    const focusLocalShare = sharing && !remoteSharing;
    const focusRemoteShare = remoteSharing;

    const bannerText = remoteSharing
        ? shareLabel(t, remoteRole, remoteName, false)
        : sharing
          ? shareLabel(t, role, displayName, true)
          : '';

    const statusHuKey: Record<CallStatus, string> = {
        idle: 'call.status.idle',
        media: 'call.status.media',
        waiting: 'call.status.waiting',
        connecting: 'call.status.connecting',
        connected: 'call.status.connected',
        ended: 'call.status.ended',
        error: 'call.status.error',
    };

    const statusLine = remoteSharing
        ? shareLabel(t, remoteRole, remoteName, false)
        : sharing
          ? shareLabel(t, role, displayName, true)
          : status === 'connected'
            ? t('call.status.connected')
            : t(statusHuKey[status]);

    return (
        <div
            className={`mcr ${anyoneSharing ? 'is-share-mode' : ''} ${
                status === 'connected' ? 'is-connected' : ''
            }`}
        >
            <div
                className={`mcr-stage ${focusLocalShare ? 'focus-local' : ''} ${
                    focusRemoteShare ? 'focus-remote' : ''
                }`}
            >
                {bannerText ? (
                    <div className="mcr-share-banner" role="status">
                        <span className="mcr-share-dot" />
                        {bannerText}
                    </div>
                ) : null}

                <video
                    ref={remoteRef}
                    className={`mcr-remote ${focusRemoteShare ? 'is-share-main' : ''} ${
                        focusLocalShare ? 'is-pip' : ''
                    }`}
                    autoPlay
                    playsInline
                />
                {/* Keep local video mounted for WebRTC; hide empty PiP until connected / sharing */}
                <video
                    ref={localRef}
                    className={`mcr-local ${cameraOff && !sharing ? 'is-off' : ''} ${
                        sharing ? 'is-share' : ''
                    } ${focusLocalShare ? 'is-share-main' : ''} ${
                        focusRemoteShare || !focusLocalShare ? 'is-pip' : ''
                    } ${
                        status !== 'connected' && !anyoneSharing ? 'is-hidden-pip' : ''
                    }`}
                    autoPlay
                    playsInline
                    muted
                />

                {status !== 'connected' && !anyoneSharing ? (
                    <div className="mcr-overlay">
                        <strong>{t(statusHuKey[status])}</strong>
                        {detail ? <span>{detail}</span> : null}
                        {status === 'waiting' ? (
                            <span className="mcr-hint">{t('call.waitHint')}</span>
                        ) : null}
                        {status === 'connecting' ? (
                            <span className="mcr-hint">{t('call.connectHint')}</span>
                        ) : null}
                        {status === 'error' && /rules-setup|firestore|jogosult/i.test(detail) ? (
                            <a className="mcr-rules-link" href="/rules-setup">
                                {t('call.rulesLink')}
                            </a>
                        ) : null}
                    </div>
                ) : null}

                {cameraOff && !sharing && !focusLocalShare ? (
                    <div className="mcr-cam-off">{t('call.camOffBadge')}</div>
                ) : null}
            </div>

            <div className="mcr-bar">
                <div className="mcr-status">
                    <i
                        className={
                            anyoneSharing
                                ? 'share'
                                : status === 'connected'
                                  ? 'ok'
                                  : status === 'error'
                                    ? 'bad'
                                    : 'wait'
                        }
                    />
                    {statusLine}
                    {detail && status !== 'connected' && !anyoneSharing ? ` · ${detail}` : ''}
                </div>
                <div className="mcr-actions">
                    <button
                        type="button"
                        className={`mcr-btn ${muted ? 'is-warn' : ''}`}
                        disabled={busy || !ready}
                        onClick={() => {
                            const next = !muted;
                            setMuted(next);
                            controlsRef.current?.setMuted(next);
                        }}
                    >
                        {muted ? t('call.micOn') : t('call.mute')}
                    </button>
                    <button
                        type="button"
                        className={`mcr-btn ${cameraOff ? 'is-warn' : ''}`}
                        disabled={busy || !ready || sharing}
                        onClick={() => {
                            const next = !cameraOff;
                            setCameraOff(next);
                            controlsRef.current?.setCameraOff(next);
                        }}
                    >
                        {cameraOff ? t('call.camOn') : t('call.camOff')}
                    </button>
                    <button
                        type="button"
                        className={`mcr-btn mcr-btn-share ${sharing ? 'is-on' : ''}`}
                        disabled={busy || !ready}
                        onClick={() => void toggleShare()}
                    >
                        {sharing ? t('call.shareStop') : t('call.share')}
                    </button>
                    <button
                        type="button"
                        className="mcr-btn mcr-btn-hang"
                        disabled={busy}
                        onClick={() => void hangUp()}
                    >
                        {t('call.hangup')}
                    </button>
                </div>
            </div>

            <style jsx>{`
                .mcr {
                    display: flex;
                    flex-direction: column;
                    background: #070a0e;
                    color: #e8f0ea;
                }
                .mcr-stage {
                    position: relative;
                    height: 320px;
                    background: #000;
                    overflow: hidden;
                }
                .mcr.is-share-mode .mcr-stage,
                .mcr.is-connected .mcr-stage {
                    height: min(52vh, 480px);
                }
                .mcr-share-banner {
                    position: absolute;
                    top: 0.65rem;
                    left: 50%;
                    transform: translateX(-50%);
                    z-index: 5;
                    display: inline-flex;
                    align-items: center;
                    gap: 0.45rem;
                    padding: 0.4rem 0.85rem;
                    border-radius: 999px;
                    font-size: 0.82rem;
                    font-weight: 800;
                    letter-spacing: 0.01em;
                    color: #e8f4ff;
                    background: rgba(12, 40, 72, 0.88);
                    border: 1px solid rgba(120, 190, 255, 0.45);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.35);
                    white-space: nowrap;
                    max-width: calc(100% - 1.5rem);
                }
                .mcr-share-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #5cbcff;
                    box-shadow: 0 0 10px #5cbcff;
                    animation: mcr-pulse 1.4s ease-in-out infinite;
                    flex-shrink: 0;
                }
                @keyframes mcr-pulse {
                    0%,
                    100% {
                        opacity: 1;
                    }
                    50% {
                        opacity: 0.45;
                    }
                }
                .mcr-remote,
                .mcr-local {
                    background: #0a0e13;
                }
                .mcr-remote {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                }
                .mcr-local {
                    position: absolute;
                    right: 0.75rem;
                    bottom: 0.75rem;
                    width: min(32%, 220px);
                    aspect-ratio: 4 / 3;
                    object-fit: cover;
                    border-radius: 12px;
                    border: 2px solid rgba(57, 255, 20, 0.45);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
                    z-index: 2;
                }
                .mcr-local.is-hidden-pip {
                    opacity: 0;
                    pointer-events: none;
                    width: 1px;
                    height: 1px;
                    border: none;
                    box-shadow: none;
                    right: 0;
                    bottom: 0;
                }
                .mcr-local.is-share {
                    border-color: rgba(80, 180, 255, 0.7);
                    object-fit: contain;
                    background: #000;
                }
                .mcr-local.is-off {
                    opacity: 0.35;
                }
                /* Távoli megosztás: nagy főképernyő */
                .mcr-stage.focus-remote .mcr-remote.is-share-main {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    background: #05070a;
                }
                .mcr-stage.focus-remote .mcr-local.is-pip {
                    width: min(26%, 168px);
                    aspect-ratio: 4 / 3;
                    object-fit: cover;
                }
                /* Saját megosztás: te vagy a nagy kép, a másik PiP */
                .mcr-stage.focus-local .mcr-local.is-share-main {
                    position: absolute;
                    inset: 0;
                    width: 100%;
                    height: 100%;
                    max-width: none;
                    aspect-ratio: auto;
                    border-radius: 0;
                    border: none;
                    object-fit: contain;
                    z-index: 1;
                    box-shadow: none;
                    background: #05070a;
                }
                .mcr-stage.focus-local .mcr-remote.is-pip {
                    position: absolute;
                    right: 0.75rem;
                    bottom: 0.75rem;
                    width: min(26%, 168px);
                    height: auto;
                    aspect-ratio: 4 / 3;
                    object-fit: cover;
                    border-radius: 12px;
                    border: 2px solid rgba(57, 255, 20, 0.45);
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
                    z-index: 3;
                }
                .mcr-cam-off {
                    position: absolute;
                    right: 0.75rem;
                    bottom: calc(0.75rem + 4.5rem);
                    z-index: 4;
                    font-size: 0.72rem;
                    font-weight: 700;
                    color: #ffb4b4;
                    background: rgba(0, 0, 0, 0.65);
                    padding: 0.2rem 0.45rem;
                    border-radius: 6px;
                }
                .mcr-overlay {
                    position: absolute;
                    inset: 0;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    gap: 0.45rem;
                    padding: 1.25rem;
                    text-align: center;
                    background: rgba(6, 10, 14, 0.72);
                    z-index: 1;
                }
                .mcr-overlay strong {
                    font-size: 1.1rem;
                    color: #39ff14;
                }
                .mcr-overlay span {
                    color: #a8b8b0;
                    font-size: 0.9rem;
                    max-width: 28rem;
                    line-height: 1.4;
                }
                .mcr-hint {
                    margin-top: 0.35rem;
                    font-size: 0.82rem !important;
                }
                .mcr-rules-link {
                    margin-top: 0.55rem;
                    color: #39ff14;
                    font-weight: 800;
                    font-size: 0.9rem;
                    text-decoration: underline;
                }
                .mcr-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 0.65rem;
                    flex-wrap: wrap;
                    padding: 0.55rem 0.75rem;
                    border-top: 1px solid rgba(57, 255, 20, 0.2);
                    background: rgba(12, 16, 22, 0.96);
                    flex-shrink: 0;
                }
                .mcr-status {
                    display: flex;
                    align-items: center;
                    gap: 0.4rem;
                    font-size: 0.82rem;
                    font-weight: 700;
                    color: #a8b8b0;
                    max-width: 100%;
                }
                .mcr-status i {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                    background: #666;
                    display: inline-block;
                    flex-shrink: 0;
                }
                .mcr-status i.ok {
                    background: #39ff14;
                    box-shadow: 0 0 8px #39ff14;
                }
                .mcr-status i.share {
                    background: #5cbcff;
                    box-shadow: 0 0 8px #5cbcff;
                }
                .mcr-status i.wait {
                    background: #ffd166;
                }
                .mcr-status i.bad {
                    background: #ff5a5a;
                }
                .mcr-actions {
                    display: flex;
                    gap: 0.4rem;
                    flex-wrap: wrap;
                }
                .mcr-btn {
                    border: 1px solid rgba(57, 255, 20, 0.35);
                    background: rgba(57, 255, 20, 0.1);
                    color: #39ff14;
                    font-weight: 700;
                    padding: 0.45rem 0.75rem;
                    border-radius: 9px;
                    cursor: pointer;
                    font-size: 0.82rem;
                }
                .mcr-btn.is-warn {
                    border-color: rgba(255, 180, 80, 0.5);
                    color: #ffc46a;
                    background: rgba(80, 50, 10, 0.35);
                }
                .mcr-btn-share.is-on {
                    border-color: rgba(80, 180, 255, 0.55);
                    color: #9fd4ff;
                    background: rgba(20, 60, 100, 0.45);
                }
                .mcr-btn-hang {
                    border-color: rgba(255, 90, 90, 0.55);
                    color: #ffd0d0;
                    background: linear-gradient(
                        135deg,
                        rgba(120, 20, 28, 0.95),
                        rgba(70, 12, 18, 0.98)
                    );
                    font-weight: 800;
                    box-shadow: 0 4px 14px rgba(180, 30, 40, 0.25);
                }
                .mcr-btn:disabled {
                    opacity: 0.45;
                    cursor: not-allowed;
                }
                @media (max-width: 700px) {
                    .mcr-local:not(.is-share-main),
                    .mcr-stage.focus-local .mcr-remote.is-pip,
                    .mcr-stage.focus-remote .mcr-local.is-pip {
                        width: 34%;
                        max-width: 140px;
                    }
                    .mcr-stage {
                        height: 240px;
                    }
                    .mcr.is-share-mode .mcr-stage,
                    .mcr.is-connected .mcr-stage {
                        height: min(42vh, 360px);
                    }
                    .mcr-share-banner {
                        font-size: 0.75rem;
                        padding: 0.35rem 0.65rem;
                    }
                }
            `}</style>
        </div>
    );
}
