/** Client/server debug log helper for session c04d6a.
 * Never fetch 127.0.0.1:7785 from the browser (CSP). Server writes the file;
 * `/api/debug-session-log` forwards to the ingest endpoint.
 */
export function agentDebugLog(payload: {
    hypothesisId: string;
    location: string;
    message: string;
    data?: Record<string, unknown>;
    runId?: string;
}): void {
    const body = {
        sessionId: 'c04d6a',
        runId: payload.runId || 'phase1-refactor',
        hypothesisId: payload.hypothesisId,
        location: payload.location,
        message: payload.message,
        data: payload.data || {},
        timestamp: Date.now(),
    };

    // #region agent log
    if (typeof window === 'undefined') {
        try {
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const fs = require('fs') as typeof import('fs');
            // eslint-disable-next-line @typescript-eslint/no-require-imports
            const path = require('path') as typeof import('path');
            const line = JSON.stringify(body) + '\n';
            fs.appendFileSync(path.join(process.cwd(), 'debug-c04d6a.log'), line, 'utf8');
            try {
                const cursorLog = path.join(process.cwd(), '..', '.cursor', 'debug-c04d6a.log');
                fs.mkdirSync(path.dirname(cursorLog), { recursive: true });
                fs.appendFileSync(cursorLog, line, 'utf8');
            } catch {
                /* ignore */
            }
        } catch {
            /* ignore */
        }
        return;
    }

    fetch('/api/debug-session-log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
    }).catch(() => {});
    // #endregion
}
