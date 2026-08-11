import { useCallback, useState } from 'react';
import { apiChatGemini } from '../utils/apiClient';

export type ChatMsg = {
    id: string;
    text: string;
    isUser: boolean;
};

const WELCOME: ChatMsg = {
    id: 'welcome',
    text: 'Szia! Én vagyok MihaAI — matek órákról, árról és foglalásról kérdezhetsz.',
    isUser: false,
};

/** Application hook — chat UI a presentation rétegben marad. */
export function useMatekChat() {
    const [messages, setMessages] = useState<ChatMsg[]>([WELCOME]);
    const [busy, setBusy] = useState(false);

    const send = useCallback(async (text: string) => {
        const cleaned = text.trim();
        if (!cleaned || busy) return;

        const userMsg: ChatMsg = { id: `u_${Date.now()}`, text: cleaned, isUser: true };
        setMessages((prev) => [...prev, userMsg]);
        setBusy(true);

        const history = messages
            .filter((m) => m.id !== 'welcome')
            .slice(-8)
            .map((m) => ({ role: m.isUser ? 'user' : 'model', text: m.text }));

        try {
            const res = await apiChatGemini(cleaned, history);
            const reply = res.ok
                ? String(
                      res.data.reply ||
                          'Most nem tudok válaszolni — próbáld később, vagy nézd az Időpontfoglalást.'
                  )
                : 'Most nem tudok válaszolni — próbáld később, vagy nézd az Időpontfoglalást.';
            setMessages((prev) => [...prev, { id: `b_${Date.now()}`, text: reply, isUser: false }]);
        } catch {
            setMessages((prev) => [
                ...prev,
                {
                    id: `b_${Date.now()}`,
                    text: 'Hálózati hiba. Próbáld újra, vagy használd a Kapcsolatok menüt.',
                    isUser: false,
                },
            ]);
        } finally {
            setBusy(false);
        }
    }, [busy, messages]);

    return { messages, busy, send };
}
