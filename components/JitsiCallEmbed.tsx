import { useEffect, useRef, useState } from 'react';

type Props = {
    roomName: string;
    displayName?: string;
    /** When false, tear down the meeting UI but keep the shell. */
    active: boolean;
    className?: string;
    compactChrome?: boolean;
    onClose?: () => void;
};

declare global {
    interface Window {
        JitsiMeetExternalAPI?: new (
            domain: string,
            options: Record<string, unknown>
        ) => {
            dispose: () => void;
            executeCommand: (cmd: string, ...args: unknown[]) => void;
            addListener: (event: string, fn: (...args: unknown[]) => void) => void;
            removeListener: (event: string, fn: (...args: unknown[]) => void) => void;
        };
    }
}

const EXTERNAL_API = 'https://meet.jit.si/external_api.js';

let apiScriptPromise: Promise<void> | null = null;

function loadJitsiExternalApi(): Promise<void> {
    if (typeof window === 'undefined') return Promise.reject(new Error('SSR'));
    if (window.JitsiMeetExternalAPI) return Promise.resolve();
    if (apiScriptPromise) return apiScriptPromise;
    apiScriptPromise = new Promise((resolve, reject) => {
        const existing = document.querySelector<HTMLScriptElement>(
            `script[src="${EXTERNAL_API}"]`
        );
        if (existing) {
            existing.addEventListener('load', () => resolve());
            existing.addEventListener('error', () => reject(new Error('Jitsi script hiba')));
            if (window.JitsiMeetExternalAPI) resolve();
            return;
        }
        const script = document.createElement('script');
        script.src = EXTERNAL_API;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error('Jitsi script betöltés sikertelen'));
        document.body.appendChild(script);
    });
    return apiScriptPromise;
}

function measureHostHeight(el: HTMLElement | null): number {
    if (!el) return 640;
    const rect = el.getBoundingClientRect();
    const fromRect = Math.floor(rect.height);
    if (fromRect >= 360) return fromRect;
    return Math.max(560, Math.floor(window.innerHeight * 0.62));
}

