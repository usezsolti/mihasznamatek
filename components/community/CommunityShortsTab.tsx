import { useCallback, useEffect, useState } from 'react';
import { apiGetAuth, apiPostAuth } from '../../utils/apiClient';
import { useLang } from '../../utils/i18n';
import { listMathShorts } from '../../utils/social';
import type { MathShort } from '../../utils/socialTypes';

type AdminState = {
    used: number;
    limit: number;
    shorts: MathShort[];
};

type CommunityShortsTabProps = {
    canGenerate: boolean;
    onToast: (message: string) => void;
};

function readyClips(items: MathShort[]): MathShort[] {
    return items
        .filter((item) => item.videoUrl && (item.status === 'ready' || !item.status))
        .sort((a, b) => b.createdAtMs - a.createdAtMs);
}

export default function CommunityShortsTab({ canGenerate, onToast }: CommunityShortsTabProps) {
    const { t } = useLang();
    const [topic, setTopic] = useState('');
    const [clips, setClips] = useState<MathShort[]>([]);
    const [admin, setAdmin] = useState<AdminState | null>(null);
    const [index, setIndex] = useState(0);
    const [busy, setBusy] = useState(false);

    const loadReady = useCallback(async () => {
        const res = await apiGetAuth<{ shorts: MathShort[] }>('/api/math-shorts');
        if (res.ok && res.data?.shorts) {
            setClips(readyClips(res.data.shorts));
            return;
        }
        const local = await listMathShorts(40).catch(() => []);
        setClips(readyClips(local));
    }, []);

    const loadAdmin = useCallback(async () => {
        const res = await apiGetAuth<AdminState>('/api/admin/math-shorts');
        if (!res.ok || !res.data) return;
        setAdmin(res.data);
        setClips(readyClips(res.data.shorts));
    }, []);

    useEffect(() => {
        if (canGenerate) void loadAdmin();
        else void loadReady();
    }, [canGenerate, loadAdmin, loadReady]);

    const pending = (admin?.shorts || []).filter((item) => item.status === 'queued' || item.status === 'running').length;

    useEffect(() => {
        if (!canGenerate || pending === 0) return;
        const id = window.setInterval(() => {
            void loadAdmin();
        }, 4000);
        return () => window.clearInterval(id);
    }, [canGenerate, pending, loadAdmin]);

    const current = clips[Math.min(index, Math.max(clips.length - 1, 0))] || null;

    const generate = async () => {
        const cleaned = topic.trim();
        if (!cleaned || busy) return;
        setBusy(true);
        try {
            const res = await apiPostAuth<AdminState>('/api/admin/math-shorts', { topic: cleaned });
            if (!res.ok || !res.data) throw new Error(res.ok ? t('community.shorts.failed') : res.error);
            setAdmin(res.data);
            setClips(readyClips(res.data.shorts));
            setTopic('');
        } catch (e) {
            onToast(e instanceof Error ? e.message : t('community.shorts.failed'));
        } finally {
            setBusy(false);
        }
    };

    return (
        <div className="mm-shorts-stage">
            {canGenerate && (
                <form
                    className="mm-shorts-compose"
                    onSubmit={(event) => {
                        event.preventDefault();
                        void generate();
                    }}
                >
                    <input
                        value={topic}
                        onChange={(event) => setTopic(event.target.value)}
                        placeholder={t('community.shorts.topicPlaceholder')}
                        maxLength={80}
                        aria-label={t('community.shorts.topicPlaceholder')}
                    />
                    <button type="submit" disabled={busy || !topic.trim()}>
                        {t('community.shorts.generate')}
                    </button>
                    {admin && (
                        <p className="mm-shorts-meta">
                            {t('community.shorts.progress', {
                                used: String(admin.used),
                                limit: String(admin.limit),
                            })}
                            {pending > 0
                                ? ` · ${t('community.shorts.queue', { n: String(pending) })}`
                                : ''}
                        </p>
                    )}
                    {pending > 0 && <p className="mm-shorts-meta">{t('community.shorts.working')}</p>}
                </form>
            )}

            {!current && <p className="mm-shorts-meta">{t('community.shorts.empty')}</p>}

            {current?.videoUrl && (
                <div className="mm-shorts-player">
                    <video key={current.id} src={current.videoUrl} controls playsInline autoPlay />
                    <h2>{current.title}</h2>
                    {current.tip ? <p>{t('community.shorts.tip', { tip: current.tip })}</p> : null}
                    <div className="mm-shorts-nav">
                        <button type="button" disabled={index <= 0} onClick={() => setIndex((value) => value - 1)}>
                            {t('community.shorts.prev')}
                        </button>
                        <button
                            type="button"
                            disabled={index >= clips.length - 1}
                            onClick={() => setIndex((value) => value + 1)}
                        >
                            {t('community.shorts.next')}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
