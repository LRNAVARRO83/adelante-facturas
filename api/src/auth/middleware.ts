import type { HttpRequest } from '@azure/functions';
import { type JWTPayload, createRemoteJWKSet, jwtVerify } from 'jose';

/**
 * Claims que extraemos del JWT de Entra ID (Azure AD).
 * Los IDs en Entra ID son GUIDs (`oid` es el object id del usuario).
 */
export interface UsuarioAutenticado {
  oid: string;
  email: string;
  nombre: string;
  roles: string[];
}

export class ErrorAutenticacion extends Error {
  readonly status: number;
  constructor(mensaje: string, status = 401) {
    super(mensaje);
    this.name = 'ErrorAutenticacion';
    this.status = status;
  }
}

// =============================================================================
// MODO DEV — ⚠️ NUNCA ACTIVAR EN PRODUCCIÓN
// =============================================================================
// Si NODE_ENV !== 'production' Y AUTH_DEV_MODE === 'true', el middleware
// SKIPEA la validación del JWT y devuelve un usuario hardcodeado.
//
// Esto existe SOLO para desarrollo local sin tener que configurar un App
// Registration de Entra ID. El check de NODE_ENV es defensa en profundidad:
// aunque alguien deje AUTH_DEV_MODE=true en producción por error, el
// NODE_ENV=production del Function App lo cortará.
//
// Application Settings de producción NO debe contener AUTH_DEV_MODE.
// El deploy de GitHub Actions también valida que NODE_ENV=production.
// =============================================================================

const USUARIO_DEV: UsuarioAutenticado = {
  oid: 'dev-user',
  email: 'dev@adelante.cr',
  nombre: 'Dev User',
  roles: ['Dev'],
};

function modoDevActivo(): boolean {
  const node = process.env.NODE_ENV;
  const dev = process.env.AUTH_DEV_MODE;
  return node !== 'production' && dev === 'true';
}

// =============================================================================
// Validación JWT real (producción)
// =============================================================================

interface ClaimsEntraId extends JWTPayload {
  oid?: string;
  preferred_username?: string;
  upn?: string;
  email?: string;
  name?: string;
  roles?: string[];
}

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

function obtenerJWKS(tenantId: string) {
  if (jwks) return jwks;
  const url = new URL(`https://login.microsoftonline.com/${tenantId}/discovery/v2.0/keys`);
  jwks = createRemoteJWKSet(url);
  return jwks;
}

async function validarJWT(token: string): Promise<UsuarioAutenticado> {
  const tenantId = process.env.AZURE_TENANT_ID;
  const audience = process.env.AZURE_API_AUDIENCE;

  if (!tenantId) {
    throw new ErrorAutenticacion('AZURE_TENANT_ID no configurado', 500);
  }
  if (!audience) {
    throw new ErrorAutenticacion('AZURE_API_AUDIENCE no configurado', 500);
  }

  const issuer = `https://login.microsoftonline.com/${tenantId}/v2.0`;

  try {
    const { payload } = await jwtVerify(token, obtenerJWKS(tenantId), {
      issuer,
      audience,
    });

    const claims = payload as ClaimsEntraId;

    if (!claims.oid) {
      throw new ErrorAutenticacion('Token sin claim oid');
    }

    return {
      oid: claims.oid,
      email: claims.email ?? claims.preferred_username ?? claims.upn ?? '',
      nombre: claims.name ?? '',
      roles: claims.roles ?? [],
    };
  } catch (e) {
    if (e instanceof ErrorAutenticacion) throw e;
    const mensaje = e instanceof Error ? e.message : 'Token inválido';
    throw new ErrorAutenticacion(`Token inválido: ${mensaje}`);
  }
}

// =============================================================================
// API pública del módulo
// =============================================================================

/**
 * Valida la autenticación del request y devuelve el usuario.
 *
 * En modo dev (ver bloque superior) devuelve un usuario hardcodeado sin
 * tocar el token. En modo normal extrae el Bearer token del header
 * `Authorization` y valida firma/issuer/audience contra Entra ID.
 *
 * @throws {ErrorAutenticacion} si el token falta, es inválido o expira.
 */
export async function autenticar(request: HttpRequest): Promise<UsuarioAutenticado> {
  if (modoDevActivo()) {
    return USUARIO_DEV;
  }

  const auth = request.headers.get('authorization') ?? request.headers.get('Authorization');
  if (!auth) {
    throw new ErrorAutenticacion('Falta header Authorization');
  }

  const match = /^Bearer\s+(.+)$/i.exec(auth);
  if (!match || !match[1]) {
    throw new ErrorAutenticacion('Header Authorization debe ser Bearer <token>');
  }

  return validarJWT(match[1]);
}

/**
 * Helper para Functions: envuelve un handler con autenticación.
 * Si la auth falla devuelve una respuesta 401/500 ya formateada.
 */
export function requiereAuth<T>(
  handler: (usuario: UsuarioAutenticado, request: HttpRequest) => Promise<T>,
) {
  return async (request: HttpRequest): Promise<T | { status: number; jsonBody: unknown }> => {
    try {
      const usuario = await autenticar(request);
      return handler(usuario, request);
    } catch (e) {
      if (e instanceof ErrorAutenticacion) {
        return {
          status: e.status,
          jsonBody: { data: null, error: { codigo: 'AUTH_FALLO', mensaje: e.message } },
        };
      }
      throw e;
    }
  };
}
