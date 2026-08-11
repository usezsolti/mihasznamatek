/**
 * Firebase Web API kulcs — publikus (client SDK-ban is benne van).
 * Domain-korlátozott a Firebase Console-ban; NEM secret.
 * Env felülírhatja: FIREBASE_WEB_API_KEY / NEXT_PUBLIC_FIREBASE_API_KEY
 */
export const FIREBASE_PUBLIC_WEB_API_KEY = 'AIzaSyD1gvtJjjod5J3oJUI-iBPnR6yzU-AldtI';

export function resolveFirebaseWebApiKey(): string {
    return (
        process.env.FIREBASE_WEB_API_KEY ||
        process.env.NEXT_PUBLIC_FIREBASE_API_KEY ||
        FIREBASE_PUBLIC_WEB_API_KEY
    );
}
