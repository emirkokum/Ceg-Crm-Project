import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateLead } from "@/features/hooks/useLeadApi";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { EnumSelect } from "@/components/EnumSelect";
import { Lead } from "@/types/lead";
import { useEnum } from "@/features/hooks/useEnums";

interface AddLeadModalProps {
  onAddLead: (lead: Omit<Lead, "id" | "createdDate" | "updatedDate">) => void;
}

export function AddLeadModal({ onAddLead }: AddLeadModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const createLead = useCreateLead();
  const { data: leadStatusOptions } = useEnum("lead-status");
  const { data: leadSourceOptions } = useEnum("lead-source");
  const { data: industryTypeOptions } = useEnum("industry-type");

  const [formData, setFormData] = useState<Omit<Lead, "id" | "createdDate" | "updatedDate">>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    source: 0,
    status: 0,
    industry: 0,
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const leadData = {
        ...formData,
        companyName: formData.companyName.trim(),
        contactName: formData.contactName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        notes: formData.notes.trim(),
      };
      
      await createLead.mutateAsync(leadData);
      toast.success("Lead added successfully");
      onAddLead(leadData);
      setIsOpen(false);
      setFormData({
        companyName: "",
        contactName: "",
        email: "",
        phone: "",
        source: 0,
        status: 0,
        industry: 0,
        notes: "",
      });
    } catch (error: any) {
      if (error.response?.data) {
        toast.error(error.response.data.message || "Error adding lead");
      } else {
        toast.error("Error adding lead");
      }
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" />
          Add Lead
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Lead</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Company Name</label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Contact Name</label>
              <input
                type="text"
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Phone</label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Source</label>
              <EnumSelect
                options={leadSourceOptions || []}
                value={formData.source}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, source: value }))
                }
                placeholder="Select source"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <EnumSelect
                options={leadStatusOptions || []}
                value={formData.status}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value }))
                }
                placeholder="Select status"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Industry</label>
              <EnumSelect
                options={industryTypeOptions || []}
                value={formData.industry}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, industry: value }))
                }
                placeholder="Select industry"
              />
            </div>
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Notes</label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={3}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
            <Button type="submit">Add Lead</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
} 