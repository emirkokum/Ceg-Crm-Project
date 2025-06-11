import { useEffect, useState } from "react";
import { 
  TicketIcon, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  TrendingUp,
  Users
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getAllTickets } from "@/api/ticket";
import { Ticket } from "@/types/ticket";
import { Progress } from "@/components/ui/progress";

export function TicketsCard() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await getAllTickets();
        if (response.data?.success) {
          setTickets(response.data.data || []);
        }
      } catch (error) {
        console.error("Error fetching tickets:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTickets();
  }, []);

  const openTickets = tickets.filter(ticket => ticket.status === "Open").length;
  const resolvedTickets = tickets.filter(ticket => ticket.status === "ResolvedByAI").length;
  const assignedTickets = tickets.filter(ticket => ticket.status === "AssignedToEmployee").length;
  const totalTickets = tickets.length;
  const resolutionRate = totalTickets > 0 ? (resolvedTickets / totalTickets) * 100 : 0;

  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <div className="space-y-1">
          <CardTitle className="text-2xl font-bold">Support Tickets</CardTitle>
          <CardDescription>Ticket management overview</CardDescription>
        </div>
        <div className="rounded-full bg-primary/10 p-2">
          <TicketIcon className="h-6 w-6 text-primary" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="flex flex-col space-y-1.5 rounded-lg border p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-yellow-500" />
                <span className="text-sm font-medium text-muted-foreground">Open</span>
              </div>
              <div className="text-2xl font-bold">{openTickets}</div>
            </div>
            <div className="flex flex-col space-y-1.5 rounded-lg border p-3">
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium text-muted-foreground">Assigned</span>
              </div>
              <div className="text-2xl font-bold">{assignedTickets}</div>
            </div>
            <div className="flex flex-col space-y-1.5 rounded-lg border p-3">
              <div className="flex items-center space-x-2">
                <CheckCircle2 className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium text-muted-foreground">Resolved</span>
              </div>
              <div className="text-2xl font-bold">{resolvedTickets}</div>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                <span className="text-sm font-medium">Resolution Rate</span>
              </div>
              <Badge variant="secondary" className="flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {resolutionRate.toFixed(1)}%
              </Badge>
            </div>
            <Progress value={resolutionRate} className="h-2" />
          </div>

          <div className="rounded-lg border p-3">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-sm font-medium">Total Tickets</p>
                <p className="text-2xl font-bold">{totalTickets}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-2">
                <TicketIcon className="h-4 w-4 text-primary" />
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
} 