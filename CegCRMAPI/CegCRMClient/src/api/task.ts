import API from "./axios";
import { Task, CreateTask } from "@/types/task";

export const getAllTasks = () => API.get("/TaskItems");
export const getTaskById = (id: string) => API.get(`/TaskItems/${id}`);
export const createTask = (data: CreateTask) => API.post("/TaskItems", data);
export const updateTask = (id: string, data: Omit<Task, "id">) => API.put(`/TaskItems/${id}`, data);
export const deleteTask = (id: string) => API.delete(`/TaskItems/${id}`); 