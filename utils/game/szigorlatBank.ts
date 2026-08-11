import type { Question } from './types';

// Előre definiált szigorlat feladatok
export const szigorlatQuestions: Question[] = [
    {
        question: `(a) Oldjuk meg az alábbi differenciálegyenletet az x < 1.80644 intervallumon! Mely megoldásgörbe elégíti ki az y(0) = -1/3 kezdeti feltételt?

y'(x) = e^(3y(x)+1) · (x² - x)

Megjegyzés: a fenti intervallumon teljesül, hogy -x³ + (3x²)/2 + 1 > 0.

(b) Adjuk meg az előző egyenlet megoldásfüggvényének a fenti intervallum belsejébe eső szélsőértékeit!`,
        answer: 1, // c értéke (5. részfeladat)
        alternativeAnswer: 0, // x = 0 (7. részfeladat)
        thirdAnswer: 1, // x = 1 (7. részfeladat)
        fourthAnswer: undefined,
        type: 'multiplication',
        subQuestions: [
            {
                question: `Részfeladat 1: Adja meg a h(y) függvényt!`,
                rubric: `Megoldás. 1. részfeladat megoldása ez: h(y) = e^(3y+1)`,
                answer: 0 // Nincs számérték, csak ellenőrzés
            },
            {
                question: `Részfeladat 2: Adja meg a g(x) függvényt!`,
                rubric: `Megoldás. 2. részfeladat megoldása ez: g(x) = x²-x`,
                answer: 0 // Nincs számérték
            },
            {
                question: `RÉSZFELADAT 3: Számítsd ki az első integrált!`,
                rubric: `Megoldás. 3. részfeladat megoldása ez: e^(-3y-1)/(-3) + c`,
                answer: 0 // Nincs számérték
            },
            {
                question: `RÉSZFELADAT 4: Számítsd ki a második integrált!`,
                rubric: `Megoldás. 4. részfeladat megoldása ez: x³/3 - x²/2 + c`,
                answer: 0 // Nincs számérték
            },
            {
                question: `RÉSZFELADAT 5: Alkalmazd a kezdeti feltételt és határozd meg c értékét!`,
                rubric: `Megoldás. 5. részfeladat megoldása ez: c = 1`,
                answer: 1 // c értéke
            },
            {
                question: `RÉSZFELADAT 6: Írd fel a végleges megoldást!`,
                rubric: `Megoldás. 6. részfeladat megoldása ez: y(x) = -1/3 · ln(-x³ + 3x²/2 + 1) - 1/3`,
                answer: 0 // Nincs számérték
            },
            {
                question: `RÉSZFELADAT 7: Határozd meg a derivált zérushelyeit! (Első zérushely)`,
                rubric: `Megoldás. 7. részfeladat megoldása ez: x = 0`,
                answer: 0 // Első zérushely
            },
            {
                question: `RÉSZFELADAT 8: Határozd meg a derivált zérushelyeit! (Második zérushely)`,
                rubric: `Megoldás. 8. részfeladat megoldása ez: x = 1`,
                answer: 1 // Második zérushely
            },
            {
                question: `Részfeladat 9: Határozd meg a megoldásfüggvény második deriváltját!`,
                rubric: `Megoldás. 9. részfeladat megoldása ez: y''(x) = -1/3 · [(-6x+3)(-x³+3x²/2+1) - (-3x²+3x)²] / (-x³+3x²/2+1)²`,
                answer: 0 // Nincs számérték
            },
            {
                question: `Részfeladat 10: Ad meg a lokális maximumának a helyét!`,
                rubric: `Megoldás. 10. részfeladat megoldása ez: x = 0`,
                answer: 0 // Lokális maximum helye
            },
            {
                question: `Részfeladat 11: Ad meg a lokális minimumának a helyét!`,
                rubric: `Megoldás. 11. részfeladat megoldása ez: x = 1`,
                answer: 1 // Lokális minimum helye
            }
        ],
        expression: `Teljes megoldás:

(a) Szétválasztható differenciálegyenlet:
h(y) = e^(3y+1), g(x) = x²-x
∫ e^(-3y-1) dy = ∫ (x²-x) dx
-e^(-3y-1)/3 = x³/3 - x²/2 + c
y(x) = -1/3 · ln(-x³ + 3x²/2 + c) - 1/3

Kezdeti feltétel: y(0) = -1/3 · ln(c) - 1/3 = -1/3
ln(c) = 0, tehát c = 1

Végleges megoldás: y(x) = -1/3 · ln(-x³ + 3x²/2 + 1) - 1/3

(b) Deriválva: y'(x) = -1/3 · (-3x²+3x)/(-x³ + 3x²/2 + 1)

y'(x) = 0, ha -3x²+3x = 0
x(3-3x) = 0
x = 0 vagy x = 1

Második derivált: y''(x) = -1/3 · [(-6x+3)(-x³+3x²/2+1) - (-3x²+3x)²] / (-x³+3x²/2+1)²

y''(0) < 0 → maximum
y''(1) > 0 → minimum

Rubrikák összesítése:
- h(y) és g(x) azonosítása: 2 pont
- Integrálás képlet: 2 pont
- Első integrál: 2 pont
- Második integrál: 2 pont
- Kezdeti feltétel: 4 pont
- Végleges megoldás: 3 pont
- Derivált zérushelyek: 1+1 pont
- Szélsőérték típusok: 1+1 pont
Összesen: 19 pont`
        },
        {
            question: `Tekintsük azt az f:(0,π]→ℝ függvényt, mely az alábbi módon van definiálva:

f(x) = {
  -3, ha x ∈ (0, π/2],
  0, ha x ∈ (π/2, π]
}

Terjesszük ki ezt a függvényt úgy, hogy minden x ∈ ℝ esetén értelmezve legyen, és Fourier-sora tisztán szinuszos legyen!

Számítsuk ki a Fourier-sor együtthatóit!`,
            answer: 0,
            alternativeAnswer: undefined,
            thirdAnswer: undefined,
            fourthAnswer: undefined,
            type: 'multiplication',
            subQuestions: [
                {
                    question: `Részfeladat 1: Hogyan kell kiterjeszteni a függvényt, hogy tisztán szinuszos legyen?`,
                    rubric: `Megoldás. 1. részfeladat megoldása ez: páratlan függvénnyé kel alakítani`,
                    answer: 0
                },
                {
                    question: `Részfeladat 2: A tisztán szinuszos kiterjesztésnek, mi a függvénye?`,
                    rubric: `Megoldás. 2. részfeladat megoldása ez: f(x) = { 3, ha x ∈ (-π/2, 0]; -3, ha x ∈ (0, π/2]; 0, máshol }`,
                    answer: 0
                },
                {
                    question: `Részfeladat 3: Adja meg a szinuszos együtthatók (bₖ) képletét!`,
                    rubric: `Megoldás. 3. részfeladat megoldása ez: bₖ = (1/π) ∫[-π,π] f(x)sin(kx) dx`,
                    answer: 0
                },
                {
                    question: `Részfeladat 4: Írja fel az integrálokat a függvény definíciója alapján!`,
                    rubric: `Megoldás. 4. részfeladat megoldása ez: bₖ = (1/π) [∫[-π/2,0] 3sin(kx) dx + ∫[0,π/2] (-3)sin(kx) dx]`,
                    answer: 0
                },
                {
                    question: `Részfeladat 5: Számítsa ki az integrálokat!`,
                    rubric: `Megoldás. 5. részfeladat megoldása ez: bₖ = (1/π) [(-3cos(kx)/k)|[-π/2,0] + (3cos(kx)/k)|[0,π/2]]`,
                    answer: 0
                },
                {
                    question: `Részfeladat 6: Végezze el a behelyettesítést és egyszerűsítést!`,
                    rubric: `Megoldás. 6. részfeladat megoldása ez: bₖ = -(6/πk)cos(kπ/2)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 7: Adja meg a bₖ értékét, ha k páros, de nem osztható 4-gyel!`,
                    rubric: `Megoldás. 7. részfeladat megoldása ez: bₖ = -12/(πk)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 8: Adja meg a bₖ értékét, ha k páratlan!`,
                    rubric: `Megoldás. 8. részfeladat megoldása ez: bₖ = -6/(πk)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 9: Adja meg a bₖ értékét, ha k osztható 4-gyel!`,
                    rubric: `Megoldás. 9. részfeladat megoldása ez: bₖ = 0`,
                    answer: 0
                }
            ],
            expression: `Teljes megoldás:

Mivel tisztán szinuszos Fourier-sort szeretnénk, így páratlan függvényként kell kiterjeszteni.
Így legyen a kiterjesztés a (-π, π) intervallumon:

f(x) = {
  3, ha x ∈ (-π/2, 0],
  -3, ha x ∈ (0, π/2],
  0, máshol
}

és f(x) = f(x+2π).

Ekkor az együtthatókra a₀ = 0, aₙ = 0 adódik a szimmetria miatt.

A szinuszos együtthatók:
bₖ = (1/π) ∫[-π,π] f(x)sin(kx) dx

Felhasználva a definíciót:
bₖ = (1/π) [∫[-π/2,0] 3sin(kx) dx + ∫[0,π/2] (-3)sin(kx) dx]

Integrálva:
= (1/π) [(-3cos(kx)/k)|[-π/2,0] + (3cos(kx)/k)|[0,π/2]]

Behelyettesítve:
= (1/π) [(3/k)(1-cos(-kπ/2)) + (3/k)(cos(kπ/2)-1)]
= -(6/πk)cos(kπ/2)

A különböző esetek:
bₖ = {
  -12/(πk), ha k páros, de nem osztható 4-gyel,
  -6/(πk), ha k páratlan,
  0, ha k osztható 4-gyel
}`
        },
        {
            question: `3. feladat. Adjuk meg a

v⃗(x,y,z) = (-2x·sin(x), 3e^(3y), 2cos(x))

vektormező integrálját az A(2,1,3) és B(0,-1,3) pontokat összekötő egyenes szakasz mentén (az A pontból indulva)!

Megjegyzés: a végeredményben szereplő trigonometrikus és exponenciális függvények értékeit nem kell pontosan meghatározni.`,
            answer: 0,
            alternativeAnswer: undefined,
            thirdAnswer: undefined,
            fourthAnswer: undefined,
            type: 'multiplication',
            subQuestions: [
                {
                    question: `Részfeladat 1: Adja meg a görbe egy megfelelő paraméterezését!`,
                    rubric: `Megoldás. 1. részfeladat megoldása ez: r⃗(t) = Bt + (1-t)A = (0, -1, 3)t + (1-t)(2, 1, 3) = (-2t+2, -2t+1, 3)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 2: Adja meg a paraméterezés deriváltját!`,
                    rubric: `Megoldás. 2. részfeladat megoldása ez: r⃗'(t) = (-2, -2, 0)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 3: Adja meg a vektormező értékét a görbén!`,
                    rubric: `Megoldás. 3. részfeladat megoldása ez: v⃗(r⃗(t)) = (-2(2-2t)sin(2-2t), 3e^(3(1-2t)), 2cos(2-2t)) = (-4(1-t)sin(2-2t), 3e^(3-6t), 2cos(2-2t))`,
                    answer: 0
                },
                {
                    question: `Részfeladat 4: Írja fel a vonalintegrált!`,
                    rubric: `Megoldás. 4. részfeladat megoldása ez: ∫[0,1] v⃗(r⃗(t)) · r⃗'(t) dt = ∫[0,1] (-4(1-t)sin(2-2t), 3e^(3-6t), 2cos(2-2t)) · (-2, -2, 0) dt`,
                    answer: 0
                },
                {
                    question: `Részfeladat 5: Számítsa ki az integranduszt!`,
                    rubric: `Megoldás. 5. részfeladat megoldása ez: ∫[0,1] [8(1-t)sin(2-2t) - 6e^(3-6t)] dt`,
                    answer: 0
                },
                {
                    question: `Részfeladat 6: Végezze el az integrálást!`,
                    rubric: `Megoldás. 6. részfeladat megoldása ez: [4(1-t)cos(2-2t) + e^(3-6t)]|[0,1] = 4cos(0) + e^(-3) - (4cos(2) + e^3)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 7: Adja meg a végeredményt egyszerűsített formában!`,
                    rubric: `Megoldás. 7. részfeladat megoldása ez: 4 + e^(-3) - 4cos(2) - e^3`,
                    answer: 0
                }
            ],
            expression: `Teljes megoldás:

Paraméterezés:
A görbe egy megfelelő paraméterezése:
r⃗(t) = B + (1-t)(A-B) = (0, -1, 3) + (1-t)(2, 1, 3) = (2-2t, 1-2t, 3), t ∈ [0,1]

Ennek deriváltja:
r⃗'(t) = (-2, -2, 0)

Továbbá:
v⃗(r⃗(t)) = (-2(2-2t)sin(2-2t), 3e^(3(1-2t)), 2cos(2-2t))
     = (-4(1-t)sin(2-2t), 3e^(3-6t), 2cos(2-2t))

Így a vonalintegrál:
∫[γ] v⃗ · dr⃗ = ∫[0,1] v⃗(r⃗(t)) · r⃗'(t) dt
        = ∫[0,1] (-4(1-t)sin(2-2t), 3e^(3-6t), 2cos(2-2t)) · (-2, -2, 0) dt

Az integrandusz kiszámítása után:
= ∫[0,1] [8(1-t)sin(2-2t) - 6e^(3-6t)] dt

Integrálva:
= [4(1-t)cos(2-2t) + e^(3-6t)]|[0,1]
= 4cos(0) + e^(-3) - (4cos(2) + e^3)
= 4 + e^(-3) - 4cos(2) - e^3`
        },
        {
            question: `4. feladat. Tekintsük az alábbi felületet:

V = {az origó középpontú, 3 sugarú gömbfelület y ≤ 0 és z ≥ 0 térbe eső része}
(tehát az oldallapok nem).

Számítsuk ki a

v⃗(x,y,z) = (2x, 2y, z+1)

vektormezőnek ezen a felületen vett felületi integrálját az origótól távolodó irányban!

Megjegyzés: ∫[0,2π] sin x cos x dx = sin x(2π) - sin x(0).
Továbbá a Gauss-Osztrigyin tétel szerint az y=0 síkban elhelyezkedő körlapon a felületi integrál nulla, ezért azt nem kell kiszámítani.`,
            answer: 0,
            alternativeAnswer: undefined,
            thirdAnswer: undefined,
            fourthAnswer: undefined,
            type: 'multiplication',
            subQuestions: [
                {
                    question: `Részfeladat 1: Számítsa ki a vektormező divergenciáját!`,
                    rubric: `Megoldás. 1. részfeladat megoldása ez: div(v⃗) = ∂/∂x(2x) + ∂/∂y(2y) + ∂/∂z(z+1) = 2 + 2 + 1 = 5`,
                    answer: 0
                },
                {
                    question: `Részfeladat 2: Írja fel a Gauss-Osztrigyin tétel alapján a felületi integrált!`,
                    rubric: `Megoldás. 2. részfeladat megoldása ez: ∬[V] v⃗·dF⃗ = ∭[V] div(v⃗) dV - ∬[y=0 oldallap] v⃗·dF⃗ - ∬[z=0 oldallap] v⃗·dF⃗`,
                    answer: 0
                },
                {
                    question: `Részfeladat 3: Miért nulla az y=0 oldallap integrálja?`,
                    rubric: `Megoldás. 3. részfeladat megoldása ez: A Gauss-Osztrigyin tétel szerint az y=0 síkban elhelyezkedő körlapon a felületi integrál nulla`,
                    answer: 0
                },
                {
                    question: `Részfeladat 4: Számítsa ki a térfogati integrált (divergencia integrálja)!`,
                    rubric: `Megoldás. 4. részfeladat megoldása ez: ∭[V] div(v⃗) dV = ∭[V] 5 dV = 5·Vol(V)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 5: Adja meg a negyedgömb térfogatát!`,
                    rubric: `Megoldás. 5. részfeladat megoldása ez: V_negyedgömb = (1/4)·(4/3)πr³ = (1/3)π·3³ = 9π`,
                    answer: 0
                },
                {
                    question: `Részfeladat 6: Írja fel a z=0 oldallap paraméterezését!`,
                    rubric: `Megoldás. 6. részfeladat megoldása ez: r⃗(u,w) = (u cos w, u sin w, 0), u ∈ [0,3], w ∈ [0,2π)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 7: Számítsa ki a parciális deriváltakat!`,
                    rubric: `Megoldás. 7. részfeladat megoldása ez: r⃗_u = (cos w, sin w, 0), r⃗_w = (-u sin w, u cos w, 0)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 8: Számítsa ki a kereszt szorzatot és határozza meg a normálvektort!`,
                    rubric: `Megoldás. 8. részfeladat megoldása ez: r⃗_u × r⃗_w = (0, 0, u), de mivel ez nem befelé mutat, a normálvektor: (0, 0, -u)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 9: Adja meg a vektormező értékét a z=0 oldallapon!`,
                    rubric: `Megoldás. 9. részfeladat megoldása ez: v⃗(r⃗(u,w)) = (2u cos w, 2u sin w, 1)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 10: Számítsa ki a z=0 oldallap integrálját!`,
                    rubric: `Megoldás. 10. részfeladat megoldása ez: ∬[z=0] v⃗·dF⃗ = ∫[0,3]∫[0,2π] (2u cos w, 2u sin w, 1)·(0, 0, -u) dw du = ∫[0,3]∫[0,2π] (-u) dw du = -9π`,
                    answer: 0
                },
                {
                    question: `Részfeladat 11: Adja meg a végeredményt!`,
                    rubric: `Megoldás. 11. részfeladat megoldása ez: ∬[V] v⃗·dF⃗ = 5·9π - (-9π) = 45π + 9π = 54π`,
                    answer: 0
                }
            ],
            expression: `Teljes megoldás:

A keresett felületi integrál kiszámítható a Gauss-Osztrigyin tétel alapján:
∬[V] v⃗·dF⃗ = ∭[V] div(v⃗) dV - ∬[y=0 oldallap] v⃗·dF⃗ - ∬[z=0 oldallap] v⃗·dF⃗

De ismert, hogy ∬[y=0 oldallap] v⃗·dF⃗ = 0.

A divergencia:
div(v⃗) = ∂/∂x(2x) + ∂/∂y(2y) + ∂/∂z(z+1) = 2 + 2 + 1 = 5

Így:
∭[V] div(v⃗) dV = ∭[V] 5 dV = 5·Vol(V)

A negyedgömb térfogata:
V_negyedgömb = (1/4)·(4/3)πr³ = (1/3)π·3³ = 9π

azaz
∭[V] div(v⃗) dV = 5·9π = 45π

A z=0 oldallap paraméterezése:
r⃗(u,w) = (u cos w, u sin w, 0), u ∈ [0,3], w ∈ [0,2π)

Parciális deriváltak:
r⃗_u = (cos w, sin w, 0)
r⃗_w = (-u sin w, u cos w, 0)

Keresztszorzat:
r⃗_u × r⃗_w = (0, 0, u)

Ez nem befelé mutat, ezért helyette a (0, 0, -u) vektort használjuk.

Továbbá:
v⃗(r⃗(u,w)) = (2u cos w, 2u sin w, 1)

Így:
∬[z=0] v⃗·dF⃗ = ∫[0,3]∫[0,2π] (2u cos w, 2u sin w, 1)·(0, 0, -u) dw du
        = ∫[0,3]∫[0,2π] (-u) dw du
        = ∫[0,3] (-2πu) du
        = -πu²|[0,3]
        = -9π

Összesen:
∬[V] v⃗·dF⃗ = ∭[V] div(v⃗) dV - ∬[z=0] v⃗·dF⃗
        = 45π - (-9π)
        = 45π + 9π
        = 54π`
        },
        {
            question: `5. feladat. Oldjuk meg az alábbi egyenletrendszert!

x'(t) = 2x(t) - 3y(t) + 2e^(-3t)
y'(t) = 3x(t) + 2y(t)`,
            answer: 0,
            alternativeAnswer: undefined,
            thirdAnswer: undefined,
            fourthAnswer: undefined,
            type: 'multiplication',
            subQuestions: [
                {
                    question: `Részfeladat 1: Adja meg a rendszerhez tartozó mátrixot!`,
                    rubric: `Megoldás. 1. részfeladat megoldása ez: A = [[2, -3], [3, 2]]`,
                    answer: 0
                },
                {
                    question: `Részfeladat 2: Számítsa ki a mátrix sajátértékeit!`,
                    rubric: `Megoldás. 2. részfeladat megoldása ez: λ₁,₂ = 2 ± 3i`,
                    answer: 0
                },
                {
                    question: `Részfeladat 3: Adja meg a 2+3i sajátértékhez tartozó sajátvektort!`,
                    rubric: `Megoldás. 3. részfeladat megoldása ez: s₁ = [i, 1]`,
                    answer: 0
                },
                {
                    question: `Részfeladat 4: Írja fel a homogén megoldást!`,
                    rubric: `Megoldás. 4. részfeladat megoldása ez: [x_h(t), y_h(t)] = c₁[-e^(2t)sin(3t), e^(2t)cos(3t)] + c₂[e^(2t)cos(3t), e^(2t)sin(3t)]`,
                    answer: 0
                },
                {
                    question: `Részfeladat 5: Vezesse vissza másodrendűre az egyenletet a partikuláris megoldáshoz!`,
                    rubric: `Megoldás. 5. részfeladat megoldása ez: x''(t) = 4x'(t) - 13x(t) - 10e^(-3t)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 6: Határozza meg a próbaalakot és az A együtthatót!`,
                    rubric: `Megoldás. 6. részfeladat megoldása ez: x_p(t) = Ae^(-3t), ahol A = -5/17`,
                    answer: 0
                },
                {
                    question: `Részfeladat 7: Adja meg a partikuláris megoldás másik komponensét!`,
                    rubric: `Megoldás. 7. részfeladat megoldása ez: y_p(t) = (3/17)e^(-3t)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 8: Oldja meg közvetlenül a rendszerbe helyettesítéssel!`,
                    rubric: `Megoldás. 8. részfeladat megoldása ez: x_p(t) = Ae^(-3t), y_p(t) = Be^(-3t), ahol A = -5/17, B = 3/17`,
                    answer: 0
                },
                {
                    question: `Részfeladat 9: Adja meg az alapmátrixot az állandók variálásához!`,
                    rubric: `Megoldás. 9. részfeladat megoldása ez: Φ(t) = [[-e^(2t)sin(3t), e^(2t)cos(3t)], [e^(2t)cos(3t), e^(2t)sin(3t)]]`,
                    answer: 0
                }
            ],
            expression: `Teljes megoldás:

A megoldást előállítjuk homogén és partikuláris alakban.

Homogén megoldás:
A rendszerhez tartozó mátrix:
A = [[2, -3], [3, 2]]

Ennek sajátértékei:
λ₁,₂ = 2 ± 3i

A 2+3i sajátértékhez tartozó sajátvektor:
s₁ = [i, 1]

így
e^((2+3i)t) = e^(2t)(cos(3t) + i sin(3t))

Ebből:
e^((2+3i)t) s₁ = e^(2t) [i cos(3t) - sin(3t), cos(3t) + i sin(3t)]

A homogén megoldás tehát:
[x_h(t), y_h(t)] = c₁[-e^(2t)sin(3t), e^(2t)cos(3t)] + c₂[e^(2t)cos(3t), e^(2t)sin(3t)]

Partikuláris megoldás:

Másodrendűre visszavezetés:
x''(t) = 2x'(t) - 3y'(t) - 6e^(-3t)
   = 2x'(t) - 9x(t) - 6y(t) - 6e^(-3t)

Az első egyenletből:
3y(t) = 2x(t) - x'(t) + 2e^(-3t)

Behelyettesítve:
x''(t) = 2x'(t) - 9x(t) - 2(2x(t) - x'(t) + 2e^(-3t)) - 6e^(-3t)
   = 4x'(t) - 13x(t) - 10e^(-3t)

Próbaalak:
x_p(t) = A e^(-3t)

Behelyettesítve:
9A e^(-3t) = -12A e^(-3t) - 13A e^(-3t) - 10e^(-3t)

amiből
A = -10/34 = -5/17

Így:
x_p(t) = -(5/17) e^(-3t)

A másik komponens:
y_p(t) = (1/3)(2x(t) - x'(t) + 2e^(-3t))
   = (3/17) e^(-3t)

Közvetlen rendszerbe helyettesítés:
Legyen
x_p(t) = A e^(-3t), y_p(t) = B e^(-3t)

Behelyettesítve:
-3A = 2A - 3B + 2
-3B = 3A + 2B

Ebből:
A = -5/17, B = 3/17

Állandók variálása:
Az alapmátrix:
Φ(t) = [[-e^(2t)sin(3t), e^(2t)cos(3t)], [e^(2t)cos(3t), e^(2t)sin(3t)]]

Ennek inverze, az integrálás és az utolsó szorzás elvégzése után megkapjuk a teljes megoldást.`
        },
        {
            question: `1. feladat

(a) Oldjuk meg az alábbi differenciálegyenletet, ahol x < 1.9108!
Mely megoldásgörbe elégíti ki az y(0) = -1/2 feltételt?

y'(x) = e^(2y(x)+1)(x²-x)

Megjegyzés: az x ∈ (-∞, 1.9108) intervallumon igaz, hogy
-2x³/3 + x² + 1 > 0.

(b) Adjuk meg az előző egyenlet megoldásfüggvényének a fenti intervallum belsejébe eső szélsőértékeit!`,
            answer: 1, // c értéke (5. részfeladat)
            alternativeAnswer: 0, // x = 0 (7. részfeladat)
            thirdAnswer: 1, // x = 1 (8. részfeladat)
            fourthAnswer: undefined,
            type: 'multiplication',
            subQuestions: [
                {
                    question: `Részfeladat 1: Adja meg a h(y) függvényt!`,
                    rubric: `Megoldás. 1. részfeladat megoldása ez: h(y) = e^(2y+1)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 2: Adja meg a g(x) függvényt!`,
                    rubric: `Megoldás. 2. részfeladat megoldása ez: g(x) = x²-x`,
                    answer: 0
                },
                {
                    question: `Részfeladat 3: Számítsd ki az első integrált!`,
                    rubric: `Megoldás. 3. részfeladat megoldása ez: e^(-2y-1)/(-2) + c`,
                    answer: 0
                },
                {
                    question: `Részfeladat 4: Számítsd ki a második integrált!`,
                    rubric: `Megoldás. 4. részfeladat megoldása ez: x³/3 - x²/2 + c`,
                    answer: 0
                },
                {
                    question: `Részfeladat 5: Alkalmazd a kezdeti feltételt és határozd meg c értékét!`,
                    rubric: `Megoldás. 5. részfeladat megoldása ez: c = 1`,
                    answer: 1
                },
                {
                    question: `Részfeladat 6: Írd fel a végleges megoldást!`,
                    rubric: `Megoldás. 6. részfeladat megoldása ez: y(x) = -1/2 · ln(-2x³/3 + x² + 1) - 1/2`,
                    answer: 0
                },
                {
                    question: `Részfeladat 7: Határozd meg a derivált zérushelyeit! (Első zérushely)`,
                    rubric: `Megoldás. 7. részfeladat megoldása ez: x = 0`,
                    answer: 0
                },
                {
                    question: `Részfeladat 8: Határozd meg a derivált zérushelyeit! (Második zérushely)`,
                    rubric: `Megoldás. 8. részfeladat megoldása ez: x = 1`,
                    answer: 1
                },
                {
                    question: `Részfeladat 9: Határozd meg a megoldásfüggvény második deriváltját!`,
                    rubric: `Megoldás. 9. részfeladat megoldása ez: y''(x) = -1/2 · [(-4x+2)(-2x³/3+x²+1) - (-2x²+2x)²] / (-2x³/3+x²+1)²`,
                    answer: 0
                },
                {
                    question: `Részfeladat 10: Ad meg a lokális maximumának a helyét!`,
                    rubric: `Megoldás. 10. részfeladat megoldása ez: x = 0`,
                    answer: 0
                },
                {
                    question: `Részfeladat 11: Ad meg a lokális minimumának a helyét!`,
                    rubric: `Megoldás. 11. részfeladat megoldása ez: x = 1`,
                    answer: 1
                }
            ],
            expression: `Teljes megoldás:

(a) Szétválasztható differenciálegyenlet:
h(y) = e^(2y+1), g(x) = x²-x
∫ e^(-2y-1) dy = ∫ (x²-x) dx
-e^(-2y-1)/2 = x³/3 - x²/2 + c
y(x) = -1/2 · ln(-2x³/3 + x² + c) - 1/2

Kezdeti feltétel: y(0) = -1/2 · ln(c) - 1/2 = -1/2
ln(c) = 0, tehát c = 1

Végleges megoldás: y(x) = -1/2 · ln(-2x³/3 + x² + 1) - 1/2

(b) Deriválva: y'(x) = -1/2 · (-2x²+2x)/(-2x³/3 + x² + 1)

y'(x) = 0, ha -2x²+2x = 0
x(2-2x) = 0
x = 0 vagy x = 1

Második derivált: y''(x) = -1/2 · [(-4x+2)(-2x³/3+x²+1) - (-2x²+2x)²] / (-2x³/3+x²+1)²
x=0 esetén: y''(0) = -1/2 · (2·1)/1 < 0, tehát maximum van.
x=1 esetén: y''(1) = -1/2 · [(-2)(4/3)] / (4/3)² = -1/2 · (-2) / (4/3) = 3/4 > 0, tehát minimum van.`
        },
        {
            question: `2. feladat. Tekintsük az f:(0,π]→ℝ függvényt, mely az alábbi módon van definiálva:

f(x) = {
  -4, ha x ∈ (0, π/2],
  0, ha x ∈ (π/2, π]
}

Terjesszük ki ezt a függvényt úgy, hogy minden x ∈ ℝ esetén értelmezve legyen, és Fourier-sora tisztán szinuszos legyen!

Számítsuk ki a Fourier-sor együtthatóit!`,
            answer: 0,
            alternativeAnswer: undefined,
            thirdAnswer: undefined,
            fourthAnswer: undefined,
            type: 'multiplication',
            subQuestions: [
                {
                    question: `Részfeladat 1: Hogyan kell kiterjeszteni a függvényt, hogy páratlan legyen? Adja meg a kiterjesztett függvény definícióját a (-π, π) intervallumon!`,
                    rubric: `Megoldás. 1. részfeladat megoldása ez: f(x) = { 4, ha x ∈ (-π/2, 0]; -4, ha x ∈ (0, π/2]; 0, máshol } és f(x) = f(x+2π)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 2: Miért lesz a₀ = 0 és aₖ = 0?`,
                    rubric: `Megoldás. 2. részfeladat megoldása ez: A szimmetria miatt, mivel páratlan függvényről van szó`,
                    answer: 0
                },
                {
                    question: `Részfeladat 3: Adja meg a szinuszos együtthatók (bₖ) képletét!`,
                    rubric: `Megoldás. 3. részfeladat megoldása ez: bₖ = (1/π) ∫[-π,π] f(x)sin(kx) dx`,
                    answer: 0
                },
                {
                    question: `Részfeladat 4: Írja fel az integrálokat a függvény definíciója alapján!`,
                    rubric: `Megoldás. 4. részfeladat megoldása ez: bₖ = (1/π) [∫[-π/2,0] 4sin(kx) dx + ∫[0,π/2] (-4)sin(kx) dx]`,
                    answer: 0
                },
                {
                    question: `Részfeladat 5: Számítsa ki az integrálokat!`,
                    rubric: `Megoldás. 5. részfeladat megoldása ez: bₖ = (1/π) [(-4cos(kx)/k)|[-π/2,0] + (4cos(kx)/k)|[0,π/2]]`,
                    answer: 0
                },
                {
                    question: `Részfeladat 6: Végezze el a behelyettesítést és egyszerűsítést!`,
                    rubric: `Megoldás. 6. részfeladat megoldása ez: bₖ = -(8/πk)cos(kπ/2)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 7: Adja meg a bₖ értékét, ha k páros, de nem osztható 4-gyel!`,
                    rubric: `Megoldás. 7. részfeladat megoldása ez: bₖ = -16/(πk)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 8: Adja meg a bₖ értékét, ha k páratlan!`,
                    rubric: `Megoldás. 8. részfeladat megoldása ez: bₖ = -8/(πk)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 9: Adja meg a bₖ értékét, ha k osztható 4-gyel!`,
                    rubric: `Megoldás. 9. részfeladat megoldása ez: bₖ = 0`,
                    answer: 0
                }
            ],
            expression: `Teljes megoldás:

Mivel tisztán szinuszos Fourier-sort szeretnénk, ezért a függvényt páratlan módon terjesztjük ki.
Legyen a kiterjesztés a (-π, π) intervallumon:

f(x) = {
  4, ha x ∈ (-π/2, 0],
  -4, ha x ∈ (0, π/2],
  0, máshol
}

és f(x) = f(x+2π).

A szimmetria miatt:
a₀ = 0 és aₖ = 0

A szinuszos együtthatók:
bₖ = (1/π) ∫[-π,π] f(x)sin(kx) dx

A definíció felhasználásával:
bₖ = (1/π) [∫[-π/2,0] 4sin(kx) dx + ∫[0,π/2] (-4)sin(kx) dx]

Integrálva:
= (1/π) [(-4cos(kx)/k)|[-π/2,0] + (4cos(kx)/k)|[0,π/2]]

Behelyettesítve:
= (1/π) [(4/k)(1-cos(-kπ/2)) + (4/k)(cos(kπ/2)-1)]
= -(8/πk)cos(kπ/2)

Így a különböző esetek:
bₖ = {
  -16/(πk), ha k páros, de nem osztható 4-gyel,
  -8/(πk), ha k páratlan,
  0, ha k osztható 4-gyel
}`
        },
        {
            question: `3. feladat. Adjuk meg a

v⃗(x,y,z) = (-3x·sin(x), 2e^(2y), 3cos(x))

vektormező integrálját az A(1,2,2) és B(-1,0,2) pontokat összekötő egyenes szakasz mentén (az A pontból indulva)!

Megjegyzés: a végeredményben szereplő exponenciális függvény értékét nem kell pontosan meghatározni!`,
            answer: 0,
            alternativeAnswer: undefined,
            thirdAnswer: undefined,
            fourthAnswer: undefined,
            type: 'multiplication',
            subQuestions: [
                {
                    question: `Részfeladat 1: Adja meg a görbe egy megfelelő paraméterezését!`,
                    rubric: `Megoldás. 1. részfeladat megoldása ez: r⃗(t) = (-2t+1, -2t+2, 2), t ∈ [0,1]`,
                    answer: 0
                },
                {
                    question: `Részfeladat 2: Adja meg a paraméterezés deriváltját!`,
                    rubric: `Megoldás. 2. részfeladat megoldása ez: r⃗'(t) = (-2, -2, 0)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 3: Adja meg a vektormező értékét a görbén!`,
                    rubric: `Megoldás. 3. részfeladat megoldása ez: v⃗(r⃗(t)) = (-3(-2t+1)sin(-2t+1), 2e^(2(-2t+2)), 3cos(-2t+1)) = (-6sin(-2t+1), 2e^(-4t+4), 3cos(-2t+1))`,
                    answer: 0
                },
                {
                    question: `Részfeladat 4: Írja fel a vonalintegrált!`,
                    rubric: `Megoldás. 4. részfeladat megoldása ez: ∫[0,1] v⃗(r⃗(t)) · r⃗'(t) dt = ∫[0,1] (-6sin(-2t+1), 2e^(-4t+4), 3cos(-2t+1)) · (-2, -2, 0) dt`,
                    answer: 0
                },
                {
                    question: `Részfeladat 5: Számítsa ki az integranduszt!`,
                    rubric: `Megoldás. 5. részfeladat megoldása ez: ∫[0,1] [12sin(-2t+1) - 4e^(-4t+4)] dt`,
                    answer: 0
                },
                {
                    question: `Részfeladat 6: Végezze el az integrálást!`,
                    rubric: `Megoldás. 6. részfeladat megoldása ez: [-6cos(-2t+1) + e^(-4t+4)]|[0,1] = -6cos(-1) + e^0 - (-6cos(1) + e^4) = -e^4 + 1`,
                    answer: 0
                }
            ],
            expression: `Teljes megoldás:

Paraméterezés:
A görbe egy megfelelő paraméterezése:
r⃗(t) = B + (1-t)(A-B) = (-1, 0, 2) + (1-t)(1, 2, 2) = (-2t+1, -2t+2, 2), t ∈ [0,1]

Ennek deriváltja:
r⃗'(t) = (-2, -2, 0)

Továbbá:
v⃗(r⃗(t)) = (-3(-2t+1)sin(-2t+1), 2e^(2(-2t+2)), 3cos(-2t+1))
     = (-6sin(-2t+1), 2e^(-4t+4), 3cos(-2t+1))

Így a vonalintegrál:
∫[γ] v⃗ · dr⃗ = ∫[0,1] v⃗(r⃗(t)) · r⃗'(t) dt
        = ∫[0,1] (-6sin(-2t+1), 2e^(-4t+4), 3cos(-2t+1)) · (-2, -2, 0) dt
        = ∫[0,1] [12sin(-2t+1) - 4e^(-4t+4)] dt

Integrálva:
= [-6cos(-2t+1) + e^(-4t+4)]|[0,1]
= -6cos(-1) + e^0 - (-6cos(1) + e^4)
= -6cos(-1) + 1 + 6cos(1) - e^4
= -e^4 + 1`
        },
        {
            question: `Tekintsük az alábbi felületet:

V = {az origó középpontú, 2 sugarú gömbfelület y ≤ 0 és z ≥ 0 térbe eső része}
(tehát az oldallapok nem).

Számítsuk ki a

v⃗(x,y,z) = (3x, 3y, 3z+1)

vektormezőnek ezen a felületen vett felületi integrálját az origótól távolodó irányban (kifelé)!

Segítség az integráláshoz: 2sin(x)cos(x) = sin(2x).
Segítség a G-O tételhez: az y=0 síkban elhelyezkedő körlapon a felületi integrál nulla (azaz ott nem kell kiszámítani).`,
            answer: 0,
            alternativeAnswer: undefined,
            thirdAnswer: undefined,
            fourthAnswer: undefined,
            type: 'multiplication',
            subQuestions: [
                {
                    question: `Részfeladat 1: Írja fel a Gauss-Osztrigyin tétel alapján a felületi integrált!`,
                    rubric: `Megoldás. 1. részfeladat megoldása ez: ∬[F] v⃗·dF⃗ = ∭[V] div(v⃗) dV - ∬[y=0 oldallap] v⃗·dF⃗ - ∬[z=0 oldallap] v⃗·dF⃗`,
                    answer: 0
                },
                {
                    question: `Részfeladat 2: Miért nulla az y=0 oldallap integrálja?`,
                    rubric: `Megoldás. 2. részfeladat megoldása ez: A Gauss-Osztrigyin tétel szerint az y=0 síkban elhelyezkedő körlapon a felületi integrál nulla`,
                    answer: 0
                },
                {
                    question: `Részfeladat 3: Számítsa ki a vektormező divergenciáját!`,
                    rubric: `Megoldás. 3. részfeladat megoldása ez: div(v⃗) = ∂/∂x(3x) + ∂/∂y(3y) + ∂/∂z(3z+1) = 3 + 3 + 3 = 9`,
                    answer: 0
                },
                {
                    question: `Részfeladat 4: Számítsa ki a térfogati integrált (divergencia integrálja)!`,
                    rubric: `Megoldás. 4. részfeladat megoldása ez: ∭[V] div(v⃗) dV = ∭[V] 9 dV = 9·Vol(V)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 5: Adja meg a negyedgömb térfogatát!`,
                    rubric: `Megoldás. 5. részfeladat megoldása ez: V_negyedgömb = (1/4)·(4/3)πr³ = (1/3)π·2³ = 8π/3`,
                    answer: 0
                },
                {
                    question: `Részfeladat 6: Írja fel a z=0 oldallap paraméterezését!`,
                    rubric: `Megoldás. 6. részfeladat megoldása ez: r⃗(u,w) = (u cos w, u sin w, 0), u ∈ [0,2], w ∈ [π,2π)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 7: Számítsa ki a parciális deriváltakat!`,
                    rubric: `Megoldás. 7. részfeladat megoldása ez: r⃗_u = (cos w, sin w, 0), r⃗_w = (-u sin w, u cos w, 0)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 8: Számítsa ki a kereszt szorzatot és határozza meg a normálvektort!`,
                    rubric: `Megoldás. 8. részfeladat megoldása ez: r⃗_u × r⃗_w = (0, 0, u), de mivel ez nem befelé mutat, a normálvektor: (0, 0, -u)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 9: Adja meg a vektormező értékét a z=0 oldallapon!`,
                    rubric: `Megoldás. 9. részfeladat megoldása ez: v⃗(r⃗(u,w)) = (3u cos w, 3u sin w, 1)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 10: Számítsa ki a z=0 oldallap integrálját!`,
                    rubric: `Megoldás. 10. részfeladat megoldása ez: ∬[z=0] v⃗·dF⃗ = ∫[0,2]∫[π,2π] (3u cos w, 3u sin w, 1)·(0, 0, -u) dw du = ∫[0,2]∫[π,2π] (-u) dw du = -2π`,
                    answer: 0
                },
                {
                    question: `Részfeladat 11: Adja meg a végeredményt!`,
                    rubric: `Megoldás. 11. részfeladat megoldása ez: ∬[F] v⃗·dF⃗ = 9·8π/3 - 0 - (-2π) = 24π + 2π = 26π`,
                    answer: 0
                }
            ],
            expression: `Teljes megoldás:

A keresett felületi integrál kiszámítható a Gauss-Osztrigyin tétel alapján:
∬[F] v⃗·dF⃗ = ∭[V] div(v⃗) dV - ∬[y=0 oldallap] v⃗·dF⃗ - ∬[z=0 oldallap] v⃗·dF⃗

De ismert, hogy ∬[y=0 oldallap] v⃗·dF⃗ = 0.

A divergencia:
div(v⃗) = ∂/∂x(3x) + ∂/∂y(3y) + ∂/∂z(3z+1) = 3 + 3 + 3 = 9

Így:
∭[V] div(v⃗) dV = ∭[V] 9 dV = 9·Vol(V)

A negyedgömb térfogata:
V_negyedgömb = (1/4)·(4/3)πr³ = (1/3)π·2³ = 8π/3

azaz
∭[V] div(v⃗) dV = 9·8π/3 = 24π

A z=0 oldallap paraméterezése:
r⃗(u,w) = (u cos w, u sin w, 0), u ∈ [0,2], w ∈ [π,2π)

Parciális deriváltak:
r⃗_u = (cos w, sin w, 0)
r⃗_w = (-u sin w, u cos w, 0)

Keresztszorzat:
r⃗_u × r⃗_w = (0, 0, u)

Ez nem befelé mutat, ezért helyette a (0, 0, -u) vektort használjuk.

Továbbá:
v⃗(r⃗(u,w)) = (3u cos w, 3u sin w, 1)

Így:
∬[z=0] v⃗·dF⃗ = ∫[0,2]∫[π,2π] (3u cos w, 3u sin w, 1)·(0, 0, -u) dw du
        = ∫[0,2]∫[π,2π] (-u) dw du
        = ∫[0,2] (-πu) du
        = -πu²/2|[0,2]
        = -2π

Összesen:
∬[F] v⃗·dF⃗ = ∭[V] div(v⃗) dV - ∬[y=0] v⃗·dF⃗ - ∬[z=0] v⃗·dF⃗
        = 24π - 0 - (-2π)
        = 24π + 2π
        = 26π`
        },
        {
            question: `Oldjuk meg az alábbi egyenletrendszert!

x'(t) = 2x(t) + 3y(t) + e^(-4t)
y'(t) = -3x(t) + 2y(t)`,
            answer: 0,
            alternativeAnswer: undefined,
            thirdAnswer: undefined,
            fourthAnswer: undefined,
            type: 'multiplication',
            subQuestions: [
                {
                    question: `Részfeladat 1: Adja meg a rendszerhez tartozó mátrixot!`,
                    rubric: `Megoldás. 1. részfeladat megoldása ez: A = [[2, 3], [-3, 2]]`,
                    answer: 0
                },
                {
                    question: `Részfeladat 2: Számítsa ki a mátrix sajátértékeit!`,
                    rubric: `Megoldás. 2. részfeladat megoldása ez: λ₁,₂ = 2 ± 3i`,
                    answer: 0
                },
                {
                    question: `Részfeladat 3: Adja meg a 2+3i sajátértékhez tartozó sajátvektort!`,
                    rubric: `Megoldás. 3. részfeladat megoldása ez: s₁ = [-i, 1]`,
                    answer: 0
                },
                {
                    question: `Részfeladat 4: Írja fel a homogén megoldást!`,
                    rubric: `Megoldás. 4. részfeladat megoldása ez: [x_h(t), y_h(t)] = c₁[e^(2t)sin(3t), e^(2t)cos(3t)] + c₂[-e^(2t)cos(3t), e^(2t)sin(3t)]`,
                    answer: 0
                },
                {
                    question: `Részfeladat 5: Vezesse vissza másodrendűre az egyenletet a partikuláris megoldáshoz!`,
                    rubric: `Megoldás. 5. részfeladat megoldása ez: x''(t) = 4x'(t) - 13x(t) - 6e^(-4t)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 6: Határozza meg a próbaalakot és az A együtthatót!`,
                    rubric: `Megoldás. 6. részfeladat megoldása ez: x_p(t) = A e^(-4t), ahol A = -2/15`,
                    answer: 0
                },
                {
                    question: `Részfeladat 7: Adja meg a partikuláris megoldás másik komponensét!`,
                    rubric: `Megoldás. 7. részfeladat megoldása ez: y_p(t) = -(1/15) e^(-4t)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 8: Oldja meg közvetlenül a rendszerbe helyettesítéssel!`,
                    rubric: `Megoldás. 8. részfeladat megoldása ez: x_p(t) = A e^(-4t), y_p(t) = B e^(-4t), ahol A = -2/15, B = -1/15`,
                    answer: 0
                },
                {
                    question: `Részfeladat 9: Adja meg az alapmátrixot az állandók variálásához!`,
                    rubric: `Megoldás. 9. részfeladat megoldása ez: Φ(t) = [[e^(2t)sin(3t), -e^(2t)cos(3t)], [e^(2t)cos(3t), e^(2t)sin(3t)]]`,
                    answer: 0
                }
            ],
            expression: `Teljes megoldás:

A megoldást előállítjuk homogén + partikuláris alakban.

Homogén megoldás:
A rendszerhez tartozó mátrix:
A = [[2, 3], [-3, 2]]

Ennek sajátértékei:
λ₁,₂ = 2 ± 3i

A 2+3i-hez tartozó sajátvektor:
s₁ = [-i, 1]

azaz
e^((2+3i)t) = e^(2t)(cos(3t) + i sin(3t))

Így:
e^((2+3i)t) s₁ = e^(2t)(cos(3t) + i sin(3t)) [-i, 1]
            = [-i e^(2t)cos(3t) + e^(2t)sin(3t), e^(2t)cos(3t) + i e^(2t)sin(3t)]

Ebből a homogén megoldás (valós bázisban):
[x_h(t), y_h(t)] = c₁[e^(2t)sin(3t), e^(2t)cos(3t)] + c₂[-e^(2t)cos(3t), e^(2t)sin(3t)]

Partikuláris megoldás:

Másodrendűre írás:
x''(t) = 2x'(t) + 3y'(t) - 4e^(-4t)
   = 2x'(t) - 9x(t) + 6y(t) - 4e^(-4t)

Az első egyenletből:
3y(t) = x'(t) - 2x(t) - e^(-4t)

Behelyettesítve:
x''(t) = 2x'(t) - 9x(t) + 2x'(t) - 4x(t) - 2e^(-4t) - 4e^(-4t)
   = 4x'(t) - 13x(t) - 6e^(-4t)

Próbaalak:
x_p(t) = A e^(-4t)

Behelyettesítve:
16A e^(-4t) = 4(-4A) e^(-4t) - 13A e^(-4t) - 6e^(-4t)
16A = -16A - 13A - 6
A = -6/45 = -2/15

Ezért
x_p(t) = -(2/15) e^(-4t)

A másik komponens:
y_p(t) = (1/3)(x'(t) - 2x(t) - e^(-4t))
   = (1/3)((8/15)e^(-4t) + (4/15)e^(-4t) - e^(-4t))
   = -(1/15) e^(-4t)

Partikuláris megoldás keresése közvetlenül a rendszerben:
Legyen x_p(t) = A e^(-4t) és y_p(t) = B e^(-4t)

Behelyettesítve:
-4A = 2A + 3B + 1
-4B = -3A + 2B

Ennek megoldása:
A = -2/15, B = -1/15

Állandók variálása:
Az alapmátrix:
Φ(t) = [[e^(2t)sin(3t), -e^(2t)cos(3t)], [e^(2t)cos(3t), e^(2t)sin(3t)]]

Ennek inverze, az integrálás és az utolsó szorzás elvégzése után adódik a teljes megoldás.

Végső megoldás:
[x(t), y(t)] = c₁[e^(2t)sin(3t), e^(2t)cos(3t)] + c₂[-e^(2t)cos(3t), e^(2t)sin(3t)] + [-(2/15)e^(-4t), -(1/15)e^(-4t)]`
        },
        {
            question: `a) Adjuk meg az alábbi differenciálegyenlet y(0)=1 kezdeti feltételt kielégítő megoldását!

y'(x) = (y(x))² x³

b) Határozzuk meg a megoldásfüggvény lokális szélsőértékeit!

Alternatíva: Keressük meg az alábbi függvény szélsőértékét:
f(x) = 1/(-x²/2 + 3)`,
            answer: 0,
            alternativeAnswer: undefined,
            thirdAnswer: undefined,
            fourthAnswer: undefined,
            type: 'multiplication',
            subQuestions: [
                {
                    question: `Részfeladat 1: Írja fel az egyenletet szétválasztható formában!`,
                    rubric: `Megoldás. 1. részfeladat megoldása ez: dy/dx = y² x³, azaz dy/y² = x³ dx`,
                    answer: 0
                },
                {
                    question: `Részfeladat 2: Integrálja mindkét oldalt!`,
                    rubric: `Megoldás. 2. részfeladat megoldása ez: ∫ y^(-2) dy = ∫ x³ dx, azaz -1/y = x⁴/4 + c`,
                    answer: 0
                },
                {
                    question: `Részfeladat 3: Fejezze ki y-t!`,
                    rubric: `Megoldás. 3. részfeladat megoldása ez: y = -1/(x⁴/4 + c)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 4: Alkalmazza a kezdeti feltételt és határozza meg c értékét!`,
                    rubric: `Megoldás. 4. részfeladat megoldása ez: y(0) = 1 = -1/c, tehát c = -1`,
                    answer: 0
                },
                {
                    question: `Részfeladat 5: Írja fel a végleges megoldást!`,
                    rubric: `Megoldás. 5. részfeladat megoldása ez: y(x) = -1/(x⁴/4 - 1) = -4/(x⁴ - 4)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 6: Számítsa ki a deriváltat a szélsőértékekhez!`,
                    rubric: `Megoldás. 6. részfeladat megoldása ez: y'(x) = (16x³)/(x⁴ - 4)²`,
                    answer: 0
                },
                {
                    question: `Részfeladat 7: Határozza meg a derivált zérushelyeit!`,
                    rubric: `Megoldás. 7. részfeladat megoldása ez: y'(x) = 0, ha x = 0`,
                    answer: 0
                },
                {
                    question: `Részfeladat 8: Vizsgálja meg a második deriváltat és határozza meg a szélsőérték típusát!`,
                    rubric: `Megoldás. 8. részfeladat megoldása ez: y''(0) < 0, tehát x = 0-nál lokális maximum van`,
                    answer: 0
                },
                {
                    question: `Részfeladat 9 (Alternatíva): Határozza meg az f(x) = 1/(-x²/2 + 3) függvény szélsőértékét!`,
                    rubric: `Megoldás. 9. részfeladat megoldása ez: f'(x) = x/(3 - x²/2)², f'(x) = 0, ha x = 0, f''(0) > 0, tehát x = 0-nál minimum van`,
                    answer: 0
                }
            ],
            expression: `Teljes megoldás:

a) Szétválasztható differenciálegyenlet:
dy/dx = y² x³
dy/y² = x³ dx

Integrálva mindkét oldalt:
∫ y^(-2) dy = ∫ x³ dx
-1/y = x⁴/4 + c

Fejezzük ki y-t:
y = -1/(x⁴/4 + c)

Kezdeti feltétel: y(0) = 1
1 = -1/c
c = -1

Végleges megoldás:
y(x) = -1/(x⁴/4 - 1) = -1/((x⁴ - 4)/4) = -4/(x⁴ - 4)

b) Szélsőértékek:
Deriválva:
y'(x) = d/dx[-4/(x⁴ - 4)] = 16x³/(x⁴ - 4)²

y'(x) = 0, ha x = 0

Második derivált:
y''(x) = [48x²(x⁴-4)² - 16x³·2(x⁴-4)·4x³] / (x⁴-4)⁴

y''(0) < 0, tehát x = 0-nál lokális maximum van.

Alternatíva:
f(x) = 1/(-x²/2 + 3) = 1/(3 - x²/2)

f'(x) = d/dx[(3 - x²/2)^(-1)] = x/(3 - x²/2)²

f'(x) = 0, ha x = 0

f''(x) = [(3-x²/2)² - x·2(3-x²/2)(-x)] / (3-x²/2)⁴

f''(0) > 0, tehát x = 0-nál minimum van.`
        },
        {
            question: `(Fourier sorok feladatsor 5. feladat) Tekintsük azt az f:[0,2]→ℝ függvényt, mely az alábbi módon van definiálva:

f(x) = {
  0, ha x ∈ [0,1],
  1, ha x ∈ (1, 3/2],
  -2, ha x ∈ (3/2, 2]
}

Terjesszük ki ezt a függvényt úgy, hogy minden x ∈ ℝ esetén értelmezve legyen, és Fourier-sora tisztán koszinuszos legyen!
Számítsuk ki ezt a Fourier-sort!`,
            answer: 0,
            alternativeAnswer: undefined,
            thirdAnswer: undefined,
            fourthAnswer: undefined,
            type: 'multiplication',
            subQuestions: [
                {
                    question: `Részfeladat 1: Hogyan kell kiterjeszteni a függvényt, hogy páros legyen? Adja meg a kiterjesztett függvény definícióját!`,
                    rubric: `Megoldás. 1. részfeladat megoldása ez: Páros módon kiterjesztjük: f(x) = f(-x) és f(x) = f(x+4) (4 a periódus, mert 2L = 4)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 2: Miért lesz bₖ = 0 minden k-ra?`,
                    rubric: `Megoldás. 2. részfeladat megoldása ez: A szimmetria miatt, mivel páros függvényről van szó`,
                    answer: 0
                },
                {
                    question: `Részfeladat 3: Adja meg az a₀ együttható képletét és számítsa ki!`,
                    rubric: `Megoldás. 3. részfeladat megoldása ez: a₀ = (1/L) ∫[0,L] f(x) dx = (1/2) ∫[0,2] f(x) dx = (1/2)[0 + 1·(3/2-1) + (-2)·(2-3/2)] = (1/2)[1/2 - 1] = -1/4`,
                    answer: 0
                },
                {
                    question: `Részfeladat 4: Adja meg az aₖ együtthatók képletét!`,
                    rubric: `Megoldás. 4. részfeladat megoldása ez: aₖ = (2/L) ∫[0,L] f(x)cos(kπx/L) dx = (2/2) ∫[0,2] f(x)cos(kπx/2) dx = ∫[0,2] f(x)cos(kπx/2) dx`,
                    answer: 0
                },
                {
                    question: `Részfeladat 5: Írja fel az integrálokat a függvény definíciója alapján!`,
                    rubric: `Megoldás. 5. részfeladat megoldása ez: aₖ = ∫[0,1] 0·cos(kπx/2) dx + ∫[1,3/2] 1·cos(kπx/2) dx + ∫[3/2,2] (-2)·cos(kπx/2) dx`,
                    answer: 0
                },
                {
                    question: `Részfeladat 6: Számítsa ki az integrálokat!`,
                    rubric: `Megoldás. 6. részfeladat megoldása ez: aₖ = [2/(kπ)sin(kπx/2)]|[1,3/2] - 2[2/(kπ)sin(kπx/2)]|[3/2,2] = (2/(kπ))[sin(3kπ/4) - sin(kπ/2)] - (4/(kπ))[sin(kπ) - sin(3kπ/4)]`,
                    answer: 0
                },
                {
                    question: `Részfeladat 7: Egyszerűsítse az aₖ kifejezést!`,
                    rubric: `Megoldás. 7. részfeladat megoldása ez: aₖ = (2/(kπ))[sin(3kπ/4) - sin(kπ/2)] - (4/(kπ))[0 - sin(3kπ/4)] = (2/(kπ))[sin(3kπ/4) - sin(kπ/2) + 2sin(3kπ/4)] = (2/(kπ))[3sin(3kπ/4) - sin(kπ/2)]`,
                    answer: 0
                }
            ],
            expression: `Teljes megoldás:

Mivel tisztán koszinuszos Fourier-sort szeretnénk, ezért a függvényt páros módon terjesztjük ki.
Legyen a kiterjesztés: f(x) = f(-x) és f(x) = f(x+4) (4 a periódus, mert 2L = 4, ahol L = 2)

A szimmetria miatt:
bₖ = 0 minden k-ra

Az a₀ együttható:
a₀ = (1/L) ∫[0,L] f(x) dx = (1/2) ∫[0,2] f(x) dx
   = (1/2)[∫[0,1] 0 dx + ∫[1,3/2] 1 dx + ∫[3/2,2] (-2) dx]
   = (1/2)[0 + 1·(3/2-1) + (-2)·(2-3/2)]
   = (1/2)[1/2 - 1]
   = -1/4

Az aₖ együtthatók (k ≥ 1):
aₖ = (2/L) ∫[0,L] f(x)cos(kπx/L) dx
   = (2/2) ∫[0,2] f(x)cos(kπx/2) dx
   = ∫[0,2] f(x)cos(kπx/2) dx

A definíció felhasználásával:
aₖ = ∫[0,1] 0·cos(kπx/2) dx + ∫[1,3/2] 1·cos(kπx/2) dx + ∫[3/2,2] (-2)·cos(kπx/2) dx
   = 0 + [2/(kπ)sin(kπx/2)]|[1,3/2] - 2[2/(kπ)sin(kπx/2)]|[3/2,2]
   = (2/(kπ))[sin(3kπ/4) - sin(kπ/2)] - (4/(kπ))[sin(kπ) - sin(3kπ/4)]
   = (2/(kπ))[sin(3kπ/4) - sin(kπ/2)] - (4/(kπ))[0 - sin(3kπ/4)]
   = (2/(kπ))[sin(3kπ/4) - sin(kπ/2) + 2sin(3kπ/4)]
   = (2/(kπ))[3sin(3kπ/4) - sin(kπ/2)]

A Fourier-sor:
f(x) = a₀/2 + Σ[k=1,∞] aₖ cos(kπx/2)
 = -1/8 + Σ[k=1,∞] (2/(kπ))[3sin(3kπ/4) - sin(kπ/2)] cos(kπx/2)`
        },
        {
            question: `(Feltételes szélsőérték feladatsor 5. feladat) Keressük az alábbi függvény szélsőértékeit az

(x-1)² + y² ≤ 1

egyenletű körlapon!

f(x,y) = x² - y² + 3x - 1`,
            answer: 0,
            alternativeAnswer: undefined,
            thirdAnswer: undefined,
            fourthAnswer: undefined,
            type: 'multiplication',
            subQuestions: [
                {
                    question: `Részfeladat 1: Számítsa ki a függvény gradiensét!`,
                    rubric: `Megoldás. 1. részfeladat megoldása ez: ∇f = (∂f/∂x, ∂f/∂y) = (2x + 3, -2y)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 2: Keresse meg a belső kritikus pontokat (ahol a gradiens nulla)!`,
                    rubric: `Megoldás. 2. részfeladat megoldása ez: 2x + 3 = 0 és -2y = 0, tehát x = -3/2, y = 0. Ellenőrizzük: (-3/2 - 1)² + 0² = 25/4 > 1, tehát ez nincs a körlapon belül`,
                    answer: 0
                },
                {
                    question: `Részfeladat 3: Írja fel a Lagrange-multiplikátor módszer egyenleteit a határon!`,
                    rubric: `Megoldás. 3. részfeladat megoldása ez: ∇f = λ∇g, ahol g(x,y) = (x-1)² + y² - 1 = 0. Tehát: (2x+3, -2y) = λ(2(x-1), 2y)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 4: Oldja meg a Lagrange-egyenleteket!`,
                    rubric: `Megoldás. 4. részfeladat megoldása ez: 2x+3 = 2λ(x-1) és -2y = 2λy. Ha y ≠ 0, akkor λ = -1, és ebből x = -1/2. Ha y = 0, akkor a feltételből x = 0 vagy x = 2`,
                    answer: 0
                },
                {
                    question: `Részfeladat 5: Határozza meg az összes kritikus pontot a határon!`,
                    rubric: `Megoldás. 5. részfeladat megoldása ez: (0, 0), (2, 0), (-1/2, ±√3/2)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 6: Számítsa ki a függvény értékét minden kritikus pontban!`,
                    rubric: `Megoldás. 6. részfeladat megoldása ez: f(0,0) = -1, f(2,0) = 9, f(-1/2, √3/2) = -5/4, f(-1/2, -√3/2) = -5/4`,
                    answer: 0
                },
                {
                    question: `Részfeladat 7: Adja meg a maximum és minimum értékeket!`,
                    rubric: `Megoldás. 7. részfeladat megoldása ez: Maximum: f(2,0) = 9, Minimum: f(-1/2, ±√3/2) = -5/4`,
                    answer: 0
                }
            ],
            expression: `Teljes megoldás:

Belső pontok keresése:
A gradiens:
∇f = (∂f/∂x, ∂f/∂y) = (2x + 3, -2y)

Kritikus pontok (ahol a gradiens nulla):
2x + 3 = 0 → x = -3/2
-2y = 0 → y = 0

Ellenőrizzük, hogy ez a pont a körlapon belül van-e:
(-3/2 - 1)² + 0² = (-5/2)² = 25/4 > 1

Tehát ez a pont nincs a körlapon belül, így csak a határt kell vizsgálni.

Határ vizsgálata (Lagrange-multiplikátor módszer):
Feltétel: g(x,y) = (x-1)² + y² - 1 = 0

Lagrange-egyenletek:
∇f = λ∇g
(2x+3, -2y) = λ(2(x-1), 2y)

Tehát:
2x + 3 = 2λ(x-1)  ... (1)
-2y = 2λy        ... (2)
(x-1)² + y² = 1   ... (3)

A (2) egyenletből:
-2y = 2λy
y(λ + 1) = 0

Esetszétválasztás:

1. eset: y = 0
Ekkor a (3) egyenletből: (x-1)² = 1, tehát x = 0 vagy x = 2
Pontok: (0, 0) és (2, 0)

2. eset: y ≠ 0, akkor λ = -1
Ekkor az (1) egyenletből:
2x + 3 = -2(x-1)
2x + 3 = -2x + 2
4x = -1
x = -1/2

A (3) egyenletből:
(-1/2 - 1)² + y² = 1
(-3/2)² + y² = 1
9/4 + y² = 1
y² = 1 - 9/4 = -5/4

Ez lehetetlen, tehát nincs ilyen pont.

Várjunk, újraszámolva:
Ha λ = -1 és x = -1/2, akkor:
(-1/2 - 1)² + y² = 1
(-3/2)² + y² = 1
9/4 + y² = 1
y² = -5/4

Ez valóban lehetetlen. Próbáljuk meg újra a Lagrange-egyenleteket.

Valójában a határon paraméterezéssel is megoldható:
x = 1 + cos t, y = sin t, t ∈ [0, 2π)

f(x(t), y(t)) = (1+cos t)² - sin² t + 3(1+cos t) - 1
          = 1 + 2cos t + cos² t - sin² t + 3 + 3cos t - 1
          = 3 + 5cos t + cos² t - sin² t
          = 3 + 5cos t + cos(2t)

Deriválva t szerint:
f'(t) = -5sin t - 2sin(2t) = -5sin t - 4sin t cos t = -sin t(5 + 4cos t)

f'(t) = 0, ha sin t = 0 vagy cos t = -5/4 (lehetetlen)

sin t = 0 → t = 0, π, 2π

Pontok:
t = 0: (2, 0) → f(2,0) = 4 - 0 + 6 - 1 = 9
t = π: (0, 0) → f(0,0) = 0 - 0 + 0 - 1 = -1
t = 2π: (2, 0) → ugyanaz

További kritikus pontok lehetnek, ahol cos t = -5/4 lehetetlen, de nézzük meg a második deriváltat is.

Valójában egyszerűbb módszer: a határon a függvény értéke:
f(x,y) = x² - y² + 3x - 1, ahol (x-1)² + y² = 1

y² = 1 - (x-1)² = 1 - (x² - 2x + 1) = 2x - x²

f(x) = x² - (2x - x²) + 3x - 1 = x² - 2x + x² + 3x - 1 = 2x² + x - 1

f'(x) = 4x + 1 = 0 → x = -1/4

De x ∈ [0, 2] a határon, mert (x-1)² ≤ 1 → 0 ≤ x ≤ 2

f(0) = -1, f(2) = 9, f(-1/4) nincs a [0,2] intervallumban

Tehát:
Maximum: f(2, 0) = 9
Minimum: f(0, 0) = -1`
        },
        {
            question: `Vonalintegrál (3. gyakorlat 1. f) és 5. feladat) Számítsuk ki a

v⃗(x,y,z) = (2xyz, x²z, x²y)

vektormező integrálját a z = 3 síkban fekvő x² + y² = 1 körnek az A(1,0,3) és B(1/√2, 1/√2, 3) pontok közötti íve mentén!`,
            answer: 0,
            alternativeAnswer: undefined,
            thirdAnswer: undefined,
            fourthAnswer: undefined,
            type: 'multiplication',
            subQuestions: [
                {
                    question: `Részfeladat 1: Adja meg a görbe paraméterezését!`,
                    rubric: `Megoldás. 1. részfeladat megoldása ez: r⃗(t) = (cos t, sin t, 3), t ∈ [0, π/4]`,
                    answer: 0
                },
                {
                    question: `Részfeladat 2: Adja meg a paraméterezés deriváltját!`,
                    rubric: `Megoldás. 2. részfeladat megoldása ez: r⃗'(t) = (-sin t, cos t, 0)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 3: Adja meg a vektormező értékét a görbén!`,
                    rubric: `Megoldás. 3. részfeladat megoldása ez: v⃗(r⃗(t)) = (2cos t·sin t·3, cos² t·3, cos² t·sin t) = (6cos t sin t, 3cos² t, cos² t sin t)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 4: Írja fel a vonalintegrált!`,
                    rubric: `Megoldás. 4. részfeladat megoldása ez: ∫[0,π/4] v⃗(r⃗(t)) · r⃗'(t) dt = ∫[0,π/4] (6cos t sin t, 3cos² t, cos² t sin t) · (-sin t, cos t, 0) dt`,
                    answer: 0
                },
                {
                    question: `Részfeladat 5: Számítsa ki az integranduszt!`,
                    rubric: `Megoldás. 5. részfeladat megoldása ez: ∫[0,π/4] [-6cos t sin² t + 3cos³ t] dt`,
                    answer: 0
                },
                {
                    question: `Részfeladat 6: Végezze el az integrálást!`,
                    rubric: `Megoldás. 6. részfeladat megoldása ez: ∫[0,π/4] [-6cos t sin² t + 3cos³ t] dt = [-3sin³ t + 3sin t]|[0,π/4] = -3(1/√2)³ + 3(1/√2) = -3/(2√2) + 3/√2 = 3/(2√2)`,
                    answer: 0
                }
            ],
            expression: `Teljes megoldás:

Paraméterezés:
A görbe a z = 3 síkban fekvő x² + y² = 1 kör íve.
Paraméterezés: r⃗(t) = (cos t, sin t, 3), t ∈ [0, π/4]

Ellenőrizzük:
- A(1,0,3) = (cos 0, sin 0, 3) ✓
- B(1/√2, 1/√2, 3) = (cos π/4, sin π/4, 3) ✓

Derivált:
r⃗'(t) = (-sin t, cos t, 0)

Vektormező értéke a görbén:
v⃗(r⃗(t)) = (2cos t·sin t·3, cos² t·3, cos² t·sin t)
     = (6cos t sin t, 3cos² t, cos² t sin t)

Vonalintegrál:
∫[γ] v⃗ · dr⃗ = ∫[0,π/4] v⃗(r⃗(t)) · r⃗'(t) dt
        = ∫[0,π/4] (6cos t sin t, 3cos² t, cos² t sin t) · (-sin t, cos t, 0) dt
        = ∫[0,π/4] [-6cos t sin² t + 3cos³ t] dt

Integrálás:
∫[-6cos t sin² t + 3cos³ t] dt
= ∫[-6cos t sin² t] dt + ∫[3cos³ t] dt
= -6∫[cos t sin² t] dt + 3∫[cos³ t] dt

Az első integrál:
∫[cos t sin² t] dt = ∫[sin² t] d(sin t) = sin³ t/3

A második integrál:
∫[cos³ t] dt = ∫[cos t cos² t] dt = ∫[cos t (1 - sin² t)] dt
        = ∫[cos t] dt - ∫[cos t sin² t] dt
        = sin t - sin³ t/3

Tehát:
∫[-6cos t sin² t + 3cos³ t] dt
= -6(sin³ t/3) + 3(sin t - sin³ t/3)
= -2sin³ t + 3sin t - sin³ t
= -3sin³ t + 3sin t

Határok közé helyettesítve:
[-3sin³ t + 3sin t]|[0,π/4]
= -3(1/√2)³ + 3(1/√2) - 0
= -3/(2√2) + 3/√2
= -3/(2√2) + 6/(2√2)
= 3/(2√2)`
        },
        {
            question: `Felületi integrál (4. gyakorlat 2. és 5. gyakorlat 1. feladat) Számítsuk ki a

v⃗(x,y,z) = (2x, 2y, 2z)

vektormezőnek a

V = {(x,y,z): x² + y² ≤ 1, z = 1 - √(x² + y²)}

felületen vett felületi integrálját a z tengelytől távolodó irányban!`,
            answer: 0,
            alternativeAnswer: undefined,
            thirdAnswer: undefined,
            fourthAnswer: undefined,
            type: 'multiplication',
            subQuestions: [
                {
                    question: `Részfeladat 1: Írja fel a felület paraméterezését!`,
                    rubric: `Megoldás. 1. részfeladat megoldása ez: r⃗(u,v) = (u cos v, u sin v, 1-u), u ∈ [0,1], v ∈ [0,2π)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 2: Számítsa ki a parciális deriváltakat!`,
                    rubric: `Megoldás. 2. részfeladat megoldása ez: r⃗_u = (cos v, sin v, -1), r⃗_v = (-u sin v, u cos v, 0)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 3: Számítsa ki a kereszt szorzatot!`,
                    rubric: `Megoldás. 3. részfeladat megoldása ez: r⃗_u × r⃗_v = (u cos v, u sin v, u)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 4: Ellenőrizze, hogy a normálvektor a z tengelytől távolodó irányba mutat-e!`,
                    rubric: `Megoldás. 4. részfeladat megoldása ez: A normálvektor (u cos v, u sin v, u) komponensei pozitívak, tehát kifelé mutat`,
                    answer: 0
                },
                {
                    question: `Részfeladat 5: Adja meg a vektormező értékét a felületen!`,
                    rubric: `Megoldás. 5. részfeladat megoldása ez: v⃗(r⃗(u,v)) = (2u cos v, 2u sin v, 2(1-u))`,
                    answer: 0
                },
                {
                    question: `Részfeladat 6: Írja fel a felületi integrált!`,
                    rubric: `Megoldás. 6. részfeladat megoldása ez: ∬[V] v⃗·dF⃗ = ∫[0,1]∫[0,2π] (2u cos v, 2u sin v, 2(1-u)) · (u cos v, u sin v, u) dv du`,
                    answer: 0
                },
                {
                    question: `Részfeladat 7: Számítsa ki a skaláris szorzatot!`,
                    rubric: `Megoldás. 7. részfeladat megoldása ez: v⃗·(r⃗_u × r⃗_v) = 2u²cos²v + 2u²sin²v + 2u(1-u) = 2u² + 2u - 2u² = 2u`,
                    answer: 0
                },
                {
                    question: `Részfeladat 8: Végezze el az integrálást!`,
                    rubric: `Megoldás. 8. részfeladat megoldása ez: ∫[0,1]∫[0,2π] 2u dv du = ∫[0,1] 4πu du = 2πu²|[0,1] = 2π`,
                    answer: 0
                }
            ],
            expression: `Teljes megoldás:

Paraméterezés:
A felület: z = 1 - √(x² + y²), ahol x² + y² ≤ 1

Polárkoordinátás paraméterezés:
r⃗(u,v) = (u cos v, u sin v, 1-u), u ∈ [0,1], v ∈ [0,2π)

Parciális deriváltak:
r⃗_u = (cos v, sin v, -1)
r⃗_v = (-u sin v, u cos v, 0)

Kereszt szorzat (normálvektor):
r⃗_u × r⃗_v = |i  j  k |
        |cos v  sin v  -1|
        |-u sin v  u cos v  0|
     = (u cos v, u sin v, u)

A normálvektor (u cos v, u sin v, u) komponensei pozitívak (u ≥ 0), tehát kifelé mutat a z tengelytől távolodó irányba.

Vektormező értéke a felületen:
v⃗(r⃗(u,v)) = (2u cos v, 2u sin v, 2(1-u))

Felületi integrál:
∬[V] v⃗·dF⃗ = ∫[0,1]∫[0,2π] v⃗(r⃗(u,v)) · (r⃗_u × r⃗_v) dv du
        = ∫[0,1]∫[0,2π] (2u cos v, 2u sin v, 2(1-u)) · (u cos v, u sin v, u) dv du

Skaláris szorzat:
(2u cos v, 2u sin v, 2(1-u)) · (u cos v, u sin v, u)
= 2u²cos²v + 2u²sin²v + 2u(1-u)
= 2u²(cos²v + sin²v) + 2u - 2u²
= 2u² + 2u - 2u²
= 2u

Integrálás:
∫[0,1]∫[0,2π] 2u dv du
= ∫[0,1] 2u · 2π du
= 4π ∫[0,1] u du
= 4π · u²/2|[0,1]
= 4π · 1/2
= 2π`
        },
        {
            question: `Inhomogén differenciálegyenlet-rendszer (11. gyakorlat 1. feladat) Oldjuk meg az alábbi egyenletrendszert!

x'(t) = y(t) + 2e^t
y'(t) = x(t) + z(t) + t²
z'(t) = y(t) + t`,
            answer: 0,
            alternativeAnswer: undefined,
            thirdAnswer: undefined,
            fourthAnswer: undefined,
            type: 'multiplication',
            subQuestions: [
                {
                    question: `Részfeladat 1: Írja fel a rendszer mátrixos alakját!`,
                    rubric: `Megoldás. 1. részfeladat megoldása ez: [x', y', z']ᵀ = A[x, y, z]ᵀ + [2e^t, t², t]ᵀ, ahol A = [[0, 1, 0], [1, 0, 1], [0, 1, 0]]`,
                    answer: 0
                },
                {
                    question: `Részfeladat 2: Számítsa ki a mátrix sajátértékeit!`,
                    rubric: `Megoldás. 2. részfeladat megoldása ez: det(A - λI) = 0, sajátértékek: λ₁ = 0, λ₂ = √2, λ₃ = -√2`,
                    answer: 0
                },
                {
                    question: `Részfeladat 3: Határozza meg a sajátvektorokat!`,
                    rubric: `Megoldás. 3. részfeladat megoldása ez: λ₁ = 0: [1, 0, -1]ᵀ, λ₂ = √2: [1, √2, 1]ᵀ, λ₃ = -√2: [1, -√2, 1]ᵀ`,
                    answer: 0
                },
                {
                    question: `Részfeladat 4: Írja fel a homogén megoldást!`,
                    rubric: `Megoldás. 4. részfeladat megoldása ez: [x_h, y_h, z_h]ᵀ = c₁[1, 0, -1]ᵀ + c₂[1, √2, 1]ᵀe^(√2t) + c₃[1, -√2, 1]ᵀe^(-√2t)`,
                    answer: 0
                },
                {
                    question: `Részfeladat 5: Keressen partikuláris megoldást az x_p(t) = Ae^t alakban!`,
                    rubric: `Megoldás. 5. részfeladat megoldása ez: x_p(t) = 2e^t/(1-1) divergál, más próbaalak kell`,
                    answer: 0
                },
                {
                    question: `Részfeladat 6: Keressen partikuláris megoldást az inhomogén tagokhoz!`,
                    rubric: `Megoldás. 6. részfeladat megoldása ez: Próbaalak: x_p = Ate^t, y_p = Bt² + Ct + D, z_p = Et² + Ft + G`,
                    answer: 0
                },
                {
                    question: `Részfeladat 7: Határozza meg a partikuláris megoldás együtthatóit!`,
                    rubric: `Megoldás. 7. részfeladat megoldása ez: Behelyettesítéssel és együtthatók összehasonlításával meghatározható az A, B, C, D, E, F, G`,
                    answer: 0
                },
                {
                    question: `Részfeladat 8: Írja fel a teljes megoldást!`,
                    rubric: `Megoldás. 8. részfeladat megoldása ez: [x, y, z]ᵀ = homogén megoldás + partikuláris megoldás`,
                    answer: 0
                }
            ],
            expression: `Teljes megoldás:

Mátrixos alak:
[x', y', z']ᵀ = A[x, y, z]ᵀ + [2e^t, t², t]ᵀ

ahol
A = [[0, 1, 0],
 [1, 0, 1],
 [0, 1, 0]]

Homogén rész:
A sajátértékek meghatározása:
det(A - λI) = 0
| -λ   1   0 |
|  1  -λ   1 | = 0
|  0   1  -λ |

-λ(-λ² - 1) - 1(-λ) = -λ³ + λ = -λ(λ² - 2) = 0

Sajátértékek: λ₁ = 0, λ₂ = √2, λ₃ = -√2

Sajátvektorok:
- λ₁ = 0: [1, 0, -1]ᵀ
- λ₂ = √2: [1, √2, 1]ᵀ
- λ₃ = -√2: [1, -√2, 1]ᵀ

Homogén megoldás:
[x_h, y_h, z_h]ᵀ = c₁[1, 0, -1]ᵀ + c₂[1, √2, 1]ᵀe^(√2t) + c₃[1, -√2, 1]ᵀe^(-√2t)

Partikuláris megoldás:
Az inhomogén tag: [2e^t, t², t]ᵀ

Próbaalakok:
- x_p(t) = Ate^t (mert e^t már szerepel a homogén megoldásban)
- y_p(t) = Bt² + Ct + D
- z_p(t) = Et² + Ft + G

Behelyettesítve a rendszerbe:
x'_p = y_p + 2e^t
y'_p = x_p + z_p + t²
z'_p = y_p + t

Ebből:
Ae^t + Ate^t = Bt² + Ct + D + 2e^t
2Bt + C = Ate^t + Et² + Ft + G + t²
2Et + F = Bt² + Ct + D + t

Együtthatók összehasonlításával meghatározható az A, B, C, D, E, F, G.

Teljes megoldás:
[x, y, z]ᵀ = homogén megoldás + partikuláris megoldás`
        }
    ];
