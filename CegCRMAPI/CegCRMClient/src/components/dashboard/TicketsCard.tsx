import {
  TicketIcon,
  CheckCircle2,
  Clock,
  AlertCircle,
  TrendingUp,
  Users,
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
import { Ticket } from "@/types/ticket";
import { TicketStatus } from "@/constants/enums";

interface TicketsCardProps {
  tickets: Ticket[];
  title?: string;
  description?: string;
  showResolutionRate?: boolean;
}

export function TicketsCard({
  tickets,
  title = "Support Tickets",
  description = "Ticket management overview",
  showResolutionRate = true,
}: TicketsCardProps) {
  // Null check for tickets array
  const safeTickets = tickets || [];

  const openTickets = safeTickets.filter(
    (ticket) => (ticket.status === TicketStatus.Open || ticket.status === "Open") && !ticket.assignedEmployeeId
  ).length;

  const resolvedByAITickets = safeTickets.filter(
    (ticket) => ticket.status === TicketStatus.ResolvedByAI || ticket.status === "ResolvedByAI"
  ).length;

  const closedTickets = safeTickets.filter(
    (ticket) => ticket.status === TicketStatus.Closed || ticket.status === "Closed"
  ).length;

  const assignedTickets = safeTickets.filter(
    (ticket) => (ticket.status === TicketStatus.Open || ticket.status === "Open") && ticket.assignedEmployeeId
  ).length;

  const totalTickets = safeTickets.length;
  const resolutionRate =
    totalTickets > 0 ? (closedTickets / totalTickets) * 100 : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1 min-w-0 flex-1">
          <CardTitle className="text-lg sm:text-xl lg:text-2xl font-bold truncate">{title}</CardTitle>
          <CardDescription className="text-xs sm:text-sm truncate">{description}</CardDescription>
        </div>
        <div className="rounded-full bg-primary/10 p-1.5 sm:p-2 flex-shrink-0">
          <TicketIcon className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent className="p-3 sm:p-6">
        <div className="grid gap-3 sm:gap-4">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4">
            <div className="flex flex-col space-y-1 sm:space-y-1.5 rounded-lg border p-2 sm:p-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4 text-yellow-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                  Open
                </span>
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{openTickets}</div>
            </div>
            <div className="flex flex-col space-y-1 sm:space-y-1.5 rounded-lg border p-2 sm:p-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <Users className="h-3 w-3 sm:h-4 sm:w-4 text-blue-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                  Assigned
                </span>
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{assignedTickets}</div>
            </div>
            <div className="flex flex-col space-y-1 sm:space-y-1.5 rounded-lg border p-2 sm:p-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-500 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                  AI Resolved
                </span>
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{resolvedByAITickets}</div>
            </div>
            <div className="flex flex-col space-y-1 sm:space-y-1.5 rounded-lg border p-2 sm:p-3">
              <div className="flex items-center space-x-1 sm:space-x-2">
                <CheckCircle2 className="h-3 w-3 sm:h-4 sm:w-4 text-green-600 flex-shrink-0" />
                <span className="text-xs sm:text-sm font-medium text-muted-foreground truncate">
                  Closed
                </span>
              </div>
              <div className="text-lg sm:text-xl lg:text-2xl font-bold">{closedTickets}</div>
            </div>
          </div>

          {showResolutionRate && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 text-primary flex-shrink-0" />
                  <span className="text-xs sm:text-sm font-medium truncate">Resolution Rate</span>
                </div>
                <Badge variant="secondary" className="flex items-center gap-1 text-xs">
                  <Clock className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                  {resolutionRate.toFixed(1)}%
                </Badge>
              </div>
              <Progress value={resolutionRate} className="h-1.5 sm:h-2" />
            </div>
          )}

          <div className="rounded-lg border p-2 sm:p-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium truncate">Total Tickets</p>
                <p className="text-lg sm:text-xl lg:text-2xl font-bold">{totalTickets}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-1.5 sm:p-2 flex-shrink-0">
                <TicketIcon className="h-3 w-3 sm:h-4 sm:w-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
