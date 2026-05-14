import { LayoutPrincipal } from '@/components/layout';
import { EjemploPantalla } from '@/pages/EjemploPantalla';
import { NoEncontradoPantalla } from '@/pages/NoEncontradoPantalla';
import { Navigate, createBrowserRouter } from 'react-router-dom';

export const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <LayoutPrincipal />,
      children: [
        { index: true, element: <Navigate to="/ejemplo" replace /> },
        { path: 'ejemplo', element: <EjemploPantalla /> },
        { path: '*', element: <NoEncontradoPantalla /> },
      ],
    },
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true,
      v7_skipActionErrorRevalidation: true,
    },
  },
);
