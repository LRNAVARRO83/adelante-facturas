export type FormatoFecha = 'corto' | 'largo' | 'iso';

const formateadorCorto = new Intl.DateTimeFormat('es-CR', {
  day: '2-digit',
  month: '2-digit',
  year: 'numeric',
});

const formateadorLargo = new Intl.DateTimeFormat('es-CR', {
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

function aDate(fecha: Date | string): Date | null {
  if (fecha instanceof Date) return Number.isNaN(fecha.getTime()) ? null : fecha;
  const d = new Date(fecha);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function formatearFechaCR(fecha: Date | string, formato: FormatoFecha = 'corto'): string {
  const d = aDate(fecha);
  if (!d) return '—';

  switch (formato) {
    case 'corto':
      return formateadorCorto.format(d);
    case 'largo':
      return formateadorLargo.format(d);
    case 'iso': {
      const yyyy = d.getFullYear();
      const mm = String(d.getMonth() + 1).padStart(2, '0');
      const dd = String(d.getDate()).padStart(2, '0');
      return `${yyyy}-${mm}-${dd}`;
    }
  }
}
