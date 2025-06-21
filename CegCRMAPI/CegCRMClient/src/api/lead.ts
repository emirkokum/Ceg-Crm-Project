import API from "./axios";

export const getAllLeads = () => API.get("/Leads");
export const getLeadById = (id: string) => API.get(`/Leads/${id}`);

export interface CreateLeadData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  source: number;
  status: number;
  industry: number;
  notes: string; 
}

export interface UpdateLeadData {
  companyName: string;
  contactName: string;
  email: string;
  phone: string;
  source: number;
  status: number;
  industry: number;
  notes: string;
}

export const createLead = (data: CreateLeadData) => 
  API.post("/Leads", data);

export const updateLead = (id: string, data: UpdateLeadData) => 
  API.put(`/Leads/${id}`, data);

export const deleteLead = (id: string) => API.delete(`/Leads/${id}`); 