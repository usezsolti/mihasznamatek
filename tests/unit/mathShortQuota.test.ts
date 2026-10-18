import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    DAILY_SHORT_LIMIT,
    DEFAULT_VIDEO_MODEL,
    budapestDayKey,
    pollinationsVideoUrl,
    quotaDecision,
    topicKey,
    videoModel,
    videoPromptFromScript,
} from '../../server/mathShortQuota';

describe('math short quota', () => {
    it('folds a topic so the same lesson cannot start twice', () => {
        assert.equal(topicKey('  Deriválás  '), topicKey('deriválás'));
        const first = quotaDecision([], 'Deriválás');
        assert.equal(first.ok, true);
        const again = quotaDecision([topicKey('Deriválás')], 'deriválás');
        assert.equal(again.ok, false);
        if (!again.ok) assert.equal(again.reason, 'duplicate');
    });

    it('stops at five different topics', () => {
        const used = ['a', 'b', 'c', 'd', 'e'];
        const full = quotaDecision(used, 'f');
        assert.equal(full.ok, false);
        if (!full.ok) assert.equal(full.reason, 'full');
        assert.equal(DAILY_SHORT_LIMIT, 5);
    });

    it('builds a keyless cheap video url', () => {
        assert.equal(videoModel(''), DEFAULT_VIDEO_MODEL);
        assert.equal(videoModel('bytedance/seedance-2.0-fast'), DEFAULT_VIDEO_MODEL);
        const url = pollinationsVideoUrl('tábla', DEFAULT_VIDEO_MODEL);
        assert.match(url, /^https:\/\/gen\.pollinations\.ai\/video\//);
        assert.match(url, /duration=4/);
        assert.match(url, /aspectRatio=9%3A16/);
        assert.doesNotMatch(url, /sk_|POLLINATIONS/);
        const prompt = videoPromptFromScript({
            topic: 'tört',
            title: 'Tört',
            hook: 'Oszd a számlálót.',
            body: 'A nevező marad.',
            tip: 'Egyszerűsíts.',
        });
        assert.match(prompt, /tört/);
        assert.ok(prompt.length <= 700);
    });

    it('uses the Budapest calendar day', () => {
        const key = budapestDayKey(new Date('2026-10-15T22:30:00.000Z'));
        assert.equal(key, '2026-10-16');
    });
});
