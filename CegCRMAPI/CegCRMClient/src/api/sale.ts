import API from "./axios";
import { Sale, CreateSale } from "@/types/sale";

export const getAllSales = () => API.get<Sale[]>("/Sales");
export const getSaleById = (id: string) => API.get<Sale>(`/Sales/${id}`);
export const createSale = (data: CreateSale) => API.post<Sale>("/Sales", data);
export const updateSale = (id: string, data: Omit<Sale, "id" | "createdDate" | "updatedDate" | "saleProducts">) => API.put<Sale>(`/Sales/${id}`, data);
export const deleteSale = (id: string) => API.delete<boolean>(`/Sales/${id}`); 