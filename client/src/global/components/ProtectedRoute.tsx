import type { JSX } from "react";
import { Navigate } from "react-router-dom";
import { useAuth, type UserRole } from "../hooks/useAuth";
import { ROUTES } from "../routes/model/routes.model";

interface ProtectedRouteProps {
  children: JSX.Element;
  allowedRoles?: UserRole[];
}

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const { user } = useAuth();

  if (!user) return <Navigate to={`/${ROUTES.LOGIN}`} replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;