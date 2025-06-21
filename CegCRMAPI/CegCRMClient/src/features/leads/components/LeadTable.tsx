import { useState } from "react";
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Lead } from "@/types/lead";
import { UpdateLeadData } from "@/api/lead";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { useUpdateLead, useDeleteLead } from "@/features/hooks/useLeadApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { useEnum } from "@/features/hooks/useEnums";
import { EnumSelect } from "@/components/EnumSelect";

interface LeadTableProps {
  data: Lead[];
}

export function LeadTable({ data }: LeadTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<UpdateLeadData>({
    companyName: "",
    contactName: "",
    email: "",
    phone: "",
    source: 0,
    status: 0,
    industry: 0,
    notes:"",
  });

  const updateLead = useUpdateLead();
  const deleteLead = useDeleteLead();
  const navigate = useNavigate();
  const { data: leadStatusOptions } = useEnum("lead-status");
  const { data: leadSourceOptions } = useEnum("lead-source");
  const { data: industryTypeOptions } = useEnum("industry-type");

  const handleUpdate = (lead: Lead) => {
    setSelectedLead(lead);
    setFormData({
      companyName: lead.companyName || "",
      contactName: lead.contactName || "",
      email: lead.email || "",
      phone: lead.phone || "",
      source: lead.source,
      status: lead.status,
      industry: lead.industry,
      notes: lead.notes || "",
    });
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (lead: Lead) => {
    setSelectedLead(lead);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedLead) return;

    try {
      await deleteLead.mutateAsync(selectedLead.id);
      toast.success("Lead deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Error deleting lead");
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedLead) return;

    try {
      await updateLead.mutateAsync({
        id: selectedLead.id,
        data: formData,
      });
      toast.success("Lead updated successfully");
      setIsUpdateModalOpen(false);
    } catch (error) {
      toast.error("Error updating lead");
    }
  };

  const handleRowClick = (leadId: string) => {
    navigate(`/leads/${leadId}`);
  };

  const getStatusLabel = (status: number) => {
    const statusOption = leadStatusOptions?.find(option => option.value === status);
    return statusOption?.label || "Unknown";
  };

  const getStatusColor = (status: number) => {
    switch (status) {
      case 1: // New
        return "bg-blue-100 text-blue-800";
      case 2: // InProgress
        return "bg-yellow-100 text-yellow-800";
      case 3: // Contacted
        return "bg-purple-100 text-purple-800";
      case 4: // Qualified
        return "bg-green-100 text-green-800";
      case 5: // Lost
        return "bg-red-100 text-red-800";
      case 6: // Converted
        return "bg-emerald-100 text-emerald-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns: ColumnDef<Lead>[] = [
    {
      accessorKey: "companyName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Company
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div 
            className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md"
            onClick={() => handleRowClick(lead.id)}
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium">
                {lead.companyName?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
            <span>{lead.companyName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "contactName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Contact
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div 
            className="cursor-pointer hover:bg-muted/50 p-2 rounded-md"
            onClick={() => handleRowClick(lead.id)}
          >
            {lead.contactName}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div 
            className="cursor-pointer hover:bg-muted/50 p-2 rounded-md"
            onClick={() => handleRowClick(lead.id)}
          >
            <a href={`mailto:${lead.email}`} className="text-primary hover:underline">
              {lead.email}
            </a>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Phone
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div 
            className="cursor-pointer hover:bg-muted/50 p-2 rounded-md"
            onClick={() => handleRowClick(lead.id)}
          >
            <a href={`tel:${lead.phone}`} className="text-primary hover:underline">
              {lead.phone}
            </a>
          </div>
        );
      },
    },
    {
      accessorKey: "source",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Source
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="p-2">
            {leadSourceOptions?.find(option => option.value === lead.source)?.label || "Unknown"}
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="p-2">
            <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(lead.status)}`}>
              {getStatusLabel(lead.status)}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "industry",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Industry
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const lead = row.original;
        return (
          <div className="p-2">
            {industryTypeOptions?.find(option => option.value === lead.industry)?.label || "Unknown"}
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const lead = row.original;
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
                onClick={() => handleUpdate(lead)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(lead)}
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
  });

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length === 0 ? (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No leads found.
                </TableCell>
              </TableRow>
            ) : (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Update Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Update Lead</DialogTitle>
            <DialogDescription>
              Make changes to the lead information below.
            </DialogDescription>
          </DialogHeader>
          {selectedLead && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Company Name</label>
                  <input
                    type="text"
                    name="companyName"
                    value={formData.companyName}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Contact Name</label>
                  <input
                    type="text"
                    name="contactName"
                    value={formData.contactName}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Phone</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
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
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                    rows={3}
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
                  disabled={updateLead.isPending}
                >
                  {updateLead.isPending ? "Updating..." : "Update"}
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
            <DialogTitle>Delete Lead</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this lead? This action cannot be undone.
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
              disabled={deleteLead.isPending}
            >
              {deleteLead.isPending ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 