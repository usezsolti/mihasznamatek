# Google Drive Integration Setup

## Áttekintés

A booking rendszer mostantól támogatja a Google Drive-ba történő fájlfeltöltést. A felhasználók a drag & drop területre feltöltött fájlokat közvetlenül a Google Drive-ba menthetik.

## Funkciók

- 📁 **Google Drive feltöltés**: Fájlok automatikus feltöltése Google Drive-ba
- 📂 **Automatikus mappák**: Minden foglaláshoz külön mappa (pl. "Mihaszna Matek - Kovács János - 2024-01-15")
- 🔗 **Megosztható linkek**: Automatikus link generálás a feltöltött fájlokhoz
- 🔒 **Biztonságos hozzáférés**: OAuth 2.0 autentikáció
- ☁️ **Dupla backup**: Dropbox és Google Drive support

## Beállítás

### 1. Google Cloud Console Konfiguráció

1. Menj a [Google Cloud Console](https://console.cloud.google.com/) oldalra
2. Hozz létre új projektet vagy válassz egy meglévőt
3. Engedélyezd a **Google Drive API**-t:
   - APIs & Services → Library
   - Keress rá: "Google Drive API"
   - Kattints az "Enable" gombra

### 2. API Kulcsok Létrehozása

#### API Key:
1. APIs & Services → Credentials
2. Create Credentials → API Key
3. Másold ki a kulcsot

#### OAuth 2.0 Client ID:
1. APIs & Services → Credentials
2. Create Credentials → OAuth 2.0 Client ID
3. Application type: Web application
4. Authorized JavaScript origins:
   - `http://localhost:3000` (development)
   - `https://yourdomain.com` (production)
5. Másold ki a Client ID-t

### 3. Környezeti Változók Beállítása

Hozz létre egy `.env.local` fájlt a `frontend/` mappában:

```env
NEXT_PUBLIC_GOOGLE_API_KEY=your_google_api_key_here
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
```

### 4. Tesztelés

1. Indítsd el a development servert: `npm run dev`
2. Menj a booking oldalra
3. Tölts fel egy fájlt
4. Kattints a "📁 Google Drive feltöltés" gombra
5. Engedélyezd a Google Drive hozzáférést
6. A fájl automatikusan feltöltődik és megjelenik a link

## Használat

### Felhasználói Élmény

1. **Fájl feltöltés**: Drag & drop vagy fájlválasztó
2. **Cloud gombok**: Google Drive és Dropbox opciók
3. **Automatikus szervezés**: Dátum és név alapú mappák
4. **Linkek**: Közvetlen hozzáférés a feltöltött fájlokhoz

### Fejlesztői API

```typescript
import { uploadToGoogleDrive } from '../utils/googleDrive';

// Fájl feltöltése
const link = await uploadToGoogleDrive(file, 'Mappa Név');

// Inicializáció ellenőrzése
const isReady = await initializeGoogleDrive();
```

## Hibakeresés

### Gyakori Problémák

1. **"Google APIs not initialized"**
   - Ellenőrizd a script betöltést
   - Várj a `window.gapi` és `window.google` objektumokra

2. **"Invalid API Key"**
   - Ellenőrizd a `.env.local` fájlt
   - Győződj meg róla, hogy a Google Drive API engedélyezve van

3. **"Unauthorized"**
   - Ellenőrizd az OAuth 2.0 beállításokat
   - Add hozzá a domain-t az authorized origins listához

### Debug Üzenetek

A böngésző konzoljában megjelennek a debug üzenetek:
- `Google Drive API initialized successfully`
- `Uploading file to Google Drive...`
- `File uploaded successfully: [link]`

## Biztonsági Megjegyzések

- Az API kulcsok nyilvánosak (frontend), ezért korlátozd őket domain alapján
- A Google Drive hozzáférés csak a szükséges scope-okra korlátozódik
- A feltöltött fájlok automatikusan megoszthatóvá válnak (view only)

## Továbbfejlesztési Lehetőségek

- 📊 Fájl feltöltés progress bar
- 🗂️ Mappa struktúra testreszabása
- 🔄 Automatikus szinkronizáció
- 📱 Mobil app integráció
- 🎯 Batch upload optimalizáció

