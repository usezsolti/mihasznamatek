import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Privacy() {
    return (
        <>
            <Head>
                <title>Adatvédelmi Tájékoztató - Mihaszna Matek</title>
                <meta name="description" content="Mihaszna Matek - Adatvédelmi tájékoztató" />
            </Head>

            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, rgba(10, 10, 10, 0.9) 0%, rgba(26, 26, 46, 0.9) 50%, rgba(22, 33, 62, 0.9) 100%)',
                color: 'white',
                fontFamily: 'Montserrat, sans-serif',
                padding: '2rem'
            }}>
                <div style={{
                    maxWidth: '900px',
                    margin: '0 auto',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '20px',
                    padding: '3rem',
                    border: '1px solid rgba(57, 255, 20, 0.2)'
                }}>
                    <h1 style={{
                        color: '#39ff14',
                        marginBottom: '2rem',
                        fontSize: '2.5rem',
                        textAlign: 'center'
                    }}>
                        🔒 Adatvédelmi Tájékoztató
                    </h1>

                    <div style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#39ff14', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                1. Adatkezelő
                            </h2>
                            <p style={{ marginBottom: '1rem' }}>
                                <strong>Adatkezelő neve:</strong> Lieszkofszki Zsolt<br />
                                <strong>Email:</strong> usezsolti@gmail.com<br />
                                <strong>Helyszín:</strong> Fót, Szent Imre utca 18
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#39ff14', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                2. Kezelt adatok
                            </h2>
                            <p style={{ marginBottom: '1rem' }}>
                                Az időpontfoglalás során a következő adatokat kezeljük:
                            </p>
                            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                                <li>Név</li>
                                <li>Email cím</li>
                                <li>Iranyítószám</li>
                                <li>Utca és házszám</li>
                                <li>Foglalt időpontok</li>
                                <li>Opcionálisan feltöltött fájlok</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#39ff14', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                3. Adatkezelés célja
                            </h2>
                            <p style={{ marginBottom: '1rem' }}>
                                Az adatok kezelése az időpontfoglalás kezelése, az órák szervezése, 
                                kapcsolattartás és számlázás céljából történik.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#39ff14', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                4. Adatkezelés jogalapja
                            </h2>
                            <p style={{ marginBottom: '1rem' }}>
                                Az adatkezelés jogalapja az érintett hozzájárulása (GDPR 6. cikk (1) bekezdés a) pont).
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#39ff14', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                5. Adatok tárolása
                            </h2>
                            <p style={{ marginBottom: '1rem' }}>
                                Az adatokat a szükséges időtartamig tároljuk, de legfeljebb az időpontfoglalás 
                                lejárásáig vagy az adat törléséig.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#39ff14', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                6. Adatok átadása
                            </h2>
                            <p style={{ marginBottom: '1rem' }}>
                                Az adatokat harmadik félnek nem adjuk át, kivéve, ha ezt törvény előírja.
                                Az email küldéshez EmailJS szolgáltatást használunk, amely a szükséges 
                                adatvédelmi intézkedéseket biztosítja.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#39ff14', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                7. Az érintett jogai
                            </h2>
                            <p style={{ marginBottom: '1rem' }}>
                                Az érintett jogosult:
                            </p>
                            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                                <li>Hozzáférni a saját adataihoz</li>
                                <li>Adatai helyesbítését kérni</li>
                                <li>Adatai törlését kérni</li>
                                <li>Adatkezelés korlátozását kérni</li>
                                <li>Adathordozhatóságot kérni</li>
                                <li>Adatkezelés ellen tiltakozni</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#39ff14', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                8. Kapcsolat
                            </h2>
                            <p style={{ marginBottom: '1rem' }}>
                                Adatvédelmi kérdésekkel kapcsolatban a következő elérhetőségeken lehet felvenni 
                                a kapcsolatot:
                            </p>
                            <p>
                                <strong>Email:</strong> usezsolti@gmail.com
                            </p>
                        </section>

                        
                    </div>

                    <div style={{
                        marginTop: '3rem',
                        paddingTop: '2rem',
                        borderTop: '1px solid rgba(57, 255, 20, 0.3)',
                        textAlign: 'center'
                    }}>
                        <Link href="/booking" style={{
                            color: '#39ff14',
                            textDecoration: 'none',
                            fontSize: '1.1rem',
                            fontWeight: '600'
                        }}>
                            ← Vissza az időpontfoglaláshoz
                        </Link>
                    </div>
                </div>
            </div>
        </>
    );
}

