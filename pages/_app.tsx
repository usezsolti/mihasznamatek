// frontend/pages/_app.tsx
import "../public/style.css";
import "../public/dashboard.css";
import "../public/unreal-game.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import Script from "next/script";
import { useRouter } from "next/router";
import Navbar from "../components/Navbar";   // DEFAULT import!


export default function App({ Component, pageProps }: AppProps) {
    const router = useRouter();
    const isDashboard = router.pathname === '/dashboard';
    const isGame = router.pathname === '/game';
    const isUniBoostGame = router.pathname === '/uniboost-game';

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
                    <meta name="description" content="Mihaszna Matek - Professzionális magán matektanár. Matek tanár, magán oktatás, egyetemi matematika, középiskolai matek. Online és személyes oktatás Budapesten." />
                    <meta name="keywords" content="matektanár, magán matektanár, matek tanár, magán oktatás, magán matek, mihasznamatek, matematika tanár, egyetemi matek, középiskolai matek, matek oktatás, Budapest matektanár, online matek, személyes matek oktatás" />
                    <meta name="author" content="Mihaszna Matek" />
                    <meta name="robots" content="index, follow" />
                    <meta name="googlebot" content="index, follow" />
                    
                    {/* Open Graph / Facebook */}
                    <meta property="og:type" content="website" />
                    <meta property="og:url" content="https://mihasznamatek.hu/" />
                    <meta property="og:title" content="Mihaszna Matek - Magán Matektanár | Matek Tanár" />
                    <meta property="og:description" content="Professzionális magán matektanár. Matek tanár, magán oktatás, egyetemi matematika, középiskolai matek. Online és személyes oktatás Budapesten." />
                    <meta property="og:image" content="https://mihasznamatek.hu/profile.png" />
                    
                    {/* Twitter */}
                    <meta property="twitter:card" content="summary_large_image" />
                    <meta property="twitter:url" content="https://mihasznamatek.hu/" />
                    <meta property="twitter:title" content="Mihaszna Matek - Magán Matektanár | Matek Tanár" />
                    <meta property="twitter:description" content="Professzionális magán matektanár. Matek tanár, magán oktatás, egyetemi matematika, középiskolai matek. Online és személyes oktatás Budapesten." />
                    <meta property="twitter:image" content="https://mihasznamatek.hu/profile.png" />
                    
                    {/* Canonical URL */}
                    <link rel="canonical" href="https://mihasznamatek.hu/" />
                    
                    <link rel="icon" href="/favicon.ico" />
                    <link rel="stylesheet" href="/style.css" />
                </Head>

                {/* Google Ads (gtag.js) */}
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

                <Script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-app-compat.js" strategy="beforeInteractive" />
                <Script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-auth-compat.js" strategy="beforeInteractive" />
                <Script src="https://www.gstatic.com/firebasejs/9.22.1/firebase-firestore-compat.js" strategy="beforeInteractive" />
                <Script src="/firebase-init.js" strategy="beforeInteractive" />
                <Script src="/main.js" strategy="afterInteractive" />

                {!isDashboard && !isGame && !isUniBoostGame && <Navbar />}
                <Component {...pageProps} />
            </>
        </div>
    );
}
