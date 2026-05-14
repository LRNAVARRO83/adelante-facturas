import { Toaster as Sonner, type ToasterProps } from 'sonner';

/**
 * Wrapper de Sonner alineado con la paleta Adelante.
 *
 * Desviación del template oficial de shadcn/ui: el template oficial usa
 * `next-themes` para detectar light/dark. El starter Adelante es light-only
 * por decisión del contexto (sección 4.2), así que el tema queda hardcodeado.
 * Si alguna vez se introduce dark mode, este wrapper se sincroniza acá.
 */
const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            'group toast group-[.toaster]:bg-background group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:shadow-lg',
          description: 'group-[.toast]:text-muted-foreground',
          actionButton: 'group-[.toast]:bg-primary group-[.toast]:text-primary-foreground',
          cancelButton: 'group-[.toast]:bg-muted group-[.toast]:text-muted-foreground',
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
