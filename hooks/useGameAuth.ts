import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';
import { loadUserPracticeProgress } from '../utils/practiceProgress';
import { isAdminEmail } from '../utils/admin';

export type GameAuthUser = {
    uid: string;
    email: string | null;
    displayName: string | null;
    photoURL: string | null;
};

export function useGameAuth() {
    const { data: session, status } = useSession();
    const [totalXp, setTotalXp] = useState(0);
    const [avatarLevel, setAvatarLevel] = useState(1);

    const currentUser: GameAuthUser | null = session?.user?.id
        ? {
              uid: session.user.id,
              email: session.user.email || null,
              displayName: session.user.name || null,
              photoURL: session.user.image || null,
          }
        : null;

    const isAdmin = Boolean(
        currentUser?.email && isAdminEmail(currentUser.email)
    );
    const loading = status === 'loading';

    useEffect(() => {
        if (!currentUser?.uid) {
            setTotalXp(0);
            setAvatarLevel(1);
            return;
        }
        let cancelled = false;
        (async () => {
            try {
                const prog = await loadUserPracticeProgress(currentUser.uid);
                if (!cancelled) {
                    setTotalXp(prog.xp);
                    setAvatarLevel(prog.rankLevel);
                }
            } catch (e) {
                console.error('Progress load error:', e);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [currentUser?.uid]);

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
