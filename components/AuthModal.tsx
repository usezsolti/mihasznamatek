import { signIn } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import {
    LESSON_SUBJECTS,
    type PreferredLessonType,
    type RegistrationProfile,
    validateRegistrationProfile,
} from '../utils/registrationProfile';
import {
    formatAuthError,
    signInAsTestUser,
    TEST_LOGIN_EMAIL,
    isTestLoginAllowed,
} from '../utils/testLogin';
import { useLang } from '../utils/i18n';

type AuthMode = 'login' | 'register';

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialMode?: 'login' | 'register';
    redirectTo?: string | false;
}

const PENDING_PROFILE_KEY = 'mihaszna:pendingProfile';

function mapCredentialsError(error?: string | null): string {
    switch (error) {
        case 'CredentialsSignin':
            return 'Hibás e-mail cím vagy jelszó.';
        case 'EMAIL_IN_USE':
            return 'Ez az e-mail cím már regisztrálva van. Próbálj bejelentkezni!';
        default:
            return error ? `Hiba történt (${error}).` : 'Hiba történt. Kérjük, próbáld újra.';
    }
}

async function saveRegistrationProfile(
    profile: RegistrationProfile,
    opts?: { gdprAccepted?: boolean; name?: string }
) {
    const { apiPostAuth } = await import('../utils/apiClient');
    const res = await apiPostAuth('/api/user/profile', {
        name: opts?.name || profile.name,
        profile: {
            preferredLessonType: profile.preferredLessonType,
            preferredSubject: profile.preferredSubject,
            hobby: profile.hobby || '',
            postalCode: profile.postalCode,
            street: profile.street,
            houseNumber: profile.houseNumber,
            profileCompletedAt: new Date().toISOString(),
        },
        gdprAccepted: Boolean(opts?.gdprAccepted),
    });
    if (!res.ok) {
        console.warn('Profile save failed:', res.error);
    }
}

export function stashPendingGoogleProfile(profile: RegistrationProfile) {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem(
        PENDING_PROFILE_KEY,
        JSON.stringify({ profile, gdprAccepted: true })
    );
}

export async function flushPendingProfile(): Promise<void> {
    if (typeof window === 'undefined') return;
    const raw = sessionStorage.getItem(PENDING_PROFILE_KEY);
    if (!raw) return;
    try {
        const parsed = JSON.parse(raw) as {
            profile?: RegistrationProfile;
            gdprAccepted?: boolean;
        };
        if (parsed.profile) {
            await saveRegistrationProfile(parsed.profile, {
                gdprAccepted: parsed.gdprAccepted,
                name: parsed.profile.name,
            });
        } else if (parsed.gdprAccepted) {
            const { apiPostAuth } = await import('../utils/apiClient');
            await apiPostAuth('/api/user/profile', { gdprAccepted: true });
        }
    } catch (e) {
        console.warn('flushPendingProfile:', e);
    } finally {
        sessionStorage.removeItem(PENDING_PROFILE_KEY);
    }
}

const emptyProfile = () => ({
    lessonType: 'online' as PreferredLessonType,
    subject: LESSON_SUBJECTS[0] as string,
    hobby: '',
    postalCode: '',
    street: '',
    houseNumber: '',
});

