import type { Question } from './types';
import {
    erettsegiEmeltTopics,
    erettsegiKozepTopics,
    kozpontiTopics,
} from '../mathTopicsCatalog';

export type PaperTopicKind = 'kozep' | 'emelt' | 'kozponti';

/** Kézi felülírás kérdés-id szerint. A többi a szövegből következtetett. */
export const PAPER_TOPIC_TAGS: Record<string, string> = {};

const KOZEP_IDS = new Set(erettsegiKozepTopics.map((t) => t.id));
const EMELT_IDS = new Set(erettsegiEmeltTopics.map((t) => t.id));
const KF_IDS = new Set(kozpontiTopics.map((t) => t.id));

const TITLE_BY_ID = new Map<string, string>([
    ...erettsegiKozepTopics.map((t) => [t.id, t.title] as const),
    ...erettsegiEmeltTopics.map((t) => [t.id, t.title] as const),
    ...kozpontiTopics.map((t) => [t.id, t.title] as const),
]);

export function catalogTopicTitle(topicId: string): string {
    return TITLE_BY_ID.get(topicId) || topicId;
}

export function isValidPaperTopicId(topicId: string, kind: PaperTopicKind): boolean {
    if (kind === 'kozponti') return KF_IDS.has(topicId);
    if (kind === 'emelt') return EMELT_IDS.has(topicId);
    return KOZEP_IDS.has(topicId);
}

function fold(s: string): string {
    return String(s || '')
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/ß/g, 'ss');
}

function hasAny(blob: string, needles: string[]): boolean {
    return needles.some((n) => blob.includes(n));
}

const KOZEP_BASE: Record<string, string> = {
    parameter: 'egyenletek-egyenlotlensegek',
    bizonyitasok: 'logika-grafok',
    'abszolutertek-gyok': 'abszolutertek-gyok',
    'egyenletek-egyenlotlensegek': 'egyenletek-egyenlotlensegek',
    egyszerusitesek: 'egyszerusitesek',
    'ertelmezesi-tartomany': 'ertelmezesi-tartomany',
    'exponencialis-logaritmus': 'exponencialis-logaritmus',
    'fuggvenyek-analizis': 'fuggvenyek-analizis',
    halmazok: 'halmazok',
    kombinatorika: 'kombinatorika',
    koordinatageometria: 'koordinatageometria',
    'logika-grafok': 'logika-grafok',
    sikgeometria: 'sikgeometria',
    sorozatok: 'sorozatok',
    statisztika: 'statisztika',
    szamelmelet: 'szamelmelet',
    'szoveges-feladatok': 'szoveges-feladatok',
    tergeometria: 'tergeometria',
    trigonometria: 'trigonometria',
    valoszinusegszamitas: 'valoszinusegszamitas',
};

const EMELT_BASE: Record<string, string> = {
    parameter: 'parameter',
    bizonyitasok: 'bizonyitasok',
    'abszolutertek-gyok': 'abszolutertek-gyok-emelt',
    'egyenletek-egyenlotlensegek': 'egyenletek-egyenlotlensegek-emelt',
    egyszerusitesek: 'egyszerusitesek-emelt',
    'ertelmezesi-tartomany': 'ertelmezesi-tartomany-emelt',
    'exponencialis-logaritmus': 'exponencialis-logaritmus-emelt',
    'fuggvenyek-analizis': 'fuggvenyek-analizis-emelt',
    halmazok: 'halmazok-emelt',
    kombinatorika: 'kombinatorika-emelt',
    koordinatageometria: 'koordinatageometria-emelt',
    'logika-grafok': 'logika-grafok-emelt',
    sikgeometria: 'sikgeometria-emelt',
    sorozatok: 'sorozatok-emelt',
    statisztika: 'statisztika-emelt',
    szamelmelet: 'szamelmelet-emelt',
    'szoveges-feladatok': 'szoveges-feladatok-emelt',
    tergeometria: 'tergeometria-emelt',
    trigonometria: 'trigonometria-emelt',
    valoszinusegszamitas: 'valoszinusegszamitas-emelt',
};

type BaseKey = keyof typeof KOZEP_BASE;

