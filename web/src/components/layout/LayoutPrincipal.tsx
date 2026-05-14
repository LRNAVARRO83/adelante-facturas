import { Outlet } from 'react-router-dom';
import { HeaderAdelante } from './HeaderAdelante';

/**
 * Layout principal de la app: header oscuro + área de contenido light.
 *
 * Se usa como elemento `element` de la ruta padre. Las pantallas hijas
 * se renderizan dentro de `<Outlet />`.
 */
export function LayoutPrincipal() {
  return (
    <div className="min-h-screen bg-zinc-50 text-foreground">
      <HeaderAdelante />
      <main className="container mx-auto max-w-7xl px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
