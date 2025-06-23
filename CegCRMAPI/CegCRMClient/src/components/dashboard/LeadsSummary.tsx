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

  const newLeads = leads.filter((lead: Lead) => lead.status === newStatusId).length;
  const convertedLeads = leads.filter((lead: Lead) => lead.status === convertedStatusId).length;
  const conversionRate = leads.length > 0 ? (convertedLeads / leads.length) * 100 : 0;

  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Lead Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
            <div className="h-10 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold">Lead Overview</CardTitle>
          <CardDescription>Lead conversion metrics</CardDescription>
        </div>
        <div className="rounded-full bg-primary/10 p-2">
          <Users className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col space-y-1.5 rounded-lg border p-3">
              <div className="flex items-center space-x-2">
                <UserPlus className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-muted-foreground">New Leads</span>
              </div>
              <div className="text-2xl font-bold">{newLeads}</div>
            </div>
            <div className="flex flex-col space-y-1.5 rounded-lg border p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-muted-foreground">Converted</span>
              </div>
              <div className="text-2xl font-bold">{convertedLeads}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Conversion Rate</span>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                {conversionRate.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={conversionRate} className="h-2" />
          </div>

          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Total Leads</p>
                <p className="text-2xl font-bold">{leads.length}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <Users className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 