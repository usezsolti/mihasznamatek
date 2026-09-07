/**
 * Clean architecture + DRY smoke.
 * Run: npm run smoke:clean
 */
import fs from 'fs';
import path from 'path';
import { ARCH_LAYERS, ARCH_PATHS } from '../lib/architecture';
import { createSocialStore, runSocialAction } from '../server/socialStore';
import {
    createBlankSocialProfile,
    normalizePostText,
    normalizeUsernameOrThrow,
} from '../utils/socialDomain';
import {
    getAbsoluteRootPracticeQuestions,
    getExponentialLogPracticeQuestions,
    getFunctionsPracticeQuestions,
    getParameterPracticeQuestions,
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
    getWorksheetListForTopic,
    generateUniversityQuestionByTopic,
    generateQuadraticQuestion,
    generatePointDistanceQuestion,
    pick,
    randInt,
    szigorlatQuestions,
} from '../utils/game';
import { resolveTopicProgressKey } from '../utils/practiceProgress';
import { universitySubjects } from '../utils/mathTopicsCatalog';

function logDebug(
    message: string,
    data: Record<string, unknown>,
    hypothesisId = 'SEC',
    runId = 'security-10'
) {
    const line =
        JSON.stringify({
            sessionId: 'c04d6a',
            runId,
            hypothesisId,
            location: 'scripts/smoke-clean.ts',
            message,
            data,
            timestamp: Date.now(),
        }) + '\n';
    fs.appendFileSync(path.join(process.cwd(), 'debug-c04d6a.log'), line, 'utf8');
}

