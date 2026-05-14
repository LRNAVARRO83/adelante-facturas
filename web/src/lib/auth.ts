import { type Configuration, PublicClientApplication } from '@azure/msal-browser';

/**
 * Modo dev del frontend — ⚠️ NUNCA en producción.
 *
 * Doble blindaje:
 *   1. `import.meta.env.DEV` solo es true en `vite dev`. Builds de producción
 *      (`vite build`) reemplazan esto por `false` en tiempo de compilación, así
 *      que el código de modo dev queda eliminado por tree-shaking.
 *   2. `VITE_AUTH_DEV_MODE === 'true'` requiere opt-in explícito.
 *
 * En modo dev:
 *   - No se instancia MSAL.
 *   - El cliente HTTP omite el header Authorization.
 *   - El backend (api/) detecta `AUTH_DEV_MODE=true` en local.settings.json y
 *     usa el mismo usuario dummy (ver `api/src/auth/middleware.ts`).
 */
export const modoDev = import.meta.env.DEV && import.meta.env.VITE_AUTH_DEV_MODE === 'true';

export const usuarioDev = {
  name: 'Dev User',
  username: 'dev@adelante.cr',
  iniciales: 'DU',
} as const;

export const configuracionMsal: Configuration = {
  auth: {
    clientId: import.meta.env.VITE_AZURE_CLIENT_ID,
    authority: `https://login.microsoftonline.com/${import.meta.env.VITE_AZURE_TENANT_ID}`,
    redirectUri: window.location.origin,
    postLogoutRedirectUri: window.location.origin,
  },
  cache: {
    cacheLocation: 'sessionStorage',
  },
};

/** Scope custom expuesto por la API Adelante (App Registration de la API). */
export const scopesApi = [import.meta.env.VITE_AZURE_API_SCOPE];

/** Scope mínimo de Microsoft Graph para obtener el perfil del usuario. */
export const scopesLogin = ['User.Read'];

/** Deriva las iniciales (máximo 2) a partir de un nombre completo. */
export function obtenerIniciales(nombre: string): string {
  return nombre
    .split(' ')
    .map((parte) => parte[0] ?? '')
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

/**
 * Instancia singleton de MSAL. `null` en modo dev (para evitar inicializar
 * MSAL sin App Registration configurada).
 */
export const msalInstance = modoDev ? null : new PublicClientApplication(configuracionMsal);
