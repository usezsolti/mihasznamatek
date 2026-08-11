/**
 * Infrastructure barrel — Node backend belépési pontok.
 * Presentation (React) NE importáljon ide kliensből közvetlenül Firestore Admin-t.
 */
export { BACKEND_NAME, BACKEND_RUNTIME, BACKEND_FRAMEWORK, FIREBASE_PROJECT_ID } from './config';
export { sendOk, sendErr, withBackendAuth } from './http';
export { createSocialStore, runSocialAction } from './socialStore';
export { isLocalSocialStore } from './localSocialDb';
