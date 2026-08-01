import { useState } from 'react';

interface MathInputToolbarProps {
    onInsert: (text: string) => void;
    inputRef?: React.RefObject<HTMLInputElement>;
}

export default function MathInputToolbar({ onInsert, inputRef }: MathInputToolbarProps) {
    const [showMore, setShowMore] = useState(false);

    const insertAtCursor = (text: string) => {
        onInsert(text);
    };

    const buttons = [
        // Alap műveletek
        { label: '+', value: '+' },
        { label: '−', value: '-' },
        { label: '×', value: '*' },
        { label: '÷', value: '/' },
        { label: '=', value: '=' },
        
        // Hatványok és gyökök
        { label: 'x²', value: '^2' },
        { label: 'xⁿ', value: '^' },
        { label: '√', value: 'sqrt()' },
        { label: '∛', value: 'cbrt()' },
        
        // Törtek
        { label: 'a/b', value: '/()' },
        
        // Logaritmusok
        { label: 'ln', value: 'ln()' },
        { label: 'log', value: 'log()' },
        
        // Trigonometria
        { label: 'sin', value: 'sin()' },
        { label: 'cos', value: 'cos()' },
        { label: 'tan', value: 'tan()' },
        
        // Zárójelek
        { label: '(', value: '(' },
        { label: ')', value: ')' },
        { label: '[', value: '[' },
        { label: ']', value: ']' },
        
        // Speciális karakterek
        { label: 'π', value: 'pi' },
        { label: 'e', value: 'e' },
        { label: '∞', value: 'inf' },
        
        // Egyenlőtlenségek
        { label: '<', value: '<' },
        { label: '>', value: '>' },
        { label: '≤', value: '<=' },
        { label: '≥', value: '>=' },
        { label: '≠', value: '!=' },
    ];

    const moreButtons = [
        // További trigonometria
        { label: 'arcsin', value: 'arcsin()' },
        { label: 'arccos', value: 'arccos()' },
        { label: 'arctan', value: 'arctan()' },
        
        // Hiperbolikus függvények
        { label: 'sinh', value: 'sinh()' },
        { label: 'cosh', value: 'cosh()' },
        { label: 'tanh', value: 'tanh()' },
        
        // Integrál és derivált
        { label: '∫', value: 'int()' },
        { label: '∂', value: 'd/dx()' },
        { label: '∑', value: 'sum()' },
        { label: '∏', value: 'prod()' },
        
        // Halmazok
        { label: '∈', value: 'in' },
        { label: '∉', value: 'notin' },
        { label: '⊂', value: 'subset' },
        { label: '∪', value: 'cup' },
        { label: '∩', value: 'cap' },
        
        // Görög betűk
        { label: 'α', value: 'alpha' },
        { label: 'β', value: 'beta' },
        { label: 'γ', value: 'gamma' },
        { label: 'θ', value: 'theta' },
        { label: 'λ', value: 'lambda' },
        { label: 'μ', value: 'mu' },
        { label: 'σ', value: 'sigma' },
        { label: 'Δ', value: 'Delta' },
    ];

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem',
            marginTop: '0.5rem',
            padding: '0.75rem',
            background: 'rgba(0, 0, 0, 0.5)',
            borderRadius: '8px',
            border: '1px solid rgba(57, 255, 20, 0.3)'
        }}>
            <div style={{
                display: 'flex',
                flexWrap: 'wrap',
                gap: '0.5rem'
            }}>
                {buttons.map((btn, idx) => (
                    <button
                        key={idx}
                        type="button"
                        onClick={() => insertAtCursor(btn.value)}
                        style={{
                            padding: '0.5rem 0.75rem',
                            background: 'rgba(57, 255, 20, 0.1)',
                            border: '1px solid rgba(57, 255, 20, 0.3)',
                            borderRadius: '5px',
                            color: '#39ff14',
                            cursor: 'pointer',
                            fontSize: '0.9rem',
                            fontWeight: '500',
                            transition: 'all 0.2s',
                            minWidth: '40px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = 'rgba(57, 255, 20, 0.2)';
                            e.currentTarget.style.borderColor = '#39ff14';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = 'rgba(57, 255, 20, 0.1)';
                            e.currentTarget.style.borderColor = 'rgba(57, 255, 20, 0.3)';
                        }}
                    >
                        {btn.label}
                    </button>
                ))}
            </div>
            
            {showMore && (
                <div style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '0.5rem',
                    marginTop: '0.5rem',
                    paddingTop: '0.5rem',
                    borderTop: '1px solid rgba(57, 255, 20, 0.2)'
                }}>
                    {moreButtons.map((btn, idx) => (
                        <button
                            key={idx}
                            type="button"
                            onClick={() => insertAtCursor(btn.value)}
                            style={{
                                padding: '0.5rem 0.75rem',
                                background: 'rgba(57, 255, 20, 0.1)',
                                border: '1px solid rgba(57, 255, 20, 0.3)',
                                borderRadius: '5px',
                                color: '#39ff14',
                                cursor: 'pointer',
                                fontSize: '0.9rem',
                                fontWeight: '500',
                                transition: 'all 0.2s',
                                minWidth: '40px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.background = 'rgba(57, 255, 20, 0.2)';
                                e.currentTarget.style.borderColor = '#39ff14';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.background = 'rgba(57, 255, 20, 0.1)';
                                e.currentTarget.style.borderColor = 'rgba(57, 255, 20, 0.3)';
                            }}
                        >
                            {btn.label}
                        </button>
                    ))}
                </div>
            )}
            
            <button
                type="button"
                onClick={() => setShowMore(!showMore)}
                style={{
                    padding: '0.5rem',
                    background: 'rgba(57, 255, 20, 0.1)',
                    border: '1px solid rgba(57, 255, 20, 0.3)',
                    borderRadius: '5px',
                    color: '#39ff14',
                    cursor: 'pointer',
                    fontSize: '0.85rem',
                    marginTop: '0.5rem',
                    width: '100%'
                }}
            >
                {showMore ? '▼ Kevesebb' : '▲ Több'}
            </button>
        </div>
    );
}

