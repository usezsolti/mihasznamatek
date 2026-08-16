declare global {
    interface Window {
        emailjs: {
            init: (userId: string) => void;
            send: (serviceId: string, templateId: string, templateParams: Record<string, unknown>) => Promise<{ status: number; text: string }>;
        };
        initMap?: () => void;
    }
}

export { };
