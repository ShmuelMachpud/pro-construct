import { createBrowserRouter, Outlet } from "react-router-dom";
import Layout from "../components/Layout";
import ProtectedRoute from "../components/ProtectedRoute";
import RootRedirect from "../components/RootRedirect";
import ProjectsPage from "../../projects/pages/ProjectsPage";
import ProjectPage from "../../projects/pages/ProjectPage";
import LoginPage from "../../auth/pages/LoginPage";
import RegisterPage from "../../auth/pages/RegisterPage";
import UsersPage from "../../users/pages/UsersPage";
import MaterialsPage from "../../materials/pages/MaterialsPage";
import MyMaterialsPage from "../../materials/pages/MyMaterialsPage";
import QuotesPage from "../../quotes/pages/QuotesPage";
import QuotePage from "../../quotes/pages/QuotePage";
import QuoteDetailPage from "../../quotes/pages/QuoteDetailPage";
import DashboardPage from "../../dashboard/pages/DashboardPage";
import ContractorPage from "../../dashboard/pages/ContractorPage";
import CustomersPage from "../../customers/pages/CustomersPage";
import CustomerPage from "../../customers/pages/CustomerPage";
import { ROUTES } from "./model/routes.model";

export const router = createBrowserRouter([
  {
    path: `/${ROUTES.LOGIN}`,
    element: <LoginPage />,
  },
  {
    path: `/${ROUTES.REGISTER}`,
    element: <RegisterPage />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <RootRedirect /> },
      {
        element: (
          <ProtectedRoute allowedRoles={["admin", "operator"]}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: `${ROUTES.DASHBOARD}`, element: <DashboardPage /> },
          { path: `${ROUTES.CONSTRUCTORS}/:id`, element: <ContractorPage /> },
          { path: `${ROUTES.USERS}`, element: <UsersPage /> },
          { path: `${ROUTES.MATERIALS}`, element: <MaterialsPage /> },
        ],
      },
      {
        element: (
          <ProtectedRoute allowedRoles={["contractor"]}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: `${ROUTES.MY_MATERIALS}`, element: <MyMaterialsPage /> },
          { path: `${ROUTES.QUOTES}`, element: <QuotesPage /> },
          { path: `${ROUTES.QUOTES}/:projectId`, element: <QuotePage /> },
          { path: `${ROUTES.QUOTES}/:projectId/:quoteId`, element: <QuoteDetailPage /> },
          { path: `${ROUTES.PROJECTS}`, element: <ProjectsPage /> },
          { path: `${ROUTES.PROJECTS}/:id`, element: <ProjectPage /> },
          { path: `${ROUTES.CUSTOMERS}`, element: <CustomersPage /> },
          { path: `${ROUTES.CUSTOMERS}/:id`, element: <CustomerPage /> },
        ],
      },
    ],
  },
]);