export default function AuthModal({
    isOpen,
    onClose,
    initialMode = 'login',
    redirectTo,
}: AuthModalProps) {
    const router = useRouter();
    const { t } = useLang();
    const [mode, setMode] = useState<AuthMode>(initialMode);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [lessonType, setLessonType] = useState<PreferredLessonType>('online');
    const [subject, setSubject] = useState<string>(LESSON_SUBJECTS[0]);
    const [hobby, setHobby] = useState('');
    const [postalCode, setPostalCode] = useState('');
    const [street, setStreet] = useState('');
    const [houseNumber, setHouseNumber] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [gdprAccepted, setGdprAccepted] = useState(false);

    const buildProfile = (): RegistrationProfile => ({
        name: name.trim(),
        preferredLessonType: lessonType,
        preferredSubject: subject,
        hobby: hobby.trim(),
        postalCode: postalCode.trim(),
        street: street.trim(),
        houseNumber: houseNumber.trim(),
    });

    const resolveCallbackUrl = () => {
        if (redirectTo === false) return undefined;
        if (typeof redirectTo === 'string' && redirectTo) return redirectTo;
        return '/dashboard';
    };

    const finishAuthSuccess = () => {
        onClose();
        if (redirectTo === false) return;
        const target = resolveCallbackUrl();
        if (!target) return;
        const here =
            typeof window !== 'undefined'
                ? `${window.location.pathname}${window.location.search}`
                : '';
        if (here === target || router.asPath === target) return;
        void router.push(target);
    };

    const resetForm = () => {
        setName('');
        setEmail('');
        setPassword('');
        const p = emptyProfile();
        setLessonType(p.lessonType);
        setSubject(p.subject);
        setHobby(p.hobby);
        setPostalCode(p.postalCode);
        setStreet(p.street);
        setHouseNumber(p.houseNumber);
        setGdprAccepted(false);
        setError('');
    };

    useEffect(() => {
        if (!isOpen) {
            setLoading(false);
            resetForm();
            return;
        }
        setMode(initialMode);
        setGdprAccepted(false);
        setError('');
        const onKey = (e: KeyboardEvent) => {
            if (e.key === 'Escape') onClose();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isOpen, onClose, initialMode]);

    useEffect(() => {
        if (isOpen) setMode(initialMode);
    }, [initialMode, isOpen]);

    const switchMode = (next: AuthMode) => {
        setMode(next);
        setError('');
        setGdprAccepted(false);
    };

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            if (mode === 'register') {
                const profile = buildProfile();
                const profileErr = validateRegistrationProfile(profile);
                if (profileErr) {
                    setError(profileErr);
                    return;
                }
                if (!gdprAccepted) {
                    setError(t('auth.errorGdpr'));
                    return;
                }
            }

            const result = await signIn('credentials', {
                email: email.trim(),
                password,
                name: mode === 'register' ? name.trim() : undefined,
                register: mode === 'register' ? '1' : '0',
                redirect: false,
            });

            if (result?.error) {
                setError(mapCredentialsError(result.error));
                return;
            }

            if (mode === 'register') {
                await saveRegistrationProfile(buildProfile(), {
                    gdprAccepted: true,
                    name: name.trim(),
                });
            }

            setPassword('');
            finishAuthSuccess();
        } catch (err: any) {
            console.error(err);
            setError(formatAuthError(err) || mapCredentialsError(err?.message));
        } finally {
            setLoading(false);
        }
    };

    const handleTestLogin = async () => {
        setError('');
        setLoading(true);
        try {
            const result = await signInAsTestUser();
            setPassword('');
            setEmail(result.email.includes('@') ? result.email : TEST_LOGIN_EMAIL);
            onClose();
            if (redirectTo === false) return;
            const target = resolveCallbackUrl();
            if (!target) return;
            const here =
                typeof window !== 'undefined'
                    ? `${window.location.pathname}${window.location.search}`
                    : '';
            if (here === target || router.asPath === target) return;
            void router.push(target);
        } catch (err: any) {
            console.error(err);
            setError(formatAuthError(err) || mapCredentialsError(err?.message));
        } finally {
            setLoading(false);
        }
    };

    const handleGoogle = async () => {
        setError('');
        if (mode === 'register') {
            const profile = buildProfile();
            const profileErr = validateRegistrationProfile(profile);
            if (profileErr) {
                setError(profileErr);
                return;
            }
            if (!gdprAccepted) {
                setError(t('auth.errorGdpr'));
                return;
            }
            stashPendingGoogleProfile(profile);
        }
        setLoading(true);
        try {
            const callbackUrl = resolveCallbackUrl() || '/dashboard';
            await signIn('google', { callbackUrl });
        } catch (err: any) {
            console.error(err);
            setError(formatAuthError(err) || mapCredentialsError(err?.message));
            setLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div
            className="auth-modal show"
            role="dialog"
            aria-modal="true"
            aria-labelledby="auth-modal-title"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="auth-modal-content">
                <button
                    type="button"
                    className="auth-modal-close"
                    onClick={onClose}
                    aria-label={t('common.close')}
                >
                    <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden>
                        <path
                            d="M6 6l12 12M18 6L6 18"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2.2"
                            strokeLinecap="round"
                        />
                    </svg>
                </button>
                <h2 id="auth-modal-title">
                    {mode === 'login' ? t('auth.login') : t('auth.register')}
                </h2>

                <>
                    <div className="auth-tabs">
                        <button
                            type="button"
                            className={'auth-tab ' + (mode === 'login' ? 'active' : '')}
                            onClick={() => switchMode('login')}
                        >
                            {t('auth.login')}
                        </button>
                        <button
                            type="button"
                            className={'auth-tab ' + (mode === 'register' ? 'active' : '')}
                            onClick={() => switchMode('register')}
                        >
                            {t('auth.register')}
                        </button>
                    </div>

                    <div className="auth-tab-content active">
                        {mode === 'login' && isTestLoginAllowed() && (
                            <div style={{ marginBottom: '1rem' }}>
                                <button
                                    type="button"
                                    className="google-login-btn"
                                    onClick={handleTestLogin}
                                    disabled={loading}
                                    style={{
                                        background: 'rgba(255, 215, 0, 0.18)',
                                        border: '2px solid #ffd700',
                                        color: '#ffd700',
                                        width: '100%',
                                        position: 'relative',
                                        zIndex: 5,
                                    }}
                                >
                                    {loading ? t('auth.loggingIn') : t('auth.testLogin')}
                                </button>
                                <p
                                    style={{
                                        color: '#888',
                                        fontSize: '0.75rem',
                                        margin: '0.45rem 0 0',
                                        textAlign: 'center',
                                    }}
                                >
                                    Dev: {TEST_LOGIN_EMAIL} (jelszó csak szerveren)
                                </p>
                                <div className="auth-divider" style={{ margin: '1rem 0' }}>
                                    <span>{t('auth.orEmailGoogle')}</span>
                                </div>
                            </div>
                        )}
                        <form className="email-form" onSubmit={handleEmailSubmit}>
                            {mode === 'register' && (
                                <div className="form-group">
                                    <label htmlFor="auth-modal-name">{t('auth.name')}</label>
                                    <input
                                        id="auth-modal-name"
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder={t('auth.namePlaceholder')}
                                        autoComplete="name"
                                        required
                                    />
                                </div>
                            )}
                            <div className="form-group">
                                <label htmlFor="auth-modal-email">{t('auth.email')}</label>
                                <input
                                    id="auth-modal-email"
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t('auth.emailPlaceholder')}
                                    autoComplete="email"
                                    required
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="auth-modal-password">{t('auth.password')}</label>
                                <input
                                    id="auth-modal-password"
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t('auth.passwordPlaceholder')}
                                    autoComplete={
                                        mode === 'login' ? 'current-password' : 'new-password'
                                    }
                                    minLength={6}
                                    required
                                />
                            </div>

                            {mode === 'register' && (
                                <div
                                    className="auth-register-extra"
                                    style={{
                                        display: 'block',
                                        visibility: 'visible',
                                        opacity: 1,
                                        width: '100%',
                                        marginTop: '0.5rem',
                                        paddingTop: '0.75rem',
                                        borderTop: '1px solid rgba(57,255,20,0.4)',
                                    }}
                                >
                                    <p
                                        className="auth-extra-title"
                                        style={{
                                            color: '#39ff14',
                                            fontWeight: 700,
                                            textAlign: 'left',
                                            margin: '0 0 0.85rem',
                                        }}
                                    >
                                        {t('auth.bookingDetails')}
                                    </p>
                                    <div className="form-group">
                                        <label>{t('auth.lessonType')}</label>
                                        <div className="auth-lesson-toggle">
                                            <button
                                                type="button"
                                                className={lessonType === 'online' ? 'active' : ''}
                                                onClick={() => setLessonType('online')}
                                            >
                                                {t('auth.online')}
                                            </button>
                                            <button
                                                type="button"
                                                className={lessonType === 'personal' ? 'active' : ''}
                                                onClick={() => setLessonType('personal')}
                                            >
                                                {t('auth.personal')}
                                            </button>
                                        </div>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="auth-modal-subject">{t('auth.subject')}</label>
                                        <select
                                            id="auth-modal-subject"
                                            value={subject}
                                            onChange={(e) => setSubject(e.target.value)}
                                            required
                                            style={{
                                                width: '100%',
                                                padding: '1rem',
                                                background: '#000',
                                                color: '#fff',
                                                border: '2px solid rgba(255,255,255,0.15)',
                                                borderRadius: 10,
                                            }}
                                        >
                                            {LESSON_SUBJECTS.map((s) => (
                                                <option key={s} value={s}>
                                                    {s}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="auth-modal-hobby">{t('auth.hobby')}</label>
                                        <input
                                            id="auth-modal-hobby"
                                            type="text"
                                            value={hobby}
                                            onChange={(e) => setHobby(e.target.value)}
                                            placeholder={t('auth.hobbyPlaceholder')}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>{t('auth.billing')}</label>
                                        <p
                                            style={{
                                                color: '#ddd',
                                                fontSize: '0.8rem',
                                                margin: '0 0 0.5rem',
                                                textAlign: 'left',
                                            }}
                                        >
                                            {t('auth.billingHint')}
                                        </p>
                                        <div className="auth-address-row">
                                            <input
                                                type="text"
                                                value={postalCode}
                                                onChange={(e) => setPostalCode(e.target.value)}
                                                placeholder={t('auth.postalCode')}
                                                required
                                                autoComplete="postal-code"
                                            />
                                            <input
                                                type="text"
                                                value={street}
                                                onChange={(e) => setStreet(e.target.value)}
                                                placeholder={t('auth.street')}
                                                required
                                                autoComplete="street-address"
                                            />
                                            <input
                                                type="text"
                                                value={houseNumber}
                                                onChange={(e) => setHouseNumber(e.target.value)}
                                                placeholder={t('auth.houseNumber')}
                                                required
                                            />
                                        </div>
                                    </div>
                                    <label className="gdpr-consent">
                                        <input
                                            type="checkbox"
                                            checked={gdprAccepted}
                                            onChange={(e) => setGdprAccepted(e.target.checked)}
                                            required
                                        />
                                        <span style={{ color: '#fff' }}>
                                            {t('auth.gdprPrefix')}{' '}
                                            <a
                                                href="/adatkezelesi-tajekoztato"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                            >
                                                {t('auth.gdprLink')}
                                            </a>{' '}
                                            (GDPR). *
                                        </span>
                                    </label>
                                </div>
                            )}

                            {error && <p className="form-msg">{error}</p>}

                            <button type="submit" className="submit-btn" disabled={loading}>
                                {loading
                                    ? t('auth.processing')
                                    : mode === 'login'
                                      ? t('auth.login')
                                      : t('auth.register')}
                            </button>
                        </form>

                        <div className="auth-divider">
                            <span>{t('common.or')}</span>
                        </div>

                        <button
                            type="button"
                            className="google-login-btn"
                            onClick={handleGoogle}
                            disabled={loading}
                        >
                            {t('auth.google')}
                        </button>

                        {mode === 'login' && (
                            <button
                                type="button"
                                className="auth-admin-login-btn"
                                disabled={loading}
                                onClick={async () => {
                                    setLoading(true);
                                    setError('');
                                    try {
                                        const { signInAsAdmin } = await import('../utils/adminLogin');
                                        await signInAsAdmin();
                                        onClose();
                                        router.push('/dashboard?tab=admin');
                                    } catch (err: any) {
                                        setError(err?.message || 'Tanári belépés sikertelen.');
                                    } finally {
                                        setLoading(false);
                                    }
                                }}
                            >
                                <svg
                                    className="auth-admin-login-ico"
                                    viewBox="0 0 24 24"
                                    width="16"
                                    height="16"
                                    aria-hidden
                                >
                                    <path
                                        fill="currentColor"
                                        d="M5 16l2-8 3 3 2-5 2 5 3-3 2 8H5zm0 2h14v2H5v-2z"
                                    />
                                </svg>
                                {loading ? t('auth.teacherLoggingIn') : t('auth.teacherLogin')}
                            </button>
                        )}

                        {mode === 'register' && (
                            <p
                                style={{
                                    color: '#aaa',
                                    fontSize: '0.8rem',
                                    marginTop: '0.75rem',
                                    textAlign: 'center',
                                }}
                            >
                                {t('auth.googleRegisterHint')}
                            </p>
                        )}
                    </div>
                </>
            </div>
        </div>
    );
}
