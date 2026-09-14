/**
 * Kiírja a honlap kész feladatbankjait az Expo app data/webBanks mappájába.
 * Futtatás a honlap gyökeréből: npx tsx scripts/export-app-banks.ts
 */
import fs from 'fs';
import path from 'path';

import { topicsForElemNatGrade, type ElemNatGrade } from '../utils/elemNatCatalog';
import {
    universitySubjects,
    highschoolGrade09Topics,
    highschoolGrade10Topics,
    highschoolGrade11Topics,
    highschoolGrade12Topics,
} from '../utils/mathTopicsCatalog';
import { getElemNatPracticeQuestions } from '../utils/game/elemNatBanks';
import { getHsTextbookPracticeQuestions } from '../utils/game/hsTextbookBanks';
import { getEgyszerusitesPracticeQuestions } from '../utils/game/egyszerusitesLevels';
import { getErtelmezesiPracticeQuestions } from '../utils/game/ertelmezesiLevels';
import { getExponentialLogPracticeQuestions } from '../utils/game/explogLevels';
import { getFunctionsPracticeQuestions } from '../utils/game/fuggvenyekLevels';
import { getGrafokPracticeQuestions } from '../utils/game/grafokLevels';
import { getSikgeometriaPracticeQuestions } from '../utils/game/sikgeometriaLevels';
import { getSorozatokPracticeQuestions } from '../utils/game/sorozatokLevels';
import { getStatisztikaPracticeQuestions } from '../utils/game/statisztikaLevels';
import { getSzamelmeletPracticeQuestions } from '../utils/game/szamelmeletLevels';
import { getSzovegesPracticeQuestions } from '../utils/game/szovegesLevels';
import { getTergeometriaPracticeQuestions } from '../utils/game/tergeometriaLevels';
import { getTrigonometriaPracticeQuestions } from '../utils/game/trigonometriaLevels';
import { getValoszinusegPracticeQuestions } from '../utils/game/valoszinusegLevels';
import { getAbsoluteRootPracticeQuestions } from '../utils/game/absrootLevels';
import { getProofPracticeQuestions } from '../utils/game/proofLevels';
import { getParameterPracticeQuestions } from '../utils/game/parameterLevels';
import { getAnalizis1PracticeQuestions } from '../utils/game/analizis1Levels';
import { getAnalizis2PracticeQuestions } from '../utils/game/analizis2Levels';
import { getLinearisPracticeQuestions } from '../utils/game/linearisAlgebra';
import { getDePracticeQuestions } from '../utils/game/deAlgebra';
import { getDmPracticeQuestions } from '../utils/game/dmAlgebra';
import { getStPracticeQuestions } from '../utils/game/stAlgebra';
import { ERETTSEGI_PAPERS, getErettsegiPaperQuestions } from '../utils/game/erettsegiPapers';
import { KOZPONTI_PAPERS, getKozpontiPaperQuestions } from '../utils/game/kozpontiPapers';
import { BME_VALSZAM_PAPERS, getBmeValszamPaperQuestions } from '../utils/game/bmeValszamPapers';
import type { Question } from '../utils/game/types';

const APP_ROOT = path.resolve(__dirname, '..', '..', '..', 'MihasznaMatekApp');
const OUT_DIR = path.join(APP_ROOT, 'data', 'webBanks');
const FIGURES_SRC = path.resolve(__dirname, '..', 'public');
const FIGURES_DST = path.join(APP_ROOT, 'assets', 'webFigures');

const POINTS = [0, 10, 20, 25, 30, 35, 40];

type AppQuestion = {
    id: string;
    question: string;
    answer: string;
    acceptedAnswers: string[];
    explanation: string;
    points: number;
    imageSrc?: string;
};

type StageBank = Record<string, AppQuestion[]>;

const imageSrcs = new Set<string>();
const banks: Record<string, Record<string, StageBank>> = {};
const catalog: Record<string, Array<Record<string, unknown>>> = {};

function pickImageSrc(q: Question): string | undefined {
    if (q.imageSrc) return q.imageSrc;
    const figs = [q.figure, ...(q.figures || [])].filter(Boolean);
    for (const fig of figs) {
        if (fig && fig.kind === 'image' && fig.src) return fig.src;
    }
    return undefined;
}

