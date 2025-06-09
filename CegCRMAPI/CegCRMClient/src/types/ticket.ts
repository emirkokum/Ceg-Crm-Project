export enum TicketStatus {
  Open = 0,
  InProgress = 1,
  Resolved = 2,
  Closed = 3
}

export interface Ticket {
  id: string;
  customerId: string;
  description: string;
  aiSuggestedSolution: string | null;
  finalSolution: string | null;
  status: TicketStatus;
  assignedEmployeeId: string | null;
}

export interface CreateTicket {
  customerId: string;
  assignedEmployeeId: string | null;
  status: TicketStatus;
  description: string;
  aiSuggestedSolution?: string;
  finalSolution?: string;
} 