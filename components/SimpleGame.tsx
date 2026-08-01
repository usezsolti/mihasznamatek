import React, { useEffect, useRef } from 'react';

const SimpleGame: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (!canvasRef.current) return;

        const canvas = canvasRef.current;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Canvas méretezése
        canvas.width = 800;
        canvas.height = 400;

        // Autó pozíció
        let carX = 400;
        const carY = 300;

        // Játék loop
        const gameLoop = () => {
            // Háttér törlése
            ctx.fillStyle = '#1a1a2e';
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Út rajzolása
            ctx.fillStyle = '#333';
            ctx.fillRect(0, 350, canvas.width, 50);

            // Útvonalak
            ctx.fillStyle = '#fff';
            for (let i = 0; i < canvas.width; i += 100) {
                ctx.fillRect(i, 370, 50, 10);
            }

            // Autó rajzolása
            ctx.fillStyle = '#ff0000';
            ctx.fillRect(carX - 20, carY - 15, 40, 30);

            // Autó kerekek
            ctx.fillStyle = '#000';
            ctx.fillRect(carX - 15, carY - 20, 8, 8);
            ctx.fillRect(carX + 7, carY - 20, 8, 8);
            ctx.fillRect(carX - 15, carY + 12, 8, 8);
            ctx.fillRect(carX + 7, carY + 12, 8, 8);

            // Billboards
            ctx.fillStyle = '#00ff00';
            ctx.fillRect(100, 100, 60, 40);
            ctx.fillRect(300, 120, 60, 40);
            ctx.fillRect(500, 110, 60, 40);
            ctx.fillRect(700, 130, 60, 40);

            // Billboard szövegek
            ctx.fillStyle = '#000';
            ctx.font = '12px Arial';
            ctx.fillText('2015', 110, 115);
            ctx.fillText('2017', 310, 135);
            ctx.fillText('2019', 510, 125);
            ctx.fillText('2023', 710, 145);

            requestAnimationFrame(gameLoop);
        };

        // Mouse kontroll
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            carX = mouseX;
        };

        canvas.addEventListener('mousemove', handleMouseMove);

        // Játék indítása
        gameLoop();

        // Cleanup
        return () => {
            canvas.removeEventListener('mousemove', handleMouseMove);
        };
    }, []);

    return (
        <div className="simple-game-container">
            <canvas
                ref={canvasRef}
                style={{
                    width: '100%',
                    height: '400px',
                    border: '2px solid #00ff00',
                    borderRadius: '15px',
                    cursor: 'crosshair'
                }}
            />
            <div className="game-instructions">
                <p>🎮 Mozgasd az egeret az autó irányításához!</p>
                <p>🚗 Piros autó, zöld billboardok</p>
                <p>✅ Egyszerű 2D játék - biztosan működik!</p>
            </div>
        </div>
    );
};

export default SimpleGame;
