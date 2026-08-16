/** Shared server config — Postgres + Auth.js stack. */

export const BACKEND_NAME = 'mihasznamatek-api';
export const BACKEND_RUNTIME = 'nextjs';
export const BACKEND_FRAMEWORK = 'pages-api';

export const SITE_URL =
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.NEXTAUTH_URL ||
    'http://localhost:3000';
