import { ImapFlow } from 'imapflow';
import { emailFromHeader } from '../utils/emailFrom';

export type InboundMail = {
    uid: number;
    mailbox: string;
    gmailThreadId: string;
    messageId: string;
    inReplyTo: string;
    references: string;
    subject: string;
    fromEmail: string;
    fromName: string;
    text: string;
    dateMs: number;
};

function envUser(): string {
    return String(process.env.GMAIL_USER || '').trim();
}

function envPass(): string {
    return String(process.env.GMAIL_APP_PASSWORD || '').replace(/\s+/g, '');
}

export function gmailImapReady(): boolean {
    return Boolean(envUser() && envPass());
}

function mailboxPath(): string {
    return String(process.env.GMAIL_AI_MAILBOX || 'INBOX').trim() || 'INBOX';
}

function extractHeader(raw: string, name: string): string {
    const re = new RegExp(`^${name}:\\s*(.+)$`, 'im');
    const m = raw.match(re);
    return m ? m[1].replace(/\s+/g, ' ').trim() : '';
}

function decodeQuotedPrintable(s: string): string {
    const bytes: number[] = [];
    const src = s.replace(/=\r?\n/g, '');
    for (let i = 0; i < src.length; i++) {
        if (src[i] === '=' && /^[0-9A-Fa-f]{2}/.test(src.slice(i + 1, i + 3))) {
            bytes.push(parseInt(src.slice(i + 1, i + 3), 16));
            i += 2;
        } else {
            bytes.push(src.charCodeAt(i) & 0xff);
        }
    }
    return Buffer.from(bytes).toString('utf8');
}

function headerMap(head: string): Record<string, string> {
    const map: Record<string, string> = {};
    const unfolded = head.replace(/\r?\n[ \t]+/g, ' ');
    for (const line of unfolded.split(/\r?\n/)) {
        const i = line.indexOf(':');
        if (i <= 0) continue;
        map[line.slice(0, i).trim().toLowerCase()] = line.slice(i + 1).trim();
    }
    return map;
}

function splitHeadBody(raw: string): { head: string; body: string } {
    const crlf = raw.indexOf('\r\n\r\n');
    const lf = raw.indexOf('\n\n');
    const cut = crlf >= 0 && (lf < 0 || crlf <= lf) ? crlf : lf;
    if (cut < 0) return { head: '', body: raw };
    const sep = raw.startsWith('\r\n', cut) || cut === crlf ? 4 : 2;
    return { head: raw.slice(0, cut), body: raw.slice(cut + sep) };
}

function decodeTransfer(body: string, cte: string): string {
    const enc = cte.toLowerCase();
    if (enc.includes('base64')) {
        try {
            return Buffer.from(body.replace(/\s+/g, ''), 'base64').toString('utf8');
        } catch {
            return body;
        }
    }
    if (enc.includes('quoted-printable')) return decodeQuotedPrintable(body);
    return body;
}

function stripHtml(s: string): string {
    return s
        .replace(/<style[\s\S]*?<\/style>/gi, ' ')
        .replace(/<script[\s\S]*?<\/script>/gi, ' ')
        .replace(/<[^>]+>/g, ' ')
        .replace(/&nbsp;/gi, ' ')
        .replace(/&amp;/gi, '&');
}

function collectTexts(raw: string, depth: number): { plain: string[]; html: string[] } {
    const plain: string[] = [];
    const html: string[] = [];
    if (depth > 6 || !raw) return { plain, html };
    const { head, body } = splitHeadBody(raw);
    const headers = headerMap(head);
    const ct = headers['content-type'] || 'text/plain';
    const cte = headers['content-transfer-encoding'] || '';
    const boundary = /boundary="?([^";]+)"?/i.exec(ct)?.[1];
    if (boundary && /multipart\//i.test(ct)) {
        const chunks = body.split(new RegExp(`--${boundary.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}`));
        for (const chunk of chunks) {
            const part = chunk.replace(/^\r?\n/, '');
            if (!part.trim() || part.trim() === '--') continue;
            const nested = collectTexts(part, depth + 1);
            plain.push(...nested.plain);
            html.push(...nested.html);
        }
        return { plain, html };
    }
    const decoded = decodeTransfer(body, cte);
    if (/text\/html/i.test(ct)) html.push(stripHtml(decoded));
    else if (/text\/plain/i.test(ct) || !head) plain.push(decoded);
    return { plain, html };
}

export function extractMailText(raw: string): string {
    const parts = collectTexts(raw, 0);
    const text = (parts.plain.join('\n') || parts.html.join('\n') || raw).replace(/\s+/g, ' ').trim();
    return text.slice(0, 6000);
}

function parseAddress(v: { address?: string; name?: string } | undefined): { email: string; name: string } {
    const email = String(v?.address || '').toLowerCase().trim();
    const name = String(v?.name || '').trim();
    return { email, name };
}

async function connect(): Promise<ImapFlow> {
    const client = new ImapFlow({
        host: 'imap.gmail.com',
        port: 993,
        secure: true,
        auth: { user: envUser(), pass: envPass() },
        logger: false,
    });
    await client.connect();
    return client;
}

