export interface Ticket {
  id: string;
  customerId: string;
  assignedEmployeeId: string | null;
  status: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicket {
  customerId: string;
  assignedEmployeeId: string | null;
  status: number;
  description: string;
}

export interface UpdateTicket {
  id: string;
  data: Partial<CreateTicket>;
} 