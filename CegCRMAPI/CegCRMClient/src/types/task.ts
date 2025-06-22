export interface Task {
  id: string;
  assignedEmployeeId: string;
  customerId: string | null;
  title: string;
  description: string;
  dueDate: string;
  priority: number; //enum
  status: number;//enum
  type: number;//enum
}

export interface CreateTask {
  assignedEmployeeId: string;
  customerId: string | null;
  title: string;
  description: string;
  dueDate: string;
  priority: number;
  status: number;
  type: number;
} 