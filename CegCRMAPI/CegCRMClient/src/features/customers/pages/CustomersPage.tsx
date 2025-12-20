import { useState, useMemo } from "react";
import CustomerTable from "../components/CustomerTable";
import { Input } from "@/components/ui/input";
import AddCustomerModal from "../components/AddCustomerModal";
import { toast } from "sonner";
import { useCustomers } from "@/features/hooks/userCustomerApi";
import { Customer } from "@/types/customer";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EnumSelect } from "@/components/EnumSelect";
import { CustomerType } from "@/constants/enums";

const customerTypeOptions = [
  { value: CustomerType.Person, label: "Person" },
  { value: CustomerType.Business, label: "Business" },
];

export default function CustomerList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [typeFilter, setTypeFilter] = useState<number | null>(null);

  const { data: customers, isLoading, isError } = useCustomers();

  const filteredCustomers = useMemo(() => {
    if (!Array.isArray(customers)) return [];
    
    return customers.filter((customer: Customer) => {
      const name = customer.fullName ?? "";
      const email = customer.email ?? "";
      const phone = customer.phone ?? "";

      const matchesSearch =
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        phone.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesType = typeFilter === null || customer.type === typeFilter;

      return matchesSearch && matchesType;
    });
  }, [customers, searchTerm, typeFilter]);

  const handleExport = () => {
    toast.info("Export functionality coming soon!");
  };

  if (isLoading) return (
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
          <Users className="h-6 w-6" />
          <h1 className="text-2xl font-bold">Customers</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <AddCustomerModal onAddCustomer={() => {}} />
        </div>
      </div>

      <Card>
        <CardContent className="px-10 py-5">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search (name, email or phone)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <EnumSelect
                options={[
                  { value: 0, label: "All" },
                  ...customerTypeOptions
                ]}
                value={typeFilter ?? 0}
                onValueChange={(value) => setTypeFilter(value === 0 ? null : value)}
                placeholder="Filter by type"
              />
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="w-full md:w-[180px]">
                    Sort By
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSortBy("name")}>
                    Name
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSortBy("email")}>
                    Email
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-10 py-5">
          <CustomerTable data={filteredCustomers} />
        </CardContent>
      </Card>
    </div>
  );
}
