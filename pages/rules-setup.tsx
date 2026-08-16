import Head from 'next/head';
import Link from 'next/link';

/** Legacy Firestore rules page — Firebase removed. */
export default function RulesSetupPage() {
    return (
        <div style={{ maxWidth: 880, margin: '2rem auto', padding: '0 1rem', color: '#eee' }}>
            <Head>
                <title>Backend setup | Mihaszna Matek</title>
            </Head>
            <h1>Firebase eltávolítva</h1>
            <p>
                Az alkalmazás már nem használ Firebase-t vagy Firestore rules-t. Az adatok PostgreSQL-ben
                (Prisma) és Auth.js munkamenetben futnak.
            </p>
            <ul>
                <li>
                    Állítsd be a <code>DATABASE_URL</code>, <code>AUTH_SECRET</code> és{' '}
                    <code>NEXTAUTH_URL</code> env változókat.
                </li>
                <li>
                    Futtasd: <code>npm run prisma:migrate</code>
                </li>
                <li>
                    Admin belépés: <Link href="/admin-login">/admin-login</Link>
                </li>
                <li>
                    Tanári konzol: <Link href="/dashboard?tab=admin">/dashboard?tab=admin</Link>
                </li>
            </ul>
        </div>
    );
}
