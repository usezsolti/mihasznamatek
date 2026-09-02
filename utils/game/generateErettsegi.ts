import type { Question } from './types';
import {
    getParameterPracticeQuestions,
    getExponentialLogPracticeQuestions,
    getAbsoluteRootPracticeQuestions,
    getFunctionsPracticeQuestions,
    getProofPracticeQuestions,
    getEquationsPracticeQuestions,
    getHalmazPracticeQuestions,
    getKombinatorikaPracticeQuestions,
    getKoordinatageometriaPracticeQuestions,
    getGrafokPracticeQuestions,
    getSorozatokPracticeQuestions,
    getStatisztikaPracticeQuestions,
    getSzamelmeletPracticeQuestions,
    getSzovegesPracticeQuestions,
    getTergeometriaPracticeQuestions,
    getTrigonometriaPracticeQuestions,
    getValoszinusegPracticeQuestions,
    getEgyszerusitesPracticeQuestions,
    getErtelmezesiPracticeQuestions,
    getSikgeometriaPracticeQuestions,
} from './practiceBanks';
import {
    generateAlgebraQuestion,
} from './generateHelpers';

export const generateErettsegiQuestionByTopicId = (topicId: string, level: string): Question | null => {
    // Érettségi témakör ID alapján feladat generálása
    const topicIdLower = topicId.toLowerCase();

    // Abszolútérték, gyök — munkalap feladatok
    if (topicIdLower.includes('abszolutertek') || topicIdLower.includes('gyok')) {
        const list = getAbsoluteRootPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Egyenletek, egyenlőtlenségek — 6×20 bank
    else if (topicIdLower.includes('egyenletek') || topicIdLower.includes('egyenlotlenseg')) {
        const list = getEquationsPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Egyszerűsítések, átalakítások — 6×20 bank
    else if (topicIdLower.includes('egyszerusites') || topicIdLower.includes('atalakitas')) {
        const list = getEgyszerusitesPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Exponenciális és logaritmusos — munkalap feladatok
    else if (topicIdLower.includes('exponencialis') || topicIdLower.includes('logaritmus')) {
        const list = getExponentialLogPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Függvények, analízis — munkalap feladatok
    else if (topicIdLower.includes('fuggvenyek-analizis')) {
        const list = getFunctionsPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Halmazok — 6×20 bank
    else if (topicIdLower.includes('halmaz')) {
        const list = getHalmazPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Kombinatorika — 6×20 bank
    else if (topicIdLower.includes('kombinatorika')) {
        const list = getKombinatorikaPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Koordinátageometria — 6×20 bank
    else if (topicIdLower.includes('koordinatageometria') || topicIdLower.includes('koordinata')) {
        const list = getKoordinatageometriaPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Síkgeometria — 6×20 bank (ne használj includes('sik') — túl tág)
    else if (topicIdLower.includes('sikgeometria')) {
        const list = getSikgeometriaPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Sorozatok — 6×20 bank
    else if (topicIdLower.includes('sorozat')) {
        const list = getSorozatokPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Statisztika — 6×20 bank
    else if (topicIdLower.includes('statisztika')) {
        const list = getStatisztikaPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Számelmélet — 6×20 bank
    else if (topicIdLower.includes('szamelmelet')) {
        const list = getSzamelmeletPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Szöveges feladatok — 6×20 bank
    else if (topicIdLower.includes('szoveges')) {
        const list = getSzovegesPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Paraméter — ELŐBB, mert a "parameter" id tartalmazza a "ter" szócskát
    else if (topicIdLower.includes('parameter') || topicIdLower.includes('paramet')) {
        const list = getParameterPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Térgeometria — 6×20 bank (ne használj includes('ter') — elkapná a parameter témát is!)
    else if (topicIdLower.includes('tergeometria')) {
        const list = getTergeometriaPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Trigonometria — 6×20 bank
    else if (topicIdLower.includes('trigonometria')) {
        const list = getTrigonometriaPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Valószínűségszámítás — 6×20 bank
    else if (topicIdLower.includes('valoszinuseg')) {
        const list = getValoszinusegPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Bizonyítások — munkalap feladatok
    else if (topicIdLower.includes('bizonyitas')) {
        const list = getProofPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Logika, gráfok — 6×20 bank
    else if (topicIdLower.includes('logika') || topicIdLower.includes('grafok') || topicIdLower.includes('graf')) {
        const list = getGrafokPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }
    // Értelmezési tartomány, értékkészlet — 6×20 bank
    else if (topicIdLower.includes('ertelmezesi') || topicIdLower.includes('tartomany') || topicIdLower.includes('ertekkeszlet')) {
        const list = getErtelmezesiPracticeQuestions();
        return list[Math.floor(Math.random() * list.length)];
    }

    // Alapértelmezett
    return generateAlgebraQuestion();
};
