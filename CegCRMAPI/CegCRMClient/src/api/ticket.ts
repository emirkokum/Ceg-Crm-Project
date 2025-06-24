import API from "./axios";
import { Ticket, CreateTicket, UpdateTicket } from "@/types/ticket";

export const getAllTickets = () => API.get("/Tickets");
export const getTicketById = (id: string) => API.get(`/Tickets/${id}`);
export const createTicket = (data: CreateTicket) => API.post("/Tickets", data);
export const updateTicket = (id: string, data: UpdateTicket["data"]) => API.put(`/Tickets/${id}`, data);
export const deleteTicket = (id: string) => API.delete(`/Tickets/${id}`);
export const assignTicket = (ticketId: string, employeeId: string) => 
  API.put(`/Tickets/${ticketId}/assign`, { ticketId, employeeId });

export const updateTicketStatus = (ticketId: string, newStatus: number) =>
  API.patch(`/Tickets/${ticketId}/status`, { ticketId, newStatus });

export const getTicketsByCustomer = (customerId: string) => API.get(`/Tickets/ByCustomer?customerId=${customerId}`);

export const assignRandomEmployee = (ticketId: string) => 
  API.post(`/Tickets/${ticketId}/assign-random-employee`); 