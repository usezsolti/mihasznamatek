import { useMemo, useState } from 'react';
import MathTemplateInput from '../MathTemplateInput';
import { solveQuadraticInputs } from '../../utils/quadraticSolve';
import { evaluateScientific, formatScientific, type AngleMode } from '../../utils/scientificEval';

type Props = {
    onClose: () => void;
    onPlace: (text: string) => void;
};

const BASIC_IDS = [
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
];

const TRIG_IDS = [
    'sin',
    'cos',
    'tg',
    'ctg',
    'sec',
    'csc',
    'asin',
    'acos',
    'atan',
    'asec',
    'acsc',
    'acot',
    'sinh',
    'cosh',
    'tanh',
    'asinh',
    'acosh',
    'atanh',
    'sech',
    'csch',
    'coth',
];

const COMB_IDS = ['fact', 'ncr', 'npr'];

export default function WhiteboardCalculator({ onClose, onPlace }: Props) {
    const [expr, setExpr] = useState('');
    const [showError, setShowError] = useState(false);
    const [mode, setMode] = useState<AngleMode>('deg');
    const [panel, setPanel] = useState<'calc' | 'quad'>('calc');
    const [coeffA, setCoeffA] = useState('');
    const [coeffB, setCoeffB] = useState('');
    const [coeffC, setCoeffC] = useState('');

    const preview = useMemo(() => {
        const raw = expr.trim();
        if (!raw || raw.includes('?')) return { ok: false as const, text: '' };
        try {
            return { ok: true as const, text: formatScientific(evaluateScientific(raw, mode)) };
        } catch {
            return { ok: false as const, text: '' };
        }
    }, [expr, mode]);

    const quadratic = useMemo(
        () => solveQuadraticInputs(coeffA, coeffB, coeffC),
        [coeffA, coeffB, coeffC],
    );

    return (
        <div className="wb-calc" role="dialog" aria-label="Számológép">
            <div className="wb-calc-head">
                <strong>Számológép</strong>
                {panel === 'calc' && (
                    <div className="wb-calc-modes" role="group" aria-label="Szög mértékegysége">
                        <button
                            type="button"
                            className={mode === 'deg' ? 'is-on' : ''}
                            onClick={() => setMode('deg')}
                        >
                            Fok
                        </button>
                        <button
                            type="button"
                            className={mode === 'rad' ? 'is-on' : ''}
                            onClick={() => setMode('rad')}
                        >
                            Radián
                        </button>
                    </div>
                )}
                <button type="button" className="wb-calc-close" onClick={onClose} title="Bezár">
                    ×
                </button>
            </div>
            <div className="wb-calc-tabs" role="tablist" aria-label="Számológép módja">
                <button
                    type="button"
                    role="tab"
                    aria-selected={panel === 'calc'}
                    className={panel === 'calc' ? 'is-on' : ''}
                    onClick={() => setPanel('calc')}
                >
                    Számolás
                </button>
                <button
                    type="button"
                    role="tab"
                    aria-selected={panel === 'quad'}
                    className={panel === 'quad' ? 'is-on' : ''}
                    onClick={() => setPanel('quad')}
                >
                    Másodfokú
                </button>
            </div>
            {panel === 'quad' ? (
                <>
                    <p className="wb-calc-hint">ax² + bx + c = 0</p>
                    <div className="wb-calc-quad">
                        {([
                            ['a', coeffA, setCoeffA],
                            ['b', coeffB, setCoeffB],
                            ['c', coeffC, setCoeffC],
                        ] as const).map(([label, value, setValue]) => (
                            <label key={label}>
                                {label}
                                <input
                                    className="wb-calc-input"
                                    inputMode="decimal"
                                    value={value}
                                    placeholder={label}
                                    aria-label={`${label} együttható`}
                                    onChange={(event) => setValue(event.target.value)}
                                />
                            </label>
                        ))}
                    </div>
                    <div className={`wb-calc-preview is-steps${quadratic.ok ? '' : quadratic.error ? ' is-error' : ''}`}>
                        {quadratic.ok
                            ? quadratic.lines.join('\n')
                            : quadratic.error || 'Írd be a, b és c értékét.'}
                    </div>
                    <button
                        type="button"
                        className="wb-calc-place"
                        disabled={!quadratic.ok}
                        onClick={() => {
                            if (quadratic.ok) onPlace(quadratic.board);
                        }}
                    >
                        Megoldás a táblára
                    </button>
                </>
            ) : (
                <>
                    <MathTemplateInput
                        value={expr}
                        tone="sheet"
                        panelTitle="Műveletek"
                        categoryTitles={{ basic: 'Alap', trig: 'Szög', combinatorics: 'Kombinatorika' }}
                        categories={['basic', 'trig', 'combinatorics']}
                        itemIds={[...BASIC_IDS, ...TRIG_IDS, ...COMB_IDS]}
                        autoFocus
                        placeholder="pl. sin(30), ncr(5,2)"
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
                </>
            )}
        </div>
    );
}
