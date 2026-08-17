import { useEffect } from 'react';
import { useRouter } from 'next/router';

/** Régi nyilvános admin URL — ne árulja el a titkos belépőt. */
export default function DeadAdminDashboardPath() {
    const router = useRouter();
    useEffect(() => {
        void router.replace('/');
    }, [router]);
    return null;
}
