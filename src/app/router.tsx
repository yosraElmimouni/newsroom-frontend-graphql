import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense, type ReactNode } from 'react';
import { MainLayout } from '../shared/layout/MainLayout';
import { ProtectedRoute } from '../core/guards/ProtectedRoute';
import { LoginPage } from '../features/auth/pages/LoginPage';
import MediaLibraryPage from '../features/capture/pages/MediaLibraryPage';
import AddMediaPage from '../features/capture/pages/AddMediaPage';
import AddArticlePage from '../features/articles/pages/AddArticlePage';
import DetailArticlePage from '../features/articles/pages/DetailArticlePage';
import UsersPage from '../features/utilisateurs/pages/UsersPage';
import AddUserPage from '../features/utilisateurs/pages/AddUserPage';

const HomePage = lazy(() => import('../features/home/pages/HomePage'));
const ArticlesPage = lazy(() => import('../features/articles/pages/ArticlesPage'));
const AgendaPage = lazy(() => import('../features/agenda/pages/AgendaPage'));
const AdminPage = lazy(() => import('../features/utilisateurs/pages/AdminPage'));
const Veillepage = lazy(() => import('../features/veille-info/pages/veillepage'));
const VeilleDetailPage = lazy(() => import('../features/veille-info/pages/VeilleDetailPage'));
const DetailUserPage = lazy(() => import('../features/utilisateurs/pages/detailUser'));
function withSuspense(element: ReactNode) {
  return <Suspense fallback={<div className="app-loading">Chargement…</div>}>{element}</Suspense>;
}

export const router = createBrowserRouter([
  { path: '/', element: withSuspense(<HomePage />) },
  { path: '/login', element: <LoginPage /> },

  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: '/articles', element: withSuspense(<ArticlesPage />) },
          { path: '/articles/nouveau', element: withSuspense(<AddArticlePage />) },
          { path: '/agenda', element: withSuspense(<AgendaPage />) },
          { path: '/veille-info', element: withSuspense(<Veillepage />) },
          { path: '/veille-info/:id', element: withSuspense(<VeilleDetailPage />) },
          { path: '/medias', element: withSuspense(<MediaLibraryPage />) },
          { path: '/medias/nouveau', element: withSuspense(<AddMediaPage />) },
          { path: '/medias/modifier/:id', element: withSuspense(<AddMediaPage />) },
          { path:'/article/:id',element: withSuspense(<DetailArticlePage />)},
          { path: '/articles/modifier/:id', element: withSuspense(<AddArticlePage />) },
          {path:'/utilisateurs', element:withSuspense(<UsersPage />)},
          {path:'/utilisateurs/nouveau', element:withSuspense(<AddUserPage />)},
          { path: '/utilisateurs/modifier/:id', element: withSuspense(<AddUserPage />) },
          { path:'/utilisateurs/:id',element: withSuspense(<DetailUserPage />)},
          {
            element: <ProtectedRoute allowedRoles={['ADMIN']} />,
            children: [{ path: '/admin', element: withSuspense(<AdminPage />) }],
          },
        ],
      },
    ],
  },

  { path: '*', element: <Navigate to="/" replace /> },
]);
