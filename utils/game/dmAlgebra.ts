import type { Question } from './types';
import { assertSixByTwenty, laBank, type LaRow } from './linearisTypes';
import {
    dm1Binom,
    dm1OsszBiz,
    dm1Osszeadas,
    dm1Permvar,
    dm1Skatulya,
    dm1Szita,
} from './dm1';
import {
    dm2Catalan,
    dm2Fibonacci,
    dm2Gf,
    dm2LinearRek,
    dm2OsszRek,
    dm2Rekurzio,
} from './dm2';
import {
    dm3Extrem,
    dm3Hiper,
    dm3Polinom,
    dm3Prob,
    dm3Ramsey,
    dm3Turan,
} from './dm3';
import { ge1Alapok, ge1Cayley, ge1Euler, ge1Fak, ge1Mst, ge1Utak } from './ge1';
import {
    ge2Folyam,
    ge2Menger,
    ge2Paros,
    ge2Parositas,
    ge2Sik,
    ge2Szinezes,
} from './ge2';

/** Diszkrét matek I–III. + gráfelmélet I–II. — `dm`/`ge` prefix, ne ütközzön érettségi includes()-szel. */
export const DM_TOPIC_IDS = [
    'dm1-osszeadas',
    'dm1-permvar',
    'dm1-binom',
    'dm1-skatulya',
    'dm1-szita',
    'dm1-ossz-biz',
    'dm2-rekurzio',
    'dm2-linear-rek',
    'dm2-fibonacci',
    'dm2-catalan',
    'dm2-gf',
    'dm2-ossz-rek',
    'ge1-alapok',
    'ge1-utak',
    'ge1-fak',
    'ge1-cayley',
    'ge1-euler',
    'ge1-mst',
    'ge2-szinezes',
    'ge2-sik',
    'ge2-paros',
    'ge2-parositas',
    'ge2-folyam',
    'ge2-menger',
    'dm3-extrem',
    'dm3-turan',
    'dm3-ramsey',
    'dm3-hiper',
    'dm3-prob',
    'dm3-polinom',
] as const;

export type DmTopicId = (typeof DM_TOPIC_IDS)[number];

const BANKS: Record<string, () => LaRow[]> = {
    'dm1-osszeadas': dm1Osszeadas,
    'dm1-permvar': dm1Permvar,
    'dm1-binom': dm1Binom,
    'dm1-skatulya': dm1Skatulya,
    'dm1-szita': dm1Szita,
    'dm1-ossz-biz': dm1OsszBiz,
    'dm2-rekurzio': dm2Rekurzio,
    'dm2-linear-rek': dm2LinearRek,
    'dm2-fibonacci': dm2Fibonacci,
    'dm2-catalan': dm2Catalan,
    'dm2-gf': dm2Gf,
    'dm2-ossz-rek': dm2OsszRek,
    'ge1-alapok': ge1Alapok,
    'ge1-utak': ge1Utak,
    'ge1-fak': ge1Fak,
    'ge1-cayley': ge1Cayley,
    'ge1-euler': ge1Euler,
    'ge1-mst': ge1Mst,
    'ge2-szinezes': ge2Szinezes,
    'ge2-sik': ge2Sik,
    'ge2-paros': ge2Paros,
    'ge2-parositas': ge2Parositas,
    'ge2-folyam': ge2Folyam,
    'ge2-menger': ge2Menger,
    'dm3-extrem': dm3Extrem,
    'dm3-turan': dm3Turan,
    'dm3-ramsey': dm3Ramsey,
    'dm3-hiper': dm3Hiper,
    'dm3-prob': dm3Prob,
    'dm3-polinom': dm3Polinom,
};

export function isDmTopicId(topicId: string): boolean {
    const t = topicId.toLowerCase();
    return /^dm[1-3]-/.test(t) || /^ge[12]-/.test(t);
}

export function getDmPracticeQuestions(topicId: string): Question[] | null {
    const make = BANKS[topicId.toLowerCase()];
    if (!make) return null;
    const list = laBank(make());
    assertSixByTwenty(topicId, list);
    return list;
}
