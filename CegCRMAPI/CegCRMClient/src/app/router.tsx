import App from "@/App";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import CustomerList from "@/features/customers/pages/CustomerList";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import InteractionsPage from "@/features/interactions/pages/InteractionsPage";
import TasksPage from "@/features/tasks/pages/TasksPage";
import { LeadsPage } from "@/features/leads/pages/LeadsPage";
import { SalesPage } from "@/features/sales/pages/SalesPage";
import { createBrowserRouter } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "/customers", element: <CustomerList /> },
      { path: "/interactions", element: <InteractionsPage /> },
      { path: "/tasks", element: <TasksPage /> },
      { path: "/leads", element: <LeadsPage /> },
      { path: "/sales", element: <SalesPage /> },
    ],
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
]);

export default router;
