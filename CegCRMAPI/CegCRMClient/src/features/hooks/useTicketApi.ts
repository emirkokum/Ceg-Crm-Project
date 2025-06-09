import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  assignTicket,
} from "@/api/ticket";
import { Ticket, CreateTicket } from "@/types/ticket";

export const useTickets = () => {
  return useQuery<Ticket[]>({
    queryKey: ["tickets"],
    queryFn: async () => {
      const response = await getAllTickets();
      return response.data.data;
    },
  });
};

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getTicketById(id),
  });
};

export const useCreateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useUpdateTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<Ticket, "id"> }) =>
      updateTicket(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useDeleteTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteTicket,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useAssignTicket = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, employeeId }: { ticketId: string; employeeId: string }) =>
      assignTicket(ticketId, employeeId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}; 