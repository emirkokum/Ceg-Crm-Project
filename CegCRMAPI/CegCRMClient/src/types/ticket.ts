export interface Ticket {
  id: string;
  customerId: string;
  assignedEmployeeId: string | null;
  status: string;
  description: string;
  solution: string;
}

export interface CreateTicket {
  customerId: string;
  assignedEmployeeId: string | null;
  status: string;
  description: string;
  solution: string;
} 