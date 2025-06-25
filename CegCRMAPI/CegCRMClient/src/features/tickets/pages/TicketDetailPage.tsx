import { useParams, useNavigate } from "react-router-dom";
import { useTicket, useUpdateTicketStatus, useAssignRandomEmployee } from "@/features/hooks/useTicketApi";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { CheckCircle, XCircle, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { TicketStatus } from "@/constants/enums";

export default function TicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  
  const { data: ticket, isLoading, error } = useTicket(ticketId || "");
  const updateStatus = useUpdateTicketStatus();
  const assignToSupport = useAssignRandomEmployee();

  const handleSolutionWorked = async () => {
    if (!ticket) return;
    
    try {
      await updateStatus.mutateAsync({
        ticketId: ticket.id,
        newStatus: TicketStatus.Closed
      });
      toast.success("Ticket marked as resolved");
      navigate("/tickets/create");
    } catch (error) {
      console.error("Error marking ticket as resolved:", error);
      toast.error("Error marking ticket as resolved");
    }
  };

  const handleDidntWork = async () => {
    if (!ticket) return;
    
    try {
      await assignToSupport.mutateAsync(ticket.id);
      toast.success("Ticket assigned to support team");
      navigate("/tickets/create");
    } catch (error) {
      console.error("Error assigning ticket to support:", error);
      toast.error("Error assigning ticket to support team");
    }
  };

  const getStatusColor = (status: number | string) => {
    if (typeof status === 'string') {
      switch (status) {
        case 'Open':
          return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
        case 'ResolvedByAI':
          return "bg-green-100 text-green-800 hover:bg-yellow-100";
        case 'AssignedToEmployee':
          return "bg-blue-100 text-blue-800 hover:bg-yellow-100";
        case 'Closed':
          return "bg-gray-100 text-gray-800 hover:bg-yellow-100";
        default:
          return "bg-gray-100 text-gray-800 hover:bg-yellow-100";
      }
    }

    switch (status) {
      case TicketStatus.Open:
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-100";
      case TicketStatus.ResolvedByAI:
        return "bg-green-100 text-green-800 hover:bg-yellow-100";
      case TicketStatus.AssignedToEmployee:
        return "bg-blue-100 text-blue-800 hover:bg-yellow-100";
      case TicketStatus.Closed:
        return "bg-gray-100 text-gray-800 hover:bg-yellow-100";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-yellow-100";
    }
  };

  const getStatusLabel = (status: number | string) => {
    if (typeof status === 'string') {
      switch (status) {
        case 'Open':
          return "Open";
        case 'ResolvedByAI':
          return "Resolved by AI";
        case 'AssignedToEmployee':
          return "Assigned to Employee";
        case 'Closed':
          return "Closed";
        default:
          return "Unknown";
      }
    }

    switch (status) {
      case TicketStatus.Open:
        return "Open";
      case TicketStatus.ResolvedByAI:
        return "Resolved by AI";
      case TicketStatus.AssignedToEmployee:
        return "Assigned to Employee";
      case TicketStatus.Closed:
        return "Closed";
      default:
        return "Unknown";
    }
  };

  const isLoadingActions = updateStatus.isPending || assignToSupport.isPending;

  if (isLoading) {
    return (
      <div className="container mx-auto py-10 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="h-8 w-8" />
          <Skeleton className="h-8 w-48" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32 mb-2" />
            <Skeleton className="h-4 w-64" />
          </CardHeader>
          <CardContent className="space-y-4">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !ticket) {
    return (
      <div className="container mx-auto py-10 max-w-4xl">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate("/tickets/create")}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Tickets
          </Button>
        </div>
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <AlertCircle className="h-12 w-12 text-red-500 mb-4" />
            <h2 className="text-xl font-semibold mb-2">Ticket Not Found</h2>
            <p className="text-muted-foreground text-center">
              The ticket you're looking for doesn't exist or you don't have permission to view it.
            </p>
            <Button
              onClick={() => navigate("/tickets/create")}
              className="mt-4"
            >
              Back to Tickets
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 max-w-4xl">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button
          variant="ghost"
          onClick={() => navigate("/tickets/create")}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Tickets
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Ticket #{ticket.id.slice(0, 8)}</h1>
          <p className="text-muted-foreground">Support Ticket Details</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Ticket Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              Status
              <Badge variant="secondary" className={getStatusColor(ticket.status)}>
                {getStatusLabel(ticket.status)}
              </Badge>
            </CardTitle>
          </CardHeader>
        </Card>

        {/* Ticket Description */}
        <Card>
          <CardHeader>
            <CardTitle>Issue Description</CardTitle>
            <CardDescription>
              Details about the reported issue
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="prose prose-sm max-w-none">
              <p className="whitespace-pre-wrap">{ticket.description}</p>
            </div>
          </CardContent>
        </Card>

        {/* AI Suggested Solution */}
        {ticket.aiSuggestedSolution && (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <CheckCircle className="h-5 w-5" />
                AI Suggested Solution
              </CardTitle>
              <CardDescription className="text-green-700">
                Here's what our AI system suggests to resolve your issue:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-green-800 whitespace-pre-wrap">
                  {ticket.aiSuggestedSolution}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Final Solution */}
        {ticket.finalSolution && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <CheckCircle className="h-5 w-5" />
                Final Solution
              </CardTitle>
              <CardDescription className="text-blue-700">
                The final solution provided by our support team:
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <p className="text-blue-800 whitespace-pre-wrap">
                  {ticket.finalSolution}
                </p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons - Only show if ticket is resolved by AI */}
        {(ticket.status === TicketStatus.ResolvedByAI || ticket.status === 'ResolvedByAI') && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Did this solution work for you?</CardTitle>
              <CardDescription>
                Let us know if the solution resolved your issue or if you need additional assistance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col sm:flex-row gap-3">
                <Button
                  onClick={handleSolutionWorked}
                  disabled={isLoadingActions}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                >
                  {updateStatus.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Solution Worked
                    </>
                  )}
                </Button>
                <Button
                  onClick={handleDidntWork}
                  disabled={isLoadingActions}
                  variant="outline"
                  className="flex-1"
                >
                  {assignToSupport.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <XCircle className="mr-2 h-4 w-4" />
                      Didn't Work
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
} 