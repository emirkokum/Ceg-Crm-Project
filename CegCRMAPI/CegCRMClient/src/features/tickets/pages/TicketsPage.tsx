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
import { useEmployees } from "@/features/hooks/useEmployeeApi";
import { useAuth } from "@/contexts/AuthContext";
import { Skeleton } from "@/components/ui/skeleton";
import { Ticket } from "@/types/ticket";
import { TicketStatus } from "@/constants/enums";
import { EnumSelect } from "@/components/EnumSelect";
import { Ticket as TicketIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const ticketStatusOptions = [
  { value: TicketStatus.Open, label: "Open" },
  { value: TicketStatus.ResolvedByAI, label: "Resolved by AI" },
  { value: TicketStatus.AssignedToEmployee, label: "Assigned to Employee" },
  { value: TicketStatus.Closed, label: "Closed" },
];

export default function TicketsPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState<{
    assignedEmployeeId: string | null;
    status: number;
    description: string;
  }>({
    assignedEmployeeId: null,
    status: TicketStatus.Open,
    description: "",
  });

  const [statusFilter, setStatusFilter] = useState<number | null>(null);
  const [assignmentFilter, setAssignmentFilter] = useState<"all" | "myTickets">("all");

  const { data: tickets = [], isLoading } = useTickets();
  const { data: employees = [], isLoading: isLoadingEmployees } = useEmployees();
  const { userInfo } = useAuth();
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
      await createTicket.mutateAsync({
        description: formData.description,
      });
      toast.success("Ticket created successfully");
      setIsCreateModalOpen(false);
      setFormData({
        assignedEmployeeId: null,
        status: TicketStatus.Open,
        description: "",
      });
    } catch (error) {
      toast.error("Error creating ticket");
    }
  };

  if (isLoading || isLoadingEmployees) {
    return (
      <div className="space-y-6 p-6">
        <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
          <Skeleton className="w-full md:w-1/2 h-10" />
          <Skeleton className="w-32 h-10" />
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

  // Find current user's employee record
  const currentUserEmployee = employees.find(emp => emp.user.id === userInfo?.id);

  const filteredTickets = tickets.filter((ticket: Ticket) => {
    // Status filter
    if (statusFilter !== null) {
      if (typeof ticket.status === 'string') {
        const statusMap: { [key: number]: string } = {
          [TicketStatus.Open]: 'Open',
          [TicketStatus.ResolvedByAI]: 'ResolvedByAI',
          [TicketStatus.AssignedToEmployee]: 'AssignedToEmployee',
          [TicketStatus.Closed]: 'Closed'
        };
        if (statusMap[statusFilter] !== ticket.status) {
          return false;
        }
      } else {
        if (ticket.status !== statusFilter) {
          return false;
        }
      }
    }
    
    // Assignment filter
    if (assignmentFilter === "myTickets") {
      if (!currentUserEmployee || !ticket.assignedEmployeeId) {
        return false;
      }
      return ticket.assignedEmployeeId === currentUserEmployee.id;
    }
    
    return true;
  });

  return (
    <div className="space-y-6 p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <TicketIcon className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Tickets</h1>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Ticket
          </Button>
        </div>
      </div>

      {/* Filter Bar */}
      <Card>
        <CardContent className="px-10 py-5">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between mb-4">
            <div className="flex flex-col md:flex-row gap-4 w-full">
              <div className="relative w-full md:w-1/2">
                <EnumSelect
                  options={[
                    { value: 0, label: "All Status" },
                    ...ticketStatusOptions
                  ]}
                  value={statusFilter ?? 0}
                  onValueChange={(value) => setStatusFilter(value === 0 ? null : value)}
                  placeholder="Filter by status"
                />
              </div>
              <div className="relative w-full md:w-1/2">
                <Select
                  value={assignmentFilter}
                  onValueChange={(value: "all" | "myTickets") => setAssignmentFilter(value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by assignment" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Tickets</SelectItem>
                    <SelectItem value="myTickets">My Tickets</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Ticket Table */}
      <Card>
        <CardContent className="px-10 py-5">
          <TicketTable data={filteredTickets} />
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New Ticket</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
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