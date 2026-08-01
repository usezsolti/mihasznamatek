# Éles deploy — STAGING ELŐBB, production (main) KÉSŐBB

A szabály: **ne a `main` / production menjen először.**  
Először a **`staging`** ág → Vercel **Preview** URL. Ha minden OK, akkor merge `main`-re.

```
staging  →  Vercel Preview  (teszt, pl. xxx.vercel.app)
main     →  Production      (mihasznamatek.hu)  — csak ha staging zöld
```

## 0) Ágak

| Ág | Szerep |
|----|--------|
| `staging` | Új funkciók, preview deploy, javítás ide |
| `main` | Éles production — csak stabil merge után |

Ha elromlik valami a preview-n: javítasz a `staging`-en, újra deployolódik. A production nem sérül.

## 1) GitHub

1. Hozz létre egy üres GitHub repót (pl. `mihasznamatek`).
2. Pushold a **`staging`** ágat (ne a maint először élesre kösd).

```bash
git checkout staging
git remote add origin https://github.com/TE/REPO.git
git push -u origin staging
```

## 2) Vercel beállítás (fontos!)

1. [vercel.com](https://vercel.com) → Add Project → import GitHub repo.
2. **Root Directory:** `mihasznamatek-main` (ha a package.json ott van).
3. **Production Branch:** hagyd `main`-en (vagy állítsd `main`-re).
4. A **`staging`** ág automatikusan **Preview** deployt kap (nem a production domainre megy).
5. Env változók: Production **és** Preview-ra is tedd be (különben a staging preview-n nincs Gmail).

### Env (Preview + Production)

| Változó | Kötelező |
|---------|----------|
| `GMAIL_USER` | igen |
| `GMAIL_APP_PASSWORD` | igen |
| `NEXT_PUBLIC_SITE_URL` | Preview-n lehet a Vercel URL; élesen `https://mihasznamatek.hu` |

Helyi sablon: `.env.local.example`

## 3) Firebase (preview domain)

Authentication → Authorized domains:
- a Vercel preview host (pl. `mihasznamatek-xxx.vercel.app`)
- később: `mihasznamatek.hu`

## 4) Teszt a staging / Preview URL-en

- [ ] Főoldal
- [ ] Bejelentkezés
- [ ] Foglalás + admin e-mail
- [ ] Jóváhagyás + diák e-mail
- [ ] Fájlfeltöltés
- [ ] Dashboard mobil fülek

## 5) Production csak ezután

Ha a staging preview OK:

```bash
git checkout main
git merge staging
git push origin main
```

Utána Vercel production frissül a `main`-ről. Domain: `mihasznamatek.hu`.

## 6) Lokális build

```bash
npm run build
npm run start
```
