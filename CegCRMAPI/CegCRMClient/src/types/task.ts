export interface Task {
  id: string;
  assignedUserId: string;
  customerId: string | null;
  title: string;
  description: string;
  dueDate: string;
  priority: string;
  status: string;
  type: string;
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