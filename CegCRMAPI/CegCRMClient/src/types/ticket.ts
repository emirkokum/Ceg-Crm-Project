export enum TicketStatus {
  Open = 0,
  ResolvedByAI = 1,
  AssignedToEmployee = 2,
  Closed = 3
}

export interface Ticket {
  id: string;
  customerId: string;
  description: string;
  aiSuggestedSolution: string | null;
  finalSolution: string | null;
  status: string;
  assignedEmployeeId: string | null;
}

export interface CreateTicket {
  customerId: string;
  assignedEmployeeId: string | null;
  status: string;
  description: string;
  aiSuggestedSolution?: string;
  finalSolution?: string;
} 