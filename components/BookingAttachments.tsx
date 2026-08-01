import { normalizeAttachments, type BookingAttachment } from "../utils/bookingNotify";

type Props = {
    files?: Array<BookingAttachment | string> | null;
    label?: string;
};

/** Csak https (és localhost http) URL-ek — védelem javascript:/data: XSS ellen. */
function safeHref(url?: string): string | null {
    const u = (url || "").trim();
    if (!u) return null;
    try {
        const parsed = new URL(u);
        if (parsed.protocol === "https:") return parsed.href;
        if (
            parsed.protocol === "http:" &&
            (parsed.hostname === "localhost" || parsed.hostname === "127.0.0.1")
        ) {
            return parsed.href;
        }
    } catch {
        return null;
    }
    return null;
}

export default function BookingAttachments({ files, label = "📎 Csatolmányok" }: Props) {
    const list = normalizeAttachments(files)
        .map((f) => ({ ...f, safeUrl: safeHref(f.url) }))
        .filter((f) => f.safeUrl || f.name);
    if (!list.length) return null;

    return (
        <div style={{ marginTop: "0.5rem" }}>
            <p style={{ margin: "0 0 0.35rem", color: "#bbb", fontSize: "0.9rem" }}>{label}</p>
            <ul style={{ margin: 0, paddingLeft: "1.1rem", color: "#ddd" }}>
                {list.map((f, i) => (
                    <li key={`${f.name}-${i}`} style={{ marginBottom: "0.2rem" }}>
                        {f.safeUrl ? (
                            <a
                                href={f.safeUrl}
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
