import { allElemNatCatalogTopics } from '../utils/elemNatCatalog';
import { getElemNatPracticeQuestions } from '../utils/game/elemNatBanks';
import { getWorksheetListForTopic } from '../utils/game/worksheetLists';

const topics = allElemNatCatalogTopics();
const errors: string[] = [];

for (const t of topics) {
    try {
        const list = getElemNatPracticeQuestions(t.id);
        if (!list) {
            errors.push(`${t.id}: null bank`);
            continue;
        }
        const stages = [1, 2, 3, 4, 5, 6].map((s) => list.filter((q) => q.stage === s).length);
        if (list.length !== 120 || stages.some((n) => n !== 20)) {
            errors.push(`${t.id}: ${list.length} cards stages=${stages.join(',')}`);
        }
        for (const q of list) {
            if (!Number.isFinite(q.answer)) errors.push(`${t.id}: bad answer ${q.question}`);
        }
        const ws = getWorksheetListForTopic(t.id);
        if (!ws || ws.list.length !== 120) errors.push(`${t.id}: worksheet miss`);
        if (ws && !ws.prefix.startsWith('el_')) errors.push(`${t.id}: bad prefix ${ws.prefix}`);
    } catch (e) {
        errors.push(`${t.id}: ${e instanceof Error ? e.message : e}`);
    }
}

console.log(
    JSON.stringify(
        {
            topics: topics.length,
            ok: errors.length === 0,
            errors: errors.slice(0, 30),
            sample: topics.slice(0, 3).map((t) => t.id),
        },
        null,
        2
    )
);

if (errors.length) process.exit(1);
