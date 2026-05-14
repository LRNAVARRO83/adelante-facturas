import { cn } from '@/lib/utils';
import { type FormatoFecha, formatearFechaCR } from '@adelante/shared';

interface Props {
  fecha: Date | string;
  formato?: FormatoFecha;
  className?: string;
}

export function FechaCR({ fecha, formato = 'corto', className }: Props) {
  return <span className={cn(className)}>{formatearFechaCR(fecha, formato)}</span>;
}
