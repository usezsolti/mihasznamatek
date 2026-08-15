import { useLang } from '../utils/i18n';

/** Egykattintásos HU ↔ EN váltó. */
export default function LanguageToggle() {
    const { lang, setLang, t } = useLang();

    return (
        <div className="lang-toggle" role="group" aria-label={t('nav.langSwitch')}>
            <button
                type="button"
                className={lang === 'hu' ? 'is-on' : ''}
                aria-pressed={lang === 'hu'}
                onClick={() => setLang('hu')}
            >
                {t('nav.langHu')}
            </button>
            <button
                type="button"
                className={lang === 'en' ? 'is-on' : ''}
                aria-pressed={lang === 'en'}
                onClick={() => setLang('en')}
            >
                {t('nav.langEn')}
            </button>
            <style jsx>{`
                .lang-toggle {
                    display: inline-flex;
                    align-items: center;
                    border: 1px solid rgba(57, 255, 20, 0.35);
                    border-radius: 999px;
                    overflow: hidden;
                    background: rgba(0, 0, 0, 0.35);
                    flex-shrink: 0;
                }
                .lang-toggle button {
                    border: none;
                    background: transparent;
                    color: #9aa89f;
                    font-weight: 800;
                    font-size: 0.72rem;
                    letter-spacing: 0.06em;
                    padding: 0.35rem 0.55rem;
                    cursor: pointer;
                    line-height: 1;
                }
                .lang-toggle button.is-on {
                    background: linear-gradient(135deg, #39ff14, #b8ff5a);
                    color: #061008;
                }
                .lang-toggle button:not(.is-on):hover {
                    color: #e8f0ea;
                }
            `}</style>
        </div>
    );
}
