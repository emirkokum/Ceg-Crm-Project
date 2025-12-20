import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTask,
  deleteTask,
  getAllTasks,
  getTaskById,
  updateTask,
} from "../../api/task";
import { CreateTask, Task } from "../../types/task";

export const useTasks = () => {
  return useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const response = await getAllTasks();
      return response.data.data;
    },
  });
};

export const useTaskById = (id: string) => {
  return useQuery<Task>({
    queryKey: ["tasks", id],
    queryFn: async () => {
      const response = await getTaskById(id);
      return response.data.data;
    },
  });
};

export const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateTask) => createTask(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: Omit<Task, "id"> }) =>
      updateTask(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
};

export const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteTask(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });
}; 