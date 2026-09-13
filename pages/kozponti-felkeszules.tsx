import { useEffect } from 'react';
import { useRouter } from 'next/router';

/** Régi külön oldal — a központi felvételi a dashboard kategóriái között van. */
export default function KozpontiFelkeszules() {
    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            localStorage.setItem('educationLevel', 'kozponti');
        }
        router.replace('/dashboard');
    }, [router]);

    return (
        <div className="dashboard-container modern-theme has-site-navbar">
            <main className="main-content">
                <p>Átirányítás a gyakorláshoz…</p>
            </main>
        </div>
    );
}
