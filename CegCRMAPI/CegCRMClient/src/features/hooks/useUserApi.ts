import { useQuery } from "@tanstack/react-query";
import API from "../../api/axios";

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role?: string;
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