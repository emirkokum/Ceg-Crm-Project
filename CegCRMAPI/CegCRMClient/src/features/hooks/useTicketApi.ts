import { useMutation, useQuery } from "@tanstack/react-query";
import {
  getAllTickets,
  createTicket,
  updateTicket,
  deleteTicket,
} from "@/api/ticket";
import { CreateTicket } from "@/types/ticket";

export const useTickets = () => {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const response = await getAllTickets();
      return response.data.data;
    },
  });
};

export const useCreateTicket = () => {
  return useMutation({
    mutationFn: (data: CreateTicket) => createTicket(data),
  });
};

export const useUpdateTicket = () => {
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<CreateTicket, "id"> }) =>
      updateTicket(id, data),
  });
};

export const useDeleteTicket = () => {
  return useMutation({
    mutationFn: (id: string) => deleteTicket(id),
  });
}; 