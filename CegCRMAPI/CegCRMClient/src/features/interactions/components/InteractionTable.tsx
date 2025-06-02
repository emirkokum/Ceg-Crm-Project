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
import { Interaction } from "@/types/interaction";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash, Eye, CalendarIcon, ArrowUpDown } from "lucide-react";
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
  useUpdateInteraction,
  useDeleteInteraction,
} from "@/features/hooks/useInteractionApi";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import DateTimePicker from "@/components/DateTimePicker";

interface InteractionTableProps {
  data: Interaction[];
}

interface UpdateFormData {
  customerId: string;
  type: string;
  content: string;
  interactionDate: string;
}

export default function InteractionTable({ data }: InteractionTableProps) {
  const [sorting, setSorting] = useState<SortingState>([
    {
      id: "interactionDate",
      desc: true
    }
  ]);

  const [selectedInteraction, setSelectedInteraction] =
    useState<Interaction | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInspectModalOpen, setIsInspectModalOpen] = useState(false);
  const [selectedInteractionForInspect, setSelectedInteractionForInspect] =
    useState<Interaction | null>(null);
  const [formData, setFormData] = useState<UpdateFormData>({
    customerId: "",
    type: "",
    content: "",
    interactionDate: "",
  });

  const updateInteraction = useUpdateInteraction();
  const deleteInteraction = useDeleteInteraction();

  const handleUpdate = (interaction: Interaction) => {
    setSelectedInteraction(interaction);
    setFormData({
      customerId: interaction.customerId,
      type: interaction.type,
      content: interaction.content,
      interactionDate: interaction.interactionDate,
    });
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (interaction: Interaction) => {
    setSelectedInteraction(interaction);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedInteraction) return;

    try {
      await deleteInteraction.mutateAsync(selectedInteraction.id);
      toast.success("Interaction deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Error deleting interaction");
    }
  };

  const handleInspectClick = (interaction: Interaction) => {
    setSelectedInteractionForInspect(interaction);
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
    if (!selectedInteraction) return;

    try {
      await updateInteraction.mutateAsync({
        id: selectedInteraction.id,
        data: formData as Omit<Interaction, "id">,
      });
      toast.success("Interaction updated successfully");
      setIsUpdateModalOpen(false);
    } catch (error) {
      toast.error("Error updating interaction");
    }
  };

  const columns: ColumnDef<Interaction>[] = [
    {
      accessorKey: "customerFullName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0"
          >
            Customer Full Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => row.original.customerFullName,
    },
    {
      accessorKey: "type",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0"
          >
            Type
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
       cell: ({ row }) => row.original.type,
    },
    {
      accessorKey: "content",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0"
          >
            Content
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const content: string = row.getValue("content");
        const truncatedContent =
          content.length > 50 ? content.substring(0, 50) + "..." : content;
        return <span>{truncatedContent}</span>;
      },
    },
    {
      accessorKey: "interactionDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0"
          >
            Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.original.interactionDate);
        return format(date, "dd/MM/yyyy");
      },
    },
    {
      id: "inspect",
      header: "Inspect",
      cell: ({ row }) => {
        const interaction = row.original;
        return (
          <Button
            variant="ghost"
            className="h-8 w-8 p-0"
            onClick={() => handleInspectClick(interaction)}
          >
            <Eye className="h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const interaction = row.original;

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
                onClick={() => handleUpdate(interaction)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(interaction)}
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
            <DialogTitle>Update Interaction</DialogTitle>
          </DialogHeader>
          {selectedInteraction && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Type</label>
                  <Select
                    value={formData.type}
                    onValueChange={(val) =>
                      setFormData((f) => ({ ...f, type: val }))
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select Type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Email">Email</SelectItem>
                      <SelectItem value="Phone">Telefon</SelectItem>
                      <SelectItem value="Meeting">Toplantı</SelectItem>
                      <SelectItem value="Other">Diğer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <label className="text-sm font-medium">Date</label>
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
                  onClick={() => setIsUpdateModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={updateInteraction.isPending}
                >
                  {updateInteraction.isPending ? "Updating..." : "Update"}
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
            <DialogTitle>Delete Interaction</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this interaction? This action cannot be undone.
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
              disabled={deleteInteraction.isPending}
            >
              {deleteInteraction.isPending ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inspect Modal */}
      <Dialog open={isInspectModalOpen} onOpenChange={setIsInspectModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="text-xl">Interaction Details</DialogTitle>
          </DialogHeader>

          {selectedInteractionForInspect && (
            <div className="space-y-4 text-sm">
              <div className="space-y-1">
                <p className="text-muted-foreground">Type</p>
                <div className="bg-muted px-3 py-2 rounded">
                  {selectedInteractionForInspect.type}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground">Content</p>
                <div className="bg-muted px-3 py-2 rounded whitespace-pre-wrap">
                  {selectedInteractionForInspect.content}
                </div>
              </div>

              <div className="space-y-1">
                <p className="text-muted-foreground">Date</p>
                <div className="bg-muted px-3 py-2 rounded">
                  {format(
                    new Date(selectedInteractionForInspect.interactionDate),
                    "dd.MM.yyyy HH:mm"
                  )}
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
