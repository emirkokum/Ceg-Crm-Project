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
  PlusCircle,
  type LucideIcon,
  FileText
} from "lucide-react";
import { ThemeProvider } from "@/components/ThemeProvider";
import { Navigate } from "react-router-dom";

import CustomersPage from "@/features/customers/pages/CustomersPage";
import { LeadsPage } from "@/features/leads/pages/LeadsPage";
import { SalesPage } from "@/features/sales/pages/SalesPage";
import TicketsPage from "@/features/tickets/pages/TicketsPage";
import CreateTicketPage from "@/features/tickets/pages/CreateTicketPage";
import TicketDetailPage from "@/features/tickets/pages/TicketDetailPage";
import TasksPage from "@/features/tasks/pages/TasksPage";
import InteractionsPage from "@/features/interactions/pages/InteractionsPage";
import CustomerDetailsPage from "@/features/customers/pages/CustomerDetailsPage";
import { ProductsPage } from "@/features/products/pages/ProductsPage";
import { EmployeesPage } from "@/features/employees/pages/EmployeesPage";
import UploadDocumentation from "@/features/admin/pages/UploadDocumentation";

interface NavigationItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  allowedRoles: UserRole[];
}

export const navigationItems: NavigationItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: LayoutDashboard,
    allowedRoles: ["Admin", "Manager", "SalesPerson", "Support", "BaseUser", "Customer"],
  },
  {
    title: "Customers",
    url: "/customers",
    icon: Users,
    allowedRoles: ["Admin", "Manager", "SalesPerson", "Support"],
  },
  {
    title: "Employees",
    url: "/employees",
    icon: Users,
    allowedRoles: ["Admin", "Manager"],
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
    title: "My Tickets",
    url: "/tickets/create",
    icon: PlusCircle,
    allowedRoles: ["Admin","Customer"],
  },
  {
    title: "Tasks",
    url: "/tasks",
    icon: CheckSquare,
    allowedRoles: ["Admin", "Manager", "SalesPerson", "Support"],
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
  {
    title: "Products",
    url: "/products",
    icon: ShoppingCart,
    allowedRoles: ["Admin", "Manager"],
  },
  {
    title: "Upload Documentation",
    url: "/upload-documentation",
    icon: FileText,
    allowedRoles: ["Admin", "Manager"],
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
        index: true,
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Manager", "SalesPerson", "Support", "BaseUser", "Customer"]}>
            <Navigate to="/dashboard" replace />
          </ProtectedRoute>
        ),
      },
      {
        path: "dashboard",
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Manager", "SalesPerson", "Support", "BaseUser", "Customer"]}>
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
        path: "customers/:id",
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Manager", "SalesPerson", "Support"]}>
            <CustomerDetailsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "employees",
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
            <EmployeesPage />
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
        path: "tickets/:ticketId",
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Manager", "Support", "Customer"]}>
            <TicketDetailPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "tickets/create",
        element: (
          <ProtectedRoute allowedRoles={["Admin","Customer"]}>
            <CreateTicketPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "tasks",
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Manager", "SalesPerson", "Support"]}>
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
      {
        path: "products",
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
            <ProductsPage />
          </ProtectedRoute>
        ),
      },
      {
        path: "upload-documentation",
        element: (
          <ProtectedRoute allowedRoles={["Admin", "Manager"]}>
            <UploadDocumentation />
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

export default router;
