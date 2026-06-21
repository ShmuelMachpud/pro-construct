import { createBrowserRouter, Outlet } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import RootRedirect from "./components/RootRedirect";
import ProjectsPage from "../projects/pages/ProjectsPage";
import ProjectPage from "../projects/pages/ProjectPage";
import ClientsPage from "../clients/pages/ClientsPage";
import ClientPage from "../clients/pages/ClientPage";
import LoginPage from "../auth/pages/LoginPage";
import RegisterPage from "../auth/pages/RegisterPage";
import UsersPage from "../users/pages/UsersPage";
import MaterialsPage from "../materials/pages/MaterialsPage";
import MyMaterialsPage from "../materials/pages/MyMaterialsPage";
import QuotesPage from "../quotes/pages/QuotesPage";
import QuotePage from "../quotes/pages/QuotePage";
import QuoteDetailPage from "../quotes/pages/QuoteDetailPage";
import DashboardPage from "../dashboard/pages/DashboardPage";
import ContractorPage from "../dashboard/pages/ContractorPage";

export const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
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
          { path: "dashboard", element: <DashboardPage /> },
          { path: "contractors/:id", element: <ContractorPage /> },
          { path: "users", element: <UsersPage /> },
          { path: "materials", element: <MaterialsPage /> },
        ],
      },
      {
        element: (
          <ProtectedRoute allowedRoles={["contractor"]}>
            <Outlet />
          </ProtectedRoute>
        ),
        children: [
          { path: "my-materials", element: <MyMaterialsPage /> },
          { path: "quotes", element: <QuotesPage /> },
          { path: "quotes/:projectId", element: <QuotePage /> },
          { path: "quotes/:projectId/:quoteId", element: <QuoteDetailPage /> },
          { path: "projects", element: <ProjectsPage /> },
          { path: "projects/:id", element: <ProjectPage /> },
          { path: "clients", element: <ClientsPage /> },
          { path: "clients/:id", element: <ClientPage /> },
        ],
      },
    ],
  },
]);
