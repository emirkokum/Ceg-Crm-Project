import { useState } from "react";
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
import { Employee } from "@/types/employee";
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
import { useCustomers } from "@/features/hooks/userCustomerApi";

interface TicketTableProps {
  data: Ticket[];
}

interface UpdateFormData {
  customerId: string;
  assignedEmployeeId: string | null;
  status: string;
  description: string;
  solution: string;
}

export default function TicketTable({ data }: TicketTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
  const [selectedTicketForInspect, setSelectedTicketForInspect] =
    useState<Ticket | null>(null);
  const [formData, setFormData] = useState<UpdateFormData>({
    customerId: "",
    assignedEmployeeId: null,
    status: "",
    description: "",
    solution: "",
  });

  const { data: employees = [] } = useEmployees();
  const { data: customers = [] } = useCustomers();
  const updateTicket = useUpdateTicket();
  const deleteTicket = useDeleteTicket();

  const handleUpdate = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setFormData({
      customerId: ticket.customerId,
      assignedEmployeeId: ticket.assignedEmployeeId,
      status: ticket.status,
      description: ticket.description,
      solution: ticket.solution,
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
    setSelectedTicketForInspect(ticket);
    setIsInspectModalOpen(true);
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
        data: formData as Omit<Ticket, "id">,
      });
      toast.success("Ticket updated successfully");
      setIsUpdateModalOpen(false);
    } catch (error) {
      toast.error("Error updating ticket");
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
      cell: ({ row }) => row.original.status,
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
      accessorKey: "solution",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0"
          >
            Solution
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const solution: string = row.getValue("solution");
        const truncatedSolution =
          solution.length > 50 ? solution.substring(0, 50) + "..." : solution;
        return <span>{truncatedSolution}</span>;
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
    state: {
      sorting,
    },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  return (
    <>
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <TableHead key={header.id}>
                  {flexRender(
                    header.column.columnDef.header,
                    header.getContext()
                  )}
                </TableHead>
              ))}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows.map((row) => (
            <TableRow key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <TableCell key={cell.id}>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Update Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Ticket</DialogTitle>
          </DialogHeader>
          {selectedTicket && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Status</label>
                  <Select
                    value={formData.status}
                    onValueChange={(val) =>
                      setFormData((f) => ({ ...f, status: val }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Open">Open</SelectItem>
                      <SelectItem value="In Progress">In Progress</SelectItem>
                      <SelectItem value="Resolved">Resolved</SelectItem>
                      <SelectItem value="Closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium">Assigned Employee</label>
                  <Select
                    value={formData.assignedEmployeeId || ""}
                    onValueChange={(val) =>
                      setFormData((f) => ({ ...f, assignedEmployeeId: val }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Employee" />
                    </SelectTrigger>
                    <SelectContent>
                      {employees.map((employee) => (
                        <SelectItem key={employee.id} value={employee.id}>
                          {employee.user.firstName} {employee.user.lastName}
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

                <div className="col-span-2">
                  <label className="text-sm font-medium">Solution</label>
                  <textarea
                    name="solution"
                    value={formData.solution}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                    rows={4}
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsUpdateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={updateTicket.isPending}
                >
                  {updateTicket.isPending ? "Updating..." : "Update"}
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Ticket</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this ticket? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteModalOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteTicket.isPending}
            >
              {deleteTicket.isPending ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inspect Modal */}
      <Dialog open={isInspectModalOpen} onOpenChange={setIsInspectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Ticket Details</DialogTitle>
          </DialogHeader>

          {selectedTicketForInspect && (
            <div className="space-y-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Status</p>
                <div className="bg-muted px-3 py-2 rounded">
                  {selectedTicketForInspect.status}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground">Description</p>
                <div className="bg-muted px-3 py-2 rounded whitespace-pre-wrap">
                  {selectedTicketForInspect.description}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground">Solution</p>
                <div className="bg-muted px-3 py-2 rounded whitespace-pre-wrap">
                  {selectedTicketForInspect.solution}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
} 