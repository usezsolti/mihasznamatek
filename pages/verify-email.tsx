import Link from 'next/link';
import type { GetServerSideProps } from 'next';
import { confirmEmailVerificationToken } from '../server/confirmEmailVerification';

type Props = {
    ok: boolean;
    message: string;
};

export const getServerSideProps: GetServerSideProps<Props> = async (ctx) => {
    const result = await confirmEmailVerificationToken(ctx.query.token);
    if (result.ok) {
        const secure = process.env.NODE_ENV === 'production' ? '; Secure' : '';
        ctx.res.setHeader(
            'Set-Cookie',
            `mm_email_verified=${result.session}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${90 * 24 * 3600}${secure}`
        );
        return {
            props: {
                ok: true,
                message: 'E-mail cím megerősítve. Most már bejelentkezhetsz.',
            },
        };
    }
    return {
        props: {
            ok: false,
            message: result.error,
        },
    };
};

export default function VerifyEmailPage({ ok, message }: Props) {
    return (
        <main style={{ maxWidth: 480, margin: '4rem auto', padding: '0 1.25rem', fontFamily: 'system-ui, sans-serif' }}>
            <h1 style={{ fontSize: '1.5rem' }}>Mihaszna Matek</h1>
            <p style={{ color: ok ? '#027a48' : '#b42318' }}>{message}</p>
            <p>
                <Link href="/">Vissza a főoldalra</Link>
                {' · '}
                <Link href="/dashboard">Belépés</Link>
            </p>
        </main>
    );
}
