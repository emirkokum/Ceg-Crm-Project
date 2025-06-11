export type UserRole = "Admin" | "Manager" | "SalesPerson" | "Support" | "BaseUser" | "Customer";

export interface UserInfo {
  id: string;
  email: string;
  name: string;
  surname: string;
  role: UserRole;
}

export interface AuthContextType {
  role: UserRole | null;
  userInfo: UserInfo | null;
  isLoading: boolean;
  setRole: (role: UserRole, userInfo: UserInfo) => void;
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

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
} 