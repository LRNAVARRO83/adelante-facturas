import { MontoCRC } from '@/components/dominio/MontoCRC';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useEjemplo } from '@/hooks/useEjemplo';
import { FileSpreadsheet, Loader2 } from 'lucide-react';
import { toast } from 'sonner';

export function EjemploPantalla() {
  const { data, isLoading, error } = useEjemplo();

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-muted-foreground">
        <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
        Cargando…
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive">
        <CardContent className="pt-6">
          <p className="text-destructive">Error al cargar: {error.message}</p>
        </CardContent>
      </Card>
    );
  }

  const ejemplos = data?.data ?? [];
  const totalMonto = ejemplos.reduce((acc, e) => acc + e.monto, 0);

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight">Pantalla de ejemplo</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Demo del patrón canónico: endpoint + TanStack Query + tabla + KPI.
          </p>
        </div>
        <Button
          onClick={() =>
            toast.success('¡Hola desde Adelante!', {
              description: 'Sonner funcionando correctamente.',
            })
          }
        >
          Mostrar toast demo
        </Button>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        <Card className="border-l-4 border-l-adelante-primary">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
              <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />
              Total de items
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-semibold tabular-nums">{ejemplos.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xs uppercase tracking-wider text-muted-foreground">
              Monto total
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MontoCRC monto={totalMonto} className="text-3xl font-semibold" />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Items</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>ID</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead className="text-right">Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {ejemplos.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {item.id}
                  </TableCell>
                  <TableCell>{item.nombre}</TableCell>
                  <TableCell className="text-right">
                    <MontoCRC monto={item.monto} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
