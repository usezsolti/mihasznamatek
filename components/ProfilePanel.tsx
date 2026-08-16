import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Link from 'next/link';
import BookingAttachments from './BookingAttachments';
import BookingCalendarLinks from './BookingCalendarLinks';
import {
    cancelBookingByStudent,
    loadStudentBookingsFromFirestore,
    paymentStatusLabel,
    type BookingPayload,
} from '../utils/bookingNotify';
import {
    BADGE_DEFS,
    emptyProgress,
    getRankEmoji,
    loadUserPracticeProgress,
    xpForNextRank,
    type UserPracticeProgress,
} from '../utils/practiceProgress';

interface GameResult {
    id: string;
    topicId?: string;
    topicTitle?: string;
    educationLevel?: string;
    gameMode?: string;
    correct: number;
    total: number;
    score: number;
    completedAt: any;
    topic?: string;
    level?: string;
    grade?: number;
    subject?: string;
}

interface UserStats {
    totalGames: number;
    totalQuestions: number;
    totalCorrect: number;
    totalWrong: number;
    averageScore: number;
    bestScore: number;
    topicsPlayed: string[];
    educationLevels: { [key: string]: number };
}

function compressImage(file: File, maxSize = 512, quality = 0.85): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const objectUrl = URL.createObjectURL(file);
        img.onload = () => {
            let { width, height } = img;
            if (width > height) {
                if (width > maxSize) {
                    height = Math.round((height * maxSize) / width);
                    width = maxSize;
                }
            } else if (height > maxSize) {
                width = Math.round((width * maxSize) / height);
                height = maxSize;
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
                URL.revokeObjectURL(objectUrl);
                reject(new Error('Canvas nem elérhető'));
                return;
            }
            ctx.drawImage(img, 0, 0, width, height);
            URL.revokeObjectURL(objectUrl);
            canvas.toBlob(
                (blob) => (blob ? resolve(blob) : reject(new Error('Kép tömörítése sikertelen'))),
                'image/jpeg',
                quality
            );
        };
        img.onerror = () => {
            URL.revokeObjectURL(objectUrl);
            reject(new Error('A kép nem tölthető be'));
        };
        img.src = objectUrl;
    });
}

function blobToDataUrl(blob: Blob): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(String(reader.result));
        reader.onerror = () => reject(new Error('Fájl olvasási hiba'));
        reader.readAsDataURL(blob);
    });
}

