import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { InlineMath } from 'react-katex';
import 'katex/dist/katex.min.css';
import {
    MATH_CATEGORIES,
    findTemplate,
    getSlotVisualRole,
    renderLayout,
    type MathCategoryId,
    type TemplateItem,
} from './mathInput/catalog';

type Props = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    disabled?: boolean;
    autoFocus?: boolean;
    id?: string;
    onSubmit?: () => void;
};

/** Beágyazott sablonfa: szöveg vagy belső művelet. */
type NestNode = {
    templateId: string;
    slots: (string | NestNode)[];
};

type FocusPath = number[];

function emptySlots(t: TemplateItem): (string | NestNode)[] {
    return Array.from({ length: t.slots }, () => '');
}

function buildExpr(node: NestNode): string {
    const t = findTemplate(node.templateId);
    if (!t) return '';
    const parts = node.slots.map((s) => {
        if (typeof s === 'string') return String(s || '').trim();
        return buildExpr(s);
    });
    if (parts.every((p) => !p || p.includes('?'))) {
        // still allow partial with ?
    }
    if (parts.every((p) => !p)) return '';
    return t.build(parts.map((p) => p || '?'));
}

function cloneNode(node: NestNode): NestNode {
    return {
        templateId: node.templateId,
        slots: node.slots.map((s) => (typeof s === 'string' ? s : cloneNode(s))),
    };
}

function getSlot(node: NestNode, path: FocusPath): string | NestNode | null {
    if (path.length === 0) return node;
    let cur: string | NestNode = node;
    for (let i = 0; i < path.length; i++) {
        if (typeof cur === 'string') return null;
        cur = cur.slots[path[i]];
        if (cur === undefined) return null;
    }
    return cur;
}

function setSlotAt(
    node: NestNode,
    path: FocusPath,
    value: string | NestNode
): NestNode {
    if (path.length === 0) {
        if (typeof value === 'string') return node;
        return cloneNode(value);
    }
    const next = cloneNode(node);
    if (path.length === 1) {
        next.slots[path[0]] = value;
        return next;
    }
    const [head, ...rest] = path;
    const child = next.slots[head];
    if (typeof child === 'string' || !child) {
        next.slots[head] = value;
        return next;
    }
    next.slots[head] = setSlotAt(child, rest, value);
    return next;
}

function pathsEqual(a: FocusPath, b: FocusPath): boolean {
    return a.length === b.length && a.every((v, i) => v === b[i]);
}

function isNodeEmpty(node: NestNode): boolean {
    return node.slots.every((s) =>
        typeof s === 'string' ? !String(s || '').trim() : isNodeEmpty(s)
    );
}

/**
 * Wolfram-szerű matekbevitel — új sablon a fókuszált mezőbe nestelődik.
 */
