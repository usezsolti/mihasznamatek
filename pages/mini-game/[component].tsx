import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';

export default function MiniGamePage() {
    const router = useRouter();
    const { component } = router.query;
    const [GameComponent, setGameComponent] = useState<React.ComponentType | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!component) return;

        const loadGameComponent = async () => {
            try {
                setLoading(true);
                setError(null);

                // Dynamic import based on component name
                let Component;
                switch (component) {
                    case 'MathCraftGame':
                        Component = dynamic(() => import('../../components/MathCraftGame'), {
                            ssr: false,
                            loading: () => <div>Játék betöltése...</div>
                        });
                        break;
                    default:
                        throw new Error(`Ismeretlen játék komponens: ${component}`);
                }

                setGameComponent(() => Component);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Ismeretlen hiba történt');
            } finally {
                setLoading(false);
            }
        };

        loadGameComponent();
    }, [component]);

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                    <h2 className="text-xl font-semibold">Játék betöltése...</h2>
                    <p className="text-slate-400">Kérlek várj egy pillanatot</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">❌</div>
                    <h2 className="text-xl font-semibold text-red-400 mb-2">Hiba történt</h2>
                    <p className="text-slate-400 mb-4">{error}</p>
                    <button
                        onClick={() => router.push('/game')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                    >
                        Vissza a Game oldalra
                    </button>
                </div>
            </div>
        );
    }

    if (!GameComponent) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-slate-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="text-6xl mb-4">🎮</div>
                    <h2 className="text-xl font-semibold mb-2">Játék komponens nem található</h2>
                    <p className="text-slate-400 mb-4">A kért játék nem létezik</p>
                    <button
                        onClick={() => router.push('/game')}
                        className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors"
                    >
                        Vissza a Game oldalra
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 to-slate-900">
            <GameComponent />
        </div>
    );
}

