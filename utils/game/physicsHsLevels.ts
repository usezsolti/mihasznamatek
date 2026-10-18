import type { PracticeStage } from '../practiceProgress';
import type { Question } from './types';

/**
 * Középiskolai fizika. A „kinetika” itt a mozgástan: kinematika.
 * g = 10 m/s². A negyedik mező a kidolgozás. Igen/nem: 1 / 0.
 */

const T = 'multiplication' as const;

function yn(text: string): string {
    return `${text}\n(1 = igen, 0 = nem)`;
}

type Row = [PracticeStage, string, number, string];

function card(stage: PracticeStage, question: string, answer: number, expression: string): Question {
    return { stage, question, answer, type: T, expression };
}

function bank(rows: Row[]): Question[] {
    return rows.map(([stage, question, answer, expression]) =>
        card(
            stage,
            question,
            answer,
            expression.length > 20 ? expression : `A képletbe helyettesítve: ${expression}`
        )
    );
}

const kinematika: Row[] = [
    // 1. Egyenletes mozgás
    [1, 'Egyenletes mozgás: v = 5 m/s, t = 4 s. Mekkora az út méterben?', 20, 's = v·t = 5·4 = 20 m.'],
    [1, 's = 100 m, t = 20 s, egyenletes mozgás. Mekkora a sebesség m/s-ban?', 5, 'v = s/t = 100/20 = 5 m/s.'],
    [1, 'v = 12 m/s, s = 36 m. Mennyi ideig tartott a mozgás másodpercben?', 3, 't = s/v = 36/12 = 3 s.'],
    [1, yn('Egyenes pályán oda-vissza megtett útnál az út mindig egyenlő az elmozdulással?'), 0, 'Az út a pálya hossza, az elmozdulás a kezdő- és végpont távolsága. Oda-vissza az elmozdulás kisebb lehet.'],
    [1, 'Egy pont 3 m-t megy keletre, majd 4 m-t északra. Mekkora az elmozdulás nagysága méterben?', 5, 'A két szakasz merőleges, ezért s = √(3²+4²) = √(9+16) = √25 = 5 m.'],
    [1, 'Egy test 10 másodpercig nyugalomban van. Mekkora utat tesz meg méterben?', 0, 'Nyugalomban a sebesség 0, ezért s = 0·10 = 0 m.'],
    [1, '72 km/h hány m/s?', 20, '72 km/h = 72·1000/3600 = 72/3,6 = 20 m/s.'],
    [1, '10 m/s hány km/h?', 36, '10 m/s = 10·3,6 = 36 km/h.'],
    [1, 'Két autó azonos irányba megy, 20 m/s és 15 m/s. Mekkora a relatív sebességük m/s-ban?', 5, 'Azonos irányban a relatív sebesség a különbség: 20−15 = 5 m/s.'],
    [1, 'Két autó szembe jön, 20 m/s és 15 m/s. Mekkora a közeledés sebessége m/s-ban?', 35, 'Szembe haladásnál a sebességek összeadódnak: 20+15 = 35 m/s.'],
    [1, 'v = 8 m/s, t = 2,5 s. Mekkora az út méterben?', 20, 's = 8·2,5 = 20 m.'],
    [1, yn('Egyenletes mozgásnál a gyorsulás nulla?'), 1, 'A sebesség nem változik, ezért a = Δv/Δt = 0.'],
    [1, '150 m utat 25 m/s sebességgel tesz meg. Mennyi a idő másodpercben?', 6, 't = 150/25 = 6 s.'],
    [1, yn('A sebesség nagysága előjeles mennyiség?'), 0, 'A sebesség vektor, előjeles lehet. A nagysága, a gyorsaság, nemnegatív.'],
    [1, yn('Egyenes vonalú mozgásnál a sebesség lehet negatív?'), 1, 'A negatív előjel a választott pozitív iránnyal ellentétes haladást jelenti.'],
    [1, 'v = 2 m/s, t = 7 s. Mekkora az út méterben?', 14, 's = 2·7 = 14 m.'],
    [1, '40 m út, 8 s. Mekkora az átlagos sebesség m/s-ban, ha egyenletes?', 5, 'v = 40/8 = 5 m/s.'],
    [1, yn('Az út mindig legalább akkora, mint az elmozdulás nagysága?'), 1, 'A pálya hossza nem lehet kisebb a kezdő- és végpont távolságánál.'],
    [1, '90 km-t 1,5 óra alatt tesz meg. Mekkora az átlagsebesség km/h-ban?', 60, 'v = 90/1,5 = 60 km/h.'],
    [1, '60 km/h sebességgel fél órát megy. Hány kilométert tesz meg?', 30, 's = 60·0,5 = 30 km.'],

    // 2. Átlagsebesség és grafikon
    [2, 'A v–t grafikon 5 s-ig vízszintes, v = 4 m/s. Mekkora az út méterben?', 20, 'A téglalap területe az út: s = 4·5 = 20 m.'],
    [2, '2 s alatt 10 m, utána 3 s alatt 20 m. Mekkora az átlagsebesség m/s-ban?', 6, 'Összes út 30 m, összes idő 5 s, v_átl = 30/5 = 6 m/s.'],
    [2, '100 m oda, 100 m vissza, összesen 40 s. Mekkora az elmozdulás nagysága méterben?', 0, 'Visszaér a kiindulópontra, ezért az elmozdulás 0. Az út 200 m lenne.'],
    [2, yn('Állandó sebességnél a v–t grafikon vízszintes egyenes?'), 1, 'A sebesség nem változik, ezért a grafikon párhuzamos az időtengellyel.'],
    [2, 'Az út–idő kapcsolat s = 3t, s méterben, t másodpercben. Mekkora a sebesség m/s-ban?', 3, 'Az egyenes meredeksége a sebesség: v = 3 m/s.'],
    [2, yn('Görbe s–t grafikon változó sebességet jelent?'), 1, 'Ha a meredekség változik, a sebesség is változik.'],
    [2, '4 s alatt az elmozdulás 12 m, egyenes pályán egy irányba. Mekkora az átlagsebesség m/s-ban?', 3, 'v_átl = 12/4 = 3 m/s.'],
    [2, yn('Az átlagsebesség mindig egyenlő az átlagos sebesség nagyságával?'), 0, 'Oda-vissza az átlagsebesség (út/idő) nem nulla, az elmozdulás/idő viszont lehet nulla.'],
    [2, '2 percig 10 m/s, majd 1 percig 4 m/s. Mekkora az átlagsebesség m/s-ban?', 8, 'Út: 120·10 + 60·4 = 1200+240 = 1440 m. Idő 180 s. v = 1440/180 = 8 m/s.'],
    [2, '0-tól 6 s-ig a sebesség állandóan 2 m/s. Mekkora az út méterben?', 12, 's = 2·6 = 12 m.'],
    [2, '2 órán át 30 km/h, majd 1 órán át 60 km/h. Átlagsebesség km/h-ban?', 40, 'Út: 60+60 = 120 km. Idő 3 h. v = 120/3 = 40 km/h.'],
    [2, yn('Az s–t grafikon meredeksége a sebesség?'), 1, 'v = Δs/Δt, ez az út–idő grafikon meredeksége.'],
    [2, yn('Pozitív, egyenletes sebességnél a v–t grafikon alatti terület az út?'), 1, 'A téglalap területe v·t, ami az út.'],
    [2, '15 m/s sebességgel 10 s-ig megy. Mekkora az út méterben?', 150, 's = 15·10 = 150 m.'],
    [2, '200 m-t 25 s alatt tesz meg. Mekkora az átlagsebesség m/s-ban?', 8, 'v = 200/25 = 8 m/s.'],
    [2, '54 km/h hány m/s?', 15, '54/3,6 = 15 m/s.'],
    [2, '5 m/s sebességgel 1 percig megy. Hány métert tesz meg?', 300, '1 perc = 60 s, s = 5·60 = 300 m.'],
    [2, yn('Negatív meredekségű s–t grafikon jelenthet közeledést a kezdőponthoz?'), 1, 'A helykoordináta csökken, ha a pozitív irány a kezdőponttól elfelé mutat.'],
    [2, '2 km-t 10 perc alatt tesz meg. Mekkora az átlagsebesség km/h-ban?', 12, '10 perc = 1/6 óra. v = 2/(1/6) = 12 km/h.'],
    [2, yn('Egyenletes mozgásnál az út egyenesen arányos az idővel?'), 1, 's = v·t, és v állandó, ezért s arányos t-vel.'],

    // 3. v = v0 + at
    [3, 'v₀ = 0, a = 2 m/s², t = 5 s. Mekkora a sebesség m/s-ban?', 10, 'v = 0 + 2·5 = 10 m/s.'],
    [3, 'v₀ = 4 m/s, a = 3 m/s², t = 2 s. Mekkora a sebesség m/s-ban?', 10, 'v = 4 + 3·2 = 10 m/s.'],
    [3, 'v₀ = 20 m/s, a = −2 m/s², t = 5 s. Mekkora a sebesség m/s-ban?', 10, 'v = 20 + (−2)·5 = 10 m/s.'],
    [3, 'v₀ = 0, a = 4 m/s², a sebesség 12 m/s lesz. Mennyi idő telt el másodpercben?', 3, '12 = 4t, tehát t = 3 s.'],
    [3, yn('Egyenletesen változó mozgásnál a gyorsulás állandó?'), 1, 'Ez a definíció: a gyorsulás nagysága és iránya nem változik.'],
    [3, 'v₀ = 15 m/s, a = −3 m/s². Hány másodperc múlva áll meg?', 5, '0 = 15 − 3t, t = 5 s.'],
    [3, 'A sebesség 4 s alatt 8 m/s-mal nő. Mekkora a gyorsulás m/s²-ben?', 2, 'a = Δv/Δt = 8/4 = 2 m/s².'],
    [3, 'v₀ = 0, v = 30 m/s, t = 6 s. Mekkora a gyorsulás m/s²-ben?', 5, 'a = 30/6 = 5 m/s².'],
    [3, yn('Ha a sebesség 10 m/s-ról 10 m/s-ra változik, a gyorsulás nulla?'), 1, 'Δv = 0, ezért a = 0.'],
    [3, 'v₀ = 2 m/s, a = 0,5 m/s², t = 6 s. Mekkora a sebesség m/s-ban?', 5, 'v = 2 + 0,5·6 = 5 m/s.'],
    [3, 'v₀ = 8 m/s, a = −4 m/s², t = 1 s. Mekkora a sebesség m/s-ban?', 4, 'v = 8 − 4 = 4 m/s.'],
    [3, 'v₀ = 0, a = 10 m/s², t = 3 s. Mekkora a sebesség m/s-ban?', 30, 'v = 10·3 = 30 m/s.'],
    [3, 'v₀ = 14 m/s, a = −2 m/s², v = 6 m/s. Mennyi idő telt el másodpercben?', 4, '6 = 14 − 2t, 2t = 8, t = 4 s.'],
    [3, yn('A gyorsulás lehet negatív?'), 1, 'A negatív gyorsulás a választott pozitív iránnyal ellentétes, lassulást jelenthet.'],
    [3, 'v₀ = 5 m/s, a = 1 m/s², t = 7 s. Mekkora a sebesség m/s-ban?', 12, 'v = 5 + 7 = 12 m/s.'],
    [3, 'A sebesség nem változik. Mekkora a gyorsulás m/s²-ben?', 0, 'Δv = 0, ezért a = 0.'],
    [3, 'v₀ = 100 m/s, a = −10 m/s², t = 4 s. Mekkora a sebesség m/s-ban?', 60, 'v = 100 − 40 = 60 m/s.'],
    [3, 'v₀ = 3 m/s, a = 3 m/s², t = 3 s. Mekkora a sebesség m/s-ban?', 12, 'v = 3 + 9 = 12 m/s.'],
    [3, yn('A v = v₀ + at képlet lassulásnál is használható?'), 1, 'Igen, ha a lassulásnál a gyorsulást negatívnak vesszük.'],
    [3, 'v₀ = 0, a = 1,5 m/s², t = 4 s. Mekkora a sebesség m/s-ban?', 6, 'v = 1,5·4 = 6 m/s.'],

    // 4. Út
    [4, 'v₀ = 0, a = 2 m/s², t = 4 s. Mekkora az út méterben?', 16, 's = at²/2 = 2·16/2 = 16 m.'],
    [4, 'v₀ = 5 m/s, a = 0, t = 6 s. Mekkora az út méterben?', 30, 's = 5·6 = 30 m.'],
    [4, 'v₀ = 0, a = 4 m/s², t = 3 s. Mekkora az út méterben?', 18, 's = 4·9/2 = 18 m.'],
    [4, 'v₀ = 10 m/s, a = −2 m/s², t = 3 s. Mekkora az út méterben?', 21, 's = 10·3 + (−2)·9/2 = 30 − 9 = 21 m.'],
    [4, 'v₀ = 0, a = 10 m/s², t = 2 s. Mekkora az út méterben?', 20, 's = 10·4/2 = 20 m.'],
    [4, 'v₀ = 0, v = 10 m/s, a = 5 m/s². Mekkora az út méterben?', 10, 'v² = 2as, 100 = 10s, s = 10 m.'],
    [4, 'v₀ = 6 m/s, a = 2 m/s², t = 5 s. Mekkora az út méterben?', 55, 's = 6·5 + 2·25/2 = 30 + 25 = 55 m.'],
    [4, 'v₀ = 20 m/s, a = −4 m/s², t = 2 s. Mekkora az út méterben?', 32, 's = 20·2 + (−4)·4/2 = 40 − 8 = 32 m.'],
    [4, yn('Nyugalomból indulva s = at²/2?'), 1, 'Ha v₀ = 0, az út képlete s = at²/2.'],
    [4, 'v₀ = 0, a = 1 m/s², t = 10 s. Mekkora az út méterben?', 50, 's = 1·100/2 = 50 m.'],
    [4, 'v₀ = 4 m/s, a = 2 m/s², t = 3 s. Mekkora az út méterben?', 21, 's = 4·3 + 2·9/2 = 12 + 9 = 21 m.'],
    [4, 'v₀ = 0, v = 8 m/s, a = 2 m/s². Mekkora az út méterben?', 16, 's = v²/(2a) = 64/4 = 16 m.'],
    [4, 'v₀ = 3 m/s, a = 0, t = 8 s. Mekkora az út méterben?', 24, 's = 3·8 = 24 m.'],
    [4, 'v₀ = 10 m/s, a = 2 m/s², t = 4 s. Mekkora az út méterben?', 56, 's = 10·4 + 2·16/2 = 40 + 16 = 56 m.'],
    [4, 'v₀ = 0, a = 8 m/s², t = 1 s. Mekkora az út méterben?', 4, 's = 8·1/2 = 4 m.'],
    [4, 'v₀ = 2 m/s, a = 2 m/s², t = 2 s. Mekkora az út méterben?', 8, 's = 2·2 + 2·4/2 = 4 + 4 = 8 m.'],
    [4, 'v₀ = 15 m/s, a = −5 m/s², t = 2 s. Mekkora az út méterben?', 20, 's = 15·2 + (−5)·4/2 = 30 − 10 = 20 m.'],
    [4, 'v₀ = 0, a = 0,5 m/s², t = 6 s. Mekkora az út méterben?', 9, 's = 0,5·36/2 = 9 m.'],
    [4, 'v₀ = 0, v = 6 m/s, a = 3 m/s². Mekkora az út méterben?', 6, 's = v²/(2a) = 36/6 = 6 m.'],
    [4, 'v₀ = 1 m/s, a = 4 m/s², t = 2 s. Mekkora az út méterben?', 10, 's = 1·2 + 4·4/2 = 2 + 8 = 10 m.'],

    // 5. Szabadesés, g = 10
    [5, 'Szabadesés, g = 10 m/s², v₀ = 0, t = 2 s. Mekkora a sebesség m/s-ban?', 20, 'v = gt = 10·2 = 20 m/s.'],
    [5, 'Szabadesés, g = 10 m/s², v₀ = 0, t = 3 s. Mekkora az út méterben?', 45, 's = gt²/2 = 10·9/2 = 45 m.'],
    [5, 'Szabadesés, g = 10 m/s², v₀ = 0, h = 20 m. Mennyi a idő másodpercben?', 2, '20 = 5t², t² = 4, t = 2 s.'],
    [5, 'Szabadesés, g = 10 m/s², v₀ = 0, h = 5 m. Mekkora a becsapódási sebesség m/s-ban?', 10, 'v² = 2gh = 2·10·5 = 100, v = 10 m/s.'],
    [5, 'Szabadesés, g = 10 m/s², v₀ = 0, t = 1 s. Mekkora az út méterben?', 5, 's = 10·1/2 = 5 m.'],
    [5, 'Szabadesés, g = 10 m/s², v₀ = 0, t = 4 s. Mekkora a sebesség m/s-ban?', 40, 'v = 10·4 = 40 m/s.'],
    [5, 'Szabadesés, g = 10 m/s², v₀ = 0, h = 80 m. Mennyi a idő másodpercben?', 4, '80 = 5t², t² = 16, t = 4 s.'],
    [5, 'Szabadesés, g = 10 m/s², v₀ = 0, h = 45 m. Mekkora a becsapódási sebesség m/s-ban?', 30, 'v² = 2·10·45 = 900, v = 30 m/s.'],
    [5, 'Függőlegesen feldobva, g = 10 m/s², v₀ = 20 m/s. Mekkora a legnagyobb magasság méterben?', 20, 'A csúcson v = 0. h = v₀²/(2g) = 400/20 = 20 m.'],
    [5, 'Függőlegesen feldobva, g = 10 m/s², v₀ = 20 m/s. Hány másodperc a csúcsig?', 2, '0 = 20 − 10t, t = 2 s.'],
    [5, yn('A nehézségi gyorsulást ebben a feladatsorban 10 m/s²-nek vesszük, lefelé?'), 1, 'A középiskolai számoláshoz g = 10 m/s², iránya függőlegesen lefelé.'],
    [5, 'Szabadesés, g = 10 m/s², v₀ = 0, t = 5 s. Mekkora az út méterben?', 125, 's = 10·25/2 = 125 m.'],
    [5, 'Szabadesés, g = 10 m/s², v₀ = 0, h = 125 m. Mennyi a idő másodpercben?', 5, '125 = 5t², t² = 25, t = 5 s.'],
    [5, 'Függőlegesen feldobva, g = 10 m/s², v₀ = 30 m/s. Hány másodperc a csúcsig?', 3, '0 = 30 − 10t, t = 3 s.'],
    [5, 'Függőlegesen feldobva, g = 10 m/s², v₀ = 30 m/s. Mekkora a legnagyobb magasság méterben?', 45, 'h = 900/(2·10) = 45 m.'],
    [5, yn('Szabadesésnél a kezdősebesség nulla?'), 1, 'Szabadesésnek azt a mozgást nevezzük, amely nyugalomból, csak a nehézségi erő hatására indul.'],
    [5, 'Szabadesés, g = 10 m/s², v₀ = 0, t = 2 s. Mekkora az út méterben?', 20, 's = 10·4/2 = 20 m.'],
    [5, 'Lefelé, g = 10 m/s², v₀ = 10 m/s, t = 2 s. Mekkora a sebesség m/s-ban?', 30, 'v = 10 + 10·2 = 30 m/s.'],
    [5, 'Lefelé, g = 10 m/s², v₀ = 10 m/s, t = 2 s. Mekkora az út méterben?', 40, 's = 10·2 + 10·4/2 = 20 + 20 = 40 m.'],
    [5, yn('Függőleges hajításnál a gyorsulás végig g?'), 1, 'A levegő ellenállását elhanyagolva a gyorsulás a pálya minden pontján g, lefelé.'],

    // 6. Körmozgás és relatív sebesség
    [6, 'Egyenletes körmozgás: ω = 2 1/s, r = 3 m. Mekkora a kerületi sebesség m/s-ban?', 6, 'v = ωr = 2·3 = 6 m/s.'],
    [6, 'A periódusidő T = 2 s. Mekkora a frekvencia 1/s-ban?', 0.5, 'f = 1/T = 1/2 = 0,5 Hz.'],
    [6, 'f = 5 Hz. Mekkora a periódusidő másodpercben?', 0.2, 'T = 1/f = 1/5 = 0,2 s.'],
    [6, 'v = 10 m/s, r = 2 m. Mekkora a szögsebesség 1/s-ban?', 5, 'ω = v/r = 10/2 = 5 1/s.'],
    [6, yn('Egyenletes körmozgásnál a sebesség nagysága állandó?'), 1, 'A kerületi sebesség nagysága nem változik, az iránya igen.'],
    [6, yn('Egyenletes körmozgásnál a gyorsulás nulla?'), 0, 'Van centripetális gyorsulás, mert a sebesség iránya változik.'],
    [6, 'r = 1 m, v = 4 m/s. Mekkora a centripetális gyorsulás m/s²-ben?', 16, 'a = v²/r = 16/1 = 16 m/s².'],
    [6, 'r = 2 m, ω = 3 1/s. Mekkora a centripetális gyorsulás m/s²-ben?', 18, 'a = ω²r = 9·2 = 18 m/s².'],
    [6, 'A hajó 4 m/s a vízhez képest, a folyó 2 m/s, azonos irány. Mekkora a part szerinti sebesség m/s-ban?', 6, 'Azonos irányban összeadódnak: 4+2 = 6 m/s.'],
    [6, 'A hajó 4 m/s a vízhez képest, a folyó 3 m/s, szembe. Mekkora a part szerinti sebesség m/s-ban?', 1, 'Szembe: 4−3 = 1 m/s.'],
    [6, 'Egy test teljes kört fut, majd visszaér. Mekkora az elmozdulás nagysága méterben?', 0, 'A kezdő- és a végpont egybeesik, az elmozdulás 0. Az út a kerület.'],
    [6, yn('A frekvencia a periódusidő reciproka?'), 1, 'f = 1/T.'],
    [6, 'Másodpercenként 2 fordulat. Mekkora a frekvencia Hz-ben?', 2, 'n = 2 fordulat/s, tehát f = 2 Hz.'],
    [6, 'v = 6 m/s, r = 3 m. Mekkora a centripetális gyorsulás m/s²-ben?', 12, 'a = 36/3 = 12 m/s².'],
    [6, 'Két test azonos irányba megy, 8 m/s és 3 m/s. Relatív sebesség m/s-ban?', 5, '8−3 = 5 m/s.'],
    [6, yn('Az egyenletes körmozgás pályája kör?'), 1, 'A pálya kör, a középpont és a sugár állandó.'],
    [6, 'r = 0,5 m, v = 2 m/s. Mekkora a szögsebesség 1/s-ban?', 4, 'ω = v/r = 2/0,5 = 4 1/s.'],
    [6, 'T = 10 s. Mekkora a frekvencia Hz-ben?', 0.1, 'f = 1/10 = 0,1 Hz.'],
    [6, yn('A centripetális gyorsulás a kör középpontja felé mutat?'), 1, 'A sebesség irányváltozását a középpont felé mutató gyorsulás írja le.'],
    [6, 'ω = 4 1/s, r = 2 m. Mekkora a kerületi sebesség m/s-ban?', 8, 'v = ωr = 4·2 = 8 m/s.'],
];

