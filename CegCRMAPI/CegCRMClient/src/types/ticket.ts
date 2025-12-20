import { Employee } from "./employee";

export interface Ticket {
  id: string;
  userId: string;
  assignedEmployeeId: string | null;
  assignedEmployee?: Employee | null;
  status: number | string;
  description: string;
  aiSuggestedSolution?: string;
  finalSolution?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTicket {
  description: string;
}

export interface UpdateTicket {
  id: string;
  data: Partial<{
    assignedEmployeeId: string | null;
    status: number | string;
    description: string;
    aiSuggestedSolution?: string;
    finalSolution?: string;
  }>;
} 