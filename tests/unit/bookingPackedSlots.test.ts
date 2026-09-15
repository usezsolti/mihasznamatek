import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { classifyBookingMailIntent } from '../../utils/bookingMailIntent';
import {
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
