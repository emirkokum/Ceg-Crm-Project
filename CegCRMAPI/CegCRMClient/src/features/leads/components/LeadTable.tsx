import { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useCreateLead, useUpdateLead, useDeleteLead } from "@/features/hooks/useLeadApi";
import { Lead } from "@/types/lead";
import { MoreHorizontal, Plus } from "lucide-react";
import { toast, Toaster } from "sonner";
import { Textarea } from "../../../components/ui/textarea";

interface LeadTableProps {
  data: Lead[];
}

export function LeadTable({ data }: LeadTableProps) {
  const createLead = useCreateLead();
  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();

  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [formData, setFormData] = useState<Partial<Lead>>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    source: "",
    status: "New",
    industry: "",
    notes: "",
  });

  const handleCreate = async () => {
    try {
      await createLead.mutateAsync(formData as Omit<Lead, "id" | "createdDate" | "updatedDate">);
      toast.success("Lead created successfully");
      setIsCreateOpen(false);
      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        source: "",
        status: "New",
        industry: "",
        notes: "",
      });
    } catch (error) {
      toast.error("Failed to create lead");
    }
  };

  const handleUpdate = async () => {
    if (!selectedLead) return;
    try {
      await updateLead.mutateAsync({
        id: selectedLead.id,
        data: formData as Omit<Lead, "id" | "createdDate" | "updatedDate">,
      });
      toast.success("Lead updated successfully");
      setIsUpdateOpen(false);
    } catch (error) {
      toast.error("Failed to update lead");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteLead.mutateAsync(id);
      toast.success("Lead deleted successfully");
    } catch (error) {
      toast.error("Failed to delete lead");
    }
  };

  return (
    <div className="space-y-4">
      <Toaster />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Company</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Source</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Industry</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.map((lead: Lead) => (
            <TableRow key={lead.id}>
              <TableCell>{lead.companyName}</TableCell>
              <TableCell>{lead.contactName}</TableCell>
              <TableCell>{lead.email}</TableCell>
              <TableCell>{lead.phone}</TableCell>
              <TableCell>{lead.source}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      {lead.status}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {["New", "Contacted", "Qualified", "Unqualified"].map((status) => (
                      <DropdownMenuItem
                        key={status}
                        onClick={() => {
                          updateLead.mutate(
                            {
                              id: lead.id,
                              data: { ...lead, status },
                            },
                            {
                              onSuccess: () => {
                                toast.success("Lead status updated successfully");
                              },
                              onError: () => {
                                toast.error("Failed to update lead status");
                              },
                            }
                          );
                        }}
                      >
                        {status}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
              <TableCell>{lead.industry}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only">Open menu</span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedLead(lead);
                        setFormData(lead);
                        setIsUpdateOpen(true);
                      }}
                    >
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDelete(lead.id)}
                      className="text-red-600"
                    >
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Lead</DialogTitle>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="form-field">
                <Label htmlFor="update-companyName">Company Name</Label>
                <Input
                  id="update-companyName"
                  value={formData.companyName}
                  onChange={(e) =>
                    setFormData({ ...formData, companyName: e.target.value })
                  }
                />
              </div>
              <div>
                <Label htmlFor="update-contactName">Contact Name</Label>
                <Input
                  id="update-contactName"
                  value={formData.contactName}
                  onChange={(e) =>
                    setFormData({ ...formData, contactName: e.target.value })
                  }
                />
              </div>
              <div className="form-field">
                <Label htmlFor="update-email">Email</Label>
                <Input
                  id="update-email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                />
              </div>
              <div className="form-field">
                <Label htmlFor="update-phone">Phone</Label>
                <Input
                  id="update-phone"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                />
              </div>
              <div className="form-field">
                <Label htmlFor="update-source">Source</Label>
                <Input
                  id="update-source"
                  value={formData.source}
                  onChange={(e) =>
                    setFormData({ ...formData, source: e.target.value })
                  }
                />
              </div>
              <div className="form-field">
                <Label htmlFor="update-status">Status</Label>
                <Input
                  id="update-status"
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({ ...formData, status: e.target.value })
                  }
                />
              </div>
              <div className="form-field">
                <Label htmlFor="update-industry">Industry</Label>
                <Input
                  id="update-industry"
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                />
              </div>
              <div className="form-field">
                <Label htmlFor="update-notes">Notes</Label>
                <Textarea
                  id="update-notes"
                  value={formData.notes}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                    setFormData({ ...formData, notes: e.target.value })
                  }
                />
              </div>
              <Button onClick={handleUpdate}>Update Lead</Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 