import { useState, useEffect } from "react";
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
import { MoreHorizontal, Pencil, Trash, Eye, ArrowUpDown, Calendar, User, DollarSign, Package, Receipt } from "lucide-react";
import { useUpdateSale, useDeleteSale } from "@/features/hooks/useSaleApi";
import { Sale, SaleStatus } from "@/types/sale";
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
import { Badge } from "@/components/ui/badge";
import { useCustomers } from "@/features/hooks/userCustomerApi";
import { useEmployees } from "@/features/hooks/useEmployeeApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SearchableSelect from "@/components/SearchableSelect";
import { useProducts } from "@/features/hooks/useProductApi";
import DateTimePicker from "@/components/DateTimePicker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

interface SaleTableProps {
  data: Sale[];
}

interface UpdateFormData extends Omit<Sale, "id" | "createdDate" | "updatedDate" | "saleProducts" | "status"> {
  status: string | null;
}

export default function SaleTable({ data }: SaleTableProps) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
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
  const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

  const { data: customers = [] } = useCustomers();
  const { data: employees = [] } = useEmployees();
  const { data: products = [] } = useProducts();
  const updateSale = useUpdateSale();
  const deleteSale = useDeleteSale();

  const getStatusBadgeVariant = (status: SaleStatus | string | null) => {
    const statusValue = typeof status === 'number' ? status : String(status || "Pending");
    
    if (typeof statusValue === 'number') {
      switch (statusValue) {
        case SaleStatus.Pending:
          return "secondary"; 
        case SaleStatus.Completed:
          return "default"; 
        case SaleStatus.Cancelled:
          return "destructive"; 
        default:
          return "outline";
      }
    } else {
      switch (statusValue) {
        case "Pending":
          return "secondary"; 
        case "Completed":
          return "default"; 
        case "Cancelled":
          return "destructive"; 
        default:
          return "outline";
      }
    }
  };

  const getStatusText = (status: SaleStatus | string | null) => {
    const statusValue = typeof status === 'number' ? status : String(status || "Pending");
    
    if (typeof statusValue === 'number') {
      switch (statusValue) {
        case SaleStatus.Pending:
          return "Pending";
        case SaleStatus.Completed:
          return "Completed";
        case SaleStatus.Cancelled:
          return "Cancelled";
        default:
          return "Pending";
      }
    } else {
      return statusValue;
    }
  };

  const getCustomerName = (customerId: string) => {
    const customer = customers.find((c: any) => c.id === customerId);
    return customer ? (customer.fullName || `${customer.firstName} ${customer.lastName}`) : customerId;
  };

  const getSalespersonName = (salesPersonId: string) => {
    const employee = employees.find(e => e.id === salesPersonId);
    return employee ? `${employee.user.firstName || ''} ${employee.user.lastName || ''}`.trim() || employee.user.email : salesPersonId;
  };

  const handleRowClick = (sale: Sale) => {
    setSelectedSale(sale);
    setIsDetailModalOpen(true);
  };

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
      status: String(sale.status),
      invoiceNumber: sale.invoiceNumber,
    });
    setSelectedProducts(sale.saleProducts || []);
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

  const handleAddProduct = (productId: string) => {
    const product = products.find((p: any) => p.id === productId);
    if (!product) return;
    if (selectedProducts.some((sp) => sp.productId === productId)) return;
    setSelectedProducts([
      ...selectedProducts,
      {
        productId,
        quantity: 1,
        unitPrice: product.price,
      },
    ]);
  };

  const handleRemoveProduct = (productId: string) => {
    setSelectedProducts(selectedProducts.filter((sp) => sp.productId !== productId));
  };

  const handleProductChange = (productId: string, field: "quantity" | "unitPrice", value: number) => {
    setSelectedProducts((prev) =>
      prev.map((sp) =>
        sp.productId === productId ? { ...sp, [field]: value } : sp
      )
    );
  };

  const calculateTotals = () => {
    const subtotal = selectedProducts.reduce((sum, sp) => sum + sp.unitPrice * sp.quantity, 0);
    const discountAmount = subtotal * ((formData.discount || 0) / 100);
    const taxAmount = (subtotal - discountAmount) * ((formData.tax || 0) / 100);
    const final = subtotal - discountAmount + taxAmount;
    return { subtotal, discountAmount, taxAmount, final };
  };

  const updateTotals = () => {
    const { subtotal, final } = calculateTotals();
    setFormData((prev) => ({ ...prev, totalAmount: subtotal, finalAmount: final }));
  };

  useEffect(updateTotals, [selectedProducts, formData.discount, formData.tax]);

  const handleStatusChange = async (sale: Sale, newStatus: string) => {
    try {
      // Convert status string to number as expected by API
      const statusNumber = newStatus === "Pending" ? 0 : newStatus === "Completed" ? 1 : newStatus === "Cancelled" ? 2 : 0;
      
      await updateSale.mutateAsync({
        id: sale.id,
        data: {
          saleDate: sale.saleDate,
          customerId: sale.customerId,
          salesPersonId: sale.salesPersonId,
          totalAmount: sale.totalAmount,
          discount: sale.discount,
          tax: sale.tax,
          finalAmount: sale.finalAmount,
          status: statusNumber,
          invoiceNumber: sale.invoiceNumber,
        },
      });
      toast.success("Sale status updated successfully");
    } catch (error) {
      console.error("Status update error:", error);
      toast.error("Error updating sale status");
    }
  };

  const getNextStatus = (currentStatus: SaleStatus | string | null) => {
    const statusValue = typeof currentStatus === 'number' ? currentStatus : String(currentStatus || "Pending");
    
    if (typeof statusValue === 'number') {
      switch (statusValue) {
        case SaleStatus.Pending:
          return "Completed";
        case SaleStatus.Completed:
          return "Cancelled";
        case SaleStatus.Cancelled:
          return "Pending";
        default:
          return "Pending";
      }
    } else {
      switch (statusValue) {
        case "Pending":
          return "Completed";
        case "Completed":
          return "Cancelled";
        case "Cancelled":
          return "Pending";
        default:
          return "Pending";
      }
    }
  };

  const columns: ColumnDef<Sale>[] = [
    {
      accessorKey: "customerId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0 font-medium"
          >
            <User className="mr-2 h-4 w-4" />
            Customer
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span className="font-medium">{getCustomerName(row.original.customerId)}</span>
      ),
    },
    {
      accessorKey: "salesPersonId",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0 font-medium"
          >
            <User className="mr-2 h-4 w-4" />
            Salesperson
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => (
        <span className="text-sm text-muted-foreground">
          {getSalespersonName(row.original.salesPersonId)}
        </span>
      ),
    },
    {
      accessorKey: "saleDate",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0 font-medium"
          >
            <Calendar className="mr-2 h-4 w-4" />
            Sale Date
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const date = new Date(row.original.saleDate);
        return (
          <span className="text-sm">
            {format(date, "dd/MM/yyyy")}
          </span>
        );
      },
    },
    {
      accessorKey: "finalAmount",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
            className="px-0 pt-0 pb-0 font-medium"
          >
            <DollarSign className="mr-2 h-4 w-4" />
            Final Amount
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        return (
          <span className="font-semibold text-green-600">
            ₺{row.original.finalAmount.toFixed(2)}
          </span>
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
            className="px-0 pt-0 pb-0 font-medium"
          >
            Status
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        );
      },
      cell: ({ row }) => {
        const status = getStatusText(row.original.status);
        
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <div className="cursor-pointer">
                <Badge 
                  variant={getStatusBadgeVariant(row.original.status)} 
                  className="font-medium hover:opacity-80 transition-opacity"
                >
                  {status}
                </Badge>
              </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(row.original, "Pending");
                }}
              >
                <Badge variant="secondary" className="mr-2">Pending</Badge>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(row.original, "Completed");
                }}
              >
                <Badge variant="default" className="mr-2">Completed</Badge>
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={(e) => {
                  e.stopPropagation();
                  handleStatusChange(row.original, "Cancelled");
                }}
              >
                <Badge variant="destructive" className="mr-2">Cancelled</Badge>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
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
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleRowClick(sale); }}>
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleUpdate(sale); }}>
                <Pencil className="mr-2 h-4 w-4" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={(e) => { e.stopPropagation(); handleDeleteClick(sale); }}>
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
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
    },
  });

  return (
    <div className="space-y-4">
      <div className="rounded-md border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="bg-muted/50">
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead key={header.id} className="font-semibold">
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
                    className="cursor-pointer hover:bg-muted/30 transition-colors"
                    onClick={() => handleRowClick(row.original)}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3">
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
                    className="h-32 text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Receipt className="h-8 w-8 text-muted-foreground" />
                      <p className="text-muted-foreground font-medium">No sales found</p>
                      <p className="text-sm text-muted-foreground">Create your first sale to get started</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Sale Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              Sale Details
            </DialogTitle>
          </DialogHeader>
          {selectedSale && (
            <div className="space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sale Information</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Invoice Number</label>
                      <p className="text-sm font-mono mt-1">
                        {selectedSale.invoiceNumber || "N/A"}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Status</label>
                      <div className="mt-1">
                        <Badge variant={getStatusBadgeVariant(selectedSale.status)}>
                          {getStatusText(selectedSale.status)}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Customer</label>
                      <p className="text-sm font-medium mt-1">
                        {getCustomerName(selectedSale.customerId)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Salesperson</label>
                      <p className="text-sm mt-1">
                        {getSalespersonName(selectedSale.salesPersonId)}
                      </p>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-muted-foreground">Sale Date</label>
                      <p className="text-sm mt-1">
                        {format(new Date(selectedSale.saleDate), "dd/MM/yyyy HH:mm")}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Products */}
              {selectedSale.saleProducts && selectedSale.saleProducts.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Products</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {selectedSale.saleProducts.map((product, index) => (
                        <div key={index} className="flex justify-between items-center p-3 border rounded-lg bg-muted/30">
                          <div className="flex-1">
                            <span className="text-sm font-medium">{product.productName || `Product ${index + 1}`}</span>
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {product.quantity} x ₺{product.unitPrice} = ₺{product.totalPrice}
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* Financial Summary */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Financial Summary</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Subtotal:</span>
                      <span className="text-sm font-medium">₺{selectedSale.totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Discount ({selectedSale.discount}%):</span>
                      <span className="text-sm font-medium text-green-600">
                        -₺{(selectedSale.totalAmount * selectedSale.discount / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Tax ({selectedSale.tax}%):</span>
                      <span className="text-sm font-medium text-red-600">
                        +₺{((selectedSale.totalAmount - (selectedSale.totalAmount * selectedSale.discount / 100)) * selectedSale.tax / 100).toFixed(2)}
                      </span>
                    </div>
                    <div className="border-t pt-3 flex justify-between text-lg font-bold">
                      <span>Final Total:</span>
                      <span className="text-green-600">₺{selectedSale.finalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Update Modal */}
      <Dialog open={isUpdateModalOpen} onOpenChange={setIsUpdateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Sale</DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 form-field">
                <label className="text-sm font-medium">Customer</label>
                <SearchableSelect
                  options={customers.map((c: any) => ({
                    value: c.id,
                    label: c.fullName || `${c.firstName} ${c.lastName}`,
                  }))}
                  value={formData.customerId}
                  onChange={(val) => setFormData((f) => ({ ...f, customerId: val }))}
                  placeholder="Select customer"
                  emptyText="No customer matched."
                  searchable={true}
                />
              </div>
              <div className="col-span-2 form-field">
                <label className="text-sm font-medium">Sales Person</label>
                <SearchableSelect
                  options={employees.map((employee: any) => ({
                    value: employee.id,
                    label: employee.user.firstName && employee.user.lastName ? `${employee.user.firstName} ${employee.user.lastName}` : employee.user.email,
                  }))}
                  value={formData.salesPersonId}
                  onChange={(val) => setFormData((f) => ({ ...f, salesPersonId: val }))}
                  placeholder="Select sales person"
                  emptyText="No employee matched."
                  searchable={true}
                />
              </div>
              <div className="form-field">
                <label className="text-sm font-medium">Sale Date</label>
                <DateTimePicker
                  value={formData.saleDate}
                  onChange={(val) =>
                    setFormData((prev) => ({ ...prev, saleDate: val || '' }))
                  }
                  placeholder="Select date and time"
                />
              </div>
              <div className="form-field">
                <label className="text-sm font-medium">Invoice Number</label>
                <Input
                  type="text"
                  name="invoiceNumber"
                  value={formData.invoiceNumber || ""}
                  onChange={handleFormChange}
                />
              </div>
            </div>
            <div className="form-field">
              <label className="text-sm font-medium">Products</label>
              <div className="flex gap-2 mb-2">
                <SearchableSelect
                  options={products
                    .filter((p: any) => !selectedProducts.some((sp) => sp.productId === p.id))
                    .map((p: any) => ({ value: p.id, label: p.name }))}
                  value=""
                  onChange={handleAddProduct}
                  placeholder="Add product..."
                  searchable={true}
                />
              </div>
              <div className="space-y-2">
                {selectedProducts.map((sp) => {
                  const product = products.find((p: any) => p.id === sp.productId);
                  return (
                    <div key={sp.productId} className="flex items-center gap-2 border rounded p-2">
                      <span className="flex-1">{product?.name}</span>
                      <input
                        type="number"
                        value={sp.quantity}
                        onChange={(e) => handleProductChange(sp.productId, "quantity", parseInt(e.target.value) || 1)}
                        className="w-20"
                        placeholder="Qty"
                      />
                      <input
                        type="number"
                        value={sp.unitPrice}
                        onChange={(e) => handleProductChange(sp.productId, "unitPrice", parseInt(e.target.value) || 0)}
                        className="w-24"
                        placeholder="Unit Price"
                      />
                      <Button variant="destructive" size="sm" onClick={() => handleRemoveProduct(sp.productId)}>
                        Remove
                      </Button>
                    </div>
                  );
                })}
                {selectedProducts.length === 0 && <div className="text-muted-foreground text-sm">No products added.</div>}
              </div>
            </div>
            {/* Summary Box */}
            {selectedProducts.length > 0 && (
              <div className="border rounded p-4 space-y-2">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-medium">₺{calculateTotals().subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Discount ({formData.discount}%):</span>
                  <span className="font-medium text-green-600">-₺{calculateTotals().discountAmount.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax ({formData.tax}%):</span>
                  <span className="font-medium text-red-600">+₺{calculateTotals().taxAmount.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2 flex justify-between text-lg font-bold">
                  <span>Final Total:</span>
                  <span>₺{calculateTotals().final.toFixed(2)}</span>
                </div>
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="form-field">
                <label className="text-sm font-medium">Discount (%)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    name="discount"
                    value={formData.discount}
                    onChange={handleFormChange}
                    min="0"
                    max="50"
                    step="0.1"
                  />
                  <span className="text-sm text-muted-foreground">0-50%</span>
                </div>
              </div>
              <div className="form-field">
                <label className="text-sm font-medium">Tax (%)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    name="tax"
                    value={formData.tax}
                    onChange={handleFormChange}
                    min="0"
                    max="20"
                    step="0.1"
                  />
                  <span className="text-sm text-muted-foreground">0-20%</span>
                </div>
              </div>
            </div>
            <div className="form-field">
              <label className="text-sm font-medium">Status</label>
              <Select
                name="status"
                value={getStatusText(formData.status)}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, status: value || null }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsUpdateModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={async () => {
                if (!selectedSale) return;

                const { saleDate, customerId, salesPersonId, totalAmount, discount, tax, finalAmount, status, invoiceNumber } = formData;
                const statusNumber = status === "Pending" ? 0 : status === "Completed" ? 1 : status === "Cancelled" ? 2 : selectedSale.status;
                
                try {
                  await updateSale.mutateAsync({
                    id: selectedSale.id,
                    data: {
                      saleDate,
                      customerId,
                      salesPersonId,
                      totalAmount,
                      discount,
                      tax,
                      finalAmount,
                      status: statusNumber as unknown as SaleStatus,
                      invoiceNumber,
                    },
                  });
                  toast.success("Sale updated successfully");
                  setIsUpdateModalOpen(false);
                } catch (error) {
                  toast.error("Error updating sale");
                }
              }}>Save Changes</Button>
            </DialogFooter>
          </div>
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
            <Button variant="outline" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 