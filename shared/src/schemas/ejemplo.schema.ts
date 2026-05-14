import { z } from 'zod';

export const EjemploSchema = z.object({
  id: z.number().int().positive(),
  nombre: z.string().min(1).max(200),
  monto: z.number().nonnegative(),
});

export const ListaEjemplosSchema = z.array(EjemploSchema);

export type EjemploInferido = z.infer<typeof EjemploSchema>;