export async function fetchUnprocessedInbox(limit = 25): Promise<InboundMail[]> {
    if (!gmailImapReady()) return [];
    const client = await connect();
    const out: InboundMail[] = [];
    try {
        const box = mailboxPath();
        await client.mailboxOpen(box);
        const since = new Date(Date.now() - 14 * 24 * 60 * 60 * 1000);
        let uids: number[] = [];
        try {
            const found = await client.search({ since, unKeyword: '$mihaszna-ai' }, { uid: true });
            uids = Array.isArray(found) ? found : [];
        } catch {
            const found = await client.search({ since }, { uid: true });
            uids = Array.isArray(found) ? found : [];
        }
        const list = uids.slice(-Math.max(1, limit));
        for (const uid of list) {
            const msg = await client.fetchOne(
                String(uid),
                { envelope: true, source: true, flags: true, uid: true },
                { uid: true }
            );
            if (!msg) continue;
            const flags = [...(msg.flags || [])].map((f) => String(f).toLowerCase());
            if (flags.some((f) => f.includes('mihaszna-ai'))) continue;
            const raw = msg.source ? msg.source.toString('utf8') : '';
            const env = msg.envelope;
            const from = parseAddress(env?.from?.[0]);
            const messageId = String(env?.messageId || extractHeader(raw, 'Message-ID') || `uid-${uid}`);
            const thread =
                String((msg as { gmailThreadId?: string }).gmailThreadId || extractHeader(raw, 'X-GM-THRID') || messageId)
                    .replace(/[^\w.-]+/g, '_')
                    .slice(0, 120);
            out.push({
                uid: Number(msg.uid || uid),
                mailbox: box,
                gmailThreadId: thread || `uid_${uid}`,
                messageId,
                inReplyTo: extractHeader(raw, 'In-Reply-To'),
                references: extractHeader(raw, 'References'),
                subject: String(env?.subject || extractHeader(raw, 'Subject') || '(nincs tárgy)').slice(0, 200),
                fromEmail: from.email,
                fromName: from.name,
                text: extractMailText(raw),
                dateMs: env?.date ? env.date.getTime() : Date.now(),
            });
        }
    } finally {
        try {
            await client.logout();
        } catch {
            client.close();
        }
    }
    return out;
}

export async function markProcessed(mailbox: string, uid: number): Promise<void> {
    if (!gmailImapReady()) return;
    const client = await connect();
    try {
        await client.mailboxOpen(mailbox);
        await client.messageFlagsAdd(String(uid), ['$mihaszna-ai'], { uid: true });
    } finally {
        try {
            await client.logout();
        } catch {
            client.close();
        }
    }
}

async function resolveDraftsPath(client: ImapFlow): Promise<string> {
    const boxes = await client.list();
    const hit = boxes.find(
        (b) =>
            b.specialUse === '\\Drafts' ||
            /piszkozat|drafts/i.test(String(b.path || ''))
    );
    return hit?.path || '[Gmail]/Drafts';
}

export async function appendDraftReply(opts: {
    toEmail: string;
    subject: string;
    inReplyTo: string;
    references: string;
    body: string;
    html?: string;
}): Promise<void> {
    if (!gmailImapReady()) throw new Error('Gmail IMAP nincs beállítva.');
    const client = await connect();
    try {
        const drafts = await resolveDraftsPath(client);
        const subj = /^re:/i.test(opts.subject) ? opts.subject : `Re: ${opts.subject}`;
        const refs = [opts.references, opts.inReplyTo].filter(Boolean).join(' ').trim();
        const rfc = buildRfcMessage({
            toEmail: opts.toEmail,
            subject: subj,
            inReplyTo: opts.inReplyTo,
            references: refs,
            body: opts.body,
            html: opts.html,
        });
        await client.append(drafts, rfc, ['\\Draft']);
    } finally {
        try {
            await client.logout();
        } catch {
            client.close();
        }
    }
}

export async function appendStandaloneDraft(opts: {
    toEmail: string;
    subject: string;
    body: string;
    html?: string;
}): Promise<void> {
    if (!gmailImapReady()) throw new Error('Gmail IMAP nincs beállítva.');
    const client = await connect();
    try {
        const drafts = await resolveDraftsPath(client);
        const rfc = buildRfcMessage({
            toEmail: opts.toEmail,
            subject: opts.subject,
            body: opts.body,
            html: opts.html,
        });
        await client.append(drafts, rfc, ['\\Draft']);
    } finally {
        try {
            await client.logout();
        } catch {
            client.close();
        }
    }
}

function buildRfcMessage(opts: {
    toEmail: string;
    subject: string;
    body: string;
    html?: string;
    inReplyTo?: string;
    references?: string;
}): string {
    const headers = [
        `From: ${emailFromHeader()}`,
        `To: ${opts.toEmail}`,
        `Subject: ${opts.subject}`,
        opts.inReplyTo ? `In-Reply-To: ${opts.inReplyTo}` : '',
        opts.references ? `References: ${opts.references}` : '',
    ].filter(Boolean);

    if (opts.html) {
        const b = `mm${Date.now().toString(36)}`;
        return `${headers.join('\r\n')}\r\nMIME-Version: 1.0\r\nContent-Type: multipart/alternative; boundary="${b}"\r\n\r\n--${b}\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n${opts.body}\r\n--${b}\r\nContent-Type: text/html; charset=utf-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n${opts.html}\r\n--${b}--\r\n`;
    }
    return `${headers.join('\r\n')}\r\nMIME-Version: 1.0\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n${opts.body}\r\n`;
}
