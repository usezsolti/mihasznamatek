import { useEffect } from 'react';
import { useRouter } from 'next/router';

/** Régi /admin-dashboard → tanári konzol */
export default function AdminDashboardRedirect() {
    const router = useRouter();
    useEffect(() => {
        void router.replace('/dashboard?tab=admin');
    }, [router]);
    return (
        <div className="dashboard-container dark-theme">
            <div className="loading-screen">
                <p>Átirányítás a tanári konzolra…</p>
            </div>
        </div>
    );
}
