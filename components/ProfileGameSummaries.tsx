import SuccessSpeedometer, { speedometerColor } from './SuccessSpeedometer';
import {
    aggregatePlayedGames,
    formatResultDate,
    playedGameHref,
    type RawGameResult,
} from '../utils/topicStats';

type ProfileGameSummariesProps = {
    results: RawGameResult[];
    onOpen?: (href: string) => void;
};

export default function ProfileGameSummaries({ results, onOpen }: ProfileGameSummariesProps) {
    const games = aggregatePlayedGames(results);

    if (games.length === 0) {
        return (
            <div className="profile-game-empty">
                <div style={{ fontSize: '2.2rem', marginBottom: '0.4rem' }}>📊</div>
                <p>Még nincs összegző — játssz egy kört, és itt látod a helyes/hibás arányt.</p>
            </div>
        );
    }

    return (
        <div className="profile-game-summaries">
            <div className="topics-grid profile-game-grid">
                {games.map((game) => {
                    const color = speedometerColor(game.successRate);
                    const href = playedGameHref(game);
                    return (
                        <div
                            key={game.key}
                            className="topic-card speedometer-card"
                            role={href ? 'button' : undefined}
                            tabIndex={href ? 0 : undefined}
                            onClick={() => {
                                if (href) onOpen?.(href);
                            }}
                            onKeyDown={(e) => {
                                if (!href) return;
                                if (e.key === 'Enter' || e.key === ' ') {
                                    e.preventDefault();
                                    onOpen?.(href);
                                }
                            }}
                        >
                            <div className="card-header">
                                <div className="topic-icon" style={{ backgroundColor: color }}>
                                    {game.icon}
                                </div>
                                <div className="topic-info">
                                    <h3 className="topic-title">{game.title}</h3>
                                </div>
                            </div>
                            <SuccessSpeedometer
                                percent={game.successRate}
                                color={color}
                                compact
                                label={`${game.totalCorrect} helyes · ${game.totalWrong} hibás`}
                                sublabel={`${game.totalGames} játék · ${game.totalQuestions} kérdés`}
                            />
                            {game.lastPlayedAt ? (
                                <p className="profile-game-last">Utoljára: {formatResultDate(game.lastPlayedAt)}</p>
                            ) : null}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
