import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as interactionApi from "@/api/interaction";
import { Interaction, CreateInteraction } from "@/types/interaction";

export const useInteractions = () => {
  return useQuery({
    queryKey: ["interactions"],
    queryFn: async () => {
      const response = await interactionApi.getAllInteractions();
      if (response?.data?.data && Array.isArray(response.data.data)) {
        return response.data.data as Interaction[];
      }
      return [];
    },
  });
};

export const useInteractionsByCustomer = (customerId: string) => {
  return useQuery({
    queryKey: ["interactions", "customer", customerId],
    queryFn: async () => {
      if (!customerId) return [];
      const response = await interactionApi.getInteractionsByCustomer(customerId);
      if (response?.data?.data && Array.isArray(response.data.data)) {
        return response.data.data as Interaction[];
      }
      return [];
    },
    enabled: !!customerId,
  });
};

export const useCreateInteraction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateInteraction) => interactionApi.createInteraction(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interactions"] });
    },
  });
};

export const useUpdateInteraction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<Interaction, "id"> }) =>
      interactionApi.updateInteraction(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interactions"] });
    },
  });
};

export const useDeleteInteraction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => interactionApi.deleteInteraction(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["interactions"] });
    },
  });
}; 