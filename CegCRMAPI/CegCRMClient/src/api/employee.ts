import API from "./axios";
import { Employee } from "@/types/employee";
import { CreateEmployeeCommand } from "@/features/hooks/useEmployeeApi";

export const getAllEmployees = () => API.get<{ data: Employee[] }>("/Employees");
export const getEmployeeById = (id: string) => API.get<{ data: Employee }>(`/Employees/${id}`);
export const createEmployee = (data: CreateEmployeeCommand) => API.post("/Employees", data);
export const updateEmployee = (id: string, data: Omit<Employee, "id" | "user">) => API.put(`/Employees/${id}`, data);
export const deleteEmployee = (id: string) => API.delete(`/Employees/${id}`); 