import { createBrowserRouter } from "react-router-dom";
import App from "@/App";
import LoginPage from "@/features/auth/pages/LoginPage";
import RegisterPage from "@/features/auth/pages/RegisterPage";
import { AdminPage } from "@/features/admin/pages/AdminPage";
import Dashboard from "@/features/dashboard/pages/Dashboard";
import { ProtectedRoute } from "@/components/ProtectedRoute";
import { UserRole } from "@/types/auth";
import { AuthProvider } from "@/contexts/AuthContext";
import {
  LayoutDashboard,
  Users,
  UserPlus,
  ShoppingCart,
  Ticket,
  CheckSquare,
  MessageSquare,
  Settings,
  type LucideIcon
} from "lucide-react";
import { ThemeProvider } from "@/components/ThemeProvider";

// Import other page components
import CustomersPage from "@/features/customers/pages/CustomersPage";
import { LeadsPage } from "@/features/leads/pages/LeadsPage";
import { SalesPage } from "@/features/sales/pages/SalesPage";
import TicketsPage from "@/features/tickets/pages/TicketsPage";
import TasksPage from "@/features/tasks/pages/TasksPage";
import InteractionsPage from "@/features/interactions/pages/InteractionsPage";

interface NavigationItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  allowedRoles: UserRole[];
}

const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["Admin", "Manager", "Employee", "SalesPerson", "Support", "BaseUser"],
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
    allowedRoles: ["Admin", "Manager", "SalesPerson", "Support"],
  },
  {
    title: "Leads",
    url: "/leads",
    icon: UserPlus,
    allowedRoles: ["Admin", "Manager", "SalesPerson"],
  },
  {
    title: "Sales",
    url: "/sales",
    icon: ShoppingCart,
    allowedRoles: ["Admin", "Manager", "SalesPerson"],
  },
  {
    title: "Tickets",
    url: "/tickets",
    icon: Ticket,
    allowedRoles: ["Admin", "Manager", "Support"],
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: CheckSquare,
    allowedRoles: ["Admin", "Manager", "Employee", "SalesPerson", "Support"],
  },
  {
    title: "Interactions",
    url: "/interactions",
    icon: MessageSquare,
    allowedRoles: ["Admin", "Manager", "SalesPerson", "Support"],
  },
  {
    title: "Admin Panel",
    url: "/admin",
    icon: Settings,
    allowedRoles: ["Admin"],
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthProvider>
        <App />
      </AuthProvider>
    ),
    children: [
      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Manager", "Employee", "SalesPerson", "Support", "BaseUser"]}>
            <Dashboard />
          </ProtectedRoute>
        ),
      },
      {
        path: "admin",
        element: (
          <ProtectedRoute allowedRoles={["Admin"]}>
            <AdminPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "customers",
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Manager", "SalesPerson", "Support"]}>
            <CustomersPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "leads",
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Manager", "SalesPerson"]}>
            <LeadsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "sales",
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Manager", "SalesPerson"]}>
            <SalesPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "tickets",
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Manager", "Support"]}>
            <TicketsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "tasks",
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Manager", "Employee", "SalesPerson", "Support"]}>
            <TasksPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "interactions",
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Manager", "SalesPerson", "Support"]}>
            <InteractionsPage />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: (
      <AuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <LoginPage />
        </ThemeProvider>
      </AuthProvider>
    ),
  },
  {
    path: "/register",
    element: (
      <AuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <RegisterPage />
        </ThemeProvider>
      </AuthProvider>
    ),
  },
]);

export { navigationItems };
export default router;
