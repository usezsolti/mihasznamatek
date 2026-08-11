import { useRouter } from 'next/router';
import type { EducationLevelId } from '../../utils/mathTopicsCatalog';
import { buildTopicPracticeHref } from '../../utils/topicStats';

export type GamePathBackButtonProps = {
    currentTopic: string | null | undefined;
};

export default function GamePathBackButton({ currentTopic }: GamePathBackButtonProps) {
    const router = useRouter();

    return (
        <button
            className="reset-button"
            onClick={() => {
                const topic = String((router.query.topic as string) || currentTopic || '');
                const edu = (router.query.educationLevel as EducationLevelId)
                    || (router.query.erettsegi === 'true' ? 'erettsegi' : 'erettsegi');
                const examLvl = ((router.query.level as string) === 'kozep' ? 'kozep' : 'emelt') as 'kozep' | 'emelt';
                router.push(buildTopicPracticeHref(topic, edu, examLvl));
            }}
            style={{
                marginBottom: '0.75rem',
                background: 'linear-gradient(90deg, #39ff14, #ffd700)',
                color: '#111',
                fontWeight: 800,
                border: 'none',
            }}
        >
            <span className="button-icon">🗺️</span>
            Vissza az útra
        </button>
    );
}
