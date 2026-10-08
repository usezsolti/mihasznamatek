import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import { classifyBookingMailIntent } from '../../utils/bookingMailIntent';
import { extractMailText } from '../../server/gmailImap';
import {
    parseChoiceFromOffers,
    earliestFreeSlot,
    latestStudentText,
    parseRequestedSlots,
    parseStudentWindow,
    shouldOfferPackedInsteadOfRequested,
    studentIsFlexible,
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

    it('ignores furniture shop mail even if it says központi or óra', () => {
        assert.equal(
            classifyBookingMailIntent({
                subject: 'Szefa bútor — rendelés',
                text: 'A központi raktárból 48 órán belül szállítjuk a szekrényt. Nyitvatartás és rendelés a webshopon.',
                fromEmail: 'info@szefabutor.hu',
            }),
            'ignore'
        );
    });

    it('does not invent 16:00 when the mail has no hour', () => {
        assert.deepEqual(parseRequestedSlots('Hétfőn ráérek, a számom 06301234567.', '2026-09-25'), []);
        const slots = parseRequestedSlots('Csütörtök 15:00 jó nekem.', '2026-09-25');
        assert.equal(slots[0]?.time, '15:00');
        assert.deepEqual(parseRequestedSlots('A dolgozat napja 2026-10-08, matekból kérek segítséget.', '2026-09-25'), []);
    });

    it('reads afternoon 4 as 16:00 and ignores quoted earlier offers', () => {
        const slots = parseRequestedSlots('Csütörtök délután 4 órakor jó.', '2026-09-25');
        assert.equal(slots[0]?.time, '16:00');
        const quoted = [
            'A második jó.',
            '',
            'Zsolt ezt írta:',
            '1. Hétfő, 12:00',
            '2. Csütörtök 16:00',
        ].join('\n');
        assert.equal(latestStudentText(quoted), 'A második jó.');
        assert.deepEqual(parseRequestedSlots(quoted, '2026-09-25'), []);
    });

    it('does not treat a weekday mention as a free window', () => {
        assert.equal(parseStudentWindow('Csütörtökön lesz a dolgozat, matekból készülök.'), null);
        const afternoon = parseStudentWindow('Délután tudok jönni.');
        assert.equal(afternoon?.afterMinutes, 13 * 60);
    });

    it('ignores appointments that are not about math', () => {
        assert.equal(
            classifyBookingMailIntent({
                subject: 'Your appointment',
                text: 'Your dentist appointment is confirmed. Please book a table too.',
                fromEmail: 'clinic@example.com',
            }),
            'ignore'
        );
        assert.equal(
            classifyBookingMailIntent({
                subject: 'Asztalfoglalás',
                text: 'A vacsorára foglaltunk időpontot péntekre.',
                fromEmail: 'etterem@pelda.hu',
            }),
            'ignore'
        );
    });

    it('selects accented math tutoring mail', () => {
        assert.equal(
            classifyBookingMailIntent({
                subject: 'Érdeklődés',
                text: 'Szia! Érettségire készülök, szeretnék korrepetálást matematikából.',
                fromEmail: 'anna@pelda.hu',
            }),
            'booking'
        );
        assert.equal(
            classifyBookingMailIntent({
                subject: 'Felvételi',
                text: 'A lányom központi felvételire készül, matekból kell segítség.',
                fromEmail: 'apa@pelda.hu',
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

describe('mail text extraction', () => {
    it('reads utf-8 quoted-printable math from a multipart message', () => {
        const plain = Buffer.from('Szia! Érettségire készülök matematikából.', 'utf8');
        const qp = [...plain].map((b) => (b < 128 && b !== 61 ? String.fromCharCode(b) : `=${b.toString(16).toUpperCase().padStart(2, '0')}`)).join('');
        const raw = [
            'Content-Type: multipart/alternative; boundary="b"',
            '',
            '--b',
            'Content-Type: text/plain; charset=utf-8',
            'Content-Transfer-Encoding: quoted-printable',
            '',
            qp,
            '--b--',
            '',
        ].join('\r\n');
        const text = extractMailText(raw);
        assert.match(text, /Érettségire/);
        assert.equal(
            classifyBookingMailIntent({ subject: 'Érdeklődés', text, fromEmail: 'a@b.hu' }),
            'booking'
        );
    });
});

describe('packed slots', () => {
    it('offers the earliest free hour, not a later packed 16:00', () => {
        const packed = suggestPackedSlots([mon, thu], null, 3);
        assert.ok(packed.length >= 1);
        assert.equal(packed[0].dateKey, '2026-09-14');
        assert.equal(packed[0].time, '12:00');
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

    it('treats anytime as the earliest free slot, Monday 12:00 before a later packed day', () => {
        assert.equal(studentIsFlexible('Szia, bármikor jó nekem.'), true);
        assert.equal(studentIsFlexible('Csak csütörtökön érek rá.'), false);
        const slot = earliestFreeSlot([mon, thu]);
        assert.equal(slot?.dateKey, '2026-09-14');
        assert.equal(slot?.time, '12:00');
        assert.equal(slot?.weekdayHu, 'hétfő');
    });

    it('keeps an earlier Monday instead of swapping it for a later packed hour', () => {
        const alt = shouldOfferPackedInsteadOfRequested(
            { dateKey: '2026-09-14', time: '12:00' },
            [mon, thu],
            parseStudentWindow('hétköznap 12 után')
        );
        assert.equal(alt.length, 0);
    });
});
