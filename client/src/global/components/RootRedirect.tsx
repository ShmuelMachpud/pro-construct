import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { ROUTES } from "../routes/model/routes.model";

const RootRedirect = () => {
  const { user, isAdmin, isOperator } = useAuth();

  if (!user) return <Navigate to={`/${ROUTES.LOGIN}`} replace />;
  if (isAdmin || isOperator) return <Navigate to={`/${ROUTES.DASHBOARD}`} replace />;
  return <Navigate to={`/${ROUTES.PROJECTS}`} replace />;
};

export default RootRedirect;
