import API from "./axios";
import { Lead } from "@/types/lead";

export const getAllLeads = () => API.get("/Leads");
export const getLeadById = (id: string) => API.get(`/Leads/${id}`);
export const createLead = (data: Omit<Lead, "id" | "createdDate" | "updatedDate">) => 
  API.post("/Leads", data);
export const updateLead = (id: string, data: Omit<Lead, "id" | "createdDate" | "updatedDate">) => 
  API.put(`/Leads/${id}`, data);
export const deleteLead = (id: string) => API.delete(`/Leads/${id}`); 