import API from "./axios";
import { Lead } from "@/types/lead";
import { Note } from "@/types/Note";

export const getAllLeads = () => API.get("/Leads");
export const getLeadById = (id: string) => API.get(`/Leads/${id}`);

export interface CreateLeadData {
  assignedToEmployeeId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  source: number;
  status: number;
  industry: number;
  notes: {
    content: string;
    customerId: string | null;
    leadId: string | null;
    ticketId: string | null;
    saleId: string | null;
    taskId: string | null;
  };
}

export interface UpdateLeadData {
  assignedToEmployeeId: string;
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  source: number;
  status: number;
  industry: number;
  notes: Note;
}

export const createLead = (data: CreateLeadData) => 
  API.post("/Leads", { command: data });

export const updateLead = (id: string, data: UpdateLeadData) => 
  API.put(`/Leads/${id}`, data);

export const deleteLead = (id: string) => API.delete(`/Leads/${id}`); 