import { useState } from "react";
import customers from "../data/customers.json";
import CustomerTable from "../components/CustomerTable";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CustomerList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [segmentFilter, setSegmentFilter] = useState("");

  const filteredCustomers = customers.filter((customer) => {
    const matchesSearch =
      customer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      customer.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesSegment =
      segmentFilter === "" || customer.segment === segmentFilter;

    return matchesSearch && matchesSegment;
  });

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
        <Input
          placeholder="Ara (isim veya e-posta)"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full md:w-1/2"
        />
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
