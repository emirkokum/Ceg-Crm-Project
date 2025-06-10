export type UserRole = 'Admin' | 'Manager' | 'Employee' | 'SalesPerson' | 'Support' | 'BaseUser';

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