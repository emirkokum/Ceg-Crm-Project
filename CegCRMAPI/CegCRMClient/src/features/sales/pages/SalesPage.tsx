import { useState, useMemo } from "react";
import SaleTable from "../components/SaleTable"; 
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSales, useCreateSale } from "@/features/hooks/useSaleApi";
import { CreateSale, SaleProductItem, SaleStatus } from "@/types/sale";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus, Search, Download, Receipt } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "sonner";
import DateTimePicker from "@/components/DateTimePicker";
import SearchableSelect from "@/components/SearchableSelect";
import { useCustomers } from "@/features/hooks/userCustomerApi"; 
import { useEmployees } from "@/features/hooks/useEmployeeApi";
import { useProducts } from "@/features/hooks/useProductApi";
import { useQueryClient } from "@tanstack/react-query";
import type { Customer } from "@/types/customer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function SalesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateSale>({
    saleDate: "",
    customerId: "",
    salesPersonId: "",
    totalAmount: 0,
    discount: 0,
    tax: 10, // Default 10% tax
    finalAmount: 0,
    status: null,
    invoiceNumber: null,
    products: [],
  });
  const [selectedProducts, setSelectedProducts] = useState<SaleProductItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const queryClient = useQueryClient();
  const { data, isLoading, isError } = useSales();
  const sales = data?.data?.data || [];
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomers();
  const { data: employees = [], isLoading: isLoadingEmployees } = useEmployees();
  const { data: products = [], isLoading: isLoadingProducts } = useProducts();
  const createSale = useCreateSale();

  // Add product to selectedProducts
  const handleAddProduct = (productId: string) => {
    const product = products.find((p) => p.id === productId);
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

  // Calculate totals
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

  useMemo(updateTotals, [selectedProducts, formData.discount, formData.tax]);

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleNumericFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, valueAsNumber } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: isNaN(valueAsNumber) ? 0 : valueAsNumber,
    }));
  };

  const handlePercentageChange = (field: "discount" | "tax", value: string) => {
    const numValue = parseFloat(value) || 0;
    const maxValue = field === "discount" ? 50 : 20;
    const clampedValue = Math.min(Math.max(numValue, 0), maxValue);
    setFormData((prev) => ({ ...prev, [field]: clampedValue }));
  };

  const handleSubmit = async () => {
    if (selectedProducts.length === 0) {
      toast.error("Please add at least one product to the sale.");
      return;
    }
    const saleData = {
      ...formData,
      products: selectedProducts,
      status: formData.status || "Pending"
    };
    try {
      await createSale.mutateAsync(saleData);
      toast.success("Sale created successfully");
      setIsCreateModalOpen(false);
      setFormData({
        saleDate: "",
        customerId: "",
        salesPersonId: "",
        totalAmount: 0,
        discount: 0,
        tax: 10, // Reset to 10% default
        finalAmount: 0,
        status: null,
        invoiceNumber: null,
        products: [],
      });
      setSelectedProducts([]);
      queryClient.invalidateQueries({ queryKey: ["sales"] });
    } catch (error) {
      toast.error("Error creating sale");
    }
  };

  const filteredSales = useMemo(() => {
    if (!Array.isArray(sales)) {
      return [];
    }
    return sales.filter((sale) => {
      // Find customer by sale.customerId
      const customer = customers.find((c: Customer) => c.id === sale.customerId);
      const customerName = customer ? (customer.fullName || `${customer.firstName ?? ''} ${customer.lastName ?? ''}`) : '';
      const matchesSearch = customerName.toLowerCase().includes(searchTerm.toLowerCase());
      // Convert status to string for comparison
      const saleStatusText = sale.status === SaleStatus.Pending ? "Pending" : 
                           sale.status === SaleStatus.Completed ? "Completed" : 
                           sale.status === SaleStatus.Cancelled ? "Cancelled" : "Pending";
      const matchesStatus = statusFilter === "" || saleStatusText === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [sales, searchTerm, statusFilter, customers]);

  const { subtotal, discountAmount, taxAmount, final } = calculateTotals();

  const handleExport = () => {
    toast.info("Export functionality coming soon!");
  };

  if (isLoading || isLoadingCustomers || isLoadingEmployees || isLoadingProducts) return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
        <Skeleton className="w-full md:w-1/2 h-10" />
        <div className="flex gap-2">
          <Skeleton className="w-32 h-10" />
          <Skeleton className="w-32 h-10" />
        </div>
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
        <Skeleton className="w-full md:w-48 h-10" />
      </div>
      <div className="space-y-2">
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
        <Skeleton className="w-full h-10" />
      </div>
    </div>
  );

  if (isError) return (
    <Card className="p-6">
      <CardContent className="flex flex-col items-center justify-center space-y-4">
        <div className="text-red-500 text-xl">Error fetching data</div>
        <Button variant="outline" onClick={() => window.location.reload()}>
          Try Again
        </Button>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="flex items-center gap-2">
          <Receipt className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Sales</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            <Plus className="mr-2 h-4 w-4" />
            New Sale
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="px-10 py-5">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by Customer Name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <Select
                onValueChange={(val) => setStatusFilter(val === "all" ? "" : val)}
                value={statusFilter || "all"}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-10 py-5">
          <SaleTable data={filteredSales} />
        </CardContent>
      </Card>

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Sale</DialogTitle>
          </DialogHeader>

          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 form-field">
                <label className="text-sm font-medium">Customer</label>
                <SearchableSelect
                  options={(customers as Customer[]).map((c) => ({
                    value: c.id,
                    label: c.fullName || `${c.firstName} ${c.lastName}`,
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

              <div className="col-span-2 form-field">
                <label className="text-sm font-medium">Sales Person</label>
                <SearchableSelect
                  options={employees.map((employee) => ({
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
                <label className="text-sm font-medium">Status</label>
                <Select
                  name="status"
                  value={formData.status || ''}
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
            </div>

            <div className="form-field">
              <label className="text-sm font-medium">Products</label>
              <div className="flex gap-2 mb-2">
                <SearchableSelect
                  options={products
                    .filter((p) => !selectedProducts.some((sp) => sp.productId === p.id))
                    .map((p) => ({ value: p.id, label: p.name }))}
                  value=""
                  onChange={handleAddProduct}
                  placeholder="Add product..."
                  searchable={true}
                />
              </div>
              <div className="space-y-2">
                {selectedProducts.map((sp) => {
                  const product = products.find((p) => p.id === sp.productId);
                  return (
                    <div key={sp.productId} className="flex items-center gap-2 border rounded p-2">
                      <span className="flex-1">{product?.name}</span>
                      <Input
                        type="number"
                        value={sp.quantity}
                        onChange={(e) => handleProductChange(sp.productId, "quantity", parseInt(e.target.value) || 1)}
                        className="w-20"
                        placeholder="Qty"
                      />
                      <Input
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
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Sale Summary</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between">
                    <span>Total Products:</span>
                    <span className="font-medium">{selectedProducts.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span className="font-medium">₺{subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Discount ({formData.discount}%):</span>
                    <span className="font-medium text-green-600">-₺{discountAmount.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Tax ({formData.tax}%):</span>
                    <span className="font-medium text-red-600">+₺{taxAmount.toFixed(2)}</span>
                  </div>
                  <div className="border-t pt-2 flex justify-between text-lg font-bold">
                    <span>Final Total:</span>
                    <span>₺{final.toFixed(2)}</span>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div className="form-field">
                <label className="text-sm font-medium">Discount (%)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={formData.discount}
                    onChange={(e) => handlePercentageChange("discount", e.target.value)}
                    min="0"
                    max="50"
                    step="0.1"
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground">0-50%</span>
                </div>
              </div>
              <div className="form-field">
                <label className="text-sm font-medium">Tax (%)</label>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={formData.tax}
                    onChange={(e) => handlePercentageChange("tax", e.target.value)}
                    min="0"
                    max="20"
                    step="0.1"
                    className="flex-1"
                  />
                  <span className="text-sm text-muted-foreground">0-20%</span>
                </div>
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
                disabled={createSale.isPending}
              >
                {createSale.isPending ? "Creating..." : "Create Sale"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 