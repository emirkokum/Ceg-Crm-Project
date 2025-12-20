import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useCreateCustomer } from "@/features/hooks/userCustomerApi";
import { toast } from "sonner";
import { Plus } from "lucide-react";
import { EnumSelect } from "@/components/EnumSelect";
import { CreateCustomer } from "@/types/customer";
import { IndustryType, CustomerType } from "@/constants/enums";

const industryTypeOptions = [
  { value: IndustryType.Technology, label: "Technology" },
  { value: IndustryType.Finance, label: "Finance" },
  { value: IndustryType.Health, label: "Health" },
  { value: IndustryType.Retail, label: "Retail" },
  { value: IndustryType.Education, label: "Education" },
  { value: IndustryType.Other, label: "Other" },
];

const customerTypeOptions = [
  { value: CustomerType.Person, label: "Person" },
  { value: CustomerType.Business, label: "Business" },
];

interface AddCustomerModalProps {
  onAddCustomer: (customer: CreateCustomer) => void;
}

export default function AddCustomerModal({ onAddCustomer }: AddCustomerModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const createCustomer = useCreateCustomer();

  const [formData, setFormData] = useState<CreateCustomer & { type: number }>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    industryType: 0,
    type: CustomerType.Person,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const customerData = {
        firstName: formData.firstName.trim(),
        lastName: formData.lastName.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        address: formData.address.trim(),
        industryType: formData.industryType,
        type: formData.type,
      };
      
      await createCustomer.mutateAsync(customerData);
      toast.success("Customer added successfully");
      onAddCustomer(customerData);
      setIsOpen(false);
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        industryType: 0,
        type: CustomerType.Person,
      });
    } catch (error: any) {
      if (error.response?.data) {
        toast.error(error.response.data.message || "Error adding customer");
      } else {
        toast.error("Error adding customer");
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
          Add Customer
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Customer</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
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
            <div className="col-span-2 space-y-2">
              <label className="text-sm font-medium">Address</label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows={3}
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Customer Type</label>
              <EnumSelect
                options={customerTypeOptions}
                value={formData.type}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, type: value }))
                }
                placeholder="Select customer type"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Industry Type</label>
              <EnumSelect
                options={industryTypeOptions}
                value={formData.industryType}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, industryType: value }))
                }
                placeholder="Select industry type"
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
            <Button type="submit">Add Customer</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
