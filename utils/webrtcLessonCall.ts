/** Saját 1:1 WebRTC hívás — Postgres poll signaling az óra szobához. */

import {
    apiDeleteAuth,
    apiGetAuth,
    apiPostAuth,
    apiPutAuth,
} from './apiClient';

export type CallStatus =
    | 'idle'
    | 'media'
    | 'waiting'
    | 'connecting'
    | 'connected'
    | 'ended'
    | 'error';

export type CallPeerRole = 'teacher' | 'student';

export type CallShareState = {
    localSharing: boolean;
    remoteSharing: boolean;
    remoteName: string;
    remoteRole: CallPeerRole | '';
};

export type LessonCallControls = {
    stop: () => Promise<void>;
    setMuted: (muted: boolean) => void;
    setCameraOff: (off: boolean) => void;
    startScreenShare: () => Promise<{ ok: boolean; error?: string }>;
    stopScreenShare: () => Promise<void>;
    isMuted: () => boolean;
    isCameraOff: () => boolean;
    isSharingScreen: () => boolean;
};

type SignalDoc = {
    id?: string;
    type: 'offer' | 'answer' | 'ice' | 'hangup';
    fromUid: string;
    sdp?: string;
    candidate?: string;
    createdAtMs: number;
};

type ParticipantDoc = {
    uid: string;
    displayName: string;
    role: CallPeerRole | string;
    sharingScreen: boolean;
    joinedAtMs: number;
};

const PARTICIPANT_POLL_MS = 1500;
const SIGNAL_POLL_MS = 1000;

function apiPath(roomId: string, segment: string) {
    return `/api/lesson/${encodeURIComponent(roomId)}/${segment}`;
}

function iceServers(): RTCIceServer[] {
    const servers: RTCIceServer[] = [
        { urls: 'stun:stun.l.google.com:19302' },
        { urls: 'stun:stun1.l.google.com:19302' },
    ];
    const turnUrl = String(process.env.NEXT_PUBLIC_TURN_URL || '').trim();
    const turnUser = String(process.env.NEXT_PUBLIC_TURN_USERNAME || '').trim();
    const turnPass = String(process.env.NEXT_PUBLIC_TURN_PASSWORD || '').trim();
    if (turnUrl) {
        servers.push({
            urls: turnUrl,
            username: turnUser || undefined,
            credential: turnPass || undefined,
        });
    }
    return servers;
}

async function getLocalStream(): Promise<MediaStream> {
    return navigator.mediaDevices.getUserMedia({
        audio: {
            echoCancellation: true,
            noiseSuppression: true,
            autoGainControl: true,
        },
        video: {
            facingMode: 'user',
            width: { ideal: 1280 },
            height: { ideal: 720 },
        },
    });
}

