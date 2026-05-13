import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const RootRedirect = () => {
  const { user, isAdmin } = useAuth();

  if (!user) return <Navigate to="/login" replace />;
  if (isAdmin) return <Navigate to="/users" replace />;
  return <Navigate to="/projects" replace />;
};

export default RootRedirect;
