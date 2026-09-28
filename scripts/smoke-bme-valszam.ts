import { universitySubjects } from '../utils/mathTopicsCatalog';
import {
    BME_VALSZAM_PAPERS,
    getBmeValszamPaperQuestions,
    logBmeValszamCatalog,
} from '../utils/game/bmeValszamPapers';
import { generateUniversityQuestionByTopic } from '../utils/game/generateUniversity';
import { agentDebugLog } from '../utils/agentDebugLog';

logBmeValszamCatalog();

const valszam = universitySubjects.find((s) => s.id === 'valszam');
const ids = universitySubjects.map((s) => s.id);
const q1 = getBmeValszamPaperQuestions('valszam-bme-gyak1');
const q9 = getBmeValszamPaperQuestions('valszam-bme-gyak9');
const q10 = getBmeValszamPaperQuestions('valszam-bme-gyak10');
const q5 = getBmeValszamPaperQuestions('valszam-bme-gyak5');
const q12 = getBmeValszamPaperQuestions('valszam-bme-gyak12');
const picked = generateUniversityQuestionByTopic('valszam', 'valszam-bme-gyak2');
const derivLeak = generateUniversityQuestionByTopic('valszam', 'valszam-bme');

agentDebugLog({
    hypothesisId: 'H30',
    location: 'scripts/smoke-bme-valszam.ts',
    message: 'BME valszam catalog smoke',
    data: {
        hasSubject: Boolean(valszam),
        subjectTopics: valszam?.topics.map((t) => t.id) || [],
        subjectIndex: ids.indexOf('valszam'),
        paperN: BME_VALSZAM_PAPERS.length,
        ready: BME_VALSZAM_PAPERS.filter((p) => p.ready).map((p) => `${p.id}:${p.questionCount}`),
        gyak1: q1?.length || 0,
        gyak1first: q1?.[0]?.id || null,
        gyak9: q9?.length || 0,
        gyak10: q10?.length || 0,
        same9and10: q9?.[0]?.id === q10?.[0]?.id,
        gyak5: q5?.length || 0,
        gyak5first: q5?.[0]?.id || null,
        gyak12: q12?.length || 0,
        gyak12first: q12?.[0]?.id || null,
        gyak12last: q12?.[q12 && q12.length ? q12.length - 1 : 0]?.id || null,
        notReady: BME_VALSZAM_PAPERS.filter((p) => !p.ready).map((p) => p.id),
        pickedId: picked?.id || null,
        hubPickedId: derivLeak?.id || null,
        hubIsDerivativeStub: String(derivLeak?.question || '').includes('dy/dx') || String(derivLeak?.question || '').includes("f'"),
        routedValoszinuseg: BME_VALSZAM_PAPERS.some((p) => p.id.includes('valoszinuseg')),
    },
    runId: 'bme-valszam',
});

console.log(JSON.stringify({
    hasSubject: Boolean(valszam),
    topics: valszam?.topics.map((t) => t.id),
    papers: BME_VALSZAM_PAPERS.map((p) => ({ id: p.id, ready: p.ready, n: p.questionCount })),
    picked: picked?.id,
    hub: derivLeak?.id,
}, null, 2));
