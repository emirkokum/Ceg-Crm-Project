import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import API from "@/api/axios";

export interface DocumentInfo {
  file_name: string;
  uploaded_at: string;
  chunk_count: number;
}

export const useDocuments = () => {
  return useQuery<DocumentInfo[]>({
    queryKey: ["documents"],
    queryFn: async () => {
      const response = await API.get("/ai/documents");
      return response.data.documents;
    },
  });
};

export const useUploadDocumentation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      const response = await API.post("/ai/upload-doc", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
};

export const useDeleteDocument = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (fileName: string) => {
      const response = await API.delete(`/ai/documents/${encodeURIComponent(fileName)}`);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["documents"] });
    },
  });
}; 