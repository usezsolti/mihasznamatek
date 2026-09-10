export type LessonPackSection = { heading: string; body: string };

export type LessonPackExample = {
    title: string;
    problem: string;
    steps: string;
    answer: string;
};

export type LessonPackPractice = {
    problem: string;
    hint: string;
    answer: string;
};

export type LessonPackContent = {
    title: string;
    goal: string;
    intro: string;
    sections: LessonPackSection[];
    examples: LessonPackExample[];
    practice: LessonPackPractice[];
    teacherNotes: string;
};

export type LessonPackRecord = {
    id: string;
    bookingId?: string;
    topicId?: string;
    topicTitle: string;
    preparingFor?: string;
    preparingForLabel?: string;
    selectedSubject?: string;
    summary: string;
    content: LessonPackContent;
    pdfUrl?: string;
    createdAt: string;
    source?: 'gemini' | 'fallback';
};

export function fallbackLessonPackContent(input: {
    topicTitle: string;
    preparingForLabel?: string;
    selectedSubject?: string;
    topicNote?: string;
}): LessonPackContent {
    const topic = input.topicTitle || 'Matek';
    const goal = input.preparingForLabel || 'Gyakorlás';
    return {
        title: `${topic} — óraanyag`,
        goal,
        intro: `Ez a füzet a(z) ${topic} témához készült (${input.selectedSubject || 'matek'}). Cél: ${goal}.`,
        sections: [
            {
                heading: 'Mit kell tudni',
                body: `Ismételd át a(z) ${topic} alapfogalmait, képleteit és a tipikus feladatfajtákat. ${
                    input.topicNote ? `A diák megjegyzése: ${input.topicNote}` : ''
                }`,
            },
            {
                heading: 'Óra menete',
                body: '1) Rövid ismétlés. 2) Egy közösen megoldott példa. 3) Önálló gyakorlás. 4) Hibák megbeszélése.',
            },
        ],
        examples: [
            {
                title: 'Közös példa',
                problem: `Írj fel egy közepes ${topic} feladatot, és oldjátok meg lépésenként.`,
                steps: 'Olvasd el a kérdést, írd fel az ismert adatokat, válassz képletet, számolj, ellenőrizz.',
                answer: 'Az órán közösen.',
            },
        ],
        practice: [
            {
                problem: `Gyűjts 3 hasonló ${topic} feladatot a tankönyvből vagy az érettségi feladatsorokból.`,
                hint: 'Kezdd a legegyszerűbbel.',
                answer: 'Az órán ellenőrizzük.',
            },
        ],
        teacherNotes:
            'Az AI most nem ért el. Ezt a vázlatot használd, és egészítsd ki saját példákkal.',
    };
}

export function packSummary(content: LessonPackContent): string {
    const bits = [content.title, content.goal, content.intro].filter(Boolean);
    return bits.join(' — ').slice(0, 220);
}