export default function MathTemplateInput({
    value,
    onChange,
    placeholder = 'Írd be a választ…',
    disabled = false,
    autoFocus = false,
    id,
    onSubmit,
}: Props) {
    const [panelOpen, setPanelOpen] = useState(true);
    const [category, setCategory] = useState<MathCategoryId>('basic');
    const [root, setRoot] = useState<NestNode | null>(null);
    const [focusPath, setFocusPath] = useState<FocusPath>([0]);
    const inputRefs = useRef<Record<string, HTMLInputElement | null>>({});

    const activeCategory = MATH_CATEGORIES.find((c) => c.id === category) || MATH_CATEGORIES[0];
    const focusKey = focusPath.join('.');

    useEffect(() => {
        if (!root) return;
        const el = inputRefs.current[focusKey];
        if (el) el.focus();
    }, [root, focusKey]);

    const commitRoot = (node: NestNode | null) => {
        setRoot(node);
        if (!node) {
            onChange('');
            return;
        }
        const t = findTemplate(node.templateId);
        if (!t) {
            onChange('');
            return;
        }
        const parts = node.slots.map((s) => {
            if (typeof s === 'string') return String(s || '').trim();
            return buildExpr(s);
        });
        if (parts.every((p) => !p)) {
            onChange('');
            return;
        }
        onChange(t.build(parts.map((p) => p || '?')));
    };

    const selectTemplate = (t: TemplateItem) => {
        const nested: NestNode = { templateId: t.id, slots: emptySlots(t) };

        // #region agent log
        void import('../utils/agentDebugLog').then(({ agentDebugLog }) => {
            agentDebugLog({
                hypothesisId: 'N',
                location: 'MathTemplateInput.tsx:selectTemplate',
                message: 'template click nest-or-replace',
                data: {
                    templateId: t.id,
                    hasRoot: !!root,
                    focusPath,
                    mode: root ? 'nest-into-focus' : 'new-root',
                    layout: t.layout,
                },
                runId: 'power-layout',
            });
        });
        // #endregion

        if (!root) {
            setRoot(nested);
            setFocusPath([0]);
            commitRoot(nested);
            return;
        }

        // Van aktív művelet + fókusz: az új sablon a fókuszált mezőbe kerül
        const next = setSlotAt(root, focusPath, nested);
        setRoot(next);
        setFocusPath([...focusPath, 0]);
        commitRoot(next);
    };

    const insertSymbol = (text: string) => {
        if (!root) {
            onChange(`${value || ''}${text}`);
            return;
        }
        const cur = getSlot(root, focusPath);
        if (typeof cur === 'string' || cur === null) {
            const next = setSlotAt(root, focusPath, `${typeof cur === 'string' ? cur : ''}${text}`);
            commitRoot(next);
            return;
        }
        // fókusz egy nest csomón van — ne írjunk rá
    };

    const setLeafText = (path: FocusPath, text: string) => {
        if (!root) return;
        const next = setSlotAt(root, path, text);
        commitRoot(next);
    };

    const clearAll = () => {
        setRoot(null);
        setFocusPath([0]);
        onChange('');
    };

    const goFree = () => {
        setRoot(null);
        setFocusPath([0]);
    };

    const handleLeafKeyDown = (
        e: KeyboardEvent<HTMLInputElement>,
        path: FocusPath,
        text: string
    ) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            onSubmit?.();
            return;
        }

        if (e.key !== 'Backspace' && e.key !== 'Delete') return;

        const el = e.currentTarget;
        const selStart = el.selectionStart ?? 0;
        const selEnd = el.selectionEnd ?? 0;
        const hasSelection = selStart !== selEnd;
        const empty = !String(text || '').trim();

        // Van kijelölés vagy szöveg a kurzor előtt → hagyjuk a böngésző törlését
        if (e.key === 'Backspace' && !empty && (hasSelection || selStart > 0)) return;
        if (e.key === 'Delete' && !empty && (hasSelection || selStart < text.length)) return;

        // Üres mező: Backspace / Delete lebontja a belső sablont, vagy az egészet
        if (!empty && e.key === 'Backspace' && selStart === 0) {
            // kurzor elején, van szöveg → ne csináljunk semmit extra (böngésző sem töröl)
            return;
        }

        if (!root) return;

        e.preventDefault();

        // #region agent log
        void import('../utils/agentDebugLog').then(({ agentDebugLog }) => {
            agentDebugLog({
                hypothesisId: 'B',
                location: 'MathTemplateInput.tsx:handleLeafKeyDown',
                message: 'backspace unwrap/clear',
                data: { key: e.key, path, empty, rootId: root.templateId },
                runId: 'backspace-delete',
            });
        });
        // #endregion

        // Beágyazott sablon: üres mezőnél a szülő nestet cseréljük üres szövegre
        if (path.length > 1) {
            const parentPath = path.slice(0, -1);
            const parentSlot = getSlot(root, parentPath);
            if (parentSlot && typeof parentSlot !== 'string') {
                // ha a nest teljesen üres, vagy Backspace az első mezőn → unwrap
                if (isNodeEmpty(parentSlot) || path[path.length - 1] === 0) {
                    const next = setSlotAt(root, parentPath, '');
                    commitRoot(next);
                    setFocusPath(parentPath);
                    return;
                }
            }
        }

        // Gyökér sablon: ha minden üres → töröld az egész sablont
        if (isNodeEmpty(root)) {
            clearAll();
            return;
        }

        // Előző mezőre ugrás, ha van
        if (e.key === 'Backspace' && path.length === 1 && path[0] > 0) {
            setFocusPath([path[0] - 1]);
        }
    };

    const renderLeafInput = (
        path: FocusPath,
        text: string,
        role: ReturnType<typeof getSlotVisualRole> = 'default'
    ) => {
        const key = path.join('.');
        const focused = pathsEqual(path, focusPath);
        const size =
            role === 'exp' || role === 'sub' || role === 'compact'
                ? { width: 32, height: 26, fontSize: '0.8rem' }
                : role === 'setlist'
                  ? { width: 220, height: 36, fontSize: '0.95rem' }
                : role === 'base' || role === 'wide'
                  ? { width: 58, height: 36, fontSize: '0.95rem' }
                  : { width: 48, height: 32, fontSize: '0.9rem' };
        return (
            <input
                key={key}
                ref={(el) => {
                    inputRefs.current[key] = el;
                }}
                type="text"
                inputMode="decimal"
                disabled={disabled}
                value={text}
                aria-label={`mező ${key}`}
                onFocus={() => setFocusPath(path)}
                onClick={(e) => {
                    e.stopPropagation();
                    setFocusPath(path);
                }}
                onChange={(e) => setLeafText(path, e.target.value)}
                onKeyDown={(e) => handleLeafKeyDown(e, path, text)}
                style={{
                    ...slotBox,
                    maxWidth: role === 'setlist' ? 280 : slotBox.maxWidth,
                    borderColor: focused ? '#39ff14' : 'rgba(57,255,20,0.55)',
                    boxShadow: focused ? '0 0 0 2px rgba(57,255,20,0.25)' : 'none',
                    width: size.width,
                    height: size.height,
                    fontSize: size.fontSize,
                }}
            />
        );
    };

    const renderNode = (node: NestNode, pathPrefix: FocusPath): ReactNode => {
        const t = findTemplate(node.templateId);
        if (!t) return null;

        const boxes = node.slots.map((slot, i) => {
            const path = [...pathPrefix, i];
            const role = getSlotVisualRole(t.layout, i);

            if (typeof slot === 'string') {
                return renderLeafInput(path, slot, role);
            }

            // Beágyazott művelet — kattintással a belső első mezőre fókusz
            const nestedFocused =
                focusPath.length >= path.length &&
                path.every((v, idx) => focusPath[idx] === v);

            return (
                <span
                    key={path.join('.')}
                    onClick={(e) => {
                        e.stopPropagation();
                        setFocusPath([...path, 0]);
                    }}
                    style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        padding: '2px 4px',
                        borderRadius: 6,
                        border: nestedFocused
                            ? '1px solid rgba(57,255,20,0.55)'
                            : '1px solid transparent',
                        background: 'rgba(57,255,20,0.06)',
                        cursor: 'pointer',
                    }}
                >
                    {renderNode(slot, path)}
                </span>
            );
        });

        return <span key={pathPrefix.join('.') || 'root'}>{renderLayout(t, boxes)}</span>;
    };

    return (
        <div className="math-template-input wolfram-full" style={{ width: '100%' }}>
            <div style={mainBar}>
                <div style={mainBarInner}>
                    {!root ? (
                        <input
                            id={id}
                            type="text"
                            value={value}
                            disabled={disabled}
                            autoFocus={autoFocus}
                            placeholder={placeholder}
                            onChange={(e) => onChange(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter' && onSubmit) onSubmit();
                            }}
                            style={freeInput}
                        />
                    ) : (
                        <div style={visualArea}>{renderNode(root, [])}</div>
                    )}
                </div>
                <button type="button" disabled={disabled} title="Törlés" onClick={clearAll} style={iconBtn}>
                    ×
                </button>
                <button
                    type="button"
                    disabled={disabled || !String(value || '').trim()}
                    title="Beküldés"
                    onClick={() => onSubmit?.()}
                    style={equalsBtn}
                >
                    =
                </button>
            </div>

            {root ? (
                <div style={{ color: '#8a8', fontSize: '0.75rem', marginBottom: '0.4rem' }}>
                    Tip: kattints egy dobozba, majd válassz új sablont — belekerül a műveletbe.
                </div>
            ) : null}

            <div style={modeRow}>
                <button type="button" disabled={disabled} onClick={goFree} style={modeBtn(!root)}>
                    ABC
                </button>
                <button
                    type="button"
                    disabled={disabled}
                    onClick={() => setPanelOpen((o) => !o)}
                    style={modeBtn(panelOpen)}
                >
                    {panelOpen ? 'Sablonok ▾' : 'Sablonok ▸'}
                </button>
            </div>

            {panelOpen && (
                <div style={panel}>
                    <div style={panelHeader}>
                        <span style={{ fontWeight: 800, letterSpacing: '0.04em', fontSize: '0.85rem' }}>
                            ÖSSZES MATEK SABLON
                        </span>
                        <button
                            type="button"
                            onClick={() => setPanelOpen(false)}
                            style={{ ...iconBtn, width: 32, height: 32, fontSize: '1.1rem' }}
                            title="Bezárás"
                        >
                            ×
                        </button>
                    </div>

                    <div style={tabRow}>
                        {MATH_CATEGORIES.map((c) => (
                            <button
                                key={c.id}
                                type="button"
                                disabled={disabled}
                                onClick={() => setCategory(c.id)}
                                style={tabBtn(category === c.id)}
                            >
                                {c.title}
                            </button>
                        ))}
                    </div>

                    <div style={grid}>
                        {activeCategory.items.map((item) => (
                            <button
                                key={item.id}
                                type="button"
                                disabled={disabled}
                                title={item.label}
                                onClick={() => {
                                    if (item.kind === 'template') selectTemplate(item);
                                    else insertSymbol(item.insert);
                                }}
                                style={toolBtn(false)}
                            >
                                <span style={{ fontSize: '0.88rem', lineHeight: 1.1, color: '#39ff14' }}>
                                    <InlineMath math={item.katex} />
                                </span>
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

const slotBox: CSSProperties = {
    minWidth: 36,
    maxWidth: 88,
    height: 32,
    textAlign: 'center',
    background: 'rgba(0, 0, 0, 0.45)',
    border: '1.5px dashed rgba(57,255,20,0.45)',
    borderRadius: 6,
    color: '#dfffd8',
    fontSize: '0.95rem',
    fontWeight: 700,
    outline: 'none',
    padding: '0 4px',
};

const mainBar: CSSProperties = {
    display: 'flex',
    alignItems: 'stretch',
    gap: 8,
    padding: '0.55rem 0.65rem',
    background: 'linear-gradient(180deg, rgba(8,24,12,0.95), rgba(4,12,8,0.98))',
    border: '2px solid rgba(57,255,20,0.55)',
    borderRadius: 14,
    boxShadow: '0 0 0 1px rgba(57,255,20,0.15), 0 8px 28px rgba(0,40,10,0.35)',
    marginBottom: '0.55rem',
};

const mainBarInner: CSSProperties = {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    minHeight: 52,
    overflowX: 'auto',
};

const freeInput: CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    outline: 'none',
    color: '#dfffd8',
    fontSize: '1.15rem',
    fontWeight: 600,
    padding: '0.35rem 0.25rem',
};

const visualArea: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    padding: '0.25rem 0.15rem',
    minHeight: 48,
    color: '#dfffd8',
};

const iconBtn: CSSProperties = {
    width: 40,
    borderRadius: 10,
    border: '1px solid rgba(57,255,20,0.4)',
    background: 'rgba(57,255,20,0.1)',
    color: '#39ff14',
    fontSize: '1.35rem',
    cursor: 'pointer',
    fontWeight: 700,
};

const equalsBtn: CSSProperties = {
    width: 44,
    borderRadius: 10,
    border: 'none',
    background: 'linear-gradient(180deg, #57ff3a, #2bc410)',
    color: '#041208',
    fontSize: '1.25rem',
    fontWeight: 800,
    cursor: 'pointer',
};

const modeRow: CSSProperties = {
    display: 'flex',
    gap: '0.4rem',
    marginBottom: '0.5rem',
};

function modeBtn(active: boolean): CSSProperties {
    return {
        padding: '0.4rem 0.75rem',
        borderRadius: 8,
        border: `1px solid ${active ? '#39ff14' : 'rgba(57,255,20,0.3)'}`,
        background: active ? 'rgba(57,255,20,0.22)' : 'rgba(0,0,0,0.35)',
        color: '#39ff14',
        cursor: 'pointer',
        fontWeight: 700,
        fontSize: '0.85rem',
    };
}

const panel: CSSProperties = {
    background: 'rgba(0,0,0,0.45)',
    border: '1px solid rgba(57,255,20,0.3)',
    borderRadius: 12,
    padding: '0.65rem',
    marginBottom: '0.55rem',
    maxHeight: 320,
    overflowY: 'auto',
};

const panelHeader: CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    color: '#9f9',
    marginBottom: '0.5rem',
};

const tabRow: CSSProperties = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '0.35rem',
    marginBottom: '0.55rem',
};

function tabBtn(active: boolean): CSSProperties {
    return {
        padding: '0.3rem 0.55rem',
        borderRadius: 6,
        border: `1px solid ${active ? '#39ff14' : 'rgba(57,255,20,0.25)'}`,
        background: active ? 'rgba(57,255,20,0.28)' : 'rgba(0,0,0,0.35)',
        color: active ? '#39ff14' : '#8a8',
        cursor: 'pointer',
        fontSize: '0.68rem',
        fontWeight: 800,
        letterSpacing: '0.03em',
    };
}

const grid: CSSProperties = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(52px, 1fr))',
    gap: '0.4rem',
};

function toolBtn(_active: boolean): CSSProperties {
    return {
        minHeight: 48,
        padding: '0.3rem 0.25rem',
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'rgba(57,255,20,0.08)',
        border: '1px solid rgba(57,255,20,0.3)',
        borderRadius: 10,
        color: '#39ff14',
        cursor: 'pointer',
    };
}
