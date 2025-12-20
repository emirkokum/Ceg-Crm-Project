import { 
  Users, 
  TrendingUp, 
  UserPlus, 
  CheckCircle2,
  AlertCircle
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useLeads } from "@/features/hooks/useLeadApi";
import { useEnum } from "@/features/hooks/useEnums";
import { Lead } from "@/types/lead";

export function LeadsSummary() {
  const { data: leads = [], isLoading } = useLeads();
  const { data: leadStatusOptions } = useEnum("lead-status");

  // Find status IDs for "New" and "Converted" from enum options
  const newStatusId = leadStatusOptions?.find(status => status.label.toLowerCase() === "new")?.value;
  const convertedStatusId = leadStatusOptions?.find(status => status.label.toLowerCase() === "converted")?.value;

  // Null check for leads array
  const safeLeads = leads || [];
  
  const newLeads = safeLeads.filter((lead: Lead) => lead.status === newStatusId).length;
  const convertedLeads = safeLeads.filter((lead: Lead) => lead.status === convertedStatusId).length;
  const conversionRate = safeLeads.length > 0 ? (convertedLeads / safeLeads.length) * 100 : 0;

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold">Lead Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-3 sm:space-y-4">
            <div className="h-8 sm:h-10 bg-muted rounded" />
            <div className="h-8 sm:h-10 bg-muted rounded" />
            <div className="h-8 sm:h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1 min-w-0 flex-1">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold truncate">Lead Overview</CardTitle>
          <CardDescription className="text-xs sm:text-sm truncate">Lead conversion metrics</CardDescription>
        </div>
        <div className="rounded-full bg-primary/10 p-1.5 sm:p-2 flex-shrink-0">
          <Users className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="grid gap-3 sm:gap-4">
          <div className="grid grid-cols-2 gap-2 sm:gap-4">
            <div className="flex flex-col space-y-1 sm:space-y-1.5 rounded-lg border p-2 sm:p-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <UserPlus className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">New Leads</span>
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{newLeads}</div>
            </div>
            <div className="flex flex-col space-y-1 sm:space-y-1.5 rounded-lg border p-2 sm:p-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">Converted</span>
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{convertedLeads}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium truncate">Conversion Rate</span>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                <AlertCircle className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                {conversionRate.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={conversionRate} className="h-1.5 sm:h-2" />
          </div>

          <div className="rounded-lg border p-2 sm:p-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium truncate">Total Leads</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{safeLeads.length}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-1.5 sm:p-2 flex-shrink-0">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 