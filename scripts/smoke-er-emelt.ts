import fs from 'fs';
import path from 'path';
import {
    ERETTSEGI_PAPERS,
    getErettsegiPaperQuestions,
    getErettsegiPapersForLevel,
} from '../utils/game/erettsegiPapers';
import { getErettsegi2026MajKozepQuestions } from '../utils/game/er2026MajKozepBank';
import { getErettsegi2025MajKozepQuestions } from '../utils/game/er2025MajKozepBank';
import { getErettsegi2025OktKozepQuestions } from '../utils/game/er2025OktKozepBank';
import { getErettsegi2024MajKozepQuestions } from '../utils/game/er2024MajKozepBank';
import { getErettsegi2024OktKozepQuestions } from '../utils/game/er2024OktKozepBank';
import { getErettsegi2023MajKozepQuestions } from '../utils/game/er2023MajKozepBank';
import { getErettsegi2023OktKozepQuestions } from '../utils/game/er2023OktKozepBank';
import { getErettsegi2022MajKozepQuestions } from '../utils/game/er2022MajKozepBank';
import { getErettsegi2022OktKozepQuestions } from '../utils/game/er2022OktKozepBank';
import { getErettsegi2021MajKozepQuestions } from '../utils/game/er2021MajKozepBank';
import { getErettsegi2021OktKozepQuestions } from '../utils/game/er2021OktKozepBank';
import { getErettsegi2020MajKozepQuestions } from '../utils/game/er2020MajKozepBank';
import { getErettsegi2020OktKozepQuestions } from '../utils/game/er2020OktKozepBank';
import { agentDebugLog } from '../utils/agentDebugLog';

const EXPECTED: Array<{ id: string; count: number; alias: string }> = [
    { id: 'er-2026-maj-emelt', count: 21, alias: 'e2513' },
    { id: 'er-2025-okt-emelt', count: 25, alias: 'e2412' },
    { id: 'er-2025-maj-emelt', count: 25, alias: 'e2512' },
    { id: 'er-2024-okt-emelt', count: 23, alias: 'e2413' },
    { id: 'er-2024-maj-emelt', count: 25, alias: 'e2411' },
    { id: 'er-2023-okt-emelt', count: 22, alias: 'e2311' },
    { id: 'er-2023-maj-emelt', count: 22, alias: 'e2313' },
    { id: 'er-2022-okt-emelt', count: 19, alias: 'e2212' },
    { id: 'er-2022-maj-emelt', count: 20, alias: 'e2213' },
    { id: 'er-2021-okt-emelt', count: 20, alias: 'e2113' },
    { id: 'er-2021-maj-emelt', count: 18, alias: 'e2112' },
    { id: 'er-2020-okt-emelt', count: 20, alias: 'e2013' },
    { id: 'er-2020-maj-emelt', count: 22, alias: 'e2011' },
];

const emeltPapers = getErettsegiPapersForLevel('emelt');
const loaded = EXPECTED.map((p) => {
    const qs = getErettsegiPaperQuestions(p.id);
    const viaAlias = getErettsegiPaperQuestions(p.alias);
    const meta = emeltPapers.find((x) => x.id === p.id);
    return {
        id: p.id,
        expected: p.count,
        got: qs?.length || 0,
        firstId: qs?.[0]?.id || null,
        lastId: qs?.[qs && qs.length ? qs.length - 1 : 0]?.id || null,
        aliasOk: (viaAlias?.length || 0) === (qs?.length || 0) && Boolean(qs?.length),
        catalogReady: Boolean(meta?.ready),
        catalogCount: meta?.questionCount || 0,
        timeLimitMin: meta?.timeLimitMin || 0,
        prefixes: [...new Set((qs || []).map((q) => q.id.split('-')[0]))],
    };
});

