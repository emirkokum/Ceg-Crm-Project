// src/api/customer.ts
import API from "./axios";

export const getAllCustomers = () => API.get("/Customer");
export const getCustomerById = (id: string) => API.get(`/Customer/${id}`);
export const createCustomer = (data: any) => API.post("/Customer", data);
export const updateCustomer = (id: string, data: any) => API.put(`/Customer/${id}`, data);
export const deleteCustomer = (id: string) => API.delete(`/Customer/${id}`);
export const getCustomerTickets = (customerId: string) => API.get(`/Customer/${customerId}/tickets`);
export const getCustomerInteractions = (customerId: string) => API.get(`/Customer/${customerId}/interactions`);