function toAppQuestion(q: Question, id: string, points: number): AppQuestion {
    const accepted = new Set<string>();
    if (Array.isArray(q.expectedSet) && q.expectedSet.length) {
        q.expectedSet.forEach((item) => accepted.add(String(item)));
        accepted.add(q.expectedSet.join(';'));
        accepted.add([...q.expectedSet].sort().join(';'));
        accepted.add(`{${q.expectedSet.join('; ')}}`);
    }
    const nums = [q.answer, q.alternativeAnswer, q.thirdAnswer, q.fourthAnswer].filter(
        (value) => value !== undefined && value !== null
    );
    for (const num of nums) {
        accepted.add(String(num));
        if (typeof num === 'number' && !Number.isInteger(num)) {
            accepted.add(String(num).replace('.', ','));
        }
    }
    if (!accepted.size) accepted.add(String(q.answer ?? ''));

    let question = String(q.question || '').trim();
    if (q.graph || q.figure || (q.figures && q.figures.length)) {
        const hasImage = Boolean(pickImageSrc(q));
        if (!hasImage) {
            question += '\n\n(Az ábra a honlapon látható; itt a szöveg alapján oldd meg.)';
        }
    }

    const imageSrc = pickImageSrc(q);
    if (imageSrc) imageSrcs.add(imageSrc);

    const answers = [...accepted];
    return {
        id,
        question,
        answer: answers[0],
        acceptedAnswers: answers,
        explanation: String(q.expression || ''),
        points,
        ...(imageSrc ? { imageSrc } : {}),
    };
}

function byStage(list: Question[], prefix: string): StageBank {
    const out: StageBank = { 1: [], 2: [], 3: [], 4: [], 5: [], 6: [] };
    list.forEach((q, index) => {
        const stage = Math.min(6, Math.max(1, Number(q.stage) || 1));
        const bucket = out[String(stage)];
        bucket.push(toAppQuestion(q, `${prefix}-l${stage}-${bucket.length + 1}`, POINTS[stage] || 20));
        if (!q.stage && index === 0 && list.every((item) => !item.stage)) {
            // handled below if no stages at all
        }
    });
    const staged = list.some((q) => q.stage);
    if (!staged) {
        return { 1: list.map((q, i) => toAppQuestion(q, `${prefix}-${i + 1}`, 20)) };
    }
    return out;
}

function put(levelId: string, topicId: string, list: Question[] | null | undefined) {
    if (!list?.length) return;
    if (!banks[levelId]) banks[levelId] = {};
    banks[levelId][topicId] = byStage(list, `${levelId}-${topicId}`);
}

function addCatalog(
    levelId: string,
    topics: Array<{
        id: string;
        name: string;
        description?: string;
        icon?: string;
        difficulty?: number;
        singleLesson?: boolean;
        redirectLevelId?: string;
    }>
) {
    catalog[levelId] = topics.map((topic) => ({
        id: topic.id,
        name: topic.name,
        description: topic.description || '',
        icon: topic.icon || 'book-outline',
        difficulty: topic.difficulty ?? 3,
        ...(topic.singleLesson ? { singleLesson: true } : {}),
        ...(topic.redirectLevelId ? { redirectLevelId: topic.redirectLevelId } : {}),
    }));
}

function uniGetter(topicId: string): Question[] | null {
    if (topicId.startsWith('a1-')) return getAnalizis1PracticeQuestions(topicId);
    if (topicId.startsWith('a2-')) return getAnalizis2PracticeQuestions(topicId);
    if (topicId.startsWith('la')) return getLinearisPracticeQuestions(topicId);
    if (topicId.startsWith('de') || topicId.startsWith('pde')) return getDePracticeQuestions(topicId);
    if (topicId.startsWith('dm') || topicId.startsWith('ge')) return getDmPracticeQuestions(topicId);
    if (topicId.startsWith('st')) return getStPracticeQuestions(topicId);
    return null;
}

const erettsegiGetters: Record<string, () => Question[]> = {
    simplification: getEgyszerusitesPracticeQuestions,
    func_analysis: getErtelmezesiPracticeQuestions,
    exp_log: getExponentialLogPracticeQuestions,
    calculus: getFunctionsPracticeQuestions,
    logic_graphs: getGrafokPracticeQuestions,
    plane_geo: getSikgeometriaPracticeQuestions,
    sequences: getSorozatokPracticeQuestions,
    statistics: getStatisztikaPracticeQuestions,
    number_theory: getSzamelmeletPracticeQuestions,
    text_problems: getSzovegesPracticeQuestions,
    solid_geo: getTergeometriaPracticeQuestions,
    trigonometry: getTrigonometriaPracticeQuestions,
    probability: getValoszinusegPracticeQuestions,
};

