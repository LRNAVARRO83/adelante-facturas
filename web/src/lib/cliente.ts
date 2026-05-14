import type { Ejemplo, RespuestaApi } from '@adelante/shared';
import { modoDev, msalInstance, obtenerIniciales, scopesApi, usuarioDev } from './auth';

const API_URL = import.meta.env.VITE_API_URL;

/**
 * Obtiene un access token para llamar a la API Adelante.
 * - En modo dev: devuelve `null` (el backend skipea validación con AUTH_DEV_MODE=true).
 * - En modo real: pide token silencioso a MSAL para el scope custom de la API.
 */
async function obtenerToken(): Promise<string | null> {
  if (modoDev) return null;

  if (!msalInstance) {
    throw new Error('MSAL no está inicializado');
  }

  const cuentas = msalInstance.getAllAccounts();
  const cuenta = cuentas[0];
  if (!cuenta) {
    throw new Error('Sin sesión activa');
  }

  const respuesta = await msalInstance.acquireTokenSilent({
    scopes: scopesApi,
    account: cuenta,
  });

  return respuesta.accessToken;
}

/**
 * Wrapper genérico sobre `fetch` que añade auth, content-type y maneja errores
 * HTTP a alto nivel. Las funciones del cliente lo usan internamente.
 */
async function pedir<T>(ruta: string, opciones?: RequestInit): Promise<T> {
  const token = await obtenerToken();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...((opciones?.headers ?? {}) as Record<string, string>),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const respuesta = await fetch(`${API_URL}${ruta}`, { ...opciones, headers });

  if (!respuesta.ok) {
    throw new Error(`HTTP ${respuesta.status}: ${respuesta.statusText}`);
  }

  return (await respuesta.json()) as T;
}

/**
 * Cliente API tipado. Cada agrupación corresponde a un módulo del backend.
 * Para agregar un endpoint nuevo: extender este objeto y reutilizar `pedir<T>`.
 */
export const cliente = {
  ejemplo: {
    listar: () => pedir<RespuestaApi<Ejemplo[]>>('/api/ejemplo'),
  },
};

/** Información del usuario activo (modo dev o MSAL real). */
export interface UsuarioActivo {
  name: string;
  username: string;
  iniciales: string;
}

/**
 * Obtiene el usuario activo. En modo dev devuelve `usuarioDev`.
 * En modo MSAL devuelve la primera cuenta o `null` si no hay sesión.
 */
export function obtenerUsuarioActual(): UsuarioActivo | null {
  if (modoDev) return { ...usuarioDev };

  const cuenta = msalInstance?.getAllAccounts()[0];
  if (!cuenta) return null;

  const nombre = cuenta.name ?? cuenta.username;
  return {
    name: nombre,
    username: cuenta.username,
    iniciales: obtenerIniciales(nombre),
  };
}
