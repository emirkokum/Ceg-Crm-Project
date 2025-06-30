import { useState } from "react";
import {
  useInteractions,
  useCreateInteraction,
} from "@/features/hooks/useInteractionApi";
import InteractionTable from "../components/InteractionTable";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCustomers } from "@/features/hooks/userCustomerApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import SearchableSelect from "@/components/SearchableSelect";
import DateTimePicker from "@/components/DateTimePicker";
import { InteractionsOverviewCard } from "@/components/dashboard/InteractionsOverviewCard";

export default function InteractionsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    customerId: "",
    type: "",
    content: "",
    interactionDate: "",
  });

  const [customerNameFilter, setCustomerNameFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const { data: interactions = [], isLoading } = useInteractions();
  const { data: customers = [], isLoading: isLoadingCustomers } =
    useCustomers();
  const createInteraction = useCreateInteraction();

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      await createInteraction.mutateAsync(formData);
      toast.success("Interaction created successfully");
      setIsCreateModalOpen(false);
      setFormData({
        customerId: "",
        type: "",
        content: "",
        interactionDate: "",
      });
    } catch (error) {
      console.error("Error creating interaction:", error);
      toast.error("Error creating interaction");
    }
  };

  if (isLoading || isLoadingCustomers) {
    return (
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <Skeleton className="h-8 w-32" />
          <Skeleton className="h-10 w-32" />
        </div>
        <div className="space-y-2">
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
          <Skeleton className="w-full h-10" />
        </div>
      </div>
    );
  }

  const filteredInteractions = interactions.filter((interaction) => {
    const customerName = interaction.customerFullName ?? "";
    const type = interaction.type ?? "";

    const matchesCustomerName = customerName
      .toLowerCase()
      .includes(customerNameFilter.toLowerCase());
    const matchesType = typeFilter === "" || type === Number(typeFilter);

    return matchesCustomerName && matchesType;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Interactions</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Interaction
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between mb-4">
        <Input
          placeholder="Search With Name..."
          value={customerNameFilter}
          onChange={(e) => setCustomerNameFilter(e.target.value)}
          className="w-full md:w-1/2"
        />
        <Select
          onValueChange={(val) => setTypeFilter(val === "all" ? "" : val)}
          value={typeFilter || "all"}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Email">Email</SelectItem>
            <SelectItem value="Phone">Phone</SelectItem>
            <SelectItem value="Meeting">Meeting</SelectItem>
            <SelectItem value="Other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <InteractionTable data={filteredInteractions} />

      {/* Overview Card with filtered data */}
      <InteractionsOverviewCard 
        interactions={interactions}
        title="Interactions With Customers"
        description="General view to Interactions"
        showDistribution={true}
        filterByDate={false}
        isLoading={isLoading || isLoadingCustomers} 
      />

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Interaction</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium">Customer</label>
                <SearchableSelect
                  options={customers.map((c: { id: string; fullName: string }) => ({
                    value: c.id,
                    label: c.fullName,
                  }))}
                  value={formData.customerId}
                  onChange={(val) =>
                    setFormData((f) => ({ ...f, customerId: val }))
                  }
                  placeholder="Select customer"
                  emptyText="No customer matched."
                  searchable={true}
                />
              </div>

              <div className="flex-1">
                <label className="text-sm font-medium">Type</label>
                <Select
                  name="type"
                  value={formData.type}
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Email">Email</SelectItem>
                    <SelectItem value="Phone">Phone</SelectItem>
                    <SelectItem value="Meeting">Meeting</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-1">
                <div className="flex-1">
                  <label className="text-sm font-medium mb-1 block">Date</label>
                  <DateTimePicker
                    value={formData.interactionDate}
                    onChange={(val) =>
                      setFormData((prev) => ({
                        ...prev,
                        interactionDate: val,
                      }))
                    }
                    placeholder="Select date and time"
                  />
                </div>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">Content</label>
                <textarea
                  name="content"
                  value={formData.content}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded"
                  rows={4}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setIsCreateModalOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={createInteraction.isPending}
              >
                {createInteraction.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
