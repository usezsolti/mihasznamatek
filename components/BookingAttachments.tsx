import { normalizeAttachments, type BookingAttachment } from "../utils/bookingNotify";

type Props = {
    files?: Array<BookingAttachment | string> | null;
    label?: string;
};

export default function BookingAttachments({ files, label = "📎 Csatolmányok" }: Props) {
    const list = normalizeAttachments(files).filter((f) => f.url || f.name);
    if (!list.length) return null;

    return (
        <div style={{ marginTop: "0.5rem" }}>
            <p style={{ margin: "0 0 0.35rem", color: "#bbb", fontSize: "0.9rem" }}>{label}</p>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "#ddd" }}>
                {list.map((f, i) => (
                    <li key={`${f.name}-${i}`} style={{ marginBottom: "0.2rem" }}>
                        {f.url ? (
                            <a
                                href={f.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: "#39ff14", wordBreak: "break-all" }}
                            >
                                {f.name}
                            </a>
                        ) : (
                            <span>{f.name}</span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}
