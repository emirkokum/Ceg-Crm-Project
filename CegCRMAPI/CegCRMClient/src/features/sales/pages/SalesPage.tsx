import { useState, useMemo } from "react";
import SaleTable from "../components/SaleTable"; // Assuming SaleTable is default export
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useSales, useCreateSale } from "@/features/hooks/useSaleApi";
import { Sale, CreateSale } from "@/types/sale";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
// Assuming you have or will create a DateTimePicker component at this path
import DateTimePicker from "@/components/DateTimePicker";
// Assuming you have or will create a SearchableSelect component for Customers and Users
import SearchableSelect from "@/components/SearchableSelect";
import { useCustomers } from "@/features/hooks/userCustomerApi"; // Assuming hook for customers
import { useUsers } from "@/features/hooks/useUserApi"; // Assuming hook for users
import { Textarea } from "@/components/ui/textarea"; // Assuming Textarea component

export function SalesPage() {
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [formData, setFormData] = useState<CreateSale>({
    saleDate: "",
    customerId: "",
    salesPersonId: "",
    totalAmount: 0,
    discount: 0,
    tax: 0,
    finalAmount: 0,
    status: null,
    invoiceNumber: null,
    products: [], // Assuming products are handled separately or not in this modal
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const { data: sales = [], isLoading, isError } = useSales();
  const { data: customers = [], isLoading: isLoadingCustomers } = useCustomers();
  const { data: users = [], isLoading: isLoadingUsers } = useUsers();
  const createSale = useCreateSale();

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

   const handleNumericFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, valueAsNumber } = e.target;
     if (!isNaN(valueAsNumber)) {
      setFormData((prev) => ({
        ...prev,
        [name]: valueAsNumber,
      }));
     }
  };


  const handleSubmit = async () => {
    try {
      // Note: Handling products in create sale is not included in this basic modal
      await createSale.mutateAsync(formData);
      toast.success("Sale created successfully");
      setIsCreateModalOpen(false);
      setFormData({
        saleDate: "",
        customerId: "",
        salesPersonId: "",
        totalAmount: 0,
        discount: 0,
        tax: 0,
        finalAmount: 0,
        status: null,
        invoiceNumber: null,
        products: [],
      });
    } catch (error) {
      toast.error("Error creating sale");
    }
  };

  const filteredSales = useMemo(() => {
    if (!Array.isArray(sales)) {
      return [];
    }
    return sales.filter((sale) => {
      const invoiceNumber = sale.invoiceNumber ?? "";
      // You might want to add filtering by customer name or sales person name here

      const matchesSearch =
        invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "" ||
        sale.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [sales, searchTerm, statusFilter]);

  if (isLoading || isLoadingCustomers || isLoadingUsers) return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
        <Skeleton className="w-full md:w-1/2 h-10" />
        <Skeleton className="w-32 h-10" />
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

  if (isError) return <div>Error fetching data.</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales</h1>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          New Sale
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between mb-4">
        <Input
          placeholder="Search by Invoice Number..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2"
        />
        {/* Status Filter - You might need to get available statuses from API or define them */}
        <Select
          onValueChange={(val) => setStatusFilter(val === "all" ? "" : val)}
          value={statusFilter || "all"}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Select status" />
          </SelectTrigger>
          <SelectContent>
             {/* Add your sale status options here */}
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Completed">Completed</SelectItem>
            <SelectItem value="Cancelled">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <SaleTable data={filteredSales} />

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Sale</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 form-field">
                <label className="text-sm font-medium">Customer</label>
                <SearchableSelect
                  options={customers.map((c) => ({
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
                  options={users.map((user) => ({
                    value: user.id,
                    label: user.firstName && user.lastName ? `${user.firstName} ${user.lastName}` : user.email,
                  }))}
                  value={formData.salesPersonId}
                  onChange={(val) =>
                    setFormData((f) => ({ ...f, salesPersonId: val }))
                  }
                  placeholder="Select sales person"
                  emptyText="No user matched."
                  searchable={true}
                />
              </div>

              <div className="form-field">
                <label className="text-sm font-medium mb-1 block">Sale Date</label>
                 {/* Using DateTimePicker for saleDate */}
                  <DateTimePicker
                    value={formData.saleDate}
                    onChange={(val) =>
                      setFormData((prev) => ({ ...prev, saleDate: val || '' })) // Ensure it's a string
                    }
                    placeholder="Select date and time"
                  />
              </div>

              <div className="form-field">
                <label className="text-sm font-medium">Total Amount</label>
                <Input
                  type="number"
                  name="totalAmount"
                  value={formData.totalAmount ?? ''} // Use empty string for null/undefined
                  onChange={handleNumericFormChange}
                />
              </div>
              <div className="form-field">
                <label className="text-sm font-medium">Discount</label>
                 <Input
                  type="number"
                  name="discount"
                  value={formData.discount ?? ''} // Use empty string for null/undefined
                  onChange={handleNumericFormChange}
                />
              </div>
              <div className="form-field">
                <label className="text-sm font-medium">Tax</label>
                 <Input
                  type="number"
                  name="tax"
                  value={formData.tax ?? ''} // Use empty string for null/undefined
                  onChange={handleNumericFormChange}
                />
              </div>
               <div className="form-field">
                <label className="text-sm font-medium">Final Amount</label>
                 <Input
                  type="number"
                  name="finalAmount"
                  value={formData.finalAmount ?? ''} // Use empty string for null/undefined
                  onChange={handleNumericFormChange}
                />
              </div>
               <div className="form-field">
                <label className="text-sm font-medium">Status</label>
                 <Select
                  name="status"
                  value={formData.status || ''} // Use empty string for null/undefined
                  onValueChange={(value) =>
                    setFormData((prev) => ({ ...prev, status: value || null })) // Store as null if empty
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                    <SelectItem value="Cancelled">Cancelled</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="form-field">
                <label className="text-sm font-medium">Invoice Number</label>
                 <Input
                  type="text"
                  name="invoiceNumber"
                  value={formData.invoiceNumber ?? ''} // Use empty string for null/undefined
                  onChange={handleFormChange}
                />
              </div>
               {/* Add fields for products if needed in the create modal */}
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
                {createSale.isPending ? "Creating..." : "Create"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 