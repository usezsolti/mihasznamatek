import Head from "next/head";
import Link from "next/link";
import CookieBanner from "../components/CookieBanner";

export default function Privacy() {
    return (
        <>
            <Head>
                <title>Adatvédelmi Tájékoztató - Mihaszna Matek</title>
                <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
            </Head>

            <div style={{
                minHeight: '100vh',
                background: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%)',
                fontFamily: 'Montserrat, sans-serif',
                padding: '20px'
            }}>
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto',
                    background: 'rgba(255,255,255,0.05)',
                    borderRadius: '20px',
                    padding: '40px',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                }}>
                    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                        <h1 style={{
                            fontSize: '32px',
                            color: '#39FF14',
                            margin: '0 0 10px 0',
                            fontWeight: '700'
                        }}>
                            Adatvédelmi Tájékoztató
                        </h1>
                        <p style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '16px',
                            margin: '0'
                        }}>
                            Mihaszna Matek - Matematika Oktatási Platform
                        </p>
                        <p style={{
                            color: 'rgba(255,255,255,0.6)',
                            fontSize: '14px',
                            margin: '10px 0 0 0'
                        }}>
                            Hatályos: 2024. január 1-től
                        </p>
                    </div>

                    <div style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '14px',
                        lineHeight: '1.8'
                    }}>
                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            1. Adatkezelő adatai
                        </h2>
                        <p>
                            <strong>Név:</strong> Mihaszna Matek<br />
                            <strong>Székhely:</strong> Magyarország<br />
                            <strong>E-mail:</strong> mihaszna.math@gmail.com<br />
                            <strong>Adatvédelemért felelős:</strong> mihaszna.math@gmail.com
                        </p>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            2. Kezelt személyes adatok
                        </h2>
                        <p>A regisztráció során a következő adatokat kezeljük:</p>
                        <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
                            <li><strong>Név:</strong> vezetéknév és keresztnév</li>
                            <li><strong>E-mail cím:</strong> bejelentkezéshez és kommunikációhoz</li>
                            <li><strong>Telefonszám:</strong> kapcsolattartáshoz</li>
                            <li><strong>Cím:</strong> irányítószám, város, utca, házszám, ajtó/emelet</li>
                            <li><strong>Oktatási szint:</strong> általános iskola, középiskola, felsőoktatás, felnőtt</li>
                            <li><strong>Segítség leírása:</strong> matematikai témakörök</li>
                            <li><strong>Hobby/érdeklődés:</strong> opcionális</li>
                            <li><strong>Profilkép:</strong> opcionális, feltöltött kép</li>
                        </ul>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            3. Adatkezelés célja és jogalapja
                        </h2>
                        <p><strong>Adatkezelés céljai:</strong></p>
                        <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
                            <li>Matematika oktatási szolgáltatás nyújtása</li>
                            <li>Felhasználói fiók kezelése</li>
                            <li>Kapcsolattartás a felhasználóval</li>
                            <li>Szolgáltatás fejlesztése</li>
                            <li>Jogi kötelezettségek teljesítése</li>
                        </ul>
                        <p><strong>Jogalap:</strong> Az érintett hozzájárulása (GDPR 6. cikk (1) a) pont)</p>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            4. Adatkezelés időtartama
                        </h2>
                        <p>
                            A személyes adatokat a fiók aktív használata alatt kezeljük.
                            A fiók törlése esetén az adatok 30 napon belül véglegesen törlődnek,
                            kivéve a jogszabályi kötelezettségek miatt megőrzendő adatokat.
                        </p>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            5. Adatfeldolgozók
                        </h2>
                        <p>
                            Adatfeldolgozóként a következő szolgáltatókat használjuk:
                        </p>
                        <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
                            <li><strong>Firebase (Google):</strong> felhasználói hitelesítés és adatbázis</li>
                            <li><strong>Vercel:</strong> weboldal üzemeltetés</li>
                            <li><strong>LocalStorage:</strong> helyi adattárolás</li>
                        </ul>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            6. Az érintett jogai
                        </h2>
                        <p>Az érintett a következő jogokkal rendelkezik:</p>
                        <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
                            <li><strong>Hozzáférési jog:</strong> tájékoztatást kap a kezelt adatokról</li>
                            <li><strong>Helyesbítés:</strong> pontatlan adatok helyesbítését kérheti</li>
                            <li><strong>Törlés:</strong> adatainak törlését kérheti</li>
                            <li><strong>Adatkezelés korlátozása:</strong> adatkezelés korlátozását kérheti</li>
                            <li><strong>Adathordozhatóság:</strong> adatainak másolását kérheti</li>
                            <li><strong>Tiltakozás:</strong> adatkezelés ellen tiltakozhat</li>
                            <li><strong>Hogyan:</strong> e-mailben: mihaszna.math@gmail.com</li>
                        </ul>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            7. Adatbiztonság
                        </h2>
                        <p>
                            Az adatok védelme érdekében megfelelő technikai és szervezési
                            intézkedéseket alkalmazunk:
                        </p>
                        <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
                            <li>SSL titkosítás minden adatátvitelnél</li>
                            <li>Erős jelszó követelmények</li>
                            <li>Rendszeres biztonsági ellenőrzések</li>
                            <li>Korlátozott hozzáférés az adatokhoz</li>
                        </ul>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            8. Cookie-k használata
                        </h2>
                        <p>
                            A weboldal működéséhez szükséges cookie-kat használunk.
                            Ezek nem tartalmaznak személyes adatokat, és a böngésző
                            bezárásakor automatikusan törlődnek.
                        </p>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            9. Harmadik felek
                        </h2>
                        <p>
                            Személyes adatokat harmadik feleknek nem adunk át, kivéve:
                        </p>
                        <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
                            <li>Az érintett előzetes hozzájárulása esetén</li>
                            <li>Jogszabályi kötelezettség teljesítése érdekében</li>
                            <li>Az adatfeldolgozókkal való együttműködés keretében</li>
                        </ul>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            10. Jogorvoslat
                        </h2>
                        <p>
                            Az érintett panaszt tehet az adatvédelmi hatóságnál (NAIH),
                            vagy bírósághoz fordulhat az adatvédelmi jogainak érvényesítése érdekében.
                        </p>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            11. Kapcsolat
                        </h2>
                        <p>
                            Adatvédelmi kérdésekben az alábbi elérhetőségen forduljon hozzánk:
                        </p>

                        <div style={{
                            marginTop: '20px',
                            padding: '20px',
                            background: 'rgba(57, 255, 20, 0.1)',
                            borderRadius: '12px',
                            border: '1px solid rgba(57, 255, 20, 0.3)'
                        }}>
                            <p style={{ margin: '0 0 10px 0', color: 'white', fontWeight: '600' }}>
                                Mihaszna Matek
                            </p>
                            <p style={{ margin: '0 0 5px 0', color: 'rgba(255,255,255,0.9)' }}>
                                E-mail: mihaszna.math@gmail.com
                            </p>
                            <p style={{ margin: '0', color: 'rgba(255,255,255,0.9)' }}>
                                Adatvédelmi kérdések: mihaszna.math@gmail.com
                            </p>
                        </div>

                        <div style={{
                            marginTop: '30px',
                            padding: '15px',
                            background: 'rgba(255,255,255,0.05)',
                            borderRadius: '8px',
                            border: '1px solid rgba(255,255,255,0.1)'
                        }}>
                            <p style={{ margin: '0', fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}>
                                <strong>Fontos:</strong> Ez a tájékoztató a GDPR (2016/679 EU Rendelet)
                                és a magyar adatvédelmi jogszabályok szerint készült.
                                A regisztrációval az érintett elfogadja ezt az adatvédelmi tájékoztatót.
                            </p>
                        </div>
                    </div>

                    <div style={{
                        textAlign: 'center',
                        marginTop: '40px',
                        paddingTop: '20px',
                        borderTop: '1px solid rgba(255,255,255,0.1)'
                    }}>
                        <Link href="/" style={{
                            color: '#39FF14',
                            textDecoration: 'none',
                            fontWeight: '600',
                            fontSize: '16px'
                        }}>
                            ← Vissza a főoldalra
                        </Link>
                    </div>
                </div>
            </div>

            {/* Cookie Banner */}
            <CookieBanner />
        </>
    );
}
