import { useState, useEffect } from 'react';
import ChatBot from './ChatBot';

const ChatButton = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [isMinimized, setIsMinimized] = useState(false);
    const [showButton, setShowButton] = useState(true);

    // Automatikusan megnyitjuk a chat-et amikor az oldal betöltődik
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsChatOpen(true);
        }, 3000); // 3 másodperc után megnyitjuk

        return () => clearTimeout(timer);
    }, []);

    // Automatikusan elrejtjük a chat gombot és megjelenítjük a szövegbuborékot
    useEffect(() => {
        const timer = setTimeout(() => {
            setShowButton(false);
        }, 5000); // 5 másodperc után

        return () => clearTimeout(timer);
    }, []);

    // Automatikusan minimalizáljuk 30 másodperc után
    useEffect(() => {
        if (isChatOpen && !isMinimized) {
            const timer = setTimeout(() => {
                setIsMinimized(true);
            }, 30000); // 30 másodperc után

            return () => clearTimeout(timer);
        }
    }, [isChatOpen, isMinimized]);

    // Automatikusan elrejtjük a chat gombot 5 másodperc után, de a szövegbuborék maradjon
    useEffect(() => {
        if (!isChatOpen) {
            const timer = setTimeout(() => {
                setShowButton(false);
            }, 5000); // 5 másodperc után

            return () => clearTimeout(timer);
        } else {
            setShowButton(false);
        }
    }, [isChatOpen]);

    // Hover effekt a chat gombhoz
    const handleMouseEnter = () => {
        if (!isChatOpen) {
            setShowButton(true);
        }
    };

    const handleMouseLeave = () => {
        if (!isChatOpen) {
            setTimeout(() => {
                setShowButton(false);
            }, 1000); // 1 másodperc után elrejtjük
        }
    };

    return (
        <>
            {/* Lebegő Chat Gomb - csak akkor jelenik meg, ha a chat nincs megnyitva */}
            {!isChatOpen && showButton && (
                <button
                    className="chat-button"
                    onClick={() => setIsChatOpen(true)}
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    title="MihaAI Chat"
                >
                    <div className="chat-button-icon">💬</div>
                    <div className="chat-button-text">AI</div>
                </button>
            )}

            {/* Szövegbuborék amikor a chat le van csukva */}
            {!isChatOpen && (
                <div
                    className="chat-bubble"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                    onClick={() => setIsChatOpen(true)}
                >
                    <div className="chat-bubble-content">
                        <div className="chat-bubble-icon">🤖</div>
                        <div className="chat-bubble-text">
                            <strong>MihaAI</strong>
                            <span>Kérdése van? Kattintson ide!</span>
                        </div>
                    </div>
                </div>
            )}

            {/* Hover terület a chat gombhoz */}
            {!isChatOpen && !showButton && (
                <div
                    className="chat-button-hover-area"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                />
            )}

            {/* Chat Bot */}
            <ChatBot
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                isMinimized={isMinimized}
                onToggleMinimize={() => setIsMinimized(!isMinimized)}
            />
        </>
    );
};

export default ChatButton;
