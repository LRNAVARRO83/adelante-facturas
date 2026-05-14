import { DefaultAzureCredential } from '@azure/identity';
import sql from 'mssql';

/**
 * Pool singleton de Azure SQL.
 *
 * Autenticación: SIEMPRE Managed Identity vía DefaultAzureCredential.
 *   - Local: usa `az login` (Azure CLI credential).
 *   - Producción: usa la Managed Identity del Function App.
 *
 * NUNCA se usa usuario/password — el contexto Adelante lo prohíbe explícitamente.
 *
 * El pool se crea lazy en la primera llamada a `obtenerPool()` y se reutiliza.
 * En caso de error de conexión el pool se descarta para que el siguiente intento
 * reconecte; mssql también tiene retry interno.
 *
 * Nota para el starter: este archivo queda configurado y listo para usar pero
 * el endpoint de ejemplo NO lo invoca. Cada app real activa el pool al agregar
 * sus propias functions con queries reales.
 */

const SCOPE_AZURE_SQL = 'https://database.windows.net/.default';

let poolPromesa: Promise<sql.ConnectionPool> | null = null;
let credencial: DefaultAzureCredential | null = null;

function obtenerCredencial(): DefaultAzureCredential {
  if (!credencial) {
    credencial = new DefaultAzureCredential();
  }
  return credencial;
}

async function construirPool(): Promise<sql.ConnectionPool> {
  const server = process.env.SQL_SERVER;
  const database = process.env.SQL_DATABASE;

  if (!server) throw new Error('SQL_SERVER no configurado');
  if (!database) throw new Error('SQL_DATABASE no configurado');

  const tokenRespuesta = await obtenerCredencial().getToken(SCOPE_AZURE_SQL);
  if (!tokenRespuesta) throw new Error('No se pudo obtener token de Azure AD para SQL');

  const config: sql.config = {
    server,
    database,
    options: {
      encrypt: true,
      trustServerCertificate: false,
    },
    authentication: {
      type: 'azure-active-directory-access-token',
      options: {
        token: tokenRespuesta.token,
      },
    },
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30_000,
    },
  };

  const pool = new sql.ConnectionPool(config);
  await pool.connect();
  return pool;
}

export async function obtenerPool(): Promise<sql.ConnectionPool> {
  if (!poolPromesa) {
    poolPromesa = construirPool().catch((e) => {
      poolPromesa = null;
      throw e;
    });
  }
  return poolPromesa;
}

export async function cerrarPool(): Promise<void> {
  if (!poolPromesa) return;
  try {
    const pool = await poolPromesa;
    await pool.close();
  } finally {
    poolPromesa = null;
  }
}

export { sql };
