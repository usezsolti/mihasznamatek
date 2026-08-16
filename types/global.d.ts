declare global {
    interface Window {
        firebase: {
            auth: () => {
                onAuthStateChanged: (callback: (user: { uid: string; email?: string; displayName?: string } | null) => void) => void;
                createUserWithEmailAndPassword: (email: string, password: string) => Promise<{ user: { updateProfile: (profile: { displayName: string }) => Promise<void> } }>;
            };
            firestore: () => {
                collection: (name: string) => {
                    get: () => Promise<{
                        forEach: (callback: (doc: { data: () => Record<string, unknown>; id: string }) => void) => void;
                    }>;
                    doc: (id: string) => {
                        get: () => Promise<{ exists: boolean; data: () => Record<string, unknown> }>;
                    };
                };
            };
            apps: unknown[];
        };
        emailjs: {
            init: (userId: string) => void;
            send: (serviceId: string, templateId: string, templateParams: Record<string, unknown>) => Promise<{ status: number; text: string }>;
        };
    }
}

export { };
