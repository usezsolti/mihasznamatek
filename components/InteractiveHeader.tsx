import React, { useEffect, useRef, useState } from 'react';

interface MathElement {
    x: number;
    y: number;
    vx: number;
    vy: number;
    size: number;
    type: 'circle' | 'square' | 'triangle' | 'formula';
    color: string;
    rotation: number;
    rotationSpeed: number;
    text?: string;
}

const InteractiveHeader: React.FC = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
    const [isHovering, setIsHovering] = useState(false);
    const [isVisible, setIsVisible] = useState(false);
    const elementsRef = useRef<MathElement[]>([]);
    const animationRef = useRef<number>();

    // Header content animation
    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(true);
        }, 500);

        return () => clearTimeout(timer);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Canvas méretezése
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);

        // Matematikai elemek inicializálása
        const initElements = () => {
            const elements: MathElement[] = [];
            const colors = ['#00ff88', '#ff0088', '#0088ff', '#ff8800', '#8800ff', '#ffff00', '#00ffff', '#ff00ff'];
            const mathSymbols = [
                '∫', '∑', 'π', '∞', '√', '±', '×', '÷', '²', '³', '⁴', '⁵', '⁶', '⁷', '⁸', '⁹',
                '+', '-', '=', '≠', '≤', '≥', '<', '>', '≈', '≡', '∝', '∈', '∉', '⊂', '⊃', '∪', '∩',
                '0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                'α', 'β', 'γ', 'δ', 'ε', 'θ', 'λ', 'μ', 'σ', 'φ', 'ω',
                '∂', '∇', '∆', '∏', '∐', '∅', 'ℕ', 'ℤ', 'ℚ', 'ℝ', 'ℂ'
            ];

            for (let i = 0; i < 30; i++) {
                elements.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 3,
                    vy: (Math.random() - 0.5) * 3,
                    size: Math.random() * 60 + 25,
                    type: 'formula',
                    color: colors[Math.floor(Math.random() * colors.length)],
                    rotation: Math.random() * Math.PI * 2,
                    rotationSpeed: (Math.random() - 0.5) * 0.15,
                    text: mathSymbols[Math.floor(Math.random() * mathSymbols.length)]
                });
            }
            elementsRef.current = elements;
        };

        initElements();

        // Animáció
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            elementsRef.current.forEach((element, index) => {
                // Egér közeledés hatása
                const dx = mousePos.x - element.x;
                const dy = mousePos.y - element.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 150 && isHovering) {
                    // Repulsion effect
                    const force = (150 - distance) / 150;
                    element.vx -= (dx / distance) * force * 0.5;
                    element.vy -= (dy / distance) * force * 0.5;

                    // Size increase
                    element.size = Math.min(element.size + 2, 80);
                } else {
                    // Return to normal size
                    element.size = Math.max(element.size - 0.5, 25);
                }

                // Update position
                element.x += element.vx;
                element.y += element.vy;
                element.rotation += element.rotationSpeed;

                // Bounce off walls
                if (element.x < 0 || element.x > canvas.width) element.vx *= -1;
                if (element.y < 0 || element.y > canvas.height) element.vy *= -1;

                // Keep elements on screen
                element.x = Math.max(0, Math.min(canvas.width, element.x));
                element.y = Math.max(0, Math.min(canvas.height, element.y));

                // Draw mathematical symbol
                ctx.save();
                ctx.translate(element.x, element.y);
                ctx.rotate(element.rotation);

                // Add glow effect
                ctx.shadowColor = element.color;
                ctx.shadowBlur = 10;
                ctx.shadowOffsetX = 0;
                ctx.shadowOffsetY = 0;

                // Draw mathematical symbol
                ctx.fillStyle = element.color;
                ctx.font = `bold ${element.size}px Arial, sans-serif`;
                ctx.textAlign = 'center';
                ctx.textBaseline = 'middle';
                ctx.fillText(element.text || 'π', 0, 0);

                ctx.restore();
            });

            animationRef.current = requestAnimationFrame(animate);
        };

        animate();

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
            }
        };
    }, [mousePos, isHovering]);

    const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const rect = canvasRef.current?.getBoundingClientRect();
        if (rect) {
            setMousePos({
                x: e.clientX - rect.left,
                y: e.clientY - rect.top
            });
        }
    };

    const handleMouseEnter = () => setIsHovering(true);
    const handleMouseLeave = () => setIsHovering(false);

    return (
        <div className="interactive-header">
            <canvas
                ref={canvasRef}
                onMouseMove={handleMouseMove}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
                className="interactive-canvas"
            />
            <div className={`header-content ${isVisible ? 'animate-in' : ''}`}>
                <div className="profile-section">
                    <div className="profile-image">
                        <img src="/profile.png" alt="Mihaszna Matek" />
                    </div>
                    <h1 className="main-title">MIHASZNA MATEK</h1>
                    <p className="subtitle">Hogyan lehet úgy matekozni, hogy közben szakadsz a nevetéstől?</p>
                </div>
            </div>
        </div>
    );
};

export default InteractiveHeader;
