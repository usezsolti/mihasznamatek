import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

/** Régi /admin-redirect → tanári belépés vagy konzol */
export default function AdminRedirect() {
    const router = useRouter();
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === 'loading') return;
        if (session?.user) {
            void router.replace('/dashboard?tab=admin');
        } else {
            void router.replace('/admin-login');
        }
    }, [router, session, status]);

    return (
        <div className="dashboard-container dark-theme">
            <div className="loading-screen">
                <p>Átirányítás…</p>
            </div>
        </div>
    );
}
