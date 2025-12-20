import { useRef, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { useUploadDocumentation, useDocuments, useDeleteDocument } from "@/features/hooks/useDocumentationApi";
import { useAuth } from "@/contexts/AuthContext";
import { Trash2 } from "lucide-react";

export default function UploadDocumentation() {
  const { role } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const uploadMutation = useUploadDocumentation();
  const { data: documents, isLoading: isLoadingDocs } = useDocuments();
  const deleteMutation = useDeleteDocument();

  if (role !== "Admin" && role !== "Manager") {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-6">
        <h2 className="text-xl font-semibold text-red-500">Unauthorized</h2>
        <p className="text-muted-foreground mt-2">You do not have permission to access this page.</p>
      </div>
    );
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === "text/plain") {
      setSelectedFile(file);
    } else {
      setSelectedFile(null);
      if (file) toast.error("Only .txt files are allowed.");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      toast.error("Please select a .txt file to upload.");
      return;
    }
    try {
      await uploadMutation.mutateAsync(selectedFile);
      toast.success("Document uploaded successfully.");
      setSelectedFile(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (error) {
      toast.error("Failed to upload document.");
    }
  };

  const handleDelete = async (fileName: string) => {
    try {
      await deleteMutation.mutateAsync(fileName);
      toast.success("Document deleted successfully.");
    } catch (error) {
      toast.error("Failed to delete document.");
    }
  };

  const isUploading = uploadMutation.status === "pending";
  const isDeleting = deleteMutation.status === "pending";

  return (
    <div className="flex flex-col gap-6 p-6 max-w-3xl mx-auto w-full">
      <Card>
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Upload Knowledge Base Document</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="file-upload">Select .txt file</Label>
              <Input
                id="file-upload"
                ref={fileInputRef}
                type="file"
                accept=".txt"
                onChange={handleFileChange}
                className="my-5"
                disabled={isUploading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button
              type="submit"
              disabled={!selectedFile || isUploading}
              className="w-full"
            >
              {isUploading ? "Uploading..." : "Upload"}
            </Button>
          </CardFooter>
        </form>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Uploaded Documents</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoadingDocs ? (
            <div className="space-y-2">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-2">File Name</th>
                    <th className="text-left p-2">Upload Date</th>
                    <th className="text-left p-2">Chunk Count</th>
                    <th className="text-left p-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {documents && documents.length > 0 ? (
                    documents.map((doc) => (
                      <tr key={doc.file_name} className="border-b">
                        <td className="p-2 break-all">{doc.file_name}</td>
                        <td className="p-2">{new Date(doc.uploaded_at).toLocaleString()}</td>
                        <td className="p-2">{doc.chunk_count}</td>
                        <td className="p-2">
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(doc.file_name)}
                            disabled={isDeleting}
                          >
                            <Trash2 className="h-4 w-4" />
                            Delete
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan={4} className="p-2 text-center text-muted-foreground">No documents uploaded.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 