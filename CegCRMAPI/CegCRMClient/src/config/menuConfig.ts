import { MenuItem, UserRole } from '../types/auth';

export const menuItems: MenuItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    allowedRoles: ['Admin', 'SalesPerson', 'Support'],
  },
  {
    path: '/customers',
    label: 'Customers',
    icon: 'people',
    allowedRoles: ['Admin', 'SalesPerson', 'Support'],
  },
  {
    path: '/employees',
    label: 'Employees',
    icon: 'people',
    allowedRoles: ['Admin', 'Manager'],
  },
  {
    path: '/leads',
    label: 'Leads',
    icon: 'trending_up',
    allowedRoles: ['Admin', 'SalesPerson'],
  },
  {
    path: '/sales',
    label: 'Sales',
    icon: 'shopping_cart',
    allowedRoles: ['Admin', 'SalesPerson'],
  },
  {
    path: '/tickets',
    label: 'Tickets',
    icon: 'confirmation_number',
    allowedRoles: ['Admin', 'Support'],
  },
  {
    path: '/interactions',
    label: 'Interactions',
    icon: 'chat',
    allowedRoles: ['Admin', 'SalesPerson', 'Support'],
  },
  {
    path: '/tasks',
    label: 'Tasks',
    icon: 'task',
    allowedRoles: ['Admin'],
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: 'settings',
    allowedRoles: ['Admin'],
  },
]; 