const advGetters: Record<string, () => Question[]> = {
    adv_abs_root: getAbsoluteRootPracticeQuestions,
    adv_proofs: getProofPracticeQuestions,
    adv_simplification: getEgyszerusitesPracticeQuestions,
    adv_func_analysis: getErtelmezesiPracticeQuestions,
    adv_exp_log: getExponentialLogPracticeQuestions,
    adv_calculus: getFunctionsPracticeQuestions,
    adv_sets: () => [], // filled from local preferred if any; web uses same halmaz bank
    adv_combinatorics: () => [],
    adv_param_equations: getParameterPracticeQuestions,
    adv_coord_geo: () => [],
    adv_logic_graphs: getGrafokPracticeQuestions,
    adv_plane_geo: getSikgeometriaPracticeQuestions,
    adv_sequences: getSorozatokPracticeQuestions,
    adv_statistics: getStatisztikaPracticeQuestions,
    adv_number_theory: getSzamelmeletPracticeQuestions,
    adv_text_problems: getSzovegesPracticeQuestions,
    adv_solid_geo: getTergeometriaPracticeQuestions,
    adv_trigonometry: getTrigonometriaPracticeQuestions,
    adv_probability: getValoszinusegPracticeQuestions,
};

import { getHalmazPracticeQuestions } from '../utils/game/halmazLevels';
import { getKombinatorikaPracticeQuestions } from '../utils/game/kombinatorikaLevels';
import { getKoordinatageometriaPracticeQuestions } from '../utils/game/koordinatageometriaLevels';

advGetters.adv_sets = getHalmazPracticeQuestions;
advGetters.adv_combinatorics = getKombinatorikaPracticeQuestions;
advGetters.adv_coord_geo = getKoordinatageometriaPracticeQuestions;

function writeJson(filePath: string, data: unknown) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
    fs.writeFileSync(filePath, JSON.stringify(data), 'utf8');
}

function copyFigures() {
    fs.mkdirSync(FIGURES_DST, { recursive: true });
    const copied: string[] = [];
    for (const src of imageSrcs) {
        const rel = src.startsWith('/') ? src.slice(1) : src;
        const from = path.join(FIGURES_SRC, rel);
        if (!fs.existsSync(from)) continue;
        const to = path.join(FIGURES_DST, rel.replace(/^figures[\\/]/, ''));
        fs.mkdirSync(path.dirname(to), { recursive: true });
        fs.copyFileSync(from, to);
        copied.push(rel);
    }
    const mapLines = ['const figures = {'];
    for (const rel of copied) {
        const key = '/' + rel.replace(/\\/g, '/');
        const asset = './' + rel.replace(/^figures[\\/]/, '').replace(/\\/g, '/');
        mapLines.push(`  ${JSON.stringify(key)}: require(${JSON.stringify(asset)}),`);
    }
    mapLines.push('};', '', 'export default figures;', '');
    fs.writeFileSync(path.join(FIGURES_DST, 'index.js'), mapLines.join('\n'), 'utf8');
    return copied.length;
}

