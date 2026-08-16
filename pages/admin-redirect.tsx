import { useEffect } from 'react';
import { useRouter } from 'next/router';

/** Régi /admin-redirect → tanári belépés vagy konzol */
export default function AdminRedirect() {
    const router = useRouter();

    useEffect(() => {
        let cancelled = false;
        (async () => {
            let attempts = 0;
            while (!(window as any).firebase?.auth && attempts < 40) {
                await new Promise((r) => setTimeout(r, 100));
                attempts++;
            }
            if (cancelled) return;
            const user = (window as any).firebase?.auth?.()?.currentUser;
            if (user) {
                void router.replace('/dashboard?tab=admin');
            } else {
                void router.replace('/admin-login');
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [router]);

    return (
        <div className="dashboard-container dark-theme">
            <div className="loading-screen">
                <p>Átirányítás…</p>
            </div>
        </div>
    );
}
