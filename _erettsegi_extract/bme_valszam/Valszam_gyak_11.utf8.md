
===== PAGE 1 =====
BME VIK - Valószínűségszámítás
2020. november 25, 26, 27.
10. Gyakorlat
Kovariancia folytonos esetben, Lineáris regresszió
1. Legyenek X és Y független valószínűségi változók, ahol E(X) = 4, E(Y ) = 0, D2(X) = 1, D2(Y ) = 2.
Határozzuk meg az E(5X−6Y ), E(XY ), D2(5X−6Y +8) és cov(5X+2Y +2, X+6Y −3) mennyiségeket.
2. Legyenek X, Y ∼U(0; 1) függetlenek, továbbá Z1 = XY és Z2 = X + Y .
a) Adjuk meg Z1 és Z2 várható értékét.
b) Igaz-e, hogy D2(XY ) megegyezik D2(X) · D2(Y )-nal?
c) Adjuk meg D2(Z1 + 2Z2)-t.
3. Legyen X és Y együttes sűrűségfüggvénye
fX,Y : (x, y) 7→
(
2(x3 + y3)
ha 0 < x < 1 és 0 < y < 1,
0
egyébként.
Határozzuk meg a cov(X, Y )-t.
4. Legyen X ∼N(m; σ2), Y = 3X + 8, Z = 5 −2X. Számoljuk ki az corr(Y, Z) korrelációs együtthatót.
5. Legyen X ∼U(0; 2π), Y = cos(X) és Z = sin(X). Határozzuk meg cov(Y, Z)-t. Független-e Y és Z?
6. Legyen U és V együttes sűrűségfüggvénye
fU,V : (u, v) 7→
(
1
√v
ha 0 < u < 1 és 0 < v < u2,
0
egyébként.
Határozzuk meg cov(U, V 2)-et.
7. Legyenek X1, X2 és X3 korrelálatlan valószínűségi változók, mind 0 várható értékkel és 1 szórással.
a) Mennyi cov(X1 + X2, X2 + X3), D2(X1 + X2) és D2(X2 + X3)?
b) Mekkora a korreláció X1 + X2 és X2 + X3 között?
c) Mi a regressziós egyenese X2 + X3-nek X1 + X2-re?
d) Mekkora a fenti regressziós egyenessel történő közelítés hibájának szórásnégyzete?
8. Határozzuk meg az X2 + X + 1 regressziós egyenesét X-re, ha X eloszlása
a) Exp(5)
b) N(0; 1)
c*) B(10; 0,3)
9. Legyen X és Y együttes sűrűségfüggvénye a fenti 3. feladatban szereplő fX,Y . Tudván, hogy D2(X) =
0,0775, mi az Y regressziós egyenese X-re, illetve X regressziós egyenese Y -ra? Mekkora a regressziós
egyenes átlagos négyzetes hibája (azaz a hiba szórásnégyzete)?
10. Tegyük fel, hogy Y regressziós egyenese X-re:
(x, y) ∈R2 | y = x −2
	, míg X regressziós egyenese
Y -ra:
n
(y, x) ∈R2 | x = 1
4y −11
2
o
. Mennyi E(X) és E(Y )?
11. Két dobókockával dobunk. Legyen X a dobott hatosok száma, Y a dobott párosak száma. Mi Y
regressziós egyenese X-re, illetve X regressziós egyenese Y -ra?
IMSc 9. Legyenek X1, X2, ...Xn együttesen független, U(0; 1) eloszlású valószínűségi változók, és jelölje Y a
maximumukat, Z a minimumukat. Határozzuk meg a corr(Y, Z) mennyiséget (n függvényében).
