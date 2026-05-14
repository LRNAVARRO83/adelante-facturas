export interface ErrorApi {
  codigo: string;
  mensaje: string;
  detalles?: unknown;
}

export type RespuestaApi<T> = { data: T; error: null } | { data: null; error: ErrorApi };

export function esRespuestaExitosa<T>(
  respuesta: RespuestaApi<T>,
): respuesta is { data: T; error: null } {
  return respuesta.error === null;
}
