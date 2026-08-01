import React from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function Terms() {
    return (
        <>
            <Head>
                <title>Szabályzat - Mihaszna Matek</title>
                <meta name="description" content="Mihaszna Matek - Időpontfoglalási szabályzat" />
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
                        📋 Időpontfoglalási Szabályzat
                    </h1>

                    <div style={{ lineHeight: '1.8', fontSize: '1.1rem' }}>
                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#39ff14', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                1. Általános rendelkezések
                            </h2>
                            <p style={{ marginBottom: '1rem' }}>
                                Ez a szabályzat a Mihaszna Matek időpontfoglalási rendszerének használatára vonatkozik. 
                                A szabályzat elfogadása kötelező az időpontfoglaláshoz.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#39ff14', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                2. Időpontfoglalás
                            </h2>
                            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                                <li>Az időpontfoglalás online formon keresztül történik</li>
                                <li>A foglalás csak akkor érvényes, ha minden kötelező mezőt kitöltöttél</li>
                                <li>A foglalás megerősítését emailben kapod meg</li>
                                <li>Az időpontfoglalás nem automatikusan jelent foglalást, hanem foglalási kérést</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#39ff14', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                3. Lemondási szabályok
                            </h2>
                            <p style={{ marginBottom: '1rem' }}>
                                <strong>24 órával előtte lemondható:</strong> Ha legalább 24 órával előbb lemondod az órát, 
                                nem számítunk fel díjat.
                            </p>
                            <p style={{ marginBottom: '1rem' }}>
                                <strong>24 órán belül:</strong> Ha 24 órán belül mondod le az órát, a teljes díjat felszámoljuk.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#39ff14', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                4. Fizetés
                            </h2>
                            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                                <li>Fizetés készpénzzel vagy banki utalással lehetséges</li>
                                <li>Utalás esetén: Lieszkofszki Zsolt</li>
                                <li>Számlaszám: 10401000-86765086-50861000</li>
                                <li>Közlemény: Számla sorszáma</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#39ff14', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                5. Árak
                            </h2>
                            <p style={{ marginBottom: '1rem' }}>
                                <strong>Ár:</strong> 11.000 Ft / 60 perc (5500 Ft / 30 perc)
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#39ff14', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                6. Helyszín
                            </h2>
                            <ul style={{ marginLeft: '1.5rem', marginBottom: '1rem' }}>
                                <li><strong>Online óra:</strong> Microsoft Teams-en keresztül</li>
                                <li><strong>Személyes óra:</strong> Fót, Szent Imre utca 18</li>
                            </ul>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#39ff14', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                7. Fájl feltöltés
                            </h2>
                            <p style={{ marginBottom: '1rem' }}>
                                Az opcionálisan feltöltött fájlokat a Dropbox mappába kell feltölteni. 
                                A fájlok feltöltését a foglalás után automatikusan megnyitott Dropbox mappában végezheted el.
                            </p>
                        </section>

                        <section style={{ marginBottom: '2rem' }}>
                            <h2 style={{ color: '#39ff14', marginBottom: '1rem', fontSize: '1.5rem' }}>
                                8. Egyéb rendelkezések
                            </h2>
                            <p style={{ marginBottom: '1rem' }}>
                                A szabályzat módosítása jogfenntartással történik. A változásokról az oldalon keresztül 
                                tájékoztatjuk a felhasználókat.
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

