import { MenuItem, UserRole } from '../types/auth';

export const menuItems: MenuItem[] = [
  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: 'dashboard',
    allowedRoles: ['Admin', 'SalesPerson', 'SupportAgent', 'Assistant'],
  },
  {
    path: '/customers',
    label: 'Customers',
    icon: 'people',
    allowedRoles: ['Admin', 'SalesPerson', 'SupportAgent', 'Assistant'],
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
    allowedRoles: ['Admin', 'SupportAgent'],
  },
  {
    path: '/interactions',
    label: 'Interactions',
    icon: 'chat',
    allowedRoles: ['Admin', 'SalesPerson', 'SupportAgent', 'Assistant'],
  },
  {
    path: '/tasks',
    label: 'Tasks',
    icon: 'task',
    allowedRoles: ['Admin', 'Assistant'],
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: 'settings',
    allowedRoles: ['Admin'],
  },
]; 