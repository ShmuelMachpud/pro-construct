import { createBrowserRouter } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import ProjectsPage from "../projects/pages/ProjectsPage";
import ClientsPage from "../clients/pages/ClientsPage";
import LoginPage from "../auth/pages/LoginPage";
import RegisterPage from "../auth/pages/RegisterPage";

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
      {
        path: "/",
        element: <div>Home</div>,
      },
      {
        path: "/projects",
        element: <ProjectsPage />,
      },
      {
        path: "/clients",
        element: <ClientsPage />,
      },
    ],
  },
]);