function main() {
    if (!fs.existsSync(APP_ROOT)) {
        throw new Error(`App mappa nem található: ${APP_ROOT}`);
    }

    for (const [topicId, getter] of Object.entries(erettsegiGetters)) {
        put('matura_standard_topics', topicId, getter());
    }
    for (const [topicId, getter] of Object.entries(advGetters)) {
        put('matura_advanced_topics', topicId, getter());
    }

    for (const grade of [1, 2, 3, 4, 5, 6, 7, 8] as ElemNatGrade[]) {
        const levelId = `elementary_${grade}`;
        const topics = topicsForElemNatGrade(grade);
        addCatalog(
            levelId,
            topics.map((topic) => ({
                id: topic.id,
                name: topic.title,
                description: `${grade}. osztály · NAT`,
                icon: 'book-outline',
                difficulty: grade <= 4 ? 1 : 2,
            }))
        );
        for (const topic of topics) {
            put(levelId, topic.id, getElemNatPracticeQuestions(topic.id));
        }
    }

    const hsGroups: Array<[string, typeof highschoolGrade09Topics, number]> = [
        ['high_school_9', highschoolGrade09Topics, 2],
        ['high_school_10', highschoolGrade10Topics, 3],
        ['high_school_11', highschoolGrade11Topics, 4],
        ['high_school_12', highschoolGrade12Topics, 4],
    ];
    for (const [levelId, topics, difficulty] of hsGroups) {
        addCatalog(
            levelId,
            topics.map((topic) => ({
                id: topic.id,
                name: topic.title,
                description: 'NAT tankönyv fejezet',
                icon: 'library-outline',
                difficulty,
            }))
        );
        for (const topic of topics) {
            put(levelId, topic.id, getHsTextbookPracticeQuestions(topic.id));
        }
    }

    const uniSubjects = universitySubjects.filter((subject) => subject.id !== 'analizis3');
    addCatalog(
        'university',
        uniSubjects.map((subject) => ({
            id: subject.id,
            name: subject.title,
            description: `${subject.topics.length} témakör`,
            icon: 'ribbon-outline',
            difficulty: 4,
            redirectLevelId: `university_${subject.id}`,
        }))
    );

    for (const subject of uniSubjects) {
        const levelId = `university_${subject.id}`;
        if (subject.id === 'valszam') {
            addCatalog(
                levelId,
                BME_VALSZAM_PAPERS.filter((paper) => paper.ready).map((paper) => ({
                    id: paper.id,
                    name: paper.title,
                    description: paper.subtitle,
                    icon: 'dice-outline',
                    difficulty: 5,
                    singleLesson: true,
                }))
            );
            for (const paper of BME_VALSZAM_PAPERS.filter((item) => item.ready)) {
                put(levelId, paper.id, getBmeValszamPaperQuestions(paper.id));
            }
            continue;
        }
        addCatalog(
            levelId,
            subject.topics.map((topic) => ({
                id: topic.id,
                name: topic.title,
                description: subject.title,
                icon: 'analytics-outline',
                difficulty: 5,
            }))
        );
        for (const topic of subject.topics) {
            put(levelId, topic.id, uniGetter(topic.id));
        }
    }

    const kozepPapers = ERETTSEGI_PAPERS.filter((paper) => paper.ready && paper.level === 'kozep');
    const emeltPapers = ERETTSEGI_PAPERS.filter((paper) => paper.ready && paper.level === 'emelt');
    addCatalog(
        'matura_standard_exams',
        kozepPapers.map((paper) => ({
            id: paper.id,
            name: `${paper.year}. ${paper.title}`,
            description: paper.subtitle,
            icon: 'document-text-outline',
            difficulty: 3,
            singleLesson: true,
        }))
    );
    addCatalog(
        'matura_advanced_exams',
        emeltPapers.map((paper) => ({
            id: paper.id,
            name: `${paper.year}. ${paper.title} (emelt)`,
            description: paper.subtitle,
            icon: 'document-text-outline',
            difficulty: 5,
            singleLesson: true,
        }))
    );
    for (const paper of kozepPapers) {
        put('matura_standard_exams', paper.id, getErettsegiPaperQuestions(paper.id));
    }
    for (const paper of emeltPapers) {
        put('matura_advanced_exams', paper.id, getErettsegiPaperQuestions(paper.id));
    }

    const kfPapers = KOZPONTI_PAPERS.filter((paper) => paper.ready);
    addCatalog(
        'elementary_admission_exams',
        kfPapers.map((paper) => ({
            id: paper.id,
            name: paper.title,
            description: paper.subtitle,
            icon: 'document-text-outline',
            difficulty: 3,
            singleLesson: true,
        }))
    );
    for (const paper of kfPapers) {
        put('elementary_admission_exams', paper.id, getKozpontiPaperQuestions(paper.id));
    }

    fs.mkdirSync(OUT_DIR, { recursive: true });
    for (const file of fs.readdirSync(OUT_DIR)) {
        fs.rmSync(path.join(OUT_DIR, file), { recursive: true, force: true });
    }

    const levelIds = Object.keys(banks);
    for (const levelId of levelIds) {
        writeJson(path.join(OUT_DIR, `${levelId}.json`), banks[levelId]);
    }

    const indexLines = [
        'const loaders = {',
        ...levelIds.map((id) => `  ${JSON.stringify(id)}: () => require(${JSON.stringify(`./${id}.json`)}),`),
        '};',
        '',
        'const cache = {};',
        '',
        'function loadWebLevel(levelId) {',
        '  if (!loaders[levelId]) return null;',
        '  if (!cache[levelId]) cache[levelId] = loaders[levelId]();',
        '  return cache[levelId];',
        '}',
        '',
        'function listWebLevelIds() {',
        '  return Object.keys(loaders);',
        '}',
        '',
        'module.exports = { loadWebLevel, listWebLevelIds };',
        '',
    ];
    fs.writeFileSync(path.join(OUT_DIR, 'index.js'), indexLines.join('\n'), 'utf8');

    const catalogPath = path.join(APP_ROOT, 'data', 'webCatalog.js');
    fs.writeFileSync(
        catalogPath,
        `export const webCatalog = ${JSON.stringify(catalog, null, 2)};\n`,
        'utf8'
    );

    const copiedFigures = copyFigures();

    const topicCount = Object.values(banks).reduce((sum, level) => sum + Object.keys(level).length, 0);
    const questionCount = Object.values(banks).reduce(
        (sum, level) =>
            sum +
            Object.values(level).reduce(
                (inner, stages) => inner + Object.values(stages).reduce((n, list) => n + list.length, 0),
                0
            ),
        0
    );
    console.log(
        JSON.stringify(
            {
                appRoot: APP_ROOT,
                levels: levelIds.length,
                topics: topicCount,
                questions: questionCount,
                figures: copiedFigures,
                imagesReferenced: imageSrcs.size,
            },
            null,
            2
        )
    );
}

main();
