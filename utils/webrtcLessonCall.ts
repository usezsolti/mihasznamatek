/** Saját 1:1 WebRTC hívás — Firebase signaling az óra szobához. */

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
    type: 'offer' | 'answer' | 'ice' | 'hangup';
    fromUid: string;
    sdp?: string;
    candidate?: string;
    createdAtMs: number;
};

function getFirebase(): any | null {
    if (typeof window === 'undefined') return null;
    return (window as any).firebase || null;
}

function db() {
    const firebase = getFirebase();
    if (!firebase?.firestore) return null;
    return firebase.firestore();
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
    const firestore = db();
    if (!firestore) {
        opts.onStatus('error', 'Nincs Firestore');
        throw new Error('Nincs Firestore');
    }
    if (!navigator.mediaDevices?.getUserMedia) {
        opts.onStatus('error', 'A böngésző nem támogatja a kamerát/mikrofont');
        throw new Error('getUserMedia hiányzik');
    }

    const { roomId, uid, displayName, localVideo, remoteVideo, onStatus } = opts;
    const role: CallPeerRole = opts.role === 'teacher' ? 'teacher' : 'student';
    const participantsRef = firestore.collection('lessonRooms').doc(roomId).collection('callParticipants');
    const signalsRef = firestore.collection('lessonRooms').doc(roomId).collection('callSignals');

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
    const unsubs: Array<() => void> = [];
    const processedSignalIds = new Set<string>();

    const publishShareState = () => {
        opts.onShareState?.({
            localSharing: sharingScreen,
            remoteSharing,
            remoteName,
            remoteRole,
        });
    };

    const writeShareFlag = async (on: boolean) => {
        sharingScreen = on;
        publishShareState();
        try {
            await participantsRef.doc(uid).set(
                {
                    sharingScreen: on,
                    shareUpdatedAtMs: Date.now(),
                },
                { merge: true }
            );
        } catch {
            /* rules / offline — UI still updates locally */
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
            const snap = await signalsRef.where('fromUid', '==', uid).get();
            const batch = firestore.batch();
            snap.docs.forEach((d: any) => batch.delete(d.ref));
            if (!snap.empty) await batch.commit();
        } catch {
            /* ignore */
        }
    };

    const stop = async () => {
        if (stopped) return;
        stopped = true;
        onStatus('ended');
        unsubs.forEach((u) => {
            try {
                u();
            } catch {
                /* ignore */
            }
        });
        unsubs.length = 0;
        try {
            await signalsRef.add({
                type: 'hangup',
                fromUid: uid,
                createdAtMs: Date.now(),
            } satisfies SignalDoc);
        } catch {
            /* ignore */
        }
        try {
            await participantsRef.doc(uid).delete();
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
            void signalsRef.add({
                type: 'ice',
                fromUid: uid,
                candidate: JSON.stringify(ev.candidate.toJSON()),
                createdAtMs: Date.now(),
            } satisfies SignalDoc);
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
                    vt.addEventListener('ended', () => {
                        // Firestore flag is source of truth; soft hint only
                    });
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
            await signalsRef.add({
                type: 'offer',
                fromUid: uid,
                sdp: conn.localDescription?.sdp || offer.sdp || '',
                createdAtMs: Date.now(),
            } satisfies SignalDoc);
        } catch (err: any) {
            onStatus('error', String(err?.message || err).slice(0, 140));
        } finally {
            makingOffer = false;
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

    const permHint =
        'Firestore jogosultság hiányzik a híváshoz. Publikáld a firestore.rules-t: /rules-setup (lessonRooms → callParticipants / callSignals).';

    try {
        await participantsRef.doc(uid).set({
            uid,
            displayName: displayName.slice(0, 80),
            role,
            sharingScreen: false,
            joinedAtMs: Date.now(),
        });
    } catch (err: any) {
        const raw = String(err?.message || err || '');
        onStatus(
            'error',
            /permission|insufficient|Missing/i.test(raw) ? permHint : raw.slice(0, 160)
        );
        // Helyi kép megy; távoli félhez rules kell. Controls visszaadása a mic/cam gombokhoz.
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

    // Régi saját jelek törlése
    await cleanupSignals();

    const peerSnapUnsub = participantsRef.onSnapshot(
        async (snap: any) => {
            if (stopped) return;
            const others = snap.docs
                .map((d: any) => ({ id: d.id as string, data: d.data() || {} }))
                .filter((p: { id: string }) => p.id !== uid);

            if (others.length === 0) {
                remoteSharing = false;
                remoteName = '';
                remoteRole = '';
                publishShareState();
                onStatus('waiting', 'Várjuk a másik felet…');
                offerSent = false;
                return;
            }

            const peer = others.sort((a: { id: string }, b: { id: string }) =>
                a.id.localeCompare(b.id)
            )[0];
            remoteName = String(peer.data.displayName || '').slice(0, 80);
            remoteRole =
                peer.data.role === 'teacher' || peer.data.role === 'student'
                    ? peer.data.role
                    : '';
            remoteSharing = !!peer.data.sharingScreen;
            publishShareState();

            const remoteId = peer.id;
            if (uid > remoteId && pc && !pc.currentRemoteDescription && !makingOffer && !offerSent) {
                offerSent = true;
                await makeOffer();
            } else if (uid <= remoteId && pc?.connectionState !== 'connected') {
                onStatus('waiting', 'Várjuk a másik fél ajánlatát…');
            }
        },
        (err: any) => {
            const raw = String(err?.message || err || '');
            onStatus(
                'error',
                /permission|insufficient|Missing/i.test(raw) ? permHint : raw.slice(0, 160)
            );
        }
    );
    unsubs.push(() => peerSnapUnsub());

    const signalUnsub = signalsRef
        .orderBy('createdAtMs', 'asc')
        .limit(80)
        .onSnapshot(
            async (snap: any) => {
                if (stopped) return;
                for (const change of snap.docChanges()) {
                    if (change.type !== 'added') continue;
                    const id = change.doc.id as string;
                    if (processedSignalIds.has(id)) continue;
                    processedSignalIds.add(id);
                    const data = change.doc.data() as SignalDoc;
                    if (!data || data.fromUid === uid) continue;

                    const conn = ensurePc();
                    try {
                        if (data.type === 'hangup') {
                            remoteVideo.srcObject = null;
                            onStatus('waiting', 'A másik fél kilépett — várakozás…');
                            continue;
                        }

                        if (data.type === 'offer' && data.sdp) {
                            const offerCollision =
                                makingOffer || conn.signalingState !== 'stable';
                            ignoreOffer = !polite && offerCollision;
                            if (ignoreOffer) continue;
                            onStatus('connecting', 'Ajánlat fogadása…');
                            await conn.setRemoteDescription({ type: 'offer', sdp: data.sdp });
                            await flushIce(conn);
                            const answer = await conn.createAnswer();
                            await conn.setLocalDescription(answer);
                            await signalsRef.add({
                                type: 'answer',
                                fromUid: uid,
                                sdp: conn.localDescription?.sdp || answer.sdp || '',
                                createdAtMs: Date.now(),
                            } satisfies SignalDoc);
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
                        const raw = String(err?.message || err || '');
                        onStatus(
                            'error',
                            /permission|insufficient|Missing/i.test(raw)
                                ? permHint
                                : raw.slice(0, 140)
                        );
                    }
                }
            },
            (err: any) => {
                const raw = String(err?.message || err || '');
                onStatus(
                    'error',
                    /permission|insufficient|Missing/i.test(raw) ? permHint : raw.slice(0, 160)
                );
            }
        );
    unsubs.push(() => signalUnsub());

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
