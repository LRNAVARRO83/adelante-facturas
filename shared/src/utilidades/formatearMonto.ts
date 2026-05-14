/**
 * Formateadores de moneda para Grupo Adelante.
 *
 * Formato: ₡2,695,500.50  y  $1,234.56
 * (separador de miles con coma, decimal con punto).
 *
 * Decisión: usamos locale 'en-US' en vez de 'es-CR' porque el formato común
 * en sistemas de negocio en Costa Rica (Business Central, Hacienda, facturas
 * electrónicas, bancos, estados de cuenta) usa coma como separador de miles
 * y punto como decimal, no espacio + coma como dicta el locale es-CR oficial.
 *
 * Toda formateación de montos CRC/USD en apps Adelante debe pasar por estas
 * funciones para garantizar consistencia visual entre módulos y reportes.
 */

const opcionesFormato: Intl.NumberFormatOptions = {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
};

export function formatearCRC(monto: number): string {
  if (!Number.isFinite(monto)) return '₡—';
  return `₡${monto.toLocaleString('en-US', opcionesFormato)}`;
}

export function formatearUSD(monto: number): string {
  if (!Number.isFinite(monto)) return '$—';
  return `$${monto.toLocaleString('en-US', opcionesFormato)}`;
}

export function formatearMonto(monto: number, moneda: 'CRC' | 'USD' = 'CRC'): string {
  return moneda === 'CRC' ? formatearCRC(monto) : formatearUSD(monto);
}