function inferBaseKey(blob: string): BaseKey {
    if (hasAny(blob, ['parameteres', 'parametert', 'a parameter', 'parameter '])) return 'parameter';
    if (hasAny(blob, ['bizonyits', 'bizonyitas', 'lasd be', 'igazold'])) return 'bizonyitasok';
    if (hasAny(blob, ['valoszin', 'kockadobas', 'visszateves', 'urna', 'huzas'])) {
        return 'valoszinusegszamitas';
    }
    if (hasAny(blob, ['atlag', 'median', 'modusz', 'szoras', 'gyakorisag', 'kvartilis', 'boxplot', 'statiszt'])) {
        return 'statisztika';
    }
    if (hasAny(blob, ['permutacio', 'kombinacio', 'variacio', 'hanyfele', 'anagramma', 'kombinator'])) {
        return 'kombinatorika';
    }
    if (hasAny(blob, ['szinusz', 'koszinusz', 'tangens', 'cotangens', 'sin(', 'cos(', 'tg(', 'trigonometr'])) {
        return 'trigonometria';
    }
    if (hasAny(blob, ['logarit', 'exponencial', 'felezesi', 'radioaktiv', 'log(', 'ln('])) {
        return 'exponencialis-logaritmus';
    }
    if (hasAny(blob, ['derivalt', 'erinto', 'szelsoertek', 'integ', 'monoton', 'inflexio', 'analizis'])) {
        return 'fuggvenyek-analizis';
    }
    if (hasAny(blob, ['fuggveny', 'f(x)', 'grafikon'])) return 'fuggvenyek-analizis';
    if (
        hasAny(blob, [
            'koordinata',
            'vektor',
            'egyenes egyenlete',
            'kor egyenlete',
            'parabola',
            'skalarm',
        ])
    ) {
        return 'koordinatageometria';
    }
    if (hasAny(blob, ['terfogat', 'felszin', 'gomb', 'henger', 'kup', 'gula', 'teglatest', 'hasab'])) {
        return 'tergeometria';
    }
    if (
        hasAny(blob, [
            'haromszog',
            'paralelogram',
            'trapez',
            'koriv',
            'kerulet',
            'terulet',
            'hasonlo',
            'pitagorasz',
            'thales',
            'szog',
            'sikgeometr',
            'negyzet',
            'teglalap',
            'rombusz',
            'koratmero',
            'sugar',
        ])
    ) {
        return 'sikgeometria';
    }
    if (hasAny(blob, ['sorozat', 'szamtani', 'mertani', 'rekurzio', 'an='])) return 'sorozatok';
    if (hasAny(blob, ['oszthato', 'primszam', 'lnko', 'lkkt', 'maradek', 'kongru', 'szamelmelet'])) {
        return 'szamelmelet';
    }
    if (hasAny(blob, ['halmaz', 'unio', 'metszet', 'venn'])) return 'halmazok';
    if (hasAny(blob, ['graf', 'csucs', 'el szama', 'igazsagtabla', 'logikai'])) return 'logika-grafok';
    if (hasAny(blob, ['abszolutertek', '|x|', 'gyok', 'sqrt', 'negyzetgyok'])) return 'abszolutertek-gyok';
    if (hasAny(blob, ['ertelmezesi', 'ertekkeszlet', 'df', 'rf'])) return 'ertelmezesi-tartomany';
    if (hasAny(blob, ['egyenletrendszer', 'egyenlotlenseg', 'egyenlet', 'megoldashalmaz'])) {
        return 'egyenletek-egyenlotlensegek';
    }
    if (hasAny(blob, ['egyszerusit', 'alakitsd', 'hozd egyszerubb', 'azonossag'])) return 'egyszerusitesek';
    return 'szoveges-feladatok';
}

const KF_FROM_BASE: Record<BaseKey, string> = {
    parameter: 'algebra',
    bizonyitasok: 'szoveges',
    'abszolutertek-gyok': 'algebra',
    'egyenletek-egyenlotlensegek': 'algebra',
    egyszerusitesek: 'algebra',
    'ertelmezesi-tartomany': 'fuggvenyek',
    'exponencialis-logaritmus': 'algebra',
    'fuggvenyek-analizis': 'fuggvenyek',
    halmazok: 'halmazok',
    kombinatorika: 'szamitas',
    koordinatageometria: 'geometria',
    'logika-grafok': 'szoveges',
    sikgeometria: 'geometria',
    sorozatok: 'algebra',
    statisztika: 'statisztika',
    szamelmelet: 'szamitas',
    'szoveges-feladatok': 'szoveges',
    tergeometria: 'geometria',
    trigonometria: 'geometria',
    valoszinusegszamitas: 'valoszinuseg',
};

export function inferPaperTopic(
    question: string,
    expression: string,
    kind: PaperTopicKind
): string {
    const blob = fold(`${question} ${expression}`);
    const base = inferBaseKey(blob);
    if (kind === 'kozponti') {
        if (hasAny(blob, ['muvelet', 'szamold', 'mennyi', 'egesz szam', 'tort'])) {
            if (base === 'szoveges-feladatok') return 'szamitas';
        }
        return KF_FROM_BASE[base] || 'szoveges';
    }
    if (kind === 'emelt') return EMELT_BASE[base];
    return KOZEP_BASE[base];
}

export function resolveQuestionTopicId(
    question: Pick<Question, 'id' | 'catalogTopicId' | 'srsTopicId' | 'question' | 'expression'>,
    kind: PaperTopicKind
): string {
    const explicit = question.catalogTopicId || (question.id ? PAPER_TOPIC_TAGS[question.id] : '');
    if (explicit && isValidPaperTopicId(explicit, kind)) return explicit;
    if (question.srsTopicId && isValidPaperTopicId(question.srsTopicId, kind)) {
        return question.srsTopicId;
    }
    return inferPaperTopic(question.question || '', question.expression || '', kind);
}

export function applyPaperTopicTags(questions: Question[], kind: PaperTopicKind): Question[] {
    return questions.map((q) => {
        const catalogTopicId = resolveQuestionTopicId(q, kind);
        return { ...q, catalogTopicId };
    });
}
