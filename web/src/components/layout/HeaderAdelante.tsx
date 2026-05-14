import { obtenerUsuarioActual } from '@/lib/cliente';
import { cn } from '@/lib/utils';
import { NavLink } from 'react-router-dom';
import { LogoAdelante } from './LogoAdelante';

const linkBase = 'text-sm transition-colors';
const linkInactive = 'text-zinc-400 hover:text-white';
const linkActive = 'text-white';

interface Props {
  /** Nombre de la app que aparece a la derecha del logo. Default: "App Starter". */
  nombreApp?: string;
}

export function HeaderAdelante({ nombreApp = 'App Starter' }: Props) {
  const usuario = obtenerUsuarioActual();
  const iniciales = usuario?.iniciales ?? '?';
  const nombreCompleto = usuario?.name ?? 'Sin sesión';

  return (
    <header className="bg-[#0A0A0A] text-white">
      <div className="container mx-auto flex h-14 max-w-7xl items-center justify-between px-6">
        <div className="flex items-center gap-3">
          <LogoAdelante altura={20} />
          <span className="text-sm font-bold tracking-wider">ADELANTE.</span>
          <span className="text-zinc-700">|</span>
          <span className="text-sm text-zinc-300">{nombreApp}</span>
        </div>

        <nav className="flex items-center gap-6">
          <NavLink
            to="/"
            end
            className={({ isActive }) => cn(linkBase, isActive ? linkActive : linkInactive)}
          >
            Inicio
          </NavLink>
          <NavLink
            to="/ejemplo"
            className={({ isActive }) => cn(linkBase, isActive ? linkActive : linkInactive)}
          >
            Ejemplo
          </NavLink>
        </nav>

        <div
          className="flex h-7 w-7 items-center justify-center rounded-full bg-adelante-primary text-xs font-bold text-adelante-foreground"
          aria-label={`Usuario: ${nombreCompleto}`}
          title={nombreCompleto}
        >
          {iniciales}
        </div>
      </div>
    </header>
  );
}