const kozepIds = new Set(
    [
        ...getErettsegi2026MajKozepQuestions(),
        ...getErettsegi2025MajKozepQuestions(),
        ...getErettsegi2025OktKozepQuestions(),
        ...getErettsegi2024MajKozepQuestions(),
        ...getErettsegi2024OktKozepQuestions(),
        ...getErettsegi2023MajKozepQuestions(),
        ...getErettsegi2023OktKozepQuestions(),
        ...getErettsegi2022MajKozepQuestions(),
        ...getErettsegi2022OktKozepQuestions(),
        ...getErettsegi2021MajKozepQuestions(),
        ...getErettsegi2021OktKozepQuestions(),
        ...getErettsegi2020MajKozepQuestions(),
        ...getErettsegi2020OktKozepQuestions(),
    ].map((q) => q.id)
);

const emeltIds = EXPECTED.flatMap((p) => (getErettsegiPaperQuestions(p.id) || []).map((q) => q.id));
const collisions = emeltIds.filter((id) => kozepIds.has(id));
const okt26 = emeltPapers.find((p) => p.id === 'er-2026-okt-emelt');
const countMismatch = loaded.filter((p) => p.got !== p.expected || p.catalogCount !== p.expected);
const notReady = loaded.filter((p) => !p.catalogReady || p.got === 0);
const badPrefix = loaded.filter((p) => p.prefixes.some((x) => !/^er\d{2}(e|me|oe)$/.test(x)));
const lookupNull = getErettsegiPaperQuestions('er-2026-okt-emelt');
const missingFigs: string[] = [];
for (const p of EXPECTED) {
    const qs = getErettsegiPaperQuestions(p.id) || [];
    for (const q of qs) {
        const figs = [
            q.figure,
            ...(q.figures || []),
        ].filter((f): f is { kind: string; src?: string } => Boolean(f));
        for (const f of figs) {
            if (f.kind !== 'image' || !f.src) continue;
            const rel = f.src.replace(/^\//, '');
            if (!fs.existsSync(path.join(process.cwd(), 'public', rel))) missingFigs.push(`${p.id}:${q.id}:${f.src}`);
        }
    }
}

agentDebugLog({
    hypothesisId: 'H50',
    location: 'scripts/smoke-er-emelt.ts',
    message: 'emelt catalog ready',
    data: {
        readyIds: loaded.filter((p) => p.catalogReady).map((p) => p.id),
        readyN: loaded.filter((p) => p.catalogReady).length,
        okt26Ready: Boolean(okt26?.ready),
        time240: loaded.every((p) => p.timeLimitMin === 240),
    },
    runId: 'er-emelt-batch',
});
agentDebugLog({
    hypothesisId: 'H51',
    location: 'scripts/smoke-er-emelt.ts',
    message: 'emelt getters vs lookup',
    data: {
        loaded: loaded.map((p) => ({ id: p.id, got: p.got, aliasOk: p.aliasOk })),
        lookupNullOkt26: lookupNull === null,
        countMismatch: countMismatch.map((p) => p.id),
        notReady: notReady.map((p) => p.id),
    },
    runId: 'er-emelt-batch',
});
agentDebugLog({
    hypothesisId: 'H54',
    location: 'scripts/smoke-er-emelt.ts',
    message: 'emelt figure files on disk',
    data: { missingN: missingFigs.length, missingFigs: missingFigs.slice(0, 20) },
    runId: 'er-emelt-batch',
});
agentDebugLog({
    hypothesisId: 'H53',
    location: 'scripts/smoke-er-emelt.ts',
    message: 'emelt vs kozep prefix collision',
    data: {
        collisions,
        emeltN: emeltIds.length,
        kozepN: kozepIds.size,
        badPrefix: badPrefix.map((p) => ({ id: p.id, prefixes: p.prefixes })),
        catalogEmeltReady: ERETTSEGI_PAPERS.filter((p) => p.level === 'emelt' && p.ready).length,
    },
    runId: 'er-emelt-batch',
});

const summary = {
    loaded,
    collisions,
    okt26Ready: Boolean(okt26?.ready),
    okt26Lookup: lookupNull === null,
    countMismatch: countMismatch.map((p) => p.id),
    notReady: notReady.map((p) => p.id),
    badPrefix: badPrefix.map((p) => p.prefixes),
    missingFigs,
};
console.log(JSON.stringify(summary, null, 2));
if (collisions.length || countMismatch.length || notReady.length || badPrefix.length || missingFigs.length) {
    process.exitCode = 1;
}
