interface Props {
  className?: string;
  /** Altura en píxeles. El ancho se ajusta automáticamente por el viewBox. */
  altura?: number;
}

/**
 * Logo Adelante: aproximación geométrica de las 4 figuras del brand guide
 * (paralelogramos en zigzag alternando verde principal #ADD010 y verde sombra #7A9A0B).
 *
 * Esta versión es una aproximación. Cuando esté disponible el SVG oficial del
 * brand guide, se reemplaza el contenido manteniendo el mismo viewBox y props.
 */
export function LogoAdelante({ className, altura = 24 }: Props) {
  return (
    <svg
      role="img"
      aria-label="Logo Adelante"
      className={className}
      height={altura}
      viewBox="0 0 48 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M0 24 L8 0 L14 0 L6 24 Z" fill="#ADD010" />
      <path d="M12 24 L20 0 L26 0 L18 24 Z" fill="#7A9A0B" />
      <path d="M24 24 L32 0 L38 0 L30 24 Z" fill="#ADD010" />
      <path d="M36 24 L44 0 L48 0 L40 24 Z" fill="#7A9A0B" />
    </svg>
  );
}
