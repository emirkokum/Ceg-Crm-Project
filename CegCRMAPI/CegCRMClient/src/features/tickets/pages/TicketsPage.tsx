import { useState } from "react";
import {
  useTickets,
  useCreateTicket,
} from "@/features/hooks/useTicketApi";
import TicketTable from "../components/TicketTable";
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
import { useEmployees } from "@/features/hooks/useEmployeeApi";
import { Skeleton } from "@/components/ui/skeleton";
import SearchableSelect from "@/components/SearchableSelect";
import { Ticket } from "@/types/ticket";
import { Customer } from "@/types/customer";
import { TicketStatus } from "@/constants/enums";
import { EnumSelect } from "@/components/EnumSelect";

const ticketStatusOptions = [
  { value: TicketStatus.Open, label: "Open" },
  { value: TicketStatus.ResolvedByAI, label: "Resolved" },
  { value: TicketStatus.AssignedToEmployee, label: "Assigned" },
  { value: TicketStatus.Closed, label: "Closed" },
];

export default function TicketsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState<{
    customerId: string;
    assignedEmployeeId: string | null;
    status: number;
    description: string;
  }>({
    customerId: "",
    assignedEmployeeId: null,
    status: TicketStatus.Open,
    description: "",
  });

  const [statusFilter, setStatusFilter] = useState<number | null>(null);

  const { data: tickets = [], isLoading } = useTickets();
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomers();
  const { data: employees = [], isLoading: isLoadingEmployees } = useEmployees();
  const createTicket = useCreateTicket();

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
      await createTicket.mutateAsync(formData);
      toast.success("Ticket created successfully");
      setIsCreateModalOpen(false);
      setFormData({
        customerId: "",
        assignedEmployeeId: null,
        status: TicketStatus.Open,
        description: "",
      });
    } catch (error) {
      toast.error("Error creating ticket");
    }
  };

  if (isLoading || isLoadingCustomers || isLoadingEmployees) {
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

  const filteredTickets = tickets.filter((ticket: Ticket) => {
    if (statusFilter === null) return true;
    return ticket.status === statusFilter;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Tickets</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Ticket
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between mb-4">
        <EnumSelect
          options={[
            { value: 0, label: "All" },
            ...ticketStatusOptions
          ]}
          value={statusFilter ?? 0}
          onValueChange={(value) => setStatusFilter(value === 0 ? null : value)}
          placeholder="Filter by status"
        />
      </div>

      <TicketTable data={filteredTickets} />

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Ticket</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="text-sm font-medium">Customer</label>
                <SearchableSelect
                  options={customers.map((c: Customer) => ({
                    value: c.id,
                    label: `${c.firstName} ${c.lastName}`,
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

              <div>
                <label className="text-sm font-medium">Status</label>
                <EnumSelect
                  options={ticketStatusOptions}
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((f) => ({ ...f, status: value }))
                  }
                />
              </div>

              <div>
                <label className="text-sm font-medium">Assigned Employee</label>
                <Select
                  value={formData.assignedEmployeeId || "none"}
                  onValueChange={(val) =>
                    setFormData((f) => ({ ...f, assignedEmployeeId: val === "none" ? null : val }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Employee" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">None</SelectItem>
                    {employees.map((employee) => (
                      <SelectItem key={employee.id} value={employee.id}>
                        {employee.user?.firstName || ''} {employee.user?.lastName || ''}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="col-span-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={formData.description}
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
                disabled={createTicket.isPending}
              >
                {createTicket.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 