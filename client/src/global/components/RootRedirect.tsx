import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RootRedirect = () => {
  const { user, isAdmin, isOperator } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (isAdmin || isOperator) return <Navigate to="/dashboard" replace />;
  return <Navigate to="/projects" replace />;
};

export default RootRedirect;
