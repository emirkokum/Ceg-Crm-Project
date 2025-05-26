import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import * as interactionApi from "@/api/interaction";
import { Interaction } from "@/types/interaction";

export const useInteractions = () => {
  return useQuery({
    queryKey: ["interactions"],
    queryFn: interactionApi.getAllInteractions,
    select: (data) => {
      if (data?.data?.data && Array.isArray(data.data.data)) {
        return data.data.data as Interaction[];
      }
      return [];
    },
  });
};

export const useCreateInteraction = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: interactionApi.createInteraction,
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