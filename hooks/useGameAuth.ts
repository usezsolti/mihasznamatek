import { useState, useEffect } from 'react';
import { loadUserPracticeProgress } from '../utils/practiceProgress';
import { isAdminEmail } from '../utils/admin';

export function useGameAuth() {
    const [currentUser, setCurrentUser] = useState<any>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);
    const [totalXp, setTotalXp] = useState(0);
    const [avatarLevel, setAvatarLevel] = useState(1);

    useEffect(() => {
        let unsub: (() => void) | undefined;
        let cancelled = false;

        const checkAuth = async () => {
            let attempts = 0;
            while (!(window as any).firebase && attempts < 50) {
                await new Promise(resolve => setTimeout(resolve, 100));
                attempts++;
            }

            if (cancelled) return;

            if (!(window as any).firebase) {
                setLoading(false);
                return;
            }

            try {
                const auth = (window as any).firebase.auth();
                unsub = auth.onAuthStateChanged(async (user: any) => {
                    if (!user) {
                        // Ha nincs bejelentkezve, engedjük a játékot
                        setLoading(false);
                        return;
                    }

                    setCurrentUser(user);

                    // Admin ellenőrzés - csak admin email férhet hozzá a játék módosításhoz
                    if (isAdminEmail(user.email)) {
                        console.log('Admin hozzáférés engedélyezve:', user.email);
                        setIsAdmin(true);
                    } else {
                        console.log('Felhasználó játékban:', user.email);
                        setIsAdmin(false);
                    }
                    try {
                        const prog = await loadUserPracticeProgress(user.uid);
                        setTotalXp(prog.xp);
                        setAvatarLevel(prog.rankLevel);
                    } catch (e) {
                        console.error('Progress load error:', e);
                    }
                    setLoading(false);
                });
            } catch (err) {
                console.error('Auth error:', err);
                setLoading(false);
            }
        };

        void checkAuth();

        return () => {
            cancelled = true;
            unsub?.();
        };
    }, []);

    return {
        currentUser,
        isAdmin,
        loading,
        totalXp,
        setTotalXp,
        avatarLevel,
        setAvatarLevel,
    };
}
