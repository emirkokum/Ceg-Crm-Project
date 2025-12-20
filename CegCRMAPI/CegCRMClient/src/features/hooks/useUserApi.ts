import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "../../api/axios";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
  department?: string;
}

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: string;
}

export interface UpdateUserData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  department?: string;
}

export const useUsers = () => {
  return useQuery<User[]>({
    queryKey: ["users"],
    queryFn: async () => {
      const response = await API.get("/Auth/users");
      return response.data.data;
    },
  });
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: CreateUserData) => {
      const response = await API.post("/Auth/register", data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: UpdateUserData) => {
      const response = await API.put(`/Auth/users/${data.id}`, data);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (userId: string) => {
      const response = await API.delete(`/Auth/users/${userId}`);
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useResetUserPassword = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ email, newPassword }: { email: string; newPassword: string }) => {
      const response = await API.post("/Auth/admin-reset-password", { email, newPassword });
      return response.data.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
}; 