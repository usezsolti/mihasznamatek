import Head from "next/head";
import Link from "next/link";

/**
 * Adatkezelési tájékoztató (GDPR / Infotv.).
 * Sablon jellegű, a szolgáltatásra szabott szöveg — jogi ellenőrzés javasolt.
 */
export default function AdatkezelesiTajekoztatoPage() {
    const updated = "2026. augusztus 3.";

    return (
        <>
            <Head>
                <title>Adatkezelési tájékoztató | Mihaszna Matek</title>
                <meta
                    name="description"
                    content="Mihaszna Matek adatkezelési tájékoztató – GDPR, cookie-k, érintetti jogok."
                />
                <meta name="robots" content="index,follow" />
            </Head>

            <main className="legal-page">
                <div className="legal-wrap">
                    <p className="legal-back">
                        <Link href="/">← Vissza a főoldalra</Link>
                    </p>
                    <h1>Adatkezelési tájékoztató</h1>
                    <p className="legal-meta">
                        Hatályos: {updated} · Mihaszna Matek (matematika magánoktatás)
                    </p>

                    <p>
                        Jelen tájékoztató az Európai Unió Általános Adatvédelmi Rendelete (GDPR –
                        2016/679/EU rendelet), valamint az információs önrendelkezési jogról és az
                        információszabadságról szóló 2011. évi CXII. törvény (Infotv.) alapján
                        készült. Célja, hogy átláthatóan bemutassa, hogyan kezeljük személyes
                        adatait a <strong>mihasznamatek.hu</strong> weboldalon és a kapcsolódó
                        szolgáltatások során.
                    </p>

                    <h2>1. Adatkezelő</h2>
                    <p>
                        <strong>Név:</strong> Lieszkofszki Zsolt (egyéni oktató / szolgáltató)
                        <br />
                        <strong>Márkanév:</strong> Mihaszna Matek
                        <br />
                        <strong>Székhely / oktatási helyszín:</strong> 2151 Fót, Szent Imre utca 18.
                        <br />
                        <strong>E-mail:</strong>{" "}
                        <a href="mailto:usezsolti@gmail.com">usezsolti@gmail.com</a>
                        <br />
                        <strong>Weboldal:</strong>{" "}
                        <a href="https://mihasznamatek.hu">https://mihasznamatek.hu</a>
                    </p>
                    <p>
                        Az adatkezelő a személyes adatok kezelésének céljait és eszközeit
                        önállóan vagy másokkal együttesen meghatározza, és felelős a jogszerű
                        adatkezelésért.
                    </p>

                    <h2>2. A tájékoztató hatálya</h2>
                    <p>A tájékoztató kiterjed különösen:</p>
                    <ul>
                        <li>a weboldal látogatására és böngészésére;</li>
                        <li>regisztrációra és bejelentkezésre (e-mail/jelszó, Google);</li>
                        <li>óra-időpont foglalására és lemondására;</li>
                        <li>oktatási anyagok, feladatok, csatolmányok kezelésére;</li>
                        <li>e-mailes és egyéb elektronikus kapcsolattartásra;</li>
                        <li>cookie-k és hasonló technológiák használatára;</li>
                        <li>számlázási / fizetési adminisztrációhoz szükséges adatokra.</li>
                    </ul>

                    <h2>3. Fogalmak (röviden)</h2>
                    <ul>
                        <li>
                            <strong>Személyes adat:</strong> azonosított vagy azonosítható
                            természetes személyre vonatkozó bármely információ.
                        </li>
                        <li>
                            <strong>Érintett:</strong> akire a személyes adat vonatkozik (Ön).
                        </li>
                        <li>
                            <strong>Adatkezelés:</strong> a személyes adatokon végzett bármely
                            művelet (gyűjtés, tárolás, továbbítás, törlés stb.).
                        </li>
                        <li>
                            <strong>Adatfeldolgozó:</strong> aki az adatkezelő nevében kezel
                            adatokat (pl. tárhely-, e-mail-, hitelesítési szolgáltató).
                        </li>
                    </ul>

                    <h2>4. Az adatkezelés céljai és jogalapjai</h2>
                    <div className="legal-table-wrap">
                        <table className="legal-table">
                            <thead>
                                <tr>
                                    <th>Cél</th>
                                    <th>Példa adatok</th>
                                    <th>Jogalap (GDPR)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>Fiók létrehozása, bejelentkezés</td>
                                    <td>név, e-mail, jelszó hash / Google azonosító</td>
                                    <td>
                                        szerződés teljesítése (6. cikk (1) b)), illetve
                                        hozzájárulás (6. cikk (1) a))
                                    </td>
                                </tr>
                                <tr>
                                    <td>Órafoglalás, egyeztetés, emlékeztető</td>
                                    <td>név, e-mail, időpont, óratípus, tárgy, hobbi</td>
                                    <td>szerződés teljesítése / szerződéskötést megelőző lépések</td>
                                </tr>
                                <tr>
                                    <td>Számlázás, fizetés nyomon követése</td>
                                    <td>számlázási cím, fizetési státusz</td>
                                    <td>
                                        szerződés; jogi kötelezettség (számvitel) – 6. cikk (1)
                                        c)
                                    </td>
                                </tr>
                                <tr>
                                    <td>Oktatás, feladatkiosztás, csatolmányok</td>
                                    <td>feltöltött fájlok, tanulási eredmények</td>
                                    <td>szerződés teljesítése</td>
                                </tr>
                                <tr>
                                    <td>Kapcsolattartás, ügyfélszolgálat</td>
                                    <td>e-mail, üzenet tartalma</td>
                                    <td>
                                        jogos érdek (6. cikk (1) f)) és/vagy szerződés
                                    </td>
                                </tr>
                                <tr>
                                    <td>Biztonság, visszaélések megelőzése</td>
                                    <td>naplók, IP (szolgáltatói szinten), rate limit</td>
                                    <td>jogos érdek</td>
                                </tr>
                                <tr>
                                    <td>Weboldal működés, analitika (ha van)</td>
                                    <td>cookie-azonosítók, használati adatok</td>
                                    <td>
                                        hozzájárulás (nem feltétlenül szükséges cookie-k),
                                        jogos érdek (szigorúan szükséges cookie-k)
                                    </td>
                                </tr>
                                <tr>
                                    <td>Marketing / hírlevél (csak ha külön kérjük)</td>
                                    <td>e-mail</td>
                                    <td>hozzájárulás – visszavonható</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <p>
                        A hozzájáruláson alapuló adatkezelés esetén a hozzájárulás bármikor
                        visszavonható (pl. e-mailben). A visszavonás nem érinti a visszavonás
                        előtti jogszerű adatkezelést.
                    </p>

                    <h2>5. Kezelt személyes adatok köre</h2>
                    <p>Az alábbi adatokat kezelhetjük – a szolgáltatás igénybevételétől függően:</p>
                    <ul>
                        <li>
                            <strong>Azonosító és kapcsolattartási adatok:</strong> név, e-mail
                            cím, (opcionálisan) telefonszám, ha Ön megadja.
                        </li>
                        <li>
                            <strong>Fiókadatok:</strong> Firebase felhasználói azonosító (UID),
                            profilkép URL, e-mail-megerősítés státusza, bejelentkezési mód.
                        </li>
                        <li>
                            <strong>Foglalási adatok:</strong> dátum, időpont(ok), óra típusa
                            (online / személyes), választott témakör, megjegyzés/hobbi,
                            státusz (függőben, elfogadva, elutasítva, lemondva).
                        </li>
                        <li>
                            <strong>Számlázási adatok:</strong> irányítószám, utca, házszám;
                            fizetés módjára / státuszára vonatkozó adminisztratív jelölések.
                        </li>
                        <li>
                            <strong>Oktatási tartalom:</strong> Ön által feltöltött fájlok
                            (pl. PDF, kép, dokumentum), kiosztott feladatok, játék-/tanulási
                            eredmények.
                        </li>
                        <li>
                            <strong>Technikai adatok:</strong> böngésző típusa, eszközadatok,
                            cookie-k, naplózott hibák; a tárhely- és biztonsági szolgáltatók
                            szinten IP-cím és hasonló hálózati adatok.
                        </li>
                    </ul>
                    <p>
                        Különleges személyes adatokat (pl. egészségügyi adat) szándékosan nem
                        kérünk. Kérjük, ilyen adatot ne töltsön fel a csatolmányok közé.
                    </p>

                    <h2>6. Adatok forrása</h2>
                    <ul>
                        <li>közvetlenül Öntől (űrlapok, regisztráció, foglalás, e-mail);</li>
                        <li>
                            Google-fiókból, ha Google-belépést választ (név, e-mail, profilkép –
                            a Google által átadott körben);
                        </li>
                        <li>automatikusan a weboldal használata során (cookie-k, naplók).</li>
                    </ul>

                    <h2>7. Adattovábbítás, címzettek, adatfeldolgozók</h2>
                    <p>
                        Személyes adatait harmadik félnek üzleti céllal nem adjuk el. Az
                        alábbi szolgáltatók vehetnek részt az adatkezelésben adatfeldolgozóként
                        vagy önálló adatkezelőként (saját feltételeik szerint):
                    </p>
                    <ul>
                        <li>
                            <strong>Google Firebase / Google Cloud</strong> – hitelesítés,
                            adatbázis (Firestore), fájltárolás (Storage), esetleg Analytics.
                            Székhely: USA / EU régiók a beállítások szerint.{" "}
                            <a
                                href="https://firebase.google.com/support/privacy"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Firebase adatvédelem
                            </a>
                        </li>
                        <li>
                            <strong>Vercel Inc.</strong> – weboldal hosztolás és szerverless API.{" "}
                            <a
                                href="https://vercel.com/legal/privacy-policy"
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Vercel privacy
                            </a>
                        </li>
                        <li>
                            <strong>E-mail kézbesítés</strong> – pl. Gmail SMTP / egyéb
                            e-mail-szolgáltató a foglalási és rendszerüzenetekhez.
                        </li>
                        <li>
                            <strong>Google (OAuth / Google naptár linkek)</strong> – ha
                            Google-belépést vagy naptárfunkciót használ.
                        </li>
                        <li>
                            <strong>Hatóságok</strong> – ha jogszabály kötelez (pl. bíróság,
                            adóhatóság).
                        </li>
                    </ul>
                    <p>
                        Nemzetközi adattovábbítás esetén (pl. USA) a szolgáltatók általában
                        megfelelő garanciákat alkalmaznak (pl. standard szerződéses
                        rendelkezések / SCC, vagy az akkori hatályos megfelelőségi keret).
                    </p>

                    <h2>8. Adatmegőrzés</h2>
                    <ul>
                        <li>
                            <strong>Fiókadatok:</strong> a fiók fennállásáig, majd törlési
                            kérelem után indokolatlan késedelem nélkül, kivéve ha jogszabály
                            továbbőrzést ír elő.
                        </li>
                        <li>
                            <strong>Foglalások / számlázás:</strong> a polgári jogi
                            elévülési időn belül, illetve a számviteli kötelezettségek
                            szerinti megőrzési időben (jellemzően 8 év a bizonylatokra
                            vonatkozó szabályok szerint, ha számla/könyvelés keletkezik).
                        </li>
                        <li>
                            <strong>Marketing hozzájárulás:</strong> a hozzájárulás
                            visszavonásáig.
                        </li>
                        <li>
                            <strong>Naplók / biztonsági adatok:</strong> a szükséges
                            legrövidebb ideig (jellemzően néhány naptól néhány hónapig).
                        </li>
                        <li>
                            <strong>Cookie-k:</strong> a cookie típusától függően
                            munkamenet-végig vagy a beállított lejáratig.
                        </li>
                    </ul>

                    <h2>9. Az Ön jogai (érintetti jogok)</h2>
                    <p>GDPR alapján Ön jogosult:</p>
                    <ul>
                        <li>
                            <strong>Tájékoztatáshoz / hozzáféréshez</strong> – milyen adatait
                            kezeljük;
                        </li>
                        <li>
                            <strong>Helyesbítéshez</strong> – pontatlan adatok javítása;
                        </li>
                        <li>
                            <strong>Törléshez („elfeledtetéshez”)</strong> – a törvényi
                            kivételek figyelembevételével;
                        </li>
                        <li>
                            <strong>Korlátozáshoz</strong> – bizonyos esetekben az
                            adatkezelés korlátozása;
                        </li>
                        <li>
                            <strong>Adathordozhatósághoz</strong> – strukturált, géppel
                            olvasható formátum (ahol alkalmazható);
                        </li>
                        <li>
                            <strong>Tiltakozáshoz</strong> – jogos érdeken alapuló
                            adatkezelés ellen;
                        </li>
                        <li>
                            <strong>Hozzájárulás visszavonásához</strong> – ha a jogalap
                            hozzájárulás;
                        </li>
                        <li>
                            <strong>Panasz benyújtásához</strong> a felügyeleti hatóságnál.
                        </li>
                    </ul>
                    <p>
                        Kérelmét elsősorban ide küldje:{" "}
                        <a href="mailto:usezsolti@gmail.com">usezsolti@gmail.com</a>. A
                        kérelem teljesítéséhez szükség lehet személyazonosságának
                        ellenőrzésére. A válaszadás célhatárideje általában 1 hónap
                        (indokolt esetben meghosszabbítható).
                    </p>
                    <p>
                        <strong>Felügyeleti hatóság (Magyarország):</strong>
                        <br />
                        Nemzeti Adatvédelmi és Információszabadság Hatóság (NAIH)
                        <br />
                        Cím: 1055 Budapest, Falk Miksa utca 9–11.
                        <br />
                        Web:{" "}
                        <a href="https://www.naih.hu" target="_blank" rel="noopener noreferrer">
                            www.naih.hu
                        </a>
                        <br />
                        E-mail: ugyfelszolgalat@naih.hu
                    </p>

                    <h2>10. Cookie-k és hasonló technológiák</h2>
                    <p>A weboldal cookie-kat (sütiket) és hasonló tárolókat használhat:</p>
                    <ul>
                        <li>
                            <strong>Szükséges cookie-k:</strong> bejelentkezés, biztonság,
                            alapműködés – ezek nélkül az oldal nem vagy csak korlátozottan
                            működik.
                        </li>
                        <li>
                            <strong>Preferencia / funkcionális cookie-k:</strong> pl.
                            beállítások megjegyzése.
                        </li>
                        <li>
                            <strong>Statisztikai / marketing cookie-k:</strong> csak
                            hozzájárulás esetén (ha ilyeneket alkalmazunk).
                        </li>
                    </ul>
                    <p>
                        A böngészőben a cookie-kat törölheti vagy blokkolhatja; ez befolyásolhatja
                        a weboldal működését. A cookie-bannerben adott választás a böngésző
                        helyi tárolójában kerül elmentésre.
                    </p>

                    <h2>11. 16 éven aluliak / gyermekek</h2>
                    <p>
                        A szolgáltatás elsősorban tanulóknak és szüleiknek szól. 16 év alatti
                        személy esetén a GDPR szerinti feltételekhez a szülő / törvényes
                        képviselő hozzájárulása vagy a szerződéskötés szabályai szerint járunk
                        el. Kérjük, hogy kiskorú ne adjon meg adatokat szülői tudomás /
                        beleegyezés nélkül. Ha tudomásunkra jut, hogy hozzájárulás nélkül
                        gyűjtöttünk gyermekadatot, intézkedünk a törlésről.
                    </p>

                    <h2>12. Adatbiztonság</h2>
                    <p>Megfelelő technikai és szervezési intézkedéseket alkalmazunk, többek között:</p>
                    <ul>
                        <li>HTTPS titkosított kapcsolat;</li>
                        <li>hitelesítés Firebase Authenticationnel;</li>
                        <li>hozzáférés-korlátozás (admin / diák jogosultságok);</li>
                        <li>Firestore és Storage biztonsági szabályok;</li>
                        <li>API rate limit és bemenet-ellenőrzés;</li>
                        <li>biztonsági HTTP fejlécek.</li>
                    </ul>
                    <p>
                        Teljes biztonságot egyetlen rendszer sem garantálhat; kérjük, erős
                        jelszót használjon, és e-mail fiókját is védje.
                    </p>

                    <h2>13. Automatizált döntéshozatal, profilalkotás</h2>
                    <p>
                        Nem alkalmazunk olyan automatizált döntéshozatalt, amely Önre nézve
                        joghatással járna vagy Önt hasonlóképpen jelentős mértékben
                        érintené. A tanulási / játék eredmények nyilvántartása oktatási
                        célú, nem jelent hitelképes profilalkotást.
                    </p>

                    <h2>14. Külső linkek</h2>
                    <p>
                        Az oldal tartalmazhat harmadik felek linkjeit (pl. Google Maps,
                        közösségi média). Ezekre a szolgáltatók saját adatvédelmi
                        szabályai vonatkoznak; ezekért felelősséget nem vállalunk.
                    </p>

                    <h2>15. Az adatkezelési tájékoztató módosítása</h2>
                    <p>
                        Fenntartjuk a jogot a tájékoztató frissítésére. A hatályos verzió
                        mindig ezen az oldalon érhető el, a dátum feltüntetésével. Lényeges
                        változás esetén – ahol indokolt – tájékoztatást adhatunk a
                        weboldalon vagy e-mailben.
                    </p>

                    <h2>16. Kapcsolat</h2>
                    <p>
                        Adatvédelmi kérdésekben:{" "}
                        <a href="mailto:usezsolti@gmail.com">usezsolti@gmail.com</a>
                        <br />
                        Postai / személyes: 2151 Fót, Szent Imre utca 18.
                    </p>

                    <p className="legal-note">
                        Jelen dokumentum tájékoztató jellegű, a szolgáltatásra szabott
                        általános gyakorlat szerint készült. Egyedi jogi helyzetben javasolt
                        ügyvédi / adatvédelmi szakértői ellenőrzés.
                    </p>

                    <p className="legal-back" style={{ marginTop: "2rem" }}>
                        <Link href="/">← Vissza a főoldalra</Link>
                        {" · "}
                        <Link href="/booking">Foglalás</Link>
                    </p>
                </div>
            </main>

            <style jsx>{`
                .legal-page {
                    min-height: 100vh;
                    background: linear-gradient(180deg, #0a0a12 0%, #12121f 50%, #0a0a12 100%);
                    color: #e8e8e8;
                    padding: 2rem 1rem 4rem;
                    font-family: Montserrat, system-ui, sans-serif;
                    line-height: 1.65;
                }
                .legal-wrap {
                    max-width: 820px;
                    margin: 0 auto;
                }
                h1 {
                    color: #39ff14;
                    font-size: clamp(1.6rem, 4vw, 2.2rem);
                    margin: 0.5rem 0 0.35rem;
                }
                h2 {
                    color: #39ff14;
                    font-size: 1.15rem;
                    margin: 2rem 0 0.75rem;
                    border-bottom: 1px solid rgba(57, 255, 20, 0.25);
                    padding-bottom: 0.35rem;
                }
                .legal-meta {
                    color: #999;
                    font-size: 0.9rem;
                    margin-bottom: 1.5rem;
                }
                .legal-back a {
                    color: #39ff14;
                }
                a {
                    color: #7dff5a;
                }
                ul {
                    padding-left: 1.25rem;
                }
                li {
                    margin-bottom: 0.35rem;
                }
                .legal-table-wrap {
                    overflow-x: auto;
                    margin: 1rem 0;
                }
                .legal-table {
                    width: 100%;
                    border-collapse: collapse;
                    font-size: 0.88rem;
                }
                .legal-table th,
                .legal-table td {
                    border: 1px solid rgba(255, 255, 255, 0.12);
                    padding: 0.55rem 0.65rem;
                    text-align: left;
                    vertical-align: top;
                }
                .legal-table th {
                    background: rgba(57, 255, 20, 0.08);
                    color: #39ff14;
                }
                .legal-note {
                    margin-top: 2rem;
                    font-size: 0.85rem;
                    color: #888;
                    border-left: 3px solid rgba(57, 255, 20, 0.4);
                    padding-left: 0.85rem;
                }
            `}</style>
        </>
    );
}
