import type { Question } from './types';

// Paraméteres egyenletek — 6×20 (lásd parameterLevels.ts)
import { getParameterPracticeQuestions as getParameterRaw } from './parameterLevels';

export const getParameterPracticeQuestions = (): Question[] => {
    const list = getParameterRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Exponenciális és logaritmus — 6×20 (lásd explogLevels.ts)
import { getExponentialLogPracticeQuestions as getExplogRaw } from './explogLevels';
import { agentDebugLog } from '../agentDebugLog';

export const getExponentialLogPracticeQuestions = (): Question[] => {
    const list = getExplogRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    // #region agent log
    agentDebugLog({
        hypothesisId: 'B',
        location: 'practiceBanks.ts:getExponentialLogPracticeQuestions',
        message: 'explog wrapper loaded',
        data: {
            total: list.length,
            setCards: list.filter((q) => Array.isArray((q as { expectedSet?: string[] }).expectedSet)).length,
            firstSet: (list.find((q) => Array.isArray((q as { expectedSet?: string[] }).expectedSet)) as { expectedSet?: string[] } | undefined)?.expectedSet ?? null,
        },
        runId: 'explog-120',
    });
    // #endregion
    return list;
};

// Abszolútértékes és gyökös kifejezések — 6×20 (lásd absrootLevels.ts)
import { getAbsoluteRootPracticeQuestions as getAbsRootRaw } from './absrootLevels';

export const getAbsoluteRootPracticeQuestions = (): Question[] => {
    const list = getAbsRootRaw().map((q) => {
        // Egy válasz / kártya — ne legyen több mező
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    // #region agent log
    const byStage: Record<number, number> = {};
    let multiAnswer = 0;
    let withHeader = 0;
    list.forEach((q) => {
        const s = q.stage ?? 0;
        byStage[s] = (byStage[s] || 0) + 1;
        if ((q as Question).alternativeAnswer !== undefined || (q as Question).thirdAnswer !== undefined) {
            multiAnswer += 1;
        }
        if (/^\d+\.\s*szint/i.test(String(q.question || ''))) withHeader += 1;
    });
    agentDebugLog({
        hypothesisId: 'B',
        location: 'practiceBanks.ts:getAbsoluteRootPracticeQuestions',
        message: 'absroot pdf bank loaded',
        data: {
            total: list.length,
            byStage,
            multiAnswer,
            withHeader,
            firstQ: String(list[0]?.question || '').slice(0, 40),
            secondQ: String(list[1]?.question || '').slice(0, 50),
            secondAnswer: list[1]?.answer,
            oldSecond: String(list[1]?.question || '').includes('|12|'),
        },
        runId: 'absroot-pdf-120',
    });
    // #endregion
    return list;
};

// Függvények, analízis — 6×20 (lásd fuggvenyekLevels.ts)
import { getFunctionsPracticeQuestions as getFunctionsRaw } from './fuggvenyekLevels';

export const getFunctionsPracticeQuestions = (): Question[] => {
    const list = getFunctionsRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    // #region agent log
    agentDebugLog({
        hypothesisId: 'B',
        location: 'practiceBanks.ts:getFunctionsPracticeQuestions',
        message: 'functions wrapper loaded',
        data: {
            total: list.length,
            setCards: list.filter((q) => Array.isArray((q as { expectedSet?: string[] }).expectedSet)).length,
            firstQ: String(list[0]?.question || '').slice(0, 50),
            firstAnswer: list[0]?.answer,
            firstStage: list[0]?.stage ?? null,
        },
        runId: 'fugg-120',
    });
    // #endregion
    return list;
};

// Bizonyítási feladatok — 6×20 (lásd proofLevels.ts)
import { getProofPracticeQuestions as getProofRaw } from './proofLevels';

export const getProofPracticeQuestions = (): Question[] => {
    const list = getProofRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    // #region agent log
    const byStage: Record<number, number> = {};
    list.forEach((q) => {
        const s = q.stage ?? 0;
        byStage[s] = (byStage[s] || 0) + 1;
    });
    agentDebugLog({
        hypothesisId: 'P',
        location: 'practiceBanks.ts:getProofPracticeQuestions',
        message: 'proof bank loaded',
        data: {
            total: list.length,
            byStage,
            firstQ: String(list[0]?.question || '').slice(0, 70),
            firstAnswer: list[0]?.answer,
            oldFirst: String(list[0]?.question || '').includes('Igazold numerikusan'),
        },
        runId: 'proof-pdf-120',
    });
    // #endregion
    return list;
};

// Egyenletek, egyenletrendszerek, egyenlőtlenségek — 6×20 (lásd eqLevels.ts)
import { getEquationsPracticeQuestions as getEquationsRaw } from './eqLevels';

export const getEquationsPracticeQuestions = (): Question[] => {
    const list = getEquationsRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    // #region agent log
    const byStage: Record<number, number> = {};
    let multiAnswer = 0;
    list.forEach((q) => {
        const s = q.stage ?? 0;
        byStage[s] = (byStage[s] || 0) + 1;
        if ((q as Question).alternativeAnswer !== undefined) multiAnswer += 1;
    });
    agentDebugLog({
        hypothesisId: 'E',
        location: 'practiceBanks.ts:getEquationsPracticeQuestions',
        message: 'equations pdf bank loaded',
        data: {
            total: list.length,
            byStage,
            multiAnswer,
            firstQ: String(list[0]?.question || '').slice(0, 50),
            firstAnswer: list[0]?.answer,
            oldFirst: String(list[0]?.question || '').includes('5x − 8'),
        },
        runId: 'eq-pdf-120',
    });
    // #endregion
    return list;
};

// Halmazok — 6×20 (lásd halmazLevels.ts)
import { getHalmazPracticeQuestions as getHalmazRaw } from './halmazLevels';

export const getHalmazPracticeQuestions = (): Question[] => {
    const list = getHalmazRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    // #region agent log
    const byStage: Record<number, number> = {};
    let multiAnswer = 0;
    list.forEach((q) => {
        const s = q.stage ?? 0;
        byStage[s] = (byStage[s] || 0) + 1;
        if ((q as Question).alternativeAnswer !== undefined) multiAnswer += 1;
    });
    agentDebugLog({
        hypothesisId: 'H',
        location: 'practiceBanks.ts:getHalmazPracticeQuestions',
        message: 'halmazok bank loaded',
        data: { total: list.length, byStage, multiAnswer },
        runId: 'halmaz-120',
    });
    // #endregion
    return list;
};

// Kombinatorika — 6×20 (lásd kombinatorikaLevels.ts)
import { getKombinatorikaPracticeQuestions as getKombinatorikaRaw } from './kombinatorikaLevels';

export const getKombinatorikaPracticeQuestions = (): Question[] => {
    const list = getKombinatorikaRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Koordinátageometria — 6×20 (lásd koordinatageometriaLevels.ts)
import { getKoordinatageometriaPracticeQuestions as getKoordRaw } from './koordinatageometriaLevels';

export const getKoordinatageometriaPracticeQuestions = (): Question[] => {
    const list = getKoordRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Logika, gráfok — 6×20 (lásd grafokLevels.ts)
import { getGrafokPracticeQuestions as getGrafokRaw } from './grafokLevels';

export const getGrafokPracticeQuestions = (): Question[] => {
    const list = getGrafokRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Sorozatok — 6×20 (lásd sorozatokLevels.ts)
import { getSorozatokPracticeQuestions as getSorozatokRaw } from './sorozatokLevels';

export const getSorozatokPracticeQuestions = (): Question[] => {
    const list = getSorozatokRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Statisztika — 6×20 (lásd statisztikaLevels.ts)
import { getStatisztikaPracticeQuestions as getStatisztikaRaw } from './statisztikaLevels';

export const getStatisztikaPracticeQuestions = (): Question[] => {
    const list = getStatisztikaRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Számelmélet — 6×20 (lásd szamelmeletLevels.ts)
import { getSzamelmeletPracticeQuestions as getSzamelmeletRaw } from './szamelmeletLevels';

export const getSzamelmeletPracticeQuestions = (): Question[] => {
    const list = getSzamelmeletRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Szöveges feladatok — 6×20 (lásd szovegesLevels.ts)
import { getSzovegesPracticeQuestions as getSzovegesRaw } from './szovegesLevels';

export const getSzovegesPracticeQuestions = (): Question[] => {
    const list = getSzovegesRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Térgeometria — 6×20 (lásd tergeometriaLevels.ts)
import { getTergeometriaPracticeQuestions as getTergeometriaRaw } from './tergeometriaLevels';

export const getTergeometriaPracticeQuestions = (): Question[] => {
    const list = getTergeometriaRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Valószínűségszámítás — 6×20 (lásd valoszinusegLevels.ts)
import { getValoszinusegPracticeQuestions as getValoszinusegRaw } from './valoszinusegLevels';

export const getValoszinusegPracticeQuestions = (): Question[] => {
    const list = getValoszinusegRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Egyszerűsítések — 6×20 (lásd egyszerusitesLevels.ts)
import { getEgyszerusitesPracticeQuestions as getEgyszerusitesRaw } from './egyszerusitesLevels';

export const getEgyszerusitesPracticeQuestions = (): Question[] => {
    const list = getEgyszerusitesRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Értelmezési tartomány — 6×20 (lásd ertelmezesiLevels.ts)
import { getErtelmezesiPracticeQuestions as getErtelmezesiRaw } from './ertelmezesiLevels';

export const getErtelmezesiPracticeQuestions = (): Question[] => {
    const list = getErtelmezesiRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Síkgeometria — 6×20 (lásd sikgeometriaLevels.ts)
import { getSikgeometriaPracticeQuestions as getSikgeometriaRaw } from './sikgeometriaLevels';

export const getSikgeometriaPracticeQuestions = (): Question[] => {
    const list = getSikgeometriaRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

// Trigonometria — 6×20 (lásd trigonometriaLevels.ts)
import { getTrigonometriaPracticeQuestions as getTrigonometriaRaw } from './trigonometriaLevels';

export const getTrigonometriaPracticeQuestions = (): Question[] => {
    const list = getTrigonometriaRaw().map((q) => {
        const cleaned: Question = {
            ...q,
            question: String(q.question || '')
                .replace(/^\s*\d+\.\s*szint\s*[·•\-–—]\s*[^\n]+\n+/i, '')
                .trim(),
        };
        delete (cleaned as { alternativeAnswer?: number }).alternativeAnswer;
        delete (cleaned as { thirdAnswer?: number }).thirdAnswer;
        delete (cleaned as { fourthAnswer?: number }).fourthAnswer;
        return cleaned;
    });
    return list;
};

import { getAnalizis1PracticeQuestions as getAnalizis1Raw } from './analizis1Levels';
export { ANALIZIS1_TOPIC_IDS } from './analizis1Levels';

export const getAnalizis1PracticeQuestions = (topicId: string): Question[] | null => {
    const list = getAnalizis1Raw(topicId);
    if (!list) return null;
    // #region agent log
    agentDebugLog({
        hypothesisId: 'C',
        location: 'practiceBanks.ts:getAnalizis1PracticeQuestions',
        message: 'analizis1 bank loaded',
        data: {
            topicId,
            total: list.length,
            byStage: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
            firstQ: String(list[0]?.question || '').slice(0, 60),
            isKomplex: topicId.toLowerCase() === 'a1-komplex',
        },
        runId: 'a1-komplex',
    });
    // #endregion
    return list;
};

import { getAnalizis2PracticeQuestions as getAnalizis2Raw, ANALIZIS2_TOPIC_IDS } from './analizis2Levels';
export { ANALIZIS2_TOPIC_IDS };

export const getAnalizis2PracticeQuestions = (topicId: string): Question[] | null => {
    const list = getAnalizis2Raw(topicId);
    if (!list) return null;
    // #region agent log
    agentDebugLog({
        hypothesisId: 'C',
        location: 'practiceBanks.ts:getAnalizis2PracticeQuestions',
        message: 'analizis2 bank loaded',
        data: {
            topicId,
            total: list.length,
            byStage: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
            firstQ: String(list[0]?.question || '').slice(0, 60),
        },
        runId: 'a2-topics',
    });
    // #endregion
    return list;
};

import { getLinearisPracticeQuestions as getLinearisRaw, LINEARIS_TOPIC_IDS } from './linearisAlgebra';
export { LINEARIS_TOPIC_IDS };

export const getLinearisPracticeQuestions = (topicId: string): Question[] | null => {
    const list = getLinearisRaw(topicId);
    if (!list) return null;
    // #region agent log
    agentDebugLog({
        hypothesisId: 'C',
        location: 'practiceBanks.ts:getLinearisPracticeQuestions',
        message: 'linearis bank loaded',
        data: {
            topicId,
            total: list.length,
            byStage: [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length),
            firstQ: String(list[0]?.question || '').slice(0, 60),
        },
        runId: 'la-topics',
    });
    // #endregion
    return list;
};