const dinamika: Row[] = [
    // 1. Newton
    [1, 'm = 2 kg, a = 3 m/s². Mekkora az eredő erő newtonban?', 6, 'F = ma = 2·3 = 6 N.'],
    [1, 'm = 5 kg, a = 4 m/s². Mekkora az eredő erő newtonban?', 20, 'F = 5·4 = 20 N.'],
    [1, 'F = 10 N, m = 2 kg. Mekkora a gyorsulás m/s²-ben?', 5, 'a = F/m = 10/2 = 5 m/s².'],
    [1, yn('Ha az eredő erő nulla, a gyorsulás is nulla?'), 1, 'Newton II.: a = F/m, ezért F = 0 esetén a = 0.'],
    [1, yn('Newton I. szerint erő nélkül a test nyugszik vagy egyenes vonalon egyenletesen mozog?'), 1, 'Tehetetlenség: az eredő erő nélkül a sebesség nem változik.'],
    [1, 'm = 1 kg, a = 10 m/s². Mekkora az eredő erő newtonban?', 10, 'F = 1·10 = 10 N.'],
    [1, 'm = 4 kg, F = 8 N. Mekkora a gyorsulás m/s²-ben?', 2, 'a = 8/4 = 2 m/s².'],
    [1, yn('A tehetetlenség mértéke a tömeg?'), 1, 'Nagyobb tömegű testet ugyanakkora erő kevésbé gyorsít.'],
    [1, 'm = 3 kg, a = 0. Mekkora az eredő erő newtonban?', 0, 'F = 3·0 = 0 N.'],
    [1, 'F = 15 N, m = 5 kg. Mekkora a gyorsulás m/s²-ben?', 3, 'a = 15/5 = 3 m/s².'],
    [1, 'm = 10 kg, a = 0,5 m/s². Mekkora az eredő erő newtonban?', 5, 'F = 10·0,5 = 5 N.'],
    [1, yn('A hatás és az ellenhatás egyenlő nagyságú?'), 1, 'Newton III.: a két erő egyenlő nagyságú és ellentétes irányú.'],
    [1, yn('A hatás–ellenhatás pár két ereje ugyanarra a testre hat?'), 0, 'A két erő két különböző testre hat, ezért nem adhatók össze egy test eredőjében.'],
    [1, 'm = 2,5 kg, a = 4 m/s². Mekkora az eredő erő newtonban?', 10, 'F = 2,5·4 = 10 N.'],
    [1, 'F = 100 N, m = 25 kg. Mekkora a gyorsulás m/s²-ben?', 4, 'a = 100/25 = 4 m/s².'],
    [1, 'm = 8 kg, F = 8 N. Mekkora a gyorsulás m/s²-ben?', 1, 'a = 8/8 = 1 m/s².'],
    [1, yn('A súly és a tömeg ugyanaz a mennyiség?'), 0, 'A tömeg kilogramm, a súly erő, newton. G = mg.'],
    [1, 'm = 6 kg, a = 2 m/s². Mekkora az eredő erő newtonban?', 12, 'F = 6·2 = 12 N.'],
    [1, 'F = 9 N, m = 3 kg. Mekkora a gyorsulás m/s²-ben?', 3, 'a = 9/3 = 3 m/s².'],
    [1, yn('Az F = ma összefüggés vektorokra is igaz?'), 1, 'Az eredő erő és a gyorsulás iránya megegyezik.'],

    // 2. Erők, súly
    [2, 'm = 2 kg, g = 10 m/s². Mekkora a súly newtonban?', 20, 'G = mg = 2·10 = 20 N.'],
    [2, 'm = 5 kg, g = 10 m/s². Mekkora a súly newtonban?', 50, 'G = 5·10 = 50 N.'],
    [2, 'G = 40 N, g = 10 m/s². Mekkora a tömeg kilogrammban?', 4, 'm = G/g = 40/10 = 4 kg.'],
    [2, 'Vízszintes asztalon nyugszik, m = 3 kg, g = 10 m/s². Mekkora a nyomóerő newtonban?', 30, 'Egyensúlyban N = G = 30 N.'],
    [2, 'Két erő egy irányba mutat: 10 N és 4 N. Mekkora az eredő newtonban?', 14, 'Azonos irányban összeadódnak: 10+4 = 14 N.'],
    [2, 'Két erő ellentétes: 10 N és 4 N. Mekkora az eredő nagysága newtonban?', 6, 'Ellentétes irányban a különbség: 10−4 = 6 N.'],
    [2, 'Két merőleges erő: 3 N és 4 N. Mekkora az eredő nagysága newtonban?', 5, 'F = √(3²+4²) = 5 N.'],
    [2, yn('Egyensúlyban az eredő erő nulla?'), 1, 'Nyugalom vagy egyenletes mozgás csak nulla eredő erő mellett lehetséges.'],
    [2, 'm = 1 kg, g = 10 m/s². Mekkora a súly newtonban?', 10, 'G = 1·10 = 10 N.'],
    [2, 'Két 8 N-os erő ellentétes irányú. Mekkora az eredő newtonban?', 0, '8−8 = 0 N, a test egyensúlyban van.'],
    [2, 'm = 0,5 kg, g = 10 m/s². Mekkora a súly newtonban?', 5, 'G = 0,5·10 = 5 N.'],
    [2, 'Egyetlen vízszintes erő 20 N, m = 4 kg. Mekkora a gyorsulás m/s²-ben?', 5, 'a = 20/4 = 5 m/s².'],
    [2, yn('A súly lefelé mutat?'), 1, 'A Föld a testet a középpontja felé, a felszínen függőlegesen lefelé húzza.'],
    [2, 'Vízszintes asztalon, m = 6 kg, g = 10 m/s². Mekkora a normálerő newtonban?', 60, 'N = mg = 60 N.'],
    [2, 'Két azonos irányú 7 N-os erő. Mekkora az eredő newtonban?', 14, '7+7 = 14 N.'],
    [2, 'm = 12 kg, g = 10 m/s². Mekkora a súly newtonban?', 120, 'G = 12·10 = 120 N.'],
    [2, yn('A normálerő merőleges a felületre?'), 1, 'A felület a testet a saját síkjára merőlegesen támasztja.'],
    [2, 'Két merőleges erő: 6 N és 8 N. Mekkora az eredő nagysága newtonban?', 10, 'F = √(36+64) = √100 = 10 N.'],
    [2, 'm = 2,5 kg, g = 10 m/s². Mekkora a súly newtonban?', 25, 'G = 2,5·10 = 25 N.'],
    [2, yn('Több erő eredője a vektori összegük?'), 1, 'Az erőket irányukkal együtt, vektorként kell összeadni.'],

    // 3. Súrlódás
    [3, 'Vízszintes talaj, m = 2 kg, g = 10 m/s², μ = 0,5. Mekkora a legnagyobb nyugalmi súrlódás newtonban?', 10, 'N = 20 N, F_s = μN = 0,5·20 = 10 N.'],
    [3, 'm = 4 kg, g = 10 m/s², μ = 0,25. Mekkora a csúszási súrlódás newtonban?', 10, 'N = 40 N, F_s = 0,25·40 = 10 N.'],
    [3, 'm = 5 kg, g = 10 m/s², μ = 0,2. Mekkora a súrlódási erő csúszás közben newtonban?', 10, 'N = 50 N, F_s = 0,2·50 = 10 N.'],
    [3, 'm = 2 kg, húzóerő 12 N, súrlódás 10 N, azonos egyenes. Mekkora a gyorsulás m/s²-ben?', 1, 'Eredő 12−10 = 2 N. a = 2/2 = 1 m/s².'],
    [3, 'A húzóerő 10 N, a súrlódás is 10 N. Mekkora a gyorsulás m/s²-ben?', 0, 'Az eredő erő 0, ezért a = 0.'],
    [3, yn('A nyugalmi súrlódás legfeljebb μN?'), 1, 'A tapadási súrlódás a húzóerőhöz igazodik, de nem nőhet μN fölé.'],
    [3, 'm = 1 kg, g = 10 m/s², μ = 0,4. Mekkora a legnagyobb súrlódás newtonban?', 4, 'F_s = 0,4·10 = 4 N.'],
    [3, 'm = 10 kg, g = 10 m/s², μ = 0,1. Mekkora a súrlódás csúszás közben newtonban?', 10, 'F_s = 0,1·100 = 10 N.'],
    [3, 'm = 10 kg, g = 10 m/s², μ = 0,2, húzóerő 30 N. Mekkora a gyorsulás m/s²-ben?', 1, 'Súrlódás 20 N, eredő 10 N. a = 10/10 = 1 m/s².'],
    [3, yn('A csúszási súrlódás a mozgással szemben hat?'), 1, 'A súrlódás a relatív elmozdulást akadályozza.'],
    [3, 'm = 3 kg, g = 10 m/s², μ = 1/3. Mekkora a súrlódás newtonban?', 10, 'N = 30 N, F_s = 30/3 = 10 N.'],
    [3, 'N = 50 N, μ = 0,4. Mekkora a súrlódás newtonban?', 20, 'F_s = 0,4·50 = 20 N.'],
    [3, 'm = 2 kg, g = 10 m/s², μ = 0,2, húzóerő 5 N. Mekkora a gyorsulás m/s²-ben?', 0.5, 'Súrlódás 4 N, eredő 1 N. a = 1/2 = 0,5 m/s².'],
    [3, yn('Súrlódás nélkül a vízszintes erő gyorsítja a testet?'), 1, 'Ha csak ez az erő hat vízszintesen, az eredő nem nulla, a test gyorsul.'],
    [3, 'm = 8 kg, g = 10 m/s², μ = 0,5. Mekkora a legnagyobb súrlódás newtonban?', 40, 'F_s = 0,5·80 = 40 N.'],
    [3, yn('Ha a húzóerő egyenlő a súrlódással, a test egyenletesen mozoghat?'), 1, 'Az eredő nulla, ezért a már mozgó test egyenes vonalon egyenletesen halad.'],
    [3, 'm = 6 kg, g = 10 m/s², μ = 0,5. Mekkora a legnagyobb súrlódás newtonban?', 30, 'F_s = 0,5·60 = 30 N.'],
    [3, 'N = 100 N, μ = 0,3. Mekkora a súrlódás newtonban?', 30, 'F_s = 0,3·100 = 30 N.'],
    [3, 'm = 4 kg, g = 10 m/s², μ = 0,25, húzóerő 20 N. Mekkora a gyorsulás m/s²-ben?', 2.5, 'N = 40 N, súrlódás 10 N, eredő 10 N. a = 10/4 = 2,5 m/s².'],
    [3, yn('A súrlódási együttható mértékegység nélküli?'), 1, 'μ = F_s/N, két erő hányadosa, ezért nincs mértékegysége.'],

    // 4. Lejtő, 30°, súrlódás nélkül, g = 10
    [4, 'Súrlódásmentes 30°-os lejtő, m = 2 kg, g = 10 m/s², sin 30° = 0,5. A lejtővel párhuzamos erő newtonban?', 10, 'F = mg·sin 30° = 20·0,5 = 10 N.'],
    [4, 'Súrlódásmentes 30°-os lejtő, g = 10 m/s², sin 30° = 0,5. Mekkora a gyorsulás m/s²-ben?', 5, 'a = g·sin 30° = 10·0,5 = 5 m/s².'],
    [4, 'Súrlódásmentes 30°-os lejtő, m = 4 kg, g = 10 m/s². A párhuzamos erő newtonban?', 20, 'F = 40·0,5 = 20 N.'],
    [4, 'Súrlódásmentes 30°-os lejtő, m = 1 kg, g = 10 m/s². Mekkora a gyorsulás m/s²-ben?', 5, 'a = g·sin 30° = 5 m/s², a tömeg kiesik.'],
    [4, yn('A lejtőre merőleges komponens mg·cos α?'), 1, 'A súlyt a lejtővel párhuzamos és merőleges összetevőre bontjuk: mg sin α és mg cos α.'],
    [4, 'Súrlódásmentes 30°-os lejtő, m = 10 kg, g = 10 m/s². A párhuzamos erő newtonban?', 50, 'F = 100·0,5 = 50 N.'],
    [4, 'Mennyi sin 30°?', 0.5, 'sin 30° = 1/2 = 0,5.'],
    [4, 'g = 10 m/s², sin 30° = 0,5, súrlódás nincs. Mekkora a lejtő menti gyorsulás m/s²-ben?', 5, 'a = 10·0,5 = 5 m/s².'],
    [4, 'Súrlódásmentes 30°-os lejtő, m = 6 kg, g = 10 m/s². A párhuzamos erő newtonban?', 30, 'F = 60·0,5 = 30 N.'],
    [4, yn('Súrlódásmentes, 30°-os lejtőn a gyorsulás kisebb, mint g?'), 1, 'a = g·sin 30° = g/2, ami kisebb g-nél.'],
    [4, 'Súrlódásmentes 30°-os lejtő, m = 8 kg, g = 10 m/s². A párhuzamos erő newtonban?', 40, 'F = 80·0,5 = 40 N.'],
    [4, 'A lejtőn a = 5 m/s², nyugalomból, t = 2 s. Mekkora az út méterben?', 10, 's = at²/2 = 5·4/2 = 10 m.'],
    [4, 'A lejtőn a = 5 m/s², nyugalomból, t = 2 s. Mekkora a sebesség m/s-ban?', 10, 'v = at = 5·2 = 10 m/s.'],
    [4, 'Súrlódásmentes 30°-os lejtő, m = 3 kg, g = 10 m/s². A párhuzamos erő newtonban?', 15, 'F = 30·0,5 = 15 N.'],
    [4, yn('Súrlódás nélkül a lejtő menti gyorsulás g·sin α?'), 1, 'Az eredő a párhuzamos komponens, a = (mg sin α)/m = g sin α.'],
    [4, 'Súrlódásmentes 30°-os lejtő, m = 5 kg, g = 10 m/s². A párhuzamos erő newtonban?', 25, 'F = 50·0,5 = 25 N.'],
    [4, 'a = 5 m/s², nyugalomból, t = 4 s. Mekkora a sebesség m/s-ban?', 20, 'v = 5·4 = 20 m/s.'],
    [4, 'a = 5 m/s², nyugalomból, t = 4 s. Mekkora az út méterben?', 40, 's = 5·16/2 = 40 m.'],
    [4, 'Súrlódásmentes 30°-os lejtő, m = 20 kg, g = 10 m/s². A párhuzamos erő newtonban?', 100, 'F = 200·0,5 = 100 N.'],
    [4, yn('0° és 90° között nagyobb lejtőszögnél nagyobb a súrlódásmentes gyorsulás?'), 1, 'sin α nő, ezért a = g sin α is nő.'],

    // 5. Körmozgás dinamikája
    [5, 'm = 2 kg, v = 3 m/s, r = 1 m. Mekkora a centripetális erő newtonban?', 18, 'F = mv²/r = 2·9/1 = 18 N.'],
    [5, 'm = 1 kg, v = 4 m/s, r = 2 m. Mekkora a centripetális erő newtonban?', 8, 'F = 1·16/2 = 8 N.'],
    [5, 'm = 2 kg, ω = 3 1/s, r = 1 m. Mekkora a centripetális erő newtonban?', 18, 'F = mω²r = 2·9·1 = 18 N.'],
    [5, 'm = 1 kg, v = 10 m/s, r = 5 m. Mekkora a centripetális erő newtonban?', 20, 'F = 100/5 = 20 N.'],
    [5, 'm = 4 kg, v = 2 m/s, r = 2 m. Mekkora a centripetális erő newtonban?', 8, 'F = 4·4/2 = 8 N.'],
    [5, yn('A centripetális erő a kör középpontja felé mutat?'), 1, 'Az eredő erő a középpont felé mutat, ez tartja körpályán a testet.'],
    [5, 'm = 0,5 kg, v = 4 m/s, r = 2 m. Mekkora a centripetális erő newtonban?', 4, 'F = 0,5·16/2 = 4 N.'],
    [5, 'm = 3 kg, v = 2 m/s, r = 1 m. Mekkora a centripetális erő newtonban?', 12, 'F = 3·4/1 = 12 N.'],
    [5, 'm = 1 kg, ω = 2 1/s, r = 2 m. Mekkora a centripetális erő newtonban?', 8, 'F = 1·4·2 = 8 N.'],
    [5, 'm = 5 kg, v = 3 m/s, r = 3 m. Mekkora a centripetális erő newtonban?', 15, 'F = 5·9/3 = 15 N.'],
    [5, yn('Egyenletes körmozgásnál az eredő erő nulla?'), 0, 'A sebesség iránya változik, ezért az eredő erő a centripetális erő, nem nulla.'],
    [5, 'm = 2 kg, v = 5 m/s, r = 5 m. Mekkora a centripetális erő newtonban?', 10, 'F = 2·25/5 = 10 N.'],
    [5, 'm = 1 kg, v = 6 m/s, r = 3 m. Mekkora a centripetális erő newtonban?', 12, 'F = 36/3 = 12 N.'],
    [5, 'm = 2 kg, ω = 1 1/s, r = 4 m. Mekkora a centripetális erő newtonban?', 8, 'F = 2·1·4 = 8 N.'],
    [5, 'm = 10 kg, v = 2 m/s, r = 4 m. Mekkora a centripetális erő newtonban?', 10, 'F = 10·4/4 = 10 N.'],
    [5, yn('A centripetális erő egy újabb, a többi mellé írandó kölcsönhatás?'), 0, 'Nem külön kölcsönhatás: a már meglévő erők eredőjének középpont felé mutató szerepe.'],
    [5, 'm = 2 kg, v = 4 m/s, r = 4 m. Mekkora a centripetális erő newtonban?', 8, 'F = 2·16/4 = 8 N.'],
    [5, 'm = 1 kg, v = 3 m/s, r = 1 m. Mekkora a centripetális erő newtonban?', 9, 'F = 9/1 = 9 N.'],
    [5, 'm = 4 kg, ω = 2 1/s, r = 1 m. Mekkora a centripetális erő newtonban?', 16, 'F = 4·4·1 = 16 N.'],
    [5, yn('Fonálon pörgetett testnél a fonál húzóereje adja a centripetális erőt?'), 1, 'Vízszintes, egyenletes körmozgásnál a fonálerő mutat a középpont felé.'],

    // 6. Lendület
    [6, 'm = 2 kg, v = 3 m/s. Mekkora a lendület nagysága kg·m/s-ban?', 6, 'p = mv = 2·3 = 6.'],
    [6, 'm = 4 kg, v = 5 m/s. Mekkora a lendület nagysága?', 20, 'p = 4·5 = 20.'],
    [6, 'p = 12, m = 3 kg. Mekkora a sebesség m/s-ban?', 4, 'v = p/m = 12/3 = 4 m/s.'],
    [6, 'Két 2 kg-os test, 4 m/s és 0. Összetapadnak. Közös sebesség m/s-ban?', 2, 'Lendület: 2·4 + 0 = 8. Össztömeg 4 kg. v = 8/4 = 2 m/s.'],
    [6, '1 kg, 6 m/s nekiütközik a nyugvó 2 kg-osnak, összetapadnak. Közös sebesség m/s-ban?', 2, 'p = 6. Össztömeg 3 kg. v = 6/3 = 2 m/s.'],
    [6, yn('Zárt rendszerben a lendület megmarad?'), 1, 'Ha kívülről nincs eredő erő, az összes lendület állandó.'],
    [6, 'A lendület 2 s alatt 10 egységgel változik. Mekkora az átlagos erő newtonban?', 5, 'F = Δp/Δt = 10/2 = 5 N.'],
    [6, 'F = 4 N, t = 3 s. Mekkora a lendületváltozás?', 12, 'Δp = F·t = 4·3 = 12.'],
    [6, 'm = 2 kg, a sebesség 5 m/s-mal nő. Mekkora a lendületváltozás?', 10, 'Δp = m·Δv = 2·5 = 10.'],
    [6, yn('A lendület vektormennyiség?'), 1, 'Iránya a sebesség iránya, ezért vektor.'],
    [6, 'm = 5 kg, v = 2 m/s. Mekkora a lendület nagysága?', 10, 'p = 5·2 = 10.'],
    [6, 'Két lendület: 3 és −3. Mekkora az összes lendület a választott tengelyen?', 0, '3 + (−3) = 0.'],
    [6, 'm = 1 kg, a falról 8 m/s-ról −8 m/s-ra pattan. Mekkora a lendületváltozás nagysága?', 16, 'Δp = −8 − 8 = −16, a nagysága 16.'],
    [6, yn('Tökéletesen rugalmas ütközésben a mozgási energia is megmarad?'), 1, 'Rugalmas ütközésben a lendület és a mozgási energia is megmarad.'],
    [6, yn('Tökéletesen rugalmatlan, zárt ütközésben a lendület megmarad?'), 1, 'A lendület zárt rendszerben megmarad. A mozgási energia egy része nem.'],
    [6, 'm = 2 kg, a sebesség 0-ról 4 m/s-ra nő. Mekkora a lendületváltozás?', 8, 'Δp = 2·4 = 8.'],
    [6, 'F = 6 N, t = 0,5 s. Mekkora a lendületváltozás?', 3, 'Δp = 6·0,5 = 3.'],
    [6, '3 kg·4 m/s és 1 kg·(−2 m/s). Mekkora az összes lendület?', 10, 'p = 12 + (−2) = 10.'],
    [6, 'm = 10 kg, v = 0,5 m/s. Mekkora a lendület nagysága?', 5, 'p = 10·0,5 = 5.'],
    [6, yn('Az erő a lendület időbeli változásának mértéke?'), 1, 'F = Δp/Δt, ezért az erő a lendület változási gyorsasága.'],
];

function assertSixByTwenty(topicId: string, list: Question[]): void {
    if (list.length !== 120) {
        throw new Error(`${topicId}: ${list.length} feladat, 120 kell`);
    }
    for (const stage of [1, 2, 3, 4, 5, 6]) {
        const n = list.filter((q) => q.stage === stage).length;
        if (n !== 20) throw new Error(`${topicId} ${stage}. szint: ${n} feladat`);
    }
}

const BANKS: Record<string, Question[]> = {
    'ph-kinematika': bank(kinematika),
    'ph-dinamika': bank(dinamika),
};

for (const [id, list] of Object.entries(BANKS)) {
    assertSixByTwenty(id, list);
}

export const PHYSICS_HS_TOPIC_IDS = ['ph-kinematika', 'ph-dinamika'] as const;

export function getPhysicsHsPracticeQuestions(topicId: string): Question[] | null {
    const list = BANKS[topicId.toLowerCase()];
    return list ? list : null;
}
