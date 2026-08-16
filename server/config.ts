/** Next.js Node.js backend — közös konfiguráció */

export const BACKEND_NAME = 'mihaszna-backend';
export const BACKEND_RUNTIME = 'nodejs';
export const BACKEND_FRAMEWORK = 'nextjs';

export const FIREBASE_PROJECT_ID =
    process.env.FIREBASE_PROJECT_ID ||
    process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID ||
    'mihasznamatek-c9701';

export const FIRESTORE_DOCS_BASE = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents`;
export const FIRESTORE_COMMIT_URL = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents:commit`;
