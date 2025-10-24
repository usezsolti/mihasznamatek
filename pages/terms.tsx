import Head from "next/head";
import Link from "next/link";
import CookieBanner from "../components/CookieBanner";

export default function Terms() {
    return (
        <>
            <Head>
                <title>Szabályzat - Mihaszna Matek</title>
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
                            Szabályzat
                        </h1>
                        <p style={{
                            color: 'rgba(255,255,255,0.7)',
                            fontSize: '16px',
                            margin: '0'
                        }}>
                            Mihaszna Matek - Matematika Oktatási Platform
                        </p>
                    </div>

                    <div style={{
                        color: 'rgba(255,255,255,0.9)',
                        fontSize: '14px',
                        lineHeight: '1.8'
                    }}>
                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            1. Általános rendelkezések
                        </h2>
                        <p>
                            Ez a szabályzat a Mihaszna Matek matematika oktatási platform használatát szabályozza.
                            A platform használatával a felhasználó elfogadja ezeket a feltételeket.
                        </p>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            2. Szolgáltatás leírása
                        </h2>
                        <p>
                            A Mihaszna Matek matematika oktatási platform, amely:
                        </p>
                        <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
                            <li>Matematika oktatási szolgáltatásokat nyújt</li>
                            <li>Online regisztrációt és profilkezelést biztosít</li>
                            <li>Oktatási szint szerinti csoportosítást alkalmaz</li>
                            <li>Profilkép feltöltési lehetőséget ad</li>
                        </ul>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            3. Regisztráció és fiók
                        </h2>
                        <p>
                            A szolgáltatás használatához regisztráció szükséges. A regisztráció során:
                        </p>
                        <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
                            <li>Valós adatokat kell megadni</li>
                            <li>Erős jelszót kell választani (min. 8 karakter, kis- és nagybetű, szám, speciális karakter)</li>
                            <li>Érvényes telefonszámot kell megadni</li>
                            <li>Pontos címinformációkat kell megadni</li>
                            <li>Profilképet lehet feltölteni</li>
                        </ul>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            4. Felhasználói kötelezettségek
                        </h2>
                        <p>A felhasználó köteles:</p>
                        <ul style={{ marginLeft: '20px', marginBottom: '20px' }}>
                            <li>Valós és pontos adatokat megadni</li>
                            <li>A fiókját biztonságosan kezelni</li>
                            <li>Nem osztani meg jelszavát harmadik személyekkel</li>
                            <li>Nem használni a szolgáltatást jogellenes célokra</li>
                            <li>Tiszteletben tartani más felhasználók jogait</li>
                        </ul>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            5. Adatkezelés
                        </h2>
                        <p>
                            Az adatkezelésről részletes információt az Adatvédelmi Tájékoztatóban talál.
                            A regisztrációval a felhasználó elfogadja az adatkezelési feltételeket.
                        </p>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            6. Szolgáltatás módosítása
                        </h2>
                        <p>
                            A szolgáltató fenntartja a jogot a szolgáltatás módosítására,
                            fejlesztésére vagy megszüntetésére. A változásokról a felhasználókat
                            előzetesen értesítjük.
                        </p>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            7. Felelősség korlátozása
                        </h2>
                        <p>
                            A szolgáltató felelőssége a szolgáltatás használatából eredő
                            károkért kizárható, kivéve a szándékos vagy súlyos gondatlanságból
                            eredő károkat.
                        </p>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            8. Fiók megszüntetése
                        </h2>
                        <p>
                            A felhasználó bármikor megszüntetheti fiókját. A szolgáltató
                            fenntartja a jogot a szabályzat megsértése esetén a fiók
                            felfüggesztésére vagy megszüntetésére.
                        </p>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            9. Jogviták rendezése
                        </h2>
                        <p>
                            A jelen szabályzatból eredő jogviták rendezésére a magyar
                            bíróságok rendelkeznek illetékességgel, a magyar jog szerint.
                        </p>

                        <h2 style={{ color: '#39FF14', fontSize: '20px', marginTop: '30px', marginBottom: '15px' }}>
                            10. Érvényesség
                        </h2>
                        <p>
                            Ez a szabályzat 2024. január 1-jétől hatályos.
                            A szolgáltató fenntartja a jogot a szabályzat módosítására,
                            amelyről a felhasználókat értesítjük.
                        </p>

                        <div style={{
                            marginTop: '40px',
                            padding: '20px',
                            background: 'rgba(57, 255, 20, 0.1)',
                            borderRadius: '12px',
                            border: '1px solid rgba(57, 255, 20, 0.3)'
                        }}>
                            <p style={{ margin: '0', color: 'white', fontWeight: '600' }}>
                                Kapcsolat: mihaszna.math@gmail.com
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