/** Jitsi hívás RNNoise zajszűréssel (meet.jit.si). */
export default function JitsiCallEmbed({
    roomName,
    displayName = 'Vendég',
    active,
    className,
    compactChrome = false,
    onClose,
}: Props) {
    const hostRef = useRef<HTMLDivElement | null>(null);
    const apiRef = useRef<InstanceType<NonNullable<typeof window.JitsiMeetExternalAPI>> | null>(
        null
    );
    const onCloseRef = useRef(onClose);
    onCloseRef.current = onClose;
    const [status, setStatus] = useState('Hívás előkészítése…');
    const [nsOn, setNsOn] = useState(false);
    const [fallbackSrc, setFallbackSrc] = useState<string | null>(null);

    useEffect(() => {
        if (!active || !roomName) return;
        let cancelled = false;

        const enableNoise = (api: NonNullable<typeof apiRef.current>) => {
            try {
                api.executeCommand('setNoiseSuppressionEnabled', { enabled: true });
                setNsOn(true);
                setStatus('Zajszűrés bekapcsolva (RNNoise).');
            } catch {
                setStatus(
                    'Hívás él. Zajszűrés: a menüben a „Noise suppression” gombbal kapcsold be.'
                );
            }
        };

        void (async () => {
            try {
                await loadJitsiExternalApi();
                if (cancelled || !hostRef.current || !window.JitsiMeetExternalAPI) return;

                if (apiRef.current) {
                    try {
                        apiRef.current.dispose();
                    } catch {
                        /* ignore */
                    }
                    apiRef.current = null;
                }
                hostRef.current.innerHTML = '';

                // Explicit pixel height — % height leaves a black void (prejoin clipped).
                const height = measureHostHeight(hostRef.current);

                const api = new window.JitsiMeetExternalAPI('meet.jit.si', {
                    roomName,
                    parentNode: hostRef.current,
                    width: '100%',
                    height,
                    userInfo: { displayName: displayName.slice(0, 60) },
                    configOverwrite: {
                        prejoinPageEnabled: true,
                        prejoinConfig: {
                            enabled: true,
                            hideDisplayName: false,
                        },
                        disableNS: false,
                        disableAEC: false,
                        disableAGC: false,
                        enableNoAudioDetection: true,
                        enableNoisyMicDetection: true,
                        startWithAudioMuted: false,
                        startWithVideoMuted: false,
                    },
                    interfaceConfigOverwrite: {
                        SHOW_JITSI_WATERMARK: false,
                        SHOW_WATERMARK_FOR_GUESTS: false,
                        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true,
                        MOBILE_APP_PROMO: false,
                        SHOW_CHROME_EXTENSION_BANNER: false,
                    },
                });
                apiRef.current = api;

                api.addListener('videoConferenceJoined', () => enableNoise(api));
                api.addListener('readyToClose', () => {
                    onCloseRef.current?.();
                });

                setStatus('Csatlakozz — bal oldalon a név + Csatlakozás gomb. Zajszűrés utána bekapcsol.');

                const onResize = () => {
                    const node = hostRef.current;
                    const iframe = node?.querySelector('iframe');
                    if (!node || !iframe) return;
                    const next = measureHostHeight(node.parentElement as HTMLElement | null) || measureHostHeight(node);
                    node.style.height = `${next}px`;
                    iframe.style.height = `${next}px`;
                    iframe.style.width = '100%';
                };
                window.addEventListener('resize', onResize);
                // Initial paint after iframe mounts
                requestAnimationFrame(onResize);
                setTimeout(onResize, 400);

                if (cancelled) {
                    window.removeEventListener('resize', onResize);
                } else {
                    (api as any).__mmResize = onResize;
                }
            } catch (err: any) {
                if (cancelled) return;
                setFallbackSrc(jitsiOpenUrl(roomName));
                setStatus(
                    String(err?.message || err).slice(0, 120) ||
                        'Külső API nem elérhető — iframe mód.'
                );
            }
        })();

        return () => {
            cancelled = true;
            const resize = (apiRef.current as any)?.__mmResize as (() => void) | undefined;
            if (resize) window.removeEventListener('resize', resize);
            if (apiRef.current) {
                try {
                    apiRef.current.dispose();
                } catch {
                    /* ignore */
                }
                apiRef.current = null;
            }
            if (hostRef.current) hostRef.current.innerHTML = '';
        };
    }, [active, roomName, displayName]);

    if (!active) return null;

    return (
        <div className={className || 'jitsi-embed'}>
            {!compactChrome ? (
                <div className="jitsi-embed-bar">
                    <span>
                        {nsOn
                            ? 'Zajszűrés: be'
                            : 'Zajszűrés: csatlakozás után'}
                    </span>
                    <button
                        type="button"
                        className="jitsi-embed-btn"
                        onClick={() => {
                            const api = apiRef.current;
                            if (!api) return;
                            try {
                                api.executeCommand('setNoiseSuppressionEnabled', { enabled: true });
                                setNsOn(true);
                                setStatus('Zajszűrés újra bekapcsolva.');
                            } catch {
                                setStatus('Kapcsold be a Jitsi menüben: Noise suppression.');
                            }
                        }}
                    >
                        Zajszűrés be
                    </button>
                </div>
            ) : null}
            {!compactChrome && status ? <p className="jitsi-embed-status">{status}</p> : null}
            {fallbackSrc ? (
                <iframe
                    className="jitsi-embed-frame"
                    title="Hívás"
                    allow="camera; microphone; fullscreen; display-capture; autoplay"
                    src={fallbackSrc}
                />
            ) : (
                <div className="jitsi-embed-host" ref={hostRef} />
            )}
            <style jsx>{`
                .jitsi-embed {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    min-height: 0;
                    height: 100%;
                    background: #0a0e13;
                }
                .jitsi-embed-bar {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 0.5rem;
                    flex-wrap: wrap;
                    padding: 0.4rem 0.65rem;
                    background: rgba(12, 16, 22, 0.95);
                    border-bottom: 1px solid rgba(57, 255, 20, 0.2);
                    color: #e8f0ea;
                    font-size: 0.78rem;
                    font-weight: 700;
                    flex-shrink: 0;
                }
                .jitsi-embed-btn {
                    border: 1px solid rgba(57, 255, 20, 0.35);
                    background: rgba(57, 255, 20, 0.12);
                    color: #39ff14;
                    border-radius: 8px;
                    padding: 0.28rem 0.6rem;
                    font-weight: 700;
                    cursor: pointer;
                    font-size: 0.75rem;
                }
                .jitsi-embed-status {
                    margin: 0;
                    padding: 0.3rem 0.65rem;
                    font-size: 0.75rem;
                    color: #8b9a93;
                    background: rgba(12, 16, 22, 0.9);
                    flex-shrink: 0;
                }
                .jitsi-embed-host,
                .jitsi-embed-frame {
                    flex: 1 1 auto;
                    width: 100%;
                    min-height: 560px;
                    height: min(70vh, 720px);
                    border: 0;
                    background: #0a0e13;
                    position: relative;
                }
                .jitsi-embed-host :global(iframe) {
                    position: absolute !important;
                    inset: 0 !important;
                    width: 100% !important;
                    height: 100% !important;
                    border: 0 !important;
                    max-width: none !important;
                }
            `}</style>
        </div>
    );
}

export function jitsiOpenUrl(roomName: string): string {
    const hash = [
        'config.prejoinPageEnabled=true',
        'config.disableNS=false',
        'config.disableAEC=false',
        'config.disableAGC=false',
        'interfaceConfig.MOBILE_APP_PROMO=false',
    ].join('&');
    return `https://meet.jit.si/${encodeURIComponent(roomName)}#${hash}`;
}
