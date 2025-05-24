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
        customer.segment === segmentFilter ||
        customer.type === segmentFilter;

      return matchesSearch && matchesSegment;
    });
  }, [customers, searchTerm, segmentFilter]);

  const handleAddCustomer = (newCustomer: any) => {
    toast.success("Yeni müşteri eklendi");
  };

  if (isLoading) return <div>Yükleniyor...</div>;
  if (isError) return <div>Veri alınırken hata oluştu.</div>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
        <Input
          placeholder="Ara (isim veya e-posta)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2"
        />
        <AddCustomerModal onAddCustomer={handleAddCustomer} />
      </div>
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
        <Select
          onValueChange={(val) => setSegmentFilter(val === "all" ? "" : val)}
          value={segmentFilter || "all"}
        >
          <SelectTrigger className="w-full md:w-48">
            <SelectValue placeholder="Segment seç" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tümü</SelectItem>
            <SelectItem value="VIP">VIP</SelectItem>
            <SelectItem value="Potansiyel">Potansiyel</SelectItem>
            <SelectItem value="Pasif">Pasif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <CustomerTable data={filteredCustomers} />
    </div>
  );
}