export async function startLessonCall(opts: {
    roomId: string;
    uid: string;
    displayName: string;
    role?: CallPeerRole;
    localVideo: HTMLVideoElement;
    remoteVideo: HTMLVideoElement;
    onStatus: (status: CallStatus, detail?: string) => void;
    onShareState?: (state: CallShareState) => void;
}): Promise<LessonCallControls> {
    if (!navigator.mediaDevices?.getUserMedia) {
        opts.onStatus('error', 'A böngésző nem támogatja a kamerát/mikrofont');
        throw new Error('getUserMedia hiányzik');
    }

    const { roomId, uid, displayName, localVideo, remoteVideo, onStatus } = opts;
    const role: CallPeerRole = opts.role === 'teacher' ? 'teacher' : 'student';

    let pc: RTCPeerConnection | null = null;
    let localStream: MediaStream | null = null;
    let screenStream: MediaStream | null = null;
    let cameraTrack: MediaStreamTrack | null = null;
    let muted = false;
    let cameraOff = false;
    let sharingScreen = false;
    let remoteSharing = false;
    let remoteName = '';
    let remoteRole: CallPeerRole | '' = '';
    let stopped = false;
    let makingOffer = false;
    let ignoreOffer = false;
    let offerSent = false;
    const polite = true;
    const pendingIce: RTCIceCandidateInit[] = [];
    const timers: ReturnType<typeof setInterval>[] = [];
    const processedSignalIds = new Set<string>();
    let signalSinceMs = Date.now() - 5000;

    const publishShareState = () => {
        opts.onShareState?.({
            localSharing: sharingScreen,
            remoteSharing,
            remoteName,
            remoteRole,
        });
    };

    const postSignal = async (doc: Omit<SignalDoc, 'id'>) => {
        await apiPostAuth(apiPath(roomId, 'signals'), doc);
    };

    const writeShareFlag = async (on: boolean) => {
        sharingScreen = on;
        publishShareState();
        try {
            await apiPutAuth(apiPath(roomId, 'participants'), {
                displayName: displayName.slice(0, 80),
                role,
                sharingScreen: on,
            });
        } catch {
            /* offline — UI still updates locally */
        }
    };

    const findVideoSender = () => {
        if (!pc) return null;
        const withVideo = pc.getSenders().find((s) => s.track?.kind === 'video');
        if (withVideo) return withVideo;
        return null;
    };

    const applyLocalPreview = (stream: MediaStream | null) => {
        localVideo.srcObject = stream;
        void localVideo.play().catch(() => undefined);
    };

    const restoreCameraTrack = async () => {
        const sender = findVideoSender();
        if (screenStream) {
            screenStream.getTracks().forEach((t) => t.stop());
            screenStream = null;
        }
        await writeShareFlag(false);
        if (sender && cameraTrack && cameraTrack.readyState === 'live') {
            await sender.replaceTrack(cameraTrack);
            if (localStream) {
                const old = localStream.getVideoTracks()[0];
                if (old && old !== cameraTrack) {
                    localStream.removeTrack(old);
                    old.stop();
                }
                if (!localStream.getVideoTracks().includes(cameraTrack)) {
                    localStream.addTrack(cameraTrack);
                }
                cameraTrack.enabled = !cameraOff;
                applyLocalPreview(localStream);
            }
        } else if (localStream) {
            applyLocalPreview(localStream);
        }
        onStatus(
            pc?.connectionState === 'connected' ? 'connected' : 'waiting',
            'Kamera nézet'
        );
    };

    const stopScreenShare = async () => {
        await restoreCameraTrack();
    };

    const startScreenShare = async (): Promise<{ ok: boolean; error?: string }> => {
        if (!navigator.mediaDevices?.getDisplayMedia) {
            return { ok: false, error: 'A böngésző nem támogatja a képernyőmegosztást.' };
        }
        try {
            const display = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    frameRate: { ideal: 15, max: 30 },
                    width: { ideal: 1920 },
                    height: { ideal: 1080 },
                },
                audio: false,
            });
            const screenTrack = display.getVideoTracks()[0];
            if (!screenTrack) {
                display.getTracks().forEach((t) => t.stop());
                return { ok: false, error: 'Nincs képernyő sáv.' };
            }

            const conn = ensurePc();
            let sender = conn.getSenders().find((s) => s.track?.kind === 'video');
            if (!sender) {
                if (localStream) {
                    conn.addTrack(screenTrack, localStream);
                    sender = conn.getSenders().find((s) => s.track === screenTrack) || null;
                }
            }
            if (!cameraTrack && localStream) {
                cameraTrack = localStream.getVideoTracks()[0] || null;
            }
            if (sender) {
                await sender.replaceTrack(screenTrack);
            } else {
                display.getTracks().forEach((t) => t.stop());
                return { ok: false, error: 'Nincs video kapcsolat a megosztáshoz.' };
            }

            if (screenStream) {
                screenStream.getTracks().forEach((t) => t.stop());
            }
            screenStream = display;
            applyLocalPreview(display);
            await writeShareFlag(true);
            onStatus(
                pc?.connectionState === 'connected' ? 'connected' : 'waiting',
                'Képernyő megosztva'
            );

            screenTrack.onended = () => {
                void restoreCameraTrack();
            };
            return { ok: true };
        } catch (err: any) {
            const name = String(err?.name || '');
            if (name === 'NotAllowedError') {
                return { ok: false, error: 'Képernyőmegosztás elutasítva.' };
            }
            return { ok: false, error: String(err?.message || err).slice(0, 120) };
        }
    };

    const flushIce = async (conn: RTCPeerConnection) => {
        while (pendingIce.length && conn.remoteDescription) {
            const c = pendingIce.shift();
            if (!c) break;
            try {
                await conn.addIceCandidate(c);
            } catch {
                /* ignore */
            }
        }
    };

    const cleanupSignals = async () => {
        try {
            await apiDeleteAuth(apiPath(roomId, 'signals'));
        } catch {
            /* ignore */
        }
    };

    const stop = async () => {
        if (stopped) return;
        stopped = true;
        onStatus('ended');
        timers.forEach((t) => clearInterval(t));
        timers.length = 0;
        try {
            await postSignal({
                type: 'hangup',
                fromUid: uid,
                createdAtMs: Date.now(),
            });
        } catch {
            /* ignore */
        }
        try {
            await apiDeleteAuth(apiPath(roomId, 'participants'));
        } catch {
            /* ignore */
        }
        await cleanupSignals();
        if (pc) {
            try {
                pc.close();
            } catch {
                /* ignore */
            }
            pc = null;
        }
        if (screenStream) {
            screenStream.getTracks().forEach((t) => t.stop());
            screenStream = null;
        }
        if (localStream) {
            localStream.getTracks().forEach((t) => t.stop());
            localStream = null;
        }
        cameraTrack = null;
        sharingScreen = false;
        localVideo.srcObject = null;
        remoteVideo.srcObject = null;
    };

    const ensurePc = () => {
        if (pc) return pc;
        pc = new RTCPeerConnection({ iceServers: iceServers() });

        pc.onicecandidate = (ev) => {
            if (!ev.candidate || stopped) return;
            void postSignal({
                type: 'ice',
                fromUid: uid,
                candidate: JSON.stringify(ev.candidate.toJSON()),
                createdAtMs: Date.now(),
            });
        };

        pc.ontrack = (ev) => {
            const [stream] = ev.streams;
            if (stream) {
                remoteVideo.srcObject = stream;
                void remoteVideo.play().catch(() => undefined);
                const vt = stream.getVideoTracks()[0];
                if (vt) {
                    const sniff = () => {
                        try {
                            const settings = vt.getSettings?.() as { displaySurface?: string };
                            if (settings?.displaySurface) {
                                remoteSharing = true;
                                publishShareState();
                            }
                        } catch {
                            /* ignore */
                        }
                    };
                    sniff();
                    vt.addEventListener('unmute', sniff);
                }
            }
            onStatus('connected', 'Kapcsolat él');
        };

        pc.onconnectionstatechange = () => {
            const state = pc?.connectionState;
            if (state === 'connected') onStatus('connected');
            if (state === 'failed') onStatus('error', 'Kapcsolat sikertelen (NAT/firewall). TURN kellhet.');
            if (state === 'disconnected') onStatus('connecting', 'Újracsatlakozás…');
            if (state === 'closed' && !stopped) onStatus('ended');
        };

        if (localStream) {
            localStream.getTracks().forEach((track) => {
                pc!.addTrack(track, localStream!);
            });
        }
        return pc;
    };

    const makeOffer = async () => {
        const conn = ensurePc();
        try {
            makingOffer = true;
            onStatus('connecting', 'Ajánlat küldése…');
            const offer = await conn.createOffer({ offerToReceiveAudio: true, offerToReceiveVideo: true });
            await conn.setLocalDescription(offer);
            await postSignal({
                type: 'offer',
                fromUid: uid,
                sdp: conn.localDescription?.sdp || offer.sdp || '',
                createdAtMs: Date.now(),
            });
        } catch (err: any) {
            onStatus('error', String(err?.message || err).slice(0, 140));
        } finally {
            makingOffer = false;
        }
    };

    const handleParticipants = async (participants: ParticipantDoc[]) => {
        if (stopped) return;
        const others = participants.filter((p) => p.uid !== uid);

        if (others.length === 0) {
            remoteSharing = false;
            remoteName = '';
            remoteRole = '';
            publishShareState();
            onStatus('waiting', 'Várjuk a másik felet…');
            offerSent = false;
            return;
        }

        const peer = others.sort((a, b) => a.uid.localeCompare(b.uid))[0];
        remoteName = String(peer.displayName || '').slice(0, 80);
        remoteRole =
            peer.role === 'teacher' || peer.role === 'student' ? peer.role : '';
        remoteSharing = !!peer.sharingScreen;
        publishShareState();

        const remoteId = peer.uid;
        if (uid > remoteId && pc && !pc.currentRemoteDescription && !makingOffer && !offerSent) {
            offerSent = true;
            await makeOffer();
        } else if (uid <= remoteId && pc?.connectionState !== 'connected') {
            onStatus('waiting', 'Várjuk a másik fél ajánlatát…');
        }
    };

    const handleSignal = async (data: SignalDoc) => {
        if (!data || data.fromUid === uid) return;

        const conn = ensurePc();
        try {
            if (data.type === 'hangup') {
                remoteVideo.srcObject = null;
                onStatus('waiting', 'A másik fél kilépett — várakozás…');
                return;
            }

            if (data.type === 'offer' && data.sdp) {
                const offerCollision = makingOffer || conn.signalingState !== 'stable';
                ignoreOffer = !polite && offerCollision;
                if (ignoreOffer) return;
                onStatus('connecting', 'Ajánlat fogadása…');
                await conn.setRemoteDescription({ type: 'offer', sdp: data.sdp });
                await flushIce(conn);
                const answer = await conn.createAnswer();
                await conn.setLocalDescription(answer);
                await postSignal({
                    type: 'answer',
                    fromUid: uid,
                    sdp: conn.localDescription?.sdp || answer.sdp || '',
                    createdAtMs: Date.now(),
                });
            } else if (data.type === 'answer' && data.sdp) {
                if (conn.signalingState === 'have-local-offer') {
                    await conn.setRemoteDescription({ type: 'answer', sdp: data.sdp });
                    await flushIce(conn);
                    onStatus('connecting', 'Válasz fogadva…');
                }
            } else if (data.type === 'ice' && data.candidate) {
                try {
                    const c = JSON.parse(data.candidate) as RTCIceCandidateInit;
                    if (conn.remoteDescription) {
                        await conn.addIceCandidate(c);
                    } else {
                        pendingIce.push(c);
                    }
                } catch {
                    /* ignore */
                }
            }
        } catch (err: any) {
            onStatus('error', String(err?.message || err).slice(0, 140));
        }
    };

    onStatus('media', 'Kamera / mikrofon…');
    try {
        localStream = await getLocalStream();
    } catch (err: any) {
        const msg = /Permission|NotAllowed/i.test(String(err?.name || err?.message || ''))
            ? 'Engedélyezd a kamerát és a mikrofont a böngészőben.'
            : String(err?.message || err).slice(0, 140);
        onStatus('error', msg);
        throw err;
    }

    localVideo.srcObject = localStream;
    localVideo.muted = true;
    void localVideo.play().catch(() => undefined);
    cameraTrack = localStream.getVideoTracks()[0] || null;
    ensurePc();

    const permHint = 'Bejelentkezés szükséges a híváshoz.';

    const joinRes = await apiPutAuth<{ participant: ParticipantDoc }>(
        apiPath(roomId, 'participants'),
        {
            displayName: displayName.slice(0, 80),
            role,
            sharingScreen: false,
        }
    );

    if (!joinRes.ok) {
        onStatus('error', /401|403|Bejelentkezés/i.test(joinRes.error) ? permHint : joinRes.error.slice(0, 160));
        return {
            stop,
            setMuted: (m: boolean) => {
                muted = m;
                localStream?.getAudioTracks().forEach((t) => {
                    t.enabled = !m;
                });
            },
            setCameraOff: (off: boolean) => {
                cameraOff = off;
                if (sharingScreen) return;
                localStream?.getVideoTracks().forEach((t) => {
                    t.enabled = !off;
                });
                if (cameraTrack) cameraTrack.enabled = !off;
            },
            startScreenShare,
            stopScreenShare,
            isMuted: () => muted,
            isCameraOff: () => cameraOff,
            isSharingScreen: () => sharingScreen,
        };
    }

    await cleanupSignals();

    const pollParticipants = async () => {
        if (stopped) return;
        const res = await apiGetAuth<{ participants: ParticipantDoc[] }>(
            apiPath(roomId, 'participants')
        );
        if (res.ok) {
            await handleParticipants(res.participants);
        } else if (/401|403|Bejelentkezés/i.test(res.error)) {
            onStatus('error', permHint);
        }
    };

    const pollSignals = async () => {
        if (stopped) return;
        const res = await apiGetAuth<{ signals: SignalDoc[] }>(
            `${apiPath(roomId, 'signals')}?since=${signalSinceMs}`
        );
        if (!res.ok) {
            if (/401|403|Bejelentkezés/i.test(res.error)) onStatus('error', permHint);
            return;
        }
        for (const data of res.signals) {
            const id = data.id || `${data.fromUid}_${data.createdAtMs}_${data.type}`;
            if (processedSignalIds.has(id)) continue;
            processedSignalIds.add(id);
            signalSinceMs = Math.max(signalSinceMs, data.createdAtMs);
            await handleSignal(data);
        }
    };

    void pollParticipants();
    void pollSignals();
    timers.push(setInterval(() => void pollParticipants(), PARTICIPANT_POLL_MS));
    timers.push(setInterval(() => void pollSignals(), SIGNAL_POLL_MS));

    onStatus('waiting', 'Várjuk a másik felet…');

    return {
        stop,
        setMuted: (m: boolean) => {
            muted = m;
            localStream?.getAudioTracks().forEach((t) => {
                t.enabled = !m;
            });
        },
        setCameraOff: (off: boolean) => {
            cameraOff = off;
            if (sharingScreen) return;
            localStream?.getVideoTracks().forEach((t) => {
                t.enabled = !off;
            });
            if (cameraTrack) cameraTrack.enabled = !off;
        },
        startScreenShare,
        stopScreenShare,
        isMuted: () => muted,
        isCameraOff: () => cameraOff,
        isSharingScreen: () => sharingScreen,
    };
}
