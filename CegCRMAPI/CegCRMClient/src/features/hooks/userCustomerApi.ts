import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getAllCustomers, getCustomerById, createCustomer, updateCustomer, deleteCustomer } from "@/api/customer";
import { Customer } from "@/types/customer";
import { Ticket } from "@/types/ticket";
import { Interaction } from "@/types/interaction";
import { getTicketsByCustomer } from "@/api/ticket";
import { getInteractionsByCustomer } from "@/api/interaction";

export const useCustomers = () => {
  return useQuery({
    queryKey: ["customers"],
    queryFn: getAllCustomers,
    select: (response) => {
      if (response?.data?.data && Array.isArray(response.data.data)) {
        return response.data.data.map((customer: any): Customer => ({
          ...customer,
          fullName: `${customer.firstName ?? ""} ${customer.lastName ?? ""}`,
        }));
      }
      return [];
    },
  });
};

export const useCustomerById = (id: string) => {
  return useQuery({
    queryKey: ["customers", id],
    queryFn: () => getCustomerById(id),
    enabled: !!id,
    select: (response) => {
      if (response?.data?.data) {
        const customer = response.data.data;
        return {
          ...customer,
          fullName: `${customer.firstName ?? ""} ${customer.lastName ?? ""}`,
        };
      }
      return null;
    },
  });
};

export const useCustomerTickets = (customerId: string) => {
  return useQuery({
    queryKey: ["customers", customerId, "tickets"],
    queryFn: () => getTicketsByCustomer(customerId),
    enabled: !!customerId,
    select: (response) => {
      if (response?.data?.data && Array.isArray(response.data.data)) {
        return response.data.data as Ticket[];
      }
      return [];
    },
  });
};

export const useCustomerInteractions = (customerId: string) => {
  return useQuery({
    queryKey: ["customers", customerId, "interactions"],
    queryFn: () => getInteractionsByCustomer(customerId),
    enabled: !!customerId,
    select: (response) => {
      if (response?.data?.data && Array.isArray(response.data.data)) {
        return response.data.data as Interaction[];
      }
      return [];
    },
  });
};

export const useCreateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useUpdateCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Customer> }) =>
      updateCustomer(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};

export const useDeleteCustomer = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteCustomer,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customers"] });
    },
  });
};
