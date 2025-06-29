import { useParams, useNavigate } from "react-router-dom";
import { useTicket, useUpdateTicketWithSolution, useAssignRandomEmployee, useUpdateTicketStatus } from "@/features/hooks/useTicketApi";
import { useEmployees } from "@/features/hooks/useEmployeeApi";
import { useAuth } from "@/contexts/AuthContext";
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
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, XCircle, Loader2, ArrowLeft, AlertCircle } from "lucide-react";
import { TicketStatus } from "@/constants/enums";
import { useState } from "react";

export default function TicketDetailPage() {
  const { ticketId } = useParams<{ ticketId: string }>();
  const navigate = useNavigate();
  const { userInfo } = useAuth();
  
  const [finalSolutionText, setFinalSolutionText] = useState("");
  const [showFinalSolutionInput, setShowFinalSolutionInput] = useState(false);
  
  const { data: ticket, isLoading, error } = useTicket(ticketId || "");
  const { data: employees = [] } = useEmployees();
  const updateTicketWithSolution = useUpdateTicketWithSolution();
  const assignToSupport = useAssignRandomEmployee();
  const updateTicketStatus = useUpdateTicketStatus();

  const handleSolutionWorked = async () => {
    if (!ticket) return;
    
    try {
      await updateTicketStatus.mutateAsync({
        ticketId: ticket.id,
        newStatus: TicketStatus.Closed
      });
      toast.success("Ticket marked as resolved");
    } catch (error) {
      console.error("Error marking ticket as resolved:", error);
      toast.error("Error marking ticket as resolved");
    }
  };

  const handleDidntWork = async () => {
    if (!ticket) return;
    
    try {
      // First assign random employee
      await assignToSupport.mutateAsync(ticket.id);
      
      // Then update status to AssignedToEmployee
      await updateTicketStatus.mutateAsync({
        ticketId: ticket.id,
        newStatus: TicketStatus.AssignedToEmployee
      });
      
      setShowFinalSolutionInput(true);
      toast.success("Ticket assigned to support team");
    } catch (error: any) {
      console.error("Error assigning ticket to support:", error);
      toast.error("Error assigning ticket to support team: " + (error.response?.data?.message || error.message));
    }
  };

  const handleSubmitFinalSolution = async () => {
    if (!ticket || !finalSolutionText.trim()) return;
    
    try {
      await updateTicketWithSolution.mutateAsync({
        id: ticket.id,
        data: {
          status: TicketStatus.Closed,
          finalSolution: finalSolutionText.trim()
        }
      });
      
      // Reset state immediately for UI responsiveness
      setShowFinalSolutionInput(false);
      setFinalSolutionText("");
      
      toast.success("Final solution submitted and ticket closed");
    } catch (error) {
      console.error("Error submitting final solution:", error);
      toast.error("Error submitting final solution");
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

  const isLoadingActions = updateTicketWithSolution.isPending || assignToSupport.isPending || updateTicketStatus.isPending;

  // Find current user's employee record
  const currentUserEmployee = employees.find(emp => emp.user.id === userInfo?.id);
  const isAssignedEmployee = ticket?.assignedEmployeeId === currentUserEmployee?.id;

  const shouldShowActionButtons = ticket && 
    (ticket.status === TicketStatus.ResolvedByAI || ticket.status === 'ResolvedByAI') &&
    !ticket.finalSolution &&
    !showFinalSolutionInput;

  // Show input if ticket is assigned to employee and current user is the assigned employee
  const shouldShowFinalSolutionInput = ticket && 
    isAssignedEmployee && 
    (ticket.status === TicketStatus.AssignedToEmployee || ticket.status === 'AssignedToEmployee') &&
    !ticket.finalSolution;
  

  


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
            onClick={() => navigate("/")}
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
              onClick={() => navigate("/")}
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
          onClick={() => navigate("/")}
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

        {/* Assigned Employee */}
        {ticket.assignedEmployee && (
          <Card>
            <CardHeader>
              <CardTitle>Assigned Employee</CardTitle>
              <CardDescription>
                Support team member handling this ticket
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4">
                <div className="bg-primary/10 rounded-full p-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {ticket.assignedEmployee.user.firstName} {ticket.assignedEmployee.user.lastName}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {ticket.assignedEmployee.user.email}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Employee #{ticket.assignedEmployee.employeeNumber}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

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
        {shouldShowActionButtons && (
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
                  {updateTicketStatus.isPending ? (
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

        

        {/* Final Solution Input - Only show for assigned employee */}
        {shouldShowFinalSolutionInput && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <AlertCircle className="h-5 w-5" />
                Final Solution Input
              </CardTitle>
              <CardDescription className="text-orange-700">
                Enter your final solution for this ticket and close it.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Textarea
                  placeholder="Enter your final solution here..."
                  value={finalSolutionText}
                  onChange={(e) => setFinalSolutionText(e.target.value)}
                  className="min-h-[100px] text-black placeholder:text-gray-500"
                />
                <Button
                  onClick={handleSubmitFinalSolution}
                  disabled={!finalSolutionText.trim() || updateTicketWithSolution.isPending}
                  className="w-full bg-orange-600 hover:bg-orange-700"
                >
                  {updateTicketWithSolution.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Submit Final Solution
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