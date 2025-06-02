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
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { MoreHorizontal, Pencil, Trash, Eye, ArrowUpDown } from "lucide-react";
import { useUpdateSale, useDeleteSale } from "@/features/hooks/useSaleApi";
import { Sale } from "@/types/sale";
import { toast } from "sonner";
import { format } from "date-fns";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  flexRender,
  SortingState,
} from "@tanstack/react-table";

interface SaleTableProps {
  data: Sale[];
}

interface UpdateFormData extends Omit<Sale, "id" | "createdDate" | "updatedDate" | "saleProducts"> {}

export default function SaleTable({ data }: SaleTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<UpdateFormData>({
    saleDate: "",
    customerId: "",
    salesPersonId: "",
    totalAmount: 0,
    discount: 0,
    tax: 0,
    finalAmount: 0,
    status: null,
    invoiceNumber: null,
  });

  const updateSale = useUpdateSale();
  const deleteSale = useDeleteSale();

  const handleUpdate = (sale: Sale) => {
    setSelectedSale(sale);
    setFormData({
      saleDate: sale.saleDate,
      customerId: sale.customerId,
      salesPersonId: sale.salesPersonId,
      totalAmount: sale.totalAmount,
      discount: sale.discount,
      tax: sale.tax,
      finalAmount: sale.finalAmount,
      status: sale.status,
      invoiceNumber: sale.invoiceNumber,
    });
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedSale) return;

    try {
      await deleteSale.mutateAsync(selectedSale.id);
      toast.success("Sale deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Error deleting sale");
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!selectedSale) return;

    try {
      await updateSale.mutateAsync({
        id: selectedSale.id,
        data: formData,
      });
      toast.success("Sale updated successfully");
      setIsUpdateModalOpen(false);
    } catch (error) {
      toast.error("Error updating sale");
    }
  };

  const columns: ColumnDef<Sale>[] = [
    {
      accessorKey: "saleDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0"
          >
            Sale Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.original.saleDate);
        return format(date, "dd/MM/yyyy");
      },
    },
    {
      accessorKey: "customerId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0"
          >
            Customer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => row.original.customerId,
    },
    {
      accessorKey: "salesPersonId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0"
          >
            Sales Person
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => row.original.salesPersonId,
    },
    {
      accessorKey: "totalAmount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0"
          >
            Total Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
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
    },
    {
      accessorKey: "invoiceNumber",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0"
          >
            Invoice Number
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const sale = row.original;

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
                onClick={() => handleUpdate(sale)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(sale)}
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
                  {header.isPlaceholder
                    ? null
                    : flexRender(
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
            <DialogTitle>Update Sale</DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="form-field">
                  <label className="text-sm font-medium">Sale Date</label>
                  <input
                    type="text"
                    name="saleDate"
                    value={formData.saleDate}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="form-field">
                  <label className="text-sm font-medium">Customer ID</label>
                  <input
                    type="text"
                    name="customerId"
                    value={formData.customerId}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="form-field">
                  <label className="text-sm font-medium">Sales Person ID</label>
                  <input
                    type="text"
                    name="salesPersonId"
                    value={formData.salesPersonId}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="form-field">
                  <label className="text-sm font-medium">Total Amount</label>
                  <input
                    type="number"
                    name="totalAmount"
                    value={formData.totalAmount}
                    onChange={(e) => handleFormChange({ ...e, target: { ...e.target, value: e.target.valueAsNumber.toString() } })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="form-field">
                  <label className="text-sm font-medium">Discount</label>
                  <input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={(e) => handleFormChange({ ...e, target: { ...e.target, value: e.target.valueAsNumber.toString() } })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="form-field">
                  <label className="text-sm font-medium">Tax</label>
                  <input
                    type="number"
                    name="tax"
                    value={formData.tax}
                    onChange={(e) => handleFormChange({ ...e, target: { ...e.target, value: e.target.valueAsNumber.toString() } })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="form-field">
                  <label className="text-sm font-medium">Final Amount</label>
                  <input
                    type="number"
                    name="finalAmount"
                    value={formData.finalAmount}
                    onChange={(e) => handleFormChange({ ...e, target: { ...e.target, value: e.target.valueAsNumber.toString() } })}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="form-field">
                  <label className="text-sm font-medium">Status</label>
                  <input
                    type="text"
                    name="status"
                    value={formData.status ?? ''}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="form-field">
                  <label className="text-sm font-medium">Invoice Number</label>
                  <input
                    type="text"
                    name="invoiceNumber"
                    value={formData.invoiceNumber ?? ''}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
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
                  disabled={updateSale.isPending}
                >
                  {updateSale.isPending ? "Updating..." : "Update"}
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
            <DialogTitle>Delete Sale</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this sale? This action cannot be undone.
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
              disabled={deleteSale.isPending}
            >
              {deleteSale.isPending ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
} 