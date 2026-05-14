import type { ErrorApi, RespuestaApi } from '@adelante/shared';
import type { HttpResponseInit } from '@azure/functions';

/**
 * Helpers de respuesta HTTP. Garantizan que TODA respuesta del API
 * tenga el shape `RespuestaApi<T>` que el cliente web espera:
 *   { data: T, error: null }     // éxito
 *   { data: null, error: { ... } } // fallo
 */

export function ok<T>(data: T, status = 200): HttpResponseInit {
  const body: RespuestaApi<T> = { data, error: null };
  return {
    status,
    jsonBody: body,
  };
}

export function error(
  status: number,
  codigo: string,
  mensaje: string,
  detalles?: unknown,
): HttpResponseInit {
  const errorObj: ErrorApi = { codigo, mensaje };
  if (detalles !== undefined) {
    errorObj.detalles = detalles;
  }
  const body: RespuestaApi<never> = {
    data: null,
    error: errorObj,
  };
  return {
    status,
    jsonBody: body,
  };
}

export const respuestas = {
  ok,
  error,
  noEncontrado: (recurso: string) => error(404, 'NO_ENCONTRADO', `${recurso} no encontrado`),
  malRequest: (mensaje: string, detalles?: unknown) => error(400, 'MAL_REQUEST', mensaje, detalles),
  noAutorizado: (mensaje = 'No autorizado') => error(401, 'NO_AUTORIZADO', mensaje),
  errorInterno: (mensaje = 'Error interno') => error(500, 'ERROR_INTERNO', mensaje),
};
