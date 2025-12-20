import API from "./axios";
import { Product, CreateProduct, UpdateProduct } from "@/types/product";

export const productApi = {
  getAll: async (): Promise<Product[]> => {
    const response = await API.get("/Products");
    return response.data.data;
  },

  getById: async (id: string): Promise<Product> => {
    const response = await API.get(`/Products/${id}`);
    return response.data.data;
  },

  create: async (data: CreateProduct): Promise<Product> => {
    const response = await API.post("/Products", data);
    return response.data.data;
  },

  update: async (id: string, data: Partial<CreateProduct>): Promise<Product> => {
    const response = await API.put(`/Products/${id}`, data);
    return response.data.data;
  },

  delete: async (id: string): Promise<boolean> => {
    const response = await API.delete(`/Products/${id}`);
    return response.data.data;
  },
}; 