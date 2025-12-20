import API from "./axios";
import { Sale, CreateSale } from "@/types/sale";

export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T | null;
}

export const getAllSales = () => API.get<ApiResponse<Sale[]>>("/Sales");
export const getSaleById = (id: string) => API.get<ApiResponse<Sale>>(`/Sales/${id}`);

export const createSale = (data: CreateSale) => {
  const command = {
    saleDate: data.saleDate,
    customerId: data.customerId,
    salesPersonId: data.salesPersonId,
    totalAmount: data.totalAmount,
    discount: data.discount,
    tax: data.tax,
    finalAmount: data.finalAmount,
    status: data.status === "Pending" ? 0 : data.status === "Completed" ? 1 : data.status === "Cancelled" ? 2 : 0,
    invoiceNumber: data.invoiceNumber,
    products: data.products || []
  };

  return API.post<ApiResponse<Sale>>("/Sales", command );
};

export const updateSale = (id: string, data: Omit<Sale, "id" | "createdDate" | "updatedDate" | "saleProducts">) => 
  API.put<ApiResponse<Sale>>(`/Sales/${id}`, data);
export const deleteSale = (id: string) => API.delete<ApiResponse<boolean>>(`/Sales/${id}`); 