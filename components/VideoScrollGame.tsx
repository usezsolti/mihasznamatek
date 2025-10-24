import React, { useEffect, useRef, useState } from 'react';

interface GameElement {
    id: string;
    type: 'car' | 'billboard' | 'road' | 'background';
    x: number;
    y: number;
    width: number;
    height: number;
    color: string;
    text?: string;
    year?: string;
    isVisible: boolean;
    animationDelay: number;
}

const VideoScrollGame: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [scrollY, setScrollY] = useState(0);
    const [carX, setCarX] = useState(400);
    const [currentSection, setCurrentSection] = useState(0);

    const gameElements: GameElement[] = [
        // Háttér elemek
        { id: 'bg1', type: 'background', x: 0, y: 0, width: 800, height: 600, color: '#1a1a2e', isVisible: false, animationDelay: 0 },
        { id: 'bg2', type: 'background', x: 0, y: 600, width: 800, height: 600, color: '#16213e', isVisible: false, animationDelay: 100 },
        { id: 'bg3', type: 'background', x: 0, y: 1200, width: 800, height: 600, color: '#0f3460', isVisible: false, animationDelay: 200 },

        // Út elemek
        { id: 'road1', type: 'road', x: 0, y: 500, width: 800, height: 100, color: '#333', isVisible: false, animationDelay: 300 },
        { id: 'road2', type: 'road', x: 0, y: 1100, width: 800, height: 100, color: '#333', isVisible: false, animationDelay: 400 },
        { id: 'road3', type: 'road', x: 0, y: 1700, width: 800, height: 100, color: '#333', isVisible: false, animationDelay: 500 },

        // Billboards - Életpálya
        { id: 'billboard1', type: 'billboard', x: 100, y: 300, width: 120, height: 80, color: '#00ff00', text: 'Mechatronikai Mérnök', year: '2015', isVisible: false, animationDelay: 600 },
        { id: 'billboard2', type: 'billboard', x: 300, y: 900, width: 120, height: 80, color: '#00ff00', text: 'Mérnökinformatikus', year: '2017', isVisible: false, animationDelay: 700 },
        { id: 'billboard3', type: 'billboard', x: 500, y: 1500, width: 120, height: 80, color: '#00ff00', text: 'Matematika Tanár', year: '2019', isVisible: false, animationDelay: 800 },
        { id: 'billboard4', type: 'billboard', x: 200, y: 2100, width: 120, height: 80, color: '#00ff00', text: 'Sportoktató', year: '2021', isVisible: false, animationDelay: 900 },
        { id: 'billboard5', type: 'billboard', x: 400, y: 2700, width: 120, height: 80, color: '#00ff00', text: 'MIHASZNA Matek', year: '2023', isVisible: false, animationDelay: 1000 },
    ];

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Canvas méretezése
        canvas.width = 800;
        canvas.height = 400;

        // Scroll esemény figyelése
        const handleScroll = () => {
            const scrollPosition = window.scrollY;
            setScrollY(scrollPosition);

            // Aktuális szekció meghatározása
            const section = Math.floor(scrollPosition / 400);
            setCurrentSection(section);
        };

        window.addEventListener('scroll', handleScroll);

        // Játék loop
        const gameLoop = () => {
            // Háttér törlése
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Elemek renderelése videó-szerű animációval
            gameElements.forEach((element) => {
                // Elem láthatóságának meghatározása scroll alapján
                const elementScreenY = element.y - scrollY;
                const isInView = elementScreenY >= -100 && elementScreenY <= canvas.height + 100;

                if (isInView) {
                    // Animáció késleltetés
                    const animationProgress = Math.max(0, Math.min(1, (scrollY - element.y + 200) / 200));

                    if (animationProgress > 0) {
                        // Elem rajzolása animációval
                        ctx.save();

                        // Fade in effekt
                        ctx.globalAlpha = animationProgress;

                        // Scale effekt
                        const scale = 0.5 + (animationProgress * 0.5);
                        ctx.translate(element.x + element.width / 2, elementScreenY + element.height / 2);
                        ctx.scale(scale, scale);
                        ctx.translate(-(element.x + element.width / 2), -(elementScreenY + element.height / 2));

                        // Elem rajzolása típus szerint
                        switch (element.type) {
                            case 'background':
                                ctx.fillStyle = element.color;
                                ctx.fillRect(element.x, elementScreenY, element.width, element.height);
                                break;

                            case 'road':
                                ctx.fillStyle = element.color;
                                ctx.fillRect(element.x, elementScreenY, element.width, element.height);

                                // Útvonalak
                                ctx.fillStyle = '#fff';
                                for (let i = 0; i < element.width; i += 100) {
                                    ctx.fillRect(element.x + i, elementScreenY + 40, 50, 10);
                                }
                                break;

                            case 'billboard':
                                // Billboard háttér
                                ctx.fillStyle = element.color;
                                ctx.fillRect(element.x, elementScreenY, element.width, element.height);

                                // Billboard keret
                                ctx.strokeStyle = '#fff';
                                ctx.lineWidth = 3;
                                ctx.strokeRect(element.x, elementScreenY, element.width, element.height);

                                // Szöveg
                                if (element.text && element.year) {
                                    ctx.fillStyle = '#000';
                                    ctx.font = 'bold 12px Arial';
                                    ctx.textAlign = 'center';
                                    ctx.fillText(element.year, element.x + element.width / 2, elementScreenY + 20);
                                    ctx.font = '10px Arial';
                                    ctx.fillText(element.text, element.x + element.width / 2, elementScreenY + 40);
                                }
                                break;
                        }

                        ctx.restore();
                    }
                }
            });

            // Autó rajzolása (mindig látható)
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(carX - 20, 300, 40, 30);

            // Autó kerekek
            ctx.fillStyle = '#000';
            ctx.fillRect(carX - 15, 285, 8, 8);
            ctx.fillRect(carX + 7, 285, 8, 8);
            ctx.fillRect(carX - 15, 317, 8, 8);
            ctx.fillRect(carX + 7, 317, 8, 8);

            requestAnimationFrame(gameLoop);
        };

        // Mouse kontroll
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            setCarX(mouseX);
        };

        canvas.addEventListener('mousemove', handleMouseMove);

        // Játék indítása
        gameLoop();

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, [scrollY, carX, gameElements]);

    return (
        <div className="video-scroll-game-container">
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '400px',
                    border: '2px solid #00ff00',
                    borderRadius: '15px',
                    cursor: 'crosshair',
                    position: 'sticky',
                    top: '20px',
                    zIndex: 10
                }}
            />

            {/* Videó-szerű tartalom a görgetéshez */}
            <div className="video-content" style={{ height: '3200px', position: 'relative' }}>
                {/* Invisible markers for scroll detection */}
                <div style={{ height: '400px' }}></div>
                <div style={{ height: '400px' }}></div>
                <div style={{ height: '400px' }}></div>
                <div style={{ height: '400px' }}></div>
                <div style={{ height: '400px' }}></div>
                <div style={{ height: '400px' }}></div>
                <div style={{ height: '400px' }}></div>
                <div style={{ height: '400px' }}></div>
            </div>

            <div className="game-instructions">
                <p>🎬 Videó-szerű görgetés effekt!</p>
                <p>🎮 Mozgasd az egeret az autó irányításához!</p>
                <p>📋 Aktuális szekció: {currentSection + 1}</p>
                <p>✨ Elemek animáltan jelennek meg!</p>
            </div>
        </div>
    );
};

export default VideoScrollGame;
