import type { Question } from './types';
import { assertSixByTwenty, laBank, type LaRow } from './linearisTypes';
import {
    de1Alapok,
    de1Bernoulli,
    de1Ivp,
    de1Linear,
    de1Modellek,
    de1Szeparal,
} from './de1';
import {
    de2Gerjeszt,
    de2Homogen,
    de2Inhomogen,
    de2Karakt,
    de2Rezges,
    de2Wronski,
} from './de2';
import {
    de3Dinamika,
    de3Expat,
    de3Fazis,
    de3LinearRendszer,
    de3Rendszerek,
    de3Stabil,
} from './de3';
import {
    de4Euler,
    de4Inverz,
    de4Konvolucio,
    de4Laplace,
    de4Merev,
    de4Rk,
} from './de4';
import {
    pde1Ho,
    pde1Hullam,
    pde1Karakter,
    pde1Laplace,
    pde1Osztaly,
    pde1Perem,
} from './pde1';
import {
    pde2Elliptikus,
    pde2Green,
    pde2Gyenge,
    pde2Parabolikus,
    pde2Szoboljev,
    pde2Variacio,
} from './pde2';

/** Differenciálegyenletek I–IV. + PDE I–II. — `de`/`pde` prefix, ne ütközzön érettségi includes()-szel. */
export const DE_TOPIC_IDS = [
    'de1-alapok',
    'de1-szeparal',
    'de1-linear',
    'de1-bernoulli',
    'de1-ivp',
    'de1-modellek',
    'de2-homogen',
    'de2-karakt',
    'de2-inhomogen',
    'de2-wronski',
    'de2-rezges',
    'de2-gerjeszt',
    'de3-rendszerek',
    'de3-linear-rendszer',
    'de3-expat',
    'de3-fazis',
    'de3-stabil',
    'de3-dinamika',
    'de4-laplace',
    'de4-inverz',
    'de4-konvolucio',
    'de4-euler',
    'de4-rk',
    'de4-merev',
    'pde1-osztaly',
    'pde1-karakter',
    'pde1-ho',
    'pde1-hullam',
    'pde1-laplace',
    'pde1-perem',
    'pde2-gyenge',
    'pde2-szoboljev',
    'pde2-variacio',
    'pde2-elliptikus',
    'pde2-parabolikus',
    'pde2-green',
] as const;

export type DeTopicId = (typeof DE_TOPIC_IDS)[number];

const BANKS: Record<string, () => LaRow[]> = {
    'de1-alapok': de1Alapok,
    'de1-szeparal': de1Szeparal,
    'de1-linear': de1Linear,
    'de1-bernoulli': de1Bernoulli,
    'de1-ivp': de1Ivp,
    'de1-modellek': de1Modellek,
    'de2-homogen': de2Homogen,
    'de2-karakt': de2Karakt,
    'de2-inhomogen': de2Inhomogen,
    'de2-wronski': de2Wronski,
    'de2-rezges': de2Rezges,
    'de2-gerjeszt': de2Gerjeszt,
    'de3-rendszerek': de3Rendszerek,
    'de3-linear-rendszer': de3LinearRendszer,
    'de3-expat': de3Expat,
    'de3-fazis': de3Fazis,
    'de3-stabil': de3Stabil,
    'de3-dinamika': de3Dinamika,
    'de4-laplace': de4Laplace,
    'de4-inverz': de4Inverz,
    'de4-konvolucio': de4Konvolucio,
    'de4-euler': de4Euler,
    'de4-rk': de4Rk,
    'de4-merev': de4Merev,
    'pde1-osztaly': pde1Osztaly,
    'pde1-karakter': pde1Karakter,
    'pde1-ho': pde1Ho,
    'pde1-hullam': pde1Hullam,
    'pde1-laplace': pde1Laplace,
    'pde1-perem': pde1Perem,
    'pde2-gyenge': pde2Gyenge,
    'pde2-szoboljev': pde2Szoboljev,
    'pde2-variacio': pde2Variacio,
    'pde2-elliptikus': pde2Elliptikus,
    'pde2-parabolikus': pde2Parabolikus,
    'pde2-green': pde2Green,
};

export function isDeTopicId(topicId: string): boolean {
    const t = topicId.toLowerCase();
    return /^de[1-4]-/.test(t) || /^pde[12]-/.test(t);
}

export function getDePracticeQuestions(topicId: string): Question[] | null {
    const make = BANKS[topicId.toLowerCase()];
    if (!make) return null;
    const list = laBank(make());
    assertSixByTwenty(topicId, list);
    return list;
}
