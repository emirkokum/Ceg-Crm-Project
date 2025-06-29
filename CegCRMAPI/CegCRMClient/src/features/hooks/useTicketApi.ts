import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket,
  assignTicket,
  updateTicketStatus,
  getTicketsByCustomer,
  assignRandomEmployee,
  updateTicketWithSolution,
} from "@/api/ticket";
import { Ticket, UpdateTicket } from "@/types/ticket";

export const useTickets = () => {
  return useQuery({
    queryKey: ["tickets"],
    queryFn: async () => {
      const response = await getAllTickets();
      if (response?.data?.data && Array.isArray(response.data.data)) {
        return response.data.data as Ticket[];
      }
      return [];
    },
  });
};

export const useTicket = (id: string) => {
  return useQuery({
    queryKey: ["ticket", id],
    queryFn: () => getTicketById(id),
    enabled: !!id,
    select: (response) => {
      if (response?.data?.data) {
        return response.data.data as Ticket;
      }
      return null;
    },
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
    mutationFn: ({ id, data }: { id: string; data: UpdateTicket["data"] }) =>
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

export const useTicketsByCustomer = (customerId: string) => {
  return useQuery({
    queryKey: ["tickets-by-customer", customerId],
    queryFn: async () => {
      const response = await getTicketsByCustomer(customerId);
      if (response?.data?.data && Array.isArray(response.data.data)) {
        return response.data.data as Ticket[];
      }
      return [];
    },
    enabled: !!customerId,
  });
};

export const useUpdateTicketStatus = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ ticketId, newStatus }: { ticketId: string; newStatus: number }) =>
      updateTicketStatus(ticketId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useAssignRandomEmployee = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: assignRandomEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
};

export const useUpdateTicketWithSolution = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: { status?: number; finalSolution?: string; assignedEmployeeId?: string } }) =>
      updateTicketWithSolution(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tickets"] });
    },
  });
}; 