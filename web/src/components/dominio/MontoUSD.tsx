import { cn } from '@/lib/utils';
import { formatearUSD } from '@adelante/shared';

interface Props {
  monto: number;
  className?: string;
}

export function MontoUSD({ monto, className }: Props) {
  return <span className={cn('font-mono tabular-nums', className)}>{formatearUSD(monto)}</span>;
}
