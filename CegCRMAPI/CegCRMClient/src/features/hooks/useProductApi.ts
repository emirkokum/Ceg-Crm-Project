import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productApi } from "@/api/product";
import { Product, CreateProduct, UpdateProduct } from "@/types/product";

export const useProducts = () => {
  return useQuery<Product[]>({
    queryKey: ["products"],
    queryFn: productApi.getAll,
  });
};

export const useProduct = (id: string) => {
  return useQuery<Product>({
    queryKey: ["products", id],
    queryFn: () => productApi.getById(id),
    enabled: !!id,
  });
};

export const useCreateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
};

export const useUpdateProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, data }: UpdateProduct) => productApi.update(id, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      queryClient.invalidateQueries({ queryKey: ["products", variables.id] });
    },
  });
};

export const useDeleteProduct = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: productApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
    },
  });
}; 