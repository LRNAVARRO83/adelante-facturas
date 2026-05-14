import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

export type Estado = 'procesado' | 'pendiente' | 'error' | 'revisar';

type ConfigEstado = {
  texto: string;
  variant: 'default' | 'secondary' | 'destructive' | 'outline';
  className?: string;
};

const config: Record<Estado, ConfigEstado> = {
  procesado: {
    texto: 'Procesado',
    variant: 'outline',
    className:
      'border-transparent bg-adelante-primary/20 text-adelante-primary-dark hover:bg-adelante-primary/30',
  },
  pendiente: {
    texto: 'Pendiente',
    variant: 'secondary',
  },
  error: {
    texto: 'Error',
    variant: 'destructive',
  },
  revisar: {
    texto: 'Revisar',
    variant: 'outline',
    className: 'border-transparent bg-yellow-100 text-yellow-900 hover:bg-yellow-100/80',
  },
};

interface Props {
  estado: Estado;
  className?: string;
}

export function EstadoBadge({ estado, className }: Props) {
  const c = config[estado];
  return (
    <Badge variant={c.variant} className={cn(c.className, className)}>
      {c.texto}
    </Badge>
  );
}
