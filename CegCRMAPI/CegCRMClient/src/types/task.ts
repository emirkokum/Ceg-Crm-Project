export interface Task {
  id: string;
  assignedUserId: string;
  customerId: string | null;
  title: string;
  description: string;
  dueDate: string;
  priority: number; //enum
  status: number;//enum
  type: number;//enum
}

export interface CreateTask {
  assignedUserId: string;
  customerId: string | null;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  type: string;
} 