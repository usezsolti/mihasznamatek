import { useState, useEffect, useRef } from 'react';
import ChatGPTIntegration from './ChatGPTIntegration';

type Message = {
    id: string;
    text: string;
    isUser: boolean;
    timestamp: Date;
    showQuickReplies?: boolean;
};

type ChatBotProps = {
    isOpen: boolean;
    onClose: () => void;
    isMinimized?: boolean;
    onToggleMinimize?: () => void;
};

const ChatBot = ({ isOpen, onClose, isMinimized = false, onToggleMinimize }: ChatBotProps) => {
    const [messages, setMessages] = useState<Message[]>([
        {
            id: '1',
            text: 'Üdvözlöm! Én vagyok MihaAI, a Mihaszna Matek automatikus asszisztense. Miben segíthetek?',
            isUser: false,
            timestamp: new Date()
        }
    ]);
    const [hasAutoStarted, setHasAutoStarted] = useState(false);
    const [inputValue, setInputValue] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [useChatGPT, setUseChatGPT] = useState(true); // Mindig ChatGPT-t használjon
    const [chatGPTApiKey, setChatGPTApiKey] = useState('sk-proj-YourAPIKeyHere'); // Alapértelmezett API kulcs
    const messagesEndRef = useRef<HTMLDivElement>(null);

    // ChatGPT integráció
    const { sendToChatGPT, isLoading: chatGPTLoading } = ChatGPTIntegration({
        apiKey: chatGPTApiKey,
        onResponse: (response: string) => {
            const botResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: response,
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, botResponse]);
            setIsTyping(false);
        },
        onError: (error: string) => {
            const errorResponse: Message = {
                id: (Date.now() + 1).toString(),
                text: `Hiba: ${error}. Visszatérek a helyi válaszokhoz.`,
                isUser: false,
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorResponse]);
            setUseChatGPT(false);
            setIsTyping(false);
        }
    });

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    // Automatikus üzenet küldés amikor a chat megnyílik
    useEffect(() => {
        if (isOpen && !hasAutoStarted) {
            setHasAutoStarted(true);

            // Első automatikus üzenet 1 másodperc után
            setTimeout(() => {
                const welcomeMessage: Message = {
                    id: Date.now().toString(),
                    text: 'Tudni szeretnéd Zsolti miért is igazi MIHASZNA? Szeretnél te is az lenni? Vágjunk bele!',
                    isUser: false,
                    timestamp: new Date()
                };
                setMessages(prev => [...prev, welcomeMessage]);
            }, 1000);

            // Gyakran kérdezett kérdések 3 másodperc után
            setTimeout(() => {
                const faqMessage: Message = {
                    id: (Date.now() + 1).toString(),
                    text: 'Válasszon egy gyakran kérdezett kérdést:',
                    isUser: false,
                    timestamp: new Date(),
                    showQuickReplies: true
                };
                setMessages(prev => [...prev, faqMessage]);
            }, 3000);
        }
    }, [isOpen, hasAutoStarted]);

    const generateResponse = (userMessage: string): string => {
        const lowerMessage = userMessage.toLowerCase();

        // Gyakran kérdezett kérdések
        if (lowerMessage.includes('kiket vállal') || lowerMessage.includes('milyen diákok')) {
            return 'Általános iskolás, középiskolás és egyetemi hallgató diákokat is vállalok, az alapoktól egészen a felsőfokú matematika témákig.';
        }

        if (lowerMessage.includes('ár') || lowerMessage.includes('díj') || lowerMessage.includes('fizetés') || lowerMessage.includes('mennyibe')) {
            return 'Az óradíjam 11 000 Ft / 60 perc. Ha több diák vesz részt ugyanazon az órán, kedvezményt adok az árra.';
        }

        if (lowerMessage.includes('időpont') || lowerMessage.includes('foglalás') || lowerMessage.includes('mikor') || lowerMessage.includes('hogyan foglal')) {
            return 'Az időpontfoglaló rendszerrel tudsz órát foglalni, ami a honlapomon található. Csak válaszd ki a számodra megfelelő időpontot, és erősítsd meg a foglalást.';
        }

        if (lowerMessage.includes('online') || lowerMessage.includes('távoktatás') || lowerMessage.includes('zoom')) {
            return 'Igen, Zoomon, Google Meeten és Microsoft Teamsen keresztül is tartok órákat, digitális táblával és interaktív feladatokkal, így a tananyag ugyanúgy érthető, mint személyesen.';
        }

        if (lowerMessage.includes('szint') || lowerMessage.includes('érettségi') || lowerMessage.includes('alap') || lowerMessage.includes('emelt')) {
            return 'Általános iskolástól a haladó szintig minden tudásszinten segítek. Lehet szó korrepetálásról, érettségi felkészítésről vagy egyetemi vizsgára való intenzív felkészítésről.';
        }

        if (lowerMessage.includes('tapasztalat') || lowerMessage.includes('hány év') || lowerMessage.includes('szakképzettség')) {
            return 'Több mint 4 éve tanítok magántanárként, középiskolásoktól egyetemistákig. A matematika területén széleskörű tapasztalattal rendelkezem, az alapoktól a haladó szintig.';
        }

        if (lowerMessage.includes('helyszín') || lowerMessage.includes('hol') || lowerMessage.includes('cím')) {
            return 'Az órákat online tartom, így bárhonnan részt tudsz venni, ahol van internetkapcsolat. Személyes órára is van lehetőség Fóton, a 2151 Szent Imre utca 18/2 címen, előzetes egyeztetés alapján.';
        }

        // Matematikai témakörök
        if (lowerMessage.includes('egyenlet') || lowerMessage.includes('egyenlőtlenség')) {
            return 'Az egyenletek és egyenlőtlenségek fontos matematikai témakörök. Szeretne időpontot foglalni ebben a témában?';
        }

        if (lowerMessage.includes('trigonometria') || lowerMessage.includes('szög')) {
            return 'A trigonometria a szögek és háromszögek tanulmányozása. Van konkrét kérdése ezzel kapcsolatban?';
        }

        if (lowerMessage.includes('függvény') || lowerMessage.includes('analízis')) {
            return 'A függvények és az analízis a matematika alapvető részei. Miben segíthetek ebben a témában?';
        }

        if (lowerMessage.includes('geometria') || lowerMessage.includes('alakzat')) {
            return 'A geometria az alakzatok és térbeli viszonyok tanulmányozása. Sík- vagy térgeometriával kapcsolatos kérdése van?';
        }

        // Alapértelmezett válaszok
        const defaultResponses = [
            'Érdekes kérdés! Szeretne időpontot foglalni, hogy részletesebben megbeszéljük?',
            'Ez egy jó kérdés. Javaslom, hogy foglaljon időpontot, ahol személyesen megválaszolhatom kérdését.',
            'Kérdésére a legjobb választ személyes konzultáció során tudom adni. Foglaljon időpontot!',
            'Ez a téma érdekes lehet. Van konkrét kérdése, amit szeretne megbeszélni?',
            'Szeretne többet megtudni erről? Javaslom, hogy foglaljon időpontot részletes konzultációra.'
        ];

        return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
    };

    const handleSendMessage = async () => {
        if (!inputValue.trim()) return;

        const userMessage: Message = {
            id: Date.now().toString(),
            text: inputValue,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInputValue('');
        setIsTyping(true);

        // ChatGPT API használata, ha van API kulcs, egyébként helyi válaszok
        if (chatGPTApiKey && chatGPTApiKey !== 'sk-proj-YourAPIKeyHere') {
            const conversationHistory = messages
                .filter(msg => !msg.showQuickReplies)
                .map(msg => ({
                    role: msg.isUser ? 'user' as const : 'assistant' as const,
                    content: msg.text
                }));

            await sendToChatGPT(inputValue, conversationHistory);
        } else {
            // Helyi válaszok használata
            setTimeout(() => {
                const botResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: generateResponse(inputValue),
                    isUser: false,
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, botResponse]);
                setIsTyping(false);
            }, 1000 + Math.random() * 2000);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const handleQuickReply = (reply: string) => {
        const userMessage: Message = {
            id: Date.now().toString(),
            text: reply,
            isUser: true,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsTyping(true);

        // ChatGPT API használata, ha van API kulcs, egyébként helyi válaszok
        if (chatGPTApiKey && chatGPTApiKey !== 'sk-proj-YourAPIKeyHere') {
            const conversationHistory = messages
                .filter(msg => !msg.showQuickReplies)
                .map(msg => ({
                    role: msg.isUser ? 'user' as const : 'assistant' as const,
                    content: msg.text
                }));

            sendToChatGPT(reply, conversationHistory);
        } else {
            // Helyi válaszok használata
            setTimeout(() => {
                const botResponse: Message = {
                    id: (Date.now() + 1).toString(),
                    text: generateResponse(reply),
                    isUser: false,
                    timestamp: new Date()
                };

                setMessages(prev => [...prev, botResponse]);
                setIsTyping(false);
            }, 1000 + Math.random() * 2000);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="chat-bot-overlay" onClick={onClose}>
            <div className={`chat-bot-container ${isMinimized ? 'minimized' : ''}`} onClick={(e) => e.stopPropagation()}>
                {/* Chat Header */}
                <div className="chat-header">
                    <div className="chat-title">
                        <div className="chat-avatar">🤖</div>
                        <div>
                            <h3>MihaAI</h3>
                            <span className="chat-status">
                                {chatGPTApiKey && chatGPTApiKey !== 'sk-proj-YourAPIKeyHere' ? 'ChatGPT' : 'Helyi'} • Online
                            </span>
                        </div>
                    </div>
                    <div className="chat-header-actions">
                        {onToggleMinimize && (
                            <button
                                className="chat-minimize"
                                onClick={onToggleMinimize}
                                title={isMinimized ? 'Maximalizálás' : 'Minimalizálás'}
                            >
                                {isMinimized ? '□' : '−'}
                            </button>
                        )}
                        <button className="chat-close" onClick={onClose}>×</button>
                    </div>
                </div>

                {/* Messages */}
                {!isMinimized && (
                    <div className="chat-messages">
                        {messages.map((message) => (
                            <div
                                key={message.id}
                                className={`message ${message.isUser ? 'user-message' : 'bot-message'}`}
                            >
                                <div className="message-content">
                                    {message.text}
                                </div>
                                <div className="message-time">
                                    {message.timestamp.toLocaleTimeString('hu-HU', {
                                        hour: '2-digit',
                                        minute: '2-digit'
                                    })}
                                </div>
                                {message.showQuickReplies && (
                                    <div className="quick-replies">
                                        <button
                                            className="quick-reply-btn"
                                            onClick={() => handleQuickReply('Kiket vállal Zsolt?')}
                                        >
                                            Kiket vállal Zsolt?
                                        </button>
                                        <button
                                            className="quick-reply-btn"
                                            onClick={() => handleQuickReply('Mennyibe kerül az oktatás?')}
                                        >
                                            Mennyibe kerül?
                                        </button>
                                        <button
                                            className="quick-reply-btn"
                                            onClick={() => handleQuickReply('Hogyan foglalhatok időpontot?')}
                                        >
                                            Hogyan foglalok?
                                        </button>
                                        <button
                                            className="quick-reply-btn"
                                            onClick={() => handleQuickReply('Milyen szintű oktatást kínáltok?')}
                                        >
                                            Milyen szintek?
                                        </button>
                                        <button
                                            className="quick-reply-btn"
                                            onClick={() => handleQuickReply('Van online oktatás?')}
                                        >
                                            Online oktatás?
                                        </button>
                                        <button
                                            className="quick-reply-btn"
                                            onClick={() => handleQuickReply('Milyen tapasztalata van Zsoltnak?')}
                                        >
                                            Tapasztalat?
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                        {isTyping && (
                            <div className="message bot-message">
                                <div className="typing-indicator">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>
                )}



                {/* Input */}
                {!isMinimized && (
                    <div className="chat-input">
                        <textarea
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Írja be kérdését..."
                            rows={1}
                            disabled={isTyping}
                        />
                        <button
                            onClick={handleSendMessage}
                            disabled={!inputValue.trim() || isTyping}
                            className="send-button"
                        >
                            ➤
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChatBot;
