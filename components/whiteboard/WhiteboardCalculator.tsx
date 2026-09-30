import { useMemo, useState } from 'react';
import MathTemplateInput from '../MathTemplateInput';
import { evaluateScientific, formatScientific } from '../../utils/scientificEval';

type Props = {
    onClose: () => void;
    onPlace: (text: string) => void;
};

export default function WhiteboardCalculator({ onClose, onPlace }: Props) {
    const [expr, setExpr] = useState('');
    const [showError, setShowError] = useState(false);

    const preview = useMemo(() => {
        const raw = expr.trim();
        if (!raw || raw.includes('?')) return { ok: false as const, text: '' };
        try {
            return { ok: true as const, text: formatScientific(evaluateScientific(raw, 'deg')) };
        } catch {
            return { ok: false as const, text: '' };
        }
    }, [expr]);

    return (
        <div className="wb-calc" role="dialog" aria-label="Számológép">
            <div className="wb-calc-head">
                <strong>Számológép</strong>
                <button type="button" className="wb-calc-close" onClick={onClose} title="Bezár">
                    ×
                </button>
            </div>
            <MathTemplateInput
                value={expr}
                tone="sheet"
                categories={['basic']}
                itemIds={[
                    'fraction',
                    'pow2',
                    'power',
                    'sqrt',
                    'cbrt',
                    'nthroot',
                    'pi',
                    'e',
                    'exp',
                    'ln',
                    'logb',
                    'log10',
                    'abs',
                    'plus',
                    'minus',
                    'times',
                    'div',
                    'lparen',
                    'rparen',
                ]}
                autoFocus
                placeholder="pl. 2+3, vagy tört / gyök sablon"
                onChange={(next) => {
                    setShowError(false);
                    setExpr(next);
                }}
                onSubmit={() => setShowError(!preview.ok)}
            />
            <div className={`wb-calc-preview${showError && !preview.ok ? ' is-error' : ''}`}>
                {preview.ok ? preview.text : showError && expr.trim() ? 'Hibás kifejezés' : expr.trim() ? '' : '0'}
            </div>
            <button
                type="button"
                className="wb-calc-place"
                disabled={!preview.ok}
                onClick={() => {
                    if (preview.ok) onPlace(preview.text);
                }}
            >
                Eredmény a táblára
            </button>
        </div>
    );
}
