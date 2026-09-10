import { useEffect, useMemo, useRef, useState } from 'react';
import {
    BOOKING_OTHER_TOPIC_ID,
    listAllBookingTopics,
    preferredBookingTopicGroups,
    type BookingCatalogTopic,
} from '../utils/mathTopicsCatalog';

type Props = {
    subject: string;
    topicId: string;
    topicTitle: string;
    searchPlaceholder: string;
    otherLabel: string;
    otherPlaceholder: string;
    noMatchLabel: string;
    onChange: (topicId: string, topicTitle: string) => void;
};

function foldHu(value: string): string {
    return value
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
}

export default function BookingTopicSearch({
    subject,
    topicId,
    topicTitle,
    searchPlaceholder,
    otherLabel,
    otherPlaceholder,
    noMatchLabel,
    onChange,
}: Props) {
    const allTopics = useMemo(() => listAllBookingTopics(), []);
    const boxRef = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);
    const [query, setQuery] = useState('');

    useEffect(() => {
        const onDoc = (e: MouseEvent) => {
            if (!boxRef.current?.contains(e.target as Node)) setOpen(false);
        };
        document.addEventListener('mousedown', onDoc);
        return () => document.removeEventListener('mousedown', onDoc);
    }, []);

    const preferred = preferredBookingTopicGroups(subject);
    const filtered = useMemo(() => {
        const q = foldHu(query.trim());
        const matched = q
            ? allTopics.filter(
                  (t) => foldHu(t.title).includes(q) || foldHu(t.group).includes(q)
              )
            : allTopics;
        const rank = (group: string) => {
            const exact = preferred.indexOf(group);
            if (exact >= 0) return exact;
            if (preferred.some((p) => p.endsWith('·') && group.startsWith(p))) return 0;
            return 80;
        };
        return [...matched].sort((a, b) => {
            const d = rank(a.group) - rank(b.group);
            if (d !== 0) return d;
            const g = a.group.localeCompare(b.group, 'hu');
            if (g !== 0) return g;
            return a.title.localeCompare(b.title, 'hu');
        });
    }, [allTopics, preferred, query]);

    const groups = useMemo(() => {
        const map = new Map<string, BookingCatalogTopic[]>();
        for (const t of filtered) {
            const list = map.get(t.group) || [];
            list.push(t);
            map.set(t.group, list);
        }
        return Array.from(map.entries());
    }, [filtered]);

    const pick = (id: string, title: string) => {
        onChange(id, title);
        setQuery('');
        setOpen(false);
    };

    const selectedLabel =
        topicId === BOOKING_OTHER_TOPIC_ID
            ? topicTitle
                ? `${otherLabel}: ${topicTitle}`
                : otherLabel
            : topicTitle;

    return (
        <div className="booking-topic-search" ref={boxRef}>
            {topicId ? (
                <div className="booking-topic-chosen">
                    <span>{selectedLabel}</span>
                    <button
                        type="button"
                        className="booking-topic-clear"
                        onClick={() => {
                            onChange('', '');
                            setQuery('');
                            setOpen(true);
                        }}
                    >
                        ×
                    </button>
                </div>
            ) : (
                <input
                    id="booking-topic-search"
                    type="search"
                    value={query}
                    placeholder={searchPlaceholder}
                    autoComplete="off"
                    onFocus={() => setOpen(true)}
                    onChange={(e) => {
                        setQuery(e.target.value);
                        setOpen(true);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            const first = filtered[0];
                            if (first) pick(first.id, first.title);
                        }
                    }}
                />
            )}
            {open && !topicId ? (
                <div className="booking-topic-list" role="listbox">
                    {groups.map(([group, topics]) => (
                        <div key={group} className="booking-topic-group">
                            <div className="booking-topic-group-title">{group}</div>
                            {topics.map((t) => (
                                <button
                                    key={t.id}
                                    type="button"
                                    className="booking-topic-option"
                                    onClick={() => pick(t.id, t.title)}
                                >
                                    <span aria-hidden>{t.icon}</span>
                                    {t.title}
                                </button>
                            ))}
                        </div>
                    ))}
                    {filtered.length === 0 ? (
                        <div className="booking-topic-empty">{noMatchLabel}</div>
                    ) : null}
                    <button
                        type="button"
                        className="booking-topic-option booking-topic-other"
                        onClick={() => {
                            onChange(BOOKING_OTHER_TOPIC_ID, '');
                            setQuery('');
                            setOpen(false);
                        }}
                    >
                        {otherLabel}
                    </button>
                </div>
            ) : null}
            {topicId === BOOKING_OTHER_TOPIC_ID ? (
                <input
                    type="text"
                    className="booking-topic-other-input"
                    value={topicTitle}
                    placeholder={otherPlaceholder}
                    onChange={(e) => onChange(BOOKING_OTHER_TOPIC_ID, e.target.value)}
                    maxLength={120}
                />
            ) : null}
        </div>
    );
}
