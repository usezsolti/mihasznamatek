/**
 * Alkalmazás-architektúra — réteghatárok (clean architecture light).
 *
 *   pages/            → Presentation: vékony route-ok (összerakás, routing)
 *   components/       → Presentation UI (újrafelhasználható nézetek)
 *   hooks/            → Application: React állapot + use-case orkesztráció
 *   utils/            → Domain / shared helpers (tiszta függvények, típusok)
 *   utils/game/       → Játék domain (bankok, generátorok, típusok)
 *   server/           → Infrastructure: Node backend (Firestore, local DB, HTTP)
 *   pages/api/        → Infrastructure adapters (HTTP → server use-case)
 *
 * Szabályok:
 * - pages/api és server/ SOHA ne importáljon React komponenst.
 * - components/ ne hívjon közvetlenül Firestore-t, ha van socialApi / apiClient.
 * - /api hívások csak utils/apiClient-en keresztül (ne ad-hoc fetch).
 * - Tiszta domain (utils/*, utils/apiEnvelope) unit-tesztelhető IO nélkül.
 * - utils/game/* legyen React-mentes (tiszta domain).
 * - Új feature: domain → server/api → hook/component → page → tests/unit.
 */

export const ARCH_LAYERS = [
    'presentation',
    'application',
    'domain',
    'infrastructure',
] as const;

export type ArchLayer = (typeof ARCH_LAYERS)[number];

export const ARCH_PATHS: Record<ArchLayer, string[]> = {
    presentation: ['pages/', 'components/'],
    application: ['hooks/'],
    domain: ['utils/', 'utils/game/', 'utils/socialTypes.ts'],
    infrastructure: ['server/', 'pages/api/'],
};
