// frontend/pages/_app.tsx
/**
 * Global CSS order matches the classic homepage look (style → dashboard → unreal).
 * Route-scoped splitting regressed shared class visuals (.section-title, etc.);
 * keep imports here (not next/head) until dashboard selectors are namespaced.
 */
import "../public/style.css";
import "../public/dashboard.css";
import "../public/unreal-game.css";
import "../public/mihasocial-ig.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import { useEffect } from "react";
import Navbar from "../components/Navbar";

function isFirestorePermissionNoise(reason: unknown): boolean {
    const code = String((reason as any)?.code || "");
    const msg = String((reason as any)?.message || reason || "");
    return (
        code.includes("permission-denied") ||
        /Missing or insufficient permissions/i.test(msg) ||
        /PERMISSION_DENIED/i.test(msg)
    );
}

export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const isGame = router.pathname === "/game";
    const isUniBoostGame = router.pathname === "/uniboost-game";

    // Next overlay ne legyen piros Firestore rules hibáktól (catch után is előjön néha)
    useEffect(() => {
        let warned = false;
        const onRejection = (event: PromiseRejectionEvent) => {
            if (!isFirestorePermissionNoise(event.reason)) return;
            event.preventDefault();
            if (warned) return;
            warned = true;
            console.warn(
                "Firestore permission denied — publikáld a firestore.rules-t (/rules-setup). További ismétlődések elnyomva."
            );
        };
        const onError = (event: ErrorEvent) => {
            if (!isFirestorePermissionNoise(event.error || event.message)) return;
            event.preventDefault();
            if (warned) return;
            warned = true;
            console.warn(
                "Firestore permission denied — publikáld a firestore.rules-t (/rules-setup). További ismétlődések elnyomva."
            );
        };
        window.addEventListener("unhandledrejection", onRejection);
        window.addEventListener("error", onError);
        return () => {
            window.removeEventListener("unhandledrejection", onRejection);
            window.removeEventListener("error", onError);
        };
    }, []);

    return (
        <div suppressHydrationWarning>
            <>
                <Head>
                    <meta charSet="UTF-8" />
                    <meta
                        name="viewport"
                        content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no"
                    />
                    <title>Mihaszna Matek - Magán Matektanár | Matek Tanár | Magán Oktatás</title>
                    <meta
                        name="description"
                        content="Mihaszna Matek - Professzionális magán matektanár. Matek tanár, magán oktatás, egyetemi matematika, középiskolai matek. Online és személyes oktatás Budapesten."
                    />
                    <meta
                        name="keywords"
                        content="matektanár, magán matektanár, matek tanár, magán oktatás, magán matek, mihasznamatek, matematika tanár, egyetemi matek, középiskolai matek, matek oktatás, Budapest matektanár, online matek, személyes matek oktatás"
                    />
                    <meta name="author" content="Mihaszna Matek" />
                    <meta name="robots" content="index, follow" />
                    <meta name="googlebot" content="index, follow" />

                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://mihasznamatek.hu/" />
                    <meta property="og:title" content="Mihaszna Matek - Magán Matektanár | Matek Tanár" />
                    <meta
                        property="og:description"
                        content="Professzionális magán matektanár. Matek tanár, magán oktatás, egyetemi matematika, középiskolai matek. Online és személyes oktatás Budapesten."
                    />
                    <meta property="og:image" content="https://mihasznamatek.hu/profile.png" />

                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:url" content="https://mihasznamatek.hu/" />
                    <meta property="twitter:title" content="Mihaszna Matek - Magán Matektanár | Matek Tanár" />
                    <meta
                        property="twitter:description"
                        content="Professzionális magán matektanár. Matek tanár, magán oktatás, egyetemi matematika, középiskolai matek. Online és személyes oktatás Budapesten."
                    />
                    <meta property="twitter:image" content="https://mihasznamatek.hu/profile.png" />

                    <link rel="canonical" href="https://mihasznamatek.hu/" />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                {isGame && <link rel="stylesheet" href="/game-page.css" />}

                <Script
                    src="https://www.googletagmanager.com/gtag/js?id=AW-17680696688"
                    strategy="afterInteractive"
                />
                <Script id="google-ads" strategy="afterInteractive">
                    {`
                        window.dataLayer = window.dataLayer || [];
                        function gtag(){dataLayer.push(arguments);}
                        gtag('js', new Date());
                        gtag('config', 'AW-17680696688');
                    `}
                </Script>

                <Script
                    src="https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js"
                    strategy="beforeInteractive"
                />
                <Script
                    src="https://www.gstatic.com/firebasejs/9.22.1/firebase-auth-compat.js"
                    strategy="beforeInteractive"
                />
                <Script
                    src="https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js"
                    strategy="beforeInteractive"
                />
                <Script
                    src="https://www.gstatic.com/firebasejs/9.22.1/firebase-storage-compat.js"
                    strategy="beforeInteractive"
                />
                <Script src="/firebase-init.js" strategy="beforeInteractive" />
                <Script src="/main.js" strategy="afterInteractive" />

                {!isGame && !isUniBoostGame && <Navbar />}
                <Component {...pageProps} />
            </>
        </div>
    );
}
