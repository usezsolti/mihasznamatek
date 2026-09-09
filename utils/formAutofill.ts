/** Chrome autofill gyakran a DOM-ba ír, a React state-et nem. */

export type AutofillHandlers = {
    onChange: (e: { currentTarget: HTMLInputElement }) => void;
    onInput: (e: { currentTarget: HTMLInputElement }) => void;
    onBlur: (e: { currentTarget: HTMLInputElement }) => void;
    onAnimationStart: (e: { animationName: string; currentTarget: HTMLInputElement }) => void;
};

export function bindAutofillInput(setValue: (value: string) => void): AutofillHandlers {
    const apply = (el: { value?: string } | null) => {
        if (!el) return;
        setValue(String(el.value || ''));
    };
    return {
        onChange: (e) => apply(e.currentTarget),
        onInput: (e) => apply(e.currentTarget),
        onBlur: (e) => apply(e.currentTarget),
        onAnimationStart: (e) => {
            if (/onAutoFillStart/i.test(e.animationName)) apply(e.currentTarget);
        },
    };
}

export function readInputDom(id: string): string {
    if (typeof document === 'undefined') return '';
    const el = document.getElementById(id) as HTMLInputElement | null;
    return String(el?.value || '').trim();
}

export function preferFilled(stateVal: string, id: string): string {
    const fromState = String(stateVal || '').trim();
    if (fromState) return fromState;
    return readInputDom(id);
}

/** Egy mező szerkesztésekor a testvéreket is mentsük, különben az autofill értékük elvész. */
export function syncInputsFromDom(idsToSetters: Record<string, (value: string) => void>): void {
    if (typeof document === 'undefined') return;
    for (const [id, setValue] of Object.entries(idsToSetters)) {
        const el = document.getElementById(id) as HTMLInputElement | null;
        if (!el) continue;
        setValue(String(el.value || ''));
    }
}
