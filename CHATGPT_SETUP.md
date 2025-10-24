# ChatGPT API Beállítási Útmutató

## 1. OpenAI API Kulcs Létrehozása

1. Menj a [OpenAI Platform](https://platform.openai.com/api-keys) oldalra
2. Jelentkezz be vagy regisztrálj egy fiókot
3. Kattints a "Create new secret key" gombra
4. Add meg a kulcs nevét (pl. "Mihaszna Matek Game")
5. Másold ki a generált API kulcsot

## 2. Environment Változók Beállítása

1. Másold az `env.example` fájlt `.env.local` néven:
   ```bash
   cp env.example .env.local
   ```

2. Szerkeszd a `.env.local` fájlt és add hozzá az OpenAI API kulcsot:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

## 3. API Kulcs Biztonsági Megjegyzések

- **SOHA** ne commitold a `.env.local` fájlt a Git repository-ba
- Az API kulcsot csak a szerver oldalon használjuk (nem a kliens oldalon)
- A kulcsot biztonságos helyen tárold

## 4. Tesztelés

1. Indítsd el a fejlesztői szervert:
   ```bash
   npm run dev
   ```

2. Menj a játék oldalra (`/game`)
3. Válaszd az "Egyetem" szintet
4. Kattints a "JÁTÉK INDÍTÁSA" gombra
5. A feladatok automatikusan generálódnak a ChatGPT API segítségével

## 5. Támogatott Egyetemi Témák

- **Deriválás** - Függvények deriváltjai
- **Integrálás** - Határozott és határozatlan integrálok
- **Differenciál egyenletek** - Első és másodrendű DE-k
- **Határértékszámítás** - L'Hôpital szabály, határértékek
- **Függvényvizsgálat** - Szélsőértékek, inflexiós pontok
- **Sorozatok és sorok** - Konvergencia, divergencia
- **Többváltozós függvények** - Parciális deriváltak
- **Lineáris algebra** - Mátrixok, determinánsok
- **Valószínűségszámítás** - Kombinatorika, valószínűség
- **Komplex számok** - Algebrai és trigonometrikus alak

## 6. Hibaelhárítás

### API Kulcs Hiba
```
Error: OpenAI API key not configured
```
**Megoldás**: Ellenőrizd, hogy a `.env.local` fájlban megvan-e az `OPENAI_API_KEY`

### API Hívás Hiba
```
Error: OpenAI API error: 401
```
**Megoldás**: Ellenőrizd, hogy az API kulcs érvényes és aktív

### Feladat Generálás Hiba
Ha a ChatGPT API nem elérhető, a rendszer automatikusan fallback feladatokat használ (négyzetgyök, köb stb.)

## 7. Költségek

- A ChatGPT API használata fizetős
- Becsült költség: ~$0.001-0.002 per feladat
- 100 feladat ≈ $0.10-0.20
- A költségeket a [OpenAI Pricing](https://openai.com/pricing) oldalon ellenőrizheted

## 8. Fejlesztési Tippek

- A feladatok mindig magyar nyelven generálódnak
- A válaszok numerikus értékek
- A rendszer automatikusan fallback feladatokat használ, ha az API nem elérhető
- A generált feladatok cache-elődnek a játék során


