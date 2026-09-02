import type { Question } from './types';
import { assertSixByTwenty, laBank, type LaRow } from './linearisTypes';
import { a2Diffhat, a2ElemiDer, a2Magasabb, a2Monoton, a2Mvt, a2Szabalyok } from './analizis2A';
import { a2Aszimptota, a2Konvex, a2Lhospital, a2Szelso, a2Taylor, a2Vizsgalat } from './analizis2B';

/** Analízis II. — differenciálszámítás, `a2-` prefix. */
export const ANALIZIS2_TOPIC_IDS = [
    'a2-diffhat',
    'a2-szabalyok',
    'a2-elemi-der',
    'a2-magasabb',
    'a2-mvt',
    'a2-monoton',
    'a2-szelso',
    'a2-konvex',
    'a2-lhospital',
    'a2-aszimptota',
    'a2-vizsgalat',
    'a2-taylor',
] as const;

export type Analizis2TopicId = (typeof ANALIZIS2_TOPIC_IDS)[number];

const BANKS: Record<string, () => LaRow[]> = {
    'a2-diffhat': a2Diffhat,
    'a2-szabalyok': a2Szabalyok,
    'a2-elemi-der': a2ElemiDer,
    'a2-magasabb': a2Magasabb,
    'a2-mvt': a2Mvt,
    'a2-monoton': a2Monoton,
    'a2-szelso': a2Szelso,
    'a2-konvex': a2Konvex,
    'a2-lhospital': a2Lhospital,
    'a2-aszimptota': a2Aszimptota,
    'a2-vizsgalat': a2Vizsgalat,
    'a2-taylor': a2Taylor,
};

export function getAnalizis2PracticeQuestions(topicId: string): Question[] | null {
    const make = BANKS[topicId.toLowerCase()];
    if (!make) return null;
    const list = laBank(make());
    assertSixByTwenty(topicId, list);
    return list;
}
