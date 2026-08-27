import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '../auth/useAuth';

interface ProtectedRouteProps {
  allowedRoles?: string[];
}

export function ProtectedRoute({ allowedRoles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center text-sm text-gray-500">Chargement…</div>;
  }

  if (!user) {
    // Garde l'URL demandée pour rediriger après connexion
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.role.nomRole)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
