import App from "@/App";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import CustomersPage from "@/features/customers/pages/CustomersPage";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import InteractionsPage from "@/features/interactions/pages/InteractionsPage";
import TasksPage from "@/features/tasks/pages/TasksPage";
import { LeadsPage } from "@/features/leads/pages/LeadsPage";
import { SalesPage } from "@/features/sales/pages/SalesPage";
import { AdminPage } from "@/features/admin/pages/AdminPage";
import { EmployeesPage } from "@/features/employees/pages/EmployeesPage";
import { createBrowserRouter } from "react-router-dom";
import TicketsPage from "@/features/tickets/pages/TicketsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Dashboard /> },
      { path: "dashboard", element: <Dashboard /> },
      { path: "/customers", element: <CustomersPage /> },
      { path: "/interactions", element: <InteractionsPage /> },
      { path: "/tasks", element: <TasksPage /> },
      { path: "/leads", element: <LeadsPage /> },
      { path: "/sales", element: <SalesPage /> },
      { path: "/admin", element: <AdminPage /> },
      { path: "/employees", element: <EmployeesPage /> },
      { path: "/tickets", element: <TicketsPage /> },

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
