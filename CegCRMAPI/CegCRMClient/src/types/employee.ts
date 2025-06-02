export interface Employee {
  id: string;
  userId: string;
  employeeNumber: string;
  hireDate: string;
  workEmail: string;
  workPhone: string;
  annualLeaveDays: number;
  usedLeaveDays: number;
  performanceScore: number;
  emergencyContact: string;
  emergencyPhone: string;
  bankAccount: string;
  taxNumber: string;
  user: {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    department: string;
    position: string;
    role: string;
  };
} 