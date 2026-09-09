export type { Question } from './types';
export type { GraphFigure } from './graphFigure';
export type { DrawFigure, DrawPrimitive, QuestionFigure } from './questionFigure';
export { coordPlaneFigure, drawFigure, figuresOf, graphFigure, imageFigure } from './questionFigure';

export {
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
    getAnalizis1PracticeQuestions,
    ANALIZIS1_TOPIC_IDS,
    getAnalizis2PracticeQuestions,
    ANALIZIS2_TOPIC_IDS,
    getLinearisPracticeQuestions,
    LINEARIS_TOPIC_IDS,
    getDePracticeQuestions,
    DE_TOPIC_IDS,
    getDmPracticeQuestions,
    DM_TOPIC_IDS,
    getStPracticeQuestions,
    ST_TOPIC_IDS,
} from './practiceBanks';

export {
    generateQuadraticQuestion,
    generateDerivativeQuestion,
    generateTrigonometryQuestion,
    generateIntegralQuestion,
    generateGeometryQuestion,
    generateAlgebraQuestion,
} from './generateHelpers';

export { generateErettsegiQuestionByTopicId } from './generateErettsegi';
export { generateElementaryQuestionByTopic } from './generateElementary';
export { generateKozpontiQuestionByTopic } from './generateKozponti';
export {
    KOZPONTI_PAPERS,
    KOZPONTI_GRADES,
    getKozpontiPaperQuestions,
    getKozponti2026Mat1Questions,
    getKozponti2026FebQuestions,
    getKozponti2025JanQuestions,
    getKozponti2025FebQuestions,
    getKozponti2024JanQuestions,
    getKozponti2024FebQuestions,
    getKozponti2023JanQuestions,
    getKozponti2023FebQuestions,
    getKozponti2022JanQuestions,
    getKozponti2022FebQuestions,
    getKozponti2022MarQuestions,
    getKozponti2021JanQuestions,
    getKozpontiPapersForGrade,
    kozpontiPapersByYear,
} from './kozpontiPapers';
export type { KozpontiPaperMeta, KozpontiGrade, KozpontiMonth } from './kozpontiPapers';
export {
    ERETTSEGI_PAPERS,
    ERETTSEGI_YEARS,
    getErettsegiPaperQuestions,
    getErettsegiPapersForLevel,
    erettsegiPapersByYear,
} from './erettsegiPapers';
export type { ErettsegiPaperMeta, ErettsegiMonth, ErettsegiExamLevel } from './erettsegiPapers';
export { generateHighschoolQuestionByTopic } from './generateHighschool';
export { generateUniversityQuestionByTopic } from './generateUniversity';
export { getWorksheetListForTopic } from './worksheetLists';
export { pick, randBelow, randInt } from './random';
export {
    generatePointDistanceQuestion,
    generateArithmeticSequenceA5,
    generateSimpleMeanQuestion,
} from './generateHelpers';

export { szigorlatQuestions } from './szigorlatBank';
export {
    elementaryQuestions,
    highschoolQuestions,
    universityTopics,
    fallbackUniversityQuestions,
} from './staticQuestionBanks';
