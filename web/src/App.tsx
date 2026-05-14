import { LogoAdelante } from '@/components/layout';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { modoDev, msalInstance, scopesLogin } from '@/lib/auth';
import { router } from '@/router/routes';
import {
  AuthenticatedTemplate,
  MsalProvider,
  UnauthenticatedTemplate,
  useMsal,
} from '@azure/msal-react';
import { RouterProvider } from 'react-router-dom';

function BotonLogin() {
  const { instance } = useMsal();
  return (
    <Button size="lg" onClick={() => instance.loginRedirect({ scopes: scopesLogin })}>
      Iniciar sesión con Microsoft
    </Button>
  );
}

function PantallaLogin() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50">
      <div className="flex flex-col items-center gap-6 text-center">
        <LogoAdelante altura={40} />
        <div className="space-y-1">
          <h1 className="text-2xl font-bold tracking-wider">ADELANTE.</h1>
          <p className="text-sm text-muted-foreground">
            Iniciá sesión con tu cuenta corporativa para continuar.
          </p>
        </div>
        <BotonLogin />
      </div>
    </div>
  );
}

export function App() {
  // Modo dev: bypass MSAL completamente.
  if (modoDev) {
    return (
      <>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
        <Toaster />
      </>
    );
  }

  if (!msalInstance) {
    throw new Error('msalInstance es null fuera de modo dev — revisar lib/auth.ts');
  }

  return (
    <MsalProvider instance={msalInstance}>
      <AuthenticatedTemplate>
        <RouterProvider router={router} future={{ v7_startTransition: true }} />
        <Toaster />
      </AuthenticatedTemplate>
      <UnauthenticatedTemplate>
        <PantallaLogin />
      </UnauthenticatedTemplate>
    </MsalProvider>
  );
}
