// src/features/customers/components/CustomerTable.tsx

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
import { Customer } from "@/types/customer";
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
import { useUpdateCustomer, useDeleteCustomer } from "@/features/hooks/userCustomerApi";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import { CustomerType, IndustryType } from "@/constants/enums";
import { EnumSelect } from "@/components/EnumSelect";

interface CustomerTableProps {
  data: Customer[];
}

interface UpdateFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  type: number;
  industryType: number;
}

export default function CustomerTable({ data }: CustomerTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [formData, setFormData] = useState<UpdateFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    type: CustomerType.Person,
    industryType: IndustryType.Technology,
  });

  const updateCustomer = useUpdateCustomer();
  const deleteCustomer = useDeleteCustomer();
  const navigate = useNavigate();

  const handleUpdate = (customer: Customer) => {
    setSelectedCustomer(customer);
    setFormData({
      firstName: customer.firstName || "",
      lastName: customer.lastName || "",
      email: customer.email || "",
      phone: customer.phone || "",
      address: customer.address || "",
      type: customer.type,
      industryType: customer.industryType,
    });
    setIsUpdateModalOpen(true);
  };

  const handleDeleteClick = (customer: Customer) => {
    setSelectedCustomer(customer);
    setIsDeleteModalOpen(true);
  };

  const handleDelete = async () => {
    if (!selectedCustomer) return;

    try {
      await deleteCustomer.mutateAsync(selectedCustomer.id);
      toast.success("Customer deleted successfully");
      setIsDeleteModalOpen(false);
    } catch (error) {
      toast.error("Error deleting customer");
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
    if (!selectedCustomer) return;

    try {
      await updateCustomer.mutateAsync({
        id: selectedCustomer.id,
        data: formData,
      });
      toast.success("Customer updated successfully");
      setIsUpdateModalOpen(false);
    } catch (error) {
      toast.error("Error updating customer");
    }
  };

  const handleRowClick = (customerId: string) => {
    navigate(`/customers/${customerId}`);
  };

  const getCustomerTypeLabel = (type: number) => {
    switch (type) {
      case CustomerType.Person:
        return "Person";
      case CustomerType.Business:
        return "Business";
      default:
        return "Unknown";
    }
  };

  const getCustomerTypeColor = (type: number) => {
    switch (type) {
      case CustomerType.Person:
        return "bg-blue-100 text-blue-800";
      case CustomerType.Business:
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const columns: ColumnDef<Customer>[] = [
    {
      accessorKey: "firstName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          First Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div 
            className="flex items-center gap-2 cursor-pointer hover:bg-muted/50 p-2 rounded-md"
            onClick={() => handleRowClick(customer.id)}
          >
            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center">
              <span className="text-sm font-medium">
                {customer.firstName?.[0]?.toUpperCase() || "?"}
              </span>
            </div>
            <span>{customer.firstName}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "lastName",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Last Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div 
            className="cursor-pointer hover:bg-muted/50 p-2 rounded-md"
            onClick={() => handleRowClick(customer.id)}
          >
            {customer.lastName}
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
        const customer = row.original;
        return (
          <div 
            className="cursor-pointer hover:bg-muted/50 p-2 rounded-md"
            onClick={() => handleRowClick(customer.id)}
          >
            <a href={`mailto:${customer.email}`} className="text-primary hover:underline">
              {customer.email}
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
        const customer = row.original;
        return (
          <div 
            className="cursor-pointer hover:bg-muted/50 p-2 rounded-md"
            onClick={() => handleRowClick(customer.id)}
          >
            <a href={`tel:${customer.phone}`} className="text-primary hover:underline">
              {customer.phone}
            </a>
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="font-semibold"
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const customer = row.original;
        return (
          <div className="p-2">
            <span className={`px-2 py-1 rounded-full text-sm ${getCustomerTypeColor(customer.type)}`}>
              {getCustomerTypeLabel(customer.type)}
            </span>
          </div>
        );
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const customer = row.original;
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
                onClick={() => handleUpdate(customer)}
                className="cursor-pointer"
              >
                <Pencil className="mr-2 h-4 w-4" />
                Update
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleDeleteClick(customer)}
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
                  No customers found.
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
            <DialogTitle>Update Customer</DialogTitle>
            <DialogDescription>
              Make changes to the customer information below.
            </DialogDescription>
          </DialogHeader>
          {selectedCustomer && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">First Name</label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Last Name</label>
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
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
                <div className="col-span-2 space-y-2">
                  <label className="text-sm font-medium">Address</label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleFormChange}
                    className="w-full p-2 border rounded"
                    rows={3}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Customer Type</label>
                  <EnumSelect
                    options={[
                      { value: CustomerType.Person, label: "Person" },
                      { value: CustomerType.Business, label: "Business" },
                    ]}
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
                    options={[
                      { value: IndustryType.Technology, label: "Technology" },
                      { value: IndustryType.Finance, label: "Finance" },
                      { value: IndustryType.Health, label: "Health" },
                      { value: IndustryType.Retail, label: "Retail" },
                      { value: IndustryType.Education, label: "Education" },
                      { value: IndustryType.Other, label: "Other" },
                    ]}
                    value={selectedCustomer.industryType}
                    onValueChange={(value) =>
                      setFormData((prev) => ({ ...prev, industryType: value }))
                    }
                    placeholder="Select industry type"
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
                  disabled={updateCustomer.isPending}
                >
                  {updateCustomer.isPending ? "Updating..." : "Update"}
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
            <DialogTitle>Delete Customer</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this customer? This action cannot be undone.
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
              disabled={deleteCustomer.isPending}
            >
              {deleteCustomer.isPending ? "Deleting..." : "Yes, Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
