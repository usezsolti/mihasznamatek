import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function PersonalTrainer() {
    return (
        <>
            <Head>
                <title>Személyi Edzés - Mihaszna Matek</title>
                <meta name="description" content="Személyi edzés - Professzionális személyi edző, edzésprogramok és kondicionálás" />
            </Head>

            <div className="workout-page">
                <div className="workout-container">
                    <div className="workout-header">
                        <h1 className="workout-title">
                            💪 MIHASZNA WORKOUT
                        </h1>
                        <p className="workout-subtitle">
                            So useful workout for your body
                        </p>
                    </div>

                    <div className="workout-content">
                        {/* Bemutatkozás szekció */}
                        <section className="workout-section profile-section-trainer">
                            <div className="trainer-profile">
                                <div className="trainer-image">
                                    <img src="/workout profile.png" alt="Személyi Edző" />
                                </div>
                                <div className="trainer-info">
                                    <h2 className="section-title-workout">Rólam</h2>
                                    <p className="trainer-intro">
                                        Sziasztok csajok/srácok! Zsolti vagyok az új személyi edzőtök, mármint remélem. 
                                        Célom, hogy segítsek elérni az edzési céljaidat, akár erősítésről, 
                                        kondíció javításról, testsúly kezelésről vagy egészséges életmód 
                                        kialakításáról van szó. De ha leszámítjuk a  sablon szöveget a lényeg, 
                                        hogy jó hangulatban együtt nevetve sírva éljük át élményként az edzéseket. 
                                        A mai világ tele van stresszel és mindenkinek meg van a maga problémája, 
                                        azt szeretném edzés közben ezt mindenki elengedhesse és átéljük együtt a MIHASZNA vibe-ot.
                                    </p>
                                    <p className="trainer-intro">
                                        Minden edzésem személyre szabott, figyelembe veszem a jelenlegi 
                                        kondíciód, a korlátaid és a céljaid. Rugalmas időbeosztásban 
                                        dolgozom, hogy könnyen illeszkedjek az életedbe.
                                    </p>
                                </div>
                            </div>
                        </section>

                        {/* Szolgáltatások */}
                        <section className="workout-section">
                            <h2 className="section-title-workout">
                                🏋️ Szolgáltatásaim
                            </h2>
                            <div className="workout-grid">
                                <div className="workout-card">
                                    <div className="workout-card-icon">🥊</div>
                                    <h3>CrossFight</h3>
                                    <p>Harcművészeti elemekkel kombinált funkcionális edzés erőre és állóképességre.</p>
                                </div>

                                <div className="workout-card">
                                    <div className="workout-card-icon">📋</div>
                                    <h3>Személyre szabott edzésterv</h3>
                                    <p>Egyéni célokra, időbeosztásra és edzettségi szintre szabott komplett program.</p>
                                </div>

                                <div className="workout-card">
                                    <div className="workout-card-icon">🏃</div>
                                    <h3>Kardio</h3>
                                    <p>Futás, evezés, bicikli és intervall kardio a szív- és érrendszer fejlesztéséért.</p>
                                </div>

                                <div className="workout-card">
                                    <div className="workout-card-icon">⚡</div>
                                    <h3>HIIT</h3>
                                    <p>Magas intenzitású intervallum edzés gyors zsírégetéssel és kondíciójavítással.</p>
                                </div>

                                <div className="workout-card">
                                    <div className="workout-card-icon">🏋️</div>
                                    <h3>CrossFit</h3>
                                    <p>Komplex, funkcionális mozgások súlyemeléssel és saját testsúllyal, időre és ismétlésre.</p>
                                </div>

                                <div className="workout-card">
                                    <div className="workout-card-icon">🍑</div>
                                    <h3>Farizom-fókuszú női edzések</h3>
                                    <p>Célzott far- és alsótest erősítés formás izomzatért és stabil törzsért.</p>
                                </div>

                                <div className="workout-card">
                                    <div className="workout-card-icon">🏗️</div>
                                    <h3>Powerbuilding</h3>
                                    <p>Erőemelés és testépítés ötvözete: nagy súlyok, izomtömeg és erő fejlesztése.</p>
                                </div>

                                <div className="workout-card">
                                    <div className="workout-card-icon">🧘</div>
                                    <h3>Mobilitás- és tartásjavító edzés</h3>
                                    <p>Ízületi mozgástartomány növelése, stabilitás és testtartás javítása.</p>
                                </div>

                                <div className="workout-card">
                                    <div className="workout-card-icon">👥</div>
                                    <h3>Couple / Friend Workout</h3>
                                    <p>Páros vagy barátos edzések közös motivációval, egymást húzva a célok felé.</p>
                                </div>
                            </div>
                        </section>

                        {/* Csomagok és árak */}
                        <section className="workout-section pricing-section">
                            <h2 className="section-title-workout">💰 Csomagok és árak</h2>
                            <div className="pricing-grid">
                                <div className="pricing-card">
                                    <div className="pricing-badge">Alap</div>
                                    <h3>1 alkalom</h3>
                                    <p className="price">9 500 Ft / 60 perc</p>
                                    <ul className="pricing-features">
                                        <li>Egyéni edzés</li>
                                        <li>Technika javítás</li>
                                        <li>Rövid bemelegítés + levezetés</li>
                                    </ul>
                                </div>

                                <div className="pricing-card highlight">
                                    <div className="pricing-badge best">Legnépszerűbb</div>
                                    <h3>5 alkalmas bérlet</h3>
                                    <p className="price">40 000 Ft</p>
                                    <p className="sub">8 000 Ft / alkalom</p>
                                    <ul className="pricing-features">
                                        <li>5× 60 perces edzés</li>
                                        <li>Személyre szabott terv</li>
                                        <li>Fejlődéskövetés</li>
                                        <li>Technikai javítás</li>
                                    </ul>
                                </div>

                                <div className="pricing-card">
                                    <div className="pricing-badge">Pro</div>
                                    <h3>10 alkalmas bérlet</h3>
                                    <p className="price">75 000 Ft</p>
                                    <p className="sub">7 500 Ft / alkalom</p>
                                    <ul className="pricing-features">
                                        <li>10× 60 perces edzés</li>
                                        <li>Részletes edzésterv</li>
                                        <li>Fejlődéskövetés</li>
                                        <li>Technikai javítás</li>
                                    </ul>
                                </div>

                                <div className="pricing-card">
                                    <div className="pricing-badge">Páros</div>
                                    <h3>Couple / Friend Workout</h3>
                                    <p className="price">15 000 Ft / 60 perc / 2 fő</p>
                                    <ul className="pricing-features">
                                        <li>Közös motiváció</li>
                                        <li>Partner gyakorlatok</li>
                                        <li>Rugalmas időpontok</li>
                                    </ul>
                                </div>

                                <div className="pricing-card">
                                    <div className="pricing-badge">Online</div>
                                    <h3>Online Coaching (havi)</h3>
                                    <p className="price">29 000 Ft / hónap</p>
                                    <ul className="pricing-features">
                                        <li>Heti edzésterv</li>
                                        <li>Chat támogatás</li>
                                        <li>Havi konzultáció</li>
                                    </ul>
                                </div>
                            </div>

                            <p className="pricing-note">Az árak tájékoztató jellegűek. A bérletek 8 hétig érvényesek.</p>
                        </section>

                        {/* Kapcsolat és helyszín */}
                        <section className="workout-section contact-pt">
                            <h2 className="section-title-workout">📍 Kapcsolat és helyszín</h2>
                            <div className="contact-pt-grid">
                                <div className="contact-pt-info">
                                    <p className="contact-line"><span className="contact-key">Helyszín:</span> <span className="contact-val">X1 Gym — 2151 Fót, Keleti Márton utca 7.</span></p>
                                    <p className="contact-line"><span className="contact-key">Edzések:</span> <span className="contact-val">egyéni és páros alkalmak előre egyeztetett időpontban</span></p>
                                    <p className="contact-line"><span className="contact-key">Telefon:</span> <a className="contact-val link" href="tel:+36308935495">+36 30 893 5495</a></p>
                                    <p className="contact-line"><span className="contact-key">E‑mail:</span> <a className="contact-val link" href="mailto:usezsolti@gmail.com">usezsolti@gmail.com</a></p>
                                    <div className="contact-actions">
                                        <a className="contact-btn" href="https://www.google.com/maps?q=2151+F%C3%B3t,+Keleti+M%C3%A1rton+utca+7&hl=hu" target="_blank" rel="noopener noreferrer">Megnyitás Google Térképen</a>
                                    </div>

                                    <div className="contact-socials">
                                        <a className="social-btn facebook" href="https://www.facebook.com/profile.php?id=100075272401924" target="_blank" rel="noopener noreferrer">Facebook</a>
                                        <a className="social-btn instagram" href="https://www.instagram.com/mihaszna__/" target="_blank" rel="noopener noreferrer">Instagram</a>
                                        <a className="social-btn youtube" href="https://www.youtube.com/@Mihasznamatek" target="_blank" rel="noopener noreferrer">YouTube</a>
                                        <a className="social-btn tiktok" href="https://tiktok.com/@mihasznamatek" target="_blank" rel="noopener noreferrer">TikTok</a>
                                    </div>
                                </div>
                                <div className="contact-pt-map">
                                    <div className="map-wrapper">
                                        <iframe
                                            title="X1 Gym - Fót, Keleti Márton utca 7"
                                            src="https://www.google.com/maps?q=2151+F%C3%B3t,+Keleti+M%C3%A1rton+utca+7&output=embed"
                                            loading="lazy"
                                            referrerPolicy="no-referrer-when-downgrade"
                                        />
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* Edzési módszerek */}
                        <section className="workout-section">
                            <h2 className="section-title-workout">
                                🎯 Hogyan dolgozom?
                            </h2>
                            <div className="method-list">
                                <div className="method-item">
                                    <span className="method-icon">1️⃣</span>
                                    <div className="method-content">
                                        <h3>Kezdeti értékelés</h3>
                                        <p>Először megbeszéljük a céljaidat, a jelenlegi kondíciód és a korlátaidat.</p>
                                    </div>
                                </div>
                                <div className="method-item">
                                    <span className="method-icon">2️⃣</span>
                                    <div className="method-content">
                                        <h3>Egyedi edzési terv</h3>
                                        <p>Készítek neked egy személyre szabott edzési tervet, ami illeszkedik az életedhez.</p>
                                    </div>
                                </div>
                                <div className="method-item">
                                    <span className="method-icon">3️⃣</span>
                                    <div className="method-content">
                                        <h3>Közös edzések</h3>
                                        <p>Részletes instrukciókkal vezetlek az edzésen, biztosítva a helyes technikát és biztonságot.</p>
                                    </div>
                                </div>
                                <div className="method-item">
                                    <span className="method-icon">4️⃣</span>
                                    <div className="method-content">
                                        <h3>Folyamatos követés</h3>
                                        <p>Követjük a fejlődésedet és szükség szerint módosítjuk az edzési tervet.</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        

                        
                    </div>

                    <div className="workout-footer">
                        <Link href="/" className="workout-back-link">
                            ← Vissza a főoldalra
                        </Link>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .workout-page {
                    min-height: 100vh;
                    /* Red overlay + workout bck.png image */
                    background-image:
                        linear-gradient(135deg, rgba(26,10,10,0.85) 0%, rgba(45,27,27,0.85) 30%, rgba(61,42,42,0.85) 60%, rgba(26,10,10,0.85) 100%),
                        url('/workout%20bck.png');
                    background-size: cover, cover;
                    background-position: center center, center center;
                    background-repeat: no-repeat, no-repeat;
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
                    color: #ff6b6b;
                    font-size: 3.5rem;
                    font-weight: 700;
                    margin-bottom: 1rem;
                    text-shadow: 0 0 20px rgba(255, 107, 107, 0.5),
                                0 0 40px rgba(255, 107, 107, 0.3);
                }

                .workout-subtitle {
                    color: #ffcccc;
                    font-size: 1.3rem;
                    font-weight: 400;
                }

                .workout-content {
                    display: flex;
                    flex-direction: column;
                    gap: 3rem;
                }

                .workout-section {
                    background: rgba(255, 255, 255, 0.05);
                    backdrop-filter: blur(10px);
                    border-radius: 20px;
                    padding: 2.5rem;
                    border: 1px solid rgba(255, 107, 107, 0.2);
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
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
                    border: 4px solid #ff6b6b;
                    box-shadow: 0 0 30px rgba(255, 107, 107, 0.4);
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
                    color: #ff6b6b;
                    font-size: 2rem;
                    font-weight: 700;
                    margin-bottom: 2rem;
                    text-shadow: 0 0 10px rgba(255, 107, 107, 0.3);
                }

                .workout-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
                    gap: 2rem;
                }

                .workout-card {
                    background: rgba(255, 255, 255, 0.08);
                    backdrop-filter: blur(10px);
                    border-radius: 15px;
                    padding: 2rem;
                    border: 1px solid rgba(255, 107, 107, 0.3);
                    text-align: center;
                    transition: all 0.3s ease;
                    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
                }

                .workout-card:hover {
                    transform: translateY(-5px);
                    border-color: #ff6b6b;
                    box-shadow: 0 8px 30px rgba(255, 107, 107, 0.3);
                }

                .workout-card-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }

                .workout-card h3 {
                    color: #ffcccc;
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
                    background: rgba(255, 255, 255, 0.05);
                    padding: 2rem;
                    border-radius: 15px;
                    border-left: 4px solid #ff6b6b;
                    transition: all 0.3s ease;
                }

                .method-item:hover {
                    background: rgba(255, 255, 255, 0.08);
                    transform: translateX(5px);
                }

                .method-icon {
                    font-size: 2rem;
                    flex-shrink: 0;
                }

                .method-content h3 {
                    color: #ffcccc;
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
                    background: rgba(255, 255, 255, 0.05);
                    padding: 1rem 1.5rem;
                    border-radius: 10px;
                    border-left: 3px solid #ff6b6b;
                    color: #ffffff;
                    font-size: 1.1rem;
                }

                .goal-icon {
                    color: #ff6b6b;
                    font-weight: 700;
                    font-size: 1.3rem;
                }

                .workout-footer {
                    margin-top: 4rem;
                    padding-top: 2rem;
                    border-top: 1px solid rgba(255, 107, 107, 0.3);
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
                    color: #ffcccc;
                    text-shadow: 0 0 10px rgba(255, 107, 107, 0.5);
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
                    background: rgba(255, 255, 255, 0.06);
                    border: 1px solid rgba(255, 107, 107, 0.25);
                    border-radius: 18px;
                    padding: 2.25rem 1.75rem 1.75rem;
                    box-shadow: 0 6px 24px rgba(0, 0, 0, 0.25);
                    position: relative;
                    transition: all 0.3s ease;
                }

                .pricing-card:hover {
                    transform: translateY(-4px);
                    box-shadow: 0 12px 36px rgba(255, 107, 107, 0.25);
                    border-color: #ff6b6b;
                }

                .pricing-card.highlight {
                    background: rgba(255, 255, 255, 0.08);
                    border-color: #ff6b6b;
                }

                .pricing-badge {
                    position: absolute;
                    top: 12px;
                    left: 16px;
                    background: rgba(255, 107, 107, 0.9);
                    color: #fff;
                    padding: 4px 10px;
                    border-radius: 999px;
                    font-size: 0.8rem;
                    font-weight: 700;
                    letter-spacing: 0.3px;
                    box-shadow: 0 8px 18px rgba(255, 107, 107, 0.35);
                }

                .pricing-badge.best {
                    background: linear-gradient(45deg, #ff6b6b, #ff9a9a);
                }

                .pricing-card h3 {
                    color: #ffcccc;
                    margin: 0 0 0.5rem;
                    font-size: 1.3rem;
                }

                .price {
                    color: #ffffff;
                    font-size: 1.6rem;
                    font-weight: 800;
                    margin: 0.25rem 0 0.5rem;
                    text-shadow: 0 0 14px rgba(255, 107, 107, 0.35);
                }

                .sub {
                    color: #ffcccc;
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
                    background: rgba(255, 255, 255, 0.12);
                    border-radius: 10px;
                    border-left: 3px solid #ff8080;
                    color: #ffffff;
                    text-shadow: 0 0 6px rgba(0, 0, 0, 0.35);
                }

                .pricing-note {
                    margin-top: 1.25rem;
                    color: #ffcccc;
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
                    color: #ffcccc;
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
                    border: 1px solid rgba(255, 107, 107, 0.6);
                    border-radius: 999px;
                    background: rgba(255, 255, 255, 0.06);
                    transition: all 0.25s ease;
                }

                .contact-btn:hover {
                    background: rgba(255, 107, 107, 0.2);
                    border-color: #ff6b6b;
                }

                .map-wrapper {
                    position: relative;
                    overflow: hidden;
                    width: 100%;
                    border-radius: 14px;
                    border: 1px solid rgba(255, 107, 107, 0.25);
                    box-shadow: 0 8px 28px rgba(0, 0, 0, 0.25);
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
                    color: #ffcccc;
                    border-bottom-color: #ff6b6b;
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
                    border: 1px solid rgba(255, 107, 107, 0.5);
                    background: rgba(255, 255, 255, 0.06);
                    transition: all 0.2s ease;
                }

                .social-btn:hover {
                    transform: translateY(-2px);
                    border-color: #ff6b6b;
                    background: rgba(255, 107, 107, 0.18);
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

