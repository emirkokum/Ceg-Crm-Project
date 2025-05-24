import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as customerApi from "@/api/customer";
import { Customer } from "@/types/customer";

export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: customerApi.getAllCustomers,
    select: (data) => {
      if (data?.data?.data && Array.isArray(data.data.data)) {
        return (data.data.data as any[]).map(
          (c: any): Customer => ({
            ...c,
            fullName: `${c.firstName ?? ""} ${c.lastName ?? ""}`,
          })
        );
      }
      return [];
    },
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: customerApi.createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: any }) =>
      customerApi.updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => customerApi.deleteCustomer(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};
