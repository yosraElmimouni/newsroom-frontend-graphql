import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense, type ReactNode } from 'react';
import { MainLayout } from '../shared/layout/MainLayout';
import { ProtectedRoute } from '../core/guards/ProtectedRoute';
import { LoginPage } from '../features/auth/pages/LoginPage';

const ArticlesPage = lazy(() => import('../features/articles/pages/ArticlesPage'));
const AgendaPage = lazy(() => import('../features/agenda/pages/AgendaPage'));
const AdminPage = lazy(() => import('../features/utilisateurs/pages/AdminPage'));
const Veillepage = lazy(() => import('../features/veille-info/pages/veillepage'));
function withSuspense(element: ReactNode) {
  return <Suspense fallback={<div className="p-6 text-sm text-gray-500">Chargement…</div>}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  { path: '/login', element: <LoginPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/', element: <Navigate to="/articles" replace /> },
          { path: '/articles', element: withSuspense(<ArticlesPage />) },
          { path: '/agenda', element: withSuspense(<AgendaPage />) },
          { path: '/veille-info', element: withSuspense(<Veillepage />) },
          {
            // Réservé aux administrateurs — adapte le nom du rôle à ton backend
            element: <ProtectedRoute allowedRoles={['Administrateur']} />,
            children: [{ path: '/admin', element: withSuspense(<AdminPage />) }],
          },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);
