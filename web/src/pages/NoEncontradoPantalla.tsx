import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { MapPinOff } from 'lucide-react';
import { Link } from 'react-router-dom';

export function NoEncontradoPantalla() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Card className="w-full max-w-md">
        <CardContent className="flex flex-col items-center gap-4 py-12 text-center">
          <MapPinOff className="h-10 w-10 text-muted-foreground" aria-hidden="true" />
          <div className="space-y-1">
            <h1 className="text-xl font-semibold">Página no encontrada</h1>
            <p className="text-sm text-muted-foreground">
              La ruta solicitada no existe en esta aplicación.
            </p>
          </div>
          <Button asChild>
            <Link to="/">Volver al inicio</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
