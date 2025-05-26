import { useState, useMemo } from "react";
import CustomerTable from "../components/CustomerTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddCustomerModal from "../components/AddCustomerModal";
import { toast } from "sonner";
import { useCustomers } from "@/features/hooks/userCustomerApi";
import { Customer } from "@/types/customer";
import { Skeleton } from "@/components/ui/skeleton";

export default function CustomerList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("");

  const { data: customers, isLoading, isError } = useCustomers();

  const filteredCustomers = useMemo(() => {
    if (!Array.isArray(customers)) {
      return [];
    }
    return customers.filter((customer: Customer) => {
      const name = customer.fullName ?? "";
      const email = customer.email ?? "";

      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSegment =
        segmentFilter === "" ||
        customer.type === segmentFilter;

      return matchesSearch && matchesSegment;
    });
  }, [customers, searchTerm, segmentFilter]);

  const handleAddCustomer = (newCustomer: any) => {
    toast.success("New customer added");
  };

  if (isLoading) return (
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
        <h1 className="text-2xl font-bold">Customers</h1>
        <AddCustomerModal onAddCustomer={handleAddCustomer} />
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
        <Input
          placeholder="Search (name or email)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2"
        />
        <Select
          onValueChange={(val) => setSegmentFilter(val === "all" ? "" : val)}
          value={segmentFilter || "all"}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Select segment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All</SelectItem>
            <SelectItem value="VIP">VIP</SelectItem>
            <SelectItem value="Potansiyel">Potential</SelectItem>
            <SelectItem value="Pasif">Passive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CustomerTable data={filteredCustomers} />
    </div>
  );
}
