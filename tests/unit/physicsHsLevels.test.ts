import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { getPhysicsHsPracticeQuestions } from '../../utils/game/physicsHsLevels';
import { getWorksheetListForTopic } from '../../utils/game/worksheetLists';
import { isWorksheetTopicId } from '../../utils/topicPath';
import { findCatalogTopic } from '../../utils/topicStats';

function expectBank(topicId: string) {
    const list = getPhysicsHsPracticeQuestions(topicId) || [];
    assert.equal(list.length, 120);
    for (const stage of [1, 2, 3, 4, 5, 6]) {
        const level = list.filter((q) => q.stage === stage);
        assert.equal(level.length, 20, `${topicId} stage ${stage}`);
        assert.ok(level.every((q) => q.expression.length > 20));
    }
    return list;
}

describe('középiskolai fizika', () => {
    it('kinematika is six worked levels', () => {
        const list = expectBank('ph-kinematika');
        const text = list.map((q) => q.question).join('\n');
        assert.match(text, /egyenletes/i);
        assert.match(text, /szabadesés/i);
        assert.match(text, /körmozgás/i);
        const speed = list.find((q) => q.question.startsWith('Egyenletes mozgás: v = 5'));
        assert.equal(speed?.answer, 20);
        const kmh = list.find((q) => q.question.startsWith('72 km/h'));
        assert.equal(kmh?.answer, 20);
        const drop = list.find((q) => q.question.includes('h = 20 m'));
        assert.equal(drop?.answer, 2);
        const toss = list.find((q) => q.question.includes('v₀ = 20 m/s. Mekkora a legnagyobb magasság'));
        assert.equal(toss?.answer, 20);
    });

    it('dinamika is six worked levels', () => {
        const list = expectBank('ph-dinamika');
        const text = list.map((q) => q.question).join('\n');
        assert.match(text, /Newton/);
        assert.match(text, /súrlódás/i);
        assert.match(text, /lejtő/i);
        assert.match(text, /lendület/i);
        const force = list.find((q) => q.question.startsWith('m = 2 kg, a = 3'));
        assert.equal(force?.answer, 6);
        const weight = list.find((q) => q.question.startsWith('m = 2 kg, g = 10'));
        assert.equal(weight?.answer, 20);
        const friction = list.find((q) => q.question.includes('μ = 0,5. Mekkora a legnagyobb nyugalmi'));
        assert.equal(friction?.answer, 10);
        const incline = list.find((q) => q.question.startsWith('Súrlódásmentes 30°-os lejtő, g = 10'));
        assert.equal(incline?.answer, 5);
        const stick = list.find((q) => q.question.startsWith('Két 2 kg-os test'));
        assert.equal(stick?.answer, 2);
    });

    it('routes into the worksheet path and the catalog', () => {
        assert.equal(isWorksheetTopicId('ph-kinematika'), true);
        assert.equal(getWorksheetListForTopic('ph-dinamika')?.list.length, 120);
        assert.equal(findCatalogTopic('ph-kinematika', 'physics')?.title, 'Kinematika');
        assert.equal(findCatalogTopic('fizika-kozep', 'physics')?.title, 'Középiskolai fizika');
        assert.equal(getPhysicsHsPracticeQuestions('ph-energia'), null);
    });
});
