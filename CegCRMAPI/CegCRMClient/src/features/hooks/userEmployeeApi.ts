import { useQuery } from "@tanstack/react-query";
import { Employee } from "@/types/employee";
import { getAllEmployees } from "@/api/employee";

export const useEmployees = () => {
  return useQuery<Employee[]>({
    queryKey: ["employees"],
    queryFn: async () => {
      const response = await getAllEmployees();
      return response.data.data;
    },
  });
}; 