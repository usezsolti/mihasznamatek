import assert from 'node:assert/strict';
import { describe, it } from 'node:test';
import {
    composeBookingDraft,
    formatSlotProfessional,
    greeting,
} from '../../server/emailBookingCompose';

describe('email booking compose', () => {
    it('greets professionally by first name', () => {
        assert.equal(greeting('Anna'), 'Kedves Anna!');
        assert.equal(greeting(''), 'Kedves Érdeklődő!');
    });

    it('asks for the nearest time that works and is free', () => {
        const mail = composeBookingDraft({ kind: 'ask_window', studentName: 'Anna' });
        assert.match(mail.text, /Kedves Anna!/);
        assert.match(mail.text, /legközelebbi időpont/i);
        assert.match(mail.text, /szabad/i);
        assert.match(mail.text, /Lieszkofszki Zsolt/);
        assert.doesNotMatch(mail.text, /^Szia/m);
        assert.match(mail.html, /Időpont-egyeztetés/);
        assert.match(mail.html, /legközelebbi időpont/i);
    });

    it('offers the nearest free slot first and asks if it works', () => {
        const mail = composeBookingDraft({
            kind: 'offer',
            studentName: 'Péter',
            packed: [
                {
                    dateKey: '2026-09-17',
                    time: '15:00',
                    weekdayHu: 'csütörtök',
                    packScore: 50,
                    reason: 'adjacent',
                },
                {
                    dateKey: '2026-09-18',
                    time: '16:00',
                    weekdayHu: 'péntek',
                    packScore: 0,
                    reason: 'earliest-free',
                },
            ],
        });
        assert.match(mail.text, /legközelebbi szabad/);
        assert.match(mail.text, /legkorábbi/);
        assert.match(mail.text, /15:00/);
        assert.match(mail.html, /Legközelebbi szabad időpont/);
        assert.equal(formatSlotProfessional({ dateKey: '2026-09-17', time: '15:00', weekdayHu: 'csütörtök' }).includes('15:00'), true);
    });

    it('confirms the booked slot in a professional tone', () => {
        const mail = composeBookingDraft({
            kind: 'confirm',
            studentName: 'Lilla',
            confirm: { dateKey: '2026-09-17', time: '15:00', weekdayHu: 'csütörtök' },
        });
        assert.match(mail.text, /lefoglaltam/);
        assert.match(mail.text, /15:00/);
        assert.match(mail.html, /Óra lefoglalva/);
    });
});
