import { SessionProvider, useSession } from 'next-auth/react';
import { useEffect, type ReactNode } from 'react';
import { flushPendingProfile } from './AuthModal';

function PendingProfileSync() {
    const { status } = useSession();

    useEffect(() => {
        if (status !== 'authenticated') return;
        void flushPendingProfile();
    }, [status]);

    return null;
}

export default function AuthSessionProvider({ children }: { children: ReactNode }) {
    return (
        <SessionProvider>
            <PendingProfileSync />
            {children}
        </SessionProvider>
    );
}
