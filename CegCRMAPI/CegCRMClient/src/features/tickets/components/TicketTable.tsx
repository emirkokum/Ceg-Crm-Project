import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  getFilteredRowModel,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Ticket } from "@/types/ticket";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, Eye, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  useUpdateTicket,
  useDeleteTicket,
  useAssignTicket,
  useUpdateTicketStatus,
} from "@/features/hooks/useTicketApi";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEmployees } from "@/features/hooks/useEmployeeApi";
import { useUsers } from "@/features/hooks/useUserApi";
import { Badge } from "@/components/ui/badge";
import { TicketStatus } from "@/constants/enums";
import { EnumSelect } from "@/components/EnumSelect";

const ticketStatusOptions = [
  { value: TicketStatus.Open, label: "Open" },
  { value: TicketStatus.ResolvedByAI, label: "Resolved by AI" },
  { value: TicketStatus.AssignedToEmployee, label: "Assigned to Employee" },
  { value: TicketStatus.Closed, label: "Closed" },
];

interface TicketTableProps {
  data: Ticket[];
}

interface UpdateFormData {
  assignedEmployeeId: string | null;
  status: number;
  description: string;
}

export default function TicketTable({ data }: TicketTableProps) {
  const navigate = useNavigate();
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
  const [selectedTicketForInspect, setSelectedTicketForInspect] =
    useState<Ticket | null>(null);
  const [formData, setFormData] = useState<UpdateFormData>({
    assignedEmployeeId: null,
    status: TicketStatus.Open,
    description: "",
  });

  const { data: employees = [] } = useEmployees();
  const { data: users = [] } = useUsers();
  const updateTicket = useUpdateTicket();
  const deleteTicket = useDeleteTicket();
  const assignTicket = useAssignTicket();
  const updateTicketStatus = useUpdateTicketStatus();

  const handleUpdate = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setFormData({
      assignedEmployeeId: ticket.assignedEmployeeId,
      status: typeof ticket.status === 'string' ? 
        (ticket.status === 'Open' ? TicketStatus.Open :
         ticket.status === 'ResolvedByAI' ? TicketStatus.ResolvedByAI :
         ticket.status === 'AssignedToEmployee' ? TicketStatus.AssignedToEmployee :
         ticket.status === 'Closed' ? TicketStatus.Closed : TicketStatus.Open) : ticket.status,
      description: ticket.description,
    });
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedTicket) return;

    try {
      await deleteTicket.mutateAsync(selectedTicket.id);
      toast.success("Ticket deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Error deleting ticket");
    }
  };

  const handleInspectClick = (ticket: Ticket) => {
    navigate(`/tickets/${ticket.id}`);
  };

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
    if (!selectedTicket) return;

    try {
      await updateTicket.mutateAsync({
        id: selectedTicket.id,
        data: {
          assignedEmployeeId: formData.assignedEmployeeId,
          status: formData.status,
          description: formData.description,
        },
      });
      toast.success("Ticket updated successfully");
      setIsUpdateModalOpen(false);
    } catch (error) {
      toast.error("Error updating ticket");
    }
  };

  const getStatusColor = (status: number | string) => {
    if (typeof status === 'string') {
      switch (status) {
        case 'Open':
          return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
        case 'ResolvedByAI':
          return "bg-green-100 text-green-800 hover:bg-green-100";
        case 'AssignedToEmployee':
          return "bg-blue-100 text-blue-800 hover:bg-blue-100";
        case 'Closed':
          return "bg-gray-100 text-gray-800 hover:bg-gray-100";
        default:
          return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      }
    }

    switch (status) {
      case TicketStatus.Open:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case TicketStatus.ResolvedByAI:
        return "bg-green-100 text-green-800 hover:bg-green-100";
      case TicketStatus.AssignedToEmployee:
        return "bg-blue-100 text-blue-800 hover:bg-blue-100";
      case TicketStatus.Closed:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-100";
    }
  };

  const getStatusLabel = (status: number | string) => {
    if (typeof status === 'string') {
      switch (status) {
        case 'Open':
          return "Open";
        case 'ResolvedByAI':
          return "Resolved by AI";
        case 'AssignedToEmployee':
          return "Assigned to Employee";
        case 'Closed':
          return "Closed";
        default:
          return "Unknown";
      }
    }

    switch (status) {
      case TicketStatus.Open:
        return "Open";
      case TicketStatus.ResolvedByAI:
        return "Resolved by AI";
      case TicketStatus.AssignedToEmployee:
        return "Assigned to Employee";
      case TicketStatus.Closed:
        return "Closed";
      default:
        return "Unknown";
    }
  };

  const handleStatusChange = async (ticketId: string, newStatus: number) => {
    try {
      await updateTicketStatus.mutateAsync({ ticketId, newStatus });
      toast.success("Ticket status updated successfully");
    } catch (error) {
      toast.error("Error updating ticket status");
    }
  };

  const columns: ColumnDef<Ticket>[] = [
    {
      accessorKey: "status",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = row.getValue("status") as number | string;
        const ticket = row.original;
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Badge 
                variant="secondary" 
                className={`${getStatusColor(status)} cursor-pointer hover:opacity-80`}
              >
                {getStatusLabel(status)}
              </Badge>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {ticketStatusOptions.map((option) => (
                <DropdownMenuItem
                  key={option.value}
                  onClick={() => handleStatusChange(ticket.id, option.value)}
                  className="cursor-pointer"
                >
                  <Badge variant="secondary" className={getStatusColor(option.value)}>
                    {option.label}
                  </Badge>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "userId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0"
          >
            User
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const userId = row.getValue("userId") as string;
        const user = users.find(u => u.id === userId);
        return (
          <span>
            {user ? `${user.firstName} ${user.lastName}` : 'Unknown User'}
          </span>
        );
      },
    },
    {
      accessorKey: "description",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0"
          >
            Description
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const description: string = row.getValue("description");
        const truncatedDescription =
          description.length > 50 ? description.substring(0, 50) + "..." : description;
        return <span>{truncatedDescription}</span>;
      },
    },
    {
      id: "inspect",
      header: "Inspect",
      cell: ({ row }) => {
        const ticket = row.original;
        return (
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => handleInspectClick(ticket)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const ticket = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => handleUpdate(ticket)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(ticket)}
                className="cursor-pointer text-red-600"
              >
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Ticket</DialogTitle>
            <DialogDescription>
              Make changes to the ticket here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="status" className="text-right">
                Status
              </label>
              <div className="col-span-3">
                <EnumSelect
                  options={ticketStatusOptions}
                  value={formData.status}
                  onValueChange={(value) =>
                    setFormData((prev) => ({
                      ...prev,
                      status: value,
                    }))
                  }
                />
              </div>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="assignedEmployeeId" className="text-right">
                Assign Employee
              </label>
              <Select
                name="assignedEmployeeId"
                value={formData.assignedEmployeeId || "none"}
                onValueChange={(value) =>
                  setFormData((prev) => ({
                    ...prev,
                    assignedEmployeeId: value === "none" ? null : value,
                  }))
                }
              >
                <SelectTrigger className="col-span-3">
                  <SelectValue placeholder="Select employee" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">None</SelectItem>
                  {employees.map((employee) => (
                    <SelectItem key={employee.id} value={employee.id}>
                      {employee.user.firstName} {employee.user.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <label htmlFor="description" className="text-right">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleFormChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleSubmit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Ticket</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ticket? This action cannot be
              undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isInspectModalOpen} onOpenChange={setIsInspectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ticket Details</DialogTitle>
          </DialogHeader>
          {selectedTicketForInspect && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right font-medium">Status</label>
                <div className="col-span-3">
                  <Badge variant="secondary" className={getStatusColor(selectedTicketForInspect.status)}>
                    {getStatusLabel(selectedTicketForInspect.status)}
                  </Badge>
                </div>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right font-medium">Description</label>
                <div className="col-span-3">
                  {selectedTicketForInspect.description}
                </div>
              </div>
              {selectedTicketForInspect.aiSuggestedSolution && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right font-medium">AI Solution</label>
                  <div className="col-span-3">
                    {selectedTicketForInspect.aiSuggestedSolution}
                  </div>
                </div>
              )}
              {selectedTicketForInspect.finalSolution && (
                <div className="grid grid-cols-4 items-center gap-4">
                  <label className="text-right font-medium">Final Solution</label>
                  <div className="col-span-3">
                    {selectedTicketForInspect.finalSolution}
                  </div>
                </div>
              )}
              <div className="grid grid-cols-4 items-center gap-4">
                <label className="text-right font-medium">Assigned Employee</label>
                <div className="col-span-3">
                  {selectedTicketForInspect.assignedEmployeeId
                    ? employees.find(
                        (e) => e.id === selectedTicketForInspect.assignedEmployeeId
                      )?.user.firstName +
                      " " +
                      employees.find(
                        (e) => e.id === selectedTicketForInspect.assignedEmployeeId
                      )?.user.lastName
                    : "Not assigned"}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
} 