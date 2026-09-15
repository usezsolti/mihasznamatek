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
    return s
        .replace(/=\r?\n/g, '')
        .replace(/=([0-9A-Fa-f]{2})/g, (_, h) => String.fromCharCode(parseInt(h, 16)));
}

export function extractMailText(raw: string): string {
    const cut = raw.indexOf('\r\n\r\n') >= 0 ? raw.indexOf('\r\n\r\n') : raw.indexOf('\n\n');
    let body = cut >= 0 ? raw.slice(cut).replace(/^\s+/, '') : raw;
    const head = cut >= 0 ? raw.slice(0, cut) : '';
    if (/quoted-printable/i.test(head) || /=[0-9A-F]{2}/i.test(body.slice(0, 400))) {
        body = decodeQuotedPrintable(body);
    }
    if (/base64/i.test(head) && !/<html/i.test(body.slice(0, 80))) {
        try {
            const b64 = body.replace(/\s+/g, '');
            if (/^[A-Za-z0-9+/]+=*$/.test(b64.slice(0, 200))) {
                body = Buffer.from(b64, 'base64').toString('utf8');
            }
        } catch {
            /* keep */
        }
    }
    body = body.replace(/<style[\s\S]*?<\/style>/gi, ' ');
    body = body.replace(/<[^>]+>/g, ' ');
    return body.replace(/\s+/g, ' ').trim().slice(0, 6000);
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

export async function fetchUnprocessedInbox(limit = 8): Promise<InboundMail[]> {
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
}): Promise<void> {
    if (!gmailImapReady()) throw new Error('Gmail IMAP nincs beállítva.');
    const client = await connect();
    try {
        const drafts = await resolveDraftsPath(client);
        const subj = /^re:/i.test(opts.subject) ? opts.subject : `Re: ${opts.subject}`;
        const refs = [opts.references, opts.inReplyTo].filter(Boolean).join(' ').trim();
        const rfc = `From: ${emailFromHeader()}\r\nTo: ${opts.toEmail}\r\nSubject: ${subj}\r\n${
            opts.inReplyTo ? `In-Reply-To: ${opts.inReplyTo}\r\n` : ''
        }${refs ? `References: ${refs}\r\n` : ''}MIME-Version: 1.0\r\nContent-Type: text/plain; charset=utf-8\r\nContent-Transfer-Encoding: 8bit\r\n\r\n${opts.body}\r\n`;
        await client.append(drafts, rfc, ['\\Draft']);
    } finally {
        try {
            await client.logout();
        } catch {
            client.close();
        }
    }
}
