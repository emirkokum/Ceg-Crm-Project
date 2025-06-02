import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as saleApi from "@/api/sale";
import { Sale, CreateSale } from "@/types/sale";
import { AxiosResponse } from "axios";

export const useSales = () => {
  return useQuery<AxiosResponse<Sale[]>, Error, Sale[], ["sales"]>({
    queryKey: ["sales"],
    queryFn: saleApi.getAllSales,
    select: (response) => response.data,
  });
};

export const useSaleById = (id: string) => {
  return useQuery<AxiosResponse<Sale>, Error, Sale, ["sales", string]>({
    queryKey: ["sales", id],
    queryFn: () => saleApi.getSaleById(id),
    enabled: !!id,
    select: (response) => response.data,
  });
};

export const useCreateSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateSale) => saleApi.createSale(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
};

export const useUpdateSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<Sale, "id" | "createdDate" | "updatedDate" | "saleProducts"> }) =>
      saleApi.updateSale(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
};

export const useDeleteSale = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => saleApi.deleteSale(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    },
  });
}; 