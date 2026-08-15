import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';

/**
 * A feladatkiosztás a Tanári konzolon van (/dashboard?tab=admin&view=tasks).
 * Ez az oldal csak átirányít.
 */
export default function ExamPrepRedirect() {
    const router = useRouter();

    useEffect(() => {
        void router.replace('/dashboard?tab=admin&view=tasks');
    }, [router]);

    return (
        <>
            <Head>
                <title>Feladatkiosztás | Mihaszna Matek</title>
            </Head>
            <p style={{ padding: '2rem', color: '#aaa', textAlign: 'center' }}>
                Átirányítás a tanári konzolra…
            </p>
        </>
    );
}
