import { useQuery } from "@tanstack/react-query";
import API from "../../api/axios";

export interface EnumOption {
  value: number;
  label: string;
}

export type EnumType =
  | "lead-status"
  | "lead-source"
  | "industry-type"
  | "sale-status"
  | "ticket-status"
  | "task-status"
  | "task-priority"
  | "task-type"
  | "interaction-type"
  | "customer-type";

  const fetchEnum = async (enumType: EnumType): Promise<EnumOption[]> => {
    const { data } = await API.get(`/enums/${enumType}`);
    return data?.data ?? [];
  };
  

export function useEnum(enumType: EnumType) {
  return useQuery({
    queryKey: ["enum", enumType],
    queryFn: () => fetchEnum(enumType),
    staleTime: 5 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
} 