import { useLang } from '../utils/i18n';

/** Egykattintásos HU ↔ EN váltó (globális CSS — nincs styled-jsx). */
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
        </div>
    );
}
