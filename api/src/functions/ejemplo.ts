import { type Ejemplo, ListaEjemplosSchema } from '@adelante/shared';
import {
  type HttpRequest,
  type HttpResponseInit,
  type InvocationContext,
  app,
} from '@azure/functions';
import { ErrorAutenticacion, autenticar } from '../auth/middleware.js';
import { respuestas } from '../lib/respuesta.js';

/**
 * Endpoint de ejemplo end-to-end del starter.
 *
 * Devuelve un array hardcodeado de 3 items. NO consulta la base de datos —
 * el pool de mssql queda configurado en `db/pool.ts` pero este ejemplo no
 * lo usa. Cada app real agrega sus propias functions con queries reales.
 */

const DATOS_EJEMPLO: Ejemplo[] = [
  { id: 1, nombre: 'Adelante Desarrollos', monto: 1_500_000 },
  { id: 2, nombre: 'Quinta Flor', monto: 875_500 },
  { id: 3, nombre: 'Proyecto Demostración', monto: 320_000.5 },
];

async function ejemploHandler(
  request: HttpRequest,
  context: InvocationContext,
): Promise<HttpResponseInit> {
  try {
    const usuario = await autenticar(request);
    context.log(`GET /api/ejemplo solicitado por ${usuario.email} (${usuario.oid})`);

    const validados = ListaEjemplosSchema.parse(DATOS_EJEMPLO);
    return respuestas.ok(validados);
  } catch (e) {
    if (e instanceof ErrorAutenticacion) {
      return respuestas.noAutorizado(e.message);
    }
    context.error('Error en /api/ejemplo:', e);
    const mensaje = e instanceof Error ? e.message : 'Error desconocido';
    return respuestas.errorInterno(mensaje);
  }
}

app.http('ejemplo', {
  methods: ['GET'],
  route: 'ejemplo',
  authLevel: 'anonymous',
  handler: ejemploHandler,
});
