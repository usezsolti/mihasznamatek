import type { Question } from './types';
import { assertSixByTwenty, laBank, type LaRow } from './linearisTypes';
import {
    la1Det,
    la1Gauss,
    la1Inverz,
    la1MxMuveletek,
    la1Rang,
    la1Vektorok,
} from './linearis1';
import {
    la2Bazis,
    la2Dimenzio,
    la2Fuggetlenseg,
    la2Lekepezes,
    la2Span,
    la2Vektorter,
} from './linearis2';
import {
    la3Diagonal,
    la3GramSchmidt,
    la3Karpolinom,
    la3Multiplicitas,
    la3Sajatvektor,
    la3Spektral,
} from './linearis3';
import {
    la4Householder,
    la4Jordan,
    la4Kvadratikus,
    la4LuQr,
    la4Normak,
    la4Svd,
} from './linearis4';

/** Lineáris algebra I–IV. — `la1-`…`la4-` prefix, ne ütközzön érettségi includes()-szel. */
export const LINEARIS_TOPIC_IDS = [
    'la1-vektorok',
    'la1-mx-muveletek',
    'la1-gauss',
    'la1-det',
    'la1-inverz',
    'la1-rang',
    'la2-vektorter',
    'la2-span',
    'la2-fuggetlenseg',
    'la2-bazis',
    'la2-dimenzio',
    'la2-lekepezes',
    'la3-sajatvektor',
    'la3-karpolinom',
    'la3-multiplicitas',
    'la3-diagonal',
    'la3-gramschmidt',
    'la3-spektral',
    'la4-kvadratikus',
    'la4-lu-qr',
    'la4-householder',
    'la4-svd',
    'la4-jordan',
    'la4-normak',
] as const;

export type LinearisTopicId = (typeof LINEARIS_TOPIC_IDS)[number];

const BANKS: Record<string, () => LaRow[]> = {
    'la1-vektorok': la1Vektorok,
    'la1-mx-muveletek': la1MxMuveletek,
    'la1-gauss': la1Gauss,
    'la1-det': la1Det,
    'la1-inverz': la1Inverz,
    'la1-rang': la1Rang,
    'la2-vektorter': la2Vektorter,
    'la2-span': la2Span,
    'la2-fuggetlenseg': la2Fuggetlenseg,
    'la2-bazis': la2Bazis,
    'la2-dimenzio': la2Dimenzio,
    'la2-lekepezes': la2Lekepezes,
    'la3-sajatvektor': la3Sajatvektor,
    'la3-karpolinom': la3Karpolinom,
    'la3-multiplicitas': la3Multiplicitas,
    'la3-diagonal': la3Diagonal,
    'la3-gramschmidt': la3GramSchmidt,
    'la3-spektral': la3Spektral,
    'la4-kvadratikus': la4Kvadratikus,
    'la4-lu-qr': la4LuQr,
    'la4-householder': la4Householder,
    'la4-svd': la4Svd,
    'la4-jordan': la4Jordan,
    'la4-normak': la4Normak,
};

export function isLinearisTopicId(topicId: string): boolean {
    return /^la[1-4]-/.test(topicId.toLowerCase());
}

export function getLinearisPracticeQuestions(topicId: string): Question[] | null {
    const make = BANKS[topicId.toLowerCase()];
    if (!make) return null;
    const list = laBank(make());
    assertSixByTwenty(topicId, list);
    return list;
}
