import API from "./axios";
import { Sale, CreateSale } from "@/types/sale";

interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T | null;
}

export const getAllSales = () => API.get<ApiResponse<Sale[]>>("/Sales");
export const getSaleById = (id: string) => API.get<ApiResponse<Sale>>(`/Sales/${id}`);
export const createSale = (data: CreateSale) => API.post<ApiResponse<Sale>>("/Sales", data);
export const updateSale = (id: string, data: Omit<Sale, "id" | "createdDate" | "updatedDate" | "saleProducts">) => 
  API.put<ApiResponse<Sale>>(`/Sales/${id}`, data);
export const deleteSale = (id: string) => API.delete<ApiResponse<boolean>>(`/Sales/${id}`); 