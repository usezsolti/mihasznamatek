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
                        content="width=device-width, initial-scale=1"
                    />
                    <title>Mihaszna Matek</title>
                    <link rel="stylesheet" href="/style.css" />
                </Head>

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
