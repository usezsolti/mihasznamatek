import { useState } from 'react';

type ChatGPTMessage = {
    role: 'user' | 'assistant' | 'system';
    content: string;
};

type ChatGPTIntegrationProps = {
    apiKey: string;
    onResponse: (response: string) => void;
    onError: (error: string) => void;
};

const ChatGPTIntegration = ({ apiKey, onResponse, onError }: ChatGPTIntegrationProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const sendToChatGPT = async (userMessage: string, conversationHistory: ChatGPTMessage[]) => {
        if (!apiKey) {
            onError('ChatGPT API kulcs nincs beállítva');
            return;
        }

        setIsLoading(true);

        try {
            const messages: ChatGPTMessage[] = [
                {
                    role: 'system',
                    content: 'Te vagy MihaAI, a Mihaszna Matek automatikus asszisztense. Segítesz matematikai oktatási kérdésekben, időpontfoglalásban és általános információkat adsz Zsolt tanár szolgáltatásairól. Válaszolj magyarul, barátságosan és segítőkészen.'
                },
                ...conversationHistory,
                {
                    role: 'user',
                    content: userMessage
                }
            ];

            const response = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${apiKey}`
                },
                body: JSON.stringify({
                    model: 'gpt-3.5-turbo',
                    messages: messages,
                    max_tokens: 500,
                    temperature: 0.7
                })
            });

            if (!response.ok) {
                throw new Error(`ChatGPT API hiba: ${response.status}`);
            }

            const data = await response.json();
            const assistantResponse = data.choices[0]?.message?.content;

            if (assistantResponse) {
                onResponse(assistantResponse);
            } else {
                onError('Nem sikerült választ kapni a ChatGPT-től');
            }
        } catch (error) {
            console.error('ChatGPT API hiba:', error);
            onError('Hiba történt a ChatGPT API-val való kommunikáció során');
        } finally {
            setIsLoading(false);
        }
    };

    return { sendToChatGPT, isLoading };
};

export default ChatGPTIntegration;













