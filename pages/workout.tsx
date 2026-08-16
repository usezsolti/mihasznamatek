import React, { useEffect } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import { trackContactConversion } from '../utils/gtag';
import { useLang } from '../utils/i18n';

export default function PersonalTrainer() {
    const { t } = useLang();
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.scrollTo({ top: 0, behavior: 'auto' });
        }
    }, []);

    return (
        <>
            <Head>
                <title>{t('workout.pageTitle')}</title>
                <meta name="description" content={t('workout.metaDescription')} />
            </Head>

            <div className="workout-page">
                <div className="workout-container">
                    <div className="workout-header">
                        <h1 className="workout-title">
                            💪 MIHASZNA WORKOUT
                        </h1>
                        <p className="workout-subtitle">
                            {t('workout.subtitle')}
                        </p>
                    </div>

                    <div className="workout-content">
                        <section className="workout-section profile-section-trainer">
                            <div className="trainer-profile">
                                <div className="trainer-image">
                                    <img src="/workout profile.png" alt={t('workout.trainerAlt')} />
                                </div>
                                <div className="trainer-info">
                                    <h2 className="section-title-workout">{t('workout.about')}</h2>
                                    <p className="trainer-intro">
                                        {t('workout.aboutIntro1')}
                                    </p>
                                    <p className="trainer-intro">
                                        {t('workout.aboutIntro2')}
                                    </p>
                                </div>
                            </div>
                        </section>

                        <section className="workout-section">
                            <h2 className="section-title-workout">
                                {t('workout.servicesTitle')}
                            </h2>
                            <div className="workout-grid">
                                <div className="workout-card">
                                    <div className="workout-card-icon">🥊</div>
                                    <h3>{t('workout.services.crossfight.title')}</h3>
                                    <p>{t('workout.services.crossfight.body')}</p>
                                </div>

                                <div className="workout-card">
                                    <div className="workout-card-icon">📋</div>
                                    <h3>{t('workout.services.plan.title')}</h3>
                                    <p>{t('workout.services.plan.body')}</p>
                                </div>

                                <div className="workout-card">
                                    <div className="workout-card-icon">🏃</div>
                                    <h3>{t('workout.services.cardio.title')}</h3>
                                    <p>{t('workout.services.cardio.body')}</p>
                                </div>

                                <div className="workout-card">
                                    <div className="workout-card-icon">⚡</div>
                                    <h3>{t('workout.services.hiit.title')}</h3>
                                    <p>{t('workout.services.hiit.body')}</p>
                                </div>

                                <div className="workout-card">
                                    <div className="workout-card-icon">🏋️</div>
                                    <h3>{t('workout.services.crossfit.title')}</h3>
                                    <p>{t('workout.services.crossfit.body')}</p>
                                </div>

                                <div className="workout-card">
                                    <div className="workout-card-icon">🍑</div>
                                    <h3>{t('workout.services.glutes.title')}</h3>
                                    <p>{t('workout.services.glutes.body')}</p>
                                </div>

                                <div className="workout-card">
                                    <div className="workout-card-icon">🏗️</div>
                                    <h3>{t('workout.services.powerbuilding.title')}</h3>
                                    <p>{t('workout.services.powerbuilding.body')}</p>
                                </div>

                                <div className="workout-card">
                                    <div className="workout-card-icon">🧘</div>
                                    <h3>{t('workout.services.mobility.title')}</h3>
                                    <p>{t('workout.services.mobility.body')}</p>
                                </div>

                                <div className="workout-card">
                                    <div className="workout-card-icon">👥</div>
                                    <h3>{t('workout.services.couple.title')}</h3>
                                    <p>{t('workout.services.couple.body')}</p>
                                </div>

                                <div className="workout-card">
                                    <div className="workout-card-icon">🏥</div>
                                    <h3>{t('workout.services.rehab.title')}</h3>
                                    <p>{t('workout.services.rehab.body')}</p>
                                </div>
                            </div>
                        </section>

                        <section className="workout-section pricing-section">
                            <h2 className="section-title-workout">{t('workout.pricingTitle')}</h2>
                            <div className="pricing-grid">
                                <div className="pricing-card">
                                    <div className="pricing-badge">{t('workout.pricing.standard.badge')}</div>
                                    <h3>{t('workout.pricing.standard.title')}</h3>
                                    <p className="price">{t('workout.pricing.standard.price')}</p>
                                    <ul className="pricing-features">
                                        <li>{t('workout.pricing.standard.f1')}</li>
                                        <li>{t('workout.pricing.standard.f2')}</li>
                                        <li>{t('workout.pricing.standard.f3')}</li>
                                    </ul>
                                </div>

                                <div className="pricing-card highlight">
                                    <div className="pricing-badge best">{t('workout.pricing.standardPlus.badge')}</div>
                                    <h3>{t('workout.pricing.standardPlus.title')}</h3>
                                    <p className="price">{t('workout.pricing.standardPlus.price')}</p>
                                    <p className="sub">{t('workout.pricing.standardPlus.sub')}</p>
                                    <ul className="pricing-features">
                                        <li>{t('workout.pricing.standardPlus.f1')}</li>
                                        <li>{t('workout.pricing.standardPlus.f2')}</li>
                                        <li>{t('workout.pricing.standardPlus.f3')}</li>
                                        <li>{t('workout.pricing.standardPlus.f4')}</li>
                                    </ul>
                                </div>

                                <div className="pricing-card">
                                    <div className="pricing-badge">{t('workout.pricing.popular.badge')}</div>
                                    <h3>{t('workout.pricing.popular.title')}</h3>
                                    <p className="price">{t('workout.pricing.popular.price')}</p>
                                    <ul className="pricing-features">
                                        <li>{t('workout.pricing.popular.f1')}</li>
                                        <li>{t('workout.pricing.popular.f2')}</li>
                                        <li>{t('workout.pricing.popular.f3')}</li>
                                        <li>{t('workout.pricing.popular.f4')}</li>
                                    </ul>
                                </div>

                                <div className="pricing-card">
                                    <div className="pricing-badge">{t('workout.pricing.couple.badge')}</div>
                                    <h3>{t('workout.pricing.couple.title')}</h3>
                                    <p className="price">{t('workout.pricing.couple.price')}</p>
                                    <ul className="pricing-features">
                                        <li>{t('workout.pricing.couple.f1')}</li>
                                        <li>{t('workout.pricing.couple.f2')}</li>
                                        <li>{t('workout.pricing.couple.f3')}</li>
                                    </ul>
                                </div>
                            </div>

                            <p className="pricing-note">{t('workout.pricing.note')}</p>
                        </section>

                        <section className="workout-section contact-pt">
                            <h2 className="section-title-workout">{t('workout.contactTitle')}</h2>
                            <div className="contact-pt-grid">
                                <div className="contact-pt-info">
                                    <p className="contact-line"><span className="contact-key">{t('workout.contact.locationLabel')}</span> <span className="contact-val">{t('workout.contact.location')}</span></p>
                                    <p className="contact-line"><span className="contact-key">{t('workout.contact.sessionsLabel')}</span> <span className="contact-val">{t('workout.contact.sessions')}</span></p>
                                    <p className="contact-line"><span className="contact-key">{t('workout.contact.phoneLabel')}</span> <a className="contact-val link" href="tel:+36308935495" onClick={trackContactConversion}>+36 30 893 5495</a></p>
                                    <p className="contact-line"><span className="contact-key">{t('workout.contact.emailLabel')}</span> <a className="contact-val link" href="mailto:usezsolti@gmail.com" onClick={trackContactConversion}>usezsolti@gmail.com</a></p>
                                    <div className="contact-actions">
                                        <a className="contact-btn" href="https://www.google.com/maps?q=1133+Budapest,+Bessenyei+utca+1-3&hl=hu" target="_blank" rel="noopener noreferrer">{t('workout.contact.openMaps')}</a>
                                    </div>

                                    <div className="contact-socials">
                                        <a className="social-btn facebook" href="https://www.facebook.com/profile.php?id=100075272401924" target="_blank" rel="noopener noreferrer" onClick={trackContactConversion}>Facebook</a>
                                        <a className="social-btn instagram" href="https://www.instagram.com/mihaszna__/" target="_blank" rel="noopener noreferrer" onClick={trackContactConversion}>Instagram</a>
                                        <a className="social-btn youtube" href="https://www.youtube.com/@Mihasznamatek" target="_blank" rel="noopener noreferrer" onClick={trackContactConversion}>YouTube</a>
                                        <a className="social-btn tiktok" href="https://tiktok.com/@mihasznamatek" target="_blank" rel="noopener noreferrer" onClick={trackContactConversion}>TikTok</a>
                                    </div>
                                </div>
                                <div className="contact-pt-map">
                                    <div className="map-wrapper">
                                        <iframe
                                            title={t('workout.contact.mapTitle')}
                                            src="https://www.google.com/maps?q=1133+Budapest,+Bessenyei+utca+1-3&output=embed"
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        <section className="workout-section">
                            <h2 className="section-title-workout">
                                {t('workout.methodsTitle')}
                            </h2>
                            <div className="method-list">
                                <div className="method-item">
                                    <span className="method-icon">1️⃣</span>
                                    <div className="method-content">
                                        <h3>{t('workout.methods.step1.title')}</h3>
                                        <p>{t('workout.methods.step1.body')}</p>
                                    </div>
                                </div>
                                <div className="method-item">
                                    <span className="method-icon">2️⃣</span>
                                    <div className="method-content">
                                        <h3>{t('workout.methods.step2.title')}</h3>
                                        <p>{t('workout.methods.step2.body')}</p>
                                    </div>
                                </div>
                                <div className="method-item">
                                    <span className="method-icon">3️⃣</span>
                                    <div className="method-content">
                                        <h3>{t('workout.methods.step3.title')}</h3>
                                        <p>{t('workout.methods.step3.body')}</p>
                                    </div>
                                </div>
                                <div className="method-item">
                                    <span className="method-icon">4️⃣</span>
                                    <div className="method-content">
                                        <h3>{t('workout.methods.step4.title')}</h3>
                                        <p>{t('workout.methods.step4.body')}</p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    </div>

                    <div className="workout-footer">
                        <Link href="/" className="workout-back-link">
                            {t('workout.backHome')}
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .workout-page {
                    min-height: 100vh;
                    /* Natural green/black gradient with nature-inspired overlay */
                    background-image:
                        linear-gradient(135deg, rgba(10,26,10,0.92) 0%, rgba(15,35,15,0.90) 25%, rgba(20,45,20,0.88) 50%, rgba(15,35,15,0.90) 75%, rgba(5,15,5,0.95) 100%),
                        radial-gradient(circle at 20% 50%, rgba(34,197,94,0.15) 0%, transparent 50%),
                        radial-gradient(circle at 80% 80%, rgba(22,163,74,0.12) 0%, transparent 50%),
                        url('/workout%20bck.png');
                    background-size: cover, cover, cover, cover;
                    background-position: center center, center center, center center, center center;
                    background-repeat: no-repeat, no-repeat, no-repeat, no-repeat;
                    color: #ffffff;
                    font-family: 'Montserrat', 'Open Sans', sans-serif;
                    padding: 2rem;
                    position: relative;
                    overflow-x: hidden;
                }

                .workout-page::before {
                    display: none;
                }

                .workout-container {
                    max-width: 1200px;
                    margin: 0 auto;
                    position: relative;
                    z-index: 1;
                    padding-top: 80px;
                }

                .workout-header {
                    text-align: center;
                    margin-bottom: 4rem;
                }

                .workout-title {
                    color: #4ade80;
                    font-size: 3.5rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    text-shadow: 0 0 20px rgba(74, 222, 128, 0.6),
                                0 0 40px rgba(34, 197, 94, 0.4),
                                0 0 60px rgba(22, 163, 74, 0.2);
                }

                .workout-subtitle {
                    color: #86efac;
                    font-size: 1.3rem;
                    font-weight: 400;
                }

                .workout-content {
                    display: flex;
                    flex-direction: column;
                    gap: 3rem;
                }

                .workout-section {
                    background: rgba(0, 0, 0, 0.4);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 2.5rem;
                    border: 1px solid rgba(74, 222, 128, 0.25);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5),
                                0 0 0 1px rgba(34, 197, 94, 0.1) inset;
                }

                .profile-section-trainer {
                    padding: 3rem;
                }

                .trainer-profile {
                    display: flex;
                    align-items: flex-start;
                    gap: 3rem;
                    flex-wrap: wrap;
                }

                .trainer-image {
                    flex-shrink: 0;
                }

                .trainer-image img {
                    width: 250px;
                    height: 250px;
                    border-radius: 50%;
                    object-fit: cover;
                    border: 4px solid #4ade80;
                    box-shadow: 0 0 30px rgba(74, 222, 128, 0.5),
                                0 0 60px rgba(34, 197, 94, 0.3);
                }

                .trainer-info {
                    flex: 1;
                    min-width: 300px;
                }

                .trainer-intro {
                    color: #ffffff;
                    font-size: 1.1rem;
                    line-height: 1.8;
                    margin-bottom: 1.5rem;
                    opacity: 0.95;
                }

                .section-title-workout {
                    color: #4ade80;
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 2rem;
                    text-shadow: 0 0 10px rgba(74, 222, 128, 0.4),
                                0 0 20px rgba(34, 197, 94, 0.2);
                }

                .workout-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2rem;
                }

                .workout-card {
                    background: rgba(0, 0, 0, 0.35);
                    backdrop-filter: blur(10px);
                    border-radius: 15px;
                    padding: 2rem;
                    border: 1px solid rgba(74, 222, 128, 0.3);
                    text-align: center;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4),
                                0 0 0 1px rgba(34, 197, 94, 0.1) inset;
                }

                .workout-card:hover {
                    transform: translateY(-5px);
                    border-color: #4ade80;
                    box-shadow: 0 8px 30px rgba(74, 222, 128, 0.4),
                                0 0 40px rgba(34, 197, 94, 0.2);
                    background: rgba(0, 0, 0, 0.45);
                }

                .workout-card-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }

                .workout-card h3 {
                    color: #86efac;
                    font-size: 1.5rem;
                    font-weight: 600;
                    margin-bottom: 1rem;
                }

                .workout-card p {
                    color: #ffffff;
                    line-height: 1.6;
                    opacity: 0.9;
                }

                .method-list {
                    display: flex;
                    flex-direction: column;
                    gap: 2rem;
                }

                .method-item {
                    display: flex;
                    align-items: flex-start;
                    gap: 2rem;
                    background: rgba(0, 0, 0, 0.3);
                    padding: 2rem;
                    border-radius: 15px;
                    border-left: 4px solid #4ade80;
                    transition: all 0.3s ease;
                }

                .method-item:hover {
                    background: rgba(0, 0, 0, 0.45);
                    transform: translateX(5px);
                    border-left-color: #86efac;
                    box-shadow: 0 4px 20px rgba(74, 222, 128, 0.2);
                }

                .method-icon {
                    font-size: 2rem;
                    flex-shrink: 0;
                }

                .method-content h3 {
                    color: #86efac;
                    font-size: 1.3rem;
                    font-weight: 600;
                    margin-bottom: 0.5rem;
                }

                .method-content p {
                    color: #ffffff;
                    line-height: 1.6;
                    opacity: 0.9;
                    margin: 0;
                }

                .schedule-info {
                    color: #ffffff;
                    font-size: 1.1rem;
                    line-height: 1.8;
                }

                .schedule-info p {
                    margin-bottom: 1rem;
                }

                .goals-list {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1.5rem;
                }

                .goal-item {
                    display: flex;
                    align-items: center;
                    gap: 1rem;
                    background: rgba(0, 0, 0, 0.3);
                    padding: 1rem 1.5rem;
                    border-radius: 10px;
                    border-left: 3px solid #4ade80;
                    color: #ffffff;
                    font-size: 1.1rem;
                }

                .goal-icon {
                    color: #4ade80;
                    font-weight: 700;
                    font-size: 1.3rem;
                }

                .workout-footer {
                    margin-top: 4rem;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(74, 222, 128, 0.3);
                    text-align: center;
                }

                .workout-back-link {
                    color: #ffffff;
                    text-decoration: none;
                    font-size: 1.1rem;
                    font-weight: 600;
                    transition: all 0.3s ease;
                }

                .workout-back-link:hover {
                    color: #86efac;
                    text-shadow: 0 0 10px rgba(74, 222, 128, 0.6);
                }

                /* Pricing */
                .pricing-section {
                    margin-top: 1rem;
                }

                .pricing-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
                    gap: 1.5rem;
                }

                .pricing-card {
                    background: rgba(0, 0, 0, 0.4);
                    border: 1px solid rgba(74, 222, 128, 0.25);
                    border-radius: 18px;
                    padding: 2.25rem 1.75rem 1.75rem;
                    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4),
                                0 0 0 1px rgba(34, 197, 94, 0.1) inset;
                    position: relative;
                    transition: all 0.3s ease;
                }

                .pricing-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 36px rgba(74, 222, 128, 0.3),
                                0 0 50px rgba(34, 197, 94, 0.15);
                    border-color: #4ade80;
                }

                .pricing-card.highlight {
                    background: rgba(0, 0, 0, 0.5);
                    border-color: #4ade80;
                }

                .pricing-badge {
                    position: absolute;
                    top: 12px;
                    left: 16px;
                    background: rgba(34, 197, 94, 0.9);
                    color: #fff;
                    padding: 4px 10px;
                    border-radius: 999px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    letter-spacing: 0.3px;
                    box-shadow: 0 8px 18px rgba(74, 222, 128, 0.4);
                }

                .pricing-badge.best {
                    background: linear-gradient(45deg, #4ade80, #22c55e);
                }

                .pricing-card h3 {
                    color: #86efac;
                    margin: 0 0 0.5rem;
                    font-size: 1.3rem;
                }

                .price {
                    color: #ffffff;
                    font-size: 1.6rem;
                    font-weight: 800;
                    margin: 0.25rem 0 0.5rem;
                    text-shadow: 0 0 14px rgba(74, 222, 128, 0.4);
                }

                .sub {
                    color: #86efac;
                    opacity: 0.9;
                    margin: 0 0 0.75rem;
                }

                .pricing-features {
                    list-style: none;
                    padding: 0;
                    margin: 0;
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem;
                }

                .pricing-features li {
                    padding: 0.5rem 0.65rem;
                    background: rgba(0, 0, 0, 0.3);
                    border-radius: 10px;
                    border-left: 3px solid #4ade80;
                    color: #ffffff;
                    text-shadow: 0 0 6px rgba(0, 0, 0, 0.35);
                }

                .pricing-note {
                    margin-top: 1.25rem;
                    color: #86efac;
                    font-size: 0.95rem;
                    opacity: 0.9;
                    text-align: center;
                }

                /* Contact & Map */
                .contact-pt-grid {
                    display: grid;
                    grid-template-columns: 1.2fr 1.8fr;
                    gap: 1.5rem;
                    align-items: stretch;
                }

                .contact-pt-info {
                    display: flex;
                    flex-direction: column;
                    gap: 0.75rem;
                }

                .contact-line {
                    margin: 0;
                    color: #ffffff;
                }

                .contact-key {
                    color: #86efac;
                    margin-right: 0.25rem;
                }

                .contact-val {
                    color: #ffffff;
                    font-weight: 600;
                }

                .contact-actions {
                    margin-top: 0.75rem;
                }

                .contact-btn {
                    display: inline-block;
                    color: #fff;
                    text-decoration: none;
                    padding: 0.6rem 1rem;
                    border: 1px solid rgba(74, 222, 128, 0.6);
                    border-radius: 999px;
                    background: rgba(0, 0, 0, 0.3);
                    transition: all 0.25s ease;
                }

                .contact-btn:hover {
                    background: rgba(74, 222, 128, 0.2);
                    border-color: #4ade80;
                    box-shadow: 0 0 20px rgba(74, 222, 128, 0.3);
                }

                .map-wrapper {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    border-radius: 14px;
                    border: 1px solid rgba(74, 222, 128, 0.25);
                    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.4);
                    background: rgba(0,0,0,0.3);
                }

                .map-wrapper iframe {
                    display: block;
                    width: 100%;
                    height: 280px;
                    border: 0;
                }

                .contact-val.link {
                    color: #ffffff;
                    text-decoration: none;
                    border-bottom: 1px dashed rgba(255, 255, 255, 0.4);
                }

                .contact-val.link:hover {
                    color: #86efac;
                    border-bottom-color: #4ade80;
                }

                .contact-socials {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 0.5rem;
                    margin-top: 0.75rem;
                }

                .social-btn {
                    display: inline-block;
                    padding: 0.35rem 0.7rem;
                    border-radius: 999px;
                    text-decoration: none;
                    color: #fff;
                    border: 1px solid rgba(74, 222, 128, 0.5);
                    background: rgba(0, 0, 0, 0.3);
                    transition: all 0.2s ease;
                }

                .social-btn:hover {
                    transform: translateY(-2px);
                    border-color: #4ade80;
                    background: rgba(74, 222, 128, 0.2);
                    box-shadow: 0 4px 15px rgba(74, 222, 128, 0.3);
                }

                @media (max-width: 900px) {
                    .contact-pt-grid {
                        grid-template-columns: 1fr;
                    }
                    .map-wrapper iframe {
                        height: 240px;
                    }
                }

                @media (max-width: 768px) {
                    .workout-title {
                        font-size: 2.5rem;
                    }

                    .workout-container {
                        padding-top: 60px;
                    }

                    .workout-section {
                        padding: 1.5rem;
                    }

                    .profile-section-trainer {
                        padding: 2rem;
                    }

                    .trainer-profile {
                        flex-direction: column;
                        align-items: center;
                        text-align: center;
                    }

                    .trainer-image img {
                        width: 200px;
                        height: 200px;
                    }

                    .workout-grid {
                        grid-template-columns: 1fr;
                    }

                    .method-item {
                        flex-direction: column;
                        gap: 1rem;
                    }

                    .goals-list {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </>
    );
}

