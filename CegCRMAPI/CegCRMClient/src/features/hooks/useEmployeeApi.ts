import { useQuery } from "@tanstack/react-query";
import API from "../../api/axios";

export interface Employee {
  id: string;
  userId: string;
  employeeNumber?: string;
  hireDate: string;
  workEmail?: string;
  workPhone?: string;
  annualLeaveDays: number;
  usedLeaveDays: number;
  performanceScore: number;
  emergencyContact?: string;
  emergencyPhone?: string;
  bankAccount?: string;
  taxNumber?: string;
  // Fields from UserDto
  firstName?: string;
  lastName?: string;
  email: string;
  role?: string;
  department?: string;
}

export interface CreateEmployeeCommand {
  userId: string;
  employeeNumber?: string;
  hireDate: string;
  workEmail?: string;
  workPhone?: string;
  annualLeaveDays: number;
  usedLeaveDays: number;
  performanceScore: number;
  emergencyContact?: string;
  emergencyPhone?: string;
  bankAccount?: string;
  taxNumber?: string;
}

export interface UpdateEmployeeCommand {
  id: string;
  employeeNumber?: string;
  hireDate: string;
  workEmail?: string;
  workPhone?: string;
  annualLeaveDays: number;
  usedLeaveDays: number;
  performanceScore: number;
  emergencyContact?: string;
  emergencyPhone?: string;
  bankAccount?: string;
  taxNumber?: string;
}

export const useEmployees = () => {
  return useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await API.get("/Employees");
      return response.data.data; // Assuming the API response structure is similar to users
    },
  });
};

export const createEmployee = async (data: CreateEmployeeCommand): Promise<Employee> => {
  const response = await API.post("/Employees", data);
  return response.data.data;
};

export const updateEmployee = async (id: string, data: UpdateEmployeeCommand): Promise<Employee> => {
  const response = await API.put(`/Employees/${id}`, data);
  return response.data.data;
};

export const deleteEmployee = async (id: string): Promise<boolean> => {
  const response = await API.delete(`/Employees/${id}`);
  return response.data.success;
}; 