import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { classifyBookingMailIntent } from '../../utils/bookingMailIntent';
import {
    parseChoiceFromOffers,
    parseStudentWindow,
    shouldOfferPackedInsteadOfRequested,
    suggestPackedSlots,
    type DaySlots,
} from '../../utils/bookingPackedSlots';

const mon: DaySlots = {
    dateKey: '2026-09-14',
    weekdayHu: 'hétfő',
    freeSlots: ['12:00', '13:00'],
    takenSlots: [],
};

const thu: DaySlots = {
    dateKey: '2026-09-17',
    weekdayHu: 'csütörtök',
    freeSlots: ['15:00', '17:00', '18:00'],
    takenSlots: ['16:00'],
};

describe('booking mail intent', () => {
    it('treats appointment requests as booking', () => {
        assert.equal(
            classifyBookingMailIntent({
                subject: 'Óra',
                text: 'Szia, szeretnék matekórát foglalni.',
                fromEmail: 'anna@pelda.hu',
            }),
            'booking'
        );
    });

    it('ignores newsletters', () => {
        assert.equal(
            classifyBookingMailIntent({
                subject: 'Newsletter',
                text: 'Unsubscribe here',
                fromEmail: 'noreply@shop.hu',
            }),
            'ignore'
        );
    });

    it('ignores casual mail even if it mentions Zsolt or a weekday', () => {
        assert.equal(
            classifyBookingMailIntent({
                subject: 'Szia Zsolt',
                text: 'Hétfőn találkozunk a családdal. Köszi!',
                fromEmail: 'anna@pelda.hu',
                knownCustomer: true,
            }),
            'ignore'
        );
    });

    it('ignores a thanks-only reply in an agent thread', () => {
        assert.equal(
            classifyBookingMailIntent({
                subject: 'Re: Óra',
                text: 'Köszi!',
                fromEmail: 'anna@pelda.hu',
                inAgentThread: true,
            }),
            'ignore'
        );
    });

    it('treats a slot confirmation in an agent thread as booking', () => {
        assert.equal(
            classifyBookingMailIntent({
                subject: 'Re: Óra',
                text: 'Az első időpont jó, csütörtök 16:00.',
                fromEmail: 'anna@pelda.hu',
                inAgentThread: true,
            }),
            'booking'
        );
    });

    it('escalates complaints and invoice fights', () => {
        assert.equal(
            classifyBookingMailIntent({
                subject: 'Panasz',
                text: 'Ez egy panasz a számláról',
                fromEmail: 'x@y.hu',
            }),
            'escalate'
        );
    });
});

describe('packed slots', () => {
    it('prefers a slot next to an existing lesson over an empty Monday', () => {
        const packed = suggestPackedSlots([mon, thu], null, 3);
        assert.ok(packed.length >= 1);
        assert.equal(packed[0].dateKey, '2026-09-17');
        assert.equal(packed[0].time, '15:00');
        assert.ok(packed[0].packScore >= 50);
        assert.ok(!packed.some((s) => s.dateKey === '2026-09-14') || packed[0].dateKey === '2026-09-17');
    });

    it('does not suggest a taken hour', () => {
        const packed = suggestPackedSlots([thu], null, 10);
        assert.ok(!packed.some((s) => s.time === '16:00'));
    });

    it('picks the first offered slot from Hungarian ordinal', () => {
        const choice = parseChoiceFromOffers('Az első jó nekem', [
            { dateKey: '2026-09-17', time: '15:00', weekdayHu: 'csütörtök', packScore: 50, reason: 'adjacent' },
            { dateKey: '2026-09-18', time: '16:00', weekdayHu: 'péntek', packScore: 0, reason: 'earliest-free' },
        ]);
        assert.equal(choice?.dateKey, '2026-09-17');
        assert.equal(choice?.time, '15:00');
    });

    it('parses weekday-afternoon window', () => {
        const w = parseStudentWindow('Hétköznap 14 után jó lenne');
        assert.ok(w);
        assert.deepEqual(w.weekdays, [1, 2, 3, 4, 5]);
        assert.equal(w.afterMinutes, 14 * 60);
    });

    it('offers packed Thursday instead of confirming isolated Monday', () => {
        const alt = shouldOfferPackedInsteadOfRequested(
            { dateKey: '2026-09-14', time: '12:00' },
            [mon, thu],
            parseStudentWindow('hétköznap 12 után')
        );
        assert.ok(alt.length >= 1);
        assert.equal(alt[0].dateKey, '2026-09-17');
    });
});
