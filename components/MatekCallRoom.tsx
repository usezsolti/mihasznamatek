import { useEffect, useRef, useState } from 'react';
import {
    startLessonCall,
    type CallStatus,
    type LessonCallControls,
} from '../utils/webrtcLessonCall';

type Props = {
    roomId: string;
    uid: string;
    displayName: string;
    active: boolean;
    onClose?: () => void;
};

const STATUS_HU: Record<CallStatus, string> = {
    idle: 'Készenlét',
    media: 'Kamera / mikrofon…',
    waiting: 'Várakozás a másik félre',
    connecting: 'Kapcsolódás…',
    connected: 'Kapcsolat él',
    ended: 'Hívás vége',
    error: 'Hiba',
};

/** Saját Mihaszna hívás UI — WebRTC + képernyőmegosztás. */
export default function MatekCallRoom({ roomId, uid, displayName, active, onClose }: Props) {
    const localRef = useRef<HTMLVideoElement | null>(null);
    const remoteRef = useRef<HTMLVideoElement | null>(null);
    const controlsRef = useRef<LessonCallControls | null>(null);
    const [status, setStatus] = useState<CallStatus>('idle');
    const [detail, setDetail] = useState('');
    const [muted, setMuted] = useState(false);
    const [cameraOff, setCameraOff] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [busy, setBusy] = useState(false);
    const [ready, setReady] = useState(false);

    useEffect(() => {
        if (!active) return;
        let cancelled = false;
        setReady(false);
        setSharing(false);

        const run = async () => {
            if (!localRef.current || !remoteRef.current) return;
            setBusy(true);
            try {
                const controls = await startLessonCall({
                    roomId,
                    uid,
                    displayName,
                    localVideo: localRef.current,
                    remoteVideo: remoteRef.current,
                    onStatus: (s, d) => {
                        if (cancelled) return;
                        setStatus(s);
                        setDetail(d || '');
                        if (d === 'Kamera nézet') setSharing(false);
                        if (d === 'Képernyő megosztva') setSharing(true);
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
    }, [active, roomId, uid, displayName]);

    if (!active) return null;

    const hangUp = async () => {
        setBusy(true);
        try {
            await controlsRef.current?.stop();
            controlsRef.current = null;
            setStatus('ended');
            setSharing(false);
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
                    setDetail(res.error || 'Megosztás sikertelen');
                } else {
                    setSharing(true);
                }
            }
        } finally {
            setBusy(false);
        }
    };

    const statusLine = sharing
        ? 'Képernyő megosztva'
        : status === 'connected'
          ? 'Kapcsolat él'
          : STATUS_HU[status];

    return (
        <div className="mcr">
            <div className="mcr-stage">
                <video ref={remoteRef} className="mcr-remote" autoPlay playsInline />
                {status !== 'connected' ? (
                    <div className="mcr-overlay">
                        <strong>{STATUS_HU[status]}</strong>
                        {detail ? <span>{detail}</span> : null}
                        {status === 'waiting' ? (
                            <span className="mcr-hint">
                                A diák a lobby linken lép be. Amint csatlakozik, a kép megjelenik.
                            </span>
                        ) : null}
                        {status === 'connecting' ? (
                            <span className="mcr-hint">WebRTC kapcsolat felépítése…</span>
                        ) : null}
                        {status === 'error' && /rules-setup|Firestore|jogosult/i.test(detail) ? (
                            <a className="mcr-rules-link" href="/rules-setup">
                                Rules megnyitása →
                            </a>
                        ) : null}
                    </div>
                ) : null}
                <video
                    ref={localRef}
                    className={`mcr-local ${cameraOff && !sharing ? 'is-off' : ''} ${sharing ? 'is-share' : ''}`}
                    autoPlay
                    playsInline
                    muted
                />
                {sharing ? <div className="mcr-cam-off mcr-share-badge">Megosztás</div> : null}
                {cameraOff && !sharing ? <div className="mcr-cam-off">Kamera ki</div> : null}
            </div>

            <div className="mcr-bar">
                <div className="mcr-status">
                    <i
                        className={
                            status === 'connected' ? 'ok' : status === 'error' ? 'bad' : 'wait'
                        }
                    />
                    {statusLine}
                    {detail && status !== 'connected' ? ` · ${detail}` : ''}
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
                        {muted ? 'Mic be' : 'Némít'}
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
                        {cameraOff ? 'Kamera be' : 'Kamera ki'}
                    </button>
                    <button
                        type="button"
                        className={`mcr-btn mcr-btn-share ${sharing ? 'is-on' : ''}`}
                        disabled={busy || !ready}
                        onClick={() => void toggleShare()}
                    >
                        {sharing ? 'Megosztás stop' : 'Képernyő'}
                    </button>
                    <button
                        type="button"
                        className="mcr-btn mcr-btn-hang"
                        disabled={busy}
                        onClick={() => void hangUp()}
                    >
                        Kilépés
                    </button>
                </div>
            </div>

            <style jsx>{`
                .mcr {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-height: 0;
                    height: 100%;
                    background: #070a0e;
                    color: #e8f0ea;
                }
                .mcr-stage {
                    position: relative;
                    flex: 1;
                    min-height: 280px;
                    background: #000;
                    overflow: hidden;
                }
                .mcr-remote {
                    width: 100%;
                    height: 100%;
                    object-fit: contain;
                    background: #0a0e13;
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
                    background: #111;
                    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.45);
                    z-index: 2;
                }
                .mcr-local.is-share {
                    border-color: rgba(80, 180, 255, 0.7);
                    object-fit: contain;
                    background: #000;
                }
                .mcr-local.is-off {
                    opacity: 0.35;
                }
                .mcr-cam-off {
                    position: absolute;
                    right: 0.75rem;
                    bottom: calc(0.75rem + 4.5rem);
                    z-index: 3;
                    font-size: 0.72rem;
                    font-weight: 700;
                    color: #ffb4b4;
                    background: rgba(0, 0, 0, 0.65);
                    padding: 0.2rem 0.45rem;
                    border-radius: 6px;
                }
                .mcr-share-badge {
                    color: #9fd4ff;
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
                    .mcr-local {
                        width: 34%;
                        max-width: 140px;
                    }
                    .mcr-stage {
                        min-height: 220px;
                    }
                }
            `}</style>
        </div>
    );
}
