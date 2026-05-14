import { cn } from '@/lib/utils';
import { formatearCRC } from '@adelante/shared';

interface Props {
  monto: number;
  className?: string;
}

export function MontoCRC({ monto, className }: Props) {
  return <span className={cn('font-mono tabular-nums', className)}>{formatearCRC(monto)}</span>;
}
