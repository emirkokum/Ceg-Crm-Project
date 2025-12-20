import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as leadApi from "@/api/lead";
import { Lead } from "@/types/lead";

export const useLeads = () => {
  return useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const response = await leadApi.getAllLeads();
      return response.data.data;
    },
  });
};

export const useCreateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: leadApi.createLead,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};

export const useUpdateLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<Lead, "id" | "createdDate" | "updatedDate"> }) =>
      leadApi.updateLead(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
};

export const useDeleteLead = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => leadApi.deleteLead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["leads"] });
    },
  });
}; 