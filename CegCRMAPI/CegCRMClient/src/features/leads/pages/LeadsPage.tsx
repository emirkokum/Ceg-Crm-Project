import { useState, useMemo } from "react";
import { LeadTable } from "../components/LeadTable";
import { Input } from "@/components/ui/input";
import { useLeads } from "@/features/hooks/useLeadApi";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Search, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AddLeadModal } from "../components/AddLeadModal";
import { EnumSelect } from "@/components/EnumSelect";
import { useEnum } from "@/features/hooks/useEnums";
import { toast } from "sonner";

export function LeadsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<number | null>(null);

  const { data: leads, isLoading, isError } = useLeads();
  const { data: leadStatusOptions } = useEnum("lead-status");

  const filteredLeads = useMemo(() => {
    if (!Array.isArray(leads)) {
      return [];
    }
    return leads.filter((lead) => {
      const companyName = lead.companyName ?? "";
      const contactName = lead.contactName ?? "";
      const email = lead.email ?? "";

      const matchesSearch =
        companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        contactName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        email.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === null ||
        lead.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [leads, searchTerm, statusFilter]);

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
          <h1 className="text-2xl font-bold">Leads</h1>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <AddLeadModal onAddLead={() => {}} />
        </div>
      </div>

      <Card>
        <CardContent className="px-10 py-5">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
            <div className="relative w-full md:w-1/2">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search (company, contact or email)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <EnumSelect
                options={[
                  { value: 0, label: "All" },
                  ...(leadStatusOptions || [])
                ]}
                value={statusFilter ?? 0}
                onValueChange={(value) => setStatusFilter(value === 0 ? null : value)}
                placeholder="Filter by status"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="px-10 py-5">
          <LeadTable data={filteredLeads} />
        </CardContent>
      </Card>
    </div>
  );
} 