export default function ProfilePanel({ embedded = false }: { embedded?: boolean }) {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(true);
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [photoURL, setPhotoURL] = useState<string | null>(null);
    const [uploadingAvatar, setUploadingAvatar] = useState(false);
    const [avatarMessage, setAvatarMessage] = useState('');
    const [avatarError, setAvatarError] = useState('');
    const [gameResults, setGameResults] = useState<GameResult[]>([]);
    const [stats, setStats] = useState<UserStats>({
        totalGames: 0,
        totalQuestions: 0,
        totalCorrect: 0,
        totalWrong: 0,
        averageScore: 0,
        bestScore: 0,
        topicsPlayed: [],
        educationLevels: {}
    });
    const [selectedFilter, setSelectedFilter] = useState<'all' | 'elementary' | 'highschool' | 'university' | 'erettsegi'>('all');
    const [myBookings, setMyBookings] = useState<BookingPayload[]>([]);
    const [bookingsLoading, setBookingsLoading] = useState(false);
    const [cancellingId, setCancellingId] = useState<string | null>(null);
    const [practiceProgress, setPracticeProgress] = useState<UserPracticeProgress>(emptyProgress());
    const [socialUsername, setSocialUsername] = useState('');
    const [socialBio, setSocialBio] = useState('');
    const [socialFollowers, setSocialFollowers] = useState(0);
    const [socialFollowing, setSocialFollowing] = useState(0);
    const [socialPosts, setSocialPosts] = useState(0);

    useEffect(() => {
        const checkAuth = async () => {
            let attempts = 0;
            while (!(window as any).firebase?.apps?.length && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (!(window as any).firebase) {
                setLoading(false);
                return;
            }

            try {
                const auth = (window as any).firebase.auth();
                const unsub = auth.onAuthStateChanged(async (user: any) => {
                    if (!user) {
                        if (!embedded) {
                            router.replace('/');
                        }
                        setCurrentUser(null);
                        setLoading(false);
                        return;
                    }

                    setCurrentUser(user);
                    setPhotoURL(user.photoURL || null);
                    try {
                        await user.getIdToken(true);
                    } catch {
                        /* ignore */
                    }

                    try {
                        const snap = await (window as any).firebase.firestore().collection('users').doc(user.uid).get();
                        if (snap.exists) {
                            const data = snap.data();
                            if (data?.photoURL) {
                                setPhotoURL(data.photoURL);
                            }
                        }
                    } catch (err) {
                        console.warn('Profilkép betöltési hiba:', err);
                    }

                    await loadGameResults(user.uid);
                    try {
                        const { apiEnsureProfile } = await import('../utils/socialApi');
                        const social = await apiEnsureProfile(user.uid, {
                            name: user.displayName || undefined,
                            photoURL: user.photoURL || undefined,
                        });
                        setSocialUsername(social.username || '');
                        setSocialBio(social.bio || '');
                        setSocialFollowers(Number(social.followerCount || 0));
                        setSocialFollowing(Number(social.followingCount || 0));
                        setSocialPosts(Number(social.postCount || 0));
                        if (social.photoURL) {
                            setPhotoURL((prev) => prev || social.photoURL);
                        }
                    } catch (e) {
                        console.warn('MihaSocial profil betöltési hiba:', e);
                    }
                    try {
                        const prog = await loadUserPracticeProgress(user.uid);
                        setPracticeProgress(prog);
                    } catch (e) {
                        console.error('Practice progress load error:', e);
                    }
                    setBookingsLoading(true);
                    try {
                        if (user.email) {
                            const list = await loadStudentBookingsFromFirestore(user.email);
                            setMyBookings(list);
                        } else {
                            setMyBookings([]);
                        }
                    } finally {
                        setBookingsLoading(false);
                    }
                    setLoading(false);
                });

                return () => unsub();
            } catch (err) {
                console.error('Auth error:', err);
                setLoading(false);
            }
        };

        checkAuth();
    }, [router, embedded]);

    const handleAvatarClick = () => {
        if (uploadingAvatar) return;
        fileInputRef.current?.click();
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        e.target.value = '';
        if (!file || !currentUser) return;

        setAvatarError('');
        setAvatarMessage('');

        if (!file.type.startsWith('image/')) {
            setAvatarError('Csak képfájl tölthető fel (JPG, PNG, WebP).');
            return;
        }
        if (file.size > 8 * 1024 * 1024) {
            setAvatarError('A kép maximum 8 MB lehet.');
            return;
        }

        setUploadingAvatar(true);
        try {
            const firebase = (window as any).firebase;
            const blob = await compressImage(file);
            let url: string | null = null;

            // Elsődleges: Firebase Storage
            try {
                if (firebase.storage) {
                    const storageRef = firebase.storage().ref(`avatars/${currentUser.uid}.jpg`);
                    await storageRef.put(blob, { contentType: 'image/jpeg' });
                    url = await storageRef.getDownloadURL();
                }
            } catch (storageErr) {
                console.warn('Storage feltöltés sikertelen, Firestore fallback:', storageErr);
            }

            // Fallback: tömörített data URL a Firestore-ba (ha a Storage nincs beállítva)
            if (!url) {
                url = await blobToDataUrl(blob);
                if (url.length > 900_000) {
                    throw new Error('A kép még tömörítés után is túl nagy. Próbálj kisebb felbontású képet.');
                }
            }

            try {
                await currentUser.updateProfile({ photoURL: url.startsWith('http') ? url : null });
            } catch {
                // A data URL-es photoURL az Auth-ban nem mindig támogatott
            }

            await firebase.firestore().collection('users').doc(currentUser.uid).set(
                {
                    photoURL: url,
                    updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
                },
                { merge: true }
            );

            if (url.startsWith('http')) {
                await currentUser.reload();
                setCurrentUser(firebase.auth().currentUser);
            }

            setPhotoURL(url);
            setAvatarMessage('Profilkép sikeresen frissítve!');
            try {
                const { apiSyncSocialIdentity } = await import('../utils/socialApi');
                await apiSyncSocialIdentity(currentUser.uid, {
                    photoURL: url,
                    displayName: currentUser.displayName || undefined,
                });
            } catch (syncErr) {
                console.warn('MihaSocial profilkép szinkron hiba:', syncErr);
            }
            try {
                window.dispatchEvent(
                    new CustomEvent('mihaszna:user-profile-updated', {
                        detail: { photoURL: url },
                    })
                );
            } catch {
                /* ignore */
            }
        } catch (err: any) {
            console.error('Avatar feltöltési hiba:', err);
            setAvatarError(err?.message || 'Nem sikerült feltölteni a képet. Próbáld újra.');
        } finally {
            setUploadingAvatar(false);
        }
    };
    const loadGameResults = async (userId: string) => {
        try {
            const { fetchGameResultsForUser } = await import('../utils/gameResultsClient');
            const { results, permissionDenied } = await fetchGameResultsForUser(userId);
            if (permissionDenied) {
                setGameResults([]);
                calculateStats([]);
                return;
            }

            const typed = results as GameResult[];
            typed.sort((a, b) => {
                const toMs = (ts: any) => {
                    if (!ts) return 0;
                    if (typeof ts.toDate === 'function') return ts.toDate().getTime();
                    if (ts.seconds) return ts.seconds * 1000;
                    return new Date(ts).getTime() || 0;
                };
                return toMs(b.completedAt) - toMs(a.completedAt);
            });

            const limited = typed.slice(0, 100);
            setGameResults(limited);
            calculateStats(limited);
        } catch (error) {
            console.warn('gameResults load skipped:', error);
            setGameResults([]);
            calculateStats([]);
        }
    };

    const calculateStats = (results: GameResult[]) => {
        const newStats: UserStats = {
            totalGames: results.length,
            totalQuestions: 0,
            totalCorrect: 0,
            totalWrong: 0,
            averageScore: 0,
            bestScore: 0,
            topicsPlayed: [],
            educationLevels: {}
        };

        let totalScore = 0;
        const topicsSet = new Set<string>();

        results.forEach(result => {
            newStats.totalQuestions += result.total || 0;
            newStats.totalCorrect += result.correct || 0;
            newStats.totalWrong += (result.total || 0) - (result.correct || 0);
            
            const score = result.score || 0;
            totalScore += score;
            if (score > newStats.bestScore) {
                newStats.bestScore = score;
            }

            if (result.topicTitle) {
                topicsSet.add(result.topicTitle);
            }
            if (result.topic) {
                topicsSet.add(result.topic);
            }

            const level = result.educationLevel || result.gameMode || 'unknown';
            newStats.educationLevels[level] = (newStats.educationLevels[level] || 0) + 1;
        });

        newStats.averageScore = results.length > 0 ? Math.round(totalScore / results.length) : 0;
        newStats.topicsPlayed = Array.from(topicsSet);

        setStats(newStats);
    };

    const filteredResults = gameResults.filter(result => {
        if (selectedFilter === 'all') return true;
        if (selectedFilter === 'elementary') return result.educationLevel === 'elementary';
        if (selectedFilter === 'highschool') return result.educationLevel === 'highschool';
        if (selectedFilter === 'university') return result.educationLevel === 'university';
        if (selectedFilter === 'erettsegi') return result.gameMode === 'erettsegi' || result.level;
        return true;
    });

    const formatDate = (timestamp: any) => {
        if (!timestamp) return 'Ismeretlen dátum';
        const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
        return date.toLocaleDateString('hu-HU', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div style={{
                minHeight: embedded ? '200px' : '100vh',
                background: embedded ? 'transparent' : 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#39ff14'
            }}>
                <div>Betöltés...</div>
            </div>
        );
    }

    if (!currentUser) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center', color: '#ff69b4' }}>
                Jelentkezz be a profilod megtekintéséhez.
            </div>
        );
    }

    return (
        <>
            {!embedded && (
                <Head>
                    <title>Profil - Mihaszna Matek</title>
                </Head>
            )}
            <div style={{
                minHeight: embedded ? 'auto' : '100vh',
                background: embedded ? 'transparent' : 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
                padding: embedded ? '0' : '2rem',
                color: '#ffffff'
            }}>
                <div style={{
                    maxWidth: '1200px',
                    margin: '0 auto'
                }}>
                    {/* Header — név/kép a site headerben van, itt csak szerkesztés */}
                    {!embedded && (
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        marginBottom: '2rem',
                        flexWrap: 'wrap',
                        gap: '1rem'
                    }}>
                        <h1 style={{
                            fontSize: '2.5rem',
                            fontWeight: 'bold',
                            background: 'linear-gradient(90deg, #39ff14 0%, #ff69b4 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                            margin: 0
                        }}>
                            👤 Profil
                        </h1>
                        <button
                            onClick={() => router.push('/dashboard')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: 'rgba(57, 255, 20, 0.2)',
                                border: '2px solid #39ff14',
                                borderRadius: '15px',
                                color: '#39ff14',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.background = 'rgba(57, 255, 20, 0.3)';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.background = 'rgba(57, 255, 20, 0.2)';
                                e.currentTarget.style.transform = 'translateY(0)';
                            }}
                        >
                            ← Vissza a Dashboard-ra
                        </button>
                    </div>
                    )}

                    {/* User Info */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid rgba(57, 255, 20, 0.5)',
                        borderRadius: '25px',
                        padding: embedded ? '1.25rem' : '2rem',
                        marginBottom: '2rem',
                        backdropFilter: 'blur(20px)'
                    }}>
                        {embedded && (
                            <h2 style={{
                                margin: '0 0 1rem',
                                fontSize: '1.15rem',
                                color: '#39ff14',
                                fontWeight: 700,
                            }}>
                                Profil szerkesztése
                            </h2>
                        )}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '1.5rem',
                            flexWrap: 'wrap'
                        }}>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/jpeg,image/png,image/webp,image/gif"
                                onChange={handleAvatarChange}
                                style={{ display: 'none' }}
                            />
                            <button
                                type="button"
                                onClick={handleAvatarClick}
                                disabled={uploadingAvatar}
                                title="Profilkép feltöltése"
                                onMouseEnter={(e) => {
                                    const overlay = e.currentTarget.querySelector('.avatar-overlay') as HTMLElement | null;
                                    if (overlay && !uploadingAvatar) overlay.style.opacity = '1';
                                }}
                                onMouseLeave={(e) => {
                                    const overlay = e.currentTarget.querySelector('.avatar-overlay') as HTMLElement | null;
                                    if (overlay && !uploadingAvatar) overlay.style.opacity = '0';
                                }}
                                style={{
                                    position: 'relative',
                                    width: embedded ? '72px' : '96px',
                                    height: embedded ? '72px' : '96px',
                                    borderRadius: '50%',
                                    background: 'linear-gradient(45deg, #39ff14, #ff69b4)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: embedded ? '1.75rem' : '2.5rem',
                                    fontWeight: 'bold',
                                    border: '3px solid rgba(57, 255, 20, 0.6)',
                                    cursor: uploadingAvatar ? 'wait' : 'pointer',
                                    padding: 0,
                                    overflow: 'hidden',
                                    flexShrink: 0,
                                    color: '#000',
                                }}
                            >
                                {photoURL ? (
                                    <img
                                        src={photoURL}
                                        alt="Profilkép"
                                        style={{
                                            width: '100%',
                                            height: '100%',
                                            objectFit: 'cover',
                                        }}
                                    />
                                ) : (
                                    (currentUser?.displayName || currentUser?.email || 'U').charAt(0).toUpperCase()
                                )}
                                <span
                                    className="avatar-overlay"
                                    style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: 'rgba(0,0,0,0.45)',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        opacity: uploadingAvatar ? 1 : 0,
                                        transition: 'opacity 0.2s ease',
                                        color: '#fff',
                                        fontSize: '0.75rem',
                                        fontWeight: 600,
                                        textAlign: 'center',
                                        padding: '0.5rem',
                                    }}
                                >
                                    {uploadingAvatar ? 'Feltöltés...' : '📷 Csere'}
                                </span>
                            </button>
                            <div>
                                <h2 style={{
                                    fontSize: '1.8rem',
                                    margin: '0 0 0.5rem 0',
                                    color: '#ffffff'
                                }}>
                                    {currentUser?.displayName || currentUser?.email || 'Felhasználó'}
                                </h2>
                                <p style={{
                                    color: '#39ff14',
                                    margin: '0 0 0.75rem 0',
                                    fontSize: '1rem'
                                }}>
                                    {currentUser?.email}
                                </p>
                                {socialUsername && (
                                    <p style={{ color: '#ff69b4', margin: '0 0 0.75rem', fontSize: '0.95rem' }}>
                                        MihaSocial: @{socialUsername}
                                        {socialBio ? ` · ${socialBio.slice(0, 60)}${socialBio.length > 60 ? '…' : ''}` : ''}
                                    </p>
                                )}
                                <div
                                    style={{
                                        display: 'flex',
                                        flexWrap: 'wrap',
                                        gap: '1.25rem',
                                        margin: '0 0 0.9rem',
                                        fontSize: '0.95rem',
                                        color: '#f2f2f2',
                                    }}
                                >
                                    <Link
                                        href="/community?tab=profile"
                                        style={{ color: 'inherit', textDecoration: 'none' }}
                                    >
                                        <strong style={{ color: '#fff' }}>{socialPosts}</strong>{' '}
                                        <span style={{ color: '#a0a0a0' }}>posts</span>
                                    </Link>
                                    <Link
                                        href="/community?tab=profile"
                                        style={{ color: 'inherit', textDecoration: 'none' }}
                                    >
                                        <strong style={{ color: '#fff' }}>{socialFollowers}</strong>{' '}
                                        <span style={{ color: '#a0a0a0' }}>followers</span>
                                    </Link>
                                    <Link
                                        href="/community?tab=explore"
                                        style={{ color: 'inherit', textDecoration: 'none' }}
                                    >
                                        <strong style={{ color: '#fff' }}>{socialFollowing}</strong>{' '}
                                        <span style={{ color: '#a0a0a0' }}>following</span>
                                    </Link>
                                </div>
                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.65rem' }}>
                                    <Link
                                        href="/community?tab=profile"
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: 'linear-gradient(135deg, rgba(57,255,20,0.25), rgba(255,73,219,0.2))',
                                            border: '2px solid rgba(57, 255, 20, 0.55)',
                                            borderRadius: '12px',
                                            color: '#39ff14',
                                            fontSize: '0.9rem',
                                            fontWeight: 700,
                                            textDecoration: 'none',
                                        }}
                                    >
                                        MihaSocial profil
                                    </Link>
                                    <Link
                                        href="/community"
                                        style={{
                                            padding: '0.5rem 1rem',
                                            background: 'rgba(255, 255, 255, 0.06)',
                                            border: '2px solid rgba(255, 73, 219, 0.4)',
                                            borderRadius: '12px',
                                            color: '#ff69b4',
                                            fontSize: '0.9rem',
                                            fontWeight: 600,
                                            textDecoration: 'none',
                                        }}
                                    >
                                        Közösség megnyitása
                                    </Link>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAvatarClick}
                                    disabled={uploadingAvatar}
                                    style={{
                                        padding: '0.5rem 1rem',
                                        background: 'rgba(57, 255, 20, 0.15)',
                                        border: '2px solid rgba(57, 255, 20, 0.5)',
                                        borderRadius: '12px',
                                        color: '#39ff14',
                                        fontSize: '0.9rem',
                                        fontWeight: 600,
                                        cursor: uploadingAvatar ? 'wait' : 'pointer',
                                    }}
                                >
                                    {uploadingAvatar ? 'Feltöltés...' : (photoURL ? 'Profilkép cseréje' : 'Profilkép feltöltése')}
                                </button>
                                {avatarMessage && (
                                    <p style={{ color: '#39ff14', margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                                        {avatarMessage}
                                    </p>
                                )}
                                {avatarError && (
                                    <p style={{ color: '#ff69b4', margin: '0.5rem 0 0', fontSize: '0.9rem' }}>
                                        {avatarError}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* XP / Rang / Badge-ek */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '2px solid rgba(255, 215, 0, 0.45)',
                        borderRadius: '25px',
                        padding: '1.75rem',
                        marginBottom: '2rem',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <h2 style={{
                            margin: '0 0 1rem 0',
                            fontSize: '1.5rem',
                            background: 'linear-gradient(90deg, #ffd700 0%, #39ff14 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            backgroundClip: 'text',
                        }}>
                            {getRankEmoji(practiceProgress.rankLevel)} Haladás
                        </h2>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <span style={{ color: '#ffd700', fontWeight: 700 }}>
                                {practiceProgress.rank} · {practiceProgress.xp} XP
                            </span>
                            <span style={{ color: '#aaa', fontSize: '0.9rem' }}>
                                Következő rang: {xpForNextRank(practiceProgress.xp).next} XP
                            </span>
                        </div>
                        <div style={{
                            height: '12px',
                            background: 'rgba(255,255,255,0.1)',
                            borderRadius: '999px',
                            overflow: 'hidden',
                            marginBottom: '1.25rem'
                        }}>
                            <div style={{
                                height: '100%',
                                width: `${(() => {
                                    const r = xpForNextRank(practiceProgress.xp);
                                    const span = Math.max(1, r.next - r.current);
                                    return Math.min(100, Math.round(((practiceProgress.xp - r.current) / span) * 100));
                                })()}%`,
                                background: 'linear-gradient(90deg, #39ff14, #ffd700)',
                                borderRadius: '999px',
                                transition: 'width 0.3s ease'
                            }} />
                        </div>
                        <h3 style={{ margin: '0 0 0.75rem 0', color: '#fff', fontSize: '1.1rem' }}>Badge-ek</h3>
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
                            gap: '0.75rem'
                        }}>
                            {BADGE_DEFS.map((badge) => {
                                const unlocked = practiceProgress.badges.includes(badge.id);
                                return (
                                    <div
                                        key={badge.id}
                                        title={badge.description}
                                        style={{
                                            padding: '0.75rem',
                                            borderRadius: '14px',
                                            border: unlocked
                                                ? '1px solid rgba(255, 215, 0, 0.7)'
                                                : '1px solid rgba(255,255,255,0.15)',
                                            background: unlocked
                                                ? 'rgba(255, 215, 0, 0.12)'
                                                : 'rgba(0,0,0,0.25)',
                                            opacity: unlocked ? 1 : 0.45,
                                            textAlign: 'center'
                                        }}
                                    >
                                        <div style={{ fontSize: '1.4rem', marginBottom: '0.25rem' }}>{badge.icon}</div>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: unlocked ? '#ffd700' : '#ccc' }}>
                                            {badge.title}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Óráim — foglalások */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '2px solid rgba(255, 105, 180, 0.45)',
                        borderRadius: '25px',
                        padding: '1.75rem',
                        marginBottom: '2rem',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '1rem',
                            flexWrap: 'wrap',
                            marginBottom: '1.25rem'
                        }}>
                            <h2 style={{
                                margin: 0,
                                fontSize: '1.5rem',
                                background: 'linear-gradient(90deg, #39ff14 0%, #ff69b4 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundClip: 'text',
                            }}>
                                📅 Óráim
                            </h2>
                            <Link
                                href="/booking"
                                style={{
                                    padding: '0.5rem 1rem',
                                    borderRadius: '12px',
                                    border: '2px solid rgba(57, 255, 20, 0.5)',
                                    color: '#39ff14',
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                    fontSize: '0.9rem',
                                    background: 'rgba(57, 255, 20, 0.12)',
                                }}
                            >
                                + Új foglalás
                            </Link>
                        </div>

                        {bookingsLoading ? (
                            <p style={{ color: '#a0a0a0', margin: 0 }}>Foglalások betöltése…</p>
                        ) : myBookings.length === 0 ? (
                            <p style={{ color: '#a0a0a0', margin: 0 }}>
                                Még nincs foglalásod. Foglalj időpontot az{' '}
                                <Link href="/booking" style={{ color: '#39ff14' }}>Időpontfoglalás</Link> oldalon.
                            </p>
                        ) : (
                            <div style={{ display: 'grid', gap: '0.85rem' }}>
                                {myBookings.map((b) => {
                                    const status = b.status || 'pending';
                                    const statusLabel =
                                        status === 'approved'
                                            ? 'Jóváhagyva'
                                            : status === 'rejected'
                                              ? 'Elutasítva'
                                              : status === 'cancelled'
                                                ? 'Lemondva'
                                                : 'Függőben';
                                    const statusColor =
                                        status === 'approved'
                                            ? '#39ff14'
                                            : status === 'rejected'
                                              ? '#ff69b4'
                                              : status === 'cancelled'
                                                ? '#888'
                                                : '#ffd166';
                                    const dateHu = b.date
                                        ? new Date(b.date + 'T12:00:00').toLocaleDateString('hu-HU', {
                                              year: 'numeric',
                                              month: 'long',
                                              day: 'numeric',
                                              weekday: 'long',
                                          })
                                        : '—';
                                    const isFuture = b.date
                                        ? new Date(b.date + 'T23:59:59').getTime() >= Date.now()
                                        : false;
                                    const canCancel =
                                        isFuture && (status === 'pending' || status === 'approved');
                                    return (
                                        <div
                                            key={b.id}
                                            style={{
                                                background: 'rgba(0,0,0,0.35)',
                                                border: `1px solid ${statusColor}55`,
                                                borderRadius: '16px',
                                                padding: '1rem 1.15rem',
                                            }}
                                        >
                                            <div style={{
                                                display: 'flex',
                                                justifyContent: 'space-between',
                                                gap: '0.75rem',
                                                flexWrap: 'wrap',
                                                marginBottom: '0.5rem',
                                            }}>
                                                <strong style={{ color: '#fff', fontSize: '1.05rem' }}>
                                                    {dateHu}
                                                </strong>
                                                <span style={{
                                                    color: statusColor,
                                                    fontWeight: 700,
                                                    fontSize: '0.85rem',
                                                    border: `1px solid ${statusColor}`,
                                                    borderRadius: '999px',
                                                    padding: '0.2rem 0.7rem',
                                                }}>
                                                    {statusLabel}
                                                </span>
                                            </div>
                                            <p style={{ margin: '0.25rem 0', color: '#ddd' }}>
                                                ⏰ {(b.times || []).join(', ') || '—'}
                                            </p>
                                            <p style={{ margin: '0.25rem 0', color: '#bbb', fontSize: '0.95rem' }}>
                                                {b.lessonType === 'online' ? '💻 Online' : '🏠 Személyes'}
                                                {b.selectedSubject ? ` · ${b.selectedSubject}` : ''}
                                                {typeof b.totalPrice === 'number'
                                                    ? ` · ${b.totalPrice.toLocaleString('hu-HU')} Ft`
                                                    : ''}
                                            </p>
                                            {(b.postalCode || b.street || b.houseNumber) && (
                                                <p style={{ margin: '0.25rem 0', color: '#aaa', fontSize: '0.9rem' }}>
                                                    🧾 {[b.postalCode, b.street, b.houseNumber].filter(Boolean).join(' ')}
                                                </p>
                                            )}
                                            <p style={{ margin: '0.25rem 0', color: '#bbb', fontSize: '0.9rem' }}>
                                                💳 {paymentStatusLabel(b.paymentStatus)}
                                            </p>
                                            <BookingAttachments files={b.uploadedFiles} />
                                            <BookingCalendarLinks booking={b} />
                                            {canCancel && (
                                                <div style={{
                                                    display: 'flex',
                                                    gap: '0.5rem',
                                                    flexWrap: 'wrap',
                                                    marginTop: '0.75rem',
                                                    alignItems: 'center',
                                                }}>
                                                    <button
                                                        type="button"
                                                        disabled={cancellingId === b.id}
                                                        onClick={async () => {
                                                            if (!window.confirm(
                                                                `Biztosan lemondod ezt az órát?\n${dateHu}\n${(b.times || []).join(', ')}`
                                                            )) {
                                                                return;
                                                            }
                                                            setCancellingId(b.id);
                                                            try {
                                                                const result = await cancelBookingByStudent(b);
                                                                if (!result.ok) {
                                                                    alert(result.error || 'Lemondás sikertelen.');
                                                                    return;
                                                                }
                                                                setMyBookings((prev) =>
                                                                    prev.map((x) =>
                                                                        x.id === b.id
                                                                            ? { ...x, status: 'cancelled' }
                                                                            : x
                                                                    )
                                                                );
                                                                if (result.error) {
                                                                    alert(`Óra lemondva.\n\n${result.error}`);
                                                                }
                                                            } finally {
                                                                setCancellingId(null);
                                                            }
                                                        }}
                                                        style={{
                                                            background: 'transparent',
                                                            color: '#ff69b4',
                                                            border: '1px solid #ff69b4',
                                                            borderRadius: '10px',
                                                            padding: '0.45rem 0.85rem',
                                                            fontWeight: 700,
                                                            cursor: cancellingId === b.id ? 'wait' : 'pointer',
                                                        }}
                                                    >
                                                        {cancellingId === b.id ? 'Lemondás…' : 'Lemondás'}
                                                    </button>
                                                    <Link
                                                        href="/booking"
                                                        style={{
                                                            color: '#39ff14',
                                                            fontSize: '0.9rem',
                                                            fontWeight: 600,
                                                        }}
                                                    >
                                                        Új időpont →
                                                    </Link>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Statistics */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                        gap: '1.5rem',
                        marginBottom: '2rem'
                    }}>
                        <div style={{
                            background: 'rgba(57, 255, 20, 0.15)',
                            border: '2px solid rgba(57, 255, 20, 0.6)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#39ff14',
                                marginBottom: '0.5rem'
                            }}>
                                {stats.totalGames}
                            </div>
                            <div style={{
                                color: '#ffffff',
                                fontSize: '1rem'
                            }}>
                                Összes játék
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(57, 255, 20, 0.15)',
                            border: '2px solid rgba(57, 255, 20, 0.6)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#39ff14',
                                marginBottom: '0.5rem'
                            }}>
                                {stats.totalCorrect}
                            </div>
                            <div style={{
                                color: '#ffffff',
                                fontSize: '1rem'
                            }}>
                                Helyes válaszok
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(57, 255, 20, 0.15)',
                            border: '2px solid rgba(57, 255, 20, 0.6)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#39ff14',
                                marginBottom: '0.5rem'
                            }}>
                                {stats.totalQuestions}
                            </div>
                            <div style={{
                                color: '#ffffff',
                                fontSize: '1rem'
                            }}>
                                Összes kérdés
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(57, 255, 20, 0.15)',
                            border: '2px solid rgba(57, 255, 20, 0.6)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#39ff14',
                                marginBottom: '0.5rem'
                            }}>
                                {stats.totalQuestions > 0 
                                    ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100) 
                                    : 0}%
                            </div>
                            <div style={{
                                color: '#ffffff',
                                fontSize: '1rem'
                            }}>
                                Sikerességi arány
                            </div>
                        </div>

                        <div style={{
                            background: 'rgba(57, 255, 20, 0.15)',
                            border: '2px solid rgba(57, 255, 20, 0.6)',
                            borderRadius: '20px',
                            padding: '1.5rem',
                            textAlign: 'center'
                        }}>
                            <div style={{
                                fontSize: '2.5rem',
                                fontWeight: 'bold',
                                color: '#39ff14',
                                marginBottom: '0.5rem'
                            }}>
                                {stats.bestScore}
                            </div>
                            <div style={{
                                color: '#ffffff',
                                fontSize: '1rem'
                            }}>
                                Legjobb pontszám
                            </div>
                        </div>
                    </div>

                    {/* Filter */}
                    <div style={{
                        marginBottom: '1.5rem',
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={() => setSelectedFilter('all')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: selectedFilter === 'all' 
                                    ? 'rgba(57, 255, 20, 0.3)' 
                                    : 'rgba(255, 255, 255, 0.1)',
                                border: `2px solid ${selectedFilter === 'all' ? '#39ff14' : 'rgba(57, 255, 20, 0.5)'}`,
                                borderRadius: '15px',
                                color: '#ffffff',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Összes
                        </button>
                        <button
                            onClick={() => setSelectedFilter('elementary')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: selectedFilter === 'elementary' 
                                    ? 'rgba(57, 255, 20, 0.3)' 
                                    : 'rgba(255, 255, 255, 0.1)',
                                border: `2px solid ${selectedFilter === 'elementary' ? '#39ff14' : 'rgba(57, 255, 20, 0.5)'}`,
                                borderRadius: '15px',
                                color: '#ffffff',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            🎒 Általános iskola
                        </button>
                        <button
                            onClick={() => setSelectedFilter('highschool')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: selectedFilter === 'highschool' 
                                    ? 'rgba(57, 255, 20, 0.3)' 
                                    : 'rgba(255, 255, 255, 0.1)',
                                border: `2px solid ${selectedFilter === 'highschool' ? '#39ff14' : 'rgba(57, 255, 20, 0.5)'}`,
                                borderRadius: '15px',
                                color: '#ffffff',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            📚 Középiskola
                        </button>
                        <button
                            onClick={() => setSelectedFilter('university')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: selectedFilter === 'university' 
                                    ? 'rgba(57, 255, 20, 0.3)' 
                                    : 'rgba(255, 255, 255, 0.1)',
                                border: `2px solid ${selectedFilter === 'university' ? '#39ff14' : 'rgba(57, 255, 20, 0.5)'}`,
                                borderRadius: '15px',
                                color: '#ffffff',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            🎓 Egyetem
                        </button>
                        <button
                            onClick={() => setSelectedFilter('erettsegi')}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: selectedFilter === 'erettsegi' 
                                    ? 'rgba(57, 255, 20, 0.3)' 
                                    : 'rgba(255, 255, 255, 0.1)',
                                border: `2px solid ${selectedFilter === 'erettsegi' ? '#39ff14' : 'rgba(57, 255, 20, 0.5)'}`,
                                borderRadius: '15px',
                                color: '#ffffff',
                                fontSize: '1rem',
                                fontWeight: '600',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            📝 Érettségire felkészülés
                        </button>
                    </div>

                    {/* Game Results */}
                    <div style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '2px solid rgba(57, 255, 20, 0.5)',
                        borderRadius: '25px',
                        padding: '2rem',
                        backdropFilter: 'blur(20px)'
                    }}>
                        <h2 style={{
                            fontSize: '1.8rem',
                            marginBottom: '1.5rem',
                            color: '#39ff14'
                        }}>
                            Játék Eredmények ({filteredResults.length})
                        </h2>

                        {filteredResults.length === 0 ? (
                            <div style={{
                                textAlign: 'center',
                                padding: '3rem',
                                color: '#ffffff'
                            }}>
                                <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📊</div>
                                <p>Még nincsenek mentett eredmények.</p>
                                <p style={{ color: '#39ff14', marginTop: '0.5rem' }}>
                                    Játssz néhány játékot, hogy itt megjelenjenek az eredményeid!
                                </p>
                            </div>
                        ) : (
                            <div style={{
                                display: 'grid',
                                gap: '1rem'
                            }}>
                                {filteredResults.map((result) => (
                                    <div
                                        key={result.id}
                                        style={{
                                            background: 'rgba(57, 255, 20, 0.1)',
                                            border: '2px solid rgba(57, 255, 20, 0.4)',
                                            borderRadius: '15px',
                                            padding: '1.5rem',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                            gap: '1rem'
                                        }}
                                    >
                                        <div style={{ flex: 1, minWidth: '200px' }}>
                                            <h3 style={{
                                                fontSize: '1.2rem',
                                                margin: '0 0 0.5rem 0',
                                                color: '#39ff14'
                                            }}>
                                                {result.topicTitle || result.topic || 'Ismeretlen témakör'}
                                            </h3>
                                            <div style={{
                                                display: 'flex',
                                                gap: '1rem',
                                                flexWrap: 'wrap',
                                                fontSize: '0.9rem',
                                                color: '#ffffff'
                                            }}>
                                                {result.educationLevel && (
                                                    <span>
                                                        {result.educationLevel === 'elementary' ? '🎒' : 
                                                         result.educationLevel === 'highschool' ? '📚' : 
                                                         result.educationLevel === 'university' ? '🎓' : ''} 
                                                        {result.educationLevel === 'elementary' ? 'Általános iskola' : 
                                                         result.educationLevel === 'highschool' ? 'Középiskola' : 
                                                         result.educationLevel === 'university' ? 'Egyetem' : result.educationLevel}
                                                    </span>
                                                )}
                                                {result.level && (
                                                    <span>Szint: {result.level === 'kozep' ? 'Közép' : 'Emelt'}</span>
                                                )}
                                                {result.grade && (
                                                    <span>{result.grade}. osztály</span>
                                                )}
                                                {result.subject && (
                                                    <span>Tantárgy: {result.subject}</span>
                                                )}
                                            </div>
                                        </div>
                                        <div style={{
                                            display: 'flex',
                                            gap: '2rem',
                                            alignItems: 'center',
                                            flexWrap: 'wrap'
                                        }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                    fontSize: '1.5rem',
                                                    fontWeight: 'bold',
                                                    color: '#39ff14'
                                                }}>
                                                    {result.correct}/{result.total}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.8rem',
                                                    color: '#ffffff'
                                                }}>
                                                    Helyes/Összes
                                                </div>
                                            </div>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{
                                                    fontSize: '1.5rem',
                                                    fontWeight: 'bold',
                                                    color: '#39ff14'
                                                }}>
                                                    {result.score}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.8rem',
                                                    color: '#ffffff'
                                                }}>
                                                    Pontszám
                                                </div>
                                            </div>
                                            <div style={{
                                                fontSize: '0.8rem',
                                                color: '#ffffff',
                                                textAlign: 'right'
                                            }}>
                                                {formatDate(result.completedAt)}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </>
    );
}

