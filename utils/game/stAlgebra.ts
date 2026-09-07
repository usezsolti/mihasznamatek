import type { Question } from './types';
import { assertSixByTwenty, laBank, type LaRow } from './linearisTypes';
import {
    st1Alapok,
    st1Becsles,
    st1Eloszlas,
    st1Konfidencia,
    st1Kozep,
    st1Leiras,
} from './st1';
import {
    st2Chi2,
    st2Hipotezis,
    st2Kapcsolat,
    st2Linreg,
    st2Nemparam,
    st2ParamProba,
} from './st2';
import {
    st3Anova,
    st3Halado,
    st3Idosor,
    st3Klaszter,
    st3Pca,
    st3Tobbreg,
} from './st3';

/** Egyetemi statisztika I–III. — `st` prefix, ne ütközzön érettségi statisztika/valoszinuseg includes()-szel. */
export const ST_TOPIC_IDS = [
    'st1-alapok',
    'st1-leiras',
    'st1-kozep',
    'st1-eloszlas',
    'st1-becsles',
    'st1-konfidencia',
    'st2-hipotezis',
    'st2-param-proba',
    'st2-chi2',
    'st2-nemparam',
    'st2-kapcsolat',
    'st2-linreg',
    'st3-tobbreg',
    'st3-anova',
    'st3-idosor',
    'st3-pca',
    'st3-klaszter',
    'st3-halado',
] as const;

export type StTopicId = (typeof ST_TOPIC_IDS)[number];

const BANKS: Record<string, () => LaRow[]> = {
    'st1-alapok': st1Alapok,
    'st1-leiras': st1Leiras,
    'st1-kozep': st1Kozep,
    'st1-eloszlas': st1Eloszlas,
    'st1-becsles': st1Becsles,
    'st1-konfidencia': st1Konfidencia,
    'st2-hipotezis': st2Hipotezis,
    'st2-param-proba': st2ParamProba,
    'st2-chi2': st2Chi2,
    'st2-nemparam': st2Nemparam,
    'st2-kapcsolat': st2Kapcsolat,
    'st2-linreg': st2Linreg,
    'st3-tobbreg': st3Tobbreg,
    'st3-anova': st3Anova,
    'st3-idosor': st3Idosor,
    'st3-pca': st3Pca,
    'st3-klaszter': st3Klaszter,
    'st3-halado': st3Halado,
};

export function isStTopicId(topicId: string): boolean {
    return /^st[1-3]-/.test(topicId.toLowerCase());
}

export function getStPracticeQuestions(topicId: string): Question[] | null {
    const make = BANKS[topicId.toLowerCase()];
    if (!make) return null;
    const list = laBank(make());
    assertSixByTwenty(topicId, list);
    return list;
}
