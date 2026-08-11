import { Head, Html, Main, NextScript } from 'next/document';

/** Document shell only — global CSS comes from _app imports (order-controlled). */
export default function Document() {
    return (
        <Html lang="hu" data-scroll-behavior="smooth">
            <Head />
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
