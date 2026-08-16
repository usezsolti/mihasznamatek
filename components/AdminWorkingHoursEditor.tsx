import { useEffect, useState, type CSSProperties } from "react";
import {
    DEFAULT_WORKING_HOURS,
    WEEKDAY_LABELS_HU,
    WEEKDAY_ORDER,
    WorkingHoursMap,
    cloneWorkingHours,
    hourSelectOptions,
    loadWorkingHoursFromFirestore,
    parseTime,
    saveWorkingHoursToFirestore,
} from "../utils/bookingSlots";

type Props = {
    onSaved?: (hours: WorkingHoursMap) => void;
};

export default function AdminWorkingHoursEditor({ onSaved }: Props) {
    const [hours, setHours] = useState<WorkingHoursMap>(() => cloneWorkingHours());
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const timeOptions = hourSelectOptions();

    useEffect(() => {
        let cancelled = false;
        (async () => {
            setLoading(true);
            const loaded = await loadWorkingHoursFromFirestore();
            if (!cancelled) {
                setHours(loaded);
                setLoading(false);
            }
        })();
        return () => {
            cancelled = true;
        };
    }, []);

    const setClosed = (day: number, closed: boolean) => {
        setHours((prev) => {
            const next = cloneWorkingHours(prev);
            if (closed) {
                next[day] = null;
            } else {
                next[day] = prev[day] || DEFAULT_WORKING_HOURS[day] || ["09:00", "17:00"];
            }
            return next;
        });
        setMessage(null);
    };

    const setBound = (day: number, which: 0 | 1, value: string) => {
        setHours((prev) => {
            const next = cloneWorkingHours(prev);
            const current = next[day] || ["09:00", "17:00"];
            const range: [string, string] = [current[0], current[1]];
            range[which] = value;
            next[day] = range;
            return next;
        });
        setMessage(null);
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage(null);
        try {
            for (const day of WEEKDAY_ORDER) {
                const range = hours[day];
                if (!range) continue;
                if (parseTime(range[0]) + 60 > parseTime(range[1])) {
                    setMessage(
                        `${WEEKDAY_LABELS_HU[day]}: a kezdésnek legalább 1 órával a zárás előtt kell lennie.`
                    );
                    setSaving(false);
                    return;
                }
            }

            const result = await saveWorkingHoursToFirestore(hours);
            if (!result.ok) {
                setMessage(result.error || "Mentés sikertelen.");
                return;
            }
            setMessage("Munkaidő elmentve. A foglaló oldal ezt használja.");
            onSaved?.(hours);
        } finally {
            setSaving(false);
        }
    };

    const handleResetDefaults = () => {
        setHours(cloneWorkingHours(DEFAULT_WORKING_HOURS));
        setMessage(null);
    };

    return (
        <section
            style={{
                margin: "0 auto 2rem",
                maxWidth: "720px",
                padding: "1.25rem",
                background: "rgba(0,0,0,0.35)",
                border: "1px solid rgba(57,255,20,0.25)",
                borderRadius: "16px",
            }}
        >
            <h2 className="section-title" style={{ marginBottom: "0.35rem", fontSize: "1.35rem" }}>
                🕒 Mikor tartasz órákat? (heti munkaidő)
            </h2>
            <p className="section-subtitle" style={{ marginBottom: "1rem" }}>
                Itt állítod be, melyik napokon / órákban vagy elérhető. A foglaló oldal és a naptár
                ezt használja.
            </p>

            {loading ? (
                <p style={{ color: "#aaa", margin: 0 }}>Betöltés…</p>
            ) : (
                <div style={{ display: "grid", gap: "0.65rem" }}>
                    {WEEKDAY_ORDER.map((day) => {
                        const range = hours[day];
                        const closed = !range;
                        return (
                            <div
                                key={day}
                                style={{
                                    display: "grid",
                                    gridTemplateColumns: "7.5rem 1fr",
                                    gap: "0.75rem",
                                    alignItems: "center",
                                    padding: "0.65rem 0.75rem",
                                    borderRadius: "12px",
                                    background: "rgba(255,255,255,0.04)",
                                    border: "1px solid rgba(255,255,255,0.08)",
                                }}
                            >
                                <strong style={{ color: "#eee" }}>{WEEKDAY_LABELS_HU[day]}</strong>
                                <div
                                    style={{
                                        display: "flex",
                                        flexWrap: "wrap",
                                        gap: "0.5rem",
                                        alignItems: "center",
                                    }}
                                >
                                    <label
                                        style={{
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "0.35rem",
                                            color: "#bbb",
                                            fontSize: "0.9rem",
                                            cursor: "pointer",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={closed}
                                            onChange={(e) => setClosed(day, e.target.checked)}
                                        />
                                        Zárva
                                    </label>
                                    {!closed && range && (
                                        <>
                                            <select
                                                value={range[0]}
                                                onChange={(e) => setBound(day, 0, e.target.value)}
                                                style={selectStyle}
                                            >
                                                {timeOptions.map((t) => (
                                                    <option key={`s-${day}-${t}`} value={t}>
                                                        {t}
                                                    </option>
                                                ))}
                                            </select>
                                            <span style={{ color: "#888" }}>–</span>
                                            <select
                                                value={range[1]}
                                                onChange={(e) => setBound(day, 1, e.target.value)}
                                                style={selectStyle}
                                            >
                                                {timeOptions.map((t) => (
                                                    <option key={`e-${day}-${t}`} value={t}>
                                                        {t}
                                                    </option>
                                                ))}
                                            </select>
                                        </>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "0.65rem",
                    marginTop: "1rem",
                    alignItems: "center",
                }}
            >
                <button
                    type="button"
                    disabled={loading || saving}
                    onClick={handleSave}
                    style={{
                        background: "linear-gradient(135deg, #39ff14, #ff69b4)",
                        color: "#000",
                        border: "none",
                        borderRadius: "10px",
                        padding: "0.65rem 1.1rem",
                        fontWeight: 700,
                        cursor: loading || saving ? "not-allowed" : "pointer",
                    }}
                >
                    {saving ? "Mentés…" : "Munkaidő mentése"}
                </button>
                <button
                    type="button"
                    disabled={loading || saving}
                    onClick={handleResetDefaults}
                    style={{
                        background: "transparent",
                        color: "#aaa",
                        border: "1px solid #666",
                        borderRadius: "10px",
                        padding: "0.65rem 1rem",
                        fontWeight: 600,
                        cursor: loading || saving ? "not-allowed" : "pointer",
                    }}
                >
                    Alapértelmezett
                </button>
            </div>
            {message && (
                <p style={{ margin: "0.75rem 0 0", color: message.includes("elmentve") ? "#39ff14" : "#ff69b4" }}>
                    {message}
                </p>
            )}
        </section>
    );
}

const selectStyle: CSSProperties = {
    background: "#111",
    color: "#eee",
    border: "1px solid #444",
    borderRadius: "8px",
    padding: "0.35rem 0.5rem",
};
