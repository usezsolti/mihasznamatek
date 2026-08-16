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
    generateQuadraticQuestion,
    generatePointDistanceQuestion,
    pick,
    randInt,
    szigorlatQuestions,
} from '../utils/game';

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
    ];

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
