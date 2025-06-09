export type UserRole = 'Admin' | 'SalesPerson' | 'SupportAgent' | 'Assistant';

export interface AuthContextType {
  role: UserRole | null;
  setRole: (role: UserRole) => void;
  logout: () => void;
}

export interface MenuItem {
  path: string;
  label: string;
  icon?: string;
  allowedRoles: UserRole[];
}

export interface ProtectedRouteProps {
  allowedRoles: UserRole[];
} 