/** Security hygiene static gates (H1–H5). */
function runSecurityHygieneChecks(): Record<string, unknown> {
    const root = process.cwd();
    const read = (rel: string) => fs.readFileSync(path.join(root, rel), 'utf8');

    // H1: client test-login must not embed a password literal
    const clientTestLogin = read('utils/testLogin.ts') + read('utils/testLoginShared.ts');
    const passwordInClient =
        /TEST_LOGIN_PASSWORD\s*=\s*['"][^'"]+['"]/.test(clientTestLogin) ||
        /teszt123456/.test(clientTestLogin) ||
        /oneTimePassword\s*=\s*['"]/.test(clientTestLogin);
    logDebug('H1 client password literal', { passwordInClient }, 'H1');

    // H2: gated endpoints 404 without flags (source contract)
    const ingest = read('pages/api/debug/ingest.ts');
    const diag = read('pages/api/backend/social-diag.ts');
    const rules = read('pages/api/backend/firestore-rules-text.ts');
    const health = read('pages/api/backend/health.ts');
    const gatesOk =
        /ALLOW_DEBUG_INGEST/.test(ingest) &&
        /Not found/.test(ingest) &&
        /ALLOW_SOCIAL_DIAG/.test(diag) &&
        /ALLOW_RULES_EXPORT/.test(rules) &&
        /ALLOW_HEALTH_DETAILS/.test(health);
    logDebug('H2 endpoint gates present', { gatesOk }, 'H2');

    // H3: firestore rules — no open counter/likeCount patches
    const fr = read('firestore.rules');
    const openCounters =
        /followerCount[\s\S]*hasOnly/.test(fr) ||
        /hasOnly\(\['likeCount'/.test(fr) ||
        /hasOnly\(\["likeCount"/.test(fr);
    const profileOwnerOnly = /match \/socialProfiles\/\{userId\}[\s\S]*?allow update: if isOwner\(userId\);/.test(
        fr
    );
    const mathShortsGated = /match \/mathShorts\/\{id\}[\s\S]*?allow create: if isAdmin\(\)/.test(fr);
    logDebug(
        'H3 firestore least privilege',
        { openCounters, profileOwnerOnly, mathShortsGated },
        'H3'
    );

    // H4: admin locked to designated email (no Gmail +alias wildcard)
    const adminSrc = read('utils/admin.ts');
    const adminFailClosed =
        /ADMIN_LOGIN_EMAIL/.test(adminSrc) &&
        /ADMIN_EMAILS\.includes\(e\)/.test(adminSrc) &&
        !/base\(e\) === base\(primary\)/.test(adminSrc) &&
        !/matches\('usezsolti/.test(adminSrc);
    const rulesSrc = read('firestore.rules');
    const rulesExactAdmin = /emailLower\(\) == 'usezsolti@gmail\.com'/.test(rulesSrc);
    const apiSec = read('utils/apiSecurity.ts');
    const noHardcodedServerKey = !/AIzaSy[A-Za-z0-9_-]+/.test(apiSec);
    const publicKeyModule = fs.existsSync(path.join(root, 'utils/firebasePublicConfig.ts'));
    logDebug(
        'H4 admin/api key hygiene',
        { adminFailClosed, rulesExactAdmin, noHardcodedServerKey, publicKeyModule },
        'H4'
    );

    // H5: password-relay gated
    const testLoginApi = read('pages/api/auth/test-login.ts');
    const relayGated =
        /ALLOW_TEST_PASSWORD_RELAY/.test(testLoginApi) &&
        /NODE_ENV !== 'production'/.test(testLoginApi);
    logDebug('H5 password-relay gated', { relayGated }, 'H5');

    const ok =
        !passwordInClient &&
        gatesOk &&
        !openCounters &&
        profileOwnerOnly &&
        mathShortsGated &&
        adminFailClosed &&
        rulesExactAdmin &&
        noHardcodedServerKey &&
        relayGated;

    if (!ok) {
        throw new Error(
            'security hygiene failed: ' +
                JSON.stringify({
                    passwordInClient,
                    gatesOk,
                    openCounters,
                    profileOwnerOnly,
                    mathShortsGated,
                    adminFailClosed,
                    rulesExactAdmin,
                    noHardcodedServerKey,
                    relayGated,
                })
        );
    }

    return {
        securityScoreTarget: 10,
        passwordInClient,
        gatesOk,
        openCounters,
        profileOwnerOnly,
        mathShortsGated,
        adminFailClosed,
        noHardcodedServerKey,
        relayGated,
    };
}

/** API konzisztencia (H-API1–5): egy kliens, envelope, nincs ad-hoc /api fetch. */
function runApiConsistencyChecks(): Record<string, unknown> {
    const root = process.cwd();
    const walk = (dir: string, acc: string[] = []): string[] => {
        for (const name of fs.readdirSync(dir)) {
            const p = path.join(dir, name);
            const st = fs.statSync(p);
            if (st.isDirectory()) {
                if (name === 'node_modules' || name === '.next' || name === 'api') continue;
                walk(p, acc);
            } else if (/\.(ts|tsx)$/.test(name)) acc.push(p);
        }
        return acc;
    };

    const scanRoots = ['pages', 'hooks', 'utils', 'components'].map((d) => path.join(root, d));
    const offenders: string[] = [];
    for (const base of scanRoots) {
        if (!fs.existsSync(base)) continue;
        for (const file of walk(base)) {
            const rel = path.relative(root, file).replace(/\\/g, '/');
            if (rel === 'utils/apiClient.ts') continue;
            if (rel.startsWith('pages/api/')) continue;
            const src = fs.readFileSync(file, 'utf8');
            if (/fetch\(\s*['"`]\/api\//.test(src)) offenders.push(rel);
        }
    }
    logDebug('H-API1 no ad-hoc /api fetch', { offenders }, 'API1');

    const apiClient = fs.readFileSync(path.join(root, 'utils/apiClient.ts'), 'utf8');
    const hasDomainHelpers =
        /export async function apiChatGemini/.test(apiClient) &&
        /export async function apiBackendSocial/.test(apiClient) &&
        /export async function apiEmailStatus/.test(apiClient) &&
        /export async function apiSendBookingEmail/.test(apiClient) &&
        /export async function apiGenerateMathQuestion/.test(apiClient);
    logDebug('H-API2 domain helpers', { hasDomainHelpers }, 'API2');

    const backendClient = fs.readFileSync(path.join(root, 'utils/backendClient.ts'), 'utf8');
    const backendUsesApiClient =
        /from ['"]\.\/apiClient['"]/.test(backendClient) &&
        !/fetch\(\s*['"`]\/api\//.test(backendClient);
    logDebug('H-API3 backendClient wraps apiClient', { backendUsesApiClient }, 'API3');

    const emailStatus = fs.readFileSync(path.join(root, 'pages/api/email-status.ts'), 'utf8');
    const rulesText = fs.readFileSync(path.join(root, 'pages/api/backend/firestore-rules-text.ts'), 'utf8');
    const bookingApi = fs.readFileSync(path.join(root, 'pages/api/send-booking-email.ts'), 'utf8');
    const envelopesOk =
        /sendOk\(/.test(emailStatus) &&
        /sendOk\(res, \{ rules \}\)/.test(rulesText) &&
        /sendOk\(/.test(bookingApi) &&
        /sendErr\(/.test(bookingApi);
    logDebug('H-API4 server envelopes', { envelopesOk }, 'API4');

    const parseHasData =
        /parseApiEnvelope/.test(apiClient) ||
        (/parseApiEnvelope/.test(fs.readFileSync(path.join(root, 'utils/apiEnvelope.ts'), 'utf8')) &&
            /from ['"]\.\/apiEnvelope['"]/.test(apiClient));
    logDebug('H-API5 parseEnvelope', { parseHasData }, 'API5');

    const ok =
        offenders.length === 0 &&
        hasDomainHelpers &&
        backendUsesApiClient &&
        envelopesOk &&
        parseHasData;

    if (!ok) {
        throw new Error(
            'api consistency failed: ' +
                JSON.stringify({
                    offenders,
                    hasDomainHelpers,
                    backendUsesApiClient,
                    envelopesOk,
                    parseHasData,
                })
        );
    }

    return {
        apiScoreTarget: 10,
        adHocApiFetch: offenders.length,
        hasDomainHelpers,
        backendUsesApiClient,
        envelopesOk,
    };
}

async function main() {
    process.env.SOCIAL_DATA_STORE = process.env.SOCIAL_DATA_STORE || 'local';

    const layerOk = ARCH_LAYERS.every((l) => (ARCH_PATHS[l] || []).length > 0);
    const requiredFiles = [
        'utils/socialDomain.ts',
        'utils/game/random.ts',
        'utils/apiClient.ts',
        'utils/apiEnvelope.ts',
        'utils/backendClient.ts',
        'server/socialStore.ts',
    ];
    const missing = requiredFiles.filter((f) => !fs.existsSync(path.join(process.cwd(), f)));
    if (missing.length) throw new Error('missing: ' + missing.join(', '));

    // Domain validators (shared by 3 social stacks)
    const blank = createBlankSocialProfile('dry-uid', { displayName: 'Dry Tester' });
    if (!blank.username) throw new Error('blank profile');
    const postText = normalizePostText('  hello dry  ');
    if (postText !== 'hello dry') throw new Error('normalizePostText');
    try {
        normalizeUsernameOrThrow('ab');
        throw new Error('username should fail');
    } catch (e: any) {
        if (!/3 karakter/i.test(String(e?.message || e))) throw e;
    }

    // Random helpers
    if (typeof randInt(1, 3) !== 'number') throw new Error('randInt');
    if (pick([1, 2, 3]) < 1) throw new Error('pick');
    if (!generateQuadraticQuestion().question) throw new Error('quadratic');
    if (!generatePointDistanceQuestion().question) throw new Error('distance');

    const banks = [
        getParameterPracticeQuestions(),
        getExponentialLogPracticeQuestions(),
        getAbsoluteRootPracticeQuestions(),
        getFunctionsPracticeQuestions(),
        getProofPracticeQuestions(),
        getEquationsPracticeQuestions(),
        getHalmazPracticeQuestions(),
        getKombinatorikaPracticeQuestions(),
        getKoordinatageometriaPracticeQuestions(),
        getGrafokPracticeQuestions(),
        getSorozatokPracticeQuestions(),
        getStatisztikaPracticeQuestions(),
        getSzamelmeletPracticeQuestions(),
        getSzovegesPracticeQuestions(),
        getTergeometriaPracticeQuestions(),
        getTrigonometriaPracticeQuestions(),
        getValoszinusegPracticeQuestions(),
        getEgyszerusitesPracticeQuestions(),
        getErtelmezesiPracticeQuestions(),
        getSikgeometriaPracticeQuestions(),
        ...ANALIZIS1_TOPIC_IDS.map((id) => getAnalizis1PracticeQuestions(id) || []),
        ...ANALIZIS2_TOPIC_IDS.map((id) => getAnalizis2PracticeQuestions(id) || []),
        ...LINEARIS_TOPIC_IDS.map((id) => getLinearisPracticeQuestions(id) || []),
        ...DE_TOPIC_IDS.map((id) => getDePracticeQuestions(id) || []),
        ...DM_TOPIC_IDS.map((id) => getDmPracticeQuestions(id) || []),
        ...ST_TOPIC_IDS.map((id) => getStPracticeQuestions(id) || []),
    ];

    if (DE_TOPIC_IDS.length !== 36) throw new Error(`DE_TOPIC_IDS length ${DE_TOPIC_IDS.length}`);
    const catalogDeIds = universitySubjects
        .filter((s) => /^de[1-4]$|^pde[12]$/.test(s.id))
        .flatMap((s) => s.topics.map((t) => t.id));
    if (catalogDeIds.join(',') !== DE_TOPIC_IDS.join(',')) {
        throw new Error('catalog DE/PDE ids mismatch banks');
    }
    const deWs = getWorksheetListForTopic('de1-alapok');
    const pdeWs = getWorksheetListForTopic('pde1-osztaly');
    const eqWs = getWorksheetListForTopic('egyenletek');
    const deKey = resolveTopicProgressKey('de1-alapok');
    const eqKey = resolveTopicProgressKey('egyenletek');
    if (!deWs || deWs.prefix !== 'uni_de1-alapok') throw new Error('de1-alapok prefix ' + deWs?.prefix);
    if (!pdeWs || pdeWs.prefix !== 'uni_pde1-osztaly') throw new Error('pde1-osztaly prefix ' + pdeWs?.prefix);
    if (eqWs?.prefix !== 'erettsegi_egyenletek') throw new Error('egyenletek prefix ' + eqWs?.prefix);
    if (deKey !== null) throw new Error('de progress key ' + deKey);
    if (eqKey !== 'egyenletek') throw new Error('eq progress key ' + eqKey);
    const deQ = generateUniversityQuestionByTopic('de1', 'de1-alapok');
    logDebug(
        'de/pde routing',
        {
            n: DE_TOPIC_IDS.length,
            dePrefix: deWs.prefix,
            pdePrefix: pdeWs.prefix,
            eqPrefix: eqWs?.prefix,
            firstQ: String(deWs.list[0]?.question || '').slice(0, 70),
            firstAnswer: deWs.list[0]?.answer,
            deKey,
            eqKey,
            genFirst: String(deQ?.question || '').slice(0, 40),
            usedStub: false,
        },
        'A',
        'de-topics'
    );

    if (DM_TOPIC_IDS.length !== 30) throw new Error(`DM_TOPIC_IDS length ${DM_TOPIC_IDS.length}`);
    const catalogDmIds = universitySubjects
        .filter((s) => /^dm[1-3]$|^ge[12]$/.test(s.id))
        .flatMap((s) => s.topics.map((t) => t.id));
    if (catalogDmIds.join(',') !== DM_TOPIC_IDS.join(',')) {
        throw new Error('catalog DM/GE ids mismatch banks');
    }
    const dmWs = getWorksheetListForTopic('dm1-osszeadas');
    const geWs = getWorksheetListForTopic('ge1-alapok');
    const kombWs = getWorksheetListForTopic('kombinatorika');
    const grafWs = getWorksheetListForTopic('logika-grafok');
    const dmKey = resolveTopicProgressKey('dm1-osszeadas');
    const geKey = resolveTopicProgressKey('ge1-alapok');
    const kombKey = resolveTopicProgressKey('kombinatorika');
    const grafKey = resolveTopicProgressKey('logika-grafok');
    const stealIds = DM_TOPIC_IDS.filter(
        (id) =>
            id.includes('kombinatorika') ||
            id.includes('grafok') ||
            id.includes('sorozat') ||
            id.includes('halmaz') ||
            id.includes('fuggveny') ||
            id.includes('bizonyitas') ||
            id.includes('valoszinuseg')
    );
    if (stealIds.length) throw new Error('DM ids steal érettségi: ' + stealIds.join(','));
    if (!dmWs || dmWs.prefix !== 'uni_dm1-osszeadas') throw new Error('dm1-osszeadas prefix ' + dmWs?.prefix);
    if (!geWs || geWs.prefix !== 'uni_ge1-alapok') throw new Error('ge1-alapok prefix ' + geWs?.prefix);
    if (kombWs?.prefix !== 'erettsegi_kombinatorika') throw new Error('kombinatorika prefix ' + kombWs?.prefix);
    if (grafWs?.prefix !== 'erettsegi_grafok') throw new Error('grafok prefix ' + grafWs?.prefix);
    if (dmKey !== null) throw new Error('dm progress key ' + dmKey);
    if (geKey !== null) throw new Error('ge progress key ' + geKey);
    if (kombKey !== 'kombinatorika') throw new Error('komb progress key ' + kombKey);
    if (grafKey !== 'grafok') throw new Error('graf progress key ' + grafKey);
    const dmQ = generateUniversityQuestionByTopic('dm1', 'dm1-osszeadas');
    logDebug(
        'dm/ge routing',
        {
            n: DM_TOPIC_IDS.length,
            dmPrefix: dmWs.prefix,
            gePrefix: geWs.prefix,
            kombPrefix: kombWs?.prefix,
            grafPrefix: grafWs?.prefix,
            firstQ: String(dmWs.list[0]?.question || '').slice(0, 70),
            firstAnswer: dmWs.list[0]?.answer,
            dmKey,
            geKey,
            kombKey,
            grafKey,
            stealIds,
            genFirst: String(dmQ?.question || '').slice(0, 40),
            usedStub: false,
        },
        'A',
        'dm-topics'
    );

    if (ST_TOPIC_IDS.length !== 18) throw new Error(`ST_TOPIC_IDS length ${ST_TOPIC_IDS.length}`);
    const catalogStIds = universitySubjects
        .filter((s) => /^st[1-3]$/.test(s.id))
        .flatMap((s) => s.topics.map((t) => t.id));
    if (catalogStIds.join(',') !== ST_TOPIC_IDS.join(',')) {
        throw new Error('catalog ST ids mismatch banks');
    }
    const stWs = getWorksheetListForTopic('st1-alapok');
    const st3Ws = getWorksheetListForTopic('st3-halado');
    const statWs = getWorksheetListForTopic('statisztika');
    const valoWs = getWorksheetListForTopic('valoszinusegszamitas');
    const stKey = resolveTopicProgressKey('st1-alapok');
    const statKey = resolveTopicProgressKey('statisztika');
    const valoKey = resolveTopicProgressKey('valoszinusegszamitas');
    const stealStIds = ST_TOPIC_IDS.filter(
        (id) =>
            id.includes('statisztika') ||
            id.includes('valoszinuseg') ||
            id.includes('sorozat') ||
            id.includes('fuggveny') ||
            id.includes('exponencialis') ||
            id.includes('paramet')
    );
    if (stealStIds.length) throw new Error('ST ids steal érettségi: ' + stealStIds.join(','));
    if (!stWs || stWs.prefix !== 'uni_st1-alapok') throw new Error('st1-alapok prefix ' + stWs?.prefix);
    if (!st3Ws || st3Ws.prefix !== 'uni_st3-halado') throw new Error('st3-halado prefix ' + st3Ws?.prefix);
    if (statWs?.prefix !== 'erettsegi_statisztika') throw new Error('statisztika prefix ' + statWs?.prefix);
    if (valoWs?.prefix !== 'erettsegi_valoszinuseg') throw new Error('valoszinuseg prefix ' + valoWs?.prefix);
    if (stKey !== null) throw new Error('st progress key ' + stKey);
    if (statKey !== 'statisztika') throw new Error('stat progress key ' + statKey);
    if (valoKey !== 'valoszinuseg') throw new Error('valo progress key ' + valoKey);
    const stQ = generateUniversityQuestionByTopic('st1', 'st1-alapok');
    logDebug(
        'st routing',
        {
            n: ST_TOPIC_IDS.length,
            stPrefix: stWs.prefix,
            st3Prefix: st3Ws.prefix,
            statPrefix: statWs?.prefix,
            valoPrefix: valoWs?.prefix,
            firstQ: String(stWs.list[0]?.question || '').slice(0, 70),
            firstAnswer: stWs.list[0]?.answer,
            stKey,
            statKey,
            valoKey,
            stealStIds,
            genFirst: String(stQ?.question || '').slice(0, 40),
            usedStub: false,
            collidedStatisztika: 'st1-alapok'.includes('statisztika'),
            collidedValoszinuseg: 'st1-alapok'.includes('valoszinuseg'),
        },
        'A',
        'st-topics'
    );

    const store = createSocialStore('smoke');
    const dbPath = path.join(process.cwd(), 'data', 'social-local.json');
    const hadDb = fs.existsSync(dbPath);
    const dbBackup = hadDb ? fs.readFileSync(dbPath, 'utf8') : null;
    let profileOk = false;
    let feedN = -1;
    let postOk = false;
    try {
        const created = await runSocialAction(store, 'ensureProfile', 'dry-uid', { name: 'Dry Tester' });
        const feed = await runSocialAction(store, 'listFeed', 'dry-uid', { limit: 3 });
        const post = await runSocialAction(store, 'createPost', 'dry-uid', { text: 'DRY smoke post' });
        profileOk = !!(created.data as any)?.username;
        feedN = Array.isArray(feed.data) ? feed.data.length : -1;
        postOk = !!(post.data as any)?.text;
    } finally {
        if (dbBackup != null) fs.writeFileSync(dbPath, dbBackup);
        else if (fs.existsSync(dbPath)) {
            fs.writeFileSync(
                dbPath,
                '{"profiles":{},"posts":[],"likes":{},"comments":{},"follows":[],"groups":[],"conversations":{}}\n'
            );
        }
    }

    const gameLines = fs.readFileSync(path.join(process.cwd(), 'pages/game.tsx'), 'utf8').split(/\r?\n/).length;
    if (gameLines > 600) throw new Error(`game.tsx too large for SRP: ${gameLines}`);

    const gameComponents = [
        'components/game/GameLobby.tsx',
        'components/game/GameQuestionCard.tsx',
        'components/game/GamePlayHud.tsx',
        'components/game/GamePathBackButton.tsx',
        'components/game/GameLoading.tsx',
        'hooks/useGamePlay.ts',
        'hooks/useGameSessionBuilders.ts',
        'hooks/useGameRouteBootstrap.ts',
        'hooks/useGameAuth.ts',
    ];
    const missingGame = gameComponents.filter((f) => !fs.existsSync(path.join(process.cwd(), f)));
    if (missingGame.length) throw new Error('missing game SRP: ' + missingGame.join(', '));

    const security = runSecurityHygieneChecks();
    const apiConsistency = runApiConsistencyChecks();

    const result = {
        ok: true,
        dryScoreTarget: 10,
        srpScoreTarget: 10,
        layerOk,
        banks: banks.map((b) => b.length),
        szigorlatN: szigorlatQuestions.length,
        profileOk,
        feedN,
        postOk,
        socialDomain: true,
        randomHelpers: true,
        namingScoreTarget: 10,
        ...security,
        ...apiConsistency,
        renamedModules: [
            'GameLobby',
            'GamePlayHud',
            'useGameSessionBuilders',
            'useGameRouteBootstrap',
            'GameSessionBridge',
            'CommunityPostCard',
            'CommunityAvatar',
        ],
        gameLines,
    };
    logDebug('api consistency smoke', result, 'API', 'api-10');
    console.log(JSON.stringify(result));
}

main().catch((e) => {
    console.error(e);
    process.exit(1);
});
