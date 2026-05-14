import { cliente } from '@/lib/cliente';
import { useQuery } from '@tanstack/react-query';

export function useEjemplo() {
  return useQuery({
    queryKey: ['ejemplo'],
    queryFn: () => cliente.ejemplo.listar(),
  });
}
